let selectedFiles = [];

export function setFiles(files) {
    selectedFiles = Array.from(files);
}

export function addFiles(files) {
    selectedFiles = [
        ...selectedFiles,
        ...Array.from(files)
    ];
}

export function removeFile(index) {
    selectedFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
}

export function clearFiles() {
    selectedFiles = [];
}

export function getFiles() {
    return selectedFiles;
}

export function hasFiles() {
    return selectedFiles.length > 0;
}

export function getFileCount() {
    return selectedFiles.length;
}