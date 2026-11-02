(() => {
  'use strict';

  const GROUP_EMPLOYEES = 15000;
  const OUR_EMPLOYEES = 300;

  const defaults = {
    monthlyGap: 1000,
    gapBasis: 'net',
    monthlyIncrease: 300,
    monthlyIncreaseBasis: 'net',
    thirteenth: 2500,
    thirteenthBasis: 'net',
    hoursCurrent: 40,
    hoursTarget: 38,
    extraVacation: 4,
    daysPerWeek: 5,
    annualProfit: 849288000,
    workdaysYear: 220,
    workhoursYear: 1760,
    workingWeeks: 46
  };

  const ids = Object.keys(defaults);
  const numberIds = ids.filter(id => typeof defaults[id] === 'number');
  const limits = {
    monthlyGap: [0, 100000],
    monthlyIncrease: [0, 100000],
    thirteenth: [0, 1000000],
    hoursCurrent: [1, 80],
    hoursTarget: [1, 80],
    extraVacation: [0, 100],
    daysPerWeek: [1, 7],
    annualProfit: [0, 10000000000000],
    workdaysYear: [1, 366],
    workhoursYear: [1, 4000],
    workingWeeks: [1, 52]
  };
  const basisIds = new Set(['gapBasis', 'monthlyIncreaseBasis', 'thirteenthBasis']);
  const $ = id => document.getElementById(id);
  const basisLabel = b => b === 'net' ? 'netto' : 'brutto';

  const nf0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nf4 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  const euro0 = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const euro2 = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const sanitizeNumber = (id, raw) => {
    const v = Number(raw);
    const [min, max] = limits[id] || [-Number.MAX_VALUE, Number.MAX_VALUE];
    return Number.isFinite(v) ? clamp(v, min, max) : defaults[id];
  };
  const sanitizeHashNumber = (id, raw) => {
    if (typeof raw !== 'string') return defaults[id];
    const s = raw.trim();
    if (!s || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) return defaults[id];
    return sanitizeNumber(id, s);
  };
  const sanitizeBasis = (id, raw) => (raw === 'net' || raw === 'gross') ? raw : defaults[id];
  const num = id => sanitizeNumber(id, $(id).value);
  const safeDiv = (a, b) => b > 0 ? a / b : 0;
  const pct = (v, digits = 2) => `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v)} %`;
  const metric = (label, value, note = '') => `<div class="metric"><div class="m-label">${label}</div><div class="m-value">${value}</div>${note ? `<div class="m-note">${note}</div>` : ''}</div>`;
  const card = (label, value, sub = '') => `<div class="card"><div class="label">${label}</div><div class="value">${value}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
  const profitMetric = (label, value) => `<div><span>${label}</span><strong>${value}</strong></div>`;

  function setStateTotal(id, value) {
    const el = $(id);
    if (!el) return;
    const textValue = String(value ?? '');
    el.textContent = textValue;
    el.classList.toggle('compact', textValue.length >= 13);
  }

  function stateFromInputs() {
    const s = {};
    for (const id of ids) s[id] = numberIds.includes(id) ? num(id) : sanitizeBasis(id, $(id).value);
    return s;
  }

  function normalizeState(s) {
    const out = { ...defaults };
    for (const id of ids) {
      if (s[id] === undefined) continue;
      out[id] = numberIds.includes(id) ? sanitizeNumber(id, s[id]) : sanitizeBasis(id, s[id]);
    }
    return out;
  }

  function applyState(s) {
    const clean = normalizeState(s);
    for (const id of ids) if ($(id)) $(id).value = clean[id];
    render();
  }

  function calculate() {
    const s = stateFromInputs();
    const ourShare = OUR_EMPLOYEES / GROUP_EMPLOYEES * 100;
    const others = GROUP_EMPLOYEES - OUR_EMPLOYEES;
    const gapPerYear = s.monthlyGap * 12;
    const gapGroupYear = gapPerYear * OUR_EMPLOYEES;

    const monthlyAnnual = s.monthlyIncrease * 12;
    const monthlyGroupAnnual = monthlyAnnual * OUR_EMPLOYEES;
    const thirteenthGroupAnnual = s.thirteenth * OUR_EMPLOYEES;
    const sameMoneyBasis = s.monthlyIncreaseBasis === s.thirteenthBasis;
    const moneyPerPerson = sameMoneyBasis ? monthlyAnnual + s.thirteenth : null;
    const moneyGroup = sameMoneyBasis ? monthlyGroupAnnual + thirteenthGroupAnnual : null;
    const monthlyEquivalent = moneyPerPerson !== null ? moneyPerPerson / 12 : null;

    let residualGap = null;
    let closedShare = null;
    if (sameMoneyBasis && s.gapBasis === s.monthlyIncreaseBasis) {
      residualGap = Math.max(0, gapPerYear - moneyPerPerson);
      closedShare = gapPerYear > 0 ? Math.min(100, moneyPerPerson / gapPerYear * 100) : null;
    }

    const weeklyChange = s.hoursTarget - s.hoursCurrent;
    const weeklyChangePct = safeDiv(weeklyChange, s.hoursCurrent) * 100;
    const targetDaily = safeDiv(s.hoursTarget, s.daysPerWeek);
    const extraVacationHoursPerPerson = s.extraVacation * targetDaily;
    const extraVacationHoursGroup = extraVacationHoursPerPerson * OUR_EMPLOYEES;
    const nominalWeeklyHoursGroup = Math.abs(weeklyChange) * OUR_EMPLOYEES;
    const weeklyTimeBalancePerPerson = (s.hoursCurrent - s.hoursTarget) * s.workingWeeks;
    const annualTimeBalancePerPerson = weeklyTimeBalancePerPerson + extraVacationHoursPerPerson;
    const annualTimeBalanceGroup = annualTimeBalancePerPerson * OUR_EMPLOYEES;
    const hourlyValueRise = s.hoursTarget > 0 ? (s.hoursCurrent / s.hoursTarget - 1) * 100 : 0;
    const impliedWeeksFromDays = safeDiv(s.workdaysYear, s.daysPerWeek);
    const impliedWeeksFromHours = safeDiv(s.workhoursYear, s.hoursCurrent);

    const profitThen = moneyGroup !== null ? Math.max(0, s.annualProfit - moneyGroup) : null;
    const profitExhausted = moneyGroup !== null && moneyGroup > s.annualProfit;
    const profitReductionPct = moneyGroup !== null && s.annualProfit > 0 ? Math.min(100, moneyGroup / s.annualProfit * 100) : (moneyGroup === 0 && s.annualProfit === 0 ? 0 : null);

    const profitNowYear = safeDiv(s.annualProfit, GROUP_EMPLOYEES);
    const profitNowMonth = profitNowYear / 12;
    const profitNowDay = safeDiv(profitNowYear, s.workdaysYear);
    const profitNowHour = safeDiv(profitNowYear, s.workhoursYear);

    const profitThenYear = profitThen !== null ? safeDiv(profitThen, GROUP_EMPLOYEES) : null;
    const profitThenMonth = profitThenYear !== null ? profitThenYear / 12 : null;
    const profitThenDay = profitThenYear !== null ? safeDiv(profitThenYear, s.workdaysYear) : null;
    const profitThenHour = profitThenYear !== null ? safeDiv(profitThenYear, s.workhoursYear) : null;

    const deltaYear = profitThenYear !== null ? profitNowYear - profitThenYear : null;
    const deltaMonth = profitThenMonth !== null ? profitNowMonth - profitThenMonth : null;
    const deltaDay = profitThenDay !== null ? profitNowDay - profitThenDay : null;
    const deltaHour = profitThenHour !== null ? profitNowHour - profitThenHour : null;

    return {
      ...s,
      ourShare, others, gapPerYear, gapGroupYear,
      monthlyAnnual, monthlyGroupAnnual, thirteenthGroupAnnual,
      sameMoneyBasis, moneyPerPerson, moneyGroup, monthlyEquivalent,
      residualGap, closedShare,
      weeklyChange, weeklyChangePct, targetDaily,
      extraVacationHoursPerPerson, extraVacationHoursGroup,
      nominalWeeklyHoursGroup, weeklyTimeBalancePerPerson,
      annualTimeBalancePerPerson, annualTimeBalanceGroup, hourlyValueRise,
      impliedWeeksFromDays, impliedWeeksFromHours,
      profitThen, profitExhausted, profitReductionPct,
      profitNowYear, profitNowMonth, profitNowDay, profitNowHour,
      profitThenYear, profitThenMonth, profitThenDay, profitThenHour,
      deltaYear, deltaMonth, deltaDay, deltaHour
    };
  }

  function renderProfitState(c) {
    setStateTotal('profitNowTotal', euro0.format(c.annualProfit));
    $('profitNowGrid').innerHTML = [
      profitMetric('pro Beschäftigtem / Jahr', euro2.format(c.profitNowYear)),
      profitMetric('pro Monat', euro2.format(c.profitNowMonth)),
      profitMetric('pro Arbeitstag', euro2.format(c.profitNowDay)),
      profitMetric('pro Arbeitsstunde', euro2.format(c.profitNowHour))
    ].join('');

    if (c.profitThen !== null) {
      setStateTotal('profitThenTotal', euro0.format(c.profitThen));
      $('profitThenSub').textContent = c.profitExhausted
        ? `Geldpaket übersteigt den Ausgangsbetrag; Restbetrag auf 0 € begrenzt`
        : `rechnerischer Rest nach ${euro0.format(c.moneyGroup)} ${basisLabel(c.monthlyIncreaseBasis)} Geldpaket`;
      $('profitThenGrid').innerHTML = [
        profitMetric('pro Beschäftigtem / Jahr', euro2.format(c.profitThenYear)),
        profitMetric('pro Monat', euro2.format(c.profitThenMonth)),
        profitMetric('pro Arbeitstag', euro2.format(c.profitThenDay)),
        profitMetric('pro Arbeitsstunde', euro2.format(c.profitThenHour))
      ].join('');
      const netWarning = c.monthlyIncreaseBasis === 'net'
        ? 'Netto gewählt: „Dann“ ist ein Größenvergleich und bildet die tatsächlichen Arbeitgeberkosten nicht vollständig ab.'
        : 'Brutto gewählt: Arbeitgebernebenkosten sind in „Dann“ nicht enthalten.';
      const limitWarning = c.profitExhausted ? ' Das Geldpaket übersteigt den Ausgangsbetrag; die Restgröße wird daher bei 0 € begrenzt.' : '';
      $('profitCaveat').textContent = `${netWarning}${limitWarning} Arbeitszeit und Urlaub werden nicht vom Ausschüttungsbetrag abgezogen.`;
    } else {
      setStateTotal('profitThenTotal', '—');
      $('profitThenSub').textContent = 'nicht berechenbar bei gemischter Netto-/Bruttobasis';
      $('profitThenGrid').innerHTML = [
        profitMetric('pro Beschäftigtem / Jahr', '—'),
        profitMetric('pro Monat', '—'),
        profitMetric('pro Arbeitstag', '—'),
        profitMetric('pro Arbeitsstunde', '—')
      ].join('');
      $('profitCaveat').textContent = 'Zusatzgehalt und 13. Gehalt haben unterschiedliche Basen. Deshalb wird kein scheinpräziser „Dann“-Profit berechnet.';
    }
  }

  function render() {
    const c = calculate();
    renderProfitState(c);

    $('headlineCards').innerHTML = [
      card('Geschätzter Abstand', `${euro0.format(c.monthlyGap)} ${basisLabel(c.gapBasis)}`, 'pro Person und Monat'),
      c.sameMoneyBasis ? card('Geldpaket', `${euro0.format(c.moneyPerPerson)} ${basisLabel(c.monthlyIncreaseBasis)}`, 'pro Person und Jahr') : card('Geldpaket', 'getrennte Basen', 'wird nicht addiert'),
      card('Arbeitszeit', `${nf1.format(c.hoursCurrent)} → ${nf1.format(c.hoursTarget)} Std.`, `${c.weeklyChange < 0 ? '−' : c.weeklyChange > 0 ? '+' : ''}${nf1.format(Math.abs(c.weeklyChange))} Std. / ${c.weeklyChangePct < 0 ? 'weniger' : c.weeklyChangePct > 0 ? 'mehr' : 'unverändert'}`)
    ].join('');

    $('structureMetrics').innerHTML = [
      metric('Beschäftigte in Deutschland', nf0.format(GROUP_EMPLOYEES), 'feste Bezugsgröße'),
      metric('Wir', nf0.format(OUR_EMPLOYEES), `${pct(c.ourShare, 1)} der Beschäftigten`),
      metric('Andere im Konzern', nf0.format(c.others), `${pct(100 - c.ourShare, 1)} der Beschäftigten`),
      metric('geschätzter Abstand unserer Gruppe/Jahr', `${euro0.format(c.gapGroupYear)} ${basisLabel(c.gapBasis)}`)
    ].join('');

    let moneyHtml = `<div class="money-section"><h4>Zusatzgehalt</h4><div class="metrics">${[
      metric('pro Person/Monat', `${euro0.format(c.monthlyIncrease)} ${basisLabel(c.monthlyIncreaseBasis)}`),
      metric('für uns/Jahr', `${euro0.format(c.monthlyGroupAnnual)} ${basisLabel(c.monthlyIncreaseBasis)}`)
    ].join('')}</div></div>`;

    moneyHtml += `<div class="money-section"><h4>13. Gehalt</h4><div class="metrics">${[
      metric('pro Person', `${euro0.format(c.thirteenth)} ${basisLabel(c.thirteenthBasis)}`),
      metric('für uns/Jahr', `${euro0.format(c.thirteenthGroupAnnual)} ${basisLabel(c.thirteenthBasis)}`)
    ].join('')}</div></div>`;

    if (c.sameMoneyBasis) {
      moneyHtml += `<div class="money-section"><h4>Gesamt</h4><div class="metrics">${[
        metric('pro Person/Jahr', `${euro0.format(c.moneyPerPerson)} ${basisLabel(c.monthlyIncreaseBasis)}`),
        metric('für uns/Jahr', `${euro0.format(c.moneyGroup)} ${basisLabel(c.monthlyIncreaseBasis)}`),
        metric('Monatsäquivalent pro Person', `${euro2.format(c.monthlyEquivalent)} ${basisLabel(c.monthlyIncreaseBasis)}`, '13. Gehalt auf 12 Monate verteilt'),
        c.residualGap !== null
          ? (c.closedShare === null
              ? metric('verbleibender Abstand', `${euro0.format(c.residualGap)} ${basisLabel(c.gapBasis)}/Jahr`, 'kein Abstand angenommen – Anteil nicht definiert')
              : metric('verbleibender Abstand', `${euro0.format(c.residualGap)} ${basisLabel(c.gapBasis)}/Jahr`, `${pct(c.closedShare, 1)} des angenommenen Abstands geschlossen`))
          : metric('Abstandsvergleich', 'nicht direkt möglich', 'Basis des Abstands unterscheidet sich von der Forderung')
      ].join('')}</div></div>`;
    } else {
      moneyHtml += `<p class="notice strong">Zusatzgehalt und 13. Gehalt haben unterschiedliche Netto-/Bruttobasen und werden nicht addiert.</p>`;
    }
    $('moneyResults').innerHTML = moneyHtml;

    $('timeMetrics').innerHTML = [
      metric('Wochenveränderung', `${c.weeklyChange < 0 ? '−' : c.weeklyChange > 0 ? '+' : ''}${nf1.format(Math.abs(c.weeklyChange))} Std.`, `${pct(Math.abs(c.weeklyChangePct), 1)} ${c.weeklyChange < 0 ? 'weniger' : c.weeklyChange > 0 ? 'mehr' : 'unverändert'}`),
      metric('für uns/Woche', `${nf0.format(c.nominalWeeklyHoursGroup)} Std.`, c.weeklyChange < 0 ? 'weniger vertragliche Wochenzeit' : c.weeklyChange > 0 ? 'mehr vertragliche Wochenzeit' : 'keine Veränderung'),
      metric('zusätzlicher Urlaub', `${nf1.format(c.extraVacation)} Tage/Person`, `${nf0.format(c.extraVacation * OUR_EMPLOYEES)} Tage für uns`),
      metric('zusätzliche Urlaubszeit', `${nf1.format(c.extraVacationHoursPerPerson)} Std./Person`, `${nf0.format(c.extraVacationHoursGroup)} Std. für uns`),
      metric('grobe Zeitbilanz/Jahr', `${c.annualTimeBalancePerPerson >= 0 ? '+' : '−'}${nf1.format(Math.abs(c.annualTimeBalancePerPerson))} Std./Person`, c.annualTimeBalancePerPerson >= 0 ? 'zusätzliche freie Zeit (Wochenänderung + Urlaub)' : 'zusätzliche Arbeitszeit nach Verrechnung mit Urlaub'),
      metric('Zeitbilanz für uns/Jahr', `${c.annualTimeBalanceGroup >= 0 ? '+' : '−'}${nf0.format(Math.abs(c.annualTimeBalanceGroup))} Std.`, `mit ${nf1.format(c.workingWeeks)} Arbeitswochen`),
      metric('Stundenwert bei gleichem Monatsentgelt', `${c.hourlyValueRise > 0 ? '+' : ''}${pct(c.hourlyValueRise, 2)}`, 'rein rechnerisch aus der Wochenstundenänderung')
    ].join('');

    $('yearBasisNote').textContent = `Aktuell: ${nf0.format(c.workdaysYear)} Arbeitstage bei ${nf1.format(c.daysPerWeek)} Tagen/Woche entsprechen ${nf1.format(c.impliedWeeksFromDays)} Wochen; ${nf0.format(c.workhoursYear)} Vergleichsstunden bei ${nf1.format(c.hoursCurrent)} Std./Woche entsprechen ${nf1.format(c.impliedWeeksFromHours)} Wochen; die Zeitschätzung nutzt ${nf1.format(c.workingWeeks)} Wochen.`;

    const rows = [
      ['Jahr', c.profitNowYear, c.profitThenYear, c.deltaYear],
      ['Monat', c.profitNowMonth, c.profitThenMonth, c.deltaMonth],
      ['Arbeitstag', c.profitNowDay, c.profitThenDay, c.deltaDay],
      ['Arbeitsstunde', c.profitNowHour, c.profitThenHour, c.deltaHour]
    ];
    $('profitTable').innerHTML = rows.map(([label, now, then, delta]) => {
      const thenText = then === null ? '—' : euro2.format(then);
      const deltaText = delta === null ? '—' : label === 'Arbeitsstunde'
        ? `${delta > 0 ? '− ' : ''}${nf4.format(delta)} € (${nf2.format(delta * 100)} Cent)`
        : `${delta > 0 ? '− ' : ''}${euro2.format(delta)}`;
      return `<tr><th>${label}</th><td class="now-cell">${euro2.format(now)}</td><td class="then-cell">${thenText}</td><td>${deltaText}</td></tr>`;
    }).join('');

    persistToHash(c);
  }

  function persistToHash(s) {
    const params = new URLSearchParams();
    for (const id of ids) params.set(id, s[id]);
    try {
      history.replaceState(null, '', `${location.pathname}${location.search}#${params.toString()}`);
    } catch {
      // Rechenfunktion bleibt auch in restriktiven Sandbox-/Dateikontexten nutzbar.
    }
  }

  function loadFromHash() {
    if (!location.hash || location.hash.length < 2) return false;
    const params = new URLSearchParams(location.hash.slice(1));
    const s = { ...defaults };
    let found = false;
    for (const id of ids) {
      if (params.has(id)) {
        found = true;
        const values = params.getAll(id);
        if (values.length !== 1) {
          s[id] = defaults[id];
        } else {
          s[id] = numberIds.includes(id) ? sanitizeHashNumber(id, values[0]) : sanitizeBasis(id, values[0]);
        }
      }
    }
    if (found) applyState(s);
    return found;
  }

  function summaryText() {
    const c = calculate();
    const lines = [
      'JETZT UND DANN',
      '',
      `Beschäftigte in Deutschland: ${nf0.format(GROUP_EMPLOYEES)} (fix)`,
      `Wir: ${nf0.format(OUR_EMPLOYEES)} (${pct(c.ourShare, 1)}, fix)`,
      `Geschätzter Abstand: ${euro0.format(c.monthlyGap)} ${basisLabel(c.gapBasis)} pro Person/Monat`,
      '',
      `Zusatzgehalt: ${euro0.format(c.monthlyIncrease)} ${basisLabel(c.monthlyIncreaseBasis)} pro Person/Monat`,
      `13. Gehalt: ${euro0.format(c.thirteenth)} ${basisLabel(c.thirteenthBasis)} pro Person`,
      `Vollzeit: ${nf1.format(c.hoursCurrent)} → ${nf1.format(c.hoursTarget)} Std./Woche`,
      `Zusätzlicher Urlaub: ${nf1.format(c.extraVacation)} Tage/Person`,
      `Grobe Zeitbilanz: ${c.annualTimeBalancePerPerson >= 0 ? '+' : '−'}${nf1.format(Math.abs(c.annualTimeBalancePerPerson))} Std./Person/Jahr`,
      ''
    ];
    if (c.sameMoneyBasis) {
      lines.push(`Geldpaket: ${euro0.format(c.moneyPerPerson)} ${basisLabel(c.monthlyIncreaseBasis)} pro Person/Jahr`);
      lines.push(`Geldpaket für uns: ${euro0.format(c.moneyGroup)} ${basisLabel(c.monthlyIncreaseBasis)} pro Jahr`);
      if (c.closedShare !== null) lines.push(`Vom geschätzten Abstand geschlossen: ${pct(c.closedShare, 1)}`);
      else if (c.gapPerYear === 0 && c.gapBasis === c.monthlyIncreaseBasis) lines.push('Vom geschätzten Abstand geschlossen: nicht definiert (kein Abstand angenommen)');
    } else {
      lines.push('Geldpaket gesamt: nicht summiert (gemischte Netto-/Bruttobasis)');
    }
    if (c.annualTimeBalancePerPerson < 0) lines.push('Hinweis Zeitbilanz: negativer Wert = zusätzliche Arbeitszeit nach Verrechnung mit zusätzlichem Urlaub.');
    lines.push('', `Ausschüttungs-/Vergleichsbetrag jetzt: ${euro0.format(c.annualProfit)}`);
    if (c.profitThen !== null) {
      lines.push(`Ausschüttungs-/Vergleichsbetrag dann (rechnerisch): ${euro0.format(c.profitThen)}`);
      lines.push(`Ausschüttungsbetrag pro Beschäftigtem in Deutschland – Jahr: ${euro2.format(c.profitNowYear)} → ${euro2.format(c.profitThenYear)}`);
      lines.push(`Ausschüttungsbetrag pro Beschäftigtem in Deutschland – Monat: ${euro2.format(c.profitNowMonth)} → ${euro2.format(c.profitThenMonth)}`);
      lines.push(`Ausschüttungsbetrag pro Beschäftigtem in Deutschland – Arbeitstag: ${euro2.format(c.profitNowDay)} → ${euro2.format(c.profitThenDay)}`);
      lines.push(`Ausschüttungsbetrag pro Beschäftigtem in Deutschland – Arbeitsstunde: ${euro2.format(c.profitNowHour)} → ${euro2.format(c.profitThenHour)}`);
      lines.push(`Differenz je Vergleichs-Arbeitsstunde: ${nf4.format(c.deltaHour)} € (${nf2.format(c.deltaHour * 100)} Cent)`);
      lines.push(`Rechnerische Reduktion des Ausschüttungsbetrags: ${c.profitReductionPct === null ? 'nicht definiert' : pct(c.profitReductionPct, 4)}`);
      if (c.profitExhausted) lines.push('Hinweis: Geldpaket übersteigt den Ausgangsbetrag; Restbetrag wurde auf 0 € begrenzt.');
    }
    lines.push('', 'Hinweis: Der Ausschüttungs-/Vergleichsbetrag ist frei änderbar und nicht automatisch Konzernergebnis oder Jahresüberschuss. Bei Nettoforderungen ist „Dann“ nur eine Größenrechnung; tatsächliche Arbeitgeberkosten werden nicht vollständig abgebildet. Arbeitszeit und Urlaub werden nicht monetarisiert.');
    return lines.join('\n');
  }

  async function copy(text, success) {
    try {
      await navigator.clipboard.writeText(text);
      $('status').textContent = success;
    } catch {
      $('status').textContent = 'Kopieren wurde vom Browser blockiert.';
    }
    setTimeout(() => { $('status').textContent = ''; }, 2600);
  }

  for (const id of ids) $(id).addEventListener('input', render);
  for (const id of numberIds) {
    $(id).addEventListener('change', () => {
      $(id).value = sanitizeNumber(id, $(id).value);
      render();
    });
  }
  for (const id of ['gapBasis', 'monthlyIncreaseBasis', 'thirteenthBasis']) $(id).addEventListener('change', render);
  $('copySummary').addEventListener('click', () => copy(summaryText(), 'Ergebnis wurde kopiert.'));
  $('copyLink').addEventListener('click', () => copy(location.href, 'Link mit aktuellen Werten wurde kopiert.'));
  $('resetAll').addEventListener('click', () => applyState(defaults));
  window.addEventListener('hashchange', () => { loadFromHash(); });

  if (!loadFromHash()) applyState(defaults);
})();
