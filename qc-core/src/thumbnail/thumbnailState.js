export class ThumbnailState {

    constructor() {

        this.reset();

    }

    reset() {

        this.pageCount = 0;
        this.activePage = null;
        this.pageOrder = [];
        this.selectedPages = new Set();

        return this;

    }

    initialize(
        pageCount,
        options = {}
    ) {

        this.pageCount =
            Number.isInteger(pageCount) &&
            pageCount > 0
                ? pageCount
                : 0;

        this.pageOrder =
            this.resolveInitialPageOrder(
                options.pageOrder
            );

        this.activePage =
            this.resolveInitialPage(
                options.activePage
            );

        this.selectedPages =
            this.resolveInitialSelectedPages(
                options.selectedPages
            );

        return this;

    }

    resolveInitialPage(pageNumber) {

        if (
            Number.isInteger(pageNumber) &&
            this.isValidPageNumber(
                pageNumber
            )
        ) {
            return pageNumber;
        }

        return this.pageCount > 0
            ? 1
            : null;

    }

    resolveInitialPageOrder(
        pageOrder
    ) {

        if (
            Array.isArray(pageOrder) &&
            this.isValidPageOrder(
                pageOrder
            )
        ) {

            return [
                ...pageOrder
            ];

        }

        return Array.from(
            {
                length:
                    this.pageCount
            },
            (_, index) =>
                index + 1
        );

    }

    resolveInitialSelectedPages(
        selectedPages
    ) {

        if (!Array.isArray(selectedPages)) {
            return new Set();
        }

        return new Set(
            selectedPages
                .map(
                    pageNumber =>
                        Number(
                            pageNumber
                        )
                )
                .filter(
                    pageNumber =>
                        this.isValidPageNumber(
                            pageNumber
                        )
                )
        );

    }

    isValidPageNumber(
        pageNumber
    ) {

        return (
            Number.isInteger(
                pageNumber
            ) &&
            pageNumber >= 1 &&
            pageNumber <=
                this.pageCount
        );

    }

    isValidPageOrder(
        pageOrder
    ) {

        if (
            !Array.isArray(pageOrder) ||
            pageOrder.length !==
                this.pageCount
        ) {
            return false;
        }

        const normalizedOrder =
            pageOrder.map(
                pageNumber =>
                    Number(
                        pageNumber
                    )
            );

        const uniquePages =
            new Set(
                normalizedOrder
            );

        if (
            uniquePages.size !==
            this.pageCount
        ) {
            return false;
        }

        return normalizedOrder.every(
            pageNumber =>
                this.isValidPageNumber(
                    pageNumber
                )
        );

    }

    setActivePage(pageNumber) {

        if (
            !this.isValidPageNumber(
                pageNumber
            )
        ) {
            return false;
        }

        this.activePage =
            pageNumber;

        return true;

    }

    setSelectedPages(selectedPages) {

        if (!Array.isArray(selectedPages)) {
            return false;
        }

        const normalizedPages =
            selectedPages.map(
                pageNumber =>
                    Number(
                        pageNumber
                    )
            );

        if (
            !normalizedPages.every(
                pageNumber =>
                    this.isValidPageNumber(
                        pageNumber
                    )
            )
        ) {
            return false;
        }

        this.selectedPages =
            new Set(
                normalizedPages
            );

        return true;

    }

    setPageOrder(pageOrder) {

        if (
            !this.isValidPageOrder(
                pageOrder
            )
        ) {
            return false;
        }

        this.pageOrder =
            pageOrder.map(
                pageNumber =>
                    Number(
                        pageNumber
                    )
            );

        return true;

    }

    movePage(
        fromIndex,
        toIndex
    ) {

        if (
            !Number.isInteger(fromIndex) ||
            !Number.isInteger(toIndex) ||
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= this.pageOrder.length ||
            toIndex >= this.pageOrder.length
        ) {
            return null;
        }

        const previousPageOrder =
            this.getPageOrder();

        const movedPage =
            this.pageOrder.splice(
                fromIndex,
                1
            )[0];

        this.pageOrder.splice(
            toIndex,
            0,
            movedPage
        );

        return {
            movedPage,
            fromIndex,
            toIndex,
            previousPageOrder,
            pageOrder:
                this.getPageOrder()
        };

    }

    isPageSelected(pageNumber) {

        return this.selectedPages.has(
            pageNumber
        );

    }

    getPageCount() {

        return this.pageCount;

    }

    getActivePage() {

        return this.activePage;

    }

    getPageOrder() {

        return Object.freeze([
            ...this.pageOrder
        ]);

    }

    getSelectedPages() {

        return Object.freeze(
            Array.from(
                this.selectedPages
            ).sort(
                (firstPage, secondPage) =>
                    firstPage - secondPage
            )
        );

    }

}
