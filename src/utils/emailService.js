import emailjs from 'emailjs-com';

// Инициализация EmailJS
emailjs.init("W3bvjuiX0qzwtRVBw");

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

    // ✅ ПРАВИЛЬНЫЙ Template ID
    emailjs.sendForm(
      'service_pologenki',   // Service ID
      'template_kdxvd83',    // ✅ Template ID из вашего скриншота
      form
    )
    .then((result) => {
      console.log('✅ Email sent successfully!', result);
      alert('✅ Message sent successfully!');
      form.reset();
    })
    .catch((error) => {
      console.error('❌ EmailJS error:', error);
      alert('❌ Error: ' + error.text);
    })
    .finally(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  });
}