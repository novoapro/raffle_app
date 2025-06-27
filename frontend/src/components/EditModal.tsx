import React, { useState, useEffect } from 'react';
import type { Participant } from '../types.ts';
import WebcamCapture from './WebcamCapture';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (participant: Partial<Participant>) => void;
  participant?: Participant;
  title?: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, participant, title = 'Add Participant' }) => {
  const [name, setName] = useState(participant?.name || '');
  const [tickets, setTickets] = useState(participant?.tickets?.toString() || '1');
  const [photo, setPhoto] = useState<string | null>(participant?.photo_path || null);
  const [showWebcam, setShowWebcam] = useState(false);

  // Update state when participant prop changes
  useEffect(() => {
    if (participant) {
      setName(participant.name);
      setTickets(participant.tickets.toString());
      setPhoto(participant.photo_path || null);
    } else {
      // Reset form when adding new participant
      setName('');
      setTickets('1');
      setPhoto(null);
    }
  }, [participant]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(participant?.id ? { id: participant.id } : {}),
      name,
      tickets: parseInt(tickets),
      ...(photo ? { photo_path : photo } : {})
    });
    setName('');
    setTickets('1');
    setPhoto(null);
  };

  const handlePhotoCapture = (photoData: string) => {
    setPhoto(photoData);
    setShowWebcam(false);
  };

  return (
    <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="card max-w-md w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
        <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
        <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
        
        <h2 className="safari-title text-center mb-6">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-headline text-jungle-brown mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label className="block font-headline text-jungle-brown mb-2" htmlFor="tickets">
              Number of Tickets
            </label>
            <input
              type="number"
              id="tickets"
              value={tickets}
              onChange={(e) => setTickets(e.target.value)}
              min="1"
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label className="block font-headline text-jungle-brown mb-2">
              Photo
            </label>
            {photo ? (
              <div className="relative">
                <img 
                  src={photo} 
                  alt="Captured" 
                  className="w-full h-48 object-cover rounded-xl shadow-jungle mb-2" 
                />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-jungle-coral text-white rounded-full p-2 
                           hover:bg-jungle-gold transition-colors duration-300 shadow-jungle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowWebcam(true)}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                📸 Take Photo
              </button>
            )}
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary bg-jungle-brown/10 text-jungle-brown hover:bg-jungle-brown/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      
      {showWebcam && (
        <WebcamCapture
          onCapture={handlePhotoCapture}
          onCancel={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
};

export default EditModal;
