window.Telegram.WebApp.ready();

const app = {
    init() {
        this.loadUserData();
        this.setupLoader();
        this.initNavigation();
    },

    loadUserData() {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        const guestName = document.querySelector('.guest-name');
        guestName.textContent = user?.first_name || 'Гость';
    },

    setupLoader() {
        const loader = document.querySelector('.loader');
        const mainContent = document.querySelector('.main-content');

        // Имитация загрузки
        setTimeout(() => {
            loader.style.opacity = '0';
            mainContent.style.display = 'block';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 2000);
    },

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const pages = document.querySelectorAll('.main-content');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Убираем активный класс со всех пунктов меню
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Добавляем активный класс кликнутому пункту
                item.classList.add('active');
                
                // Скрываем все страницы
                pages.forEach(page => page.style.display = 'none');
                
                // Показываем нужную страницу
                const pageId = item.getAttribute('data-page');
                document.getElementById(pageId).style.display = 'block';
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());

// Функция для переключения страниц
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.main-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Убираем активный класс со всех пунктов меню
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Добавляем активный класс кликнутому пункту
            item.classList.add('active');
            
            // Скрываем все страницы
            pages.forEach(page => page.style.display = 'none');
            
            // Показываем нужную страницу
            const pageId = item.getAttribute('data-page');
            document.getElementById(pageId).style.display = 'block';
        });
    });
}

// Инициализация после загрузки страницы
window.addEventListener('load', () => {
    // ... existing load event code ...
    initNavigation();
});

// Заменить все URL с localhost на ваш реальный бэкенд URL
const API_BASE_URL = 'https://your-backend-url.com';

// Обновим методы в menuHandler
const menuHandler = {
    async loadCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            const categories = await response.json();
            this.renderCategories(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    },

    renderCategories(categories) {
        const categoriesGrid = document.querySelector('.categories-grid');
        categoriesGrid.innerHTML = categories.map(category => `
            <div class="category-item" data-category-id="${category.id}">
                <img src="${category.image_url}" alt="${category.name}">
                <span>${category.name}</span>
            </div>
        `).join('');

        // Добавляем обработчики событий для категорий
        categoriesGrid.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                const categoryId = item.dataset.categoryId;
                this.loadDishes(categoryId);
            });
        });
    },

    async loadDishes(categoryId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}/dishes`);
            const dishes = await response.json();
            this.showDishesPage(dishes);
        } catch (error) {
            console.error('Error loading dishes:', error);
        }
    },

    async loadPopularDishes() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/dishes/popular`);
            const dishes = await response.json();
            this.renderPopularDishes(dishes);
        } catch (error) {
            console.error('Error loading popular dishes:', error);
        }
    },

    async loadSets() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/sets`);
            const sets = await response.json();
            this.renderSets(sets);
        } catch (error) {
            console.error('Error loading sets:', error);
        }
    },

    showDishesPage(dishes) {
        const menuPage = document.getElementById('menu-page');
        
        // Создаем и показываем страницу с блюдами
        const dishesHTML = `
            <div class="menu-header">
                <img src="images/logo.png" alt="Логотип Баранжар" class="menu-logo">
                <h1 class="menu-title">Блюда</h1>
                <button class="back-button" onclick="menuHandler.showCategories()">
                    <img src="images/back.png" alt="Назад" class="back-icon">
                </button>
            </div>
            <div class="dishes-grid">
                ${dishes.map(dish => `
                    <div class="dish-card">
                        <img src="${dish.image_url}" alt="${dish.name}">
                        <div class="dish-info">
                            <h3>${dish.name}</h3>
                            <p>${dish.description}</p>
                            <div class="dish-footer">
                                <span class="dish-weight">${dish.weight}г</span>
                                <span class="dish-price">${dish.price}₽</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        menuPage.innerHTML = dishesHTML;
    },

    showCategories() {
        // Возвращаемся к странице категорий
        this.loadCategories();
    }
};

// Добавляем в основной объект приложения
app.init = function() {
    this.loadUserData();
    this.setupLoader();
    this.initNavigation();
    
    // Инициализируем обработчик меню при загрузке страницы меню
    const menuLink = document.querySelector('[data-page="menu-page"]');
    menuLink.addEventListener('click', () => {
        menuHandler.loadCategories();
    });
};

// Функция загрузки категорий
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки категорий');
        }
        const categories = await response.json();
        renderCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Функция отображения категорий
function renderCategories(categories) {
    const categoriesContainer = document.querySelector('.categories-grid');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category-card" data-category-id="${category.id}">
            <div class="category-image">
                <img src="${API_BASE_URL}${category.image_url}" 
                     alt="${category.name}"
                     onerror="this.src='images/placeholder.png'">
            </div>
            <div class="category-name">${category.name}</div>
        </div>
    `).join('');

    // Добавляем обработчики клика
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.categoryId;
            loadDishesForCategory(categoryId);
        });
    });
}

// Загружаем категории при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadPopularDishes();
});

// Функция загрузки блюд по категории
async function loadDishesForCategory(categoryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}/dishes`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки блюд');
        }
        const dishes = await response.json();
        renderDishes(dishes);
    } catch (error) {
        console.error('Error loading dishes:', error);
    }
}

// Функция отображения блюд
function renderDishes(dishes) {
    const categoriesContainer = document.querySelector('.categories-grid');
    if (!categoriesContainer) return;

    // Сохраняем родительский элемент
    const menuSection = categoriesContainer.closest('.menu-section');
    
    // Создаем разметку для блюд
    const dishesHTML = `
        <div class="dishes-grid">
            ${dishes.map(dish => `
                <div class="dish-card">
                    <div class="dish-image">
                        <img src="${API_BASE_URL}${dish.image_url}" 
                             alt="${dish.name}"
                             onerror="this.src='images/placeholder.png'">
                    </div>
                    <div class="dish-info">
                        <h3 class="dish-name">${dish.name}</h3>
                        <p class="dish-description">${dish.description}</p>
                        <div class="dish-footer">
                            <div class="dish-price-weight">
                                <span class="dish-price">${dish.price} ₽</span>
                                <span class="dish-weight">${dish.weight} г</span>
                            </div>
                            <div class="dish-tags">
                                ${dish.is_spicy ? '<span class="dish-tag spicy">Острое</span>' : ''}
                                ${dish.is_vegetarian ? '<span class="dish-tag vegetarian">Вегетарианское</span>' : ''}
                                ${dish.is_popular ? '<span class="dish-tag popular">Популярное</span>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="back-button" onclick="showCategories()">← Назад к категориям</button>
    `;

    menuSection.innerHTML = dishesHTML;
}

// Функция возврата к категориям
async function showCategories() {
    const menuSection = document.querySelector('.menu-section');
    menuSection.innerHTML = `
        <div class="section-header">
            <h2>Категории</h2>
            <span class="section-arrow">→</span>
        </div>
        <div class="categories-grid"></div>
    `;
    await loadCategories();
}

// Функция загрузки популярных блюд
async function loadPopularDishes() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dishes/popular`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки популярных блюд');
        }
        const dishes = await response.json();
        renderPopularDishes(dishes);
    } catch (error) {
        console.error('Error loading popular dishes:', error);
    }
}

// Функция отображения популярных блюд
function renderPopularDishes(dishes) {
    const popularContainer = document.querySelector('.popular-grid');
    if (!popularContainer) return;

    popularContainer.innerHTML = dishes.map(dish => `
        <div class="dish-card">
            <div class="dish-image">
                <img src="${API_BASE_URL}${dish.image_url}" 
                     alt="${dish.name}"
                     onerror="this.src='images/placeholder.png'">
            </div>
            <div class="dish-info">
                <h3 class="dish-name">${dish.name}</h3>
                <p class="dish-description">${dish.description}</p>
                <div class="dish-footer">
                    <div class="dish-price-weight">
                        <span class="dish-price">${dish.price} ₽</span>
                        <span class="dish-weight">${dish.weight} г</span>
                    </div>
                    <div class="dish-tags">
                        ${dish.is_spicy ? '<span class="dish-tag spicy">Острое</span>' : ''}
                        ${dish.is_vegetarian ? '<span class="dish-tag vegetarian">Вегетарианское</span>' : ''}
                        ${dish.is_popular ? '<span class="dish-tag popular">Популярное</span>' : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
} 