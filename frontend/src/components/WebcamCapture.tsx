import React, { useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  onCancel?: () => void; // now optional, not used in embedded mode
}

export interface WebcamCaptureHandle {
  getScreenshot: () => string | null;
}

const WebcamCapture = forwardRef<WebcamCaptureHandle, WebcamCaptureProps>(({ onCancel }, ref) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string>('');

  useImperativeHandle(ref, () => ({
    getScreenshot: () => webcamRef.current?.getScreenshot() || null
  }));

  const handleUserMediaError = useCallback(() => {
    setError('Could not access webcam. Please make sure you have granted camera permissions.');
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <label className="block font-headline text-jungle-brown mb-2">Photo</label>
      {error ? (
        <div className="bg-jungle-coral/10 border-2 border-jungle-coral rounded-xl p-4 w-full">
          <p className="text-jungle-coral font-body">{error}</p>
        </div>
      ) : (
        <div className="relative w-full flex justify-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/webp"
            videoConstraints={{
              width: 720,
              height: 480,
              facingMode: "user"
            }}
            onUserMediaError={handleUserMediaError}
            className="w-full max-w-md rounded-xl shadow-jungle"
          />
          {/* Camera frame decoration */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-jungle-gold rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-jungle-gold rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-jungle-gold rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-jungle-gold rounded-br-xl"></div>
        </div>
      )}
    </div>
  );
});

export default WebcamCapture;
