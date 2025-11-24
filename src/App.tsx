import { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { SplashScreen } from './components/SplashScreen';
import { ProductCatalog } from './components/ProductCatalog';
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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

  const handleImageSent = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setCurrentStep('adjust');
  };

  // Esta función se usa en "AdjustImage" para cancelar la edición
  const handleCancelImage = () => {
    setUploadedImage(null);
    setCurrentStep('send');
  };

  const handleBackToCatalog = () => {
    setUploadedImage(null); // Limpiamos por si acaso
    setCurrentStep('catalog'); // Regresamos al catálogo
  };

  const handleContinueToTimer = (firebaseUrl: string, adjustments: any) => {
    console.log("URL de Firebase recibida en App:", firebaseUrl);
    setFinalFirebaseUrl(firebaseUrl);
    setImageAdjustments(adjustments);
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
    setOrderId(id);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('thankyou');
  };

  const handleRestart = () => {
    setUploadedImage(null);
    setFinalFirebaseUrl(null);
    setCurrentStep('welcome');
  };

  // Protección por si recargan en la confirmación sin datos
  if (currentStep === 'confirmation' && !finalFirebaseUrl && !uploadedImage) {
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
      
      {currentStep === 'send' && (
        <SendImage 
          onImageSent={handleImageSent} 
          onCancel={handleBackToCatalog}
        />
      )}
      
      {currentStep === 'adjust' && uploadedImage && (
        <AdjustImage 
          imageUrl={uploadedImage} 
          onCancel={handleCancelImage}
          onContinue={handleContinueToTimer}
        />
      )}
      
      {currentStep === 'timer' && (
        <Timer onComplete={handleTimerComplete} />
      )}
      
      {currentStep === 'confirmation' && (
        <OrderConfirmation 
          imageUrl={finalFirebaseUrl || uploadedImage || ''}
          onCancel={handleCancelOrder}
          onConfirm={handleConfirmOrder}
          adjustments={imageAdjustments}
        />
      )}
      
      {currentStep === 'payment' && (
        <PaymentQR 
          onPaymentComplete={handlePaymentComplete} 
          orderId={orderId || undefined}
        />
      )}
      {currentStep === 'thankyou' && (
        <ThankYou 
          onRestart={handleRestart}
          orderId={orderId || "Error-ID"} 
        />
      )}
    </div>
  );
}