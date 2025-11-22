import { useState } from 'react';
import { Welcome } from './components/Welcome';
import { SplashScreen } from './components/SplashScreen';
import { ProductCatalog } from './components/ProductCatalog';
import { BluetoothConnection } from './components/BluetoothConnection';
import { SendImage } from './components/SendImage';
import { AdjustImage } from './components/AdjustImage';
import { Timer } from './components/Timer';
import { OrderConfirmation } from './components/OrderConfirmation';
import { PaymentQR } from './components/PaymentQR';
import { ThankYou } from './components/ThankYou';
export type Step = 'welcome' | 'splash' | 'catalog' | 'bluetooth' | 'send' | 'adjust' | 'timer' | 'confirmation' | 'payment' | 'thankyou';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleStart = () => {
    setCurrentStep('splash');
  };

  const handleLoadComplete = () => {
    setCurrentStep('catalog');
  };

  const handleProductSelect = () => {
    setCurrentStep('bluetooth');
  };

  const handleBluetoothConnected = () => {
    setCurrentStep('send');
  };

  const handleImageSent = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setCurrentStep('adjust');
  };

  const handleCancelImage = () => {
    setUploadedImage(null);
    setCurrentStep('send');
  };

  const handleContinueToTimer = () => {
    setCurrentStep('timer');
  };

  const handleTimerComplete = () => {
    setCurrentStep('confirmation');
  };

  const handleCancelOrder = () => {
    setCurrentStep('adjust');
  };

  const handleConfirmOrder = () => {
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('thankyou');
  };

  const handleRestart = () => {
    setUploadedImage(null);
    setCurrentStep('welcome');
  };

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
      {currentStep === 'bluetooth' && (
        <BluetoothConnection onConnected={handleBluetoothConnected} />
      )}
      {currentStep === 'send' && (
        <SendImage onImageSent={handleImageSent} />
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
      {currentStep === 'confirmation' && uploadedImage && (
        <OrderConfirmation 
          imageUrl={uploadedImage}
          onCancel={handleCancelOrder}
          onConfirm={handleConfirmOrder}
        />
      )}
      {currentStep === 'payment' && (
        <PaymentQR onPaymentComplete={handlePaymentComplete} />
      )}
      {currentStep === 'thankyou' && (
        <ThankYou onRestart={handleRestart} />
      )}
    </div>
  );
}
