(() => {
  const root = document.documentElement;
  const theme = document.querySelector('#theme-toggle');
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('bayes-models-theme'); } catch {}
  function setTheme(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    theme.textContent = dark ? '☀' : '☾';
    theme.setAttribute('aria-pressed', String(dark));
  }
  setTheme(preference ? preference === 'dark' : system.matches);
  system.addEventListener('change', event => { if (!preference) setTheme(event.matches); });
  theme.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    preference = dark ? 'dark' : 'light';
    setTheme(dark);
    try { localStorage.setItem('bayes-models-theme', preference); } catch {}
  });

  const menu = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#nav-links');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
  }
  menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });

  const top = document.querySelector('.back-top');
  function updateTop() { top.hidden = scrollY < innerHeight * 0.75; }
  addEventListener('scroll', updateTop, { passive: true });
  addEventListener('resize', updateTop);
  updateTop();

  const controls = document.querySelector('#gallery-controls');
  const search = document.querySelector('#gallery-search');
  const count = document.querySelector('#gallery-count');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.site-gallery figure')];
  const dialog = document.querySelector('dialog');
  const viewport = dialog.querySelector('.capture-viewport');
  const image = viewport.querySelector('img');
  const zoom = dialog.querySelector('#image-zoom');
  let category = 'all';
  let visible = cards;
  let current = 0;
  let opener;

  function updateGallery() {
    const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    visible = cards.filter(card => {
      const label = card.textContent.toLowerCase();
      const show = (category === 'all' || card.dataset.category === category) &&
        words.every(word => label.includes(word));
      card.hidden = !show;
      return show;
    });
    count.textContent = visible.length ? `${visible.length} of ${cards.length} figures` : 'No matching figures.';
  }
  controls.hidden = false;
  search.addEventListener('input', updateGallery);
  for (const button of filters) button.addEventListener('click', () => {
    category = button.dataset.filter;
    for (const filter of filters) filter.setAttribute('aria-pressed', String(filter === button));
    updateGallery();
  });
  updateGallery();

  function setZoom(active) {
    viewport.classList.toggle('zoomed', active);
    zoom.setAttribute('aria-pressed', String(active));
    zoom.textContent = active ? 'Fit image' : 'Zoom in';
    viewport.scrollTo(0, 0);
  }
  function showFigure(index) {
    current = (index + visible.length) % visible.length;
    const card = visible[current];
    const link = card.querySelector('a');
    image.src = link.href;
    image.alt = link.dataset.title;
    dialog.querySelector('#image-title').textContent = link.dataset.title;
    dialog.querySelector('#image-caption').textContent = card.querySelector('figcaption p').textContent;
    dialog.querySelector('#image-original').href = link.href;
    dialog.querySelector('#image-position').textContent = `${current + 1} of ${visible.length}`;
    dialog.querySelector('#previous-image').disabled = visible.length < 2;
    dialog.querySelector('#next-image').disabled = visible.length < 2;
    setZoom(false);
  }
  for (const card of cards) {
    const link = card.querySelector('a');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !dialog.showModal) return;
      event.preventDefault();
      opener = link;
      showFigure(visible.indexOf(card));
      dialog.showModal();
    });
  }
  zoom.addEventListener('click', () => setZoom(!viewport.classList.contains('zoomed')));
  dialog.querySelector('#previous-image').addEventListener('click', () => showFigure(current - 1));
  dialog.querySelector('#next-image').addEventListener('click', () => showFigure(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.target === viewport && viewport.classList.contains('zoomed')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showFigure(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('close', () => opener?.focus());
  let swipe = null;
  viewport.addEventListener('touchstart', event => {
    swipe = !viewport.classList.contains('zoomed') && event.touches.length === 1 ? event.touches[0] : null;
  }, { passive: true });
  viewport.addEventListener('touchend', event => {
    if (!swipe) return;
    const dx = event.changedTouches[0].clientX - swipe.clientX;
    const dy = event.changedTouches[0].clientY - swipe.clientY;
    swipe = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > 1.5 * Math.abs(dy)) showFigure(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  viewport.addEventListener('touchcancel', () => { swipe = null; });

  const resize = new ResizeObserver(entries => {
    for (const entry of entries) entry.target.dispatchEvent(new Event('update-slider'));
  });
  for (const region of document.querySelectorAll('.table-scroll, .code-sample')) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.className = 'horizontal-slider';
    slider.setAttribute('aria-label', 'Scroll ' + (region.getAttribute('aria-label') || region.closest('.code-wrap').querySelector('.code-label').textContent));
    region.after(slider);
    function sync() {
      const max = region.scrollWidth - region.clientWidth;
      slider.max = String(max);
      slider.value = String(Math.round(region.scrollLeft));
      slider.hidden = max < 1;
    }
    slider.addEventListener('input', () => { region.scrollLeft = slider.valueAsNumber; });
    region.addEventListener('scroll', sync, { passive: true });
    region.addEventListener('update-slider', sync);
    resize.observe(region);
    sync();
  }
  if (navigator.clipboard?.writeText) for (const button of document.querySelectorAll('.code-bar .copy')) {
    button.hidden = false;
    let timer;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.closest('.code-wrap').querySelector('code').textContent);
        button.textContent = 'Copied';
      } catch { button.textContent = 'Copy unavailable'; }
      clearTimeout(timer);
      timer = setTimeout(() => { button.textContent = 'Copy'; }, 1500);
    });
  }
})();
