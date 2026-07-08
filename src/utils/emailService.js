export function initContactForm() {
  const form = document.getElementById("contact-form");

  if (!form) return;

  const fields = form.querySelectorAll("input[required], textarea[required]");

  fields.forEach((field) => {
    field.addEventListener("invalid", function (e) {
      e.preventDefault();

      const message =
        this.type === "email"
          ? "Please enter a valid email address"
          : "This field is required";

      showCustomAlert("error", message);
      markFieldInvalid(this);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const templateParams = {
      name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("user_email"),
      message: formData.get("message"),
    };

    const validationError = validateForm(templateParams, form);
    if (validationError) {
      showCustomAlert("error", validationError);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    if (!window.emailjs || typeof window.emailjs.send !== "function") {
      showCustomAlert(
        "error",
        "Email service is still loading. Please try again in a moment.",
      );
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    window.emailjs
      .send("service_bz33zpg", "template_8tkd7hk", templateParams)
      .then(() => {
        showCustomAlert(
          "success",
          "Your message has been sent successfully! We will contact you shortly.",
        );
        form.reset();
        fields.forEach((field) => clearFieldInvalid(field));
      })
      .catch(() => {
        showCustomAlert(
          "error",
          "Failed to send message. Please try again later.",
        );
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  });
}

function validateForm(templateParams, form) {
  if (!templateParams.name || !templateParams.name.trim()) {
    markFieldInvalid(form.querySelector("#firstName"));
    return "First name is required";
  }

  if (!templateParams.email || !templateParams.email.trim()) {
    markFieldInvalid(form.querySelector("#email"));
    return "Email is required";
  }

  if (!isValidEmail(templateParams.email)) {
    markFieldInvalid(form.querySelector("#email"));
    return "Please enter a valid email address";
  }

  if (!templateParams.message || !templateParams.message.trim()) {
    markFieldInvalid(form.querySelector("#message"));
    return "Message is required";
  }

  return "";
}

function markFieldInvalid(field) {
  if (!field) return;

  field.style.borderColor = "#ef4444";
  field.style.backgroundColor = "#fef2f2";
  field.addEventListener("input", () => clearFieldInvalid(field), {
    once: true,
  });
}

function clearFieldInvalid(field) {
  field.style.borderColor = "";
  field.style.backgroundColor = "";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showCustomAlert(type, message) {
  let alert = document.querySelector(".contact-alert");

  if (!alert) {
    alert = document.createElement("div");
    alert.className = "contact-alert";
    alert.setAttribute("role", "status");
    alert.setAttribute("aria-live", "polite");
    document.body.appendChild(alert);
  }

  alert.textContent = message;
  alert.className = `contact-alert ${type} visible`;
  alert.style.cssText = `
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 10000;
    max-width: min(360px, calc(100vw - 40px));
    padding: 14px 18px;
    border-radius: 8px;
    color: #fff;
    font: 500 14px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-shadow: 0 12px 30px rgba(0,0,0,0.22);
    background: ${type === "success" ? "#2f855a" : "#c53030"};
    opacity: 1;
    transform: translateY(0);
    transition: opacity .25s ease, transform .25s ease;
  `;

  window.clearTimeout(alert.hideTimer);
  alert.hideTimer = window.setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.transform = "translateY(8px)";
    alert.classList.remove("visible");
  }, 4200);
}
