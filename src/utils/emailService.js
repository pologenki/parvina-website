import { contactCopy } from '../components/contact.js';
import { getCurrentLanguage } from './i18n.js';

let disposeForm = () => {};

export function initContactForm() {
  disposeForm();
  const form = document.getElementById('contact-form');
  if (!form) return;
  const copy = contactCopy[getCurrentLanguage()] || contactCopy.en;
  const controller = new AbortController();
  const events = { signal: controller.signal };
  const fields = [...form.querySelectorAll('input, textarea')];
  const button = form.querySelector('button[type="submit"]');
  const label = button.querySelector('[data-contact-submit-label]');
  const status = form.querySelector('.pc-form-status');
  let submitting = false;
  let attempted = false;

  function setStatus(message = '', state = '') {
    status.textContent = message;
    status.dataset.state = state;
  }

  function validate(field) {
    const value = field.value.trim();
    const error = field.required && !value ? copy.required
      : field.type === 'email' && value && (field.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ? copy.invalidEmail : '';
    field.setAttribute('aria-invalid', String(Boolean(error)));
    form.querySelector(`#${field.id}-error`).textContent = error;
    return !error;
  }

  fields.forEach(field => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
      if (!submitting) setStatus();
    }, events);
    field.addEventListener('blur', () => {
      if (attempted || field.value.trim()) validate(field);
    }, events);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    attempted = true;
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length) {
      setStatus(copy.check, 'error');
      invalid[0].focus();
      return;
    }
    if (typeof window.emailjs?.send !== 'function') {
      setStatus(copy.unavailable, 'error');
      return;
    }
    const data = new FormData(form);
    const params = {
      name: data.get('first_name').trim(),
      last_name: data.get('last_name').trim(),
      email: data.get('user_email').trim(),
      message: data.get('message').trim(),
    };
    submitting = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = copy.sending;
    setStatus();
    try {
      // Keep the existing EmailJS service and template contract.
      await window.emailjs.send('service_bz33zpg', 'template_8tkd7hk', params);
      if (controller.signal.aborted || !form.isConnected) return;
      form.reset();
      attempted = false;
      fields.forEach(field => field.removeAttribute('aria-invalid'));
      setStatus(copy.success, 'success');
    } catch {
      if (controller.signal.aborted || !form.isConnected) return;
      // Preserve the message and allow retrying after an actual service failure.
      setStatus(copy.failed, 'error');
    } finally {
      if (!controller.signal.aborted && form.isConnected) {
        submitting = false;
        button.disabled = false;
        form.removeAttribute('aria-busy');
        label.textContent = copy.submit;
      }
    }
  }, events);
  disposeForm = () => controller.abort();
}
