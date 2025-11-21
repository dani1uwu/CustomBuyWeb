import { useEffect } from 'react';
import logo from '../assets/Logo.png';

interface SplashScreenProps {
  onLoadComplete: () => void;
}

export function SplashScreen({ onLoadComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-10">
          <img 
            src={logo} 
            alt="Custom Buy Logo" 
            className="w-64 mx-auto mb-6 animate-pulse"
          />
        </div>

        {/* Barra de progreso */}
        <div className="mt-10">
          <div className="w-96 h-2 bg-gray-100 rounded-full overflow-hidden mx-auto">
            <div className="h-full rounded-full animate-progress-bar" style={{ backgroundColor: '#004030' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-bar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .animate-progress-bar {
          animation: progress-bar 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
