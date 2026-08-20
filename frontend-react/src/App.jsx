import { useEffect, useState } from 'react'
import './App.css'
import PdfPreview from './components/PdfPreview.jsx'
import UploadFilesPanel from './components/UploadFilesPanel.jsx'
import {
  mergePdfFiles,
  rotatePdfFile,
  splitPdfFile,
} from './services/pdfApi.js'

const tools = [
  { id: 'merge', title: 'Merge PDF', enabled: true },
  { id: 'split', title: 'Split PDF', enabled: true },
  { id: 'rotate', title: 'Rotate PDF', enabled: true },
  { id: 'compress', title: 'Compress PDF' },
  { id: 'rearrange', title: 'Rearrange Pages' },
  { id: 'delete', title: 'Delete Pages' },
  { id: 'duplicate', title: 'Duplicate Pages' },
  { id: 'extract', title: 'Extract Pages' },
  { id: 'reverse', title: 'Reverse Pages' },
  { id: 'page-numbers', title: 'Page Numbers' },
  { id: 'protect', title: 'Protect PDF' },
  { id: 'unlock', title: 'Unlock PDF' },
  { id: 'watermark', title: 'Watermark PDF' },
]

function isValidPageRange(value) {
  if (!/^\d+(?:-\d+)?(?:\s*,\s*\d+(?:-\d+)?)*$/.test(value)) {
    return false
  }

  return value.split(',').every((part) => {
    const [start, end = start] = part.trim().split('-').map(Number)
    return start > 0 && end >= start
  })
}

function App() {
  const [activeToolId, setActiveToolId] = useState('merge')
  const [files, setFiles] = useState([])
  const [activeFileId, setActiveFileId] = useState(null)
  const [splitMode, setSplitMode] = useState('every-page')
  const [splitPages, setSplitPages] = useState('')
  const [rotation, setRotation] = useState('90')
  const [processing, setProcessing] = useState(false)
  const [processError, setProcessError] = useState('')
  const [result, setResult] = useState(null)
  const activeTool = tools.find((tool) => tool.id === activeToolId) ?? tools[0]
  const activeFile = files.find((item) => item.id === activeFileId) ?? files[0]
  const isSingleFileTool = activeToolId === 'split' || activeToolId === 'rotate'

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

    if (isSingleFileTool) {
      const [firstFile] = incomingFiles
      setFiles([firstFile])
      setActiveFileId(firstFile.id)
      return
    }

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
    setSplitMode('every-page')
    setSplitPages('')
    setRotation('90')
    setProcessing(false)
  }

  const handleToolChange = (toolId) => {
    if (processing || toolId === activeToolId) return

    clearResult()
    setActiveToolId(toolId)
  }

  const handleProcess = async () => {
    if (processing) return

    if (activeToolId === 'merge' && files.length < 2) {
      setProcessError('Merge PDF requires at least two PDF files.')
      return
    }

    if (activeToolId === 'split' && files.length !== 1) {
      setProcessError('Split PDF requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'rotate' && files.length !== 1) {
      setProcessError('Rotate PDF requires exactly one PDF file.')
      return
    }

    const requestedPages = splitMode === 'range' ? splitPages.trim() : ''

    if (
      activeToolId === 'split' &&
      splitMode === 'range' &&
      !isValidPageRange(requestedPages)
    ) {
      setProcessError('Enter a valid page range, for example 1-3,5,8-10.')
      return
    }

    setProcessing(true)
    setProcessError('')
    clearResult()

    try {
      let response

      if (activeToolId === 'split') {
        response = await splitPdfFile(files[0].file, requestedPages)
      } else if (activeToolId === 'rotate') {
        response = await rotatePdfFile(files[0].file, rotation)
      } else {
        response = await mergePdfFiles(files.map((item) => item.file))
      }

      const url = URL.createObjectURL(response.blob)

      setResult({
        url,
        filename: response.filename,
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

  let canProcess = files.length >= 2

  if (activeToolId === 'split') {
    canProcess = files.length === 1 &&
      (splitMode === 'every-page' || isValidPageRange(splitPages.trim()))
  } else if (activeToolId === 'rotate') {
    canProcess = files.length === 1
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
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`qc-tool-item ${tool.id === activeToolId ? 'is-active' : ''}`}
                disabled={!tool.enabled || processing}
                title={tool.enabled ? tool.title : 'Not migrated yet'}
                onClick={() => handleToolChange(tool.id)}
              >
                <span className="qc-tool-item__dot" aria-hidden="true" />
                <span>{tool.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="qc-main-column">
          <UploadFilesPanel
            files={files}
            activeFileId={activeFileId}
            multiple={!isSingleFileTool}
            onFilesAdded={handleFilesAdded}
            onSelectFile={setActiveFileId}
            onRemoveFile={handleRemoveFile}
          />

          <PdfPreview
            key={activeFile?.id ?? 'empty-preview'}
            file={activeFile?.file}
            fileCount={files.length}
            processing={processing}
          />

          <section className="qc-bottom-grid">
            <section className="qc-panel qc-action">
              <div className="qc-panel__header">
                <div>
                  <p className="qc-eyebrow">Tool settings</p>
                  <h2>{activeTool.title}</h2>
                </div>
              </div>

              {activeToolId === 'split' ? (
                <fieldset className="qc-tool-options">
                  <legend>Split mode</legend>

                  <label className="qc-radio-option">
                    <input
                      type="radio"
                      name="split-mode"
                      value="every-page"
                      checked={splitMode === 'every-page'}
                      onChange={(event) => {
                        clearResult()
                        setSplitMode(event.target.value)
                      }}
                      disabled={processing}
                    />
                    <span>
                      <strong>Split every page</strong>
                      <small>Download all pages as a ZIP archive.</small>
                    </span>
                  </label>

                  <label className="qc-radio-option">
                    <input
                      type="radio"
                      name="split-mode"
                      value="range"
                      checked={splitMode === 'range'}
                      onChange={(event) => {
                        clearResult()
                        setSplitMode(event.target.value)
                      }}
                      disabled={processing}
                    />
                    <span>
                      <strong>Use page ranges</strong>
                      <small>Choose pages or ranges to extract.</small>
                    </span>
                  </label>

                  {splitMode === 'range' ? (
                    <label className="qc-field">
                      <span>Page range</span>
                      <input
                        type="text"
                        value={splitPages}
                        placeholder="Example: 1-3,5,8-10"
                        onChange={(event) => {
                          clearResult()
                          setSplitPages(event.target.value)
                        }}
                        disabled={processing}
                      />
                    </label>
                  ) : null}
                </fieldset>
              ) : activeToolId === 'rotate' ? (
                <fieldset className="qc-tool-options">
                  <legend>Rotation</legend>

                  {['90', '180', '270'].map((degrees) => (
                    <label className="qc-radio-option" key={degrees}>
                      <input
                        type="radio"
                        name="rotation"
                        value={degrees}
                        checked={rotation === degrees}
                        onChange={(event) => {
                          clearResult()
                          setRotation(event.target.value)
                        }}
                        disabled={processing}
                      />
                      <span>
                        <strong>{degrees}° clockwise</strong>
                        <small>Rotate every page in the document.</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
              ) : (
                <p className="qc-muted">
                  Merge uses the existing QuiConvert Flask endpoint.
                </p>
              )}

              <button
                type="button"
                className="qc-button qc-button--primary qc-button--wide"
                onClick={handleProcess}
                disabled={processing || !canProcess}
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
