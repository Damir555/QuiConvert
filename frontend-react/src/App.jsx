import { useEffect, useState } from 'react'
import './App.css'
import UploadFilesPanel from './components/UploadFilesPanel.jsx'
import { mergePdfFiles } from './services/pdfApi.js'

const tools = [
  'Merge PDF',
  'Split PDF',
  'Rotate PDF',
  'Compress PDF',
  'Rearrange Pages',
  'Delete Pages',
  'Duplicate Pages',
  'Extract Pages',
  'Reverse Pages',
  'Page Numbers',
  'Protect PDF',
  'Unlock PDF',
  'Watermark PDF',
]

function App() {
  const [files, setFiles] = useState([])
  const [activeFileId, setActiveFileId] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [processError, setProcessError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url)
      }
    }
  }, [result])

  const clearResult = () => {
    setResult((current) => {
      if (current?.url) {
        URL.revokeObjectURL(current.url)
      }
      return null
    })
    setProcessError('')
  }

  const handleFilesAdded = (incomingFiles) => {
    if (!incomingFiles.length) return

    clearResult()

    setFiles((current) => {
      const next = [...current, ...incomingFiles]

      if (!activeFileId && next.length > 0) {
        setActiveFileId(next[0].id)
      }

      return next
    })
  }

  const handleRemoveFile = (fileId) => {
    clearResult()

    setFiles((current) => {
      const next = current.filter((item) => item.id !== fileId)

      setActiveFileId((currentActiveId) => {
        if (currentActiveId !== fileId) return currentActiveId
        return next[0]?.id ?? null
      })

      return next
    })
  }

  const handleReset = () => {
    clearResult()
    setFiles([])
    setActiveFileId(null)
    setProcessing(false)
  }

  const handleProcess = async () => {
    if (processing) return

    if (files.length < 2) {
      setProcessError('Merge PDF requires at least two PDF files.')
      return
    }

    setProcessing(true)
    setProcessError('')
    clearResult()

    try {
      const response = await mergePdfFiles(files.map((item) => item.file))

      const url = URL.createObjectURL(response.blob)

      setResult({
        url,
        filename: response.filename || 'merged.pdf',
      })
    } catch (error) {
      setProcessError(
        error instanceof Error
          ? error.message
          : 'PDF processing failed.',
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="qc-app">
      <header className="qc-topbar">
        <div className="qc-brand">
          <span className="qc-brand__mark" aria-hidden="true">Q</span>
          <div>
            <strong className="qc-brand__name">QuiConvert</strong>
            <span className="qc-brand__tagline">PDF workspace</span>
          </div>
        </div>

        <div className="qc-topbar__actions">
          <span className="qc-env-badge">React migration</span>
          <button
            type="button"
            className="qc-button qc-button--ghost"
            onClick={handleReset}
            disabled={processing}
          >
            Reset
          </button>
        </div>
      </header>

      <main className="qc-workspace">
        <aside className="qc-panel qc-tools">
          <div className="qc-panel__header">
            <div>
              <p className="qc-eyebrow">Workspace</p>
              <h2>PDF Tools</h2>
            </div>
          </div>

          <div className="qc-tool-list" role="list">
            {tools.map((tool, index) => (
              <button
                key={tool}
                type="button"
                className={`qc-tool-item ${index === 0 ? 'is-active' : ''}`}
                disabled={index !== 0}
                title={index === 0 ? 'Merge PDF' : 'Not migrated yet'}
              >
                <span className="qc-tool-item__dot" aria-hidden="true" />
                <span>{tool}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="qc-main-column">
          <UploadFilesPanel
            files={files}
            activeFileId={activeFileId}
            onFilesAdded={handleFilesAdded}
            onSelectFile={setActiveFileId}
            onRemoveFile={handleRemoveFile}
          />

          <section className="qc-panel qc-preview">
            <div className="qc-panel__header qc-panel__header--row">
              <div>
                <p className="qc-eyebrow">Document</p>
                <h2>Preview</h2>
              </div>
              <div className="qc-preview__toolbar">
                <button type="button" className="qc-icon-button" aria-label="Previous page">←</button>
                <span>Page 1 of 1</span>
                <button type="button" className="qc-icon-button" aria-label="Next page">→</button>
              </div>
            </div>

            <div className="qc-preview__body">
              <div className="qc-preview__stage">
                <div className="qc-paper">
                  <div className="qc-paper__logo">QuiConvert</div>
                  <div className="qc-paper__line qc-paper__line--wide" />
                  <div className="qc-paper__line" />
                  <div className="qc-paper__line qc-paper__line--short" />
                  <div className="qc-paper__block" />
                  <div className="qc-paper__line qc-paper__line--wide" />
                  <div className="qc-paper__line" />
                </div>
              </div>

              <aside className="qc-document-details">
                <h3>Document details</h3>
                <dl>
                  <div><dt>Status</dt><dd>{processing ? 'Processing' : files.length ? 'Ready' : 'Waiting'}</dd></div>
                  <div><dt>Files</dt><dd>{files.length}</dd></div>
                  <div><dt>Active</dt><dd>{activeFileId ? 'Selected' : 'None'}</dd></div>
                  <div><dt>Engine</dt><dd>Flask API</dd></div>
                </dl>
              </aside>
            </div>
          </section>

          <section className="qc-bottom-grid">
            <section className="qc-panel qc-action">
              <div className="qc-panel__header">
                <div>
                  <p className="qc-eyebrow">Tool settings</p>
                  <h2>Merge PDF</h2>
                </div>
              </div>

              <p className="qc-muted">
                Merge uses the existing QuiConvert Flask endpoint.
              </p>

              <button
                type="button"
                className="qc-button qc-button--primary qc-button--wide"
                onClick={handleProcess}
                disabled={processing || files.length < 2}
              >
                {processing ? 'Processing…' : 'Process PDF'}
              </button>
            </section>

            <section className="qc-panel qc-result">
              <div className="qc-panel__header">
                <div>
                  <p className="qc-eyebrow">Output</p>
                  <h2>Result</h2>
                </div>
              </div>

              {processError ? (
                <div className="qc-result__empty" role="alert">
                  {processError}
                </div>
              ) : result ? (
                <div className="qc-result__empty">
                  <a
                    className="qc-button qc-button--primary"
                    href={result.url}
                    download={result.filename}
                  >
                    Download {result.filename}
                  </a>
                </div>
              ) : (
                <div className="qc-result__empty">
                  {processing
                    ? 'Processing PDF…'
                    : 'Processed files will appear here.'}
                </div>
              )}
            </section>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App
