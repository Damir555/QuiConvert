import { useRef, useState } from 'react'
import { createFileRecord, formatFileSize, isPdfFile } from '../utils/files.js'

function UploadFilesPanel({
  files,
  activeFileId,
  multiple = true,
  onFilesAdded,
  onSelectFile,
  onRemoveFile,
}) {
  const dragDepthRef = useRef(0)
  const [dragActive, setDragActive] = useState(false)
  const [warning, setWarning] = useState('')

  const workspaceMessage =
    files.length === 0
      ? ''
      : files.length === 1
        ? '1 PDF file is currently in the workspace.'
        : `${files.length} PDF files are currently in the workspace.`

  const processFiles = (fileList) => {
    const selected = Array.from(fileList ?? [])

    if (selected.length === 0) {
      setWarning('No files were selected.')
      return
    }

    const accepted = selected.filter(isPdfFile)
    const rejectedCount = selected.length - accepted.length

    if (accepted.length === 0) {
      setWarning(
        rejectedCount === 1
          ? 'The selected file is not a PDF.'
          : `${rejectedCount} selected files are not PDFs.`,
      )
      return
    }

    const acceptedForTool = multiple ? accepted : accepted.slice(0, 1)
    onFilesAdded(acceptedForTool.map(createFileRecord))

    if (!multiple && accepted.length > 1) {
      setWarning('This PDF tool accepts one file. Only the first PDF was added.')
    } else if (rejectedCount > 0) {
      setWarning(
        rejectedCount === 1
          ? '1 unsupported file was ignored.'
          : `${rejectedCount} unsupported files were ignored.`,
      )
    } else {
      setWarning('')
    }
  }

  const handleInput = (event) => {
    const input = event.currentTarget
    const selectedFiles = Array.from(input.files ?? [])

    input.value = ''
    processFiles(selectedFiles)
  }

  const handleDragEnter = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current += 1
    setDragActive(true)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }

    setDragActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()

    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) {
      setDragActive(false)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()

    dragDepthRef.current = 0
    setDragActive(false)
    processFiles(event.dataTransfer?.files)
  }

  return (
    <section className="qc-panel qc-files">
      <div className="qc-panel__header qc-panel__header--row">
        <div>
          <p className="qc-eyebrow">Input</p>
          <h2>
            Files <span className="qc-files__count">{files.length}</span>
          </h2>
        </div>

        <label
          className="qc-file-picker"
        >
          <span className="qc-button qc-button--primary" aria-hidden="true">
            {multiple ? 'Add PDFs' : 'Add PDF'}
          </span>

          <input
            className="qc-file-picker__input"
            type="file"
            accept="application/pdf,.pdf"
            multiple={multiple}
            aria-label={multiple ? 'Add PDF files' : 'Add a PDF file'}
            onInput={handleInput}
          />
        </label>
      </div>

      <div
        className={`qc-dropzone ${dragActive ? 'is-drag-active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="qc-dropzone__icon" aria-hidden="true">
          PDF
        </div>

        <div>
          <h3>
            {dragActive
              ? `Drop ${multiple ? 'PDF files' : 'a PDF'} to add`
              : `Drop ${multiple ? 'PDF files' : 'a PDF'} here`}
          </h3>
          <p>
            {dragActive
              ? 'Release to add files to the workspace.'
              : files.length === 0
                ? `Drag and drop ${multiple ? 'PDF files' : 'a PDF'} here or choose ${multiple ? 'them' : 'it'} from your device.`
                : workspaceMessage}
          </p>
        </div>
      </div>

      {warning ? (
        <p
          className="qc-upload-status qc-upload-status--warning"
          role="status"
          aria-live="polite"
        >
          {warning}
        </p>
      ) : workspaceMessage ? (
        <p
          className="qc-upload-status qc-upload-status--success"
          role="status"
          aria-live="polite"
        >
          {workspaceMessage}
        </p>
      ) : null}

      {files.length === 0 ? (
        <p className="qc-files__empty">No documents selected.</p>
      ) : (
        <ul className="qc-files__list">
          {files.map((item) => {
            const active = item.id === activeFileId

            return (
              <li
                key={item.id}
                className={`qc-file-row ${active ? 'is-active' : ''}`}
              >
                <button
                  type="button"
                  className="qc-file-row__select"
                  aria-pressed={active}
                  aria-label={`Select ${item.name}`}
                  onClick={() => onSelectFile(item.id)}
                >
                  <span className="qc-file-row__icon" aria-hidden="true">
                    PDF
                  </span>

                  <span className="qc-file-row__content">
                    <strong title={item.name}>{item.name}</strong>
                    <span>{formatFileSize(item.size)}</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="qc-file-row__remove"
                  aria-label={`Remove ${item.name}`}
                  title={`Remove ${item.name}`}
                  onClick={() => {
                    setWarning('')
                    onRemoveFile(item.id)
                  }}
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default UploadFilesPanel
