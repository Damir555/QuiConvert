import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from '../../../qc-core/vendor/pdfjs/pdf.mjs'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  '../../../qc-core/vendor/pdfjs/pdf.worker.mjs',
  import.meta.url,
).href

function PdfPreview({ file, fileCount, processing }) {
  const canvasRef = useRef(null)
  const renderTaskRef = useRef(null)
  const [pdfDocument, setPdfDocument] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let loadedDocument = null

    setPdfDocument(null)
    setPageNumber(1)
    setPageCount(0)
    setError('')

    if (!(file instanceof File)) {
      setLoading(false)
      return undefined
    }

    setLoading(true)

    const loadDocument = async () => {
      try {
        const data = new Uint8Array(await file.arrayBuffer())
        const loadingTask = pdfjsLib.getDocument({ data })
        loadedDocument = await loadingTask.promise

        if (cancelled) {
          await loadedDocument.destroy()
          return
        }

        setPdfDocument(loadedDocument)
        setPageCount(loadedDocument.numPages)
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'The PDF preview could not be loaded.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDocument()

    return () => {
      cancelled = true
      renderTaskRef.current?.cancel()
      renderTaskRef.current = null

      if (loadedDocument) {
        loadedDocument.destroy()
      }
    }
  }, [file])

  useEffect(() => {
    let cancelled = false

    if (!pdfDocument || !canvasRef.current) return undefined

    const renderPage = async () => {
      try {
        renderTaskRef.current?.cancel()

        const page = await pdfDocument.getPage(pageNumber)
        if (cancelled) return

        const viewport = page.getViewport({ scale: 1.35 })
        const outputScale = window.devicePixelRatio || 1
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (!context) {
          throw new Error('The preview canvas is unavailable.')
        }

        canvas.width = Math.floor(viewport.width * outputScale)
        canvas.height = Math.floor(viewport.height * outputScale)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`

        const renderTask = page.render({
          canvasContext: context,
          viewport,
          transform: outputScale === 1
            ? null
            : [outputScale, 0, 0, outputScale, 0, 0],
        })

        renderTaskRef.current = renderTask
        await renderTask.promise
      } catch (renderError) {
        if (!cancelled && renderError?.name !== 'RenderingCancelledException') {
          setError(
            renderError instanceof Error
              ? renderError.message
              : 'The PDF page could not be rendered.',
          )
        }
      }
    }

    renderPage()

    return () => {
      cancelled = true
      renderTaskRef.current?.cancel()
      renderTaskRef.current = null
    }
  }, [loading, pdfDocument, pageNumber])

  const status = processing
    ? 'Processing'
    : loading
      ? 'Loading preview'
      : file
        ? error
          ? 'Preview error'
          : 'Ready'
        : 'Waiting'

  return (
    <section className="qc-panel qc-preview">
      <div className="qc-panel__header qc-panel__header--row">
        <div>
          <p className="qc-eyebrow">Document</p>
          <h2>Preview</h2>
        </div>

        <div className="qc-preview__toolbar">
          <button
            type="button"
            className="qc-icon-button"
            aria-label="Previous page"
            disabled={pageNumber <= 1 || loading}
            onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
          >
            ←
          </button>
          <span>Page {pageCount ? pageNumber : 0} of {pageCount}</span>
          <button
            type="button"
            className="qc-icon-button"
            aria-label="Next page"
            disabled={pageNumber >= pageCount || loading}
            onClick={() => setPageNumber((current) => Math.min(pageCount, current + 1))}
          >
            →
          </button>
        </div>
      </div>

      <div className="qc-preview__body">
        <div className="qc-preview__stage">
          {!file ? (
            <p className="qc-preview__message">Add a PDF to preview its pages.</p>
          ) : loading ? (
            <p className="qc-preview__message">Loading PDF preview…</p>
          ) : error ? (
            <p className="qc-preview__message qc-preview__message--error" role="alert">
              {error}
            </p>
          ) : (
            <canvas ref={canvasRef} className="qc-preview__canvas" />
          )}
        </div>

        <aside className="qc-document-details">
          <h3>Document details</h3>
          <dl>
            <div><dt>Status</dt><dd>{status}</dd></div>
            <div><dt>Files</dt><dd>{fileCount}</dd></div>
            <div><dt>Pages</dt><dd>{pageCount || '—'}</dd></div>
            <div><dt>Engine</dt><dd>PDF.js</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  )
}

export default PdfPreview
