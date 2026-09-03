export class DocumentSession {

    constructor(workspaceDocument, options = {}) {

        if (
            !workspaceDocument ||
            typeof workspaceDocument !== "object"
        ) {
            throw new TypeError(
                "DocumentSession requires a valid WorkspaceDocument."
            );
        }

        if (
            typeof workspaceDocument.id !== "string" ||
            workspaceDocument.id.trim() === ""
        ) {
            throw new TypeError(
                "WorkspaceDocument must have a valid id."
            );
        }

        if (
            options === null ||
            typeof options !== "object" ||
            Array.isArray(options)
        ) {
            throw new TypeError(
                "DocumentSession options must be an object."
            );
        }

        if (
            options.onChange !== undefined &&
            typeof options.onChange !== "function"
        ) {
            throw new TypeError(
                "DocumentSession onChange must be a function."
            );
        }

        this.document = workspaceDocument;

        this.status = "idle";
        this.error = null;

        this.pageCount = 0;
        this.activePage = null;
        this.pageOrder = [];
        this.selectedPages = new Set();

        this.dirty = false;
        this.revision = 0;

        this.destroyed = false;

        this.onChange =
            options.onChange || null;

    }

    getDocument() {

        return this.document;

    }

    getDocumentId() {

        return this.document.id;

    }

    getStatus() {

        return this.status;

    }

    getError() {

        return this.error;

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
            Array.from(this.selectedPages)
                .sort((firstPage, secondPage) =>
                    firstPage - secondPage
                )
        );

    }

    getSelectionCount() {

        return this.selectedPages.size;

    }

    isPageSelected(pageNumber) {

        this.assertActive();
        this.assertPagesInitialized();
        this.assertPageNumber(pageNumber);

        return this.selectedPages.has(
            pageNumber
        );

    }

    isDirty() {

        return this.dirty;

    }

    getRevision() {

        return this.revision;

    }

    isDestroyed() {

        return this.destroyed;

    }

    getStateSnapshot() {

        return Object.freeze({

            documentId:
                this.getDocumentId(),

            revision:
                this.revision,

            status:
                this.status,

            pageCount:
                this.pageCount,

            activePage:
                this.activePage,

            pageOrder:
                this.getPageOrder(),

            selectedPages:
                this.getSelectedPages(),

            dirty:
                this.dirty,

            destroyed:
                this.destroyed,

            error:
                this.serializeError(
                    this.error
                )

        });

    }

    initializePages(pageCount) {

        this.assertActive();

        if (
            !Number.isInteger(pageCount) ||
            pageCount < 1
        ) {
            throw new RangeError(
                "DocumentSession page count must be a positive integer."
            );
        }

        this.pageCount =
            pageCount;

        this.activePage =
            1;

        this.pageOrder =
            Array.from(
                { length: pageCount },
                (_, index) => index + 1
            );

        this.selectedPages.clear();

        this.status =
            "ready";

        this.error =
            null;

        this.dirty =
            false;

        this.commitChange({

            type:
                "initialized",

            pageCount:
                this.pageCount,

            activePage:
                this.activePage,

            pageOrder:
                this.getPageOrder(),

            selectedPages:
                this.getSelectedPages()

        });

        return this;

    }

    setActivePage(pageId) {

        this.assertActive();
        this.assertPagesInitialized();

        if (!Number.isInteger(pageId)) {
            throw new TypeError(
                "Active page must be an integer."
            );
        }

        if (
            pageId < 1 ||
            pageId > this.pageCount
        ) {
            throw new RangeError(
                `Active page must be between 1 and ${this.pageCount}.`
            );
        }

        if (
            pageId === this.activePage
        ) {
            return this;
        }

        const previousPage =
            this.activePage;

        this.activePage =
            pageId;

        this.commitChange({

            type:
                "active-page",

            previousPage,

            activePage:
                this.activePage

        });

        return this;

    }

    selectPage(pageNumber) {

        this.assertActive();
        this.assertPagesInitialized();
        this.assertPageNumber(pageNumber);

        if (
            this.selectedPages.has(
                pageNumber
            )
        ) {
            return this;
        }

        this.selectedPages.add(
            pageNumber
        );

        this.commitPageSelectionChange(
            "select",
            pageNumber
        );

        return this;

    }

    deselectPage(pageNumber) {

        this.assertActive();
        this.assertPagesInitialized();
        this.assertPageNumber(pageNumber);

        if (
            !this.selectedPages.has(
                pageNumber
            )
        ) {
            return this;
        }

        this.selectedPages.delete(
            pageNumber
        );

        this.commitPageSelectionChange(
            "deselect",
            pageNumber
        );

        return this;

    }

    togglePageSelection(pageNumber) {

        this.assertActive();
        this.assertPagesInitialized();
        this.assertPageNumber(pageNumber);

        if (
            this.selectedPages.has(
                pageNumber
            )
        ) {
            this.selectedPages.delete(
                pageNumber
            );

            this.commitPageSelectionChange(
                "deselect",
                pageNumber
            );

            return this;
        }

        this.selectedPages.add(
            pageNumber
        );

        this.commitPageSelectionChange(
            "select",
            pageNumber
        );

        return this;

    }

    clearPageSelection() {

        this.assertActive();
        this.assertPagesInitialized();

        if (
            this.selectedPages.size === 0
        ) {
            return this;
        }

        const previousSelectedPages =
            this.getSelectedPages();

        this.selectedPages.clear();

        this.commitChange({

            type:
                "page-selection",

            operation:
                "clear",

            previousSelectedPages,

            selectedPages:
                this.getSelectedPages(),

            selectionCount:
                this.getSelectionCount()

        });

        return this;

    }

    selectAllPages() {

        this.assertActive();
        this.assertPagesInitialized();

        if (
            this.selectedPages.size ===
                this.pageCount
        ) {
            return this;
        }

        const previousSelectedPages =
            this.getSelectedPages();

        this.selectedPages =
            new Set(
                Array.from(
                    {
                        length:
                            this.pageCount
                    },
                    (_, index) =>
                        index + 1
                )
            );

        this.commitChange({

            type:
                "page-selection",

            operation:
                "select-all",

            previousSelectedPages,

            selectedPages:
                this.getSelectedPages(),

            selectionCount:
                this.getSelectionCount()

        });

        return this;

    }

    movePage(fromIndex, toIndex) {

        this.assertActive();
        this.assertPagesInitialized();

        this.assertPageIndex(
            fromIndex
        );

        this.assertPageIndex(
            toIndex
        );

        if (
            fromIndex === toIndex
        ) {
            return this;
        }

        const previousPageOrder =
            this.getPageOrder();

        const [movedPage] =
            this.pageOrder.splice(
                fromIndex,
                1
            );

        this.pageOrder.splice(
            toIndex,
            0,
            movedPage
        );

        this.dirty =
            true;

        this.commitChange({

            type:
                "page-order",

            operation:
                "move",

            movedPage,

            fromIndex,

            toIndex,

            previousPageOrder,

            pageOrder:
                this.getPageOrder(),

            dirty:
                this.dirty

        });

        return this;

    }

    swapPages(firstIndex, secondIndex) {

        this.assertActive();
        this.assertPagesInitialized();

        this.assertPageIndex(
            firstIndex
        );

        this.assertPageIndex(
            secondIndex
        );

        if (
            firstIndex === secondIndex
        ) {
            return this;
        }

        const previousPageOrder =
            this.getPageOrder();

        const firstPage =
            this.pageOrder[firstIndex];

        const secondPage =
            this.pageOrder[secondIndex];

        [
            this.pageOrder[firstIndex],
            this.pageOrder[secondIndex]
        ] = [
            secondPage,
            firstPage
        ];

        this.dirty =
            true;

        this.commitChange({

            type:
                "page-order",

            operation:
                "swap",

            firstIndex,

            secondIndex,

            firstPage,

            secondPage,

            previousPageOrder,

            pageOrder:
                this.getPageOrder(),

            dirty:
                this.dirty

        });

        return this;

    }

    resetPageOrder() {

        this.assertActive();
        this.assertPagesInitialized();

        const defaultPageOrder =
            Array.from(
                { length: this.pageCount },
                (_, index) => index + 1
            );

        const unchanged =
            this.pageOrder.every(
                (pageId, index) =>
                    pageId ===
                    defaultPageOrder[index]
            );

        if (unchanged) {
            return this;
        }

        const previousPageOrder =
            this.getPageOrder();

        this.pageOrder =
            defaultPageOrder;

        this.dirty =
            false;

        this.commitChange({

            type:
                "page-order",

            operation:
                "reset",

            previousPageOrder,

            pageOrder:
                this.getPageOrder(),

            dirty:
                this.dirty

        });

        return this;

    }

    setLoading() {

        this.assertActive();

        if (
            this.status === "loading" &&
            this.error === null
        ) {
            return this;
        }

        const previousStatus =
            this.status;

        this.status =
            "loading";

        this.error =
            null;

        this.commitChange({

            type:
                "status",

            previousStatus,

            status:
                this.status

        });

        return this;

    }

    setError(error) {

        this.assertActive();

        const normalizedError =
            this.normalizeError(error);

        const previousStatus =
            this.status;

        this.status =
            "error";

        this.error =
            normalizedError;

        this.commitChange({

            type:
                "error",

            previousStatus,

            status:
                this.status,

            error:
                this.serializeError(
                    this.error
                )

        });

        return this;

    }

    markClean() {

        this.assertActive();

        if (
            this.dirty === false
        ) {
            return this;
        }

        this.dirty =
            false;

        this.commitChange({

            type:
                "clean",

            dirty:
                this.dirty

        });

        return this;

    }

    destroy() {

        if (this.destroyed) {
            return this;
        }

        this.status =
            "destroyed";

        this.error =
            null;

        this.pageCount =
            0;

        this.activePage =
            null;

        this.pageOrder =
            [];

        this.selectedPages.clear();

        this.dirty =
            false;

        this.destroyed =
            true;

        this.commitChange({
            type: "destroyed"
        });

        this.onChange =
            null;

        return this;

    }

    assertActive() {

        if (this.destroyed) {
            throw new Error(
                "DocumentSession has been destroyed."
            );
        }

    }

    assertPagesInitialized() {

        if (
            this.pageCount < 1 ||
            this.activePage === null ||
            this.pageOrder.length !==
                this.pageCount
        ) {
            throw new Error(
                "DocumentSession pages have not been initialized."
            );
        }

    }

    assertPageIndex(index) {

        if (!Number.isInteger(index)) {
            throw new TypeError(
                "Page index must be an integer."
            );
        }

        if (
            index < 0 ||
            index >= this.pageCount
        ) {
            throw new RangeError(
                `Page index must be between 0 and ${this.pageCount - 1}.`
            );
        }

    }

    assertPageNumber(pageNumber) {

        if (!Number.isInteger(pageNumber)) {
            throw new TypeError(
                "Page number must be an integer."
            );
        }

        if (
            pageNumber < 1 ||
            pageNumber > this.pageCount
        ) {
            throw new RangeError(
                `Page number must be between 1 and ${this.pageCount}.`
            );
        }

    }

    commitPageSelectionChange(
        operation,
        pageNumber
    ) {

        this.commitChange({

            type:
                "page-selection",

            operation,

            pageNumber,

            selectedPages:
                this.getSelectedPages(),

            selectionCount:
                this.getSelectionCount()

        });

    }

    normalizeError(error) {

        if (
            error instanceof Error
        ) {
            return error;
        }

        if (
            typeof error === "string" &&
            error.trim() !== ""
        ) {
            return new Error(
                error.trim()
            );
        }

        return new Error(
            "Unknown document session error."
        );

    }

    serializeError(error) {

        if (!error) {
            return null;
        }

        return Object.freeze({

            name:
                error.name || "Error",

            message:
                error.message ||
                "Unknown document session error."

        });

    }

    commitChange(change) {

        this.revision += 1;

        if (!this.onChange) {
            return;
        }

        const event =
            Object.freeze({

                documentId:
                    this.getDocumentId(),

                revision:
                    this.revision,

                status:
                    this.status,

                sessionState:
                    this.getStateSnapshot(),

                change:
                    Object.freeze({
                        ...change
                    })

            });

        this.onChange(event);

    }

}