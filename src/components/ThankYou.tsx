import { CheckCircle2, Package, RefreshCw } from 'lucide-react';
// ELIMINADA: import { Button } from './ui/button'; // Reemplazamos por botón HTML estándar

interface ThankYouProps {
    onRestart: () => void;
}

export function ThankYou({ onRestart }: ThankYouProps) {
    return (
        <div className="h-screen flex flex-col items-center justify-center p-6 bg-gray-100 w-full"> 
            <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-gray-200 p-10 shadow-2xl">
                <div className="text-center">
                    
                    {/* ICONO DE ÉXITO */}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 mx-auto">
                        <CheckCircle2 className="w-16 h-16 text-green-700" />
                    </div>
                    
                    <h2 className="text-4xl font-extrabold mb-5 text-green-800">
                        ¡Gracias por tu compra!
                    </h2>
                    
                    {/* SECCIÓN DE RECOLECCIÓN */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-start gap-4 text-left max-w-lg mx-auto">
                            <Package className="w-7 h-7 flex-shrink-0 mt-1 text-green-700" />
                            <div>
                                <p className="text-lg font-semibold mb-1 text-green-800">
                                    Recoge tu pedido en la zona de entrega
                                </p>
                                <p className="text-sm text-green-600">
                                    Tu taza personalizada estará lista en aproximadamente 5-10 minutos.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* NÚMERO DE ORDEN */}
                    <div className="bg-white border-b border-gray-200 py-3 mb-6 max-w-xs mx-auto">
                        <p className="text-sm text-gray-700 font-medium">
                            <span className='font-bold text-gray-800'>Número de Orden:</span> #TZ-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                        </p>
                    </div>

                    {/* BOTÓN DE REINICIO */}
                    <div className="flex flex-col items-center gap-3 mt-8">
                        <p className="text-base text-gray-600">¿Deseas personalizar otro producto?</p>
                        
                        <button
                            onClick={onRestart}
                            className="flex items-center justify-center w-full max-w-xs py-3 px-6 text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.01]"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Iniciar Nuevo Pedido
                        </button>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-200">
                        <p className="text-gray-500 text-sm">
                            ¡Esperamos que disfrutes tu taza personalizada!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}