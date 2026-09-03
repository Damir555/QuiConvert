import {
    WorkspaceEvents
} from "./workspaceEvents.js";

export class SelectionManager {

    constructor(eventBus) {

        if (!eventBus) {
            throw new TypeError(
                "SelectionManager requires an EventBus."
            );
        }

        this.eventBus = eventBus;

        this.selection = null;
    }

    select(selection) {

        this.validateSelection(selection);

        this.selection = {
            type: selection.type,
            id: selection.id
        };

        this.notifyChange();

        return this;
    }

    deselect() {

        return this.clear();
    }

    clear() {

        this.selection = null;

        this.notifyChange();

        return this;
    }

    getSelection() {

        if (!this.selection) {
            return null;
        }

        return {
            ...this.selection
        };
    }

    hasSelection() {

        return this.selection !== null;
    }

    isSelected(selection) {

        if (
            !this.selection ||
            !selection
        ) {
            return false;
        }

        return (

            this.selection.type === selection.type &&

            this.selection.id === selection.id

        );
    }

    validateSelection(selection) {

        if (
            !selection ||
            typeof selection !== "object"
        ) {

            throw new TypeError(
                "Selection must be an object."
            );

        }

        if (
            !("type" in selection)
        ) {

            throw new Error(
                'Selection must contain "type".'
            );

        }

        if (
            !("id" in selection)
        ) {

            throw new Error(
                'Selection must contain "id".'
            );

        }

    }

    notifyChange() {

        this.eventBus.emit(

            WorkspaceEvents.SELECTION_CHANGED,

            this.getSelection()

        );

    }

}