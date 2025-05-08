import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'
import { UserProvider } from './Context/UserContext'; 
import { DarkModeProvider } from './Context/DarkModeContext'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <DarkModeProvider>
          <RouterApp />
        </DarkModeProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
