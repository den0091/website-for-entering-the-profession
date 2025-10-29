/**
 * DroneTech Lab - JavaScript для односторінкового сайту
 */

// Конфігурація програми
const CONFIG = {
    scrollThreshold: 100,
    throttleDelay: 100,
    animationOffset: 50,
    surveyToggleSpeed: 500,
    notificationDuration: 5000
};

// Стан програми
const appState = {
    lastScrollPosition: 0,
    isScrollThrottled: false,
    isSurveyVisible: false,
    intersectionObserver: null,
    formSubmissionInProgress: false,
    currentSection: 'home'
};

/**
 * Головна функція ініціалізації
 */
function initializeApplication() {
    console.log('🚀 Ініціалізація DroneTech Lab вебсайту...');

    initializeHeaderBehavior();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeSurveyFunctionality();
    initializeFormHandling();
    initializeTableInteractions();
    initializeFeatureCards();
    initializeErrorHandling();
    initializePerformanceOptimizations();
    initializeHeroButton();

    // Автоматично показуємо опитування якщо є повідомлення про успіх
    setTimeout(checkForSuccessMessage, 1000);

    console.log('✅ DroneTech Lab - вебсайт успішно завантажено та ініціалізовано');
}

/**
 * Ініціалізація кнопки героя
 */
function initializeHeroButton() {
    const heroButton = document.getElementById('heroButton');
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            // Прокручуємо до секції курсів
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
 * Перевіряємо чи є повідомлення про успішну відправку
 */
function checkForSuccessMessage() {
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
 * Модуль управління шапкою та активними посиланнями
 */
function initializeHeaderBehavior() {
    const headerElement = document.getElementById('mainHeader');
    const navLinks = document.querySelectorAll('.header__link');

    if (!headerElement) {
        console.warn('⚠️ Header element not found');
        return;
    }

    // Оновлення активних посилань при скролі
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section, .window');
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

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

    function handleScrollEvent() {
        if (appState.isScrollThrottled) return;

        const currentScrollPosition = window.pageYOffset;
        const scrollDirection = currentScrollPosition > appState.lastScrollPosition;

        if (scrollDirection && currentScrollPosition > CONFIG.scrollThreshold) {
            headerElement.classList.add('hidden');
        } else {
            headerElement.classList.remove('hidden');
        }

        appState.lastScrollPosition = currentScrollPosition;
        appState.isScrollThrottled = true;

        // Оновлюємо активні посилання
        updateActiveNavLink();

        setTimeout(() => {
            appState.isScrollThrottled = false;
        }, CONFIG.throttleDelay);
    }

    // Покращена обробка скролу
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

    window.addEventListener('scroll', requestTick, { passive: true });

    // Обробник кліку по навігаційним посиланням
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerHeight = headerElement.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;

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
 * Модуль анімацій при скролі
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: `0px 0px -${CONFIG.animationOffset}px 0px`
    };

    appState.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.transition = 'all 0.6s ease 0.1s';
                } else if (entry.target.classList.contains('window')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                    entry.target.style.transition = `all 0.6s ease ${delay}s`;
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.window, .feature-card, .hero-content');

    animatedElements.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        appState.intersectionObserver.observe(element);
    });
}

/**
 * Модуль плавної прокрутки
 */
function initializeSmoothScrolling() {
    // Вже реалізовано в initializeHeaderBehavior
}

/**
 * Модуль функціоналу опитування
 */
function initializeSurveyFunctionality() {
    const surveyToggleButton = document.getElementById('surveyToggle');
    const surveySection = document.getElementById('surveySection');

    if (!surveyToggleButton || !surveySection) {
        console.warn('⚠️ Survey elements not found');
        return;
    }

    function toggleSurveyVisibility() {
        if (appState.formSubmissionInProgress) return;

        appState.isSurveyVisible = !appState.isSurveyVisible;

        if (appState.isSurveyVisible) {
            surveySection.style.display = 'block';
            requestAnimationFrame(() => {
                surveySection.classList.add('show');
                surveyToggleButton.textContent = 'Приховати форму';
                surveyToggleButton.classList.add('active');
            });

            const headerElement = document.getElementById('mainHeader');
            const headerHeight = headerElement ? headerElement.offsetHeight : 0;
            const surveyPosition = surveySection.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: surveyPosition,
                behavior: 'smooth'
            });

            setTimeout(() => {
                const firstInput = surveySection.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            }, 600);

        } else {
            surveySection.classList.remove('show');
            surveyToggleButton.classList.remove('active');

            setTimeout(() => {
                surveySection.style.display = 'none';
                surveyToggleButton.textContent = 'Записатися на курс';
            }, CONFIG.surveyToggleSpeed);
        }
    }

    surveyToggleButton.addEventListener('click', toggleSurveyVisibility);

    document.addEventListener('click', (e) => {
        if (appState.isSurveyVisible &&
            surveySection &&
            !surveySection.contains(e.target) &&
            e.target !== surveyToggleButton &&
            !surveyToggleButton.contains(e.target)) {
            toggleSurveyVisibility();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && appState.isSurveyVisible) {
            toggleSurveyVisibility();
        }
    });
}

/**
 * Модуль обробки форми
 */
function initializeFormHandling() {
    const surveyForm = document.getElementById('surveyForm');

    if (!surveyForm) {
        console.warn('⚠️ Survey form not found');
        return;
    }

    const checkboxes = document.querySelectorAll('input[name="favoriteAspects[]"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('input[name="favoriteAspects[]"]:checked');
            if (checkedBoxes.length > 3) {
                this.checked = false;
                showNotification('Можна вибрати не більше трьох напрямків', 'warning');
                this.parentElement.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    this.parentElement.style.transform = 'translateX(0)';
                }, 300);
            }
        });
    });

    const formInputs = surveyForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
            if (this.checkValidity()) {
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
            }
        });
    });

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

    surveyForm.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            showNotification('Будь ласка, виправте помилки в формі', 'error');

            const firstError = surveyForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    function validateForm() {
        let isValid = true;
        const playerName = document.getElementById('playerName');
        const playerEmail = document.getElementById('playerEmail');
        const playerAge = document.getElementById('playerAge');
        const gameRating = document.querySelector('input[name="gameRating"]:checked');
        const playtime = document.getElementById('playtime');

        if (!playerName.value.trim()) {
            showFieldError(playerName, 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        } else if (playerName.value.trim().length < 2) {
            showFieldError(playerName, 'Ім\'я повинно містити принаймні 2 символи');
            isValid = false;
        }

        if (!playerEmail.value.trim()) {
            showFieldError(playerEmail, 'Будь ласка, введіть email адресу');
            isValid = false;
        } else if (!isValidEmail(playerEmail.value.trim())) {
            showFieldError(playerEmail, 'Будь ласка, введіть коректну email адресу');
            isValid = false;
        }

        if (!playerAge.value) {
            showFieldError(playerAge, 'Будь ласка, оберіть вікову категорію');
            isValid = false;
        }

        if (!gameRating) {
            showNotification('Будь ласка, оберіть ваш рівень досвіду', 'error');
            isValid = false;
        }

        if (!playtime.value) {
            showFieldError(playtime, 'Будь ласка, оберіть бажаний курс');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        field.parentNode.appendChild(errorElement);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

/**
 * Модуль взаємодії з таблицею
 */
function initializeTableInteractions() {
    const tableRows = document.querySelectorAll('.events-table tbody tr');

    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            tableRows.forEach(r => r.classList.remove('active'));
            this.classList.add('active');

            const cells = this.querySelectorAll('td');
            const eventData = {
                date: cells[0].textContent,
                event: cells[1].textContent,
                description: cells[2].textContent,
                level: cells[3].textContent
            };

            showEventDetails(eventData);
        });

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
 * Показ деталей події
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
 * Модуль карток особливостей
 */
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0, 153, 255, 0.3)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });

        card.addEventListener('click', function() {
            const title = this.querySelector('.feature-card__title').textContent;
            const description = this.querySelector('.feature-card__description').textContent;

            showNotification(`<strong>${title}</strong><br>${description}`, 'info');
        });
    });
}

/**
 * Модуль системи сповіщень
 */
function showNotification(message, type = 'info') {
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notification => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;

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

    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Закрити">&times;</button>
        </div>
    `;

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

    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

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
 * Модуль оптимізації продуктивності
 */
function initializePerformanceOptimizations() {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            console.log('🔄 Завантаження додаткових ресурсів...');
        });
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-slow', 'none');
    }
}

/**
 * Модуль обробки помилок
 */
function initializeErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('❌ Сталася помилка виконання:', event.error);
        showNotification('Сталася несподівана помилка. Будь ласка, оновіть сторінку.', 'error');
    });

    window.addEventListener('unhandledrejection', function(event) {
        console.error('❌ Необроблена проміс-помилка:', event.reason);
        showNotification('Сталася помилка при виконанні операції.', 'error');
    });

    document.addEventListener('error', function(event) {
        if (event.target.tagName === 'IMG') {
            console.warn('⚠️ Не вдалося завантажити зображення:', event.target.src);
            event.target.style.opacity = '0.5';
        }
    }, true);
}

/**
 * Додаткові утиліти
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

// Запуск програми
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

// Експорт для глобального використання
window.DroneTechApp = {
    showNotification,
    initializeApplication,
    config: CONFIG
};