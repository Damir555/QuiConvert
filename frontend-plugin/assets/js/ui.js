window.QuiConvert512 = window.QuiConvert512 || {};

(function(QC) {
  QC.ui = {
    lock(root) {
      root.classList.add('qc512-locked');
      root.querySelectorAll('button, input').forEach(el => {
        if (!el.classList.contains('qc512-file-input')) {
          el.disabled = true;
        }
      });
    },

    unlock(root) {
      root.classList.remove('qc512-locked');
      root.querySelectorAll('button, input').forEach(el => {
        el.disabled = false;
      });
    },

    applyState(root, state) {
      if (state === QC.states.UPLOADING || state === QC.states.PROCESSING || state === QC.states.VALIDATING) {
        this.lock(root);
      } else {
        this.unlock(root);
      }
    },

    formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    },

    showError(container, message) {
      QC.notify.error(container, message);
    },

    showLoading(container, message) {
      QC.notify.processing(container, message);
    },

    showInfo(container, message) {
      QC.notify.info(container, message);
    },

    showSuccess(container, message) {
      QC.notify.success(container, message);
    },

    showDownload(container, url, filename, label) {
      container.innerHTML = '<div class="qc512-download-wrap">' +
        '<div class="qc512-message qc512-message-success"><span class="qc512-message-icon">✓</span><span>' + (QC.strings.completed || 'Processing completed.') + '</span></div>' +
        '<a class="qc512-download" href="' + url + '" download="' + filename + '">' + label + '</a>' +
        '</div>';
    },

    clear(container) {
      QC.notify.clear(container);
    }
  };
})(window.QuiConvert512);
