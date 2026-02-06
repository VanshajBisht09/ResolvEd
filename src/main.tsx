import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { MockClerkProvider } from './components/MockAuth';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

console.log("Main.tsx executing");
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("Key:", PUBLISHABLE_KEY);

import { ThemeProvider } from './components/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <MockClerkProvider>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </MockClerkProvider>
  </StrictMode>
);