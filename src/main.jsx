import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'

import { UserProvider } from './context/UserContext.jsx'
import { DarkModeProvider } from './context/DarkModeContext.jsx'

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
