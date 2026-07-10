export function showError(container, message) {
    if (!container) return;

    container.innerHTML = '';

    const error = document.createElement('p');
    error.className = 'qc-error-message';
    error.textContent = message;

    container.appendChild(error);
}