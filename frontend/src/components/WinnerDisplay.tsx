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
    // Create a more elaborate confetti effect
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Initial burst
    const burst = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    // Do the initial burst
    burst();

    // Continuous confetti
    const interval: number = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start a bit higher than random
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-2xl max-w-4xl w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
        
        {/* Main content */}
        <div className="text-center mb-8 relative animate-fadeIn">
          <h2 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-bounce">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-gray-600 text-xl animate-pulse">We have a winner!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Winner Section */}
          <div className="space-y-4 animate-slideInLeft">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4 text-purple-600">Winner</h3>
              <div className="relative group">
                {photo ? (
                  <img
                    src={photo}
                    alt={winner}
                    className="w-48 h-48 rounded-full object-cover mx-auto ring-4 ring-purple-400 ring-offset-4 transform transition-all duration-300 group-hover:scale-105 shadow-xl animate-float"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-6xl mx-auto ring-4 ring-purple-400 ring-offset-4 transform transition-all duration-300 group-hover:scale-105 shadow-xl animate-float">
                    {animal}
                  </div>
                )}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  {animal}
                </div>
              </div>
              <h4 className="text-3xl font-bold mt-6 text-gray-800 animate-fadeIn">{winner}</h4>
            </div>
          </div>

          {/* Prize Section */}
          <div className="space-y-4 animate-slideInRight">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4 text-pink-600">Prize</h3>
              <div className="relative group">
                {prizePhoto ? (
                  <img
                    src={prizePhoto}
                    alt={prize}
                    className="w-48 h-48 rounded-xl object-cover mx-auto ring-4 ring-pink-400 ring-offset-4 transform transition-all duration-300 group-hover:scale-105 shadow-xl animate-float"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-6xl mx-auto ring-4 ring-pink-400 ring-offset-4 transform transition-all duration-300 group-hover:scale-105 shadow-xl animate-float">
                    🎁
                  </div>
                )}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  Prize Won!
                </div>
              </div>
              <h4 className="text-3xl font-bold mt-6 text-gray-800 animate-fadeIn">{prize}</h4>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="text-center animate-fadeIn">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold 
                     hover:from-purple-700 hover:to-pink-700 transform transition-all duration-300 hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
          >
            Close
          </button>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-purple-400 rounded-tl-2xl"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-pink-400 rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-pink-400 rounded-bl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-400 rounded-br-2xl"></div>

        {/* Animated sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinnerDisplay;