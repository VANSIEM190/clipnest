import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { BrowserRouter } from 'react-router-dom'
import RouterApp from './router/RouterApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RouterApp />
    </BrowserRouter>
  </StrictMode>,
)
