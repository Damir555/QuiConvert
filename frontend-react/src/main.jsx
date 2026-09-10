import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.querySelector(
  '[data-quiconvert-react-root], #root',
)

if (rootElement) {
  const query = new URLSearchParams(window.location.search)
  const embedded = rootElement.hasAttribute('data-quiconvert-react-root') ||
    query.get('embed') === 'wordpress'
  const initialTool = rootElement.dataset.initialTool || 'merge'
  const dedicatedTool = rootElement.dataset.dedicatedTool === 'true'

  createRoot(rootElement).render(
    <StrictMode>
      <App
        embedded={embedded}
        initialTool={initialTool}
        dedicatedTool={dedicatedTool}
      />
    </StrictMode>,
  )
}
