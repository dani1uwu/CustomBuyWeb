import { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { SplashScreen } from './components/SplashScreen';
import { ProductCatalog } from './components/ProductCatalog';
//import { BluetoothConnection } from './components/BluetoothConnection';
import { SendImage } from './components/SendImage';
import { AdjustImage } from './components/AdjustImage';
import { Timer } from './components/Timer';
import { OrderConfirmation } from './components/OrderConfirmation';
import { PaymentQR } from './components/PaymentQR';
import { ThankYou } from './components/ThankYou';

export type Step = 'welcome' | 'splash' | 'catalog' | 'bluetooth' | 'send' | 'adjust' | 'timer' | 'confirmation' | 'payment' | 'thankyou';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(() => {
    return (localStorage.getItem('cb_step') as Step) || 'welcome';
  });

  useEffect(() => {
    localStorage.setItem('cb_step', currentStep);
  }, [currentStep]);

  const [orderId, setOrderId] = useState<string | null>(null);
  
  // uploadedImage es la imagen local (blob) que el usuario selecciona de su celular
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // ESTADOS NUEVOS: Para guardar lo que regresa Firebase
  const [finalFirebaseUrl, setFinalFirebaseUrl] = useState<string | null>(null);
  const [imageAdjustments, setImageAdjustments] = useState<any>(null);

  const handleStart = () => {
    setCurrentStep('splash');
  };

  const handleLoadComplete = () => {
    setCurrentStep('catalog');
  };

  const handleProductSelect = () => {
    setCurrentStep('send');
  };

  /*const handleBluetoothConnected = () => {
    setCurrentStep('send');
  };*/

  const handleImageSent = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setCurrentStep('adjust');
  };

  const handleCancelImage = () => {
    setUploadedImage(null);
    setCurrentStep('send');
  };

  // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
  // Este método ahora recibe los datos desde AdjustImage.tsx
  const handleContinueToTimer = (firebaseUrl: string, adjustments: any) => {
    console.log("URL de Firebase recibida en App:", firebaseUrl);
    
    setFinalFirebaseUrl(firebaseUrl); // Guardamos la URL de la nube
    setImageAdjustments(adjustments); // Guardamos los ajustes (zoom, rotación)
    
    setCurrentStep('timer');
  };

  const handleTimerComplete = () => {
    setCurrentStep('confirmation');
  };

  const handleCancelOrder = () => {
    setCurrentStep('adjust');
  };

  const handleConfirmOrder = (id: string) => {
    console.log("Orden creada en BD con ID:", id);
    setOrderId(id); // Guardamos el ID por si el componente de Pago lo necesita
    setCurrentStep('payment');
};

  const handlePaymentComplete = () => {
    setCurrentStep('thankyou');
  };

  const handleRestart = () => {
    setUploadedImage(null);
    setFinalFirebaseUrl(null); // Limpiamos también la URL de la nube
    setCurrentStep('welcome');
  };

  if (currentStep === 'confirmation' && !finalFirebaseUrl && !uploadedImage) {
     // Si estamos en confirmación pero no hay foto (por recargar), volver al inicio
     setCurrentStep('welcome');
  }

  return (
    <div className="h-screen overflow-hidden bg-white flex items-center justify-center">
      {currentStep === 'welcome' && (
        <Welcome onStart={handleStart} />
      )}
      {currentStep === 'splash' && (
        <SplashScreen onLoadComplete={handleLoadComplete} />
      )}
      {currentStep === 'catalog' && (
        <ProductCatalog onProductSelect={handleProductSelect} />
      )}
      {/*{currentStep === 'bluetooth' && (
        <BluetoothConnection onConnected={handleBluetoothConnected} />
      )}*/}
      {currentStep === 'send' && (
        <SendImage 
          onImageSent={handleImageSent} 
          onCancel={handleCancelImage}
        />
      )}
      
      {/* Componente de Ajuste actualizado */}
      {currentStep === 'adjust' && uploadedImage && (
        <AdjustImage 
          imageUrl={uploadedImage} 
          onCancel={handleCancelImage}
          onContinue={handleContinueToTimer} // Ahora coincide con la firma requerida
        />
      )}
      
      {currentStep === 'timer' && (
        <Timer onComplete={handleTimerComplete} />
      )}
      
      {/* Componente de Confirmación */}
      {currentStep === 'confirmation' && (
        <OrderConfirmation 
          // Le pasamos la URL de Firebase si existe, si no, la local (como fallback visual)
          imageUrl={finalFirebaseUrl || uploadedImage || ''}
          onCancel={handleCancelOrder}
          onConfirm={handleConfirmOrder}
          adjustments={imageAdjustments}
        />
      )}
      
      {currentStep === 'payment' && (
        <PaymentQR onPaymentComplete={handlePaymentComplete} />
      )}
      {currentStep === 'thankyou' && (
        <ThankYou onRestart={handleRestart}
        orderId={orderId || "Error-ID"} />
      )}
    </div>
  );
}