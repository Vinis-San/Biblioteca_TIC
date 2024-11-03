// Função para carregar pastas do GitHub
async function fetchBooks() {
    try {
        const response = await fetch("https://api.github.com/repos/Vinis-San/books/contents");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const bookListContainer = document.getElementById('bookList');
        bookListContainer.innerHTML = ""; // Limpa o conteúdo anterior

        data.forEach(folder => {
            if (folder.type === "dir") {
                const folderCard = document.createElement("div");
                folderCard.classList.add("ag-courses_item");
        
                // Link que envolve todo o card
                const folderLink = document.createElement("a");
                folderLink.href = "#"; // Coloque a URL ou lógica para abrir a pasta aqui
                folderLink.classList.add("ag-courses-item_link");
                
                // Adiciona o nome da pasta como conteúdo do link
                folderLink.textContent = folder.name;
        
                folderCard.appendChild(folderLink);
                bookListContainer.appendChild(folderCard);
        
                // Adiciona o evento de clique no link
                folderLink.addEventListener("click", function() {
                    showBooks(folder.path); // Chama a função showBooks
                });
        
                folderCard.appendChild(folderLink); // Adiciona o link ao card
            }
        });
    } catch (error) {
        console.error("Erro ao carregar pastas:", error);
    }
}

// Função para mostrar livros da pasta selecionada
async function showBooks(folderPath) {
    console.log(`Acessando a pasta: ${folderPath}`); // Para verificar se a função é chamada
    try {
        const response = await fetch(`https://api.github.com/repos/Vinis-San/books/contents/${folderPath}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const modal = document.getElementById("modal");
        const bookListModal = document.getElementById("book-list-modal");
        const modalTitle = document.getElementById("modal-title");

        modalTitle.textContent = `${folderPath.split('/').pop()}`; // Define o título com o nome da pasta
        bookListModal.innerHTML = ""; // Limpa o conteúdo anterior

        data.forEach(book => {
            if (book.type === "file" && book.name.endsWith('.pdf')) { // Verifica se é um arquivo PDF
                const listItem = document.createElement("li");
                const bookNameWithoutExtension = book.name.replace('.pdf', ''); // Remove a extensão .pdf

                listItem.innerHTML = `
                    <h3>${bookNameWithoutExtension}</h3> <!-- Exibe o nome sem a extensão -->
                    <a href="${book.download_url}" target="_blank">Download</a>
                `;
                bookListModal.appendChild(listItem);
            }
        });

        modal.style.display = "block"; // Abre o modal
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
    }
}

// Fecha o modal
document.querySelector(".close-button").onclick = function() {
    document.getElementById("modal").style.display = "none"; // Fecha o modal
}

// Troca entre modo claro e escuro
document.getElementById("theme-switch").addEventListener("change", function() {
    document.body.classList.toggle("dark-mode");
});

// Carrega as pastas ao iniciar
fetchBooks();
