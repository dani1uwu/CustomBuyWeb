import { useState } from 'react';
import { Bluetooth, Smartphone, Loader2, QrCode, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface BluetoothConnectionProps {
  onConnected: () => void;
}

export function BluetoothConnection({ onConnected }: BluetoothConnectionProps) {
  const [connectionMethod, setConnectionMethod] = useState<'bluetooth' | 'qr'>('bluetooth');
  
  // Bluetooth states
  const [isSearching, setIsSearching] = useState(false);
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // QR states
  const [isWaitingForQR, setIsWaitingForQR] = useState(false);
  const [qrProgress, setQrProgress] = useState(0);

  const handleSearch = () => {
    setIsSearching(true);
    setDevices([]);
    
    setTimeout(() => {
      setDevices([
        'iPhone de Usuario',
        'Samsung Galaxy S21',
        'iPad Pro',
        'Xiaomi Mi 11'
      ]);
      setIsSearching(false);
    }, 2000);
  };

  const handleConnect = (device: string) => {
    setSelectedDevice(device);
    setIsConnecting(true);
    
    setTimeout(() => {
      setIsConnecting(false);
      onConnected();
    }, 2000);
  };

  const handleQRConnection = () => {
    setIsWaitingForQR(true);
    setQrProgress(0);

    const interval = setInterval(() => {
      setQrProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onConnected();
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-white overflow-hidden">
     
      <div className="max-w-3xl w-full bg-white rounded-3xl border-2 border-gray-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl mb-2" style={{ color: '#004030' }}>
            Conecta tu Dispositivo
          </h2>
          <p className="text-sm text-gray-600">
            Elige el método de conexión para enviar tu imagen
          </p>
        </div>

        <Tabs 
          value={connectionMethod} 
          onValueChange={(value) => setConnectionMethod(value as 'bluetooth' | 'qr')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
            <TabsTrigger 
              value="bluetooth" 
              className="text-sm data-[state=active]:bg-[#004030] data-[state=active]:text-white"
            >
              <Bluetooth className="w-4 h-4 mr-2" />
              Bluetooth
            </TabsTrigger>
            <TabsTrigger 
              value="qr"
              className="text-sm data-[state=active]:bg-[#004030] data-[state=active]:text-white"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Código QR
            </TabsTrigger>
          </TabsList>

          {/* Bluetooth Tab */}
          <TabsContent value="bluetooth" className="space-y-4 mt-0">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center">
              <Bluetooth className="w-12 h-12 mx-auto mb-3" style={{ color: '#004030' }} />
              <p className="text-sm text-gray-700">
                Conecta tu teléfono mediante Bluetooth
              </p>
            </div>

            {!isSearching && devices.length === 0 && (
              <div className="text-center">
                <Button
                  onClick={handleSearch}
                  className="px-10 py-5 rounded-xl text-white hover:opacity-90"
                  style={{ backgroundColor: '#004030' }}
                >
                  Buscar Dispositivos
                </Button>
              </div>
            )}

            {isSearching && (
              <div className="text-center py-6">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3" style={{ color: '#004030' }} />
                <p className="text-sm text-gray-600">Buscando dispositivos...</p>
              </div>
            )}

            {!isSearching && devices.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h3 className="mb-3 text-sm text-gray-700">Dispositivos disponibles:</h3>
                {devices.map((device, index) => (
                  <button
                    key={index}
                    onClick={() => handleConnect(device)}
                    disabled={isConnecting}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-gray-200 transition-all disabled:opacity-50"
                    style={{
                      borderColor: isConnecting && selectedDevice === device ? '#004030' : undefined
                    }}
                  >
                    <Smartphone className="w-5 h-5" style={{ color: '#004030' }} />
                    <span className="flex-1 text-left text-sm text-gray-800">{device}</span>
                    {isConnecting && selectedDevice === device && (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#004030' }} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {isConnecting && (
              <div className="mt-4 text-center text-sm" style={{ color: '#004030' }}>
                <p>Conectando a {selectedDevice}...</p>
              </div>
            )}
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-4 mt-0">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <div className="text-center mb-4">
                <QrCode className="w-12 h-12 mx-auto mb-3" style={{ color: '#004030' }} />
                <p className="text-sm text-gray-700">
                  Escanea este código QR desde tu teléfono
                </p>
              </div>

              {!isWaitingForQR ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div 
                      className="w-56 h-56 bg-white border-4 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ borderColor: '#004030' }}
                    >
                      <QrCode className="w-44 h-44" style={{ color: '#004030' }} />
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl p-3 mb-4">
                    <p className="text-xs mb-2 text-gray-700">Instrucciones:</p>
                    <ol className="text-xs text-gray-600 space-y-1 text-left">
                      <li>1. Abre la cámara de tu teléfono</li>
                      <li>2. Escanea el código QR</li>
                      <li>3. Abre el enlace y envía tu imagen</li>
                    </ol>
                  </div>

                  <Button
                    onClick={handleQRConnection}
                    className="w-full py-5 rounded-xl text-white hover:opacity-90"
                    style={{ backgroundColor: '#004030' }}
                  >
                    Estoy listo, iniciar conexión
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  {qrProgress < 100 ? (
                    <>
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3" style={{ color: '#004030' }} />
                      <p className="text-sm text-gray-600 mb-3">Esperando imagen...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden max-w-md mx-auto">
                        <div 
                          className="h-full transition-all duration-500 ease-out rounded-full"
                          style={{ 
                            width: `${qrProgress}%`,
                            backgroundColor: '#004030'
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{qrProgress}%</p>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#004030' }} />
                      <p className="text-sm" style={{ color: '#004030' }}>
                        ¡Conexión exitosa!
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
