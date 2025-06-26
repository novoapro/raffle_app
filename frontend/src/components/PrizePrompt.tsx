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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Select Prize</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPrizeManagement(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Manage Prizes
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          {availablePrizes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-800 text-lg mb-2">No prizes available!</p>
              <p className="text-gray-600">Click "Manage Prizes" to add some prizes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {availablePrizes.map((prize) => (
                <button
                  key={prize.id}
                  onClick={() => onSubmit(prize.id)}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow text-left group"
                >
                  <div className="flex items-start gap-4">
                    {prize.photo_path && (
                      <img
                        src={prize.photo_path}
                        alt={prize.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                        {prize.name}
                      </h3>
                      {prize.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {prize.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
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