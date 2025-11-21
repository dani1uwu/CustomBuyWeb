import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  onComplete: () => void;
}

export function Timer({ onComplete }: TimerProps) {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [seconds, onComplete]);

  const progress = ((10 - seconds) / 10) * 100;

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">

      <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-gray-200 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
            <Clock className="w-10 h-10" style={{ color: '#004030' }} />
          </div>
          
          <h2 className="text-3xl mb-3" style={{ color: '#004030' }}>
            Preparando tu pedido
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Por favor espera mientras procesamos tu diseño
          </p>

          <div className="relative w-52 h-52 mx-auto mb-6">
            {/* Círculo de progreso */}
            <svg className="w-52 h-52 transform -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="92"
                stroke="#f3f4f6"
                strokeWidth="14"
                fill="none"
              />
              <circle
                cx="104"
                cy="104"
                r="92"
                stroke="#004030"
                strokeWidth="14"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 92}`}
                strokeDashoffset={`${2 * Math.PI * 92 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            
            {/* Número en el centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-1" style={{ color: '#004030' }}>
                  {seconds}
                </div>
                <div className="text-sm text-gray-600">segundos</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#004030', animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#004030', animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#004030', animationDelay: '300ms' }} />
            </div>
            <p className="text-sm text-gray-600">Procesando imagen...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
