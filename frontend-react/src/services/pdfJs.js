let pdfJsPromise

export function loadPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import('../../../qc-core/vendor/pdfjs/pdf.mjs').then(
      (pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          '../../../qc-core/vendor/pdfjs/pdf.worker.mjs',
          import.meta.url,
        ).href

        return pdfjsLib
      },
    )
  }

  return pdfJsPromise
}
