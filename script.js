const bookListContainer = document.getElementById('bookList');
const themeToggle = document.getElementById('themeToggle');

// Alternar entre temas claro e escuro
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '🌞';
});

// Função para buscar livros do repositório GitHub
async function fetchBooks() {
    const url = "https://api.github.com/repos/Vinis-San/books/contents/";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayFolders(data);  // Chama a função para exibir as pastas
    } catch (error) {
        console.error("Erro ao buscar os livros:", error);
    }
}

// Função para buscar arquivos de uma pasta específica
async function fetchFolderContents(folderPath) {
    const url = `https://api.github.com/repos/Vinis-San/books/contents/${folderPath}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayFiles(data); // Chama a função para exibir os arquivos
    } catch (error) {
        console.error("Erro ao buscar os arquivos da pasta:", error);
    }
}

// Função para exibir pastas
function displayFolders(data) {
    bookListContainer.innerHTML = ''; // Limpa a lista antes de exibir
    data.forEach(folder => {
        if (folder.type === 'dir') { // Verifica se é uma pasta
            const folderItem = document.createElement('div');
            folderItem.className = 'book-item';
            folderItem.innerHTML = `
                <h3>${folder.name}</h3>
            `;
            folderItem.addEventListener('click', () => {
                // Acessa a pasta e busca os arquivos
                fetchFolderContents(folder.path); // Aqui usamos folder.path
            });
            bookListContainer.appendChild(folderItem);
        }
    });
}

// Função para exibir arquivos dentro da pasta
function displayFiles(data) {
    bookListContainer.innerHTML = ''; // Limpa a lista antes de exibir os arquivos
    data.forEach(file => {
        if (file.type === 'file') { // Verifica se é um arquivo
            const fileItem = document.createElement('div');
            fileItem.className = 'book-item';
            fileItem.innerHTML = `
                <h3>${file.name}</h3>
                <a class="download-link" href="${file.download_url}" target="_blank">Baixar</a>
            `;
            bookListContainer.appendChild(fileItem);
        }
    });
}

// Carregar livros ao carregar a página
fetchBooks();
