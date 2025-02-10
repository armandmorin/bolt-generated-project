import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
