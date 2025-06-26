interface ToastProps {
  message: string;
  type: 'error' | 'success';
}

const Toast = ({ message, type }: ToastProps) => {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}>
        {message}
      </div>
    </div>
  );
};

export default Toast;