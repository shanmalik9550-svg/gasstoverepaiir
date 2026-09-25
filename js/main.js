/**
 * Gas Stove & Hob Repair Service Portal
 * Web3Forms Email Notification & WhatsApp Redirection Logic
 * Web3Forms Form Key: 39b83002-b632-4327-b3c9-bdc5d4508744
 * WhatsApp Destination: +91 95993 39483
 * Main Phone Helpline: 1800-202-6208
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '919599339483';
  const WEB3FORMS_ACCESS_KEY = '39b83002-b632-4327-b3c9-bdc5d4508744';

  // Elements
  const bookingForm = document.getElementById('bookingForm');
  const toastEl = document.getElementById('toastNotification');
  const faqItems = document.querySelectorAll('.cata-faq-item');

  /**
   * Show Toast Notification
   */
  function showToast(message, icon = 'fa-circle-check', duration = 3500) {
    if (!toastEl) return;
    toastEl.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  /**
   * Build WhatsApp message text & URL
   */
  function createWhatsAppUrl(data) {
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const message = [
      '🔥 *GAS STOVE & HOB REPAIR BOOKING*',
      '━━━━━━━━━━━━━━━━━━━━',
      `👤 *Name:* ${data.name}`,
      `📱 *Mobile:* ${data.mobile}`,
      `🛠️ *Appliance:* ${data.product}`,
      `📍 *Location:* ${data.city || 'N/A'}${data.pincode ? ' (' + data.pincode + ')' : ''}`,
      `📝 *Problem Details:*`,
      `"${data.message || 'Inspection & doorstep repair required'}"`,
      '━━━━━━━━━━━━━━━━━━━━',
      `🕒 *Time:* ${timestamp}`,
      '⚡ *Please confirm doorstep technician visit.*'
    ].join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Main Form Submission: Email Alert (Web3Forms) + WhatsApp Redirect
   */
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      formData.set('access_key', WEB3FORMS_ACCESS_KEY);

      const name = (formData.get('name') || '').trim();
      const mobile = (formData.get('mobile') || '').trim();
      const product = (formData.get('product') || 'Gas Stove Repair').trim();
      const city = (formData.get('city') || '').trim();
      const pincode = (formData.get('pincode') || '').trim();
      const message = (formData.get('message') || '').trim();

      // Validation
      if (!name) {
        showToast('Please enter your full name', 'fa-triangle-exclamation');
        return;
      }

      if (!/^[0-9]{10}$/.test(mobile)) {
        showToast('Please enter a valid 10-digit mobile number', 'fa-triangle-exclamation');
        return;
      }

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      // Update UI button state
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting & Opening WhatsApp...';
      submitBtn.disabled = true;

      showToast('Sending booking notification & opening WhatsApp... 🚀', 'fa-brands fa-whatsapp');

      // Set informative email subject
      formData.set('subject', `New Gas Stove Booking: ${name} (${mobile}) - ${product}`);

      try {
        // 1. Send Email Notification via Web3Forms API
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
      } catch (error) {
        console.warn('Web3Forms notification request notice:', error);
      }

      // 2. Redirect to WhatsApp with complete pre-filled details
      const waUrl = createWhatsAppUrl({ name, mobile, product, city, pincode, message });

      setTimeout(() => {
        window.location.href = waUrl;
        bookingForm.reset();
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
      }, 500);
    });
  }

  /**
   * FAQ Accordion
   */
  faqItems.forEach(item => {
    const question = item.querySelector('.cata-faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });

  /**
   * Phone Number Numeric Only Restrictor
   */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
  });

  console.log('Appliance Experts portal initialized with Web3Forms email notifications.');
})();
