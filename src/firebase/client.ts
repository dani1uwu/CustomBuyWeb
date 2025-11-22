import { collection, addDoc } from "firebase/firestore";
import { db } from "./config";

// --- DATOS DE CLOUDINARY ---
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

/**
 * Sube una imagen a Cloudinary
 */
export const uploadImageToFirebase = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    // Nota: Fíjate que la URL usa tu CLOUD_NAME dinámicamente
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Error Cloudinary:", err);
      throw new Error("Fallo la subida a Cloudinary");
    }

    const data = await response.json();
    console.log("Imagen subida:", data.secure_url);
    
    return data.secure_url; 

  } catch (error) {
    console.error("Error subiendo imagen:", error);
    throw error;
  }
};

// ... El resto del archivo (createOrder) sigue igual ...
export const createOrder = async (orderData: any) => {
    try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: new Date(), 
    });
    
    console.log("Orden guardada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error guardando orden:", error);
    throw error;
  }
};