import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from './ui/button';
import { ArrowRight, X, ZoomIn, RotateCw, Move, Loader2, ShieldCheck } from 'lucide-react';
import { uploadImageToFirebase } from '../firebase/client';
import getCroppedImg from '../utils/cropImage'; 

interface AdjustImageProps {
  imageUrl: string;
  onCancel: () => void;
  onContinue: (firebaseUrl: string, adjustments: any) => void;
}

// Definimos los tipos para los datos de recorte
interface CropArea {
  x: number; y: number; width: number; height: number;
}

export function AdjustImage({ imageUrl, onCancel, onContinue }: AdjustImageProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Guarda las coordenadas exactas en píxeles
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  // Esta función la llama la librería cada vez que mueves/zoomeas la imagen
  const onCropComplete = useCallback((croppedArea: CropArea, croppedAreaPixels: CropArea) => {
    console.log('Área recortada en píxeles:', croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleContinue = async () => {
    if (isProcessing || !croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      console.log("1. Iniciando procesamiento de imagen (recorte y rotación)...");
      
      // 1. Generar el Blob de la imagen editada
      const croppedImageBlob = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation
      );

      console.log("2. Imagen editada generada. Subiendo a la nube...");

      // 2. Convertir el Blob a un File
      const fileToUpload = new File([croppedImageBlob], "taza-editada.jpg", { type: "image/jpeg" });

      // 3. Subir la NUEVA imagen editada a Cloudinary
      const newEditedUrl = await uploadImageToFirebase(fileToUpload);

      console.log("3. Subida completada. Nueva URL:", newEditedUrl);

      // 4. Guardar ajustes (referencia)
      const adjustments = {
        zoom,
        rotation,
        crop,
        finalCropPixels: croppedAreaPixels
      };

      // 5. Pasar la NUEVA URL
      onContinue(newEditedUrl, adjustments);

    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      alert("Hubo un error al procesar tu diseño. Por favor intenta de nuevo.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="max-w-4xl w-full bg-white rounded-3xl border-2 border-gray-200 p-8">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2 font-bold" style={{ color: '#004030' }}>
            Ajusta tu Imagen
          </h2>
          <p className="text-gray-500 text-sm mb-4">Personaliza el tamaño y posición de tu diseño</p>

          {/* --- AVISO DE PRIVACIDAD (Correctamente anidado) --- */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-800 font-medium">
              Por tu seguridad, las imágenes se eliminan automáticamente.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Área del Cropper */}
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 h-[400px] relative overflow-hidden">
            <div className="absolute inset-4 pointer-events-none z-10 border-[3px] border-dashed border-[#004030]/30 rounded-lg"></div>
            
            {/* COMPONENTE CROPPER */}
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={2.1 / 1} // Relación panorámica para la taza
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              showGrid={false}
              classes={{
                containerClassName: 'rounded-xl',
                mediaClassName: '',
                cropAreaClassName: 'border-2 border-[#004030] shadow-[0_0_0_9999px_rgba(255,255,255,0.8)]'
              }}
            />
            <p className="absolute bottom-6 left-0 right-0 text-center text-xs font-medium text-[#004030] z-20 pointer-events-none">
              Vista previa en la taza
            </p>
          </div>

          {/* Controles */}
          <div className="space-y-6 flex flex-col justify-center">
            {/* Tamaño / Zoom */}
            <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <ZoomIn className="w-5 h-5" style={{ color: '#004030' }} />
                <label className="font-bold text-sm text-gray-800">Tamaño</label>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004030]"
              />
              <div className="text-right mt-1 text-xs text-gray-500 font-medium">
                {Math.round(zoom * 100)}%
              </div>
            </div>

            {/* Rotación */}
            <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <RotateCw className="w-5 h-5" style={{ color: '#004030' }} />
                <label className="font-bold text-sm text-gray-800">Rotación</label>
              </div>
              <Button
                variant="outline"
                onClick={() => setRotation((r) => r + 90)}
                className="w-full py-6 rounded-xl border-2 border-gray-200 hover:bg-white hover:border-[#004030] transition-all group"
              >
                <RotateCw className="w-4 h-4 mr-2 text-gray-600 group-hover:text-[#004030]" />
                Rotar 90°
              </Button>
              <div className="text-center mt-2 text-xs text-gray-500 font-medium">
                {rotation}°
              </div>
            </div>

            {/* Posición (Decorativo) */}
            <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200 opacity-50 pointer-events-none">
               <div className="flex items-center gap-2 mb-3">
                <Move className="w-5 h-5" style={{ color: '#004030' }} />
                <label className="font-bold text-sm text-gray-800">Posición</label>
              </div>
              <p className="text-xs text-gray-500">Arrastra la imagen directamente para moverla</p>
            </div>

            {/* Botones de Acción */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={isProcessing}
                className="py-6 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleContinue}
                disabled={isProcessing || !croppedAreaPixels}
                className="py-6 rounded-xl text-white hover:opacity-90 font-bold transition-all"
                style={{ backgroundColor: '#004030' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Siguiente
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