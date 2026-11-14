/* THE HARDWARE VAULT - shared interactions (vanilla JS, no libraries) */
(function () {
  'use strict';
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HOVER = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- header: solid on scroll, back-to-top, progress bar ---------- */
  var header = $('.site-header');
  var toTop = $('.totop');
  var bar = null;
  if (!RM) { bar = doc.createElement('div'); bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true'); doc.body.appendChild(bar); }
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('solid', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);
    if (bar) { var h = doc.documentElement.scrollHeight - window.innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')'; }
    parallax();
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); });

  /* ---------- mobile menu + products dropdown ---------- */
  var menuBtn = $('.menu-btn'), navWrap = $('.nav-wrap');
  if (menuBtn && navWrap) {
    menuBtn.addEventListener('click', function () {
      var open = navWrap.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', navWrap).forEach(function (a) { a.addEventListener('click', function () { navWrap.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });
  }
  var dd = $('.has-dd'), ddBtn = dd ? $('button', dd) : null;
  if (dd && ddBtn) {
    ddBtn.addEventListener('click', function () { var o = dd.classList.toggle('open'); ddBtn.setAttribute('aria-expanded', String(o)); });
    doc.addEventListener('click', function (e) { if (!dd.contains(e.target)) { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded', 'false'); } });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (dd) dd.classList.remove('open'); if (navWrap) navWrap.classList.remove('open'); }
  });

  /* ---------- footer year, contact category prefill ---------- */
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
  var sel = $('#category');
  if (sel) { var p = new URLSearchParams(location.search).get('category'); if (p) sel.value = p; }

  /* ---------- scroll reveal (batched stagger) + mask reveal ---------- */
  function finish(el) { el.classList.add('done'); el.style.transitionDelay = ''; }
  var revealEls = $$('[data-reveal]'), maskEls = $$('[data-mask]');
  if (RM || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); finish(el); });
    maskEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var rio = new IntersectionObserver(function (entries) {
      var hit = entries.filter(function (e) { return e.isIntersecting; });
      hit.forEach(function (en, i) {
        var el = en.target; rio.unobserve(el);
        el.style.transitionDelay = (i * 0.1) + 's';
        el.classList.add('in');
        setTimeout(function () { finish(el); }, 900 + i * 100);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { rio.observe(el); });
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.__mask.classList.add('in'); mio.unobserve(en.target); } });
    }, { threshold: 0.1 });
    maskEls.forEach(function (el) { var w = el.parentElement; w.__mask = el; mio.observe(w); });
  }

  /* ---------- counters ---------- */
  var counters = $$('[data-count]');
  function runCount(c) {
    var end = +c.dataset.count, t0 = null, dur = 1800;
    function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); c.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if (RM || !('IntersectionObserver' in window)) { counters.forEach(function (c) { c.textContent = c.dataset.count; }); }
  else {
    var cio = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { cio.unobserve(en.target); runCount(en.target); } }); }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- parallax band background ---------- */
  var pars = RM ? [] : $$('[data-parallax]');
  function parallax() {
    pars.forEach(function (el) {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var prog = (vh - r.top) / (vh + r.height);
      var img = $('img', el); if (img) img.style.transform = 'translateY(' + ((prog - 0.5) * 12).toFixed(2) + '%)';
    });
  }

  /* ---------- pointer effects: magnetic buttons, layered images, tilt ---------- */
  if (HOVER && !RM) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('pointermove', function (e) { var q = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - q.left - q.width / 2) * 0.18).toFixed(1) + 'px,' + ((e.clientY - q.top - q.height / 2) * 0.25).toFixed(1) + 'px)'; });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
    $$('.layer').forEach(function (l) {
      var b = $('.b', l);
      l.addEventListener('pointermove', function (e) { var q = l.getBoundingClientRect(); var x = (e.clientX - q.left) / q.width - 0.5, y = (e.clientY - q.top) / q.height - 0.5; b.style.transform = 'translate(' + (x * 16).toFixed(1) + 'px,' + (y * 16).toFixed(1) + 'px)'; });
      l.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
    $$('.tilt').forEach(function (t) {
      t.addEventListener('pointermove', function (e) { var q = t.getBoundingClientRect(); var x = (e.clientX - q.left) / q.width - 0.5, y = (e.clientY - q.top) / q.height - 0.5; t.style.transform = 'perspective(800px) rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg)'; });
      t.addEventListener('pointerleave', function () { t.style.transform = ''; });
    });
  }


  /* ---------- banner stage: soft pointer parallax ---------- */
  if (HOVER && !RM) {
    $$('[data-stage]').forEach(function (st) {
      var fr = $('.arch-frame', st), rg = $('.stage-ring', st);
      var host = st.closest('section') || st;
      host.addEventListener('pointermove', function (e) {
        var q = host.getBoundingClientRect();
        var x = (e.clientX - q.left) / q.width - 0.5, y = (e.clientY - q.top) / q.height - 0.5;
        if (fr) fr.style.transform = 'translate3d(' + (x * -14).toFixed(1) + 'px,' + (y * -14).toFixed(1) + 'px,0)';
        if (rg) rg.style.transform = 'translate3d(' + (18 + x * 12).toFixed(1) + 'px,' + (18 + y * 12).toFixed(1) + 'px,0)';
      });
      host.addEventListener('pointerleave', function () { if (fr) fr.style.transform = ''; if (rg) rg.style.transform = ''; });
    });
  }

  /* ---------- hero slider (cross-fade) ---------- */
  var slider = $('[data-slider]');
  if (slider) {
    var slides = $$('.slide', slider), dots = $$('.dots button', slider), idx = 0, timer = null;
    var capT = $('.cap-t', slider);
    var go = function (n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-on', i === idx); s.setAttribute('aria-hidden', String(i !== idx)); });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
      if (capT) capT.textContent = slides[idx].getAttribute('data-cap');
    };
    var stop = function () { clearInterval(timer); timer = null; };
    var play = function () { if (RM || timer) return; timer = setInterval(function () { go(idx + 1); }, 6000); };
    var prev = $('.prev', slider), next = $('.next', slider);
    if (prev) prev.addEventListener('click', function () { go(idx - 1); stop(); play(); });
    if (next) next.addEventListener('click', function () { go(idx + 1); stop(); play(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); stop(); play(); }); });
    var ctrl = $('.hero-ctrl', slider) || slider;
    ctrl.addEventListener('mouseenter', stop); ctrl.addEventListener('mouseleave', play);
    var sx = null;
    slider.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); stop(); play(); } sx = null; }, { passive: true });
    go(0); play();
  }

  /* ---------- products: filter + lightbox ---------- */
  var gal = $('#gallery');
  if (gal) {
    var items = $$('.pcard', gal), btns = $$('.filters button');
    var intro = $('#cat-intro');
    var vis = function () { return items.filter(function (i) { return !i.classList.contains('hide'); }); };
    var afterApply = null;
    var apply = function (c) {
      btns.forEach(function (x) { var on = x.dataset.f === c; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
      items.forEach(function (it) { it.classList.add('fade'); });
      setTimeout(function () {
        items.forEach(function (it) { var show = c === 'all' || it.dataset.cat === c; it.classList.toggle('hide', !show); if (show) { it.classList.add('in', 'done'); it.style.transitionDelay = ''; } });
        gal.classList.toggle('cat', c !== 'all');
        vis().forEach(function (it, i) { if (c === 'all') it.removeAttribute('data-s'); else it.setAttribute('data-s', i % 3); requestAnimationFrame(function () { it.classList.remove('fade'); }); });
        if (intro) { var b = btns.filter(function (x) { return x.dataset.f === c; })[0]; var t = b && b.dataset.intro; intro.hidden = !t; intro.querySelector('p').textContent = t || ''; }
        if (afterApply) { var f = afterApply; afterApply = null; requestAnimationFrame(f); }
      }, RM ? 0 : 260);
    };
    /* jump straight to the products so nothing needs scrolling */
    var shopEl = $('.shop');
    var jump = function () {
      if (!shopEl) return;
      var hh = header ? header.offsetHeight : 80;
      var y = shopEl.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - hh - 16;
      window.scrollTo({ top: Math.max(0, y), behavior: RM ? 'auto' : 'smooth' });
    };
    btns.forEach(function (b) { b.addEventListener('click', function () { afterApply = jump; apply(b.dataset.f); history.replaceState(null, '', b.dataset.f === 'all' ? location.pathname : '#' + b.dataset.f); }); });
    var fromHash = function () { var h = location.hash.slice(1); if (h && btns.some(function (b) { return b.dataset.f === h; })) { afterApply = jump; apply(h); } };
    fromHash(); window.addEventListener('hashchange', fromHash);

    var lb = $('#lb'), li = 0;
    var show = function (n) {
      var v = vis(); li = (n + v.length) % v.length; var it = v[li];
      $('img', lb).src = it.dataset.big; $('img', lb).alt = it.dataset.name;
      $('figcaption span', lb).textContent = it.dataset.name + ' — ' + it.dataset.label;
      $('.lb-enq', lb).href = 'contact.html?category=' + encodeURIComponent(it.dataset.label) + '#enquiry';
    };
    var close = function () { lb.classList.remove('open'); doc.body.style.overflow = ''; };
    items.forEach(function (it) { it.addEventListener('click', function (e) { e.preventDefault(); li = vis().indexOf(it); lb.classList.add('open'); doc.body.style.overflow = 'hidden'; show(li); $('.x', lb).focus(); }); });
    $('.x', lb).onclick = close; $('.pv', lb).onclick = function () { show(li - 1); }; $('.nx', lb).onclick = function () { show(li + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    doc.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(li - 1); if (e.key === 'ArrowRight') show(li + 1); });
  }

  onScroll();
  window.addEventListener('load', parallax);
})();
