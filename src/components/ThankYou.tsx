import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface ThankYouProps {
  onRestart: () => void;
  orderId: string;
}

export function ThankYou({ onRestart, orderId }: ThankYouProps) {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">

      <div className="max-w-3xl w-full bg-white rounded-3xl border-2 border-gray-200 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6">
            <CheckCircle2 className="w-16 h-16" style={{ color: '#004030' }} />
          </div>
          
          <h2 className="text-4xl mb-5" style={{ color: '#004030' }}>
            ¡Gracias por tu compra!
          </h2>
          
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3 text-left max-w-xl mx-auto">
              <Package className="w-7 h-7 flex-shrink-0 mt-1" style={{ color: '#004030' }} />
              <div>
                <p className="text-base mb-2" style={{ color: '#004030' }}>
                  Puedes recoger tu producto en la sección al lado del kiosco
                </p>
                <p className="text-sm text-gray-600">
                  Tu taza personalizada estará lista en aproximadamente 5-10 minutos
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-w-md mx-auto">
              <p className="text-sm text-gray-700">
                <span style={{ color: '#004030' }}>Número de orden:</span> #{orderId.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-gray-600">¿Deseas personalizar otro producto?</p>
            <Button
              onClick={onRestart}
              className="px-10 py-5 rounded-xl text-white hover:opacity-90"
              style={{ backgroundColor: '#004030' }}
            >
              Regresar al Inicio
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              ¡Esperamos que disfrutes tu taza personalizada!
            </p>
          </div>

          <div id="ticket-area" className="hidden print:block">
            <h3>CUSTOM BUY</h3>
            <p>Orden: #{orderId}</p>
            <p>Total: $174.00</p>
            <p>Gracias por su compra</p>
          </div>
        </div>
      </div>
    </div>
  );
}
