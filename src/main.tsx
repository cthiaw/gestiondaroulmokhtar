import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { db, initializeDatabase } from './db/database';

async function startApp() {
  // Vérifie si la base de données a déjà été initialisée
  const isInitialized = localStorage.getItem('dbInitialized');
  
  if (!isInitialized) {
    await initializeDatabase();
    localStorage.setItem('dbInitialized', 'true');
  }
  
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

startApp();