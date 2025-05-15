import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'
import { UserProvider } from './Context/UserContext'; 
import { DarkModeProvider } from './Context/DarkModeContext'; 
import {PresenceProvider} from './Context/PresenceContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PresenceProvider>
      <UserProvider>
        <DarkModeProvider>
          <RouterApp />
        </DarkModeProvider>
      </UserProvider>
      </PresenceProvider>
    </BrowserRouter>
  </StrictMode>
)
