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

                bookListContainer.appendChild(folderCard);

                folderCard.appendChild(folderLink);
                bookListContainer.appendChild(folderCard);

                // Adiciona o evento de clique no link
                folderLink.addEventListener("click", function () {
                    showBooks(folder.path); // Chama a função showBooks
                });
            }
        });
    } catch (error) {
        console.error("Erro ao carregar pastas:", error);
    }
}

// Função para mostrar livros da pasta selecionada
async function showBooks(folderPath) {
    console.log(`Acessando a pasta: ${folderPath}`);
    try {
        const response = await fetch(`https://api.github.com/repos/Vinis-San/books/contents/${folderPath}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const modal = document.getElementById("modal");
        const bookListModal = document.getElementById("book-list-modal");
        const modalTitle = document.getElementById("modal-title");

        modalTitle.textContent = `${folderPath.split('/').pop()}`;
        bookListModal.innerHTML = ""; // Limpa o conteúdo anterior

        data.forEach(book => {
            if (book.type === "file" && book.name.endsWith('.pdf')) {
                const listItem = document.createElement("li");
                const bookNameWithoutExtension = book.name.replace('.pdf', '');

                listItem.innerHTML = `
                <h3>${bookNameWithoutExtension}</h3>
                <button class="download-btn" onclick="window.open('${book.download_url}', '_blank')">
                    Download
                </button>
                `;
                bookListModal.appendChild(listItem);
            }
        });

        modal.style.display = "block"; // Abre o modal
        filterBooks(); // Chama a função de filtro após adicionar os livros
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
    }
}

// Fecha o modal
document.querySelector(".close-button").onclick = function () {
    document.getElementById("modal").style.display = "none"; // Fecha o modal
}


// Adiciona o evento de input ao campo de busca
document.getElementById('searchInput').addEventListener('input', filterBooks);

// Carrega as pastas ao iniciar
fetchBooks();

// Função para filtrar as pastas de acordo com o texto de busca
function filterBooks() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const folders = document.querySelectorAll(".ag-courses_item");

    folders.forEach(folder => {
        const folderName = folder.textContent.toLowerCase();
        if (folderName.includes(searchTerm)) {
            folder.style.display = "block"; // Exibe se corresponder à busca
        } else {
            folder.style.display = "none"; // Oculta se não corresponder
        }
    });
}

// Adiciona o evento de input ao campo de busca
document.getElementById('searchInput').addEventListener('input', filterBooks);

// Carrega as pastas ao iniciar
fetchBooks();
