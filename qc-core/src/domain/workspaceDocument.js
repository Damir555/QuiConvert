export class WorkspaceDocument {

    constructor(file) {

        if (!(file instanceof File)) {
            throw new TypeError(
                "WorkspaceDocument requires a File instance."
            );
        }

        this.id = crypto.randomUUID();

        this.file = file;

        this.name = file.name;

        this.size = file.size;

        this.type = file.type;

        this.lastModified = file.lastModified;

        this.status = "READY";

        this.metadata = {};

    }

    getExtension() {

        const index = this.name.lastIndexOf(".");

        if (index === -1) {
            return "";
        }

        return this.name
            .substring(index + 1)
            .toLowerCase();

    }

    isPdf() {

        return this.type === "application/pdf";

    }

}