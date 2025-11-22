import { CheckCircle2 } from 'lucide-react';

// Este componente no necesita props ya que es el final del flujo.
export function PaymentSuccess() {
    return (
        <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">
            <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-xl">
                <div className="text-center">
                    
                    {/* ICONO DE ÉXITO */}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full mb-6 mx-auto">
                        <CheckCircle2 className="w-12 h-12 text-green-700" />
                    </div>
                    
                    <h2 className="text-4xl font-bold mb-3 text-green-800">
                        ¡Pago Exitoso!
                    </h2>
                    
                    <p className="text-lg text-gray-700 mb-8">
                        Tu taza está siendo preparada. ¡Gracias por tu compra!
                    </p>
                    
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 max-w-sm mx-auto">
                        <p className="font-semibold text-green-700">
                            ID de Transacción: 
                        </p>
                        <p className="text-sm text-green-600 truncate">
                            {crypto.randomUUID().substring(0, 15)}...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}