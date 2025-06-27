import { useState, useEffect } from 'react';
import PrizeManagement from './PrizeManagement';
import type { Prize } from '../types';

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
    <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="card max-w-2xl w-full m-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
        <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
        <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="safari-title">Select Prize 🎁</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPrizeManagement(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <span>🎯</span>
                Manage Prizes
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full 
                         hover:bg-jungle-brown/10 text-jungle-brown transition-colors duration-300"
              >
                ✕
              </button>
            </div>
          </div>

          {availablePrizes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-bounce">🎁</div>
              <p className="font-headline text-jungle-brown text-xl mb-2">No prizes available!</p>
              <p className="jungle-accent">Click "Manage Prizes" to add some treasures.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
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
