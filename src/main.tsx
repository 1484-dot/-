import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../bg3_build_explorer_gear_progression';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
