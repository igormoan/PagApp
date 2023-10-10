import React from 'react';
import ReactDOM from 'react-dom/client';
import MainRoutes from './routes/MainRoutes';
import { BrowserRouter } from 'react-router-dom';
import './global.css';
import "./colors.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 10 * 60 * 1000},
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
