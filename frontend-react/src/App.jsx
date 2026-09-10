import { useEffect, useState } from 'react'
import './App.css'
import PageDeleteEditor from './components/PageDeleteEditor.jsx'
import PageDuplicateEditor from './components/PageDuplicateEditor.jsx'
import PageExtractEditor from './components/PageExtractEditor.jsx'
import PageOrderEditor from './components/PageOrderEditor.jsx'
import PdfPreview from './components/PdfPreview.jsx'
import UploadFilesPanel from './components/UploadFilesPanel.jsx'
import {
  addPdfPageNumbers,
  compressPdfFile,
  deletePdfPages,
  duplicatePdfPages,
  extractPdfPages,
  flattenPdfFile,
  mergePdfFiles,
  protectPdfFile,
  rearrangePdfFile,
  reversePdfPages,
  rotatePdfFile,
  splitPdfFile,
  unlockPdfFile,
  watermarkPdfFile,
} from './services/pdfApi.js'

const tools = [
  { id: 'merge', title: 'Merge PDF', enabled: true },
  { id: 'split', title: 'Split PDF', enabled: true },
  { id: 'rotate', title: 'Rotate PDF', enabled: true },
  { id: 'compress', title: 'Compress PDF', enabled: true },
  { id: 'flatten', title: 'Flatten PDF', enabled: true },
  { id: 'rearrange', title: 'Rearrange Pages', enabled: true },
  { id: 'delete', title: 'Delete Pages', enabled: true },
  { id: 'duplicate', title: 'Duplicate Pages', enabled: true },
  { id: 'extract', title: 'Extract Pages', enabled: true },
  { id: 'reverse', title: 'Reverse Pages', enabled: true },
  { id: 'page-numbers', title: 'Page Numbers', enabled: true },
  { id: 'protect', title: 'Protect PDF', enabled: true },
  { id: 'unlock', title: 'Unlock PDF', enabled: true },
  { id: 'watermark', title: 'Watermark PDF', enabled: true },
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

function App({ embedded = false }) {
  const [activeToolId, setActiveToolId] = useState('merge')
  const [files, setFiles] = useState([])
  const [activeFileId, setActiveFileId] = useState(null)
  const [splitMode, setSplitMode] = useState('every-page')
  const [splitPages, setSplitPages] = useState('')
  const [rotation, setRotation] = useState('90')
  const [compressionQuality, setCompressionQuality] = useState('medium')
  const [pageOrder, setPageOrder] = useState([])
  const [pagesToDelete, setPagesToDelete] = useState([])
  const [deletePageCount, setDeletePageCount] = useState(0)
  const [pagesToDuplicate, setPagesToDuplicate] = useState([])
  const [pagesToExtract, setPagesToExtract] = useState([])
  const [protectPassword, setProtectPassword] = useState('')
  const [protectPasswordConfirmation, setProtectPasswordConfirmation] = useState('')
  const [showProtectPassword, setShowProtectPassword] = useState(false)
  const [unlockPassword, setUnlockPassword] = useState('')
  const [showUnlockPassword, setShowUnlockPassword] = useState(false)
  const [watermarkText, setWatermarkText] = useState('')
  const [watermarkColor, setWatermarkColor] = useState('gray')
  const [watermarkSize, setWatermarkSize] = useState('large')
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25)
  const [processing, setProcessing] = useState(false)
  const [processError, setProcessError] = useState('')
  const [result, setResult] = useState(null)
  const activeTool = tools.find((tool) => tool.id === activeToolId) ?? tools[0]
  const activeFile = files.find((item) => item.id === activeFileId) ?? files[0]
  const isSingleFileTool = [
    'split',
    'rotate',
    'compress',
    'flatten',
    'rearrange',
    'delete',
    'duplicate',
    'extract',
    'reverse',
    'page-numbers',
    'protect',
    'unlock',
    'watermark',
  ].includes(activeToolId)

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
    setPageOrder([])
    setPagesToDelete([])
    setDeletePageCount(0)
    setPagesToDuplicate([])
    setPagesToExtract([])
    setProtectPassword('')
    setProtectPasswordConfirmation('')
    setShowProtectPassword(false)
    setUnlockPassword('')
    setShowUnlockPassword(false)
    setWatermarkText('')
    setWatermarkColor('gray')
    setWatermarkSize('large')
    setWatermarkOpacity(0.25)

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
    setPageOrder([])
    setPagesToDelete([])
    setDeletePageCount(0)
    setPagesToDuplicate([])
    setPagesToExtract([])
    setProtectPassword('')
    setProtectPasswordConfirmation('')
    setShowProtectPassword(false)
    setUnlockPassword('')
    setShowUnlockPassword(false)
    setWatermarkText('')
    setWatermarkColor('gray')
    setWatermarkSize('large')
    setWatermarkOpacity(0.25)

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
    setCompressionQuality('medium')
    setPageOrder([])
    setPagesToDelete([])
    setDeletePageCount(0)
    setPagesToDuplicate([])
    setPagesToExtract([])
    setProtectPassword('')
    setProtectPasswordConfirmation('')
    setShowProtectPassword(false)
    setUnlockPassword('')
    setShowUnlockPassword(false)
    setWatermarkText('')
    setWatermarkColor('gray')
    setWatermarkSize('large')
    setWatermarkOpacity(0.25)
    setProcessing(false)
  }

  const handleToolChange = (toolId) => {
    if (processing || toolId === activeToolId) return

    clearResult()
    setPageOrder([])
    setPagesToDelete([])
    setDeletePageCount(0)
    setPagesToDuplicate([])
    setPagesToExtract([])
    setProtectPassword('')
    setProtectPasswordConfirmation('')
    setShowProtectPassword(false)
    setUnlockPassword('')
    setShowUnlockPassword(false)
    setWatermarkText('')
    setWatermarkColor('gray')
    setWatermarkSize('large')
    setWatermarkOpacity(0.25)
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

    if (activeToolId === 'compress' && files.length !== 1) {
      setProcessError('Compress PDF requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'flatten' && files.length !== 1) {
      setProcessError('Flatten PDF requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'rearrange' && files.length !== 1) {
      setProcessError('Rearrange Pages requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'rearrange' && pageOrder.length < 1) {
      setProcessError('Wait for all PDF pages to load before processing.')
      return
    }

    if (activeToolId === 'delete' && files.length !== 1) {
      setProcessError('Delete Pages requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'delete' && pagesToDelete.length < 1) {
      setProcessError('Select at least one page to delete.')
      return
    }

    if (
      activeToolId === 'delete' &&
      pagesToDelete.length >= deletePageCount
    ) {
      setProcessError('At least one page must remain in the PDF.')
      return
    }

    if (activeToolId === 'duplicate' && files.length !== 1) {
      setProcessError('Duplicate Pages requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'duplicate' && pagesToDuplicate.length < 1) {
      setProcessError('Select at least one page to duplicate.')
      return
    }

    if (activeToolId === 'extract' && files.length !== 1) {
      setProcessError('Extract Pages requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'extract' && pagesToExtract.length < 1) {
      setProcessError('Select at least one page to extract.')
      return
    }

    if (activeToolId === 'reverse' && files.length !== 1) {
      setProcessError('Reverse Pages requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'page-numbers' && files.length !== 1) {
      setProcessError('Page Numbers requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'protect' && files.length !== 1) {
      setProcessError('Protect PDF requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'protect' && protectPassword.length < 4) {
      setProcessError('Password must contain at least 4 characters.')
      return
    }

    if (
      activeToolId === 'protect' &&
      protectPassword !== protectPasswordConfirmation
    ) {
      setProcessError('Password confirmation does not match.')
      return
    }

    if (activeToolId === 'unlock' && files.length !== 1) {
      setProcessError('Unlock PDF requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'unlock' && unlockPassword.length < 1) {
      setProcessError('Please enter the PDF password.')
      return
    }

    if (activeToolId === 'watermark' && files.length !== 1) {
      setProcessError('Watermark PDF requires exactly one PDF file.')
      return
    }

    if (activeToolId === 'watermark' && !watermarkText.trim()) {
      setProcessError('Please enter watermark text.')
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
      } else if (activeToolId === 'compress') {
        response = await compressPdfFile(
          files[0].file,
          compressionQuality,
        )
      } else if (activeToolId === 'flatten') {
        response = await flattenPdfFile(files[0].file)
      } else if (activeToolId === 'rearrange') {
        response = await rearrangePdfFile(files[0].file, pageOrder)
      } else if (activeToolId === 'delete') {
        response = await deletePdfPages(files[0].file, pagesToDelete)
      } else if (activeToolId === 'duplicate') {
        response = await duplicatePdfPages(
          files[0].file,
          pagesToDuplicate,
        )
      } else if (activeToolId === 'extract') {
        response = await extractPdfPages(files[0].file, pagesToExtract)
      } else if (activeToolId === 'reverse') {
        response = await reversePdfPages(files[0].file)
      } else if (activeToolId === 'page-numbers') {
        response = await addPdfPageNumbers(files[0].file)
      } else if (activeToolId === 'protect') {
        response = await protectPdfFile(files[0].file, protectPassword)
      } else if (activeToolId === 'unlock') {
        response = await unlockPdfFile(files[0].file, unlockPassword)
      } else if (activeToolId === 'watermark') {
        response = await watermarkPdfFile(files[0].file, {
          text: watermarkText,
          color: watermarkColor,
          size: watermarkSize,
          opacity: watermarkOpacity,
        })
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
  } else if (['rotate', 'compress', 'flatten'].includes(activeToolId)) {
    canProcess = files.length === 1
  } else if (activeToolId === 'rearrange') {
    canProcess = files.length === 1 && pageOrder.length > 0
  } else if (activeToolId === 'delete') {
    canProcess = files.length === 1 &&
      pagesToDelete.length > 0 &&
      pagesToDelete.length < deletePageCount
  } else if (activeToolId === 'duplicate') {
    canProcess = files.length === 1 && pagesToDuplicate.length > 0
  } else if (activeToolId === 'extract') {
    canProcess = files.length === 1 && pagesToExtract.length > 0
  } else if (activeToolId === 'reverse') {
    canProcess = files.length === 1
  } else if (activeToolId === 'page-numbers') {
    canProcess = files.length === 1
  } else if (activeToolId === 'protect') {
    canProcess = files.length === 1 &&
      protectPassword.length >= 4 &&
      protectPassword === protectPasswordConfirmation
  } else if (activeToolId === 'unlock') {
    canProcess = files.length === 1 && unlockPassword.length > 0
  } else if (activeToolId === 'watermark') {
    canProcess = files.length === 1 && Boolean(watermarkText.trim())
  }

  return (
    <div className={`qc-app ${embedded ? 'qc-app--embedded' : 'qc-app--standalone'}`}>
      {!embedded ? (
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
      ) : (
        <div className="qc-embedded-heading">
          <div>
            <p className="qc-eyebrow">QuiConvert</p>
            <h1>PDF Tools</h1>
            <p>Upload, preview, and process PDF files securely.</p>
          </div>
          <button
            type="button"
            className="qc-button qc-button--ghost"
            onClick={handleReset}
            disabled={processing}
          >
            Reset workspace
          </button>
        </div>
      )}

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
              ) : activeToolId === 'compress' ? (
                <fieldset className="qc-tool-options">
                  <legend>Compression quality</legend>

                  {[
                    {
                      value: 'low',
                      title: 'Low quality',
                      description: 'Smallest file size and strongest compression.',
                    },
                    {
                      value: 'medium',
                      title: 'Medium quality',
                      description: 'Balanced quality and file size.',
                    },
                    {
                      value: 'high',
                      title: 'High quality',
                      description: 'Best visual quality with lighter compression.',
                    },
                  ].map((option) => (
                    <label className="qc-radio-option" key={option.value}>
                      <input
                        type="radio"
                        name="compression-quality"
                        value={option.value}
                        checked={compressionQuality === option.value}
                        onChange={(event) => {
                          clearResult()
                          setCompressionQuality(event.target.value)
                        }}
                        disabled={processing}
                      />
                      <span>
                        <strong>{option.title}</strong>
                        <small>{option.description}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
              ) : activeToolId === 'rearrange' ? (
                <fieldset className="qc-tool-options qc-tool-options--wide">
                  <legend>Page order</legend>
                  <PageOrderEditor
                    key={activeFile?.id ?? 'empty-page-order'}
                    file={activeFile?.file}
                    pageOrder={pageOrder}
                    onPageOrderChange={setPageOrder}
                    disabled={processing}
                  />
                </fieldset>
              ) : activeToolId === 'flatten' ? (
                <div className="qc-flatten-summary">
                  <div className="qc-flatten-summary__icon" aria-hidden="true">
                    ✓
                  </div>
                  <div>
                    <strong>Make fields and annotations permanent</strong>
                    <p>
                      Entered form values and visible annotations remain on the pages,
                      but they can no longer be edited. Password-protected PDFs must be
                      unlocked first.
                    </p>
                  </div>
                </div>
              ) : activeToolId === 'delete' ? (
                <fieldset className="qc-tool-options qc-tool-options--wide">
                  <legend>Pages to delete</legend>
                  <PageDeleteEditor
                    key={activeFile?.id ?? 'empty-page-delete'}
                    file={activeFile?.file}
                    selectedPages={pagesToDelete}
                    onSelectedPagesChange={setPagesToDelete}
                    onPageCountChange={setDeletePageCount}
                    disabled={processing}
                  />
                </fieldset>
              ) : activeToolId === 'duplicate' ? (
                <fieldset className="qc-tool-options qc-tool-options--wide">
                  <legend>Pages to duplicate</legend>
                  <PageDuplicateEditor
                    key={activeFile?.id ?? 'empty-page-duplicate'}
                    file={activeFile?.file}
                    selectedPages={pagesToDuplicate}
                    onSelectedPagesChange={setPagesToDuplicate}
                    disabled={processing}
                  />
                </fieldset>
              ) : activeToolId === 'extract' ? (
                <fieldset className="qc-tool-options qc-tool-options--wide">
                  <legend>Pages to extract</legend>
                  <PageExtractEditor
                    key={activeFile?.id ?? 'empty-page-extract'}
                    file={activeFile?.file}
                    selectedPages={pagesToExtract}
                    onSelectedPagesChange={setPagesToExtract}
                    disabled={processing}
                  />
                </fieldset>
              ) : activeToolId === 'reverse' ? (
                <div className="qc-reverse-summary">
                  <div className="qc-reverse-summary__icon" aria-hidden="true">
                    ⇄
                  </div>
                  <div>
                    <strong>Reverse the complete document</strong>
                    <p>
                      The last page becomes the first, and the first page becomes the last.
                    </p>
                  </div>
                </div>
              ) : activeToolId === 'page-numbers' ? (
                <div className="qc-page-numbers-summary">
                  <div className="qc-page-numbers-summary__icon" aria-hidden="true">
                    123
                  </div>
                  <div>
                    <strong>Add numbers to every page</strong>
                    <p>
                      QuiConvert will apply sequential page numbers using the current backend style.
                    </p>
                  </div>
                </div>
              ) : activeToolId === 'protect' ? (
                <fieldset className="qc-tool-options qc-password-options">
                  <legend>Document password</legend>

                  <label className="qc-field">
                    <span>Password</span>
                    <input
                      type={showProtectPassword ? 'text' : 'password'}
                      value={protectPassword}
                      minLength="4"
                      autoComplete="new-password"
                      placeholder="At least 4 characters"
                      onChange={(event) => {
                        clearResult()
                        setProtectPassword(event.target.value)
                      }}
                      disabled={processing}
                    />
                  </label>

                  <label className="qc-field">
                    <span>Confirm password</span>
                    <input
                      type={showProtectPassword ? 'text' : 'password'}
                      value={protectPasswordConfirmation}
                      minLength="4"
                      autoComplete="new-password"
                      placeholder="Enter the same password again"
                      onChange={(event) => {
                        clearResult()
                        setProtectPasswordConfirmation(event.target.value)
                      }}
                      disabled={processing}
                    />
                  </label>

                  <label className="qc-password-toggle">
                    <input
                      type="checkbox"
                      checked={showProtectPassword}
                      onChange={(event) => setShowProtectPassword(event.target.checked)}
                      disabled={processing}
                    />
                    <span>Show password</span>
                  </label>

                  {protectPasswordConfirmation &&
                  protectPassword !== protectPasswordConfirmation ? (
                    <p className="qc-password-message qc-password-message--error">
                      Passwords do not match.
                    </p>
                  ) : protectPassword.length > 0 && protectPassword.length < 4 ? (
                    <p className="qc-password-message">
                      Use at least 4 characters.
                    </p>
                  ) : (
                    <p className="qc-password-message">
                      Keep this password safe. It is required to open the protected PDF.
                    </p>
                  )}
                </fieldset>
              ) : activeToolId === 'unlock' ? (
                <fieldset className="qc-tool-options qc-password-options">
                  <legend>Existing PDF password</legend>

                  <label className="qc-field">
                    <span>Password</span>
                    <input
                      type={showUnlockPassword ? 'text' : 'password'}
                      value={unlockPassword}
                      autoComplete="current-password"
                      placeholder="Enter the current PDF password"
                      onChange={(event) => {
                        clearResult()
                        setUnlockPassword(event.target.value)
                      }}
                      disabled={processing}
                    />
                  </label>

                  <label className="qc-password-toggle">
                    <input
                      type="checkbox"
                      checked={showUnlockPassword}
                      onChange={(event) => setShowUnlockPassword(event.target.checked)}
                      disabled={processing}
                    />
                    <span>Show password</span>
                  </label>

                  <p className="qc-password-message">
                    The password is used only to unlock this processing request.
                  </p>
                </fieldset>
              ) : activeToolId === 'watermark' ? (
                <fieldset className="qc-tool-options qc-watermark-options">
                  <legend>Watermark settings</legend>

                  <label className="qc-field">
                    <span>Watermark text</span>
                    <input
                      type="text"
                      value={watermarkText}
                      placeholder="Example: CONFIDENTIAL"
                      onChange={(event) => {
                        clearResult()
                        setWatermarkText(event.target.value)
                      }}
                      disabled={processing}
                    />
                  </label>

                  <div className="qc-option-group">
                    <span className="qc-option-group__label">Color</span>
                    <div className="qc-option-group__choices">
                      {['gray', 'black', 'red'].map((color) => (
                        <label className="qc-compact-radio" key={color}>
                          <input
                            type="radio"
                            name="watermark-color"
                            value={color}
                            checked={watermarkColor === color}
                            onChange={(event) => {
                              clearResult()
                              setWatermarkColor(event.target.value)
                            }}
                            disabled={processing}
                          />
                          <span>{color[0].toUpperCase() + color.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="qc-option-group">
                    <span className="qc-option-group__label">Font size</span>
                    <div className="qc-option-group__choices">
                      {['small', 'medium', 'large'].map((size) => (
                        <label className="qc-compact-radio" key={size}>
                          <input
                            type="radio"
                            name="watermark-size"
                            value={size}
                            checked={watermarkSize === size}
                            onChange={(event) => {
                              clearResult()
                              setWatermarkSize(event.target.value)
                            }}
                            disabled={processing}
                          />
                          <span>{size[0].toUpperCase() + size.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="qc-range-field">
                    <span>
                      Opacity
                      <output>{Math.round(watermarkOpacity * 100)}%</output>
                    </span>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(event) => {
                        clearResult()
                        setWatermarkOpacity(Number(event.target.value))
                      }}
                      disabled={processing}
                    />
                  </label>
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
