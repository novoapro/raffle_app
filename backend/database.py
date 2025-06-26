import sqlite3
from contextlib import contextmanager
from typing import List, Dict, Any, Optional
import json

class Database:
    def __init__(self, db_path: str = 'raffle.db'):
        self.db_path = db_path
        self.init_db()

    @contextmanager
    def get_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()

    def init_db(self):
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            # Create participants table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS participants (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    tickets INTEGER NOT NULL,
                    animal TEXT NOT NULL,
                    photo_path TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            # Create prizes table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS prizes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    photo_path TEXT,
                    quantity INTEGER DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            # Create participant_prizes table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS participant_prizes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    participant_id INTEGER,
                    prize_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (participant_id) REFERENCES participants (id) ON DELETE CASCADE,
                    FOREIGN KEY (prize_id) REFERENCES prizes (id) ON DELETE CASCADE
                )
            ''')

            # Create settings table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            ''')

            # Insert default settings if they don't exist
            cursor.execute('''
                INSERT OR IGNORE INTO settings (key, value)
                VALUES ('auto_prize_selection', 'true')
            ''')
            cursor.execute('''
                INSERT OR IGNORE INTO settings (key, value)
                VALUES ('allow_multiple_wins', 'true')
            ''')

            conn.commit()

    def get_participants(self) -> List[Dict[str, Any]]:
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            # Get all participants with their prizes
            cursor.execute('''
                SELECT 
                    p.id,
                    p.name,
                    p.tickets,
                    p.animal,
                    p.photo_path,
                    GROUP_CONCAT(ap.name) as prizes
                FROM participants p
                LEFT JOIN participant_prizes pr ON p.id = pr.participant_id
                LEFT JOIN prizes ap ON pr.prize_id = ap.id
                GROUP BY p.id
                ORDER BY p.created_at DESC
            ''')
            
            rows = cursor.fetchall()
            participants = []
            
            for row in rows:
                participant = {
                    'id': str(row['id']),
                    'name': row['name'],
                    'tickets': row['tickets'],
                    'animal': row['animal'],
                    'photo_path': row['photo_path'],
                    'prizes': row['prizes'].split(',') if row['prizes'] else []
                }
                participants.append(participant)
            
            return participants

    def get_participant(self, participant_id: int) -> Optional[Dict[str, Any]]:
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT 
                    p.id,
                    p.name,
                    p.tickets,
                    p.animal,
                    p.photo_path,
                    GROUP_CONCAT(ap.name) as prizes
                FROM participants p
                LEFT JOIN participant_prizes pr ON p.id = pr.participant_id
                LEFT JOIN prizes ap ON pr.prize_id = ap.id
                WHERE p.id = ?
                GROUP BY p.id
            ''', (participant_id,))
            
            row = cursor.fetchone()
            if not row:
                return None
                
            return {
                'id': str(row['id']),
                'name': row['name'],
                'tickets': row['tickets'],
                'animal': row['animal'],
                'photo_path': row['photo_path'],
                'prizes': row['prizes'].split(',') if row['prizes'] else []
            }

    def get_prizes(self) -> List[Dict[str, Any]]:
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            # Get all available prizes and their assignment status
            cursor.execute('''
                SELECT 
                    ap.id,
                    ap.name,
                    ap.description,
                    ap.photo_path,
                    ap.quantity,
                    COUNT(pr.id) as assigned_count,
                    GROUP_CONCAT(p.name) as winners
                FROM prizes ap
                LEFT JOIN participant_prizes pr ON ap.id = pr.prize_id
                LEFT JOIN participants p ON pr.participant_id = p.id
                GROUP BY ap.id
                ORDER BY ap.created_at DESC
            ''')
            
            rows = cursor.fetchall()
            prizes = []
            
            for row in rows:
                prize = {
                    'id': str(row['id']),
                    'name': row['name'],
                    'description': row['description'],
                    'photo_path': row['photo_path'],
                    'quantity': row['quantity'],
                    'remaining': row['quantity'] - (row['assigned_count'] or 0),
                    'winners': row['winners'].split(',') if row['winners'] else []
                }
                prizes.append(prize)
            
            return prizes

    def add_prize_to_pool(self, name: str, description: str = None, photo_path: str = None, quantity: int = 1) -> Dict[str, Any]:
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO prizes (name, description, photo_path, quantity)
                VALUES (?, ?, ?, ?)
            ''', (name, description, photo_path, quantity))
            
            prize_id = cursor.lastrowid
            conn.commit()
            
            return {
                'id': str(prize_id),
                'name': name,
                'description': description,
                'photo_path': photo_path,
                'quantity': quantity,
                'remaining': quantity,
                'winners': []
            }

    def update_prize(self, prize_id: int, name: str = None, description: str = None, photo_path: str = None, quantity: int = None) -> Dict[str, Any]:
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            # Get current prize data
            cursor.execute('SELECT * FROM prizes WHERE id = ?', (prize_id,))
            current_prize = cursor.fetchone()
            if not current_prize:
                raise ValueError('Prize not found')
            
            # Check if quantity update is valid
            if quantity is not None:
                cursor.execute('''
                    SELECT COUNT(*) as assigned_count
                    FROM participant_prizes
                    WHERE prize_id = ?
                ''', (prize_id,))
                assigned_count = cursor.fetchone()['assigned_count']
                if assigned_count > quantity:
                    raise ValueError('Cannot reduce quantity below number of assigned prizes')
            
            # Build update query dynamically
            updates = []
            params = []
            if name is not None:
                updates.append('name = ?')
                params.append(name)
            if description is not None:
                updates.append('description = ?')
                params.append(description)
            if photo_path is not None:
                updates.append('photo_path = ?')
                params.append(photo_path)
            if quantity is not None:
                updates.append('quantity = ?')
                params.append(quantity)
            
            if updates:
                query = f'''
                    UPDATE prizes
                    SET {', '.join(updates)}
                    WHERE id = ?
                '''
                params.append(prize_id)
                cursor.execute(query, params)
                conn.commit()
            
            # Return updated prize
            cursor.execute('''
                SELECT 
                    p.*,
                    COUNT(pr.id) as assigned_count,
                    GROUP_CONCAT(part.name) as winners
                FROM prizes p
                LEFT JOIN participant_prizes pr ON p.id = pr.prize_id
                LEFT JOIN participants part ON pr.participant_id = part.id
                WHERE p.id = ?
                GROUP BY p.id
            ''', (prize_id,))
            
            row = cursor.fetchone()
            return {
                'id': str(row['id']),
                'name': row['name'],
                'description': row['description'],
                'photo_path': row['photo_path'],
                'quantity': row['quantity'],
                'remaining': row['quantity'] - (row['assigned_count'] or 0),
                'winners': row['winners'].split(',') if row['winners'] else []
            }

    def remove_prize_from_pool(self, prize_id: int):
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            # Check if prize is assigned to any participant
            cursor.execute('SELECT id FROM participant_prizes WHERE prize_id = ?', (prize_id,))
            if cursor.fetchone():
                raise ValueError('Cannot remove prize that is assigned to a participant')
            
            cursor.execute('DELETE FROM prizes WHERE id = ?', (prize_id,))
            if cursor.rowcount == 0:
                raise ValueError('Prize not found')
            
            conn.commit()

    def add_participant(self, name: str, tickets: int, animal: str, photo_path: str = None) -> Dict[str, Any]:
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO participants (name, tickets, animal, photo_path)
                VALUES (?, ?, ?, ?)
            ''', (name, tickets, animal, photo_path))
            
            participant_id = cursor.lastrowid
            conn.commit()
            
            return {
                'id': str(participant_id),
                'name': name,
                'tickets': tickets,
                'animal': animal,
                'photo_path': photo_path,
                'prizes': []
            }

    def update_participant(self, id: int, name: str = None, tickets: int = None, photo_path: str = None) -> Dict[str, Any]:
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            # Check if participant exists
            cursor.execute('SELECT * FROM participants WHERE id = ?', (id,))
            current = cursor.fetchone()
            if not current:
                raise ValueError('Participant not found')
            
            # Build update query dynamically
            updates = []
            params = []
            if name is not None:
                updates.append('name = ?')
                params.append(name)
            if tickets is not None:
                # Check if new ticket count is valid
                cursor.execute('''
                    SELECT COUNT(*) as prize_count
                    FROM participant_prizes
                    WHERE participant_id = ?
                ''', (id,))
                prize_count = cursor.fetchone()['prize_count']
                if prize_count > tickets:
                    raise ValueError('Cannot reduce tickets below number of prizes won')
                updates.append('tickets = ?')
                params.append(tickets)
            if photo_path is not None:
                updates.append('photo_path = ?')
                params.append(photo_path)
            
            if updates:
                query = f'''
                    UPDATE participants
                    SET {', '.join(updates)}
                    WHERE id = ?
                '''
                params.append(id)
                cursor.execute(query, params)
                conn.commit()
            
            # Get updated participant data
            cursor.execute('''
                SELECT 
                    p.*,
                    GROUP_CONCAT(ap.name) as prizes
                FROM participants p
                LEFT JOIN participant_prizes pr ON p.id = pr.participant_id
                LEFT JOIN prizes ap ON pr.prize_id = ap.id
                WHERE p.id = ?
                GROUP BY p.id
            ''', (id,))
            
            row = cursor.fetchone()
            return {
                'id': str(row['id']),
                'name': row['name'],
                'tickets': row['tickets'],
                'animal': row['animal'],
                'photo_path': row['photo_path'],
                'prizes': row['prizes'].split(',') if row['prizes'] else []
            }

    def delete_participant(self, id: int):
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            try:
                # Start transaction
                cursor.execute('BEGIN')
                
                # First check if participant exists
                cursor.execute('SELECT id FROM participants WHERE id = ?', (id,))
                if not cursor.fetchone():
                    raise ValueError('Participant not found')
                
                # Delete all prize associations for this participant
                cursor.execute('DELETE FROM participant_prizes WHERE participant_id = ?', (id,))
                
                # Delete the participant
                cursor.execute('DELETE FROM participants WHERE id = ?', (id,))
                
                # Commit all changes
                conn.commit()
                
            except Exception as e:
                # If anything goes wrong, roll back all changes
                conn.rollback()
                raise e

    def add_prize(self, participant_id: int, prize_id: int):
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            # First check if participant has reached their ticket limit
            cursor.execute('''
                SELECT p.tickets, COUNT(pr.id) as prize_count
                FROM participants p
                LEFT JOIN participant_prizes pr ON p.id = pr.participant_id
                WHERE p.id = ?
                GROUP BY p.id
            ''', (participant_id,))
            
            result = cursor.fetchone()
            if not result:
                raise ValueError('Participant not found')
                
            tickets = result['tickets']
            prize_count = result['prize_count'] or 0
            
            if prize_count >= tickets:
                raise ValueError('Participant has reached their maximum number of prizes')

            # Check if prize has available quantity
            cursor.execute('''
                SELECT quantity, (
                    SELECT COUNT(*) 
                    FROM participant_prizes 
                    WHERE prize_id = prizes.id
                ) as assigned_count
                FROM prizes
                WHERE id = ?
            ''', (prize_id,))
            
            result = cursor.fetchone()
            if not result:
                raise ValueError('Prize not found')
            
            if result['assigned_count'] >= result['quantity']:
                raise ValueError('Prize has reached its maximum quantity')
            
            cursor.execute('''
                INSERT INTO participant_prizes(participant_id, prize_id)
                VALUES (?, ?)
            ''', (participant_id, prize_id))
            
            conn.commit()

    def remove_prize(self, participant_id: int, prize_index: int):
        with self.get_db() as conn:
            cursor = conn.cursor()
            
            # Get participant's prizes ordered by creation date
            cursor.execute('''
                SELECT pr.id
                FROM participant_prizes pr
                WHERE pr.participant_id = ?
                ORDER BY pr.created_at ASC
            ''', (participant_id,))
            
            prizes = cursor.fetchall()
            if not prizes:
                raise ValueError('No prizes found for this participant')
            
            if prize_index < 0 or prize_index >= len(prizes):
                raise ValueError('Invalid prize index')
            
            # Delete the specific prize
            prize_id = prizes[prize_index]['id']
            cursor.execute('DELETE FROM participant_prizes WHERE id = ?', (prize_id,))
            conn.commit()

    def clear_prizes(self):
        with self.get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM participant_prizes')
            conn.commit()

    def clear_all_data(self):
        with self.get_db() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute('BEGIN')
                cursor.execute('DELETE FROM participant_prizes')
                cursor.execute('DELETE FROM prizes')
                cursor.execute('DELETE FROM participants')
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise e

    def get_settings(self) -> Dict[str, Any]:
        with self.get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT key, value FROM settings')
            settings = {}
            for row in cursor.fetchall():
                try:
                    settings[row['key']] = json.loads(row['value'].lower())
                except json.JSONDecodeError:
                    settings[row['key']] = row['value']
            return settings

    def update_settings(self, settings: Dict[str, Any]):
        with self.get_db() as conn:
            cursor = conn.cursor()
            for key, value in settings.items():
                cursor.execute('''
                    INSERT OR REPLACE INTO settings (key, value)
                    VALUES (?, ?)
                ''', (key, json.dumps(value)))
            conn.commit()
            return self.get_settings()
