import { useEffect, useRef } from 'react'

function PdfPageThumbnail({ pdfDocument, pageNumber }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let renderTask = null

    const renderThumbnail = async () => {
      try {
        const page = await pdfDocument.getPage(pageNumber)
        if (cancelled || !canvasRef.current) return

        const baseViewport = page.getViewport({ scale: 1 })
        const scale = 112 / baseViewport.width
        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (!context) return

        canvas.width = Math.ceil(viewport.width)
        canvas.height = Math.ceil(viewport.height)
        renderTask = page.render({ canvasContext: context, viewport })
        await renderTask.promise
      } catch (error) {
        if (!cancelled && error?.name !== 'RenderingCancelledException') {
          console.warn(`Page ${pageNumber} thumbnail could not be rendered.`, error)
        }
      }
    }

    renderThumbnail()

    return () => {
      cancelled = true
      renderTask?.cancel()
    }
  }, [pdfDocument, pageNumber])

  return <canvas ref={canvasRef} className="qc-page-order__canvas" />
}

export default PdfPageThumbnail
