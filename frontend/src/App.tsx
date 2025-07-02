import React, { useState, useEffect } from 'react';
import type { Participant, Prize, RaffleSettings, ApiResponse, AddParticipantPayload } from './types';
import SafariBackground from './components/SafariBackground';
import EditModal from './components/EditModal'
import ParticipantCard from './components/ParticipantCard'
import WinnerDisplay from './components/WinnerDisplay'
import LoadingSpinner from './components/LoadingSpinner'
import Settings from './components/Settings'
import PrizePrompt from './components/PrizePrompt'
import PrizeManagement from './components/PrizeManagement'
import DrumrollAnimation from './components/DrumrollAnimation'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'

const API = {
  GET_PARTICIPANTS: '/api/get_participants',
  ADD_PARTICIPANT: '/api/add_participant',
  EDIT_PARTICIPANT: '/api/edit_participant',
  DELETE_PARTICIPANT: '/api/delete_participant',
  PICK_WINNER: '/api/pick_winner',
  SETTINGS: '/api/settings',
  CLEAR_PRIZES: '/api/clear_prizes',
  CLEAR_ALL_DATA: '/api/clear_all_data',
  PRIZES: '/api/prizes'
};

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerAnimal, setWinnerAnimal] = useState<string | null>(null);
  const [winnerPrize, setWinnerPrize] = useState<string | null>(null);
  const [winnerPhoto, setWinnerPhoto] = useState<string | null>(null);
  const [winnerPrizePhoto, setWinnerPrizePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<RaffleSettings>({
    allow_multiple_wins: false,
    auto_prize_selection: true
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrizePromptOpen, setIsPrizePromptOpen] = useState(false);
  const [isPrizeManagementOpen, setIsPrizeManagementOpen] = useState(false);
  const [showDrumroll, setShowDrumroll] = useState(false);
  const [winnerData, setWinnerData] = useState<{
    winner: string;
    tickets: number;
    animal: string;
    prize: string;
    photo: string | null;
    prizePhoto: string | null;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API.GET_PARTICIPANTS);
      if (!response.ok) throw new Error('Failed to fetch participants');
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participants:', error);
      showError('Failed to load participants');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrizes = async () => {
    try {
      const response = await fetch(API.PRIZES);
      if (!response.ok) throw new Error('Failed to fetch prizes');
      const data = await response.json();
      setPrizes(data);
    } catch (error) {
      console.error('Error fetching prizes:', error);
      showError('Failed to load prizes');
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(API.SETTINGS);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (newSettings: RaffleSettings) => {
    try {
      const response = await fetch(API.SETTINGS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error('Failed to update settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('Failed to update settings');
    }
  };

  const clearPrizes = async () => {
    try {
      const response = await fetch(API.CLEAR_PRIZES, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to clear prizes');
      await fetchParticipants();
      await fetchPrizes();
    } catch (error) {
      console.error('Error clearing prizes:', error);
      showError('Failed to clear prizes');
    }
  };

  const clearAllData = async () => {
    try {
      const response = await fetch(API.CLEAR_ALL_DATA, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to clear data');
      await fetchParticipants();
      await fetchPrizes();
      await fetchSettings();
    } catch (error) {
      console.error('Error clearing data:', error);
      showError('Failed to clear data');
    }
  };

  const handleAddParticipant = async (participant: AddParticipantPayload) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', participant.name || '');
      formData.append('tickets', participant.tickets?.toString() || '1');
      if (participant.photo_path) {
        formData.append('photo', participant.photo_path);
      }
      const response = await fetch(API.ADD_PARTICIPANT, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add participant');
      const data: ApiResponse = await response.json();
      if (data.status === 'success') {
        setToast({ message: 'Participant created successfully!', type: 'success' });
        if (!participant.addAnother) {
          setShowAddParticipant(false);
        }
        await fetchParticipants();
      }
    } catch (error) {
      console.error('Error adding participant:', error);
      showError('Failed to add participant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditParticipant = async (participant: Partial<Participant>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('id', participant.id || '');
      if (participant.name) formData.append('name', participant.name);
      if (participant.tickets) formData.append('tickets', participant.tickets.toString());
      if (participant.photo_path) formData.append('photo', participant.photo_path);

      const response = await fetch(API.EDIT_PARTICIPANT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to edit participant');
      const data: ApiResponse = await response.json();

      if (data.status === 'success') {
        setEditingParticipant(null);
        await fetchParticipants();
      }
    } catch (error) {
      console.error('Error editing participant:', error);
      showError('Failed to edit participant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(API.DELETE_PARTICIPANT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete participant');
      const data: ApiResponse = await response.json();

      if (data.status === 'success') {
        setEditingParticipant(null);
        await fetchParticipants();
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
      showError('Failed to delete participant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrize = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const response = await fetch(API.PRIZES, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add prize');
      const data: ApiResponse = await response.json();

      if (data.status === 'success') {
        await fetchPrizes();
      }
    } catch (error) {
      console.error('Error adding prize:', error);
      showError('Failed to add prize');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrize = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const response = await fetch(API.PRIZES, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update prize');
      const data: ApiResponse = await response.json();

      if (data.status === 'success') {
        await fetchPrizes();
      }
    } catch (error) {
      console.error('Error updating prize:', error);
      showError('Failed to update prize');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrize = async (prizeId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(API.PRIZES, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prize_id: prizeId }),
      });

      if (!response.ok) throw new Error('Failed to delete prize');
      const data: ApiResponse = await response.json();

      if (data.status === 'success') {
        await fetchPrizes();
      }
    } catch (error) {
      console.error('Error deleting prize:', error);
      showError('Failed to delete prize');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickWinner = async () => {
    if (!settings.auto_prize_selection) {
      setIsPrizePromptOpen(true);
    } else {
      await performDraw(settings.auto_prize_selection);
    }
  };

  const performDraw = async (autoSelect: boolean, prizeId?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(API.PICK_WINNER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prize_id: prizeId, auto_select: autoSelect }),
      });

      if (!response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.message || 'Failed to pick winner');
      };
      const data: ApiResponse = await response.json();

      if (data.status === 'success' && data.winner) {
        // Store winner data temporarily
        setWinnerData({
          winner: data.winner,
          tickets: data.tickets || 0,
          animal: data.animal || '',
          prize: data.prize || '',
          photo: data.photo || null,
          prizePhoto: data.prize_photo || null,
        });

        // Show drumroll animation
        setShowDrumroll(true);

        await fetchParticipants();
        await fetchPrizes();
      }
    } catch (error) {
      console.error('Error picking winner:', error);
      { error instanceof Error ? showError(error.message) : showError('Failed to pick winner') };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchPrizes();
    fetchSettings();
  }, []);

  const showError = (message: string) => {
    setToast({ message: message, type: 'error' });
    setTimeout(() => setToast(null), 5000);
  };

  const resetWinner = () => {
    setWinner(null);
    setWinnerAnimal(null);
    setWinnerPrize(null);
    setWinnerPhoto(null);
    setWinnerPrizePhoto(null);
  };

  const handleDrumrollComplete = () => {
    setShowDrumroll(false);
    if (winnerData) {
      setWinner(winnerData.winner);
      setWinnerAnimal(winnerData.animal);
      setWinnerPrize(winnerData.prize);
      setWinnerPhoto(winnerData.photo);
      setWinnerPrizePhoto(winnerData.prizePhoto);
    }
  };

  return (
    <SafariBackground>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Sidebar
            isLoadingData={isLoading}
            participantCounter={participants.length}
            onPickAWinner={handlePickWinner}
            onManagePrizes={() => setIsPrizeManagementOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          <header
            className="fixed top-0 left-0 w-full flex justify-center z-0 pointer-events-none"
            style={{ background: "transparent" }}
          >
            <img
              src="/assets/banner.png"
              alt="Raffle App Logo"
              className="bg-transparent mx-auto"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </header>
          <div className="" /> {/* Spacer to prevent content from being hidden behind the fixed header */}
            <div className="flex flex-col items-center justify-center">
            <img
              src="/assets/title.png"
              alt="Raffle App Title"
              className="mx-auto"
              style={{ maxWidth: "60%", width: "100%", height: "auto", zIndex: 20 }}
            />
            </div>
            <div className="" /> {/* Spacer to prevent content from being hidden behind the fixed header */}
            <div className="flex flex-col items-center justify-center">
            <img
              src="/assets/animals.png"
              alt="Raffle App Title"
              className="mx-auto"
              style={{ maxWidth: "40%", width: "100%", height: "auto", zIndex: 20 }}
            />
            </div>
          <Settings
            settings={settings}
            onUpdateSettings={updateSettings}
            onClearPrizes={clearPrizes}
            onClearAllData={clearAllData}
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />

          <div className="flex justify-center gap-4 items-center mb-8 mt-8">
            <button
              onClick={() => setShowAddParticipant(true)}
              className="btn-primary text-xl font-bold"
            >
              Add Participant 🎪
            </button>
          </div>

          <EditModal
            isOpen={showAddParticipant}
            onClose={() => setShowAddParticipant(false)}
            onSave={handleAddParticipant}
          />

          <EditModal
            isOpen={!!editingParticipant}
            onClose={() => setEditingParticipant(null)}
            onSave={handleEditParticipant}
            participant={editingParticipant || undefined}
            title="Edit Participant"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {participants.map(participant => (
              <div key={participant.id} className="flex flex-col h-full">
                <ParticipantCard
                  allowMultipleWins={settings.allow_multiple_wins}
                  participant={participant}
                  onEdit={setEditingParticipant}
                  onDelete={handleDeleteParticipant}
                />
              </div>
            ))}
          </div>
          {winner && (
            <WinnerDisplay
              winner={winner}
              animal={winnerAnimal || ''}
              prize={winnerPrize || ''}
              photo={winnerPhoto || undefined}
              prizePhoto={winnerPrizePhoto || undefined}
              onClose={resetWinner}
            />
          )}

          <PrizePrompt
            isOpen={isPrizePromptOpen}
            onClose={() => setIsPrizePromptOpen(false)}
            onSubmit={(prizeId) => {
              setIsPrizePromptOpen(false);
              performDraw(false, prizeId);
            }}
            onAddPrize={handleAddPrize}
            onUpdatePrize={handleUpdatePrize}
            onDeletePrize={handleDeletePrize}
            prizes={prizes}
          />

          <PrizeManagement
            isOpen={isPrizeManagementOpen}
            onClose={() => setIsPrizeManagementOpen(false)}
            prizes={prizes}
            onAddPrize={handleAddPrize}
            onUpdatePrize={handleUpdatePrize}
            onDeletePrize={handleDeletePrize}
          />

          {isLoading && <LoadingSpinner />}

          {showDrumroll && (
            <DrumrollAnimation onComplete={handleDrumrollComplete} />
          )}
          {toast && (
            <Toast message={toast.message} type={toast.type} />
          )}
        </div>
      </div>
    </SafariBackground>
  );
}

export default App;
