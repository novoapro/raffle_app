import { useState } from 'react';

interface SidebarProps {
  onManagePrizes: () => void;
  onOpenSettings: () => void;
}

const Sidebar = ({ onManagePrizes, onOpenSettings }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${
        isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-3rem)]'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Main sidebar content */}
      <div className="bg-jungle-green/90 backdrop-blur-sm rounded-l-xl shadow-jungle p-4 space-y-4">
        <button
          onClick={onManagePrizes}
          className="whitespace-nowrap px-4 py-3 bg-white/10 hover:bg-white/20 
                   text-white rounded-xl transition-all font-headline tracking-wide 
                   flex items-center gap-3 w-full hover:translate-x-1 duration-300"
        >
          <span className="text-xl">🎁</span>
          <span className="min-w-[7rem]">Manage Prizes</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="whitespace-nowrap px-4 py-3 bg-white/10 hover:bg-white/20 
                   text-white rounded-xl transition-all font-headline tracking-wide 
                   flex items-center gap-3 w-full hover:translate-x-1 duration-300"
        >
          <span className="text-xl">⚙️</span>
          <span className="min-w-[7rem]">Settings</span>
        </button>
      </div>

      {/* Handle */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full 
                 h-24 w-12 bg-jungle-green/90 backdrop-blur-sm rounded-l-xl shadow-jungle 
                 flex items-center justify-center cursor-pointer hover:bg-jungle-green 
                 transition-colors duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-white flex flex-col items-center gap-1">
          <span className="text-2xl">🌿</span>
          <span className="font-headline tracking-wide rotate-180" style={{ writingMode: 'vertical-rl' }}>
            Menu
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
