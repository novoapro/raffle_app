import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
}

const Toast = ({ message, type }: ToastProps) => {
  const bgColor = type === 'error' ? 'bg-jungle-gold' : 'bg-jungle-green';
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Start leave animation 0.7s before unmount (matches enter duration)
    const leaveTimer = setTimeout(() => setLeaving(true), 4300);
    // Unmount after 1s
    const hideTimer = setTimeout(() => setVisible(false), 5000);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  const animateClass = leaving
    ? (type === 'error' ? 'animate-toast-pop-out-error' : 'animate-toast-pop-out-success')
    : (type === 'error' ? 'animate-toast-pop-error' : 'animate-toast-pop-success');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-500 ${animateClass}`}>
        {message}
      </div>
    </div>
  );
};

export default Toast;