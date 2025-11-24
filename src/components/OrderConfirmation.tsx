import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, X, Check, Loader2, Ruler } from 'lucide-react'; 
import { createOrder } from '../firebase/client'; 
import { CreditCard } from './ui/CreditCard'; // <--- IMPORTAMOS LA TARJETA

interface OrderConfirmationProps {
  imageUrl: string;
  onCancel: () => void;
  onConfirm: (orderId: string) => void;
  adjustments: any;
}

export function OrderConfirmation({ imageUrl, onCancel, onConfirm, adjustments }: OrderConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Datos de la tarjeta ficticia para la vista previa
  const previewCard = {
      cardNumber: "4444555566667777",
      cardHolder: "USUARIO DEMO",
      expiryDate: "12/28",
      cvc: "***"
  };

  const orderDetails = {
    product: 'Taza Personalizada',
    material: 'Cerámica blanca',
    size: '11 oz',
    // --- NUEVO: Agregamos las dimensiones de sublimación ---
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
          printArea: orderDetails.printArea, // Guardamos este dato también
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
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-white overflow-hidden font-sans">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-[#004030]">
            Confirma tu Pedido
          </h2>
          <p className="text-gray-500">Revisa los detalles antes de proceder al pago</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* VISTA PREVIA (Ahora con la Tarjeta 3D) */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#004030]"></div>
              <h3 className="mb-6 text-center font-bold text-gray-700 uppercase tracking-wider">
                Vista Previa de tu Método de Pago
              </h3>
              
              {/* COMPONENTE DE TARJETA (Solo lectura) */}
              <div className="pointer-events-none transform scale-90 sm:scale-100">
                  <CreditCard 
                      cardNumber={previewCard.cardNumber}
                      cardHolder={previewCard.cardHolder}
                      expiryDate={previewCard.expiryDate}
                      cvc={previewCard.cvc}
                      isFlipped={false}
                      // Funciones vacías porque es solo lectura
                      onCardNumberChange={() => {}}
                      onCardHolderChange={() => {}}
                      onExpiryChange={() => {}}
                      onCvcChange={() => {}}
                      onCvcFocus={() => {}}
                      onCvcBlur={() => {}}
                      onOtherFocus={() => {}}
                  />
              </div>
               <p className="text-center text-sm text-gray-400 mt-4">Se usará una tarjeta similar para el pago</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
              <p className="text-sm text-green-800 font-medium">
                Tu diseño ha sido optimizado para impresión en sublimación de alta calidad.
              </p>
            </div>
          </div>

          {/* Detalles del pedido */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="mb-4 text-lg font-bold text-[#004030] flex items-center gap-2">
                <span className="bg-[#004030] w-2 h-6 rounded-full"></span>
                Detalles del Producto
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Producto:</span>
                  <span className="text-gray-900 font-bold">{orderDetails.product}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Material:</span>
                  <span className="text-gray-900">{orderDetails.material}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Tamaño:</span>
                  <span className="text-gray-900">{orderDetails.size}</span>
                </div>
                {/* --- NUEVO CAMPO: Área de impresión --- */}
                 <div className="flex justify-between items-center pb-2 border-b border-gray-50 bg-blue-50 -mx-6 px-6 py-2">
                  <span className="text-blue-700 font-medium flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Área de impresión:
                  </span>
                  <span className="text-blue-900 font-bold">{orderDetails.printArea}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Acabado:</span>
                  <span className="text-gray-900">{orderDetails.finish}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 font-medium">Tiempo estimado:</span>
                  <span className="text-gray-900 font-bold text-green-600">{orderDetails.estimatedTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="mb-4 text-lg font-bold text-[#004030] flex items-center gap-2">
                 <span className="bg-[#004030] w-2 h-6 rounded-full"></span>
                Resumen de Pago
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-900 font-medium">${orderDetails.price.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">IVA (16%):</span>
                  <span className="text-gray-900 font-medium">${tax.toFixed(2)} MXN</span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between items-center text-xl pt-1">
                  <span className="font-bold text-[#004030]">Total:</span>
                  <span className="font-extrabold text-[#004030]">
                    ${total.toFixed(2)} MXN
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-start gap-3">
               <div className="text-yellow-600 mt-0.5 font-bold">Nota:</div>
              <p className="text-sm text-yellow-800 leading-relaxed">
                 Una vez confirmado el pedido, se iniciará el proceso de producción inmediatamente y no se podrán realizar cambios.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={isProcessing}
                className="py-6 rounded-2xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold text-base transition-all"
              >
                <X className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="py-6 rounded-2xl text-white hover:bg-[#003024] font-bold text-base transition-all shadow-lg shadow-green-900/20"
                style={{ backgroundColor: '#004030' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    Confirmar y Pagar
                    <ArrowRight className="w-5 h-5 ml-2" />
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