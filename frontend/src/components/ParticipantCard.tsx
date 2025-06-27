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
      <div className={`border-jungle-green bg-gradient-to-r from-jungle-leaf/30 via-jungle-leaf/15 to-jungle-leaf/5 rounded-2xl overflow-hidden min-h-[220px] grid grid-cols-[140px,1fr] 
                    transition-all duration-300 hover:shadow-xl
                    ${!canParticipate ? 'opacity-75' : ''}`}>
        {/* Left Column - Photo Section */}
        <div className="relative">
          {/* Photo/Animal Display */}
          {participant.photo_path ? (
            <img
              src={participant.photo_path}
              alt={participant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-jungle-green/10 to-jungle-leaf/10
                         flex items-center justify-center text-5xl">
              {participant.animal}
            </div>
          )}

          {/* Participation Status Overlay */}
          {!canParticipate && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent
                         flex items-end justify-center p-3">
              <span className="text-white font-headline text-xs bg-jungle-coral/90 
                           px-3 py-1 rounded-full whitespace-nowrap">
                Not Participating
              </span>
            </div>
          )}
        </div>

        {/* Right Column - Information Section */}
        <div className="p-3 flex flex-col relative">
          {/* Action Buttons - Top Right */}
          <div className="absolute top-3 right-3 flex gap-1">
            <button
              onClick={() => onEdit(participant)}
              disabled={!canEdit}
              className={`p-1.5 rounded-lg hover:bg-jungle-green/10 transition-colors
                       ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={!canEdit ? "Cannot edit participant with won prizes" : "Edit participant"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-jungle-green" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-lg hover:bg-jungle-coral/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-jungle-coral" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Name and Animal */}
          <div className="mb-3 pr-16"> {/* Added right padding for action buttons */}
            <h3 className="font-headline text-xl text-jungle-brown leading-tight">{participant.name}</h3>
          
          </div>

          {/* Tickets Information */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 border-l-3 border-jungle-green">
              <div className="text-xs font-bold text-jungle-brown/100">Total Tickets</div>
              <div className="font-headline text-lg text-jungle-green">
                {participant.tickets}
              </div>
            </div>
            {allowMultipleWins && hasWonPrizes && (
              <div className="flex-1 border-l-3 border-jungle-gold pl-2">
                <div className="text-xs text-jungle-brown/60">Remaining</div>
                <div className="font-headline text-lg text-jungle-gold">
                  {remainingTickets}
                </div>
              </div>
            )}
          </div>

          {/* Prizes Section */}
          {hasWonPrizes && (
            <div className="mt-auto">
              <div className="text-xs text-jungle-brown/60 mb-1.5">
                Prizes Won ({participant.prizes.length})
              </div>
              <div className="space-y-1.5">
                {participant.prizes.map((prize, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-1.5 bg-jungle-gold/5 px-2 py-1.5 rounded-lg"
                  >
                    <span className="text-base">🏆</span>
                    <span className="font-headline text-xs text-jungle-gold">{prize}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
