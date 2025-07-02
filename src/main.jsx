import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // ⬅️ Import the App with routing

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* ⬅️ Use the router-enabled App */}
  </StrictMode>,
);
