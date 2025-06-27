import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          buttonClass: 'bg-jungle-coral hover:bg-jungle-coral/90',
          borderClass: 'border-jungle-coral',
          bgClass: 'bg-jungle-coral/10'
        };
      case 'warning':
        return {
          icon: '⚡',
          buttonClass: 'bg-jungle-gold hover:bg-jungle-gold/90',
          borderClass: 'border-jungle-gold',
          bgClass: 'bg-jungle-gold/10'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          buttonClass: 'bg-jungle-green hover:bg-jungle-green/90',
          borderClass: 'border-jungle-green',
          bgClass: 'bg-jungle-green/10'
        };
      default:
        return {
          icon: 'ℹ️',
          buttonClass: 'bg-jungle-green hover:bg-jungle-green/90',
          borderClass: 'border-jungle-green',
          bgClass: 'bg-jungle-green/10'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card max-w-md w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jungle-green via-jungle-gold to-jungle-coral"></div>
        <div className="absolute top-2 left-2 text-2xl animate-sway">🌿</div>
        <div className="absolute top-2 right-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>

        {/* Alert Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full ${styles.bgClass} ${styles.borderClass} border-2 
                        flex items-center justify-center text-3xl animate-bounce`}>
            {styles.icon}
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="safari-title mb-4">{title}</h2>
          <p className="font-body text-jungle-brown">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="btn-secondary bg-jungle-brown/10 text-jungle-brown hover:bg-jungle-brown/20"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn-secondary ${styles.buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
