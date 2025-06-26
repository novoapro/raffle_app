import { useState, useEffect } from 'react'
import EditModal from './components/EditModal'
import ParticipantCard from './components/ParticipantCard'
import WinnerDisplay from './components/WinnerDisplay'
import LoadingSpinner from './components/LoadingSpinner'
import Settings from './components/Settings'
import PrizePrompt from './components/PrizePrompt'
import PrizeManagement from './components/PrizeManagement'
import DrumrollAnimation from './components/DrumrollAnimation'
import Sidebar from './components/Sidebar'
import type { Participant, Prize, ApiResponse, RaffleSettings } from './types'

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
  const [winnerTickets, setWinnerTickets] = useState<number | null>(null);
  const [winnerAnimal, setWinnerAnimal] = useState<string | null>(null);
  const [winnerPrize, setWinnerPrize] = useState<string | null>(null);
  const [winnerPhoto, setWinnerPhoto] = useState<string | null>(null);
  const [winnerPrizePhoto, setWinnerPrizePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleAddParticipant = async (participant: Partial<Participant>) => {
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
        setShowAddParticipant(false);
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
    if(!settings.auto_prize_selection) {
      setIsPrizePromptOpen(true);
    } else{
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
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const resetWinner = () => {
    setWinner(null);
    setWinnerTickets(null);
    setWinnerAnimal(null);
    setWinnerPrize(null);
    setWinnerPhoto(null);
    setWinnerPrizePhoto(null);
  };

    const handleDrumrollComplete = () => {
    setShowDrumroll(false);
    if (winnerData) {
      setWinner(winnerData.winner);
      setWinnerTickets(winnerData.tickets);
      setWinnerAnimal(winnerData.animal);
      setWinnerPrize(winnerData.prize);
      setWinnerPhoto(winnerData.photo);
      setWinnerPrizePhoto(winnerData.prizePhoto);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Sidebar 
          onManagePrizes={() => setIsPrizeManagementOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Lucky Safari Raffle! 🦁</h1>
          <p className="text-gray-600">Join the adventure and try your luck! 🌿</p>
        </header>

        <Settings
          settings={settings}
          onUpdateSettings={updateSettings}
          onClearPrizes={clearPrizes}
          onClearAllData={clearAllData}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <div className="mb-8">
          <button
            onClick={() => setShowAddParticipant(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Participant
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-start">
          {participants.map(participant => (
            <ParticipantCard
              key={participant.id}
              allowMultipleWins={settings.allow_multiple_wins}
              participant={participant}
              onEdit={setEditingParticipant}
              onDelete={handleDeleteParticipant}
            />
          ))}
        </div>

        {participants.length > 0 && (
          <button
            onClick={handlePickWinner}
            disabled={isLoading}
            className="w-full max-w-md mx-auto block bg-green-500 text-white text-xl font-bold px-8 py-4 rounded-xl hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Drawing...' : 'Draw Winner! 🎯'}
          </button>
        )}

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

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;