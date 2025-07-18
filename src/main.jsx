import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'
import { UserProvider } from './context/UserContext'
import { DarkModeProvider } from './context/DarkModeContext'
import { NetWorkStatusProvider } from './context/networkStatusContext'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NetWorkStatusProvider>
        <UserProvider>
          <DarkModeProvider>
            <RouterApp />
          </DarkModeProvider>
        </UserProvider>
      </NetWorkStatusProvider>
    </BrowserRouter>
  </StrictMode>
)
