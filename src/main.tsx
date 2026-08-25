import React from 'react'
import ReactDOM from 'react-dom/client'
import MainContent from './App'
import { AppProvider } from './context/AppContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <MainContent />
    </AppProvider>
  </React.StrictMode>,
)
