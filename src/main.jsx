import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'
import { NetworkStatusProvider } from './context/NetworkStatusContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { DarkModeProvider } from './context/DarkModeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NetworkStatusProvider>
        <UserProvider>
          <DarkModeProvider>
            <RouterApp />
          </DarkModeProvider>
        </UserProvider>
      </NetworkStatusProvider>
    </BrowserRouter>
  </StrictMode>
)
