export function bindProcessButton(root, onProcess) {
    const button = root.querySelector('.qc-process-button');

    if (!button) {
        console.error('[QuiConvert Core] Process button not found');
        return null;
    }

    button.addEventListener('click', async () => {
        await onProcess();
    });

    return button;
}