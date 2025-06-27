import React, { useState } from 'react';
import type { RaffleSettings } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface SettingsProps {
  settings: RaffleSettings;
  onUpdateSettings: (settings: RaffleSettings) => void;
  onClearPrizes: () => void;
  onClearAllData: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onClearPrizes,
  onClearAllData,
  isOpen,
  onClose,
}) => {
  const [showClearPrizesConfirm, setShowClearPrizesConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-40">
        <div className="card max-w-md w-full relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
          <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
          <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
          
          <h2 className="safari-title text-center mb-8">Safari Settings ⚙️</h2>
          
          <div className="space-y-6">
            {/* Auto Prize Selection */}
            <div className="group">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/80 
                              transition-colors duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_prize_selection}
                  onChange={(e) => onUpdateSettings({
                    ...settings,
                    auto_prize_selection: e.target.checked
                  })}
                  className="form-checkbox h-5 w-5 text-jungle-green border-2 border-jungle-leaf 
                           rounded focus:ring-jungle-green"
                />
                <div>
                  <span className="font-headline text-jungle-brown">Auto Prize Selection</span>
                  <p className="text-sm text-jungle-olive mt-1">
                    Automatically select prizes for winners
                  </p>
                </div>
              </label>
            </div>

            {/* Allow Multiple Wins */}
            <div className="group">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/80 
                              transition-colors duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allow_multiple_wins}
                  onChange={(e) => onUpdateSettings({
                    ...settings,
                    allow_multiple_wins: e.target.checked
                  })}
                  className="form-checkbox h-5 w-5 text-jungle-green border-2 border-jungle-leaf 
                           rounded focus:ring-jungle-green"
                />
                <div>
                  <span className="font-headline text-jungle-brown">Allow Multiple Wins</span>
                  <p className="text-sm text-jungle-olive mt-1">
                    Let participants win more than one prize
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="border-t border-jungle-green/10 mt-8 pt-6 space-y-4">
            <button
              onClick={() => setShowClearPrizesConfirm(true)}
              className="w-full btn-secondary bg-jungle-gold hover:bg-jungle-gold/90 flex items-center justify-center gap-2"
            >
              <span>🎁</span>
              Clear All Prize Assignments
            </button>
            
            <button
              onClick={() => setShowClearAllConfirm(true)}
              className="w-full btn-secondary bg-jungle-coral hover:bg-jungle-coral/90 flex items-center justify-center gap-2"
            >
              <span>🗑️</span>
              Clear All Data
            </button>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="btn-secondary bg-jungle-brown/10 text-jungle-brown hover:bg-jungle-brown/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearPrizesConfirm}
        title="Clear Prize Assignments"
        message="Are you sure you want to clear all prize assignments? This action cannot be undone."
        confirmText="Clear"
        type="warning"
        onConfirm={() => {
          onClearPrizes();
          setShowClearPrizesConfirm(false);
        }}
        onCancel={() => setShowClearPrizesConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showClearAllConfirm}
        title="Clear All Data"
        message="Are you sure you want to clear all data? This will remove all participants, prizes, and assignments. This action cannot be undone."
        confirmText="Clear Everything"
        type="danger"
        onConfirm={() => {
          onClearAllData();
          setShowClearAllConfirm(false);
        }}
        onCancel={() => setShowClearAllConfirm(false)}
      />
    </>
  );
};

export default Settings;
