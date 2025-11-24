import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { CreditCard } from './ui/CreditCard'; // <--- IMPORTAMOS LA TARJETA NUEVA

export function FakePaymentGateway() {
  const { orderId } = useParams();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Estados para la tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePay = async () => {
    // Validación básica visual
    if (!cardNumber || !cardHolder || !expiry || !cvc) {
      alert("Por favor completa los datos de la tarjeta");
      return;
    }

    if (!orderId) return;

    setProcessing(true);

    setTimeout(async () => {
      try {
        // Actualizar Firebase
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { 
          paymentStatus: 'paid',
          status: 'pending',
          paidAt: new Date()
        });

        setSuccess(true);
      } catch (error) {
        alert("Error de conexión con el servidor de pagos.");
      } finally {
        setProcessing(false);
      }
    }, 2500);
  };

  // Pantalla de Éxito
  if (success) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">¡Pago Exitoso!</h1>
        <p className="text-green-700 text-lg">Tu orden ha sido confirmada.</p>
        <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-green-200">
          <p className="text-sm text-gray-500 mb-1">Referencia de transacción</p>
          <p className="font-mono font-bold text-gray-800">TX-{orderId?.slice(-8).toUpperCase()}</p>
        </div>
        <p className="text-sm text-gray-500 mt-8">Ya puedes ver el estado en el Kiosco.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        {/* Título y Monto */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#004030] mb-1">Pago Seguro</h1>
          <p className="text-gray-500 mb-4">Orden #{orderId?.slice(-6)}</p>
          <div className="text-4xl font-bold text-[#004030]">$174.00 <span className="text-lg font-medium text-gray-500">MXN</span></div>
        </div>

        {/* LA TARJETA INTERACTIVA */}
        <div className="mb-8">
          <CreditCard 
            cardNumber={cardNumber}
            cardHolder={cardHolder}
            expiryDate={expiry}
            cvc={cvc}
            isFlipped={isFlipped}
            onCardNumberChange={(e) => setCardNumber(e.target.value)}
            onCardHolderChange={(e) => setCardHolder(e.target.value)}
            onExpiryChange={(e) => setExpiry(e.target.value)}
            onCvcChange={(e) => setCvc(e.target.value)}
            onCvcFocus={() => setIsFlipped(true)} // Girar al enfocar CVC
            onCvcBlur={() => setIsFlipped(false)} // Volver al salir
            onOtherFocus={() => setIsFlipped(false)} // Volver al enfocar otros
          />
        </div>

        {/* Botón de Pagar */}
        <button 
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-[#004030] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#003024] transition-all disabled:opacity-70 shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {processing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Procesando...
            </>
          ) : (
            "Pagar $174.00"
          )}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-gray-400 mt-6">
          <ShieldCheck className="w-4 h-4" />
          <p className="text-[10px] font-medium">Encriptación de extremo a extremo</p>
        </div>

      </div>
    </div>
  );
}