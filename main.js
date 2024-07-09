class MainSearch {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchForm = document.getElementById('search-form'); // Nuevo: obtenemos el formulario de búsqueda
        this.pages = ['index.html', 'productos.html', 'contacto.html']; // Lista de páginas a buscar
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', this.onInput.bind(this));
        // Agregar event listener para el formulario
        this.searchForm.addEventListener('submit', this.onSubmit.bind(this));
        // Agregamos un event listener al logotipo para controlar la visualización del formulario
        document.querySelector('.buscar').addEventListener('click', this.toggleBusqueda.bind(this));
        // Ayuda a cerrar el cuadro de búsqueda al dar clic en la equis
        document.getElementById('close-search').addEventListener('click', this.toggleBusqueda.bind(this));
        // Agregar event listener para los resultados de búsqueda
        this.searchResults.addEventListener('click', this.goToProduct.bind(this));
        // Event listener para cerrar el cuadro de búsqueda al hacer clic fuera de él
        document.addEventListener('click', this.onClickOutside.bind(this));
    }

    async onInput(event) {
        const query = event.target.value.trim().toLowerCase();
        if (query === '') {
            this.clearSearchResults();
            return;
        }

        const matchedElements = await this.findMatches(query);
        this.displayResults(matchedElements);
    }

    async onSubmit(event) {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        const query = this.searchInput.value.trim().toLowerCase();
        if (query === '') {
            this.clearSearchResults();
            return;
        }

        const matchedElements = await this.findMatches(query);
        this.displayResults(matchedElements);
    }

    async findMatches(query) {
        const matchedElements = [];

        for (const page of this.pages) {
            const response = await fetch(page);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const elementsWithClass = doc.querySelectorAll('.searchable-element');
            elementsWithClass.forEach((element) => {
                const elementText = element.textContent.toLowerCase();
                if (elementText.includes(query)) {
                    const imgElement = element.closest('.product-card').querySelector('img');
                    const imgSrc = imgElement ? imgElement.src : '';
                    matchedElements.push({
                        text: element.textContent,
                        page: page,
                        id: element.id,
                        imgSrc: imgSrc
                    });
                }
            });
        }

        return matchedElements;
    }

    displayResults(matchedElements) {
        if (matchedElements.length === 0) {
            this.searchResults.innerHTML = '<p>No se encontraron resultados.</p>';
        } else {
            this.searchResults.innerHTML = '<p>Resultados:</p>';
            matchedElements.forEach((element) => {
                this.searchResults.innerHTML += `
                    <a href="${element.page}#${element.id}" class="search-result-item">
                        <img src="${element.imgSrc}" alt="${element.text}" class="search-result-image" onerror="this.style.display='none'">
                        ${element.text}
                    </a>
                    <br><br>`;
            });
        }
        this.searchResults.style.display = 'block';
    }

    clearSearchResults() {
        // Limpiar el contenido del cuadro de búsqueda y ocultar los resultados
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
        this.searchResults.style.display = 'none';
    }

    // Nueva función para mostrar u ocultar el formulario de búsqueda
    toggleBusqueda() {
        this.searchForm.classList.toggle('hidden');
    }

    goToProduct(event) {
        if (event.target.tagName === 'A') {
            // Prevenir el comportamiento predeterminado del enlace
            event.preventDefault();
            // Obtener el ID del producto desde el enlace
            const href = event.target.getAttribute('href');
            const [page, productId] = href.split('#');

            if (page === window.location.pathname.split('/').pop()) {
                // Si la página es la misma, desplazarse al producto sin recargar la página
                const productElement = document.getElementById(productId);
                if (productElement) {
                    productElement.scrollIntoView({ behavior: 'smooth' });
                    this.toggleBusqueda();
                    this.clearSearchResults();
                }
            } else {
                // Si la página es diferente, cargar la nueva página
                window.location.href = page + '#' + productId;
            }
        }
    }

    onClickOutside(event) {
        if (!this.searchForm.contains(event.target) && !event.target.classList.contains('buscar')) {
            this.searchForm.classList.add('hidden');
        }
    }
}

const mainSearch = new MainSearch();
