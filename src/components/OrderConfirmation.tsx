import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, X, Check, Loader2, Ruler, RotateCw } from 'lucide-react';
import { createOrder } from '../firebase/client';
// import { CreditCard } from './ui/CreditCard'; // <--- YA NO LO NECESITAMOS AQUÍ
import { Mug3D } from './ui/Mug3D'; // <--- ESTE ES EL BUENO

interface OrderConfirmationProps {
  imageUrl: string;
  onCancel: () => void;
  onConfirm: (orderId: string) => void;
  adjustments: any;
}

export function OrderConfirmation({ imageUrl, onCancel, onConfirm, adjustments }: OrderConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const orderDetails = {
    product: 'Taza Personalizada',
    material: 'Cerámica blanca',
    size: '11 oz',
    printArea: '20 cm x 9.5 cm',
    finish: 'Sublimación premium',
    price: 150.00,
    estimatedTime: '5-10 minutos'
  };

  const tax = orderDetails.price * 0.16;
  const total = orderDetails.price + tax;

  const handleConfirm = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const orderData = {
        product: orderDetails.product,
        details: {
          material: orderDetails.material,
          size: orderDetails.size,
          printArea: orderDetails.printArea,
          finish: orderDetails.finish
        },
        designAdjustments: adjustments,
        pricing: {
          subtotal: orderDetails.price,
          tax: tax,
          total: total
        },
        imageUrl: imageUrl,
        paymentStatus: 'pending',
        status: 'created'
      };

      console.log("Creando orden en Firebase...", orderData);
      const orderId = await createOrder(orderData);
      onConfirm(orderId);

    } catch (error) {
      console.error("Error al confirmar:", error);
      alert("Hubo un error al guardar tu pedido. Intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // min-h-screen y centrado vertical/horizontal
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white font-sans overflow-y-auto">
      {/* CAMBIO 1: Reducir max-w-4xl a max-w-3xl para un ancho más compacto */}
      {/* CAMBIO 2: Reducir padding de p-6 sm:p-8 a p-4 sm:p-6 */}
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 my-8">
        <div className="text-center mb-6">
          {/* CAMBIO 3: Reducir encabezados */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-[#004030]">
            Confirma tu Pedido
          </h2>
          <p className="text-gray-500 text-sm">Revisa los detalles antes de proceder al pago</p>
        </div>

        {/* Diseño de rejilla: una columna por defecto, dos columnas en md */}
        {/* CAMBIO 4: Reducir el gap de gap-8 md:gap-12 a gap-6 md:gap-8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          
          {/* --- VISTA PREVIA 3D (LA TAZA) --- */}
          <div className="space-y-4">
            {/* CAMBIO 5: Altura de la vista 3D: h-72 en móvil, h-80 en desktop (antes era h-[400px]) */}
            <div className="bg-gray-50 rounded-3xl p-0 border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden shadow-inner h-72 md:h-80">
              
              {/* Etiqueta Flotante */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-[#004030] z-10 border border-gray-200 shadow-sm flex items-center gap-1">
                <RotateCw className="w-3 h-3" /> VISTA 3D
              </div>

              {/* AQUÍ ESTÁ LA MAGIA: EL COMPONENTE 3D */}
              <Mug3D imageUrl={imageUrl} />
              
            </div>
            
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
              <RotateCw className="w-3 h-3" />
              Arrastra para girar la taza
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-3">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
              <p className="text-xs text-green-800 font-medium">
                Tu diseño ha sido optimizado para impresión en sublimación de alta calidad.
              </p>
            </div>
          </div>

          {/* Detalles del pedido y Pago */}
          {/* CAMBIO 6: Reducir espacio entre secciones de 6 a 4 */}
          <div className="space-y-4">
            {/* CAMBIO 7: Reducir padding de p-6 a p-4 */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <h3 className="mb-3 text-base font-bold text-[#004030] flex items-center gap-2">
                <span className="bg-[#004030] w-2 h-5 rounded-full"></span>
                Detalles del Producto
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center pb-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Producto:</span>
                  <span className="text-gray-900 font-bold">{orderDetails.product}</span>
                </div>
                <div className="flex justify-between items-center pb-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Material:</span>
                  <span className="text-gray-900">{orderDetails.material}</span>
                </div>
                <div className="flex justify-between items-center pb-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Tamaño:</span>
                  <span className="text-gray-900">{orderDetails.size}</span>
                </div>
                {/* --- AREA DE IMPRESIÓN --- */}
                  <div className="flex justify-between items-center pb-1 border-b border-gray-50 bg-blue-50 -mx-4 px-4 py-2">
                    <span className="text-blue-700 font-medium flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> Área de impresión:
                    </span>
                    <span className="text-blue-900 font-bold">{orderDetails.printArea}</span>
                  </div>
                <div className="flex justify-between items-center pb-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Acabado:</span>
                  <span className="text-gray-900">{orderDetails.finish}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 font-medium">Tiempo estimado:</span>
                  <span className="text-gray-900 font-bold text-green-600">{orderDetails.estimatedTime}</span>
                </div>
              </div>
            </div>
            
            {/* CAMBIO 7: Reducir padding de p-6 a p-4 */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <h3 className="mb-3 text-base font-bold text-[#004030] flex items-center gap-2">
                  <span className="bg-[#004030] w-2 h-5 rounded-full"></span>
                Resumen de Pago
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-900 font-medium">${orderDetails.price.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">IVA (16%):</span>
                  <span className="text-gray-900 font-medium">${tax.toFixed(2)} MXN</span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between items-center text-lg pt-1">
                  <span className="font-bold text-[#004030]">Total:</span>
                  <span className="font-extrabold text-[#004030]">
                    ${total.toFixed(2)} MXN
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-start gap-3">
                <div className="text-yellow-600 mt-0.5 font-bold text-sm">Nota:</div>
              <p className="text-xs text-yellow-800 leading-relaxed">
                Una vez confirmado el pedido, se iniciará el proceso de producción inmediatamente.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={isProcessing}
                className="py-4 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold text-sm transition-all"
              >
                <X className="w-4 h-4 mr-1.5" />
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="py-4 rounded-xl text-white hover:bg-[#003024] font-bold text-sm transition-all shadow-lg shadow-green-900/20"
                style={{ backgroundColor: '#004030' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    Confirmar y Pagar
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}