import { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { DollarSign, ShoppingBag, Clock, CheckCircle, Package, Eye, Lock } from 'lucide-react';

export function AdminDashboard() {
  // Estados
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, pending: 0 });

  // --- 1. LOGIN SIMPLE ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // PIN "secreto" para la tesis
    if (pin === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('PIN Incorrecto');
    }
  };

  // --- 2. CONEXIÓN REAL-TIME CON FIREBASE ---
  useEffect(() => {
    if (!isAuthenticated) return;

    // Consulta: Dame las órdenes ordenadas por fecha (la más nueva arriba)
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOrders(ordersData);
      calculateStats(ordersData);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  // --- 3. CÁLCULO DE KPIs ---
  const calculateStats = (data: any[]) => {
    // Sumamos el total de todas las órdenes que NO estén canceladas (si quisieras filtrar)
    const totalMoney = data.reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);
    
    // Contamos las pendientes
    const pendingCount = data.filter(o => o.status === 'created' || o.status === 'pending').length;
    
    setStats({
      totalSales: totalMoney,
      totalOrders: data.length,
      pending: pendingCount
    });
  };

  // --- 4. ACCIONES OPERATIVAS ---
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("No se pudo actualizar el estado");
    }
  };

  // Si no está logueado, mostramos pantalla de bloqueo
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#004030]" />
          </div>
          <h2 className="text-2xl font-bold text-[#004030] mb-2">Acceso Administrativo</h2>
          <p className="text-gray-500 text-sm mb-6">Ingresa el PIN de seguridad para ver el panel.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full text-center text-2xl tracking-widest p-3 border-2 border-gray-200 rounded-xl focus:border-[#004030] outline-none transition-colors"
              maxLength={4}
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-[#004030] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Entrar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Si ya entró, mostramos el Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#004030]">Panel de Control</h1>
            <p className="text-gray-500">Custom Buy - Vista General</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* SECCIÓN GERENCIAL (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ventas */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="p-4 bg-green-50 rounded-xl">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalSales.toFixed(2)}</p>
            </div>
          </div>

          {/* Total Pedidos */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="p-4 bg-blue-50 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pedidos Totales</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>

          {/* Pendientes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="p-4 bg-orange-50 rounded-xl">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">En Cola de Producción</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN OPERACIONAL (Tabla) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Pedidos Recientes</h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              Actualización en tiempo real
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-5 font-semibold">ID Orden</th>
                  <th className="p-5 font-semibold">Diseño</th>
                  <th className="p-5 font-semibold">Producto / Detalles</th>
                  <th className="p-5 font-semibold">Total</th>
                  <th className="p-5 font-semibold">Estado</th>
                  <th className="p-5 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        {order.createdAt?.seconds 
                          ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                          : 'Reciente'}
                      </div>
                    </td>
                    
                    <td className="p-5">
                      <a 
                        href={order.imageUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="group relative block w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img src={order.imageUrl} alt="Diseño" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                        </div>
                      </a>
                    </td>

                    <td className="p-5">
                      <p className="font-bold text-gray-800 text-sm">{order.product}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.details?.size} • {order.details?.material}
                      </p>
                    </td>

                    <td className="p-5 font-bold text-gray-900">
                      ${order.pricing?.total?.toFixed(2) || '0.00'}
                    </td>

                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border
                        ${order.status === 'completed' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse'}`}>
                        {order.status === 'created' || order.status === 'pending' ? 'PENDIENTE' : 'ENTREGADO'}
                      </span>
                    </td>

                    <td className="p-5">
                      {order.status !== 'completed' ? (
                        <button 
                          onClick={() => handleStatusChange(order.id, 'completed')}
                          className="bg-[#004030] hover:bg-[#003024] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Marcar Listo
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-green-700 text-xs font-bold">
                          <Package className="w-4 h-4" />
                          Entregado
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-400">
                      No hay pedidos registrados aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}