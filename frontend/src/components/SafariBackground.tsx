import React from 'react';

interface SafariBackgroundProps {
  children: React.ReactNode;
}

const SafariBackground: React.FC<SafariBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-full h-full bg-jungle-deep-green"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        opacity={0.3}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <g id="canopy-leaf" fill="#1A4314" opacity="0.3">
        <path d="M50 0 C 20 20, 20 80, 50 100 C 80 80, 80 20, 50 0 Z M 50 10 C 30 25, 30 75, 50 90 C 70 75, 70 25, 50 10 Z" />
        <path d="M50 0 C 40 30, 40 70, 50 100" stroke="#2C5E1A" strokeWidth="2" fill="none" opacity="0.5" />
          </g>
          
            <g id="vine" stroke="#4A3728" strokeWidth="2" fill="none" opacity="0.25">
            <path d="M0 0 Q 20 50, 0 100 T -20 200 Q 0 250, 20 300" />
            </g>
            
            <g id="fern" fill="#2D5A27" opacity="0.25">
            <path d="M0,100 C 20,-20 80,-20 100,100 L 90,100 C 75,0 25,0 10,100 Z" />
            <path d="M50,0 L 50,100" stroke="#1B4721" strokeWidth="1" />
            <path d="M50,20 L 80,35 M50,40 L 20,55 M50,60 L 80,75 M50,80 L 20,95" stroke="#1B4721" strokeWidth="1" />
            </g>

            <g id="broad-leaf" fill="#3E721D" opacity="0.2">
            <path d="M0 50 C 25 0, 75 0, 100 50 C 75 100, 25 100, 0 50 Z" />
            </g>
          </defs>

          {/* Background layer - Grid-based distribution */}
          {Array.from({ length: 150 }).map((_, i) => {
            const cols = 15;
            const rows = 10;
            const cellWidth = 800 / cols;
            const cellHeight = 600 / rows;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * cellWidth + Math.random() * cellWidth;
            const y = row * cellHeight + Math.random() * cellHeight;
            return (
            <use
              key={`bg-leaf-${i}`}
              href="#canopy-leaf"
              transform={`translate(${x}, ${y}) scale(${0.15 + Math.random() * 0.2}) rotate(${Math.random() * 360})`}
              style={{ fill: '#1B4721', opacity: 0.1 + Math.random() * 0.1 }}
            />
            );
          })}

          {/* Mid-ground layer - Ferns */}
          {Array.from({ length: 80 }).map((_, i) => {
            const cols = 10;
            const rows = 8;
            const cellWidth = 800 / cols;
            const cellHeight = 500 / rows;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * cellWidth + Math.random() * cellWidth;
            const y = 100 + row * cellHeight + Math.random() * cellHeight;
            return (
            <use
              key={`mid-fern-${i}`}
              href="#fern"
              transform={`translate(${x}, ${y}) scale(${0.2 + Math.random() * 0.3}) rotate(${-15 + Math.random() * 30})`}
            />
            );
          })}
          
          {/* Mid-ground layer - Broad leaves */}
          {Array.from({ length: 120 }).map((_, i) => {
            const cols = 12;
            const rows = 10;
            const cellWidth = 800 / cols;
            const cellHeight = 600 / rows;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * cellWidth + Math.random() * cellWidth;
            const y = row * cellHeight + Math.random() * cellHeight;
            return (
            <use
              key={`mid-leaf-${i}`}
              href="#broad-leaf"
              transform={`translate(${x}, ${y}) scale(${0.15 + Math.random() * 0.3}) rotate(${Math.random() * 360})`}
            />
            );
          })}

          {/* Foreground layer - Vines */}
          {Array.from({ length: 15 }).map((_, i) => {
            const cellWidth = 800 / 15;
            const x = i * cellWidth + Math.random() * cellWidth;
            const y = Math.random() * -200; // Start from above the viewport
            return (
            <use
              key={`vine-${i}`}
              href="#vine"
              transform={`translate(${x}, ${y}) scale(${0.3 + Math.random() * 0.3}) rotate(${-10 + Math.random() * 20})`}
            />
            );
          })}
          
          {/* Top canopy */}
          {Array.from({ length: 30 }).map((_, i) => {
            const cellWidth = 800 / 30;
            const x = i * cellWidth + Math.random() * cellWidth;
            const y = Math.random() * 100 - 50;
            return (
            <use
              key={`fg-leaf-${i}`}
              href="#canopy-leaf"
              transform={`translate(${x}, ${y}) scale(${0.5 + Math.random() * 0.5}) rotate(${140 + Math.random() * 80})`}
              style={{ opacity: 0.2 + Math.random() * 0.1 }}
            />
            );
          })}

          {/* Bottom ground cover */}
          {Array.from({ length: 40 }).map((_, i) => {
            const cellWidth = 800 / 40;
            const x = i * cellWidth + Math.random() * cellWidth;
            const y = 520 + Math.random() * 80;
            return (
            <use
              key={`fg-fern-${i}`}
              href="#fern"
              transform={`translate(${x}, ${y}) scale(${0.4 + Math.random() * 0.4}) rotate(${-10 + Math.random() * 20})`}
              style={{ opacity: 0.25 + Math.random() * 0.1 }}
            />
            );
          })}
      </svg>
      <div className="bg-gradient-to-t from-jungle-green/30 via-jungle-coral/20 to-jungle-olive/10 fixed inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default SafariBackground;
