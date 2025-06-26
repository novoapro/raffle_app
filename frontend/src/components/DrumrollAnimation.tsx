import React, { useEffect, useState } from 'react';

interface DrumrollAnimationProps {
  onComplete: () => void;
}

const DrumrollAnimation: React.FC<DrumrollAnimationProps> = ({ onComplete }) => {
  const [dots, setDots] = useState('');
  const [drumrollAudio] = useState(new Audio('/sounds/drumroll.mp3'));
  const [drumsticks, setDrumsticks] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      drumrollAudio.pause();
      drumrollAudio.currentTime = 0; // Reset to start
    }, 10000); // 10 seconds of drumroll
    return () => {
      clearTimeout(animationTimeout);
    };
  }, [drumrollAudio]);


  useEffect(() => {
    // Start drumroll sound
    drumrollAudio.play();

    // Animate dots
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Animate drumsticks
    const drumstickInterval = setInterval(() => {
      setDrumsticks(prev => prev === 'left' ? 'right' : 'left');
    }, 100);

    // Set timeout for the entire animation
    const animationTimeout = setTimeout(() => {
      clearInterval(dotInterval);
      clearInterval(drumstickInterval); 
      onComplete();
    }, 8000); // 8 seconds of drumroll

    return () => {
      clearInterval(dotInterval);
      clearInterval(drumstickInterval);
      clearTimeout(animationTimeout);
    };
  }, [drumrollAudio, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
        
        {/* Main content */}
        <div className="py-12">
          <div className="w-48 h-48 mx-auto mb-8 relative">
            {/* Animated drum icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl">🥁</div>
            </div>
            
            {/* Drumsticks */}
            <div className={`absolute inset-0 flex items-center justify-center ${
              drumsticks === 'left' ? '-rotate-45' : 'rotate-45'
            } transition-transform duration-100`}>
              <div className="text-6xl transform -translate-y-12">🥢</div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
            Drawing Winner
          </h2>
          
          <p className="text-2xl font-medium text-gray-700">
            Get ready{dots}
          </p>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-purple-400 rounded-tl-2xl"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-pink-400 rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-pink-400 rounded-bl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-400 rounded-br-2xl"></div>
        
        {/* Animated sparkles */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
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

export default DrumrollAnimation;