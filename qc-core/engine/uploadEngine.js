import {
    addFiles,
    removeFile,
    getFiles
} from './fileState.js';

import { renderFileList } from '../ui/fileListView.js';

export function createUploadEngine(options) {
    console.log('[QuiConvert Core] Upload engine initialized');

    const {
        root,
        fileInputSelector = '.qc-file-input',
        dropZoneSelector = '.qc-upload-card',
        fileListSelector = '.qc-file-list-container'
    } = options;

    const fileInput = root.querySelector(fileInputSelector);
    const dropZone = root.querySelector(dropZoneSelector);
    const fileListContainer = root.querySelector(fileListSelector);

    if (!fileInput || !dropZone || !fileListContainer) {
        console.error('[QuiConvert Core] Upload elements missing', {
            fileInput,
            dropZone,
            fileListContainer
        });

        return null;
    }

    function refreshFileList() {
        renderFileList(
            fileListContainer,
            getFiles(),
            (index) => {
                removeFile(index);
                refreshFileList();
            }
        );
    }

    function handleFiles(files) {
        if (!files || files.length === 0) {
            return;
        }

        addFiles(files);
        refreshFileList();

        console.log('[QuiConvert Core] Files added:', getFiles());
    }

    function preventBrowserFileOpen(event) {
        event.preventDefault();
    }

    /*
     * Sprječava browser da otvori PDF kada se datoteka
     * ispusti izvan aktivne drop zone.
     *
     * Ne koristimo stopPropagation(), jer događaj mora
     * moći doći do dropZone listenera.
     */
    window.addEventListener('dragover', preventBrowserFileOpen);
    window.addEventListener('drop', preventBrowserFileOpen);

    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
        fileInput.value = '';
    });

    dropZone.addEventListener('dragenter', (event) => {
        event.preventDefault();
        dropZone.classList.add('qc-drag-over');
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('qc-drag-over');
    });

    dropZone.addEventListener('dragleave', (event) => {
        event.preventDefault();

        if (!dropZone.contains(event.relatedTarget)) {
            dropZone.classList.remove('qc-drag-over');
        }
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();

        dropZone.classList.remove('qc-drag-over');

        const droppedFiles = event.dataTransfer?.files;

        console.log('[QuiConvert Core] Drop received:', droppedFiles);

        handleFiles(droppedFiles);
    });

    refreshFileList();

    return {
        getFiles,
        refreshFileList
    };
}