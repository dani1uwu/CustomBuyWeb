// src/utils/cropImage.ts

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    // Necesario para evitar problemas de CORS con imágenes externas (Cloudinary)
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Esta función toma la imagen original y los datos de recorte/rotación
 * y devuelve un nuevo "Blob" (archivo) con la imagen editada.
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number } | null,
  rotation = 0,
  fileName = 'imagen-editada.jpeg'
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx || !pixelCrop) {
    throw new Error('No se pudo crear el contexto del canvas o faltan datos de recorte');
  }

  const safeArea = Math.max(image.width, image.height) * 2;

  // Configurar dimensiones del canvas para acomodar la rotación sin cortar esquinas
  canvas.width = safeArea;
  canvas.height = safeArea;

  // Mover el punto de origen al centro para rotar
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Dibujar la imagen rotada en el canvas
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  // Extraer la parte recortada que el usuario eligió
  const data = ctx.getImageData(
    safeArea / 2 - image.width * 0.5 + pixelCrop.x,
    safeArea / 2 - image.height * 0.5 + pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // Redimensionar el canvas al tamaño final del recorte
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Pegar los datos recortados en el nuevo canvas limpio
  ctx.putImageData(data, 0, 0);

  // Devolver como un archivo Blob (JPEG para buen balance calidad/tamaño)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      // Le asignamos un nombre al archivo, útil si lo fuéramos a descargar
      (blob as any).name = fileName; 
      resolve(blob);
    }, 'image/jpeg', 0.9); // Calidad 90%
  });
}