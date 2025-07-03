import React, { useState } from 'react';
import type { RaffleSettings } from '../types';
import ConfirmDialog from './ConfirmDialog';
import DialogHeader from './DialogHeader';

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
    <div className={`fixed inset-0  flex items-center justify-center z-40
        ${showClearAllConfirm || showClearPrizesConfirm ? 'bg-transparent' : 'bg-jungle-brown/50 backdrop-blur-sm'}
    `}>
      {/* Main settings dialog */}
      <div className="border-2 border-jungle-olive/10 bg-white rounded-2xl max-w-5xl relative flex flex-col overflow-hidden">
        <div>
          <DialogHeader
            title="Settings"
            onClose={onClose}
          />
          <div className="p-6 space-y-6">
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
      </div>
    </div>
  );
};

export default Settings;
