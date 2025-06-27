import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface WinnerDisplayProps {
  winner: string;
  animal: string;
  prize: string;
  photo?: string;
  prizePhoto?: string;
  onClose: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  animal,
  prize,
  photo,
  prizePhoto,
  onClose
}) => {
  useEffect(() => {
    // Create a more elaborate confetti effect with jungle colors
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ['#47624E', '#6A754A', '#B6872C', '#7B4F2B', '#E3A983', '#86A86F']
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Initial burst
    const burst = () => {
      confetti({
        ...defaults,
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    // Do the initial burst
    burst();

    // Continuous confetti
    const interval: number = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-5xl w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
        <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
        <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
        {/* Animated jungle elements */}
        {/* Render this decorative layer below the main card content */}
  
        {/* Main content */}
        <div className="text-center mb-8 relative animate-fadeIn">
          <h2 className="safari-title mb-2 text-shadow-lg animate-bounce">
            🎉 Congratulations! 🎉
          </h2>
          <p className="jungle-accent animate-pulse">
            A lucky winner has emerged from the safari!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Winner Section */}
          <div className="flex flex-col h-full animate-slideInLeft">
            <div className="bg-jungle-coral/20 rounded-xl p-6 shadow-jungle flex flex-col flex-1">
              <h3 className="font-headline text-2xl text-jungle-green mb-6 text-center">
                🏆 Winner
              </h3>
              <div className="relative group flex-1 flex flex-col items-center justify-center">
                {photo ? (
                  <img
                    src={photo}
                    alt={winner}
                    className="w-48 h-48 rounded-full object-cover mx-auto ring-4 ring-jungle-green ring-offset-4 
                             transform transition-all duration-300 group-hover:scale-105 shadow-jungle"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center text-6xl mx-auto 
                                ring-4 ring-jungle-green ring-offset-4 transform transition-all duration-300 
                                group-hover:scale-105 shadow-jungle">
                    {animal}
                  </div>
                )}
              </div>
              <h4 className="safari-title mt-4 text-4xl animate-fadeIn text-center whitespace-nowrap overflow-hidden text-ellipsis">{winner}</h4>
            </div>
          </div>

          {/* Prize Section */}
          <div className="flex flex-col h-full animate-slideInRight">
            <div className="bg-jungle-coral/20 rounded-xl  p-4 shadow-jungle flex flex-col flex-1">
              <h3 className="font-headline text-2xl text-jungle-gold mb-6 text-center">
                🎁 Prize Won
              </h3>
              <div className="relative group flex-1 flex flex-col items-center justify-center">
                {prizePhoto ? (
                  <img
                    src={prizePhoto}
                    alt={prize}
                    className="w-48 h-48 rounded-full  object-cover mx-auto ring-4 ring-jungle-gold ring-offset-4 
                             transform transition-all duration-300 group-hover:scale-105 shadow-jungle"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full  bg-white flex items-center justify-center text-6xl mx-auto 
                                ring-4 ring-jungle-gold ring-offset-4 transform transition-all duration-300 
                                group-hover:scale-105 shadow-jungle">
                    🎁
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <h4 className="safari-title text-4xl animate-fadeIn mb-2safari-title mt-4 text-4xl animate-fadeIn text-center whitespace-nowrap overflow-hidden text-ellipsis">{prize}</h4>
              </div>
            </div>
          </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="transform text-8xl font-headline tracking-wide">
              🏆
              </div>
            </div>
        </div>

        {/* Close button */}
        <div className="text-center animate-fadeIn">
          <button
            onClick={onClose}
            className="btn-primary text-lg flex items-center gap-2 mx-auto">
            <span>🎯</span>
            Continue Safari
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default WinnerDisplay;
