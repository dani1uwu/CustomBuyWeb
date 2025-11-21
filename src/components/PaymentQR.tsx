import { useState } from 'react';
import { QrCode, CheckCircle2, CreditCard } from 'lucide-react';

interface PaymentQRProps {
  onPaymentComplete: () => void;
}

export function PaymentQR({ onPaymentComplete }: PaymentQRProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      onPaymentComplete();
    }, 2500);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">
 

      <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-gray-200 p-8">
        <div className="text-center">
          {!isScanning ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-5">
                <CreditCard className="w-10 h-10" style={{ color: '#004030' }} />
              </div>
              
              <h2 className="text-3xl mb-3" style={{ color: '#004030' }}>
                Pago de tu Taza
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Escanea el código QR para completar tu pago
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6 inline-block border-2 border-gray-200">
                {/* QR Code simulado */}
                <div 
                  className="w-56 h-56 bg-white border-4 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  style={{ borderColor: '#004030' }}
                  onClick={handleScan}
                >
                  <QrCode className="w-44 h-44" style={{ color: '#004030' }} />
                </div>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 max-w-md mx-auto mb-4">
                <p className="mb-2 text-xs text-gray-700">Instrucciones de pago:</p>
                <ol className="text-left text-xs text-gray-600 space-y-1">
                  <li>1. Abre tu app de pagos móviles</li>
                  <li>2. Escanea el código QR</li>
                  <li>3. Confirma el monto: $174.00 MXN</li>
                  <li>4. Completa el pago</li>
                </ol>
              </div>

              <div className="text-2xl" style={{ color: '#004030' }}>
                Total: $174.00 MXN
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-5">
                <CheckCircle2 className="w-10 h-10 animate-pulse" style={{ color: '#004030' }} />
              </div>
              
              <h2 className="text-3xl mb-3" style={{ color: '#004030' }}>
                Procesando Pago
              </h2>
              <p className="text-sm text-gray-600">
                Verificando tu pago...
              </p>
              
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#004030', animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#004030', animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#004030', animationDelay: '300ms' }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
