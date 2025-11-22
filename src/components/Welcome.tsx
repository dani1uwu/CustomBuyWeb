import { Button } from './ui/button';
import logo from '../assets/Logo.png';

interface WelcomeProps {
  onStart: () => void;
}

export function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="w-full max-w-sm mx-auto p-8 text-center">
      
        {/* Logo */}
        <div className="mb-12">
          <img 
            src={logo} 
            alt="Custom Buy Logo" 
            className="w-64 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl mb-3" style={{ color: '#004030' }}>
            Custom Buy
          </h1>
          <p className="text-lg text-gray-600">
            Crea tu producto único en minutos
          </p>
        </div>

        {/* Botón Empezar */}
        <Button
          onClick={onStart}
          className="px-14 py-7 rounded-full text-xl hover:scale-105 transition-all duration-300 shadow-lg"
          style={{ backgroundColor: '#004030' }}
        >
          Empezar
        </Button>
      </div>
  );
}
