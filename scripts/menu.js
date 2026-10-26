/* ==========================================================================
   Menú de navegación: lista todas las diapositivas agrupadas por sección,
   resalta la actual y permite saltar a cualquiera. Tecla M abre/cierra,
   Esc cierra. Incluye búsqueda por texto o número de artículo.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.deck) return;

  var slides = window.deck.slides;
  var menu = document.getElementById('menu');
  var backdrop = document.getElementById('menu-backdrop');
  var list = document.getElementById('menu-list');
  var search = document.getElementById('menu-search');
  var btnMenu = document.getElementById('btn-menu');
  var btnClose = document.getElementById('menu-close');
  var items = [];

  // Título legible de cada diapositiva
  function labelFor(slide) {
    var label = (slide.getAttribute('aria-label') || '').replace(/^(Verbo rector|Conceptos):\s*/, '');
    var nums = Array.prototype.map.call(slide.querySelectorAll('.art__num'), function (n) {
      return n.textContent.replace('Artículo ', '');
    });
    if (nums.length) {
      label = (nums.length === 1 ? 'Art. ' + nums[0] : 'Arts. ' + nums[0] + (nums.length === 2 ? ' y ' : ' a ') + nums[nums.length - 1]) +
        ' · ' + label;
    }
    return label;
  }

  // Construcción del menú, agrupado por las diapositivas separadoras
  var group = document.createElement('div');
  group.className = 'menu__group';
  var groupList = document.createElement('ol');
  group.appendChild(groupList);
  list.appendChild(group);

  slides.forEach(function (slide, i) {
    var isDivider = slide.classList.contains('slide--divider');
    if (isDivider) {
      group = document.createElement('div');
      group.className = 'menu__group';
      var h = document.createElement('p');
      h.className = 'menu__section';
      var roman = slide.querySelector('.divider__num');
      h.textContent = (roman ? roman.textContent + ' · ' : '') +
        slide.getAttribute('aria-label').replace(/^Sección [IVX]+:\s*/, '');
      group.appendChild(h);
      groupList = document.createElement('ol');
      group.appendChild(groupList);
      list.appendChild(group);
    }
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + slide.id;
    a.className = 'menu__item' + (isDivider ? ' menu__item--section' : '');
    a.innerHTML = '<span class="menu__num">' + (i + 1) + '</span><span class="menu__text"></span>';
    a.querySelector('.menu__text').textContent = isDivider ? 'Portada de la sección' : labelFor(slide);
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.deck.goTo(i);
      close();
    });
    li.appendChild(a);
    groupList.appendChild(li);
    items.push({ el: li, link: a, group: group, text: (a.textContent + ' ' + slide.textContent).toLowerCase() });
  });

  function markCurrent(index) {
    items.forEach(function (it, i) {
      var on = i === index;
      it.link.classList.toggle('is-current', on);
      if (on) it.link.setAttribute('aria-current', 'step'); else it.link.removeAttribute('aria-current');
    });
  }
  document.addEventListener('slidechange', function (e) { markCurrent(e.detail.index); });
  markCurrent(window.deck.current());

  // Búsqueda
  search.addEventListener('input', function () {
    var q = search.value.trim().toLowerCase();
    items.forEach(function (it) { it.el.hidden = q !== '' && it.text.indexOf(q) === -1; });
    Array.prototype.forEach.call(list.querySelectorAll('.menu__group'), function (g) {
      g.hidden = !g.querySelector('li:not([hidden])');
    });
  });
  search.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var q = search.value.trim().toLowerCase();
      var visible = items.filter(function (it) { return !it.el.hidden; });
      // Prioriza coincidencias en el título de la diapositiva sobre el contenido
      var best = visible.filter(function (it) { return it.link.textContent.toLowerCase().indexOf(q) !== -1; })[0] || visible[0];
      if (best) best.link.click();
    }
    e.stopPropagation(); // no mover diapositivas mientras se escribe
  });

  function isOpen() { return !menu.hidden; }
  function open() {
    menu.hidden = false; backdrop.hidden = false;
    btnMenu.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
    var cur = list.querySelector('.is-current');
    if (cur) cur.scrollIntoView({ block: 'center' });
    (cur || search).focus({ preventScroll: true });
  }
  function close() {
    if (!isOpen()) return;
    menu.classList.remove('is-open');
    menu.hidden = true; backdrop.hidden = true;
    btnMenu.setAttribute('aria-expanded', 'false');
    search.value = ''; search.dispatchEvent(new Event('input'));
    btnMenu.focus({ preventScroll: true });
  }
  function toggle() { if (isOpen()) close(); else open(); }

  btnMenu.addEventListener('click', toggle);
  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape' && isOpen()) { e.preventDefault(); close(); }
    else if ((e.key === 'm' || e.key === 'M') && e.target !== search) { e.preventDefault(); toggle(); }
  });
})();
