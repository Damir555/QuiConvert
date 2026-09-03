document.addEventListener('DOMContentLoaded', function () {
    const card = document.querySelector('.qc-upload-card');
    if (!card) return;

    const input = card.querySelector('.qc-file-input');
    const chooseButton = card.querySelector('.qc-choose-button');
    const processButton = card.querySelector('.qc-process-button');
    const list = card.querySelector('.qc-file-list');
    const status = card.querySelector('.qc-status');
    const dropzone = card.querySelector('.qc-dropzone');

    const tool = card.dataset.tool || 'merge';
    const apiUrl = qcConfig.api[tool];

    let selectedFiles = [];

    if (!input || !chooseButton || !processButton || !list || !status || !dropzone) return;

    const processors = {
        merge: processMerge
    };

    chooseButton.addEventListener('click', function () {
        input.click();
    });

    input.addEventListener('change', function () {
        selectedFiles.push(...Array.from(input.files));
        input.value = '';

        renderFileList();
        updateProcessButton();
    });

    dropzone.addEventListener('dragover', function (event) {
        event.preventDefault();
        dropzone.classList.add('qc-dropzone-active');
    });

    dropzone.addEventListener('dragleave', function () {
        dropzone.classList.remove('qc-dropzone-active');
    });

    dropzone.addEventListener('drop', function (event) {
        event.preventDefault();
        dropzone.classList.remove('qc-dropzone-active');

        const files = Array.from(event.dataTransfer.files).filter(function (file) {
            return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        });

        if (!files.length) {
            showStatus('Please drop PDF files only.');
            return;
        }

        selectedFiles.push(...files);

        clearStatus();
        renderFileList();
        updateProcessButton();
    });

    processButton.addEventListener('click', async function () {
        if (!selectedFiles.length) return;

        const processors = {
        merge: processMerge,
        split: processSplit
    };
    });

    async function processMerge() {

        async function processSplit() {
    setProcessing(true);
    showStatus('Uploading and processing...');

    const formData = new FormData();

    formData.append('files', selectedFiles[0]);

    const rangesInput = card.querySelector('.qc-page-ranges-input');
    const splitPages = rangesInput ? rangesInput.value.trim() : '';

    formData.append('split_pages', splitPages);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Backend error: ' + response.status);
        }

        const blob = await response.blob();

        const filename = splitPages
            ? 'extracted-pages.pdf'
            : 'split-pages.zip';

        const label = splitPages
            ? 'Download extracted PDF'
            : 'Download split ZIP';

        showDownload(blob, filename, label);
    } catch (error) {
        showStatus('Error: ' + error.message);
        setProcessing(false);
    }
}

        setProcessing(true);
        showStatus('Uploading and processing...');

        const formData = new FormData();

        selectedFiles.forEach(function (file) {
            formData.append('files', file);
        });

        try {

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Backend error: ' + response.status);
            }

            const blob = await response.blob();
            showDownload(blob, 'merged.pdf', 'Download merged PDF');
        } catch (error) {
            showStatus('Error: ' + error.message);
            setProcessing(false);
        }
    }

    function updateProcessButton() {
        processButton.disabled = selectedFiles.length === 0;
    }

    function renderFileList() {
        list.innerHTML = '';

        if (!selectedFiles.length) {
            return;
        }

        selectedFiles.forEach(function (file, index) {
            const item = document.createElement('div');
            item.className = 'qc-file-item';

            const name = document.createElement('span');
            name.className = 'qc-file-name';
            name.textContent = file.name;

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'qc-file-remove';
            remove.textContent = '×';

            remove.addEventListener('click', function () {
                selectedFiles.splice(index, 1);

                clearStatus();
                renderFileList();
                updateProcessButton();
            });

            item.appendChild(name);
            item.appendChild(remove);
            list.appendChild(item);
        });
    }

    function setProcessing(isProcessing) {
        processButton.disabled = isProcessing;
    }

    function showStatus(message) {
        status.hidden = false;
        status.textContent = message;
    }

    function clearStatus() {
        status.hidden = true;
        status.textContent = '';
        status.innerHTML = '';
    }

    function showDownload(blob, filename, label) {
        const downloadUrl = URL.createObjectURL(blob);

        status.hidden = false;
        status.innerHTML = '';

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.textContent = label;
        link.className = 'qc-download-link';

        status.appendChild(link);
    }
});
