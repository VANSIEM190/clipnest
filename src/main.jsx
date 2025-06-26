import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'
import { UserProvider } from './Context/UserContext'; 
import { DarkModeProvider } from './Context/DarkModeContext' 
import { NetWorkStatusProvider } from './Context/networkStatusContext'


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
