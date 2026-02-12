// sectionScript.js - ОПТИМИЗИРОВАННАЯ ВЕРСИЯ БЕЗ ДУБЛИРОВАНИЯ ОБРАБОТЧИКОВ
let isModalOpen = false;
let currentModal = null;
let eventListenersSet = false; // Флаг для отслеживания установки обработчиков

export function initSectionScript() {
    console.log('🎯 Модальные окна: оптимизированная версия');
    
    // Устанавливаем обработчики только один раз
    if (!eventListenersSet) {
        setupModalHandlers();
        eventListenersSet = true;
        console.log('✅ Обработчики установлены');
    } else {
        // Если обработчики уже были установлены, просто обновляем их
        updateModalHandlers();
        console.log('🔄 Обработчики обновлены');
    }
}

function setupModalHandlers() {
    console.log('🔄 Настройка обработчиков...');
    
    // Устанавливаем обработчики для карточек услуг
    document.querySelectorAll('.service-card').forEach(card => {
        // Удаляем существующий обработчик, если он есть
        card.removeEventListener('click', handleCardClick, false);
        // Добавляем новый обработчик
        card.addEventListener('click', handleCardClick, false);
    });
    
    // Устанавливаем обработчики для модальных окон
    document.querySelectorAll('.service-modal').forEach(modal => {
        setupModalCloseHandlers(modal);
    });
    
    // Устанавливаем глобальный обработчик Escape
    document.removeEventListener('keydown', handleEscape, false);
    document.addEventListener('keydown', handleEscape, false);
}

function updateModalHandlers() {
    // Обновляем обработчики без дублирования
    document.querySelectorAll('.service-card').forEach(card => {
        card.removeEventListener('click', handleCardClick, false);
        card.addEventListener('click', handleCardClick, false);
    });
}

function handleCardClick(e) {
    console.log('🖱️ Клик по карточке');
    
    // Закрываем предыдущее модальное окно если оно открыто
    closeCurrentModal();
    
    // Открываем новое
    const modalId = this.getAttribute('data-modal');
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            openModal(modal);
        } else {
            console.error('❌ Модальное окно не найдено:', modalId);
        }
    }
}

function setupModalCloseHandlers(modal) {
    // Кнопка закрытия
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        // Удаляем существующий обработчик
        closeBtn.removeEventListener('click', handleCloseClick, false);
        // Добавляем новый обработчик
        closeBtn.addEventListener('click', handleCloseClick, false);
    }
    
    // Удаляем существующий обработчик клика по фону
    modal.removeEventListener('click', handleModalBackgroundClick, false);
    // Добавляем новый обработчик клика по фону
    modal.addEventListener('click', handleModalBackgroundClick, false);
}

function handleCloseClick(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('❌ Закрытие по крестику');
    const modal = this.closest('.service-modal');
    closeModal(modal);
}

function handleModalBackgroundClick(e) {
    if (e.target === this) {
        console.log('🎯 Закрытие по фону');
        closeModal(this);
    }
}

function openModal(modal) {
    currentModal = modal;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    isModalOpen = true;
    
    console.log('✅ Открыто модальное окно:', modal.id);
    
    // Добавляем класс к body для стилизации
    document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    
    isModalOpen = false;
    currentModal = null;
    
    console.log('🔒 Модальное окно закрыто');
}

function closeCurrentModal() {
    if (isModalOpen && currentModal) {
        closeModal(currentModal);
    }
}

function handleEscape(e) {
    if (e.key === 'Escape' && isModalOpen && currentModal) {
        console.log('⎋ Escape нажата');
        closeModal(currentModal);
    }
}

// Экспортируем функции для глобального использования
export function openServiceModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        openModal(modal);
    }
}

export function closeServiceModal() {
    closeCurrentModal();
}

// Добавляем в глобальную область видимости для отладки
window.modalUtils = {
    open: openServiceModal,
    close: closeServiceModal,
    getCurrent: () => currentModal,
    isOpen: () => isModalOpen
};
