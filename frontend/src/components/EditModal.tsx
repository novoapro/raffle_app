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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tickets">
              Number of Tickets
            </label>
            <input
              type="number"
              id="tickets"
              value={tickets}
              onChange={(e) => setTickets(e.target.value)}
              min="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Photo
            </label>
            {photo ? (
              <div className="relative">
                <img src={photo} alt="Captured" className="w-full rounded-lg mb-2" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Take Photo
              </button>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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