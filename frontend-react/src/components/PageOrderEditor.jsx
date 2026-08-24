import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from '../../../qc-core/vendor/pdfjs/pdf.mjs'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  '../../../qc-core/vendor/pdfjs/pdf.worker.mjs',
  import.meta.url,
).href

function movePage(order, sourcePage, targetPage) {
  const sourceIndex = order.indexOf(sourcePage)
  const targetIndex = order.indexOf(targetPage)

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return order
  }

  const next = [...order]
  const [movedPage] = next.splice(sourceIndex, 1)
  next.splice(targetIndex, 0, movedPage)
  return next
}

function PageThumbnail({ pdfDocument, pageNumber }) {
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

function PageOrderEditor({ file, pageOrder, onPageOrderChange, disabled }) {
  const [pdfDocument, setPdfDocument] = useState(null)
  const [loading, setLoading] = useState(() => file instanceof File)
  const [error, setError] = useState('')
  const [draggedPage, setDraggedPage] = useState(null)

  useEffect(() => {
    let cancelled = false
    let loadedDocument = null

    if (!(file instanceof File)) return undefined

    const loadDocument = async () => {
      try {
        const data = new Uint8Array(await file.arrayBuffer())
        loadedDocument = await pdfjsLib.getDocument({ data }).promise

        if (cancelled) {
          await loadedDocument.destroy()
          return
        }

        const initialOrder = Array.from(
          { length: loadedDocument.numPages },
          (_, index) => index + 1,
        )

        setPdfDocument(loadedDocument)
        onPageOrderChange(initialOrder)
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Page thumbnails could not be loaded.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDocument()

    return () => {
      cancelled = true
      loadedDocument?.destroy()
    }
  }, [file, onPageOrderChange])

  const moveByOffset = (pageNumber, offset) => {
    const sourceIndex = pageOrder.indexOf(pageNumber)
    const targetIndex = sourceIndex + offset

    if (sourceIndex < 0 || targetIndex < 0 || targetIndex >= pageOrder.length) {
      return
    }

    onPageOrderChange(
      movePage(pageOrder, pageNumber, pageOrder[targetIndex]),
    )
  }

  if (!(file instanceof File)) {
    return <p className="qc-muted">Add one PDF to arrange its pages.</p>
  }

  if (loading) {
    return <p className="qc-muted">Loading page thumbnails…</p>
  }

  if (error || !pdfDocument) {
    return (
      <p className="qc-page-order__error" role="alert">
        {error || 'Page thumbnails are unavailable.'}
      </p>
    )
  }

  return (
    <div className="qc-page-order">
      <p className="qc-page-order__help">
        Drag pages into position or use the arrow buttons.
      </p>

      <ol className="qc-page-order__list">
        {pageOrder.map((pageNumber, index) => (
          <li
            key={pageNumber}
            className={`qc-page-order__item ${draggedPage === pageNumber ? 'is-dragging' : ''}`}
            draggable={!disabled}
            onDragStart={() => setDraggedPage(pageNumber)}
            onDragEnd={() => setDraggedPage(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              if (draggedPage !== null) {
                onPageOrderChange(movePage(pageOrder, draggedPage, pageNumber))
              }
              setDraggedPage(null)
            }}
          >
            <div className="qc-page-order__preview">
              <PageThumbnail
                pdfDocument={pdfDocument}
                pageNumber={pageNumber}
              />
            </div>
            <strong>Page {pageNumber}</strong>
            <span>Position {index + 1}</span>
            <div className="qc-page-order__controls">
              <button
                type="button"
                className="qc-icon-button"
                aria-label={`Move page ${pageNumber} left`}
                disabled={disabled || index === 0}
                onClick={() => moveByOffset(pageNumber, -1)}
              >
                ←
              </button>
              <button
                type="button"
                className="qc-icon-button"
                aria-label={`Move page ${pageNumber} right`}
                disabled={disabled || index === pageOrder.length - 1}
                onClick={() => moveByOffset(pageNumber, 1)}
              >
                →
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default PageOrderEditor
