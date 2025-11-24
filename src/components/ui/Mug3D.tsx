import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Componente interno que dibuja la malla
function MugMesh({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Cargamos la textura de la imagen del usuario
  const texture = useTexture(imageUrl);
  // Ajustamos la textura para que no se vea invertida si pasa
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1; 
  texture.offset.x = 1;

  // Rotación automática suave
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // Gira despacito
    }
  });

  return (
    <group ref={meshRef} dispose={null}>
      {/* CUERPO DE LA TAZA (Cilindro) */}
      <mesh position={[0, 0.75, 0]}>
        {/* Args: [RadioTop, RadioBottom, Altura, Segmentos] */}
        <cylinderGeometry args={[1.3, 1.3, 2.8, 64]} />
        {/* Material: Blanco por defecto, pero le pegamos la textura */}
        <meshStandardMaterial 
          color="white" 
          map={texture} 
          roughness={0.3} 
          metalness={0.1} 
        />
      </mesh>

      {/* INTERIOR DE LA TAZA (Para que no se vea hueca fea) */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 2.81, 64]} />
        <meshStandardMaterial color="#eeeeee" />
      </mesh>

      {/* ASA / MANGO (Toroide cortado) */}
      <mesh position={[1.4, 0.7, 0]} rotation={[0, 0, 0]}>
        {/* Args: [Radio, Tubo, SegmentosR, SegmentosT, Arco] */}
        <torusGeometry args={[0.6, 0.15, 16, 32, Math.PI * 2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* PISO DE LA TAZA */}
      <mesh position={[0, -0.65, 0]} rotation={[0, 0, 0]}>
         <cylinderGeometry args={[1.3, 1.3, 0.1, 64]} />
         <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

interface Mug3DProps {
  imageUrl: string;
}

export function Mug3D({ imageUrl }: Mug3DProps) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        {/* Stage configura luces y sombras automáticas para que se vea bonito */}
        <Stage environment="city" intensity={0.6}>
          <MugMesh imageUrl={imageUrl} />
        </Stage>
        {/* Permite al usuario rotar y hacer zoom en la cámara */}
        <OrbitControls enableZoom={true} minDistance={3} maxDistance={6} autoRotate={false} />
      </Canvas>
    </div>
  );
}