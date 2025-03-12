import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// For debugging purposes
console.log('React is initializing...');

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Root element found, mounting React...');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('Root element not found!');
}
