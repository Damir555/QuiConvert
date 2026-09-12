import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.querySelector(
  '[data-quiconvert-react-root], #root',
)

const reactRootProperty = '__quiconvertReactRoot'

if (rootElement && !rootElement[reactRootProperty]) {
  const query = new URLSearchParams(window.location.search)
  const embedded = rootElement.hasAttribute('data-quiconvert-react-root') ||
    query.get('embed') === 'wordpress'
  const initialTool = rootElement.dataset.initialTool || 'merge'
  const dedicatedTool = rootElement.dataset.dedicatedTool === 'true'
  const reactRoot = createRoot(rootElement)
  const app = (
    <App
      embedded={embedded}
      initialTool={initialTool}
      dedicatedTool={dedicatedTool}
    />
  )

  Object.defineProperty(rootElement, reactRootProperty, {
    value: reactRoot,
    configurable: false,
    enumerable: false,
    writable: false,
  })

  reactRoot.render(import.meta.env.DEV ? (
    <StrictMode>
      {app}
    </StrictMode>
  ) : app)
}
