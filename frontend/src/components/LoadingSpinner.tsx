const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-jungle-brown/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-jungle-beige rounded-xl shadow-jungle p-8 relative overflow-hidden">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-jungle-leaf border-t-jungle-gold"></div>
        
        {/* Decorative leaves */}
        <div className="absolute -top-2 -left-2 text-2xl animate-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
        <div className="absolute -bottom-2 -right-2 text-2xl animate-sway" style={{ animationDelay: '0s' }}>🌿</div>
        
        {/* Loading text */}
        <p className="mt-4 font-headline text-jungle-brown text-lg text-center animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
