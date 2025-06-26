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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Prize Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prize Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {editingPrize ? 'Edit Prize' : 'Add New Prize'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={3}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                    Photo
                  </label>
                  <input
                    type="file"
                    id="photo"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    accept="image/*"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="flex gap-2">
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
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {editingPrize ? 'Update Prize' : 'Add Prize'}
                  </button>
                </div>
              </form>
            </div>

            {/* Prize List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Prizes</h3>
              <div className="space-y-4">
                {prizes.map((prize) => (
                  <div key={prize.id} className="border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{prize.name}</h4>
                        {prize.description && (
                          <p className="text-gray-600 text-sm">{prize.description}</p>
                        )}
                        <p className="text-sm">
                          Quantity: {prize.quantity} (Remaining: {prize.remaining})
                        </p>
                        {prize.winners.length > 0 && (
                          <p className="text-sm text-gray-600">
                            Winners: {prize.winners.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPrize(prize)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setPrizeToDelete(prize)}
                          className="text-red-500 hover:text-red-600"
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
                        className="mt-2 w-full h-32 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
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
