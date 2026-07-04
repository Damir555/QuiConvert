window.QuiConvert512 = window.QuiConvert512 || {};

(function(QC) {
  const listeners = {};

  QC.eventNames = {
    SESSION_STARTED: 'SESSION_STARTED',
    FILES_SELECTED: 'FILES_SELECTED',
    STATE_CHANGED: 'STATE_CHANGED',
    API_REQUEST_STARTED: 'API_REQUEST_STARTED',
    API_REQUEST_SUCCESS: 'API_REQUEST_SUCCESS',
    API_REQUEST_FAILED: 'API_REQUEST_FAILED',
    PROCESS_STARTED: 'PROCESS_STARTED',
    PROCESS_COMPLETED: 'PROCESS_COMPLETED',
    PROCESS_FAILED: 'PROCESS_FAILED',
    DOWNLOAD_READY: 'DOWNLOAD_READY',
    DOWNLOAD_STARTED: 'DOWNLOAD_STARTED',
    DOWNLOAD_COMPLETED: 'DOWNLOAD_COMPLETED'
  };

  QC.events = {
    on(eventName, callback) {
      if (!eventName || typeof callback !== 'function') return;
      if (!listeners[eventName]) listeners[eventName] = [];
      listeners[eventName].push(callback);
    },

    off(eventName, callback) {
      if (!listeners[eventName]) return;
      listeners[eventName] = listeners[eventName].filter(fn => fn !== callback);
    },

    emit(eventName, payload = {}) {
      const event = {
        event: eventName,
        timestamp: new Date().toISOString(),
        session: QC.getSessionId ? QC.getSessionId() : null,
        pluginVersion: QC.pluginVersion || null,
        runtimeVersion: QC.runtimeVersion || null,
        data: payload || {}
      };

      if (QC.developerMode && window.console && console.debug) {
        console.debug('[QC Event]', event);
      }

      if (!listeners[eventName]) return event;

      listeners[eventName].forEach(callback => {
        try {
          callback(event);
        } catch (e) {
          console.error('[QC Event listener failed]', e);
        }
      });

      return event;
    }
  };

  QC.events.emit(QC.eventNames.SESSION_STARTED, { source: 'wordpress-plugin' });
})(window.QuiConvert512);
