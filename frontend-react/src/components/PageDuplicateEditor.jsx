import { useEffect, useState } from 'react'
import PdfPageThumbnail from './PdfPageThumbnail.jsx'
import { loadPdfJs } from '../services/pdfJs.js'

function PageDuplicateEditor({
  file,
  selectedPages,
  onSelectedPagesChange,
  disabled,
}) {
  const [pdfDocument, setPdfDocument] = useState(null)
  const [loading, setLoading] = useState(() => file instanceof File)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let loadedDocument = null

    if (!(file instanceof File)) return undefined

    const loadDocument = async () => {
      try {
        const pdfjsLib = await loadPdfJs()
        const data = new Uint8Array(await file.arrayBuffer())
        loadedDocument = await pdfjsLib.getDocument({ data }).promise

        if (cancelled) {
          await loadedDocument.destroy()
          return
        }

        setPdfDocument(loadedDocument)
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
  }, [file, onSelectedPagesChange])

  if (!(file instanceof File)) {
    return <p className="qc-muted">Add one PDF to select pages to duplicate.</p>
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
    if (selectedPages.includes(pageNumber)) {
      onSelectedPagesChange(
        selectedPages.filter((value) => value !== pageNumber),
      )
      return
    }

    onSelectedPagesChange([...selectedPages, pageNumber].sort((a, b) => a - b))
  }

  return (
    <div className="qc-page-duplicate">
      <div className="qc-page-delete__summary">
        <p>
          Select pages to duplicate. {selectedPages.length} of {pdfDocument.numPages} selected.
        </p>
        {selectedPages.length > 0 ? (
          <button
            type="button"
            className="qc-button qc-button--ghost"
            onClick={() => onSelectedPagesChange([])}
            disabled={disabled}
          >
            Clear selection
          </button>
        ) : null}
      </div>

      <ol className="qc-page-order__list">
        {pageNumbers.map((pageNumber) => {
          const selected = selectedPages.includes(pageNumber)

          return (
            <li key={pageNumber}>
              <button
                type="button"
                className={`qc-page-duplicate__item ${selected ? 'is-selected' : ''}`}
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
                <span>{selected ? 'Selected for duplication' : 'Keep one copy'}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default PageDuplicateEditor
