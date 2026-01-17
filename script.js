// Копирование IP адреса
function copyIP() {
    const ipElement = document.getElementById('server-ip');
    const ipInput = document.getElementById('server-ip-input');
    const ip = (ipElement || ipInput)?.textContent || (ipInput?.value) || 'IP не загружен';
    
    if (ip && ip !== 'loading...' && ip !== 'IP не загружен') {
        navigator.clipboard.writeText(ip).then(() => {
            showNotification('IP адрес скопирован!', 'success');
        }).catch(() => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = ip;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('IP адрес скопирован!', 'success');
        });
    } else {
        showNotification('IP адрес еще не загружен', 'error');
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : '#FFD700'};
        color: ${type === 'error' ? '#fff' : '#000'};
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                nav.classList.remove('active');
            }
        });
    }
    
    // Загрузка IP адреса (заглушка, можно заменить на реальный API)
    loadServerIP();
    checkServerStatus();
});

// Загрузка IP адреса сервера
function loadServerIP() {
    // Здесь можно добавить запрос к API для получения реального IP
    // Пока используем заглушку
    const serverIP = 'play.imperia-server.ru:25565'; // Замените на реальный IP
    
    const ipElements = document.querySelectorAll('#server-ip, #server-ip-input');
    ipElements.forEach(el => {
        if (el.tagName === 'INPUT') {
            el.value = serverIP;
        } else {
            el.textContent = serverIP;
        }
    });
}

// Проверка статуса сервера
function checkServerStatus() {
    const statusElement = document.getElementById('server-status');
    const statusDot = document.querySelector('.status-dot');
    
    if (!statusElement || !statusDot) return;
    
    // Симуляция проверки статуса (можно заменить на реальный API)
    setTimeout(() => {
        // Здесь можно добавить реальную проверку через API
        const isOnline = true; // Замените на реальную проверку
        
        if (isOnline) {
            statusElement.textContent = 'Сервер онлайн';
            statusDot.classList.add('online');
        } else {
            statusElement.textContent = 'Сервер оффлайн';
            statusDot.classList.remove('online');
        }
    }, 1000);
}

// Плавная прокрутка для якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применение анимации к карточкам
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.history-card, .ustav-chapter, .rule-category, .hierarchy-level');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Добавление стилей для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Поиск по странице
let searchHighlights = [];
let currentSearchIndex = -1;
let searchMatches = [];

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    // Обработка ввода в поиск
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length > 0) {
            searchClear.style.display = 'block';
            performSearch(query);
        } else {
            searchClear.style.display = 'none';
            clearSearch();
        }
    });
    
    // Очистка поиска
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
            clearSearch();
            searchClear.style.display = 'none';
        });
    }
    
    // Закрытие результатов при клике вне
    document.addEventListener('click', function(event) {
        if (searchResults && !event.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });
    
    // Навигация по результатам
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && searchMatches.length > 0) {
            e.preventDefault();
            if (currentSearchIndex < searchMatches.length - 1) {
                currentSearchIndex++;
            } else {
                currentSearchIndex = 0;
            }
            scrollToMatch(currentSearchIndex);
        } else if (e.key === 'Escape') {
            clearSearch();
            searchInput.value = '';
            searchClear.style.display = 'none';
        }
    });
});

function performSearch(query) {
    clearSearch();
    
    if (query.length < 2) {
        return;
    }
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Исключаем элементы из поиска
    const excludeSelectors = 'script, style, nav, header, footer, .search-container, .mobile-menu-toggle';
    const searchableElements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, td, span, div');
    
    searchMatches = [];
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    
    searchableElements.forEach((element, index) => {
        // Пропускаем элементы внутри исключений
        if (element.closest(excludeSelectors)) return;
        
        const text = element.textContent || element.innerText;
        if (regex.test(text)) {
            const matches = text.match(regex);
            if (matches && matches.length > 0) {
                searchMatches.push({
                    element: element,
                    text: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
                    index: index
                });
                
                // Выделяем найденный текст
                highlightText(element, query);
            }
        }
    });
    
    // Показываем результаты
    displaySearchResults(query, searchMatches);
    
    if (searchMatches.length > 0) {
        currentSearchIndex = 0;
        scrollToMatch(0);
    }
}

function highlightText(element, query) {
    if (element.children.length > 0) {
        // Если элемент содержит дочерние элементы, обрабатываем их
        Array.from(element.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
                if (regex.test(text)) {
                    const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
                    const wrapper = document.createElement('span');
                    wrapper.innerHTML = highlighted;
                    node.parentNode.replaceChild(wrapper, node);
                    searchHighlights.push(wrapper);
                }
            }
        });
    } else {
        // Если элемент не содержит дочерних элементов
        const text = element.textContent;
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        if (regex.test(text)) {
            const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
            element.innerHTML = highlighted;
            searchHighlights.push(element);
        }
    }
}

function displaySearchResults(query, matches) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
        searchResults.classList.add('active');
        return;
    }
    
    let html = `<div class="search-match-count">Найдено: ${matches.length}</div>`;
    
    matches.forEach((match, index) => {
        const highlightedText = match.text.replace(
            new RegExp(`(${escapeRegex(query)})`, 'gi'),
            '<mark class="search-highlight">$1</mark>'
        );
        
        html += `
            <div class="search-result-item" data-index="${index}">
                <div class="search-result-text">${highlightedText}</div>
            </div>
        `;
    });
    
    searchResults.innerHTML = html;
    searchResults.classList.add('active');
    
    // Обработка клика по результату
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            currentSearchIndex = index;
            scrollToMatch(index);
        });
    });
}

function scrollToMatch(index) {
    if (index < 0 || index >= searchMatches.length) return;
    
    const match = searchMatches[index];
    const element = match.element;
    
    // Убираем предыдущие выделения активного элемента
    document.querySelectorAll('.search-result-item.active').forEach(el => {
        el.classList.remove('active');
    });
    
    // Добавляем выделение текущему элементу в результатах
    const resultItems = document.querySelectorAll('.search-result-item');
    if (resultItems[index + 1]) { // +1 потому что первый элемент - счетчик
        resultItems[index + 1].classList.add('active');
    }
    
    // Прокручиваем к элементу
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    
    // Визуальное выделение элемента
    element.style.transition = 'background-color 0.3s ease';
    element.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
    
    setTimeout(() => {
        element.style.backgroundColor = '';
    }, 2000);
}

function clearSearch() {
    // Убираем выделения
    searchHighlights.forEach(highlight => {
        if (highlight.parentNode) {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        }
    });
    
    searchHighlights = [];
    searchMatches = [];
    currentSearchIndex = -1;
    
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
    }
    
    // Убираем визуальные выделения
    document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        }
    });
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
