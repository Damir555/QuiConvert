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
