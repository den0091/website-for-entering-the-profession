/**
 * DroneTech Lab - JavaScript для односторінкового сайту
 * 
 * Цей файл містить всю інтерактивну функціональність сайту:
 * - Плавна навігація
 * - Анімації при скролі
 * - Робота з формою
 * - Сповіщення
 * - Адаптивна поведінка
 */

// Конфігурація програми - централізоване зберігання налаштувань
const CONFIG = {
    scrollThreshold: 100,        // Відступ для приховування шапки
    throttleDelay: 100,          // Затримка для обмеження частоти викликів
    animationOffset: 50,         // Відступ для анімацій при скролі
    surveyToggleSpeed: 500,      // Швидкість анімації форми
    notificationDuration: 5000   // Час показу сповіщень
};

// Стан програми - відстежує поточний стан інтерактивних елементів
const appState = {
    lastScrollPosition: 0,       // Остання позиція скролу
    isScrollThrottled: false,    // Чи обмежена частота оновлень скролу
    isSurveyVisible: false,      // Чи відкрита форма запису
    intersectionObserver: null,  // Спостерігач для анімацій
    formSubmissionInProgress: false, // Чи відбувається відправка форми
    currentSection: 'home'       // Поточна активна секція
};

/**
 * ГОЛОВНА ФУНКЦІЯ ІНІЦІАЛІЗАЦІЇ
 * Викликається при завантаженні сторінки та ініціалізує всі модулі
 */
function initializeApplication() {
    console.log('🚀 Ініціалізація DroneTech Lab вебсайту...');

    // Ініціалізація всіх модулів
    initializeHeaderBehavior();          // Поведінка шапки
    initializeScrollAnimations();        // Анімації при скролі
    initializeSmoothScrolling();         // Плавна прокрутка
    initializeSurveyFunctionality();     // Функціонал форми
    initializeFormHandling();            // Обробка форми
    initializeTableInteractions();       // Взаємодія з таблицею
    initializeFeatureCards();            // Анімації карток
    initializeErrorHandling();           // Обробка помилок
    initializePerformanceOptimizations(); // Оптимізації
    initializeHeroButton();              // Кнопка в герой-секції

    // Перевірка повідомлень про успіх (для PHP)
    setTimeout(checkForSuccessMessage, 1000);

    console.log('✅ DroneTech Lab - вебсайт успішно завантажено та ініціалізовано');
}

/**
 * ІНІЦІАЛІЗАЦІЯ КНОПКИ ГЕРОЯ
 * Додає обробник кліку для головної кнопки "Почати навчання"
 */
function initializeHeroButton() {
    const heroButton = document.getElementById('heroButton');
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            // Прокручуємо до секції курсів при кліку
            const coursesSection = document.getElementById('courses');
            if (coursesSection) {
                const headerHeight = document.getElementById('mainHeader').offsetHeight;
                const targetPosition = coursesSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

/**
 * ПЕРЕВІРКА ПОВІДОМЛЕНЬ ПРО УСПІХ
 * Перевіряє чи є повідомлення про успішну відправку форми
 */
function checkForSuccessMessage() {
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        // Прокручуємо до повідомлення
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Автоматично ховаємо через 8 секунд
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (successMessage.parentNode) {
                        successMessage.remove();
                    }
                }, 500);
            }
        }, 8000);
    }
}

/**
 * МОДУЛЬ УПРАВЛІННЯ ШАПКОЮ ТА АКТИВНИМИ ПОСИЛАННЯМИ
 * Відповідає за:
 * - Приховування шапки при скролі вниз
 * - Оновлення активних посилань при скролі
 * - Плавну навігацію по секціям
 */
function initializeHeaderBehavior() {
    const headerElement = document.getElementById('mainHeader');
    const navLinks = document.querySelectorAll('.header__link');

    if (!headerElement) {
        console.warn('⚠️ Header element not found');
        return;
    }

    /**
     * ОНОВЛЕННЯ АКТИВНИХ ПОСИЛАНЬ ПРИ СКРОЛІ
     * Визначає поточну секцію та підсвічує відповідне посилання
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section, .window');
        const scrollPos = window.pageYOffset + 100; // Невеликий відступ

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            // Перевіряємо чи поточна позиція скролу знаходиться в межах секції
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        appState.currentSection = sectionId;
                    }
                });
            }
        });
    }

    /**
     * ОБРОБКА ПОДІЇ СКРОЛУ
     * Відповідає за приховування/показ шапки та оновлення навігації
     */
    function handleScrollEvent() {
        if (appState.isScrollThrottled) return;

        const currentScrollPosition = window.pageYOffset;
        const scrollDirection = currentScrollPosition > appState.lastScrollPosition;

        // Приховуємо шапку при скролі вниз, показуємо при скролі вгору
        if (scrollDirection && currentScrollPosition > CONFIG.scrollThreshold) {
            headerElement.classList.add('hidden');
        } else {
            headerElement.classList.remove('hidden');
        }

        appState.lastScrollPosition = currentScrollPosition;
        appState.isScrollThrottled = true;

        // Оновлюємо активні посилання
        updateActiveNavLink();

        // Скидаємо прапорець тротлінгу після затримки
        setTimeout(() => {
            appState.isScrollThrottled = false;
        }, CONFIG.throttleDelay);
    }

    // Оптимізація скролу з requestAnimationFrame
    let ticking = false;
    function updateHeader() {
        handleScrollEvent();
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    // Додаємо обробник скролу
    window.addEventListener('scroll', requestTick, { passive: true });

    /**
     * ОБРОБНИК КЛІКУ ПО НАВІГАЦІЙНИМ ПОСИЛАННЯМ
     * Забезпечує плавну прокрутку до секцій
     */
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Запобігає стандартній поведінці
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = headerElement.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;

                // Плавна прокрутка
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Оновлюємо активний стан
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
                appState.currentSection = targetId;
            }
        });
    });
}

/**
 * МОДУЛЬ АНІМАЦІЙ ПРИ СКРОЛІ
 * Використовує Intersection Observer для анімації елементів при їх появі в області видимості
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,          // Елемент вважається видимим при 10% попаданні
        rootMargin: `0px 0px -${CONFIG.animationOffset}px 0px` // Відступ знизу
    };

    // Створюємо спостерігач для анімацій
    appState.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Анімуємо елемент при його появі
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Додаткові анімації для різних типів елементів
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.transition = 'all 0.6s ease 0.1s';
                } else if (entry.target.classList.contains('window')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                    entry.target.style.transition = `all 0.6s ease ${delay}s`;
                }
            }
        });
    }, observerOptions);

    // Знаходимо всі елементи, які потрібно анімувати
    const animatedElements = document.querySelectorAll('.window, .feature-card, .hero-content');

    animatedElements.forEach((element) => {
        // Встановлюємо початковий стан для анімації
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Додаємо елемент до спостерігача
        appState.intersectionObserver.observe(element);
    });
}

/**
 * МОДУЛЬ ПЛАВНОЇ ПРОКРУТКИ
 * (Вже реалізовано в initializeHeaderBehavior)
 */
function initializeSmoothScrolling() {
    // Функціональність вже реалізована в initializeHeaderBehavior
}

/**
 * МОДУЛЬ ФУНКЦІОНАЛУ ОПИТУВАННЯ
 * Відповідає за показ/приховування форми запису
 */
function initializeSurveyFunctionality() {
    const surveyToggleButton = document.getElementById('surveyToggle');
    const surveySection = document.getElementById('surveySection');

    if (!surveyToggleButton || !surveySection) {
        console.warn('⚠️ Survey elements not found');
        return;
    }

    /**
     * ПЕРЕМИКАННЯ ВИДИМОСТІ ФОРМИ
     * Показує або ховає форму запису з анімацією
     */
    function toggleSurveyVisibility() {
        if (appState.formSubmissionInProgress) return;

        appState.isSurveyVisible = !appState.isSurveyVisible;

        if (appState.isSurveyVisible) {
            // ПОКАЗ ФОРМИ
            surveySection.style.display = 'block';
            
            // Анімація появи
            requestAnimationFrame(() => {
                surveySection.classList.add('show');
                surveyToggleButton.textContent = 'Приховати форму';
                surveyToggleButton.classList.add('active');
            });

            // Прокрутка до форми
            const headerElement = document.getElementById('mainHeader');
            const headerHeight = headerElement ? headerElement.offsetHeight : 0;
            const surveyPosition = surveySection.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: surveyPosition,
                behavior: 'smooth'
            });

            // Фокус на першому полі форми
            setTimeout(() => {
                const firstInput = surveySection.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            }, 600);

        } else {
            // ПРИХОВУВАННЯ ФОРМИ
            surveySection.classList.remove('show');
            surveyToggleButton.classList.remove('active');

            setTimeout(() => {
                surveySection.style.display = 'none';
                surveyToggleButton.textContent = 'Записатися на курс';
            }, CONFIG.surveyToggleSpeed);
        }
    }

    // Обробник кліку по кнопці перемикача
    surveyToggleButton.addEventListener('click', toggleSurveyVisibility);

    // Закриття форми по кліку поза нею
    document.addEventListener('click', (e) => {
        if (appState.isSurveyVisible &&
            surveySection &&
            !surveySection.contains(e.target) &&
            e.target !== surveyToggleButton &&
            !surveyToggleButton.contains(e.target)) {
            toggleSurveyVisibility();
        }
    });

    // Закриття форми по клавіші ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && appState.isSurveyVisible) {
            toggleSurveyVisibility();
        }
    });
}

/**
 * МОДУЛЬ ОБРОБКИ ФОРМИ
 * Відповідає за валідацію та відправку форми
 */
function initializeFormHandling() {
    const surveyForm = document.getElementById('surveyForm');

    if (!surveyForm) {
        console.warn('⚠️ Survey form not found');
        return;
    }

    // ОБМЕЖЕННЯ КІЛЬКОСТІ ОБРАНИХ ЧЕКБОКСІВ (до 3)
    const checkboxes = document.querySelectorAll('input[name="favoriteAspects[]"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('input[name="favoriteAspects[]"]:checked');
            if (checkedBoxes.length > 3) {
                this.checked = false;
                showNotification('Можна вибрати не більше трьох напрямків', 'warning');

                // Анімація відхилення
                this.parentElement.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    this.parentElement.style.transform = 'translateX(0)';
                }, 300);
            }
        });
    });

    // ПOKРАЩЕНА ВАЛІДАЦІЯ В РЕАЛЬНОМУ ЧАСІ
    const formInputs = surveyForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Валідація при втраті фокусу
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Очищення помилок при введенні
        input.addEventListener('input', function() {
            clearFieldError(this);
            
            // Візуальний індикатор валідності
            if (this.checkValidity()) {
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
            }
        });
    });

    /**
     * ВАЛІДАЦІЯ ОКРЕМОГО ПОЛЯ
     * Перевіряє коректність введених даних
     */
    function validateField(field) {
        const value = field.value.trim();

        switch(field.type) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    showFieldError(field, 'Будь ласка, введіть коректну email адресу');
                    return false;
                }
                break;

            case 'text':
                if (field.required && !value) {
                    showFieldError(field, 'Це поле обов\'язкове для заповнення');
                    return false;
                } else if (field.id === 'playerName' && value.length < 2) {
                    showFieldError(field, 'Ім\'я повинно містити принаймні 2 символи');
                    return false;
                }
                break;

            case 'select-one':
                if (field.required && !value) {
                    showFieldError(field, 'Будь ласка, оберіть значення');
                    return false;
                }
                break;
        }

        clearFieldError(field);
        return true;
    }

    // ВАЛІДАЦІЯ ВСІЄЇ ФОРМИ ПЕРЕД ВІДПРАВКОЮ
    surveyForm.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault(); // Запобігає відправці форми
            showNotification('Будь ласка, виправте помилки в формі', 'error');

            // Прокручуємо до першої помилки
            const firstError = surveyForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    /**
     * ВАЛІДАЦІЯ ВСІЄЇ ФОРМИ
     * Перевіряє всі обов'язкові поля форми
     */
    function validateForm() {
        let isValid = true;
        const playerName = document.getElementById('playerName');
        const playerEmail = document.getElementById('playerEmail');
        const playerAge = document.getElementById('playerAge');
        const gameRating = document.querySelector('input[name="gameRating"]:checked');
        const playtime = document.getElementById('playtime');

        // ВАЛІДАЦІЯ ІМЕНІ
        if (!playerName.value.trim()) {
            showFieldError(playerName, 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        } else if (playerName.value.trim().length < 2) {
            showFieldError(playerName, 'Ім\'я повинно містити принаймні 2 символи');
            isValid = false;
        }

        // ВАЛІДАЦІЯ EMAIL
        if (!playerEmail.value.trim()) {
            showFieldError(playerEmail, 'Будь ласка, введіть email адресу');
            isValid = false;
        } else if (!isValidEmail(playerEmail.value.trim())) {
            showFieldError(playerEmail, 'Будь ласка, введіть коректну email адресу');
            isValid = false;
        }

        // ВАЛІДАЦІЯ ВІКУ
        if (!playerAge.value) {
            showFieldError(playerAge, 'Будь ласка, оберіть вікову категорію');
            isValid = false;
        }

        // ВАЛІДАЦІЯ РЕЙТИНГУ
        if (!gameRating) {
            showNotification('Будь ласка, оберіть ваш рівень досвіду', 'error');
            isValid = false;
        }

        // ВАЛІДАЦІЯ КУРСУ
        if (!playtime.value) {
            showFieldError(playtime, 'Будь ласка, оберіть бажаний курс');
            isValid = false;
        }

        return isValid;
    }

    // ДОПОМІЖНІ ФУНКЦІЇ ВАЛІДАЦІЇ

    /**
     * ПЕРЕВІРКА КОРЕКТНОСТІ EMAIL
     * Використовує регулярний вираз для перевірки формату email
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * ПОКАЗ ПОМИЛКИ ПОЛЯ
     * Додає повідомлення про помилку під полем
     */
    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        field.parentNode.appendChild(errorElement);
    }

    /**
     * ОЧИЩЕННЯ ПОМИЛКИ ПОЛЯ
     * Видаляє повідомлення про помилку
     */
    function clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

/**
 * МОДУЛЬ ВЗАЄМОДІЇ З ТАБЛИЦЕЮ
 * Додає інтерактивність до таблиці курсів
 */
function initializeTableInteractions() {
    const tableRows = document.querySelectorAll('.events-table tbody tr');

    tableRows.forEach(row => {
        // Обробник кліку по рядку таблиці
        row.addEventListener('click', function() {
            // Видаляємо активний стан з усіх рядків
            tableRows.forEach(r => r.classList.remove('active'));

            // Додаємо активний стан до поточного рядка
            this.classList.add('active');

            // Отримуємо дані з рядка
            const cells = this.querySelectorAll('td');
            const eventData = {
                date: cells[0].textContent,
                event: cells[1].textContent,
                description: cells[2].textContent,
                level: cells[3].textContent
            };

            // Показуємо деталі події
            showEventDetails(eventData);
        });

        // Ефект при наведенні
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });

        row.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
            }
        });
    });
}

/**
 * ПОКАЗ ДЕТАЛЕЙ ПОДІЇ
 * Створює сповіщення з детальною інформацією про подію
 */
function showEventDetails(eventData) {
    const notificationMessage = `
        🗓️ <strong>${eventData.event}</strong><br>
        📅 Дата: ${eventData.date}<br>
        📝 ${eventData.description}<br>
        🎯 Рівень: ${eventData.level}
    `;

    showNotification(notificationMessage, 'info');
}

/**
 * МОДУЛЬ КАРТОК ОСОБЛИВОСТЕЙ
 * Додає інтерактивність до карток напрямків діяльності
 */
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        // Ефект при наведенні
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0, 153, 255, 0.3)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });

        // Показ деталей при кліку
        card.addEventListener('click', function() {
            const title = this.querySelector('.feature-card__title').textContent;
            const description = this.querySelector('.feature-card__description').textContent;

            showNotification(`<strong>${title}</strong><br>${description}`, 'info');
        });
    });
}

/**
 * МОДУЛЬ СИСТЕМИ СПОВІЩЕНЬ
 * Створює красиві сповіщення для різних типів повідомлень
 */
function showNotification(message, type = 'info') {
    // Видаляємо старі сповіщення
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notification => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    // Створюємо нове сповіщення
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;

    // Визначаємо колір та іконку залежно від типу
    let backgroundColor, icon;
    switch(type) {
        case 'success':
            backgroundColor = 'rgba(0, 204, 102, 0.95)';
            icon = '✅';
            break;
        case 'error':
            backgroundColor = 'rgba(244, 67, 54, 0.95)';
            icon = '❌';
            break;
        case 'warning':
            backgroundColor = 'rgba(255, 152, 0, 0.95)';
            icon = '⚠️';
            break;
        case 'info':
            backgroundColor = 'rgba(0, 153, 255, 0.95)';
            icon = 'ℹ️';
            break;
        default:
            backgroundColor = 'rgba(0, 153, 255, 0.95)';
            icon = '🚁';
    }

    // HTML для сповіщення
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Закрити">&times;</button>
        </div>
    `;

    // Стилі для сповіщення
    notification.style.cssText = `
        position: fixed;
        top: 140px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Tech Font', monospace;
        max-width: 350px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    // Додаємо стилі для вмісту сповіщення
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }
        .notification-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
            margin-top: 0.1rem;
        }
        .notification-message {
            flex: 1;
            line-height: 1.5;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
            flex-shrink: 0;
        }
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Анімація появи
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Обробник закриття
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    // Автоматичне закриття
    const autoCloseTimeout = setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, CONFIG.notificationDuration);

    // Зупинка автоматичного закриття при наведенні
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoCloseTimeout);
    });

    notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 1000);
    });
}

/**
 * МОДУЛЬ ОПТИМІЗАЦІЇ ПРОДУКТИВНОСТІ
 * Додає оптимізації для покращення продуктивності
 */
function initializePerformanceOptimizations() {
    // Відкладаємо завантаження некритичних ресурсів
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            console.log('🔄 Завантаження додаткових ресурсів...');
        });
    }

    // Вимкнення анімацій для користувачів, які вказують на зменшення руху
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-slow', 'none');
    }
}

/**
 * МОДУЛЬ ОБРОБКИ ПОМИЛОК
 * Перехоплює та обробляє помилки JavaScript
 */
function initializeErrorHandling() {
    // Глобальна обробка помилок виконання
    window.addEventListener('error', function(event) {
        console.error('❌ Сталася помилка виконання:', event.error);
        showNotification('Сталася несподівана помилка. Будь ласка, оновіть сторінку.', 'error');
    });

    // Обробка невдалих промісів
    window.addEventListener('unhandledrejection', function(event) {
        console.error('❌ Необроблена проміс-помилка:', event.reason);
        showNotification('Сталася помилка при виконанні операції.', 'error');
    });

    // Обробка помилок завантаження зображень
    document.addEventListener('error', function(event) {
        if (event.target.tagName === 'IMG') {
            console.warn('⚠️ Не вдалося завантажити зображення:', event.target.src);
            event.target.style.opacity = '0.5'; // Показуємо, що зображення не завантажилось
        }
    }, true);
}

/**
 * ДОДАТКОВІ УТІЛІТИ
 */

/**
 * ФУНКЦІЯ THROTTLE - обмеження частоти викликів
 * Запобігає надмірному виклику функції при швидких подіях (наприклад, скрол)
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * ФУНКЦІЯ DEBOUNCE - запобігання багаторазовому виконанню
 * Відкладає виконання функції до тих пір, поки не минув певний час без нових викликів
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ЗАПУСК ПРОГРАМИ
// Чекаємо повного завантаження DOM перед ініціалізацією
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

// ЕКСПОРТ ДЛЯ ГЛОБАЛЬНОГО ВИКОРИСТАННЯ
// Робимо основні функції доступними зовні (для консолі розробника)
window.DroneTechApp = {
    showNotification,
    initializeApplication,
    config: CONFIG
};
