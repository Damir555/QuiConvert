export function renderFileList(container, files, onRemove) {
    if (!container) return;

    container.innerHTML = '';

    if (!files.length) {
        container.innerHTML = '<p>No files selected.</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'qc-file-list';

    files.forEach((file, index) => {
        const item = document.createElement('li');
        item.className = 'qc-file-item';

        const name = document.createElement('span');
        name.className = 'qc-file-name';
        name.textContent = file.name;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'qc-file-remove';
        removeButton.textContent = 'Remove';

        removeButton.addEventListener('click', () => {
            onRemove(index);
        });

        item.appendChild(name);
        item.appendChild(removeButton);
        list.appendChild(item);
    });

    container.appendChild(list);
}