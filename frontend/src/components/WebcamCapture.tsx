import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  onCapture: (photoData: string) => void;
  onCancel: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onCancel }) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string>('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const handleUserMediaError = useCallback(() => {
    setError('Could not access webcam. Please make sure you have granted camera permissions.');
  }, []);

  return (
    <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card max-w-md w-full relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
        <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
        <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
        
        <div className="mb-6">
          <h2 className="safari-title text-center mb-4">Take a Photo 📸</h2>
          {error ? (
            <div className="bg-jungle-coral/10 border-2 border-jungle-coral rounded-xl p-4">
              <p className="text-jungle-coral font-body">{error}</p>
            </div>
          ) : (
            <div className="relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 480,
                  height: 360,
                  facingMode: "user"
                }}
                onUserMediaError={handleUserMediaError}
                className="w-full rounded-xl shadow-jungle"
              />
              {/* Camera frame decoration */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-jungle-gold rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-jungle-gold rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-jungle-gold rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-jungle-gold rounded-br-xl"></div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="btn-secondary bg-jungle-brown/10 text-jungle-brown hover:bg-jungle-brown/20"
          >
            Cancel
          </button>
          <button
            onClick={capture}
            className="btn-primary flex items-center gap-2"
            disabled={!!error}
          >
            <span>📸</span>
            <span>Take Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
