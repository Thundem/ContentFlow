import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './providers/AuthProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { toast } from "react-toastify";


const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Нова версія доступна. Оновити зараз?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    toast.success("Додаток готовий до роботи офлайн.");
  }
});
