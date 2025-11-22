import { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { RotateCw, ZoomIn, Move, X, ArrowRight, Loader2 } from 'lucide-react'; // Agregué Loader2
import { ImageWithFallback } from './figma/ImageWithFallback';
import { uploadImageToFirebase } from '../firebase/client'; // <--- IMPORTANTE: Tu función de backend

interface AdjustImageProps {
  imageUrl: string;
  onCancel: () => void;
  // CAMBIO: Ahora onContinue recibe la URL de Firebase y los ajustes (opcional)
  onContinue: (firebaseUrl: string, adjustments: any) => void;
}

export function AdjustImage({ imageUrl, onCancel, onContinue }: AdjustImageProps) {
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // ESTADO NUEVO: Para saber si estamos subiendo
  const [isUploading, setIsUploading] = useState(false);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // --- LÓGICA DE BACKEND ---
  const handleSaveAndContinue = async () => {
    if (isUploading) return;
    setIsUploading(true);

    try {
      // 1. Convertimos la URL de vista previa (blob/local) a un archivo físico para subir
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "diseño_taza.jpg", { type: blob.type });

      // 2. Subimos a Firebase usando TU función
      console.log("Subiendo imagen a Firebase...");
      const publicUrl = await uploadImageToFirebase(file);

      // 3. Pasamos la URL real y los datos de ajuste al siguiente paso
      // (Pasamos los ajustes por si quisieras guardarlos en la BD para saber cómo la quería el cliente)
      onContinue(publicUrl, { scale, rotation, position });

    } catch (error) {
      console.error("Error al subir:", error);
      alert("Hubo un error al subir la imagen. Revisa tu conexión.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-white overflow-hidden">
    
      <div className="max-w-7xl w-full bg-white rounded-3xl border-2 border-gray-200 p-5">
        <div className="text-center mb-4">
          <h2 className="text-3xl mb-1" style={{ color: '#004030' }}>
            Ajusta tu Imagen
          </h2>
          <p className="text-xs text-gray-600">Personaliza el tamaño y posición de tu diseño</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Vista previa */}
          <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center min-h-[420px] relative overflow-hidden border-2 border-gray-200">
            <div className="relative">
              <div className="w-56 h-56 bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                <ImageWithFallback
                  src={imageUrl}
                  alt="Imagen personalizada"
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                  style={{
                    transform: `scale(${scale / 100}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`
                  }}
                />
              </div>
              <div className="mt-3 text-center text-xs text-gray-600">
                Vista previa en la taza
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <ZoomIn className="w-4 h-4" style={{ color: '#004030' }} />
                <h3 className="text-sm" style={{ color: '#004030' }}>Tamaño</h3>
              </div>
              <div className="space-y-1">
                <Slider
                  value={[scale]}
                  onValueChange={(value) => setScale(value[0])}
                  min={50}
                  max={150}
                  step={5}
                  className="w-full"
                />
                <p className="text-center text-xs text-gray-600">{scale}%</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <RotateCw className="w-4 h-4" style={{ color: '#004030' }} />
                <h3 className="text-sm" style={{ color: '#004030' }}>Rotación</h3>
              </div>
              <Button
                onClick={handleRotate}
                variant="outline"
                className="w-full text-sm py-2"
              >
                Rotar 90°
              </Button>
              <p className="text-center text-xs text-gray-600 mt-1">{rotation}°</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Move className="w-4 h-4" style={{ color: '#004030' }} />
                <h3 className="text-sm" style={{ color: '#004030' }}>Posición</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Horizontal</label>
                  <Slider
                    value={[position.x + 50]}
                    onValueChange={(value) => setPosition(prev => ({ ...prev, x: value[0] - 50 }))}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Vertical</label>
                  <Slider
                    value={[position.y + 50]}
                    onValueChange={(value) => setPosition(prev => ({ ...prev, y: value[0] - 50 }))}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={isUploading} // Deshabilitar si está subiendo
                className="py-5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              
              {/* BOTÓN MODIFICADO */}
              <Button
                onClick={handleSaveAndContinue}
                disabled={isUploading}
                className="py-5 rounded-xl text-white hover:opacity-90 text-sm"
                style={{ backgroundColor: '#004030' }}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    Siguiente
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