import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { uploadImageToFirebase } from '../firebase/client'; // Tu función de backend
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';

export function MobileUploadPage() {
  const { sessionId } = useParams(); // Capturamos el ID de la URL
  const [uploading, setUploading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;

    setUploading(true);
    try {
      // 1. Subir imagen al Storage
      const url = await uploadImageToFirebase(file);

      // 2. Actualizar el documento de la sesión en Firestore
      // Esto es lo que le "avisa" al Kiosco que ya está lista la foto
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, { 
        imageUrl: url,
        status: 'uploaded'
      });
      
      setFinished(true);
    } catch (error) {
      console.error(error);
      alert('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  // Pantalla de Éxito
  if (finished) return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle className="w-20 h-20 text-green-600 mb-4" />
      <h1 className="text-2xl font-bold text-green-800">¡Listo!</h1>
      <p className="text-green-700 mt-2">Tu imagen se ha enviado al Kiosco.</p>
      <p className="text-sm text-green-600 mt-4">Ya puedes cerrar esta ventana.</p>
    </div>
  );

  // Pantalla de Subida
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-2 text-[#004030]">Sube tu Foto</h1>
        <p className="text-gray-500 mb-8 text-sm">Selecciona la imagen para tu taza personalizada</p>
        
        <label className={`
          block w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all
          ${uploading ? 'border-gray-300 bg-gray-50' : 'border-[#004030] bg-green-50 hover:bg-green-100'}
        `}>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
            disabled={uploading} 
          />
          
          <div className="flex flex-col items-center">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-[#004030] animate-spin mb-3" />
                <span className="text-gray-600 font-medium">Subiendo...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-[#004030] mb-3" />
                <span className="text-[#004030] font-bold">Toca aquí para elegir</span>
              </>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}