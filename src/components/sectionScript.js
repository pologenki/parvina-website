// sectionScript.js - ФИНАЛЬНАЯ ОПТИМИЗИРОВАННАЯ ВЕРСИЯ
let isModalOpen = false;
let currentModal = null;

export function initSectionScript() {
    console.log('🎯 Модальные окна: оптимизированная версия');
    
    // Очищаем старые обработчики и устанавливаем новые
    setupModalHandlers();
    
    // Также устанавливаем обработчики при изменении языка/рендере
    setupMutationObserver();
    
    console.log('✅ Модальные окна готовы');
}

function setupModalHandlers() {
    console.log('🔄 Настройка обработчиков...');
    
    document.querySelectorAll('.service-card').forEach(card => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);

        newCard.addEventListener('click', handleCardClick, false);
    });
    
    // 2. Обработчики для модальных окон
    document.querySelectorAll('.service-modal').forEach(modal => {
        setupModalCloseHandlers(modal);
    });
    
    // 3. Глобальный обработчик Escape
    document.addEventListener('keydown', handleEscape, false);
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
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        newCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('❌ Закрытие по крестику');
            closeModal(modal);
        }, false);
    }
    
    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            console.log('🎯 Закрытие по фону');
            closeModal(this);
        }
    }, false);
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

function setupMutationObserver() {
    // Отслеживаем изменения DOM для переинициализации
    const observer = new MutationObserver(function(mutations) {
        let shouldReinitialize = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                // Проверяем, были ли добавлены элементы, связанные с модальными окнами
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && 
                            (node.classList.contains('service-card') || 
                             node.classList.contains('service-modal') ||
                             node.querySelector('.service-card') || 
                             node.querySelector('.service-modal'))) {
                            shouldReinitialize = true;
                        }
                    }
                });
            }
        });
        
        if (shouldReinitialize) {
            console.log('🔄 DOM изменился, переинициализируем модальные окна');
            setTimeout(setupModalHandlers, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
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