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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.auto_prize_selection}
                onChange={(e) => onUpdateSettings({
                  ...settings,
                  auto_prize_selection: e.target.checked
                })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>Auto Prize Selection</span>
            </label>
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.allow_multiple_wins}
                onChange={(e) => onUpdateSettings({
                  ...settings,
                  allow_multiple_wins: e.target.checked
                })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>Allow Multiple Wins</span>
            </label>
          </div>

          <div className="border-t pt-4 space-y-2">
            <button
              onClick={() => setShowClearPrizesConfirm(true)}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Clear All Prize Assignments
            </button>
            <button
              onClick={() => setShowClearAllConfirm(true)}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All Data
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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
