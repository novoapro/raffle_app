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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Take a Photo</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
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
              className="w-full rounded-lg"
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={capture}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!!error}
          >
            Take Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
