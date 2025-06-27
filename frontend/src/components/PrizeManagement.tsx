import React, { useState } from 'react';
import type { Prize } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface PrizeManagementProps {
  isOpen: boolean;
  onClose: () => void;
  prizes: Prize[];
  onAddPrize: (formData: FormData) => void;
  onUpdatePrize: (formData: FormData) => void;
  onDeletePrize: (prizeId: string) => void;
}

const PrizeManagement: React.FC<PrizeManagementProps> = ({
  isOpen,
  onClose,
  prizes,
  onAddPrize,
  onUpdatePrize,
  onDeletePrize,
}) => {
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [prizeToDelete, setPrizeToDelete] = useState<Prize | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [photo, setPhoto] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (editingPrize) {
      formData.append('id', editingPrize.id);
    }
    
    formData.append('name', name);
    formData.append('description', description);
    formData.append('quantity', quantity);
    if (photo) {
      formData.append('photo', photo);
    }

    if (editingPrize) {
      onUpdatePrize(formData);
    } else {
      onAddPrize(formData);
    }

    // Reset form
    setName('');
    setDescription('');
    setQuantity('1');
    setPhoto(null);
    setEditingPrize(null);
  };

  const handleEditPrize = (prize: Prize) => {
    setEditingPrize(prize);
    setName(prize.name);
    setDescription(prize.description || '');
    setQuantity(prize.quantity.toString());
  };

  return (
    <>
      <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-40">
        <div className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
          <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
          <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
          
          <h2 className="safari-title text-center mb-8">Prize Management 🎁</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prize Form */}
            <div className="bg-white/50 rounded-xl p-6 shadow-jungle">
              <h3 className="font-headline text-xl text-jungle-brown mb-6">
                {editingPrize ? '✏️ Edit Prize' : '✨ Add New Prize'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-headline text-jungle-brown mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block font-headline text-jungle-brown mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input w-full"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block font-headline text-jungle-brown mb-2" htmlFor="quantity">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block font-headline text-jungle-brown mb-2" htmlFor="photo">
                    Photo
                  </label>
                  <input
                    type="file"
                    id="photo"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    accept="image/*"
                    className="input w-full"
                  />
                </div>

                <div className="flex gap-4">
                  {editingPrize && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPrize(null);
                        setName('');
                        setDescription('');
                        setQuantity('1');
                        setPhoto(null);
                      }}
                      className="btn-secondary bg-jungle-brown/10 text-jungle-brown hover:bg-jungle-brown/20"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingPrize ? 'Update Prize' : 'Add Prize'}
                  </button>
                </div>
              </form>
            </div>

            {/* Prize List */}
            <div>
              <h3 className="font-headline text-xl text-jungle-brown mb-6">Current Prizes 🏆</h3>
              <div className="space-y-4 pr-2">
                {prizes.map((prize) => (
                  <div key={prize.id} className="bg-white/50 rounded-xl p-4 shadow-jungle 
                                               hover:scale-[1.02] transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-headline text-lg text-jungle-brown">{prize.name}</h4>
                        {prize.description && (
                          <p className="text-jungle-olive font-body mt-1">{prize.description}</p>
                        )}
                        <p className="font-body text-jungle-gold mt-2">
                          Quantity: {prize.quantity} (Remaining: {prize.remaining})
                        </p>
                        {prize.winners.length > 0 && (
                          <p className="font-body text-jungle-olive mt-1">
                            Winners: {prize.winners.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPrize(prize)}
                          className="btn-secondary p-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setPrizeToDelete(prize)}
                          className="btn-secondary bg-jungle-coral p-2"
                          disabled={prize.winners.length > 0}
                          title={prize.winners.length > 0 ? "Cannot delete prize that has been won" : "Delete prize"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${prize.winners.length > 0 ? 'opacity-50' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {prize.photo_path && (
                      <img
                        src={prize.photo_path}
                        alt={prize.name}
                        className="mt-4 w-full h-32 object-cover rounded-xl shadow-jungle"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
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
        isOpen={prizeToDelete !== null}
        title="Delete Prize"
        message={`Are you sure you want to delete ${prizeToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        onConfirm={() => {
          if (prizeToDelete) {
            onDeletePrize(prizeToDelete.id);
          }
          setPrizeToDelete(null);
        }}
        onCancel={() => setPrizeToDelete(null)}
      />
    </>
  );
};

export default PrizeManagement;
