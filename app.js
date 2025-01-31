const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const fileList = document.getElementById("file-list");
const fileTypeFilter = document.getElementById("file-type");
const fileSizeFilter = document.getElementById("file-size");

let files = JSON.parse(localStorage.getItem('files')) || [];

function displayFiles(filesToDisplay) {
    fileList.innerHTML = '';
    filesToDisplay.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        fileItem.innerHTML = `
            <span>Название: ${file.name}</span>
            <span>Тип: ${file.type}</span>
            <span>Размер: ${(file.size / 1024 / 1024).toFixed(2)} MB</span>
        `;
        fileList.appendChild(fileItem);
    });
}

function filterFiles() {
    const fileType = fileTypeFilter.value;
    const fileSize = parseFloat(fileSizeFilter.value) * 1024 * 1024; 

    const filteredFiles = files.filter(file => {
        const isTypeMatch = fileType ? file.type.includes(fileType) : true;
        const isSizeMatch = fileSize ? file.size <= fileSize : true;
        return isTypeMatch && isSizeMatch;
    });

    displayFiles(filteredFiles);
}

function addFilesToStorage(newFiles) {
    files = [...files, ...newFiles];
    localStorage.setItem('files', JSON.stringify(files));
    filterFiles(); 
}

function downloadFile(index) {
    const file = files[index];

    const blob = new Blob([file], { type: file.type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click(); 
}

function deleteFile(index) {
    files.splice(index, 1);

    localStorage.setItem('files', JSON.stringify(files));

    filterFiles();
}

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('hover');
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFilesToStorage(droppedFiles);
});

fileInput.addEventListener('change', (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFilesToStorage(selectedFiles);
});

dropArea.addEventListener('click', () => {
    fileInput.click(); 
});

fileTypeFilter.addEventListener('change', filterFiles);
fileSizeFilter.addEventListener('input', filterFiles);

displayFiles(files);