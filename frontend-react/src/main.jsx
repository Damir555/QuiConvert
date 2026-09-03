import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.querySelector(
  '[data-quiconvert-react-root], #root',
)

if (!rootElement) {
  throw new Error('QuiConvert React root element was not found.')
}

const query = new URLSearchParams(window.location.search)
const embedded = rootElement.hasAttribute('data-quiconvert-react-root') ||
  query.get('embed') === 'wordpress'

createRoot(rootElement).render(
  <StrictMode>
    <App embedded={embedded} />
  </StrictMode>,
)
