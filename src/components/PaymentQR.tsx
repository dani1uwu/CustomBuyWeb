import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, XCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const BACKEND_API_URL = 'http://localhost:3001/api/create-preference';

interface PaymentQRProps {
    onPaymentComplete?: () => void;
}

const fixedTotalAmount = 174.0;
type PaymentStatus = 'loading' | 'qr_ready' | 'error';

export function PaymentQR({ onPaymentComplete }: PaymentQRProps) {
    const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<PaymentStatus>('loading');
    const [error, setError] = useState<string | null>(null);

    const fetchCheckoutUrl = useCallback(async () => {
        setStatus('loading');
        setError(null);
        setCheckoutUrl(undefined);

        try {
            const response = await fetch(BACKEND_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: fixedTotalAmount }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Error (${response.status}): ${text}`);
            }

            const data = await response.json();
            const receivedUrl = data.checkoutUrl;

            if (!receivedUrl) throw new Error("El backend no devolvió 'checkoutUrl'.");

            setCheckoutUrl(receivedUrl);
            setStatus('qr_ready');
            console.log("🔵 Checkout URL recibida:", receivedUrl);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error desconocido.';
            setError(msg);
            setStatus('error');
        }
    }, [onPaymentComplete]);

    useEffect(() => {
        fetchCheckoutUrl();
    }, [fetchCheckoutUrl]);

    const renderTitle = () => {
        if (status === 'loading') return 'Generando Código QR...';
        if (status === 'error') return 'Error al generar pago';
        return 'Pago de tu Taza';
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                {/* Icono superior */}
                <div
                    className="flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto"
                    style={{
                        backgroundColor:
                            status === 'qr_ready'
                                ? '#D1FAE5'
                                : status === 'error'
                                ? '#FEE2E2'
                                : '#E5E7EB',
                        color:
                            status === 'qr_ready'
                                ? '#00A650'
                                : status === 'error'
                                ? '#EF4444'
                                : '#6B7280',
                    }}
                >
                    {status === 'loading' && <RefreshCw className="w-8 h-8 animate-spin" />}
                    {status === 'qr_ready' && <QrCode className="w-8 h-8" />}
                    {status === 'error' && <XCircle className="w-8 h-8" />}
                </div>

                {/* Título */}
                <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">{renderTitle()}</h2>

                {/* Mensaje de error */}
                {status === 'error' && (
                    <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-left">
                        <p className="font-bold mb-2 flex items-center">
                            <XCircle className="w-4 h-4 mr-1" /> Error
                        </p>
                        <p className="text-sm break-words">{error}</p>
                        <button
                            onClick={fetchCheckoutUrl}
                            className="mt-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 py-1.5 px-3 rounded-lg flex items-center justify-center"
                        >
                            <RefreshCw className="w-4 h-4 mr-1" /> Reintentar
                        </button>
                    </div>
                )}

                {/* Sección principal QR / instrucciones */}
                {status !== 'error' && (
                    <>
                        <p className="text-base text-gray-600 mb-4 text-center">
                            Total:{' '}
                            <span className="font-extrabold text-teal-600">
                                ${fixedTotalAmount.toFixed(2)} MXN
                            </span>
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200 shadow-inner flex justify-center">
                            {status === 'loading' ? (
                                <div className="py-8">
                                    <RefreshCw className="w-10 h-10 mx-auto text-teal-500 animate-spin" />
                                    <p className="text-sm text-gray-500 mt-2 text-center">Conectando...</p>
                                </div>
                            ) : (
                                checkoutUrl && (
                                    <QRCodeSVG
                                        value={checkoutUrl}
                                        size={200}
                                        level="H"
                                        fgColor="#00A650"
                                        className="rounded-lg"
                                        style={{ border: '3px solid #00A650', padding: '12px' }}
                                    />
                                )
                            )}
                        </div>

                        {/* Instrucciones QR */}
                        {status === 'qr_ready' && (
                            <div className="bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-700 shadow-md mb-4">
                                <h4 className="font-semibold text-gray-800 mb-1">Instrucciones QR:</h4>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Abre tu app de Mercado Pago.</li>
                                    <li>Selecciona "Pagar con QR".</li>
                                    <li>Escanea el código.</li>
                                    <li>Completa el pago con tarjetas de prueba.</li>
                                </ol>
                            </div>
                        )}

                        {/* Opción de pago en efectivo */}
                        <div className="bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-700 shadow-md">
                            <h4 className="font-semibold text-gray-800 mb-1">Pago en efectivo:</h4>
                            <p className="mb-2">
                                Si deseas pagar en efectivo, puedes ir a nuestra tienda física y mostrar este código o mencionar tu pedido.
                            </p>
                            <button
                                className="w-full text-white bg-teal-600 hover:bg-teal-700 py-2 rounded-lg font-semibold"
                                onClick={() => alert('Opción de pago en efectivo seleccionada')}
                            >
                                Seleccionar Pago en Efectivo
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
