import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// यह लाइन HTML के "root" को ढूँढती है
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
