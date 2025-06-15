import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'
import { UserProvider } from './Context/UserContext'; 
import { DarkModeProvider } from './Context/DarkModeContext'; 
import {PresenceProvider} from './Context/PresenceContext'
import { NetWorkStatusProvider } from './Context/networkStatusContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NetWorkStatusProvider>
        <PresenceProvider>
          <UserProvider>
            <DarkModeProvider>
              <RouterApp />
            </DarkModeProvider>
          </UserProvider>
        </PresenceProvider>
      </NetWorkStatusProvider>
    </BrowserRouter>
  </StrictMode>
)
