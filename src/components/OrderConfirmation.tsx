import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, X, Check, Loader2 } from 'lucide-react'; 
import { ImageWithFallback } from './figma/ImageWithFallback';
import { createOrder } from '../firebase/client'; 

interface OrderConfirmationProps {
  imageUrl: string;
  onCancel: () => void;
  onConfirm: (orderId: string) => void;
  adjustments: any; // <--- NUEVO: Recibimos los ajustes (zoom, posición)
}

export function OrderConfirmation({ imageUrl, onCancel, onConfirm, adjustments }: OrderConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const orderDetails = {
    product: 'Taza Personalizada',
    material: 'Cerámica blanca',
    size: '11 oz',
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
      // 1. Preparamos el objeto COMPLETO para la Base de Datos
      const orderData = {
        product: orderDetails.product,
        details: {
          material: orderDetails.material,
          size: orderDetails.size,
          finish: orderDetails.finish
        },
        // Guardamos los ajustes técnicos por si producción los necesita
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

      // 2. Guardar en Firebase
      //console.log("Creando orden en Firebase...", orderData);
      const orderId = await createOrder(orderData);

      // 3. Avanzar
      onConfirm(orderId);

    } catch (error) {
      console.error("Error al confirmar:", error);
      alert("Hubo un error al guardar tu pedido. Intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-white overflow-hidden">
      <div className="max-w-7xl w-full bg-white rounded-3xl border-2 border-gray-200 p-5">
        <div className="text-center mb-4">
          <h2 className="text-3xl mb-1" style={{ color: '#004030' }}>
            Confirma tu Pedido
          </h2>
          <p className="text-xs text-gray-600">Revisa los detalles antes de proceder al pago</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Vista previa del producto */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="mb-3 text-center text-sm" style={{ color: '#004030' }}>
                Vista Previa
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-white rounded-lg shadow-xl flex items-center justify-center overflow-hidden border-4 border-gray-200">
                    <ImageWithFallback
                      src={imageUrl}
                      alt="Diseño personalizado"
                      className="max-w-[70%] max-h-[70%] object-contain"
                      // Opcional: Podrías aplicar los estilos aquí también si quisieras simularlo igual
                    />
                  </div>
                  <div className="mt-2 text-center text-xs text-gray-600">
                    Tu diseño en la taza
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 rounded-xl p-3 flex items-start gap-2" style={{ borderColor: '#004030' }}>
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#004030' }} />
              <p className="text-xs text-gray-700">
                Tu diseño ha sido optimizado para impresión en sublimación de alta calidad
              </p>
            </div>
          </div>

          {/* Detalles del pedido */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <h3 className="mb-3 text-sm" style={{ color: '#004030' }}>
                Detalles del Producto
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600">Producto:</span>
                  <span className="text-xs text-gray-800">{orderDetails.product}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600">Material:</span>
                  <span className="text-xs text-gray-800">{orderDetails.material}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600">Tamaño:</span>
                  <span className="text-xs text-gray-800">{orderDetails.size}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600">Acabado:</span>
                  <span className="text-xs text-gray-800">{orderDetails.finish}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Tiempo estimado:</span>
                  <span className="text-xs text-gray-800">{orderDetails.estimatedTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <h3 className="mb-3 text-sm" style={{ color: '#004030' }}>
                Resumen de Pago
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Subtotal:</span>
                  <span className="text-xs text-gray-800">${orderDetails.price.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">IVA (16%):</span>
                  <span className="text-xs text-gray-800">${tax.toFixed(2)} MXN</span>
                </div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between items-center text-base pt-1">
                  <span style={{ color: '#004030' }}>Total:</span>
                  <span style={{ color: '#004030' }}>
                    ${total.toFixed(2)} MXN
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3">
              <p className="text-xs text-gray-700">
                <span className="font-medium">Nota:</span> Una vez confirmado el pedido, no se podrán realizar cambios.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={isProcessing}
                className="py-5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="py-5 rounded-xl text-white hover:opacity-90 text-sm"
                style={{ backgroundColor: '#004030' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    Confirmar y Pagar
                    <ArrowRight className="w-4 h-4 ml-2" />
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