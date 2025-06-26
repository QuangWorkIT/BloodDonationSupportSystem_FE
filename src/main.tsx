import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router/index.tsx'
import AuthProvider from './hooks/authen/AuthContext.tsx'
// import { LoadScript } from "@react-google-maps/api";
 import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
        <AppRouter />
        <ToastContainer position="bottom-right"/>
      </AuthProvider>
    {/* <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GEOCODING_ID}
      libraries={["places", "geometry"]}
    >
    </LoadScript> */}
  </StrictMode>,
)
