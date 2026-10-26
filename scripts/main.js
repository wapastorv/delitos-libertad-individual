/* ==========================================================================
   Navegación de la presentación
   - Botones Anterior / Siguiente
   - Teclado: ← → (también PageUp/PageDown, Espacio, Inicio/Fin), F = pantalla completa
   - Gestos táctiles (deslizar a izquierda / derecha)
   - Enlace directo a cada diapositiva mediante #ancla
   ========================================================================== */
(function () {
  'use strict';

  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var total = slides.length;
  var current = 0;

  var elCurrent = document.getElementById('current');
  var elTotal = document.getElementById('total');
  var elWhere = document.getElementById('where');
  var elBar = document.getElementById('progress-bar');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var btnFull = document.getElementById('btn-full');

  // Cada diapositiva sin id recibe uno ("s5", "s6"...) para poder enlazarla.
  slides.forEach(function (slide, i) {
    if (!slide.id) slide.id = 's' + (i + 1);
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'diapositiva');
  });
  elTotal.textContent = total;

  function indexFromHash() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (!id) return 0;
    var i = slides.findIndex(function (s) { return s.id === id; });
    return i >= 0 ? i : 0;
  }

  function goTo(index, updateHash) {
    if (index < 0 || index >= total) return;
    current = index;

    slides.forEach(function (slide, i) {
      var active = i === current;
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('is-past', i < current);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      if ('inert' in slide) slide.inert = !active;
    });

    var inner = slides[current].querySelector('.slide__inner');
    if (inner) inner.scrollTop = 0;

    elCurrent.textContent = current + 1;
    elWhere.textContent = slides[current].getAttribute('aria-label') || '';
    elBar.style.width = ((current + 1) / total * 100) + '%';
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
    document.dispatchEvent(new CustomEvent('slidechange', { detail: { index: current } }));

    if (updateHash !== false) {
      try { history.replaceState(null, '', '#' + slides[current].id); } catch (e) { /* sin historial */ }
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // API mínima para otros módulos (menú de navegación)
  window.deck = { goTo: function (i) { goTo(i); }, current: function () { return current; }, slides: slides };

  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  // Enlaces internos (índice)
  document.querySelectorAll('[data-goto]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(link.getAttribute('data-goto'));
      var i = slides.indexOf(target);
      if (i >= 0) goTo(i);
    });
  });

  // Teclado
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault(); next(); break;
      case ' ':
        if (tag === 'BUTTON' || tag === 'A') return;
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home':
        e.preventDefault(); goTo(0); break;
      case 'End':
        e.preventDefault(); goTo(total - 1); break;
      case 'f':
      case 'F':
        toggleFullscreen(); break;
    }
  });

  // Gestos táctiles
  var startX = 0, startY = 0, tracking = false;
  var deck = document.getElementById('deck');
  deck.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });

  // Pantalla completa (opcional: algunos navegadores móviles no la permiten)
  function toggleFullscreen() {
    var doc = document;
    var el = doc.documentElement;
    try {
      if (!doc.fullscreenElement) {
        var req = el.requestFullscreen || el.webkitRequestFullscreen;
        if (req) { var r = req.call(el); if (r && r.catch) r.catch(function () {}); }
      } else {
        var exit = doc.exitFullscreen || doc.webkitExitFullscreen;
        if (exit) { var x = exit.call(doc); if (x && x.catch) x.catch(function () {}); }
      }
    } catch (err) { /* no disponible */ }
  }
  btnFull.addEventListener('click', toggleFullscreen);
  if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) {
    btnFull.hidden = true;
  }

  window.addEventListener('hashchange', function () { goTo(indexFromHash(), false); });

  goTo(indexFromHash(), false);
})();
