(() => {
  const data = JSON.parse(document.getElementById('tir-data').textContent);
  const root = document.documentElement;
  const drawer = document.querySelector('[data-drawer]');
  const drawerContent = document.querySelector('[data-drawer-content]');
  const backdrop = document.querySelector('[data-drawer-backdrop]');
  const svg = document.querySelector('.bridge-svg');
  const modeNote = document.querySelector('[data-mode-note]');
  const byId = Object.fromEntries(data.rooms.map(r => [r.id, r]));
  const sourceById = Object.fromEntries((data.sources || []).map(s => [s.id, s]));
  const legal = document.querySelector('[data-legal]');
  const legalBackdrop = document.querySelector('[data-legal-backdrop]');
  let currentPanel = null;
  let lastFocus = null;
  let lastLegalFocus = null;

  root.classList.remove('no-js');
  root.classList.add('js');
  if (legal) {
    legal.setAttribute('role','dialog');
    legal.setAttribute('aria-modal','true');
    legal.setAttribute('aria-hidden','true');
    legal.setAttribute('inert','');
  }
  legalBackdrop?.setAttribute('aria-hidden','true');
  const urlLang = new URLSearchParams(location.search).get('lang');
  const preferred = (urlLang === 'de' || urlLang === 'en') ? urlLang : (navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en');

  document.querySelector('[data-subtitle-de]').textContent = data.meta.subtitle.de;
  document.querySelector('[data-subtitle-en]').textContent = data.meta.subtitle.en;
  document.querySelector('[data-question-de]').textContent = data.meta.question.de;
  document.querySelector('[data-question-en]').textContent = data.meta.question.en;
  document.querySelector('[data-scope-de]').textContent = data.meta.scope_note.de;
  document.querySelector('[data-scope-en]').textContent = data.meta.scope_note.en;

  setLang(preferred);
  setMode('rooms', false);
  syncTextLayerFromHash();
  addEventListener('hashchange', syncTextLayerFromHash);

  // R6: critical controls get direct listeners plus native href fallbacks.
  document.querySelectorAll('[data-set-lang]').forEach(control => {
    control.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      setLang(control.dataset.setLang);
      // Keep fallback URL meaningful without reloading.
      const url = new URL(location.href);
      url.searchParams.set('lang', control.dataset.setLang);
      history.replaceState(null, '', url);
    });
  });
  document.querySelectorAll('[data-text-toggle]').forEach(control => {
    control.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      toggleTextLayer(control);
    });
  });

  document.addEventListener('click', handleClick, true);
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab' && legal?.classList.contains('open')) {
      trapFocus(e, legal);
      return;
    }
    if (e.key === 'Escape' && legal?.classList.contains('open')) {
      e.preventDefault();
      closeLegal(true);
      return;
    }
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      e.preventDefault();
      closeDrawer(true);
    }
  });

  function handleClick(e) {
    if (!(e.target instanceof Element)) return;

    const legalOpen = e.target.closest('[data-legal-open]');
    if (legalOpen) {
      e.preventDefault();
      e.stopPropagation();
      openLegal();
      return;
    }

    const legalClose = e.target.closest('[data-legal-close]');
    if (legalClose) {
      e.preventDefault();
      e.stopPropagation();
      closeLegal(true);
      return;
    }

    const legalShade = e.target.closest('[data-legal-backdrop]');
    if (legalShade) {
      e.preventDefault();
      closeLegal(true);
      return;
    }

    const close = e.target.closest('[data-close]');
    if (close) {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer(true);
      return;
    }

    const shade = e.target.closest('[data-drawer-backdrop]');
    if (shade) {
      e.preventDefault();
      closeDrawer(true);
      return;
    }

    const back = e.target.closest('[data-index-back]');
    if (back) {
      e.preventDefault();
      e.stopPropagation();
      openIndexPanel(back.dataset.indexBack);
      return;
    }

    const bridge = e.target.closest('[data-open-bridge]');
    if (bridge) {
      e.preventDefault();
      e.stopPropagation();
      openBridge(bridge.dataset.openBridge);
      return;
    }

    const indexed = e.target.closest('[data-open-kind]');
    if (indexed) {
      e.preventDefault();
      e.stopPropagation();
      openItem(indexed.dataset.openKind, indexed.dataset.openId);
      return;
    }

    const room = e.target.closest('[data-room]');
    if (room) {
      e.preventDefault();
      openItem('room', room.dataset.room);
      return;
    }

    const lib = e.target.closest('[data-library]');
    if (lib) {
      e.preventDefault();
      openItem('library', lib.dataset.library);
      return;
    }

    const horizon = e.target.closest('[data-horizon]');
    if (horizon) {
      e.preventDefault();
      openItem('horizon', horizon.dataset.horizon);
      return;
    }

    const evidenceToggle = e.target.closest('[data-evidence-toggle]');
    if (evidenceToggle) {
      e.preventDefault();
      e.stopPropagation();
      toggleEvidence(evidenceToggle);
      return;
    }

    const mode = e.target.closest('.mode-nav [data-mode]');
    if (mode) {
      e.preventDefault();
      const targetMode = mode.dataset.mode;
      setMode(targetMode, true);
      if (targetMode === 'rooms') {
        document.getElementById('text-version')?.classList.remove('open');
        scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      }
      return;
    }

    const home = e.target.closest('[data-home]');
    if (home) {
      e.preventDefault();
      closeDrawer(false);
      setMode('rooms', false);
      scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  }

  function toggleEvidence(button){
    const panel = button.nextElementSibling;
    if (!panel || !panel.matches('[data-evidence-panel]')) return;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
    button.classList.toggle('open', !expanded);
  }

  function setTextLayerState(open){
    const text = document.getElementById('text-version');
    if (!text) return;
    text.classList.toggle('open', open);
    document.querySelectorAll('[data-text-toggle]').forEach(control => control.setAttribute('aria-expanded', String(open)));
  }

  function scrollTextLayerIntoView(){
    const text = document.getElementById('text-version');
    if (!text) return;
    requestAnimationFrame(() => text.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    }));
  }

  function syncTextLayerFromHash(){
    const open = location.hash === '#text-version';
    setTextLayerState(open);
    if (open) scrollTextLayerIntoView();
  }

  function toggleTextLayer(button){
    const text = document.getElementById('text-version');
    if (!text) return;
    const willOpen = !text.classList.contains('open');
    if (willOpen) {
      closeDrawer(false);
      closeLegal(false);
      setTextLayerState(true);
      if (location.hash !== '#text-version') history.replaceState(null, '', location.pathname + location.search + '#text-version');
      scrollTextLayerIntoView();
    } else {
      setTextLayerState(false);
      if (location.hash === '#text-version') history.replaceState(null, '', location.pathname + location.search);
      scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  }

  function lang(){ return root.dataset.lang === 'en' ? 'en' : 'de'; }

  function setLang(value){
    const l = value === 'en' ? 'en' : 'de';
    root.dataset.lang = l;
    root.lang = l;
    document.querySelectorAll('[data-set-lang]').forEach(b => {
      const active = b.dataset.setLang === l;
      b.classList.toggle('active', active);
      if (active) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current');
    });
    updateModeNote();
    updatePublicStatus();
    updateAriaLabels();
    rerenderPanel();
  }


  function updatePublicStatus(){
    const node = document.querySelector('[data-build-status]');
    if (node && data.meta.publication_state) node.textContent = data.meta.publication_state[lang()] || '';
  }

  function updateAriaLabels(){
    const key = lang() === 'de' ? 'ariaDe' : 'ariaEn';
    document.querySelectorAll('[data-aria-de][data-aria-en]').forEach(el => {
      const value = el.dataset[key];
      if (value) el.setAttribute('aria-label', value);
    });
  }

  function setMode(mode, openIndex){
    if (!['rooms','bridges','library','horizon'].includes(mode)) mode = 'rooms';
    root.dataset.viewMode = mode;
    document.querySelectorAll('.mode-nav [data-mode]').forEach(b => {
      const active = b.dataset.mode === mode;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    clearRoomActive();
    syncLayerInteractivity(mode);
    if (mode === 'bridges') showAllBridges(); else clearBridges();
    updateModeNote();
    if (openIndex) {
      if (mode === 'bridges' || mode === 'library' || mode === 'horizon') openIndexPanel(mode);
      else closeDrawer(false);
    }
  }

  function syncLayerInteractivity(mode){
    document.querySelectorAll('[data-library]').forEach(el => {
      const active = mode === 'library';
      el.disabled = !active;
      if (active) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden','true');
    });
    document.querySelectorAll('[data-horizon]').forEach(el => {
      const active = mode === 'horizon';
      el.disabled = !active;
      if (active) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden','true');
    });
  }

  function updateModeNote(){
    if (!modeNote) return;
    const mode = root.dataset.viewMode || 'rooms';
    const bridgeCount = data.bridges.length;
    const bridgeDe = bridgeCount === 1 ? 'Eine Verbindung im aktuellen Stand; sie zeigt auch ihre Grenze.' : `${bridgeCount} Verbindungen im aktuellen Stand; jede zeigt auch ihre Grenze.`;
    const bridgeEn = bridgeCount === 1 ? 'One connection in the current state; it also shows its limit.' : `${bridgeCount} connections in the current state; each also shows its limit.`;
    const copy = {
      rooms:{de:'Acht Kernräume. Berühre ein Licht.',en:'Eight core rooms. Touch a light.'},
      bridges:{de:bridgeDe,en:bridgeEn},
      library:{de:'Resonanzen aus der Privatbibliothek; mit Kurzbeschreibung und ausdrücklich genanntem persönlichem Status.',en:'Resonances from the private library, with a short description and explicit personal reading status.'},
      horizon:{de:'Lesehinweise jenseits der bestätigten Bibliotheks-Aura; mit Kurzbeschreibung und ohne behaupteten persönlichen Lesestatus.',en:'Reading leads beyond the confirmed Library aura, with a short description and no asserted personal reading status.'}
    };
    modeNote.textContent = copy[mode][lang()];
  }

  function rerenderPanel(){
    if (!drawer.classList.contains('open') || !currentPanel) return;
    if (currentPanel.type === 'item') openItem(currentPanel.kind, currentPanel.id, false);
    else if (currentPanel.type === 'bridge') openBridge(currentPanel.id, false);
    else if (currentPanel.type === 'index') openIndexPanel(currentPanel.kind, false);
  }

  function openItem(kind, id, remember = true){
    clearRoomActive();
    if (remember) currentPanel = {type:'item', kind, id};

    if (kind === 'room') {
      const r = byId[id]; if (!r) return;
      setMode('rooms', false);
      document.querySelector(`[data-room="${CSS.escape(id)}"]`)?.classList.add('active');
      const bridges = data.bridges.filter(b => b.left === id || b.right === id);
      drawerContent.innerHTML = `<p class="meta">${escapeHtml(r.room_name[lang()])}</p><h2>${escapeHtml(localized(r,'figure_label','figure'))}</h2><p class="work">${escapeHtml(localized(r,'work_label','work'))} · ${escapeHtml(localized(r,'author_label','author'))}</p><p class="work-description">${escapeHtml(r.description[lang()])}</p><p class="teaser">${escapeHtml(r.teaser[lang()])}</p><p class="room-essay">${escapeHtml(r.essay[lang()])}</p><p class="why">${escapeHtml(r.why_this_room[lang()])}</p><div class="room-question"><span>${lang()==='de'?'OFFENE FRAGE':'OPEN QUESTION'}</span><p>${escapeHtml(r.question[lang()])}</p></div><p class="meta">${escapeHtml(r.research_note[lang()])}</p>${claimDetails(r)}${bridges.length?`<p class="meta">${lang()==='de'?'Verbindungen':'Connections'}</p>`:''}${bridges.map(bridgeHtml).join('')}`;
      highlightBridges(id);
    } else if (kind === 'library') {
      setMode('library', false);
      const x = data.library.find(x => x.id === id); if (!x) return;
      drawerContent.innerHTML = `${backButton('library')}<p class="meta">${lang()==='de'?'BIBLIOTHEK':'LIBRARY'}</p><h2>${escapeHtml(localized(x,'work_label','work'))}</h2><p class="work">${escapeHtml(localized(x,'author_label','author'))}</p><p class="work-description">${escapeHtml(x.description[lang()])}</p><p class="why"><strong>${lang()==='de'?'Resonanz':'Resonance'}:</strong> ${escapeHtml(x.resonance[lang()])}</p><p class="meta">${escapeHtml(x.reading_label[lang()])}</p><p class="panel-action-note">${lang()==='de'?'Dieser Eintrag ist eine kuratierte Resonanz, kein vollständig ausgebauter Kernraum.':'This entry is a curated resonance, not a fully developed core room.'}</p>`;
    } else if (kind === 'horizon') {
      setMode('horizon', false);
      const x = data.horizon.find(x => x.id === id); if (!x) return;
      drawerContent.innerHTML = `${backButton('horizon')}<p class="meta">${lang()==='de'?'HORIZONT':'HORIZON'}</p><h2>${escapeHtml(localized(x,'work_label','work'))}</h2><p class="work">${escapeHtml(localized(x,'author_label','author'))}</p><p class="work-description">${escapeHtml(x.description[lang()])}</p><p class="why"><strong>${lang()==='de'?'Warum im Horizont?':'Why in the Horizon?'}:</strong> ${escapeHtml(x.reason[lang()])}</p><p class="meta">${escapeHtml(x.public_note[lang()])}</p><p class="panel-action-note">${lang()==='de'?'Ein begründeter Lesehinweis – noch keine persönlich bestätigte Resonanz.':'A reasoned reading lead — not yet a personally validated resonance.'}</p>`;
    } else return;

    openDrawer();
  }

  function openBridge(id, remember = true){
    const b = data.bridges.find(x => x.id === id); if (!b) return;
    if (remember) currentPanel = {type:'bridge', id};
    setMode('bridges', false);
    showOnlyBridge(id);
    const left = byId[b.left], right = byId[b.right];
    document.querySelector(`[data-room="${CSS.escape(b.left)}"]`)?.classList.add('active');
    document.querySelector(`[data-room="${CSS.escape(b.right)}"]`)?.classList.add('active');
    drawerContent.innerHTML = `${backButton('bridges')}<p class="meta">${escapeHtml(b.public_state[lang()])}</p><h2>${escapeHtml(localized(left,'figure_label','figure'))} ↔ ${escapeHtml(localized(right,'figure_label','figure'))}</h2><p class="work">${escapeHtml(left.room_name[lang()])} ↔ ${escapeHtml(right.room_name[lang()])}</p><p class="teaser">${escapeHtml(b.thesis[lang()])}</p><p class="why"><strong>${lang()==='de'?'Grenze der Analogie':'Limit of analogy'}:</strong> ${escapeHtml(b.disanalogy[lang()])}</p>`;
    openDrawer();
  }

  function openIndexPanel(kind, remember = true){
    if (remember) currentPanel = {type:'index', kind};
    if (kind === 'bridges') {
      drawerContent.innerHTML = `<p class="meta">${lang()==='de'?'BRÜCKEN':'BRIDGES'}</p><h2>${lang()==='de'?'Begründete Verbindungen':'Argued connections'}</h2><p class="teaser">${lang()==='de'?'Eine Brücke ist keine Ähnlichkeitslinie. Öffne einen Eintrag für These und Grenze der Analogie.':'A bridge is not a similarity line. Open an entry for its thesis and the limit of the analogy.'}</p><div class="index-list">${data.bridges.map(indexBridgeButton).join('')}</div>`;
    } else if (kind === 'library') {
      drawerContent.innerHTML = `<p class="meta">${lang()==='de'?'BIBLIOTHEK':'LIBRARY'}</p><h2>${lang()==='de'?'Die Bibliotheks-Aura':'The library aura'}</h2><p class="teaser">${lang()==='de'?'Werke aus der Privatbibliothek, die mit dem Kronleuchter resonieren. Jeder Titel hat eine kurze Werkbeschreibung; der persönliche Lesestatus wird ausdrücklich genannt.':'Works from the private library that resonate with the chandelier. Each title has a short description, and personal reading status is stated explicitly.'}</p><div class="index-list">${data.library.map(x => indexItemButton('library',x)).join('')}</div>`;
    } else if (kind === 'horizon') {
      drawerContent.innerHTML = `<p class="meta">${lang()==='de'?'HORIZONT':'HORIZON'}</p><h2>${lang()==='de'?'Der Lesehorizont':'The reading horizon'}</h2><p class="teaser">${lang()==='de'?'Thematisch passende Lesehinweise jenseits der bestätigten Bibliotheks-Aura. Jeder Titel wird kurz beschrieben; daraus wird kein persönlicher Lesestatus abgeleitet.':'Thematically fitting reading leads beyond the confirmed Library aura. Each title is briefly described; no personal reading status is inferred from that.'}</p><div class="index-list">${data.horizon.map(x => indexItemButton('horizon',x)).join('')}</div>`;
    } else return;
    openDrawer();
  }

  function indexBridgeButton(b){
    const l = byId[b.left], r = byId[b.right];
    return `<button type="button" class="index-button" data-open-bridge="${escapeHtml(b.id)}"><span>${escapeHtml(localized(l,'figure_label','figure'))} ↔ ${escapeHtml(localized(r,'figure_label','figure'))}</span><small>${escapeHtml(b.thesis[lang()])}</small></button>`;
  }

  function indexItemButton(kind, x){
    const body = (kind === 'library' ? x.resonance : x.reason)[lang()];
    return `<button type="button" class="index-button" data-open-kind="${kind}" data-open-id="${escapeHtml(x.id)}"><span>${escapeHtml(localized(x,'work_label','work'))}</span><small>${escapeHtml(localized(x,'author_label','author'))} · ${escapeHtml(body)}</small></button>`;
  }

  function backButton(kind){
    const label = lang()==='de' ? 'Zurück zur Übersicht' : 'Back to overview';
    return `<button type="button" class="panel-back" data-index-back="${kind}">← ${label}</button>`;
  }

  function claimDetails(r){
    const label = lang()==='de' ? 'Belegbare Schicht' : 'Evidence layer';
    const sourceLabel = lang()==='de' ? 'Quellen' : 'Sources';
    const claims = r.claims.map(c => {
      const links=(c.evidence||[]).map(id => sourceLink(id)).join('');
      return `<div class="claim"><b>${escapeHtml(c.public_label[lang()])}</b><p>${escapeHtml(c.text[lang()])}</p>${links?`<div class="claim-sources"><span>${sourceLabel}</span>${links}</div>`:''}</div>`;
    }).join('');
    return `<div class="evidence-layer"><button type="button" class="evidence-toggle" data-evidence-toggle aria-expanded="false"><span>${label}</span><span class="evidence-chevron" aria-hidden="true">⌄</span></button><div class="evidence-panel" data-evidence-panel hidden>${claims}</div></div>`;
  }

  function sourceLink(id){
    const src=sourceById[id];
    if (!src) return '';
    const label=escapeHtml(src.title || id);
    const publisher=src.publisher ? ` · ${escapeHtml(src.publisher)}` : '';
    if (!src.url) return `<span class="source-chip">${label}${publisher}</span>`;
    return `<a class="source-chip" href="${escapeHtml(src.url)}" target="_blank" rel="noopener noreferrer">${label}${publisher}</a>`;
  }

  function bridgeHtml(b){
    const roomId = currentPanel?.type === 'item' ? currentPanel.id : null;
    const other = byId[b.left === roomId ? b.right : b.left];
    return `<button type="button" class="bridge-card bridge-button" data-open-bridge="${escapeHtml(b.id)}"><span class="meta">${escapeHtml(b.public_state[lang()])}</span><strong>${escapeHtml(localized(other,'figure_label','figure'))}</strong><span>${escapeHtml(b.thesis[lang()])}</span><span><em>${lang()==='de'?'Grenze der Analogie':'Limit of analogy'}:</em> ${escapeHtml(b.disanalogy[lang()])}</span></button>`;
  }

  function openDrawer(){
    if (!drawer.classList.contains('open')) lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    drawer.removeAttribute('inert');
    backdrop?.setAttribute('aria-hidden','false');
    document.body.classList.add('drawer-open');
    requestAnimationFrame(() => drawer.querySelector('[data-close]')?.focus({preventScroll:true}));
  }

  function closeDrawer(restoreFocus = false){
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    drawer.setAttribute('inert','');
    backdrop?.setAttribute('aria-hidden','true');
    document.body.classList.remove('drawer-open');
    currentPanel = null;
    clearRoomActive();
    if (root.dataset.viewMode === 'bridges') showAllBridges(); else clearBridges();
    if (restoreFocus && lastFocus instanceof HTMLElement) requestAnimationFrame(() => lastFocus.focus({preventScroll:true}));
  }

  function openLegal(){
    if (!legal) return;
    closeDrawer(false);
    lastLegalFocus = document.activeElement;
    legal.classList.add('open');
    legal.setAttribute('aria-hidden','false');
    legal.removeAttribute('inert');
    legalBackdrop?.setAttribute('aria-hidden','false');
    document.body.classList.add('legal-open');
    requestAnimationFrame(() => legal.querySelector('[data-legal-close]')?.focus({preventScroll:true}));
  }

  function closeLegal(restoreFocus=false){
    if (!legal) return;
    legal.classList.remove('open');
    legal.setAttribute('aria-hidden','true');
    legal.setAttribute('inert','');
    legalBackdrop?.setAttribute('aria-hidden','true');
    document.body.classList.remove('legal-open');
    if (restoreFocus && lastLegalFocus instanceof HTMLElement) requestAnimationFrame(() => lastLegalFocus.focus({preventScroll:true}));
  }

  function isActuallyFocusable(el){
    if (el.hasAttribute('hidden') || el.closest('[inert]')) return false;
    const closedDetails = el.closest('details:not([open])');
    if (closedDetails && el !== closedDetails.querySelector(':scope > summary')) return false;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    return el.getClientRects().length > 0;
  }

  function trapFocus(e, container){
    const focusable = [...container.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')]
      .filter(isActuallyFocusable);
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function clearRoomActive(){ document.querySelectorAll('.room-light.active').forEach(x => x.classList.remove('active')); }
  function localized(obj, labelKey, fallbackKey){
    const label = obj?.[labelKey];
    if (label && typeof label === 'object') return label[lang()] || label.de || label.en || obj?.[fallbackKey] || '';
    return obj?.[fallbackKey] || '';
  }
  function escapeHtml(s=''){ return String(s).replace(/[&<>'"]/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  function drawBridges(){
    svg.innerHTML = '';
    const wrap = document.querySelector('.chandelier-wrap').getBoundingClientRect();
    for (const b of data.bridges) {
      const a = document.querySelector(`[data-room="${CSS.escape(b.left)}"]`).getBoundingClientRect();
      const c = document.querySelector(`[data-room="${CSS.escape(b.right)}"]`).getBoundingClientRect();
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.dataset.bridge = b.id;
      const sx=(a.left+a.width/2-wrap.left)/wrap.width*1000, sy=(a.top+a.height/2-wrap.top)/wrap.height*760;
      const ex=(c.left+c.width/2-wrap.left)/wrap.width*1000, ey=(c.top+c.height/2-wrap.top)/wrap.height*760;
      line.setAttribute('x1',sx); line.setAttribute('y1',sy); line.setAttribute('x2',ex); line.setAttribute('y2',ey); svg.appendChild(line);
    }
    if (root.dataset.viewMode === 'bridges') showAllBridges();
  }

  function highlightBridges(id){ svg.querySelectorAll('line').forEach(l => { const b=data.bridges.find(x=>x.id===l.dataset.bridge); l.classList.toggle('active', !!(b && (b.left===id || b.right===id))); }); }
  function showOnlyBridge(id){ svg.querySelectorAll('line').forEach(l => l.classList.toggle('active', l.dataset.bridge===id)); }
  function showAllBridges(){ svg.querySelectorAll('line').forEach(l => l.classList.add('active')); }
  function clearBridges(){ svg.querySelectorAll('line').forEach(l => l.classList.remove('active')); }

  addEventListener('resize', drawBridges, {passive:true});
  requestAnimationFrame(drawBridges);
})();
