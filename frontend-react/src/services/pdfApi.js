const PDF_API_BASE = '/api/pdf'

function getFilenameFromDisposition(value) {
  if (!value) return null

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].replace(/["']/g, ''))
    } catch {
      return utf8Match[1].replace(/["']/g, '')
    }
  }

  const simpleMatch = value.match(/filename="?([^";]+)"?/i)
  return simpleMatch?.[1] ?? null
}

async function readApiError(response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      const data = await response.json()
      return data?.error || data?.message || `Request failed (${response.status}).`
    } catch {
      return `Request failed (${response.status}).`
    }
  }

  try {
    const text = await response.text()
    return text.trim() || `Request failed (${response.status}).`
  } catch {
    return `Request failed (${response.status}).`
  }
}

async function postPdfTool(endpoint, formData, fallbackFilename) {
  let response

  try {
    response = await fetch(`${PDF_API_BASE}/${endpoint}`, {
      method: 'POST',
      body: formData,
    })
  } catch (error) {
    throw new Error(
      'Could not reach the QuiConvert backend. Make sure Flask is running on http://127.0.0.1:5000.',
      { cause: error },
    )
  }

  if (!response.ok) {
    throw new Error(await readApiError(response))
  }

  const blob = await response.blob()

  if (!blob.size) {
    throw new Error('The backend returned an empty result.')
  }

  return {
    blob,
    filename:
      getFilenameFromDisposition(
        response.headers.get('content-disposition'),
      ) || fallbackFilename,
    contentType: response.headers.get('content-type') ?? blob.type,
  }
}

export async function mergePdfFiles(files) {
  if (!Array.isArray(files) || files.length < 2) {
    throw new Error('Merge PDF requires at least two PDF files.')
  }

  const formData = new FormData()

  for (const file of files) {
    if (!(file instanceof File)) {
      throw new TypeError('Merge request contains an invalid file.')
    }

    formData.append('files', file, file.name)
  }

  return postPdfTool('merge', formData, 'merged.pdf')
}

export async function splitPdfFile(file, splitPages = '') {
  if (!(file instanceof File)) {
    throw new TypeError('Split PDF requires one valid PDF file.')
  }

  const formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('split_pages', splitPages.trim())

  return postPdfTool('split', formData, 'split-pages.zip')
}

export async function rotatePdfFile(file, rotation = '90') {
  if (!(file instanceof File)) {
    throw new TypeError('Rotate PDF requires one valid PDF file.')
  }

  const normalizedRotation = String(rotation)

  if (!['90', '180', '270'].includes(normalizedRotation)) {
    throw new RangeError('Rotation must be 90, 180, or 270 degrees.')
  }

  const formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('rotation', normalizedRotation)

  return postPdfTool('rotate', formData, 'rotated.pdf')
}

export async function compressPdfFile(file, quality = 'medium') {
  if (!(file instanceof File)) {
    throw new TypeError('Compress PDF requires one valid PDF file.')
  }

  const normalizedQuality = String(quality).toLowerCase()

  if (!['low', 'medium', 'high'].includes(normalizedQuality)) {
    throw new RangeError('Compression quality must be low, medium, or high.')
  }

  const formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('quality', normalizedQuality)

  return postPdfTool('compress', formData, 'compressed.pdf')
}

export async function rearrangePdfFile(file, pageOrder) {
  if (!(file instanceof File)) {
    throw new TypeError('Rearrange Pages requires one valid PDF file.')
  }

  if (!Array.isArray(pageOrder) || pageOrder.length < 1) {
    throw new Error('A complete page order is required.')
  }

  const normalizedOrder = pageOrder.map(Number)
  const uniquePages = new Set(normalizedOrder)
  const containsEveryPage = normalizedOrder.every(
    (pageNumber, index) => Number.isInteger(pageNumber) &&
      pageNumber > 0 && uniquePages.has(index + 1),
  )

  if (uniquePages.size !== normalizedOrder.length || !containsEveryPage) {
    throw new Error('Page order must contain every page exactly once.')
  }

  const formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('page_order', normalizedOrder.join(','))

  return postPdfTool('rearrange', formData, 'rearranged.pdf')
}

export async function deletePdfPages(file, pages) {
  if (!(file instanceof File)) {
    throw new TypeError('Delete Pages requires one valid PDF file.')
  }

  if (!Array.isArray(pages) || pages.length < 1) {
    throw new Error('Select at least one page to delete.')
  }

  const normalizedPages = [...new Set(pages.map(Number))]
    .filter((pageNumber) => Number.isInteger(pageNumber) && pageNumber > 0)
    .sort((a, b) => a - b)

  if (normalizedPages.length !== pages.length) {
    throw new Error('The page selection contains an invalid page number.')
  }

  const formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('pages', normalizedPages.join(','))

  return postPdfTool('delete-pages', formData, 'pages-deleted.pdf')
}

export async function duplicatePdfPages(file, pages) {
  if (!(file instanceof File)) {
    throw new TypeError('Duplicate Pages requires one valid PDF file.')
  }

  if (!Array.isArray(pages) || pages.length < 1) {
    throw new Error('Select at least one page to duplicate.')
  }

  const normalizedPages = [...new Set(pages.map(Number))]
    .filter((pageNumber) => Number.isInteger(pageNumber) && pageNumber > 0)
    .sort((a, b) => a - b)

  if (normalizedPages.length !== pages.length) {
    throw new Error('The page selection contains an invalid page number.')
  }

  const formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('pages', normalizedPages.join(','))

  return postPdfTool('duplicate-pages', formData, 'pages-duplicated.pdf')
}

export async function extractPdfPages(file, pages) {
  if (!(file instanceof File)) {
    throw new TypeError('Extract Pages requires one valid PDF file.')
  }

  if (!Array.isArray(pages) || pages.length < 1) {
    throw new Error('Select at least one page to extract.')
  }

  const normalizedPages = [...new Set(pages.map(Number))]
    .filter((pageNumber) => Number.isInteger(pageNumber) && pageNumber > 0)
    .sort((a, b) => a - b)

  if (normalizedPages.length !== pages.length) {
    throw new Error('The page selection contains an invalid page number.')
  }

  const formData = new FormData()
  formData.append('files', file, file.name)
  formData.append('pages', normalizedPages.join(','))

  return postPdfTool('extract-pages', formData, 'extracted-pages.pdf')
}

export async function reversePdfPages(file) {
  if (!(file instanceof File)) {
    throw new TypeError('Reverse Pages requires one valid PDF file.')
  }

  const formData = new FormData()
  formData.append('files', file, file.name)

  return postPdfTool('reverse-pages', formData, 'reversed-pages.pdf')
}
