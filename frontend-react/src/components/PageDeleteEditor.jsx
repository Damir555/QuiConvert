import { useEffect, useState } from 'react'
import * as pdfjsLib from '../../../qc-core/vendor/pdfjs/pdf.mjs'
import PdfPageThumbnail from './PdfPageThumbnail.jsx'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  '../../../qc-core/vendor/pdfjs/pdf.worker.mjs',
  import.meta.url,
).href

function PageDeleteEditor({
  file,
  selectedPages,
  onSelectedPagesChange,
  onPageCountChange,
  disabled,
}) {
  const [pdfDocument, setPdfDocument] = useState(null)
  const [loading, setLoading] = useState(() => file instanceof File)
  const [error, setError] = useState('')
  const [selectionWarning, setSelectionWarning] = useState('')

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

        setPdfDocument(loadedDocument)
        onPageCountChange(loadedDocument.numPages)
        onSelectedPagesChange([])
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
  }, [file, onPageCountChange, onSelectedPagesChange])

  if (!(file instanceof File)) {
    return <p className="qc-muted">Add one PDF to select pages for deletion.</p>
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

  const pageNumbers = Array.from(
    { length: pdfDocument.numPages },
    (_, index) => index + 1,
  )

  const togglePage = (pageNumber) => {
    const selected = selectedPages.includes(pageNumber)

    if (selected) {
      setSelectionWarning('')
      onSelectedPagesChange(
        selectedPages.filter((value) => value !== pageNumber),
      )
      return
    }

    if (selectedPages.length >= pdfDocument.numPages - 1) {
      setSelectionWarning('At least one page must remain in the PDF.')
      return
    }

    setSelectionWarning('')
    onSelectedPagesChange([...selectedPages, pageNumber].sort((a, b) => a - b))
  }

  return (
    <div className="qc-page-delete">
      <div className="qc-page-delete__summary">
        <p>
          Select pages to delete. {selectedPages.length} of {pdfDocument.numPages} selected.
        </p>
        {selectedPages.length > 0 ? (
          <button
            type="button"
            className="qc-button qc-button--ghost"
            onClick={() => {
              setSelectionWarning('')
              onSelectedPagesChange([])
            }}
            disabled={disabled}
          >
            Clear selection
          </button>
        ) : null}
      </div>

      {selectionWarning ? (
        <p className="qc-page-delete__warning" role="status">
          {selectionWarning}
        </p>
      ) : null}

      <ol className="qc-page-order__list">
        {pageNumbers.map((pageNumber) => {
          const selected = selectedPages.includes(pageNumber)

          return (
            <li key={pageNumber}>
              <button
                type="button"
                className={`qc-page-delete__item ${selected ? 'is-selected' : ''}`}
                aria-pressed={selected}
                onClick={() => togglePage(pageNumber)}
                disabled={disabled}
              >
                <span className="qc-page-order__preview">
                  <PdfPageThumbnail
                    pdfDocument={pdfDocument}
                    pageNumber={pageNumber}
                  />
                </span>
                <strong>Page {pageNumber}</strong>
                <span>{selected ? 'Selected for deletion' : 'Keep this page'}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default PageDeleteEditor
