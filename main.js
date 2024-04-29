class MainSearch {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchForm = document.getElementById('search-form'); // Nuevo: obtenemos el formulario de búsqueda
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', this.onInput.bind(this));
        // Agregamos un event listener al logotipo para controlar la visualización del formulario
        document.querySelector('.buscar').addEventListener('click', this.toggleBusqueda.bind(this));
        // Ayuda a cerrar el cuadro de busqueda a dar clic en la equis
        document.getElementById('close-search').addEventListener('click', this.toggleBusqueda.bind(this));
        // Agregar event listener para los resultados de búsqueda
        this.searchResults.addEventListener('click', this.goToProduct.bind(this));
    }

    onInput(event) {
        const query = event.target.value.trim().toLowerCase();
        if (query === '') {
            this.clearSearchResults();
            return;
        }

        const matchedElements = this.findMatches(query);
        this.displayResults(matchedElements);
    }

    findMatches(query) {
        // Aquí puedes implementar la lógica para encontrar coincidencias en la página
        // Por ejemplo, podrías buscar elementos con ciertas clases, IDs o texto
        // Devuelve una lista de elementos que coinciden con la consulta
        const matchedElements = [];
        // Buscar elementos por clase
        const elementsWithClass = document.querySelectorAll('.searchable-element');
        elementsWithClass.forEach((element) => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                matchedElements.push(element);
            }
        });
        // Buscar elementos por ID
        const elementWithId = document.getElementById(query);
        if (elementWithId) {
            matchedElements.push(elementWithId);
        }
        return matchedElements;
    }

    displayResults(matchedElements) {
        if (matchedElements.length === 0) {
            this.searchResults.innerHTML = '<p>No se encontraron resultados.</p>';
        } else {
            this.searchResults.innerHTML = '<p>Resultados:</p>';
            matchedElements.forEach((element) => {
                this.searchResults.innerHTML += `<a href="#${element.id}">${element.textContent}</a> <br><br>`;
            });
        }
        this.searchResults.style.display = 'block';
    }

    clearSearchResults() {
        // Limpiar el contenido del cuadro de búsqueda y ocultar los resultados
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
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
            const productId = event.target.getAttribute('href').substring(1);
            // Encontrar el elemento del producto y desplazar la página hacia él
            const productElement = document.getElementById(productId);
            if (productElement) {
                productElement.scrollIntoView({ behavior: 'smooth' });
                // Ocultar el formulario de búsqueda después de desplazar
                this.toggleBusqueda();
                this.clearSearchResults();
            }
        }
    }

}

const mainSearch = new MainSearch();