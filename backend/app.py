from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import json
import os
from database import Database
from werkzeug.utils import secure_filename
import cv2
import base64

app = Flask(__name__, static_folder='../frontend/dist')
CORS(app)  # Enable CORS for all routes

# Configure upload folders
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
PARTICIPANT_PHOTOS = os.path.join(UPLOAD_FOLDER, 'participants')
PRIZE_PHOTOS = os.path.join(UPLOAD_FOLDER, 'prizes')

# Create upload directories if they don't exist
os.makedirs(PARTICIPANT_PHOTOS, exist_ok=True)
os.makedirs(PRIZE_PHOTOS, exist_ok=True)

# Configure allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# List of safari animals with their emojis
SAFARI_ANIMALS = [
    "🦁", "🐘", "🦒", "🦏", "🦓", "🐆", "🦬", "🦘", "🦊", "🦅", "🦍", "🦛", 
    "🐪", "🦃", "🦜", "🐊", "🐅", "🐆", "🐒", "🐧", "🐻", "🐺", "🐗", "🐿️", 
    "🦔", "🦇", "🐉", "🐲", "🐍", "🦎", "🐢", "🐠", "🐡", "🐬", "🐳", "🐋", 
    "🦈", "🐙", "🦀", "🦐", "🦑", "🐚", "🐌", "🐛", "🐜", "🐝", "🦋", "🐞", "🐢"
]

# Store settings
settings = {
    'auto_prize_selection': True,
    'allow_multiple_wins': True,
}

# Initialize database
db = Database()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, folder):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to filename to avoid conflicts
        base, ext = os.path.splitext(filename)
        filename = f"{base}_{random.randint(1000, 9999)}{ext}"
        filepath = os.path.join(folder, filename)
        file.save(filepath)
        return filename
    return None

def process_base64_image(base64_string, folder):
    try:
        # Remove header if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64 string
        img_data = base64.b64decode(base64_string)
        
        # Generate random filename
        filename = f"image_{random.randint(1000, 9999)}.jpg"
        filepath = os.path.join(folder, filename)
        
        # Save the image
        with open(filepath, 'wb') as f:
            f.write(img_data)
            
        return filename
    except Exception as e:
        print(f"Error processing base64 image: {e}")
        return None

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory('frontend/dist', 'index.html')

@app.route('/api/uploads/participants/<path:filename>')
def serve_participant_photo(filename):
    return send_from_directory(PARTICIPANT_PHOTOS, filename)

@app.route('/api/uploads/prizes/<path:filename>')
def serve_prize_photo(filename):
    return send_from_directory(PRIZE_PHOTOS, filename)

@app.route('/api/settings', methods=['GET', 'POST'])
def handle_settings():
    if request.method == 'POST':
        data = request.json
        db.update_settings(data)
        settings.update(data)        
        return jsonify({
            'status': 'success',
            'settings': settings
        })
    settings.update(db.get_settings())  
    return jsonify(settings)

@app.route('/api/add_participant', methods=['POST'])
def add_participant():
    name = request.form.get('name')
    tickets = int(request.form.get('tickets', 1))
    photo = request.form.get('photo')  # Base64 image from webcam
    
    if not name or tickets < 1:
        return jsonify({
            'status': 'error',
            'message': 'Invalid input data'
        }), 400
    
    photo_path = None
    if photo:
        filename = process_base64_image(photo, PARTICIPANT_PHOTOS)
        if filename:
            photo_path = f"/api/uploads/participants/{filename}"
    
    animal = random.choice(SAFARI_ANIMALS)
    participant = db.add_participant(name, tickets, animal, photo_path)
    
    return jsonify({
        'status': 'success',
        'message': f'Added {name} with {tickets} tickets',
        'participant': participant
    })

@app.route('/api/edit_participant', methods=['POST'])
def edit_participant():
    participant_id = int(request.form.get('id'))
    name = request.form.get('name')
    tickets = request.form.get('tickets')
    photo = request.form.get('photo')  # Base64 image from webcam
    
    if not participant_id or not name:
        return jsonify({
            'status': 'error',
            'message': 'Invalid input data'
        }), 400
    
    try:
        update_data = {'name': name}
        
        if tickets:
            tickets = int(tickets)
            if tickets < 1:
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid ticket count'
                }), 400
            update_data['tickets'] = tickets
        
        if photo:
            filename = process_base64_image(photo, PARTICIPANT_PHOTOS)
            if filename:
                update_data['photo_path'] = f"/api/uploads/participants/{filename}"
        
        participant = db.update_participant(participant_id, **update_data)
        return jsonify({
            'status': 'success',
            'message': f'Updated participant successfully',
            'participant': participant
        })
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 404

@app.route('/api/delete_participant', methods=['POST'])
def delete_participant():
    data = request.json
    participant_id = int(data.get('id'))
    
    try:
        # Get participant to find photo path
        participant = db.get_participant(participant_id)
        if participant and participant.get('photo_path'):
            # Extract filename from path
            filename = os.path.basename(participant['photo_path'])
            photo_path = os.path.join(PARTICIPANT_PHOTOS, filename)
            # Delete photo file if it exists
            if os.path.exists(photo_path):
                os.remove(photo_path)
        
        db.delete_participant(participant_id)
        return jsonify({
            'status': 'success',
            'message': 'Participant deleted successfully'
        })
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 404

@app.route('/api/remove_prize', methods=['POST'])
def remove_prize():
    data = request.json
    participant_id = int(data.get('participant_id'))
    prize_index = int(data.get('prize_index'))
    
    try:
        db.remove_prize(participant_id, prize_index)
        return jsonify({
            'status': 'success',
            'message': 'Prize removed successfully'
        })
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 404

@app.route('/api/prizes', methods=['GET', 'POST', 'DELETE', 'PUT'])
def manage_prizes():
    if request.method == 'GET':
        return jsonify(db.get_prizes())
        
    elif request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        quantity = int(request.form.get('quantity', 1))
        photo = request.files.get('photo')
        
        if not name:
            return jsonify({
                'status': 'error',
                'message': 'Prize name is required'
            }), 400
            
        try:
            photo_path = None
            if photo:
                filename = save_uploaded_file(photo, PRIZE_PHOTOS)
                if filename:
                    photo_path = f"/api/uploads/prizes/{filename}"
            
            prize = db.add_prize_to_pool(name, description, photo_path, quantity)
            return jsonify({
                'status': 'success',
                'message': 'Prize added successfully',
                'prize': prize
            })
        except ValueError as e:
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 400
            
    elif request.method == 'PUT':
        prize_id = int(request.form.get('id'))
        name = request.form.get('name')
        description = request.form.get('description')
        quantity = request.form.get('quantity')
        photo = request.files.get('photo')
        
        try:
            update_data = {}
            if name:
                update_data['name'] = name
            if description:
                update_data['description'] = description
            if quantity:
                update_data['quantity'] = int(quantity)
            
            if photo:
                filename = save_uploaded_file(photo, PRIZE_PHOTOS)
                if filename:
                    update_data['photo_path'] = f"/api/uploads/prizes/{filename}"
            
            prize = db.update_prize(prize_id, **update_data)
            return jsonify({
                'status': 'success',
                'message': 'Prize updated successfully',
                'prize': prize
            })
        except ValueError as e:
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 400
            
    elif request.method == 'DELETE':
        data = request.json
        prize_id = int(data.get('prize_id'))
        
        try:
            # Get prize to find photo path
            prizes = db.get_prizes()
            prize = next((p for p in prizes if int(p['id']) == prize_id), None)
            if prize and prize.get('photo_path'):
                # Extract filename from path
                filename = os.path.basename(prize['photo_path'])
                photo_path = os.path.join(PRIZE_PHOTOS, filename)
                # Delete photo file if it exists
                if os.path.exists(photo_path):
                    os.remove(photo_path)
            
            db.remove_prize_from_pool(prize_id)
            return jsonify({
                'status': 'success',
                'message': 'Prize removed successfully'
            })
        except ValueError as e:
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 400

@app.route('/api/pick_winner', methods=['POST'])
def pick_winner():
    participants = db.get_participants()
    if not participants:
        return jsonify({
            'status': 'error',
            'message': 'No participants in the raffle'
        }), 400
    
    data = request.json
    prize_id = int(data.get('prize_id')) if data.get('prize_id') else None
    auto_select = data.get('auto_select', False)
    settings = db.get_settings()
    
    # If auto prize selection is enabled or explicitly requested
    if auto_select:
        # Get available prizes with remaining quantity
        available_prizes = [p for p in db.get_prizes() if p['remaining'] > 0]
        if not available_prizes:
            return jsonify({
                'status': 'error',
                'message': 'No prizes available'
            }), 400
        # Randomly select a prize
        selected_prize = random.choice(available_prizes)
        prize_id = int(selected_prize['id'])
    elif not prize_id:
        return jsonify({
            'status': 'error',
            'message': 'Prize ID is required when auto selection is disabled'
        }), 400
    
    # Filter out participants who have won maximum prizes
    eligible_participants = []
    for participant in participants:
        if settings.get('allow_multiple_wins', False):
            # Can win up to their ticket count
            if len(participant['prizes']) < participant['tickets']:
                eligible_participants.append(participant)
        else:
            # Can only win once
            if len(participant['prizes']) == 0:
                eligible_participants.append(participant)
    
    if not eligible_participants:
        return jsonify({
            'status': 'error',
            'message': 'No eligible participants for this draw'
        }), 400
    
    weighted_participants = []
    if not settings.get('allow_multiple_wins', False):
        # Weight participants by their remaining tickets
        for participant in eligible_participants:
            remaining_tickets = participant['tickets'] - len(participant['prizes'])
            weighted_participants.extend([participant] * remaining_tickets)
    else:
        weighted_participants = eligible_participants
 
    print(f"Weighted participants: {len(weighted_participants)}")
    winner = random.choice(weighted_participants)
    
    try:
        # Add prize to winner
        db.add_prize(int(winner['id']), prize_id)
        
        # Get updated winner data and prize details
        updated_winner = db.get_participant(int(winner['id']))
        prizes = db.get_prizes()
        won_prize = next((p for p in prizes if int(p['id']) == prize_id), None)
        
        return jsonify({
            'status': 'success',
            'winner': winner['name'],
            'tickets': winner['tickets'],
            'animal': winner['animal'],
            'photo': winner.get('photo_path'),
            'prize': won_prize['name'] if won_prize else None,
            'prize_photo': won_prize.get('photo_path') if won_prize else None
        })
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/api/clear_prizes', methods=['POST'])
def clear_prizes():
    db.clear_prizes()
    return jsonify({
        'status': 'success',
        'message': 'All prizes cleared'
    })

@app.route('/api/clear_all_data', methods=['POST'])
def clear_all_data():
    # Delete all photos
    for file in os.listdir(PARTICIPANT_PHOTOS):
        os.remove(os.path.join(PARTICIPANT_PHOTOS, file))
    for file in os.listdir(PRIZE_PHOTOS):
        os.remove(os.path.join(PRIZE_PHOTOS, file))
        
    db.clear_all_data()
    return jsonify({
        'status': 'success',
        'message': 'All data cleared'
    })

@app.route('/api/get_participants', methods=['GET'])
def get_participants():
    """Endpoint to get all participants"""  
    participants = db.get_participants()
    # Sort participants: those with remaining wins/tickets first
    def has_remaining_wins(p):
        if settings.get('allow_multiple_wins', False):
            return (p['tickets'] - len(p['prizes'])) > 0
        else:
            return len(p['prizes']) == 0

    participants = sorted(participants, key=has_remaining_wins, reverse=True)

    return jsonify(participants)

if __name__ == '__main__':
    app.run(debug=True)