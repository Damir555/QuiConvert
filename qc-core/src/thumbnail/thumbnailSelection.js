export class ThumbnailSelection {

    constructor(renderer) {

        if (!renderer) {
            throw new TypeError(
                "ThumbnailSelection requires a renderer."
            );
        }

        this.renderer = renderer;

    }

    setSelectedPages(selectedPages) {

        if (
            !this.renderer.state
                .setSelectedPages(
                    selectedPages
                )
        ) {
            return false;
        }

        this.update();

        return true;

    }

    getSelectedPages() {

        return this.renderer.state
            .getSelectedPages();

    }

    update() {

        const {
            state,
            thumbnailElements
        } = this.renderer;

        if (
            !state ||
            !thumbnailElements
        ) {
            return;
        }

        for (
            const [
                pageNumber,
                item
            ] of thumbnailElements
        ) {

            const isSelected =
                state.isPageSelected(
                    pageNumber
                );

            item.classList.toggle(
                "is-selected",
                isSelected
            );

            item.dataset.selected =
                isSelected
                    ? "true"
                    : "false";

            item.setAttribute(
                "aria-pressed",
                isSelected
                    ? "true"
                    : "false"
            );

        }

    }

}
