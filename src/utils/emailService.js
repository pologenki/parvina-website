export function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) {
    console.log('❌ Contact form not found');
    return;
  }

  console.log('✅ Contact form found, initializing...');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('📤 Form submitted!');
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    
    const templateParams = {
      name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('user_email'),
      message: formData.get('message')
    };

    console.log('📧 Template params:', templateParams);

    // Проверка полей
    if (!templateParams.name || !templateParams.email || !templateParams.message) {
      showCustomAlert('error', 'Please fill all required fields');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    console.log('🚀 All fields valid, sending email...');

    emailjs.send(
      'service_lp5v94l',
      'template_8tkd7hk', 
      templateParams
    )
    .then((result) => {
      console.log('✅ Email sent successfully!', result);
      showCustomAlert('success', 'Your message has been sent successfully! We will contact you shortly.');
      form.reset();
    })
    .catch((error) => {
      console.error('❌ EmailJS error:', error);
      showCustomAlert('error', 'Failed to send message. Please try again later.');
    })
    .finally(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  });
}

// Функция для красивого алерта
function showCustomAlert(type, message) {
  // Создаем элемент алерта
  const alert = document.createElement('div');
  alert.className = `custom-alert custom-alert-${type}`;
  
  const icon = type === 'success' ? '✅' : '❌';
  
  alert.innerHTML = `
    <div class="custom-alert-content">
      <span class="custom-alert-icon">${icon}</span>
      <span class="custom-alert-message">${message}</span>
      <button class="custom-alert-close">&times;</button>
    </div>
  `;
  
  // Добавляем стили
  if (!document.querySelector('#custom-alert-styles')) {
    const styles = document.createElement('style');
    styles.id = 'custom-alert-styles';
    styles.textContent = `
      .custom-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
      }
      
      .custom-alert-content {
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        border-left: 4px solid;
      }
      
      .custom-alert-success .custom-alert-content {
        border-left-color: #10b981;
        background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
      }
      
      .custom-alert-error .custom-alert-content {
        border-left-color: #ef4444;
        background: linear-gradient(135deg, #fef2f2, #fef2f2);
      }
      
      .custom-alert-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }
      
      .custom-alert-message {
        flex: 1;
        color: #1f2937;
        font-weight: 500;
        font-size: 0.95rem;
        line-height: 1.4;
      }
      
      .custom-alert-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
      }
      
      .custom-alert-close:hover {
        background: rgba(0,0,0,0.1);
        color: #374151;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .custom-alert.hiding {
        animation: slideOutRight 0.3s ease-in forwards;
      }
    `;
    document.head.appendChild(styles);
  }
  
  // Добавляем в body
  document.body.appendChild(alert);
  
  // Функция закрытия
  const closeAlert = () => {
    alert.classList.add('hiding');
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 300);
  };
  
  // Закрытие по кнопке
  alert.querySelector('.custom-alert-close').addEventListener('click', closeAlert);
  
  // Автоматическое закрытие через 5 секунд
  setTimeout(closeAlert, 5000);
}