window.QuiConvert512 = window.QuiConvert512 || {};

(function(QC) {
  const config = window.QuiConvert512Config || {};

  QC.config = config;
  QC.tools = config.tools || {};
  QC.strings = config.strings || {};
  QC.maxUploadMb = config.maxUploadMb || 5;
  QC.maxUploadBytes = QC.maxUploadMb * 1024 * 1024;
  QC.developerMode = !!config.developerMode;
  QC.pluginVersion = config.pluginVersion || '5.1.3';
  QC.runtimeVersion = config.runtimeVersion || '0.8.0';

  QC.getTool = function(action) {
    return QC.tools[action] || null;
  };

  QC.getSessionId = function() {
    let sessionId = localStorage.getItem('qcSessionId');

    if (!sessionId) {
      if (window.crypto && crypto.randomUUID) {
        sessionId = crypto.randomUUID();
      } else {
        sessionId = 'qc-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      }
      localStorage.setItem('qcSessionId', sessionId);
    }

    return sessionId;
  };

  QC.getFilenameFromHeaders = function(response, fallback) {
    const cd = response.headers.get('content-disposition') || '';
    const match = cd.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i);

    if (match && match[1]) {
      try {
        return decodeURIComponent(match[1].replace(/\"/g, '').trim());
      } catch (e) {
        return match[1].replace(/\"/g, '').trim();
      }
    }

    return fallback;
  };
})(window.QuiConvert512);
