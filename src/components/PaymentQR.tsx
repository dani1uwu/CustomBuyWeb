import { useEffect } from 'react';
import { CreditCard, ScanLine } from 'lucide-react';
import QRCode from 'react-qr-code';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

interface PaymentQRProps {
  onPaymentComplete: () => void;
  orderId?: string;
}

export function PaymentQR({ onPaymentComplete, orderId }: PaymentQRProps) {

  const paymentUrl = `${window.location.origin}/pay/${orderId || 'demo'}`;

  useEffect(() => {
    if (!orderId) return;

    const orderRef = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      const data = docSnap.data();
      if (data && data.paymentStatus === 'paid') {
        onPaymentComplete();
      }
    });

    return () => unsubscribe();
  }, [orderId, onPaymentComplete]);

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="max-w-sm w-full bg-white rounded-3xl border-2 border-gray-200 p-6 text-center shadow-sm">

        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-5">
          <CreditCard className="w-8 h-8 text-[#004030]" />
        </div>

        <h2 className="text-2xl mb-1 font-bold" style={{ color: '#004030' }}>
          Pago de tu Taza
        </h2>

        <p className="text-gray-500 mb-6 text-xs">
          Escanea para completar el pago seguro
        </p>

        {/* QR */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-lg border-2 border-[#004030]">
            <QRCode value={paymentUrl} size={180} fgColor="#004030" />
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-left">
          <div className="flex items-center gap-2 mb-2">
            <ScanLine className="w-4 h-4 text-[#004030]" />
            <span className="text-xs font-bold text-gray-700">Instrucciones:</span>
          </div>
          <ol className="text-[11px] text-gray-600 space-y-1.5 list-decimal list-inside">
            <li>Abre la cámara de tu celular.</li>
            <li>Escanea el código QR.</li>
            <li>Ingresa tus datos de pago en el portal seguro.</li>
            <li>La orden se confirmará automáticamente.</li>
          </ol>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100">
          <p className="text-xl font-bold text-[#004030]">Total: $174.00 MXN</p>
          <p className="text-[10px] text-gray-400 mt-1 font-mono">Orden: #{orderId?.slice(-6)}</p>
        </div>

      </div>
    </div>
  );
}
