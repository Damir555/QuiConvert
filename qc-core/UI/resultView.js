export function showStatus(container, message) {
    if (!container) return;
    container.innerHTML = `<p>${message}</p>`;
}

export function showDownload(container, blob, filename = 'quiconvert-result.pdf') {
    if (!container) return;

    const url = URL.createObjectURL(blob);

    container.innerHTML = '';

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.textContent = 'Download file';

    container.appendChild(link);
}