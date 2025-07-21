import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'
import {
  NetworkStatusProvider,
  DarkModeProvider,
  UserProvider,
} from './context/index.js'

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
