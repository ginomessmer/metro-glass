import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'metro-glass/styles.css';
import './demo.css';
import { App } from './App';

if (new URLSearchParams(location.search).has('debug')) {
  void import('./debug').then((m) => m.mountDebug());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
