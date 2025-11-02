import { GNEWS_URL, GNEWS_API_KEY } from "./environment.js";

const mainNews = document.getElementById("main-news");
const secondaryNews = document.getElementById("secondary-news");
const newsContainer = document.querySelector(".container"); // Contenedor principal para añadir el filtro

// Filtro de noticias
const NEWS_FILTERS = {
    "Bolsa y Cripto": "Stock Market OR Cryptocurrency OR NYSE OR NASDAQ OR Bitcoin OR Ethereum OR Shares",
    "Bolsa": "Stock Market OR NYSE OR NASDAQ OR Shares",
    "Cripto": "Cryptocurrency OR Bitcoin OR Ethereum",
    "Tecnología": "Technology stocks OR AI OR Tech Industry"
};

let currentQuery = NEWS_FILTERS["Bolsa y Cripto"];

function createFilterNavigation() {
    const filterDiv = document.createElement('div');
    filterDiv.className = 'd-flex flex-wrap gap-2 mb-4';

    Object.keys(NEWS_FILTERS).forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.className = 'btn btn-sm filter-btn'; 
        if (NEWS_FILTERS[key] === currentQuery) {
            button.classList.add('active'); 
        }
        
        button.addEventListener('click', () => {
            currentQuery = NEWS_FILTERS[key];
            // Actualizar clase activa
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Recargar noticias con el nuevo filtro
            cargarNoticias(currentQuery);
        });

        filterDiv.appendChild(button);
    });
    
    const titleH2 = document.querySelector(".top-container");
    if (titleH2) {
        titleH2.after(filterDiv);
    } else {
        newsContainer.prepend(filterDiv);
    }
}


// --- Función principal de carga de noticias
async function cargarNoticias(query = currentQuery) {
    try {
        // Limpiar contenido antiguo y mostrar carga
        mainNews.innerHTML = `<p class="text-center text-muted">Cargando noticias...</p>`;
        secondaryNews.innerHTML = '';

        // Añadimos el parámetro de búsqueda 'q' a la URL
        const apiUrl = `${GNEWS_URL}&token=${GNEWS_API_KEY}&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            mainNews.innerHTML = `<p class="text-danger">⚠️ No se pudieron cargar noticias financieras con el filtro aplicado: ${query}</p>`;
            return;
        }

        // --- 1. Noticia Principal ---
        const mainArticle = data.articles[0];
        mainNews.innerHTML = `
            <div class="single-stock-card card-shadow cursor-pointer">
                ${mainArticle.image ? `<img src="${mainArticle.image}" class="main-news-img" alt="Imagen noticia">` : ""}
                <div class="main-news-content">
                    <span class="news-meta">${mainArticle.source.name}</span>
                    <h2 class="main-news-title">${mainArticle.title}</h2>
                    <p class="main-news-excerpt" style="color: #242424;">${mainArticle.description || ""}</p>
                </div>
            </div>
        `;
        mainNews.querySelector(".single-stock-card").addEventListener("click", () => openModal(mainArticle));

        const secondaryArticles = data.articles.slice(1);
        
        // Contenedor principal del carrusel de Bootstrap
        secondaryNews.innerHTML = `
            <div id="secondaryNewsCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                </div>
                <!-- Controles del carrusel -->
                <button class="carousel-control-prev" type="button" data-bs-target="#secondaryNewsCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#secondaryNewsCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;

        const carouselInner = document.querySelector("#secondaryNewsCarousel .carousel-inner");
        
        let itemIndex = 0;
        let itemDiv;

        secondaryArticles.forEach((article, index) => {
            // Cada 3 tarjetas (o al inicio), creamos un nuevo item del carrusel
            if (index % 3 === 0) {
                if (itemDiv) {
                    carouselInner.appendChild(itemDiv);
                }
                itemDiv = document.createElement("div");
                itemDiv.className = `carousel-item${itemIndex === 0 ? ' active' : ''}`;
                itemDiv.innerHTML = `<div class="d-flex justify-content-start gap-3"></div>`;
                itemIndex++;
            }

            const cardsContainer = itemDiv.querySelector(".d-flex");

            const card = document.createElement("div");
            card.className = "single-stock-card-sm card-shadow cursor-pointer carousel-card-item";
            card.innerHTML = `
                ${article.image ? `<img src="${article.image}" class="img-fluid rounded mb-2" alt="Noticia">` : ""}
                <span class="news-meta">${article.source.name}</span>
                <h6 class="single-stock-name">${article.title}</h6>
            `;
            // Asignar listener de clic a la tarjeta secundaria
            card.addEventListener("click", () => openModal(article));
            
            cardsContainer.appendChild(card);
        });

        if (itemDiv) {
            carouselInner.appendChild(itemDiv);
        }

    } catch (error) {
        console.error("Error al cargar noticias:", error);
        mainNews.innerHTML = `<p class="text-danger">⚠️ No se pudieron cargar las noticias. Revise la clave API o la URL.</p>`;
    }
}

function openModal(article) {
    document.getElementById("modalTitle").textContent = article.title;
    document.getElementById("modalBody").innerHTML = `
        ${article.image ? `<img src="${article.image}" alt="Imagen noticia" class="img-fluid mb-2 rounded">` : ""}
        <p>${article.content || article.description || "Contenido no disponible. Por favor, haga clic en el enlace para leer la noticia completa."}</p>
    `;
    document.getElementById("modalLink").href = article.url;
    
    // Asegurarse de que Bootstrap esté disponible para crear el modal
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modal = new bootstrap.Modal(document.getElementById('newsModal'));
        modal.show();
    } else {
        console.error("Bootstrap Modal no está cargado.");
    }
}

// Inicialización: Crear navegación y cargar noticias
document.addEventListener("DOMContentLoaded", () => {
    createFilterNavigation();
    cargarNoticias();
});






