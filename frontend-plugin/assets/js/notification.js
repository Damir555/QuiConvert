window.QuiConvert512 = window.QuiConvert512 || {};

(function(QC) {
  QC.notify = {
    timers: new WeakMap(),

    show(container, options) {
      if (!container) return;

      const type = options.type || 'info';
      const message = options.message || '';
      const autoHide = options.autoHide || false;
      const duration = options.duration || 3000;

      const previousTimer = this.timers.get(container);
      if (previousTimer) {
        clearTimeout(previousTimer);
        this.timers.delete(container);
      }

      container.innerHTML = '<div class="qc512-message qc512-message-' + type + '">' +
        this.icon(type) +
        '<span>' + message + '</span>' +
        '</div>';

      if (autoHide) {
        const timer = setTimeout(() => {
          container.innerHTML = '';
          this.timers.delete(container);
        }, duration);

        this.timers.set(container, timer);
      }
    },

    icon(type) {
      if (type === 'success') return '<span class="qc512-message-icon">✓</span>';
      if (type === 'error') return '<span class="qc512-message-icon">✕</span>';
      if (type === 'warning') return '<span class="qc512-message-icon">⚠</span>';
      if (type === 'processing') return '<span class="qc512-spinner"></span>';
      return '<span class="qc512-message-icon">ℹ</span>';
    },

    success(container, message) {
      this.show(container, { type: 'success', message, autoHide: true, duration: 3000 });
    },

    error(container, message) {
      this.show(container, { type: 'error', message, autoHide: false });
    },

    warning(container, message) {
      this.show(container, { type: 'warning', message, autoHide: true, duration: 5000 });
    },

    info(container, message) {
      this.show(container, { type: 'info', message, autoHide: true, duration: 3000 });
    },

    processing(container, message) {
      this.show(container, { type: 'processing', message, autoHide: false });
    },

    clear(container) {
      if (!container) return;
      const previousTimer = this.timers.get(container);
      if (previousTimer) {
        clearTimeout(previousTimer);
        this.timers.delete(container);
      }
      container.innerHTML = '';
    }
  };
})(window.QuiConvert512);
