import React, { useState } from 'react';
import type { Participant } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface ParticipantCardProps {
  participant: Participant;
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
  allowMultipleWins: boolean;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  onEdit,
  onDelete,
  allowMultipleWins,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate remaining tickets based on settings
  const hasWonPrizes = participant.prizes && participant.prizes.length > 0;
  const remainingTickets = allowMultipleWins 
    ? participant.tickets - (participant.prizes?.length || 0)
    : hasWonPrizes ? 0 : participant.tickets;

  const canParticipate = remainingTickets > 0;
  const canEdit = !hasWonPrizes;

  return (
    <>
      <div className={`card group hover:scale-[1.02] transition-all duration-300 ${!canParticipate ? 'border-jungle-gold' : ''}`}>
        <div className="flex p-2">
          {/* Photo Section */}
          {(participant.photo_path && (
            <div className="mr-4">
              <img
                src={participant.photo_path}
                alt={participant.name}
                className="w-24 h-24 object-cover rounded-xl shadow-jungle"
              />
            </div>
          )) || (
            <div className="mr-4">
              <div className="w-24 h-24 bg-jungle-beige rounded-xl shadow-jungle flex items-center justify-center group-hover:animate-sway">
                <span className="text-6xl">{participant.animal}</span>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline text-xl text-jungle-brown leading-tight flex items-center gap-1">
                  {participant.name}
                </h3>
                <div className="space-y-1 mt-2">
                  <p className="text-jungle-olive font-body">
                    Tickets: {participant.tickets}
                    {allowMultipleWins && hasWonPrizes && (
                      <span className="ml-2 text-sm font-bold text-jungle-gold">
                        (Remaining: {remainingTickets})
                      </span>
                    )}
                  </p>
                  {!canParticipate && (
                    <p className="text-jungle-coral font-medium flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Not in subsequent draws
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => onEdit(participant)}
                  className={`btn-secondary p-2 ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!canEdit}
                  title={!canEdit ? "Cannot edit participant with won prizes" : "Edit participant"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-secondary bg-jungle-coral p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Prizes Section */}
        {hasWonPrizes && (
          <div className="mt-3 bg-jungle-leaf/10 rounded-lg px-3 py-2">
            <p className="text-sm font-headline text-jungle-brown">Prizes Won:</p>
            <div className="text-sm font-body text-jungle-olive">
              {participant.prizes.join(', ')}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Participant"
        message={`Are you sure you want to delete ${participant.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        onConfirm={() => {
          onDelete(participant.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};

export default ParticipantCard;
