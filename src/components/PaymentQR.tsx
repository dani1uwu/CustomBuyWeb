import { useEffect } from 'react';
import { CreditCard, ScanLine, Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

// Para recibir el ID de la orden desde App.tsx
interface PaymentQRProps {
  onPaymentComplete: () => void;
  orderId?: string; // Hacemos opcional por si acaso, pero debería llegar siempre
}

export function PaymentQR({ onPaymentComplete, orderId }: PaymentQRProps) {
  
  // URL que abrirá el celular del juez (apunta a nuestra pasarela simulada)
  // Si orderId es null, usamos uno dummy para que no truene
  const paymentUrl = `${window.location.origin}/pay/${orderId || 'demo'}`;

  useEffect(() => {
    if (!orderId) return;

    // --- ESCUCHAR FIREBASE EN TIEMPO REAL ---
    const orderRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      const data = docSnap.data();
      // Si el campo 'paymentStatus' cambia a 'paid', avanzamos
      if (data && data.paymentStatus === 'paid') {
        onPaymentComplete();
      }
    });

    return () => unsubscribe();
  }, [orderId, onPaymentComplete]);

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full bg-white rounded-3xl border-2 border-gray-200 p-8 text-center shadow-sm">
        
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
          <CreditCard className="w-10 h-10 text-[#004030]" />
        </div>

        <h2 className="text-3xl mb-2 font-bold" style={{ color: '#004030' }}>
          Pago de tu Taza
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          Escanea para completar el pago seguro
        </p>

        {/* QR Generado Localmente (Instantáneo y Seguro) */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-[#004030]">
             <QRCode value={paymentUrl} size={220} fgColor="#004030" />
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-left">
          <div className="flex items-center gap-2 mb-3">
            <ScanLine className="w-4 h-4 text-[#004030]" />
            <span className="text-sm font-bold text-gray-700">Instrucciones:</span>
          </div>
          <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
            <li>Abre la cámara de tu celular.</li>
            <li>Escanea el código QR.</li>
            <li>Ingresa tus datos de pago en el portal seguro.</li>
            <li>La orden se confirmará automáticamente.</li>
          </ol>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-2xl font-bold text-[#004030]">Total: $174.00 MXN</p>
          <p className="text-xs text-gray-400 mt-1 font-mono">Orden: #{orderId?.slice(-6)}</p>
        </div>

      </div>
    </div>
  );
}