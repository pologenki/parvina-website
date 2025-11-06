export function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) {
    console.log('❌ Contact form not found');
    return;
  }

  console.log('✅ Contact form found, initializing...');

  // Добавляем кастомные сообщения об ошибках для каждого поля
  const fields = form.querySelectorAll('input[required], textarea[required]');
  
  fields.forEach(field => {
    // Убираем стандартное сообщение
    field.addEventListener('invalid', function(e) {
      e.preventDefault();
      
      let message = '';
      switch(this.type) {
        case 'email':
          message = 'Please enter a valid email address';
          break;
        default:
          message = 'This field is required';
      }
      
      showCustomAlert('error', message);
      
      // Добавляем визуальное выделение невалидного поля
      this.style.borderColor = '#ef4444';
      this.style.backgroundColor = '#fef2f2';
      
      // Убираем выделение при исправлении
      this.addEventListener('input', function() {
        this.style.borderColor = '';
        this.style.backgroundColor = '';
      }, { once: true });
    });
  });

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

    // Кастомная валидация вместо стандартной
    let isValid = true;
    let errorMessage = '';

    if (!templateParams.name || !templateParams.name.trim()) {
      isValid = false;
      errorMessage = 'First name is required';
      form.querySelector('#firstName').style.borderColor = '#ef4444';
    }

    if (!templateParams.email || !templateParams.email.trim()) {
      isValid = false;
      errorMessage = 'Email is required';
      form.querySelector('#email').style.borderColor = '#ef4444';
    } else if (!isValidEmail(templateParams.email)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
      form.querySelector('#email').style.borderColor = '#ef4444';
    }

    if (!templateParams.message || !templateParams.message.trim()) {
      isValid = false;
      errorMessage = 'Message is required';
      form.querySelector('#message').style.borderColor = '#ef4444';
    }

    if (!isValid) {
      showCustomAlert('error', errorMessage);
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
      
      // Сбрасываем стили полей после успешной отправки
      fields.forEach(field => {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
      });
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

// Функция проверки email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Функция для красивого алерта (оставляем без изменений)
function showCustomAlert(type, message) {
  // ... ваш существующий код showCustomAlert ...
}