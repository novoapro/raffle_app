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
      <div className="bg-white rounded-l-lg shadow-lg p-4 space-y-4">
        <button
          onClick={onManagePrizes}
          className="whitespace-nowrap px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg transition-colors font-medium flex items-center gap-3 w-full"
        >
          <span className="text-xl">🎁</span>
          <span className="min-w-[7rem]">Manage Prizes</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="whitespace-nowrap px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg transition-colors font-medium flex items-center gap-3 w-full"
        >
          <span className="text-xl">⚙️</span>
          <span className="min-w-[7rem]">Settings</span>
        </button>
      </div>

      {/* Handle */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full h-24 w-12 bg-white rounded-l-lg shadow-lg flex items-center justify-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-gray-600 flex flex-col items-center gap-1">
          <span className="text-xl">☰</span>
          <span className="text-xs font-medium rotate-180" style={{ writingMode: 'vertical-rl' }}>
            Menu
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;