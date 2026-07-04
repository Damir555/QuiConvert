window.QuiConvert512 = window.QuiConvert512 || {};

(function(QC) {
  const STATES = {
    IDLE: 'IDLE',
    FILES_SELECTED: 'FILES_SELECTED',
    VALIDATING: 'VALIDATING',
    UPLOADING: 'UPLOADING',
    PROCESSING: 'PROCESSING',
    READY: 'READY',
    DOWNLOADING: 'DOWNLOADING',
    FINISHED: 'FINISHED',
    ERROR: 'ERROR'
  };

  const allowedTransitions = {
    IDLE: ['FILES_SELECTED', 'VALIDATING', 'ERROR'],
    FILES_SELECTED: ['VALIDATING', 'IDLE', 'ERROR'],
    VALIDATING: ['UPLOADING', 'ERROR', 'IDLE'],
    UPLOADING: ['PROCESSING', 'ERROR'],
    PROCESSING: ['READY', 'ERROR'],
    READY: ['DOWNLOADING', 'FILES_SELECTED', 'IDLE', 'ERROR'],
    DOWNLOADING: ['FINISHED', 'ERROR'],
    FINISHED: ['IDLE'],
    ERROR: ['IDLE', 'FILES_SELECTED']
  };

  QC.states = STATES;

  QC.createStateEngine = function(root) {
    let current = STATES.IDLE;
    const subscribers = [];

    function emit(previous, next) {
      root.dataset.state = next.toLowerCase().replace(/_/g, '-');
      if (QC.events && QC.eventNames) {
        QC.events.emit(QC.eventNames.STATE_CHANGED, { previous, current: next });
      }

      subscribers.forEach(callback => {
        try {
          callback({ previous, current: next, root });
        } catch (e) {
          console.warn('[QC State] subscriber failed', e);
        }
      });
    }

    return {
      get() {
        return current;
      },

      set(next) {
        if (!STATES[next]) {
          console.warn('[QC State] Unknown state:', next);
          return false;
        }

        if (current === next) return true;

        const allowed = allowedTransitions[current] || [];

        if (!allowed.includes(next)) {
          console.warn('[QC State] Illegal transition:', current, '→', next);
          return false;
        }

        const previous = current;
        current = next;
        emit(previous, next);
        return true;
      },

      is(state) {
        return current === state;
      },

      subscribe(callback) {
        if (typeof callback === 'function') {
          subscribers.push(callback);
        }
      },

      unsubscribe(callback) {
        const index = subscribers.indexOf(callback);
        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      },

      reset() {
        if (current === STATES.IDLE) {
          emit(current, STATES.IDLE);
          return true;
        }

        if ((allowedTransitions[current] || []).includes(STATES.IDLE)) {
          return this.set(STATES.IDLE);
        }

        const previous = current;
        current = STATES.IDLE;
        emit(previous, STATES.IDLE);
        return true;
      }
    };
  };
})(window.QuiConvert512);
