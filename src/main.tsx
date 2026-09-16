import React from 'react'
import ReactDOM from 'react-dom/client'
import MainContent from './App'
import { AppProvider } from './context/AppContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
