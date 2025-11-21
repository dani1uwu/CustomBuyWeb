import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCatalogProps {
  onProductSelect: () => void;
}

export function ProductCatalog({ onProductSelect }: ProductCatalogProps) {
  const products = [
    {
      id: 1,
      name: 'Botella',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZXxlbnwxfHx8fDE3NjE1ODQ5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: false
    },
    {
      id: 2,
      name: 'Taza',
      image: 'https://images.unsplash.com/photo-1571263823936-dd44f461d3f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtdWclMjB3aGl0ZXxlbnwxfHx8fDE3NjE1NDY0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: 3,
      name: 'Libreta',
      image: 'https://images.unsplash.com/photo-1700864781908-5e7fe069ae1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMGpvdXJuYWx8ZW58MXx8fHwxNzYxNTQ5MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: false
    }
  ];

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white">

      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-3" style={{ color: '#004030' }}>
            Catálogo de Productos
          </h1>
          <p className="text-base text-gray-600">Selecciona el producto que deseas personalizar</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                product.available 
                  ? 'border-gray-200 hover:shadow-xl hover:scale-105 hover:border-[#004030]' 
                  : 'border-gray-100 opacity-50'
              }`}
            >
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!product.available && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-5 py-2 rounded-full text-sm">
                      No Disponible
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-xl mb-3 text-center" style={{ color: '#004030' }}>
                  {product.name}
                </h3>
                {product.available ? (
                  <Button 
                    onClick={onProductSelect}
                    className="w-full py-5 rounded-xl text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#004030' }}
                  >
                    Personalizar
                  </Button>
                ) : (
                  <div className="h-11" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
