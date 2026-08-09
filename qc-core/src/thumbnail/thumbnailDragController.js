import {
    getThumbnailItemFromEvent,
    getThumbnailItems
} from "./thumbnailDom.js";

export class ThumbnailDragController {

    constructor(renderer) {

        if (!renderer) {
            throw new TypeError(
                "ThumbnailDragController requires a renderer."
            );
        }

        this.renderer = renderer;

        this.draggedItem = null;
        this.draggedFromIndex = null;

        this.handleDragStart =
            this.handleDragStart.bind(
                this
            );

        this.handleDragOver =
            this.handleDragOver.bind(
                this
            );

        this.handleDrop =
            this.handleDrop.bind(
                this
            );

        this.handleDragEnd =
            this.handleDragEnd.bind(
                this
            );

    }

    bind() {

        const {
            listElement,
            rearrangeEnabled
        } = this.renderer;

        if (
            !listElement ||
            !rearrangeEnabled
        ) {
            return;
        }

        listElement.addEventListener(
            "dragstart",
            this.handleDragStart
        );

        listElement.addEventListener(
            "dragover",
            this.handleDragOver
        );

        listElement.addEventListener(
            "drop",
            this.handleDrop
        );

        listElement.addEventListener(
            "dragend",
            this.handleDragEnd
        );

    }

    unbind() {

        const { listElement } =
            this.renderer;

        if (!listElement) {
            return;
        }

        listElement.removeEventListener(
            "dragstart",
            this.handleDragStart
        );

        listElement.removeEventListener(
            "dragover",
            this.handleDragOver
        );

        listElement.removeEventListener(
            "drop",
            this.handleDrop
        );

        listElement.removeEventListener(
            "dragend",
            this.handleDragEnd
        );

    }

    handleDragStart(event) {

        const {
            rearrangeEnabled,
            listElement
        } = this.renderer;

        if (
            !rearrangeEnabled ||
            !listElement
        ) {
            return;
        }

        const item =
            getThumbnailItemFromEvent(
                event,
                listElement
            );

        if (!item) {
            return;
        }

        const items =
            getThumbnailItems(
                listElement
            );

        const fromIndex =
            items.indexOf(
                item
            );

        if (fromIndex < 0) {
            return;
        }

        this.draggedItem = item;
        this.draggedFromIndex =
            fromIndex;

        item.classList.add(
            "is-dragging"
        );

        item.dataset.dragging =
            "true";

        if (event.dataTransfer) {

            event.dataTransfer.effectAllowed =
                "move";

            event.dataTransfer.setData(
                "text/plain",
                item.dataset.pageNumber ||
                    ""
            );

        }

    }

    handleDragOver(event) {

        const {
            rearrangeEnabled,
            listElement
        } = this.renderer;

        if (
            !rearrangeEnabled ||
            !listElement ||
            !this.draggedItem
        ) {
            return;
        }

        event.preventDefault();

        if (event.dataTransfer) {

            event.dataTransfer.dropEffect =
                "move";

        }

        const targetItem =
            getThumbnailItemFromEvent(
                event,
                listElement
            );

        if (
            !targetItem ||
            targetItem ===
                this.draggedItem
        ) {
            return;
        }

        const targetRect =
            targetItem.getBoundingClientRect();

        const useVerticalAxis =
            this.shouldUseVerticalAxis(
                targetRect
            );

        const insertAfter =
            useVerticalAxis
                ? event.clientY >
                    targetRect.top +
                    targetRect.height / 2
                : event.clientX >
                    targetRect.left +
                    targetRect.width / 2;

        if (insertAfter) {

            targetItem.after(
                this.draggedItem
            );

        } else {

            targetItem.before(
                this.draggedItem
            );

        }

    }

    handleDrop(event) {

        if (
            !this.renderer.rearrangeEnabled
        ) {
            return;
        }

        event.preventDefault();

        this.completePageMove();

    }

    handleDragEnd() {

        if (
            !this.renderer.rearrangeEnabled
        ) {
            return;
        }

        this.completePageMove();

    }

    completePageMove() {

        const renderer =
            this.renderer;

        if (
            !this.draggedItem ||
            !Number.isInteger(
                this.draggedFromIndex
            )
        ) {
            this.clearDragState();
            return;
        }

        const items =
            getThumbnailItems(
                renderer.listElement
            );

        const toIndex =
            items.indexOf(
                this.draggedItem
            );

        const fromIndex =
            this.draggedFromIndex;

        this.clearDragState();

        if (
            toIndex < 0 ||
            fromIndex === toIndex
        ) {

            renderer.syncDomWithPageOrder();
            return;

        }

        const moveResult =
            renderer.movePage(
                fromIndex,
                toIndex
            );

        if (!moveResult) {

            renderer.syncDomWithPageOrder();
            return;

        }

        if (renderer.onPageMove) {

            renderer.onPageMove(
                moveResult
            );

        }

    }

    clearDragState() {

        if (this.draggedItem) {

            this.draggedItem.classList.remove(
                "is-dragging"
            );

            delete this.draggedItem
                .dataset.dragging;

        }

        this.draggedItem = null;
        this.draggedFromIndex = null;

    }

    shouldUseVerticalAxis(
        targetRect
    ) {

        const { listElement } =
            this.renderer;

        if (!listElement) {
            return false;
        }

        const listRect =
            listElement
                .getBoundingClientRect();

        return (
            listRect.height >
            listRect.width ||
            targetRect.height >
            targetRect.width
        );

    }

}
