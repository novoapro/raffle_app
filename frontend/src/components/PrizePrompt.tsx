import { useState, useEffect } from 'react';
import PrizeManagement from './PrizeManagement';
import type { Prize } from '../types';
import DialogHeader from './DialogHeader';

interface PrizePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prizeId: string) => void;
  onAddPrize: (formData: FormData) => void;
  onUpdatePrize: (formData: FormData) => void;
  onDeletePrize: (prizeId: string) => void;
  prizes: Prize[];
}

const PrizePrompt = ({ isOpen, onClose, onSubmit, onAddPrize, onUpdatePrize, onDeletePrize, prizes }: PrizePromptProps) => {
  const [showPrizeManagement, setShowPrizeManagement] = useState(false);

  if (!isOpen) return null;

  const availablePrizes = prizes.filter(prize => prize.remaining > 0);

  return (
    <div className={`fixed inset-0 flex items-center justify-center
      ${!showPrizeManagement ? 'bg-jungle-brown/50 backdrop-blur-sm z-50' : 'bg-transparent z-40'}`}>
      <div className="border-2 border-jungle-olive/10 bg-white rounded-2xl max-w-5xl relative flex flex-col overflow-hidden">
        <div>
        <DialogHeader
          title="Select a Prize"
          onClose={onClose}
        />  

          {availablePrizes.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-headline text-jungle-brown text-xl mb-2">No prizes available!</p>
              <button
                onClick={() => setShowPrizeManagement(true)}
                className="btn-secondary mt-5"
              >
                <span>🎯</span>
                Manage Prizes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 overflow-y-auto p-12">
              {availablePrizes.map((prize) => (
                <button
                  key={prize.id}
                  onClick={() => onSubmit(prize.id)}
                  className="bg-white/50 hover:bg-white/80 border-2 border-jungle-leaf/10 
                           hover:border-jungle-leaf/30 rounded-xl p-4 transition-all duration-300 
                           text-left group hover:scale-[1.02] shadow-jungle"
                >
                  <div className="flex items-start gap-4">
                    {prize.photo_path ? (
                      <img
                        src={prize.photo_path}
                        alt={prize.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-jungle"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-jungle-beige rounded-xl shadow-jungle 
                                   flex items-center justify-center text-4xl">
                        🎁
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-headline text-xl text-jungle-brown group-hover:text-jungle-green 
                                   transition-colors duration-300">
                        {prize.name}
                      </h3>
                      {prize.description && (
                        <p className="text-jungle-olive mt-1 font-body">
                          {prize.description}
                        </p>
                      )}
                      <p className="text-sm font-headline text-jungle-gold mt-2 flex items-center gap-2">
                        <span>🏆</span>
                        Available: {prize.remaining}/{prize.quantity}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <PrizeManagement
        isOpen={showPrizeManagement}
        onClose={() => setShowPrizeManagement(false)}
        prizes={prizes}
        onAddPrize={onAddPrize}
        onUpdatePrize={onUpdatePrize}
        onDeletePrize={onDeletePrize}
      />
    </div>
  );
};

export default PrizePrompt;
