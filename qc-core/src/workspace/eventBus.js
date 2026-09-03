export class EventBus {

    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {

        if (typeof callback !== "function") {
            throw new TypeError(
                "Event listener must be a function."
            );
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        const list = this.listeners.get(event);

        if (!list.includes(callback)) {
            list.push(callback);
        }

        return this;
    }

    off(event, callback) {

        const list = this.listeners.get(event);

        if (!list) {
            return this;
        }

        const filtered =
            list.filter(fn => fn !== callback);

        if (filtered.length === 0) {
            this.listeners.delete(event);
        } else {
            this.listeners.set(
                event,
                filtered
            );
        }

        return this;
    }

    emit(event, payload = null) {

        const list =
            this.listeners.get(event);

        if (!list || list.length === 0) {
            return this;
        }

        const callbacks = [...list];

        for (const callback of callbacks) {
            callback(payload);
        }

        return this;
    }

    listenerCount(event) {

        const list =
            this.listeners.get(event);

        return list
            ? list.length
            : 0;
    }

    hasListeners(event) {
        return this.listenerCount(event) > 0;
    }

    removeAllListeners(event = null) {

        if (event === null) {
            this.listeners.clear();
            return this;
        }

        this.listeners.delete(event);

        return this;
    }

    destroy() {

        this.listeners.clear();

        return this;
    }

}