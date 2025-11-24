import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // <--- Importante
import App from './App.tsx';
import { MobileUploadPage } from './components/MobileUploadPage'; // Importamos la nueva pantalla
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FakePaymentGateway } from './components/FakePaymentGateway';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* RUTA 1: El Kiosco (Laptop) */}
        {/* Esta es la pantalla principal que siempre estará abierta en la uni */}
        <Route path="/" element={<App />} />
        
        {/* RUTA 2: El Celular del Cliente */}
        {/* A esta ruta llegarán cuando escaneen el QR */}
        <Route path="/upload/:sessionId" element={<MobileUploadPage />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/pay/:orderId" element={<FakePaymentGateway />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);