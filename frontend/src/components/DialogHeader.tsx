import React from 'react';

interface DialogHeaderProps {
    title: string;
    message?: string;
    onClose?: () => void;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({
    title,
    message,
    onClose,
}) => {
    return (
        <div className="relative p-2 mb-2 border-b-2 border-jungle-leaf/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
            <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
            <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
            <div className='flex justify-between items-center w-full pl-10 pr-10 mb-2 mt-2'>
                <div className="flex flex-col">
                    <h3 className="safari-title text-3xl">{title}</h3>
                    <p className="text-gray-600">{message}</p>
                </div>
                {onClose && (
                    <div>
                        <button
                            onClick={onClose}
                            className="btn-secondary bg-jungle-brown/10 text-jungle-brown hover:bg-jungle-brown/20"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DialogHeader;
