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
    <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card max-w-2xl w-full text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
        <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
        <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
        
        {/* Main content */}
        <div className="py-12">
          <div className="w-48 h-48 mx-auto mb-8 relative">
            {/* Animated drum icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl animate-bounce">🥁</div>
            </div>
            
            {/* Drumsticks */}
            <div className={`absolute inset-0 flex items-center justify-center ${
              drumsticks === 'left' ? '-rotate-45' : 'rotate-45'
            } transition-transform duration-100`}>
              <div className="text-6xl transform -translate-y-12">🥢</div>
            </div>
          </div>
          
          <h2 className="safari-title mb-4 animate-pulse">
            Drawing Winner
          </h2>
          
          <p className="jungle-accent text-2xl">
            The safari drums are rolling{dots}
          </p>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-jungle-green rounded-tl-2xl"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-jungle-gold rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-jungle-gold rounded-bl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-jungle-green rounded-br-2xl"></div>
        
        {/* Animated jungle elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-sway"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
              }}
            >
              {['🌿', '🍃', '🌴', '🦁', '🐘', '🦒', '🦓', '🦍'][i]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrumrollAnimation;
