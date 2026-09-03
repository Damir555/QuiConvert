export function isPdfFile(file) {
  if (!(file instanceof File)) return false

  const extension = file.name.split('.').pop()?.toLowerCase()

  return file.type === 'application/pdf' || extension === 'pdf'
}

export function createFileRecord(file) {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return {
    id,
    file,
    name: file.name,
    size: file.size,
    type: file.type || 'application/pdf',
    lastModified: file.lastModified,
  }
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB'

  const kilobytes = bytes / 1024

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`
  }

  const megabytes = kilobytes / 1024
  return `${megabytes.toFixed(2)} MB`
}
