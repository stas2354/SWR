// Создание звездного фона
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starsCount = 150;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        const opacity = Math.random() * 0.6 + 0.2;
        star.style.opacity = opacity;
        
        // Анимация мерцания для некоторых звезд
        if (Math.random() > 0.8) {
            star.style.animation = `twinkle ${Math.random() * 4 + 2}s infinite alternate`;
        }
        
        starsContainer.appendChild(star);
    }
}

// Добавление стилей для анимации мерцания
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0% { opacity: 0.2; }
        100% { opacity: 0.8; }
    }
`;
document.head.appendChild(style);

// Показ/скрытие меню устава
let charterMenuTimeout;

function showCharterMenu() {
    clearTimeout(charterMenuTimeout);
    document.getElementById('charterMenu').classList.add('show');
}

function hideCharterMenu() {
    charterMenuTimeout = setTimeout(() => {
        document.getElementById('charterMenu').classList.remove('show');
    }, 300);
}

// Плавная прокрутка к разделам
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Закрываем меню устава при переходе
                document.getElementById('charterMenu').classList.remove('show');
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Имитация изменения количества игроков онлайн
function updateOnlinePlayers() {
    const onlineCount = document.getElementById('online-count');
    const baseCount = 47;
    const variation = Math.floor(Math.random() * 11) - 5;
    const newCount = Math.max(30, baseCount + variation);
    onlineCount.textContent = newCount;
}

// Подсветка текущего раздела при прокрутке
function setupSectionHighlights() {
    const sections = document.querySelectorAll('.charter-section');
    const navLinks = document.querySelectorAll('.charter-nav a');
    
    function highlightSection() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 150 && 
                window.scrollY < sectionTop + sectionHeight - 150) {
                currentSection = '#' + section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightSection);
}

// Обработчик кнопки присоединения
function setupJoinButton() {
    const joinBtn = document.querySelector('.join-server-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', function() {
            alert('Подключение к серверу...\nIP: imperial-forces.com:27015');
        });
    }
}

// Добавление функционала поиска
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск по уставу...';
    searchInput.className = 'search-input';
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.appendChild(searchInput);
    
    document.querySelector('.content-header').appendChild(searchContainer);
    
    // Добавление стилей для поиска
    const searchStyle = document.createElement('style');
    searchStyle.textContent = `
        .search-container {
            margin: 20px auto 0;
            max-width: 400px;
        }
        
        .search-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(30, 35, 70, 0.8);
            border: 1px solid #3a5a8a;
            border-radius: 6px;
            color: #e0e0e0;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #4bd5ee;
            box-shadow: 0 0 10px rgba(75, 213, 238, 0.3);
        }
        
        .search-input::placeholder {
            color: #8a9ba8;
        }
        
        .search-highlight {
            background: rgba(255, 193, 7, 0.3);
            padding: 2px 4px;
            border-radius: 2px;
        }
    `;
    document.head.appendChild(searchStyle);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Убираем предыдущие подсветки
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        if (searchTerm.length > 2) {
            const sections = document.querySelectorAll('.charter-section');
            let found = false;
            
            sections.forEach(section => {
                const text = section.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    found = true;
                    highlightText(section, searchTerm);
                }
            });
            
            if (!found) {
                // Можно добавить уведомление, что ничего не найдено
            }
        }
    });
}

// Функция подсветки текста
function highlightText(element, searchTerm) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.textContent.toLowerCase().includes(searchTerm)) {
            nodes.push(node);
        }
    }
    
    nodes.forEach(node => {
        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = node.textContent;
        node.parentNode.replaceChild(span, node);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    setupSmoothScroll();
    setupSectionHighlights();
    setupJoinButton();
    setupSearch();
    
    // Обновляем счетчик игроков каждые 30 секунд
    setInterval(updateOnlinePlayers, 30000);
    
    // Первое обновление через 5 секунд после загрузки
    setTimeout(updateOnlinePlayers, 5000);
});

// Дополнительные функции
function printCharter() {
    window.print();
}

function shareCharter() {
    if (navigator.share) {
        navigator.share({
            title: 'Устав Великой Армии Республики',
            text: 'Официальный устав сервера Star Wars GMod',
            url: window.location.href
        });
    } else {
        alert('Скопируйте ссылку для分享: ' + window.location.href);
    }
}