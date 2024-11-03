const bookListContainer = document.getElementById('bookList');
const searchInput = document.querySelector('.search-label input'); // Seleciona o input de busca

document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("theme-switch");
    initializeTheme(themeSwitch);

    // Alterna o tema ao clicar
    themeSwitch.addEventListener("change", () => {
        toggleTheme(themeSwitch);
    });

    // Carregar livros ao carregar a página
    fetchBooks();

    // Adiciona um evento para o input de busca
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filterFolders(searchTerm); // Filtra pastas com base no termo de busca
    });
});

// Inicializa o tema com base na escolha do usuário
function initializeTheme(themeSwitch) {
    if (localStorage.getItem("theme") === "dark ") {
        document.body.classList.add("dark-mode");
        themeSwitch.checked = true;
    }
}

// Alterna entre os temas e armazena a escolha no localStorage
function toggleTheme(themeSwitch) {
    if (themeSwitch.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
}

// Função para buscar livros do repositório GitHub
async function fetchBooks() {
    const url = "https://api.github.com/repos/Vinis-San/books/contents/";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        displayFolders(data);
    } catch (error) {
        console.error("Erro ao buscar os livros:", error);
    }
}

// Função para buscar arquivos de uma pasta específica
async function fetchFolderContents(folderPath) {
    const url = `https://api.github.com/repos/Vinis-San/books/contents/${folderPath}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        displayFiles(data);
    } catch (error) {
        console.error("Erro ao buscar os arquivos da pasta:", error);
    }
}

// Função para exibir pastas
function displayFolders(data) {
    bookListContainer.innerHTML = ''; // Limpa a lista antes de exibir
    data.forEach(folder => {
        if (folder.type === 'dir') {
            const folderItem = document.createElement('div');
            folderItem.className = 'ag-courses_item'; // Usar a classe do card
            folderItem.innerHTML = `
                <a href="#" class="ag-courses-item_link">
                    <div class="ag-courses-item_bg"></div>
                    <div class="ag-courses-item_title">${folder.name}</div>
                    <div class="ag-courses-item_date-box">
                        Livros:
                        <ul id="book-${folder.name}"></ul> <!-- Lista para os livros da pasta -->
                    </div>
                </a>
            `;
            folderItem.addEventListener('click', () => fetchFolderContents(folder.path));
            bookListContainer.appendChild(folderItem);
        }
    });
}

// Função para filtrar pastas com base no termo de busca
function filterFolders(searchTerm) {
    const allFolders = Array.from(bookListContainer.children); // Obtém todas as pastas atualmente exibidas
    allFolders.forEach(folder => {
        const folderName = folder.textContent.toLowerCase(); // Obtém o nome da pasta
        if (folderName.includes(searchTerm)) {
            folder.style.display = ''; // Exibe a pasta se o nome incluir o termo de busca
        } else {
            folder.style.display = 'none'; // Esconde a pasta se não incluir o termo
        }
    });
}

// Função para exibir arquivos dentro de uma pasta
function displayFiles(data) {
    data.forEach(file => {
        if (file.type === 'file') {
            const folderName = file.path.split('/')[0]; // Extrai o nome da pasta
            const bookList = document.getElementById(`book-${folderName}`); // Seleciona a lista da pasta
            const fileItem = document.createElement('li');
            fileItem.innerHTML = `
                ${file.name}
                <a href="${file.download_url}" class="download-button">Download</a>
            `;
            bookList.appendChild(fileItem);
        }
    });
}

// Modifique a função displayFiles
function displayFiles(data) {
    const bookListModal = document.getElementById('book-list-modal');
    bookListModal.innerHTML = ''; // Limpa a lista antes de exibir

    data.forEach(file => {
        if (file.type === 'file') {
            const fileItem = document.createElement('li');
            fileItem.innerHTML = `
                ${file.name}
                <button class="download-button" onclick="downloadFile('${file.download_url}')">Baixar</button>
            `;
            bookListModal.appendChild(fileItem);
        }
    });

    // Mostra o modal
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

// Função para fechar o modal
const closeButton = document.querySelector('.close-button');
closeButton.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
});

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Função para baixar o arquivo
function downloadFile(url) {
    window.open(url, '_blank'); // Abre o link em uma nova aba
}
