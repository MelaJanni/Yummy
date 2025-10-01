import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { QueryProvider } from './app/providers/QueryProvider';
import { router } from './app/router';
import { useAuthStore } from './shared/stores/authStore';

useAuthStore.getState().initAuth();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryProvider>
  </StrictMode>,
);
