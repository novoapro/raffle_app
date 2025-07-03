import React, { useState, useEffect, useRef } from 'react';
import type { Participant, AddParticipantPayload } from '../types.ts';
import WebcamCapture, { type WebcamCaptureHandle } from './WebcamCapture';
import DialogHeader from './DialogHeader.tsx';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (participant: AddParticipantPayload) => void;
  participant?: Participant;
  title?: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, participant }) => {
  const [name, setName] = useState(participant?.name || '');
  const [tickets, setTickets] = useState(participant?.tickets?.toString() || '1');
  const [saving, setSaving] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showWebcam, setShowWebcam] = useState(!participant);
  const [photoPreview, setPhotoPreview] = useState<string | null>(participant?.photo_path || null);
  const [cameraOptOut, setCameraOptOut] = useState(false);
  const webcamRef = useRef<WebcamCaptureHandle>(null);

  useEffect(() => {
    if (justAdded) {
      setJustAdded(false);
      return;
    }
    setShowWebcam(!participant);
    setPhotoPreview(participant?.photo_path || null);
    setCameraOptOut(false);
    if (participant) {
      setName(participant.name);
      setTickets(participant.tickets.toString());
    } else if (!addAnother) {
      setName('');
      setTickets('1');
    }
  }, [participant]);

  if (!isOpen) return null;

  const handleClose = () => {
    setPhotoPreview(null);
    setName('');
    setTickets('1');
    setCameraOptOut(false);
    onClose();
    setJustAdded(false);
    setAddAnother(false);
    setSaving(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let photoData = photoPreview;
    if (!cameraOptOut && showWebcam && webcamRef.current && webcamRef.current.getScreenshot) {
      photoData = webcamRef.current.getScreenshot() || '';
      setPhotoPreview(photoData);
    }
    onSave({
      ...(participant?.id ? { id: participant.id } : {}),
      name,
      tickets: parseInt(tickets),
      ...(photoData && !cameraOptOut ? { photo_path: photoData } : { photo_path: "" }),
      addAnother
    });
    if (!addAnother) {
      onClose();
    }
    setSaving(false);
    setJustAdded(true);
    setName('');
    setTickets('1');
    setPhotoPreview(null);
    setCameraOptOut(false);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-40 bg-jungle-brown/50 backdrop-blur-sm`}>
      <div className="border-2 border-jungle-olive/10 bg-white rounded-2xl relative flex flex-col overflow-hidden">
        <DialogHeader
          title={participant ? "Edit Participant" : "Add Participant"}
        />
        <div className="p-12">
          <form id="edit-modal-form" onSubmit={handleSubmit} className="space-y-6">
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
                tabIndex={0} // Added for accessibility
                autoFocus={!participant} // Autofocus only if adding a new participant
              />
            </div>
            <div>
              <label className="block font-headline text-jungle-brown mb-2" htmlFor="tickets">
                Number of Tickets
              </label>
              <input
                type="number"
                id="tickets"
                value={tickets}
                onChange={(e) => setTickets(e.target.value)}
                min="1"
                className="input w-full"
                required
                tabIndex={0}
              />
            </div>
            {/* Photo field logic */}
            <div className="mb-4">
              {participant && !showWebcam ? (
                <div className="flex flex-col items-center gap-2">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Current" className="w-40 h-40 object-cover rounded-xl shadow-jungle mb-2" />
                  ) : (
                    <div className="w-40 h-40 bg-jungle-brown/10 flex items-center justify-center rounded-xl mb-2">No Photo</div>
                  )}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowWebcam(true)}
                  >
                    Update Photo
                  </button>
                </div>
              ) : (
                <>
                  <WebcamCapture ref={webcamRef} />
                    <div className="flex items-center mt-2">
                    <input
                      id="cameraOptOut"
                      type="checkbox"
                      checked={cameraOptOut}
                      onChange={e => setCameraOptOut(e.target.checked)}
                      className="mr-2"
                      tabIndex={0}
                    />
                    <label htmlFor="cameraOptOut" className="text-jungle-brown text-sm select-none">
                      Opt out of camera (create participant without photo)
                    </label>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary bg-jungle-brown/10 text-jungle-brown hover:bg-jungle-brown/20"
                disabled={saving}
              >
                Close
              </button>
              {!participant ? (
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={saving}
                  tabIndex={0}
                  onClick={() => { setAddAnother(true); setTimeout(() => { document.getElementById('edit-modal-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }, 0); }}
                >
                  Save & Add Another
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  disabled={saving}
                  tabIndex={0}
                  onClick={() => { setAddAnother(false); setTimeout(() => { document.getElementById('edit-modal-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }, 0); }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              )}

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
