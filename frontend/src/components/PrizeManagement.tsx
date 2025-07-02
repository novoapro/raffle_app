import React, { useState } from 'react';
import type { Prize } from '../types';
import ConfirmDialog from './ConfirmDialog';
import DialogHeader from './DialogHeader';

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
    <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] relative flex flex-col overflow-hidden">
       <DialogHeader
          title={editingPrize ? 'Edit Prize' : 'Add New Prize'}
          message={editingPrize ? 'Update the prize details below.' : 'Fill in the details for the new prize.'}
          onClose={onClose}
        />
        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Side - Prize Form */}
          <div className="w-[400px] border-r border-jungle-green/10 p-4 overflow-y-auto">
            <div className="sticky top-0 bg-white pt-2">
              <h3 className="font-headline text-xl text-jungle-brown mb-4">
                {editingPrize ? '✏️ Edit Prize' : '✨ Add New Prize'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-headline text-jungle-brown mb-1" htmlFor="name">
                  Prize Name
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
                <label className="block font-headline text-jungle-brown mb-1" htmlFor="description">
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
                <label className="block font-headline text-jungle-brown mb-1" htmlFor="quantity">
                  Quantity Available
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
                <label className="block font-headline text-jungle-brown mb-1" htmlFor="photo">
                  Prize Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  accept="image/*"
                  className="input w-full"
                />
              </div>

              <div className="flex gap-3 pt-2">
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

          {/* Right Side - Prize List */}
          <div className="flex-1 p-4 pt-0 overflow-y-auto">
            <h3 className="font-headline text-xl text-jungle-brown sticky top-0 bg-white pt-2 pb-4">
              Current Prizes ({prizes.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prizes.map((prize) => (
                <div 
                  key={prize.id} 
                  className="bg-white rounded-xl border-2 border-jungle-green/10 
                           hover:border-jungle-green/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Prize Image */}
                  {prize.photo_path && (
                    <div className="aspect-video w-full overflow-hidden bg-jungle-beige">
                      <img
                        src={prize.photo_path}
                        alt={prize.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Prize Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-headline text-lg text-jungle-brown">{prize.name}</h4>
                        {prize.description && (
                          <p className="text-sm text-jungle-olive mt-1">{prize.description}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPrize(prize)}
                          className="p-2 rounded-lg hover:bg-jungle-green/10 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-jungle-green" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setPrizeToDelete(prize)}
                          className={`p-2 rounded-lg hover:bg-jungle-coral/10 transition-colors
                                   ${prize.winners.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={prize.winners.length > 0}
                          title={prize.winners.length > 0 ? "Cannot delete prize that has been won" : "Delete prize"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-jungle-coral" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Prize Stats */}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-jungle-brown/60">Available:</span>
                        <span className="font-headline text-jungle-green">
                          {prize.remaining}/{prize.quantity}
                        </span>
                      </div>
                      {prize.winners.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-jungle-brown/60">Winners:</span>
                          <span className="font-headline text-jungle-gold">
                            {prize.winners.length}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Winners List */}
                    {prize.winners.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-jungle-green/10">
                        <div className="text-xs text-jungle-brown/60 mb-2">Winners:</div>
                        <div className="flex flex-wrap gap-1">
                          {prize.winners.map((winner, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs
                                       bg-jungle-gold/10 text-jungle-gold"
                            >
                              {winner}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {prizes.length === 0 && (
              <div className="text-center py-12 bg-jungle-beige/30 rounded-xl">
                <div className="text-4xl mb-3">🎁</div>
                <p className="font-headline text-jungle-brown text-lg">No prizes added yet</p>
                <p className="text-jungle-olive text-sm mt-1">Add your first prize using the form</p>
              </div>
            )}
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
    </div>
  );
};

export default PrizeManagement;
