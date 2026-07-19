export class EventBus {

    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event).push(callback);

        return this;
    }

    off(event, callback) {

        const list = this.listeners.get(event);

        if (!list) {
            return this;
        }

        this.listeners.set(
            event,
            list.filter(fn => fn !== callback)
        );

        return this;
    }

    emit(event, payload = null) {

        const list = this.listeners.get(event);

        if (!list) {
            return;
        }

        for (const callback of list) {
            callback(payload);
        }
    }

}