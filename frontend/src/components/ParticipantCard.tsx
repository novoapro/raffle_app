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

  return (
    <>
      {/* Playful Card Layout */}
      <div className={`relative overflow-hidden transition-all duration-300 hover:-rotate-1 hover:scale-[1.02]`}>
        {/* Card with simple border and shadow */}
        <div className="relative rounded-2xl bg-white border border-jungle-green/50
                     shadow-[0_4px_10px_-2px_rgba(0,0,0,0.06)]
                     hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.06)]
                     hover:border-jungle-green/20
                     transition-all duration-300">
          <div className="relative overflow-hidden">
            {/* Content Container */}
            <div className="flex flex-col">
              {/* Top Section with Photo and Basic Info */}
              <div className="p-4 pb-0">
                <div className="flex gap-4">
                  {/* Photo Container */}
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden 
                               shadow-lg border-4 border-white ring-2 ring-jungle-green/20 flex-shrink-0">
                    {participant.photo_path ? (
                      <img
                        src={participant.photo_path}
                        alt={participant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-jungle-green/20 to-jungle-leaf/20
                                   flex items-center justify-center text-8xl">
                        {participant.animal}
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className={`"flex-grow min-w-0 py-1`}>
                    {/* Name with fun dot decoration */}
                    <div className="relative">
                      <div className="absolute -left-2 top-3 w-1.5 h-1.5 rounded-full bg-jungle-green/40"></div>
                      <h3 className="font-headline text-xl text-jungle-brown pl-2 break-words leading-tight max-w-full">
                        {participant.name}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm
                                  ${canParticipate 
                                    ? 'bg-jungle-green/10 text-jungle-green border border-jungle-green/20' 
                                    : 'bg-jungle-coral/10 text-jungle-coral border border-jungle-coral/20 grayscale'}`}>
                        <span className={`w-2 h-2 rounded-full animate-ping opacity-75
                                    ${canParticipate ? 'bg-jungle-green' : 'bg-jungle-coral'}`}></span>
                        {canParticipate ? 'Ready to Play!' : 'Taking a Break'}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onEdit(participant)}
                        className={`p-2 rounded-xl hover:scale-110 transition-all duration-200 bg-jungle-green/10 text-jungle-green hover:bg-jungle-green/20`}
                        title={ "Edit participant"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 rounded-xl bg-jungle-coral/10 text-jungle-coral
                               hover:bg-jungle-coral/20 hover:scale-110 transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tickets Section with Fun Background */}
                <div className={`mt-4 px-4 py-3 rounded-2xl overflow-hidden bg-gradient-to-r from-jungle-green/5 via-transparent to-jungle-green/5
                                ${!canParticipate ? 'grayscale' : ''} `}>
                <div className="flex items-center justify-around gap-4">
                  {/* Total Tickets */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-jungle-green/5 rounded-2xl -rotate-3 
                                transition-transform group-hover:rotate-0"></div>
                    <div className="relative px-4 py-2 text-center">
                      <div className="text-3xl font-headline text-jungle-green group-hover:scale-110 
                                  transition-transform duration-200">
                        {participant.tickets}
                      </div>
                      <div className="text-xs text-jungle-brown/60 uppercase tracking-wider font-medium">
                        Tickets
                      </div>
                    </div>
                  </div>

                  {allowMultipleWins && (
                    <>
                      <div className="text-2xl text-jungle-brown/20">🎯</div>
                      {/* Remaining Tickets */}
                      <div className="group relative">
                        <div className="absolute inset-0 bg-jungle-gold/5 rounded-2xl rotate-3 
                                    transition-transform group-hover:rotate-0"></div>
                        <div className="relative px-4 py-2 text-center">
                          <div className="text-3xl font-headline text-jungle-gold group-hover:scale-110 
                                      transition-transform duration-200">
                            {remainingTickets}
                          </div>
                          <div className="text-xs text-jungle-brown/60 uppercase tracking-wider font-medium">
                            Left to Play
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Prize Showcase - Fun Style */}
              {hasWonPrizes && (
                <div className="mt-3 px-4 pb-4">
                  <div className="bg-gradient-to-r from-jungle-gold/5 via-jungle-gold/10 to-jungle-gold/5 
                               rounded-2xl border border-jungle-gold/20 overflow-hidden">
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative">
                          <span className="text-2xl animate-bounce inline-block">🏆</span>
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-jungle-gold rounded-full animate-ping"></span>
                        </div>
                        <span className="font-headline text-jungle-brown">
                          Prize{participant.prizes.length > 1 ? 's' : ''} Won: ({participant.prizes.length})
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {participant.prizes.length <= 2 ? (
                          participant.prizes.map((prize, index) => (
                            <div 
                              key={index}
                              className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm 
                                       text-jungle-gold border border-jungle-gold/20 shadow-sm
                                       hover:scale-105 transition-transform duration-200"
                            >
                              ✨ {prize}
                            </div>
                          ))
                        ) : (
                          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm 
                                     text-jungle-gold border border-jungle-gold/20 shadow-sm
                                     hover:scale-105 transition-transform duration-200">
                            ✨ {participant.prizes[0]} +{participant.prizes.length - 1} more amazing prizes!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
