import { useState } from 'react';
import { Upload, Bluetooth, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface SendImageProps {
  onImageSent: (imageUrl: string) => void;
}

export function SendImage({ onImageSent }: SendImageProps) {
  const [isReceiving, setIsReceiving] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleReceiveImage = () => {
    setIsReceiving(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onImageSent('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">
    
      <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-gray-200 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-5">
            {isReceiving && progress < 100 ? (
              <Bluetooth className="w-10 h-10 animate-pulse" style={{ color: '#004030' }} />
            ) : progress === 100 ? (
              <CheckCircle2 className="w-10 h-10" style={{ color: '#004030' }} />
            ) : (
              <Upload className="w-10 h-10" style={{ color: '#004030' }} />
            )}
          </div>

          <h2 className="text-3xl mb-3" style={{ color: '#004030' }}>
            Enviar Imagen
          </h2>
          
          {!isReceiving && (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Envía tu imagen desde tu dispositivo móvil
              </p>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2">Instrucciones:</p>
                <ol className="text-left text-xs text-gray-600 space-y-1 max-w-md mx-auto">
                  <li>1. Abre tu galería de fotos</li>
                  <li>2. Selecciona la imagen que deseas</li>
                  <li>3. Comparte vía Bluetooth o QR</li>
                  <li>4. Selecciona "Kiosco Personalización"</li>
                </ol>
              </div>
              <Button
                onClick={handleReceiveImage}
                className="px-10 py-5 rounded-xl text-white hover:opacity-90"
                style={{ backgroundColor: '#004030' }}
              >
                Listo para Recibir
              </Button>
            </>
          )}

          {isReceiving && progress < 100 && (
            <div className="space-y-5">
              <p className="text-sm text-gray-600">
                Recibiendo imagen...
              </p>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full transition-all duration-300 ease-out rounded-full"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: '#004030'
                  }}
                />
              </div>
              <p className="text-xl" style={{ color: '#004030' }}>{progress}%</p>
            </div>
          )}

          {progress === 100 && (
            <div className="space-y-3">
              <p className="text-base" style={{ color: '#004030' }}>
                ¡Imagen recibida exitosamente!
              </p>
              <p className="text-sm text-gray-600">Redirigiendo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
