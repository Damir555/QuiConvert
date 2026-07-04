window.QuiConvert512 = window.QuiConvert512 || {};

(function(QC) {
  QC.api = {
    async call(tool, formData) {
      const config = QC.config || {};
      const apiBase = config.apiBase || '';
      const apiKey = config.apiKey || '';
      const startedAt = performance.now();

      if (!apiBase) {
        throw new Error('API base is not configured.');
      }

      if (QC.events && QC.eventNames) {
        QC.events.emit(QC.eventNames.API_REQUEST_STARTED, { tool: tool.id, endpoint: tool.endpoint });
      }

      const response = await fetch(apiBase + '/' + tool.endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'x-session-id': QC.getSessionId()
        },
        body: formData
      });

      if (!response.ok) {
        const raw = await response.text();
        if (QC.events && QC.eventNames) {
          QC.events.emit(QC.eventNames.API_REQUEST_FAILED, {
            tool: tool.id,
            endpoint: tool.endpoint,
            status: response.status,
            durationMs: Math.round(performance.now() - startedAt)
          });
        }
        throw new Error(this.parseError(raw));
      }

      if (QC.events && QC.eventNames) {
        QC.events.emit(QC.eventNames.API_REQUEST_SUCCESS, {
          tool: tool.id,
          endpoint: tool.endpoint,
          status: response.status,
          durationMs: Math.round(performance.now() - startedAt)
        });
      }

      return response;
    },

    parseError(raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.error) return parsed.error;
        if (parsed && parsed.message) return parsed.message;
      } catch (e) {}

      return raw || (QC.strings.genericError || 'An error occurred while processing your file.');
    }
  };
})(window.QuiConvert512);
