window.QuiConvert512 = window.QuiConvert512 || {};

(function(QC) {
  function isPdf(file) {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }

  function hasOversizedFiles(files) {
    return Array.from(files).some(file => file.size > QC.maxUploadBytes);
  }

  function validateForTool(tool, files) {
    if (!files.length) return QC.strings.noFiles || 'Please add at least one PDF file.';
    if (hasOversizedFiles(files)) return QC.strings.fileTooLarge || ('File is too large. Free limit is ' + QC.maxUploadMb + ' MB.');
    if (tool.minFiles && files.length < tool.minFiles) {
      return tool.id === 'merge'
        ? (QC.strings.mergeNeedTwo || 'Please upload at least two PDF files for merge.')
        : 'Please upload more files for this tool.';
    }
    if (tool.maxFiles && files.length > tool.maxFiles) {
      return tool.maxFiles === 1
        ? (QC.strings.singleFileOnly || 'Please upload only one PDF file for this tool.')
        : (QC.strings.tooManyFiles || 'Too many files selected for this tool.');
    }
    return null;
  }

  function updateInputForTool(input, tool) {
    if (!input || !tool) return;

    if (tool.multiple) {
      input.setAttribute('multiple', 'multiple');
    } else {
      input.removeAttribute('multiple');
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.qc512-tool').forEach(function(root) {
      let selectedFiles = [];
      let currentAction = root.dataset.defaultAction === 'all' ? 'merge' : root.dataset.defaultAction;
      let currentTool = QC.getTool(currentAction);
      const state = QC.createStateEngine(root);

      const dropzone = root.querySelector('.qc512-dropzone');
      const choose = root.querySelector('.qc512-choose');
      const input = root.querySelector('.qc512-file-input');
      const fileList = root.querySelector('.qc512-file-list');
      const result = root.querySelector('.qc512-result');
      const dropText = root.querySelector('.qc512-drop-text');
      const splitOptions = root.querySelector('.qc512-split-options');
      const splitPages = root.querySelector('.qc512-split-pages');
      const emailInput = root.querySelector('.qc512-email-input');

      if (!dropzone || !choose || !input || !result) return;

      state.subscribe(({ current }) => {
        QC.ui.applyState(root, current);
      });

      updateInputForTool(input, currentTool);
      state.reset();

      function renderFiles() {
        if (!selectedFiles.length) {
          fileList.innerHTML = '';
          if (dropText) dropText.textContent = QC.strings.idle || 'Drop PDF files here';
          state.reset();
          return;
        }

        if (dropText) dropText.textContent = selectedFiles.length + ' ' + (QC.strings.filesSelected || 'file(s) selected');
        fileList.innerHTML = selectedFiles.map(file => {
          return '<div class="qc512-file"><span>' + file.name + '</span><small>' + QC.ui.formatBytes(file.size) + '</small></div>';
        }).join('');

        if (QC.events && QC.eventNames) {
          QC.events.emit(QC.eventNames.FILES_SELECTED, {
            count: selectedFiles.length,
            totalBytes: selectedFiles.reduce((sum, file) => sum + file.size, 0)
          });
        }

        state.set('FILES_SELECTED');
      }

      function handleFiles(files) {
        if (state.is('UPLOADING') || state.is('PROCESSING') || state.is('VALIDATING')) {
          QC.notify.warning(result, QC.strings.busy || 'Processing is already in progress. Please wait.');
          return;
        }

        const pdfFiles = Array.from(files).filter(isPdf);

        if (!pdfFiles.length) {
          selectedFiles = [];
          renderFiles();
          state.set('ERROR');
          QC.notify.error(result, QC.strings.pdfOnly || 'Only PDF files are accepted.');
          setTimeout(() => state.reset(), 250);
          return;
        }

        selectedFiles = pdfFiles;
        QC.notify.clear(result);
        renderFiles();
      }

      choose.addEventListener('click', () => {
        if (state.is('UPLOADING') || state.is('PROCESSING') || state.is('VALIDATING')) {
          QC.notify.warning(result, QC.strings.busy || 'Processing is already in progress. Please wait.');
          return;
        }
        input.click();
      });

      input.addEventListener('change', e => {
        handleFiles(e.target.files);
      });

      dropzone.addEventListener('dragover', e => {
        e.preventDefault();
        if (!state.is('UPLOADING') && !state.is('PROCESSING') && !state.is('VALIDATING')) {
          dropzone.classList.add('qc512-dragover');
        }
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('qc512-dragover');
      });

      dropzone.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.classList.remove('qc512-dragover');
        handleFiles(e.dataTransfer.files);
      });

      root.querySelectorAll('.qc512-action').forEach(button => {
        button.addEventListener('click', function() {
          if (state.is('UPLOADING') || state.is('PROCESSING') || state.is('VALIDATING')) {
            QC.notify.warning(result, QC.strings.busy || 'Processing is already in progress. Please wait.');
            return;
          }

          const action = button.dataset.action;
          const tool = QC.getTool(action);

          if (!tool) {
            state.set('ERROR');
            QC.notify.error(result, 'Unknown tool.');
            setTimeout(() => state.reset(), 250);
            return;
          }

          currentAction = action;
          currentTool = tool;
          updateInputForTool(input, currentTool);

          root.querySelectorAll('.qc512-action').forEach(btn => btn.classList.remove('qc512-primary'));
          button.classList.add('qc512-primary');

          if (splitOptions) {
            if (action === 'split') splitOptions.classList.add('qc512-visible');
            else splitOptions.classList.remove('qc512-visible');
          }

          processTool(tool);
        });
      });

      async function processTool(tool) {
        if (state.is('UPLOADING') || state.is('PROCESSING') || state.is('VALIDATING')) {
          QC.notify.warning(result, QC.strings.busy || 'Processing is already in progress. Please wait.');
          return;
        }

        state.set('VALIDATING');
        const validationError = validateForTool(tool, selectedFiles);

        if (validationError) {
          state.set('ERROR');
          QC.notify.error(result, validationError);
          setTimeout(() => {
            if (selectedFiles.length) state.set('FILES_SELECTED');
            else state.reset();
          }, 250);
          return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));

        if (tool.id === 'split' && splitPages && splitPages.value.trim()) {
          formData.append('split_pages', splitPages.value.trim());
        }

        if (emailInput && emailInput.value.trim()) {
          formData.append('email', emailInput.value.trim());
        }

        if (QC.events && QC.eventNames) {
          QC.events.emit(QC.eventNames.PROCESS_STARTED, { tool: tool.id });
        }

        state.set('UPLOADING');
        QC.notify.processing(result, QC.strings.processing || 'Processing...');

        try {
          const response = await QC.api.call(tool, formData);
          state.set('PROCESSING');

          const contentType = response.headers.get('content-type') || '';
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          let fallback = 'quiconvert_' + tool.id + '.pdf';
          if (contentType.indexOf('zip') !== -1) fallback = 'quiconvert_' + tool.id + '.zip';

          const filename = QC.getFilenameFromHeaders(response, fallback);

          if (QC.events && QC.eventNames) {
            QC.events.emit(QC.eventNames.DOWNLOAD_READY, { tool: tool.id });
            QC.events.emit(QC.eventNames.PROCESS_COMPLETED, { tool: tool.id });
          }

          state.set('READY');
          QC.ui.showDownload(result, url, filename, QC.strings.download || 'Download file');

          const downloadLink = result.querySelector('.qc512-download');
          if (downloadLink) {
            downloadLink.addEventListener('click', () => {
              if (QC.events && QC.eventNames) {
                QC.events.emit(QC.eventNames.DOWNLOAD_STARTED, { tool: tool.id });
              }
              state.set('DOWNLOADING');
              setTimeout(() => {
                if (QC.events && QC.eventNames) {
                  QC.events.emit(QC.eventNames.DOWNLOAD_COMPLETED, { tool: tool.id });
                }
                state.set('FINISHED');
                setTimeout(() => state.reset(), 300);
              }, 200);
            });
          }
        } catch (error) {
          console.error(error);
          if (QC.events && QC.eventNames) {
            QC.events.emit(QC.eventNames.PROCESS_FAILED, { tool: tool.id, message: error.message });
          }
          state.set('ERROR');
          QC.notify.error(result, error.message || QC.strings.genericError || 'An error occurred while processing your file.');
          setTimeout(() => {
            if (selectedFiles.length) state.set('FILES_SELECTED');
            else state.reset();
          }, 250);
        }
      }
    });
  });
})(window.QuiConvert512);
