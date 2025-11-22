import { useEffect, useState } from 'react';
import { QrCode, Smartphone, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Button } from './ui/button';
import QRCode from 'react-qr-code';

interface SendImageProps {
  onImageSent: (imageUrl: string) => void;
  onCancel: () => void; // Nueva prop para cancelar
}

export function SendImage({ onImageSent, onCancel }: SendImageProps) {
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'received'>('loading');
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  // Función para iniciar una sesión nueva
  const startSession = async () => {
    setStatus('loading');
    setTimeoutWarning(false);
    
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);

    const sessionRef = doc(db, 'sessions', newSessionId);
    await setDoc(sessionRef, { status: 'waiting', imageUrl: null });
    
    setStatus('ready');
    return sessionRef;
  };

  useEffect(() => {
    let unsubscribe = () => {};

    const init = async () => {
      const sessionRef = await startSession();

      // Suscribirse a cambios
      unsubscribe = onSnapshot(sessionRef, (docSnap) => {
        const data = docSnap.data();
        if (data && data.imageUrl) {
          setStatus('received');
          setTimeout(() => {
            onImageSent(data.imageUrl);
          }, 1500);
        }
      });
    };

    init();

    // --- TEMPORIZADOR DE SEGURIDAD ---
    // Si en 60 segundos no ha pasado nada, mostramos advertencia
    const timer = setTimeout(() => {
      setTimeoutWarning(true);
    }, 60000); // 60 segundos

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [onImageSent]);

  // La URL que abrirá el celular
  const uploadUrl = `${window.location.origin}/upload/${sessionId}`;

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white relative">
      
      {/* Botón de Cancelar (Arriba a la izquierda o flotante) */}
      <div className="absolute top-8 left-8">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Regresar
        </Button>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-gray-200 p-8 text-center">
          
          {/* Icono */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-5">
            {status === 'received' ? (
              <div className="animate-bounce text-green-600">
                <Smartphone className="w-10 h-10" />
              </div>
            ) : (
              <QrCode className="w-10 h-10" style={{ color: '#004030' }} />
            )}
          </div>

          <h2 className="text-3xl mb-2 font-bold" style={{ color: '#004030' }}>
            {status === 'received' ? '¡Imagen Recibida!' : 'Escanea para subir'}
          </h2>
          
          <p className="text-sm text-gray-600 mb-8">
            {status === 'received' 
              ? 'Procesando tu diseño...' 
              : 'Usa la cámara de tu celular para enviar tu foto'}
          </p>

          {/* QR */}
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {status === 'loading' ? (
              <div className="h-[220px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className={`p-4 bg-white rounded-2xl shadow-lg border-2 border-gray-100 transition-all duration-500 ${status === 'received' ? 'opacity-50 scale-95' : 'opacity-100'}`}>
                <QRCode value={uploadUrl} size={220} fgColor="#004030" />
              </div>
            )}

            {/* Estado y Advertencia de Tiempo */}
            {timeoutWarning && status !== 'received' ? (
              <div className="bg-yellow-50 px-4 py-3 rounded-xl border border-yellow-200 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                <span className="text-sm text-yellow-800 font-medium">
                  ¿Tardando mucho? Revisa que estés conectado a internet.
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.location.reload()} // Reinicia el componente simple
                  className="text-xs h-8"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Generar nuevo código
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 px-6 py-3 rounded-full border border-gray-200 flex items-center gap-3">
                {status === 'received' ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium text-green-700">Conexión exitosa</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-600">Esperando conexión...</span>
                  </>
                )}
              </div>
            )}

          </div>
      </div>
    </div>
  );
}