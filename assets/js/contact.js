/* THE HARDWARE VAULT — enquiry form validation (front-end only) */
(function () {
  'use strict';
  var form = document.getElementById('enquiryForm');
  if (!form) return;
  var status = document.getElementById('formStatus');

  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var phoneRe = /^\+?[0-9][0-9\s\-()]{7,17}$/;

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
    email: function (v) {
      if (!v.trim()) return 'Email address is required.';
      return emailRe.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    phone: function (v) {
      if (!v.trim()) return 'Phone number is required.';
      var digits = v.replace(/\D/g, '');
      return phoneRe.test(v.trim()) && digits.length >= 10 && digits.length <= 13
        ? '' : 'Enter a valid phone number (10–13 digits).';
    },
    category: function (v) { return v ? '' : 'Please select a product category.'; },
    subject: function (v) { return v.trim().length >= 3 ? '' : 'Please enter a subject.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'; }
  };

  function validateField(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var msg = rule(input.value);
    var field = input.closest('.field');
    var err = field.querySelector('.error');
    field.classList.toggle('invalid', !!msg);
    err.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  form.querySelectorAll('input, select, textarea').forEach(function (el) {
    el.addEventListener('blur', function () { validateField(el); });
    el.addEventListener('input', function () {
      if (el.closest('.field').classList.contains('invalid')) validateField(el);
    });
  });

  function showStatus(type, text) {
    status.className = 'form-status show ' + type;
    status.textContent = text;
    status.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, firstBad = null;
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (!validateField(el)) { ok = false; if (!firstBad) firstBad = el; }
    });
    if (!ok) {
      showStatus('error', 'Please correct the highlighted fields and try again.');
      if (firstBad) firstBad.focus();
      return;
    }

    /* Send the enquiry to the business WhatsApp number */
    var WA_NUMBER = '918830532500';
    var v = function (n) { return form.elements[n].value.trim(); };
    var text = '*New Enquiry - The Hardware Vault*\n\n' +
      '*Name:* ' + v('name') + '\n' +
      '*Phone:* ' + v('phone') + '\n' +
      '*Email:* ' + v('email') + '\n' +
      '*Category:* ' + v('category') + '\n' +
      '*Subject:* ' + v('subject') + '\n' +
      '*Message:* ' + v('message');
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
    var w = window.open(url, '_blank');
    if (w) { w.opener = null; } else { window.location.href = url; }
    showStatus('success', 'Thank you! WhatsApp has opened with your enquiry. Please press Send in WhatsApp to deliver it to us.');
    form.reset();
  });
})();
