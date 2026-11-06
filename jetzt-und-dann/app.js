(() => {
  'use strict';

  const GROUP_EMPLOYEES = 15000;
  const OUR_EMPLOYEES = 300;
  // Beides HGB-Einzelabschluss 2025 der ERGO Group AG, nicht IFRS-Konzernergebnis.
  const BILANZGEWINN_2025 = 849288465;
  const JAHRESUEBERSCHUSS_2025 = 267778316.91;
  const RUECKLAGENENTNAHME_2025 = 581510148.09;

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
    workdaysYear: 220,
    costFactor: 1,
    timeHourlyCost: 0
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
    workdaysYear: [1, 366],
    costFactor: [1, 10],
    timeHourlyCost: [0, 1000]
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
    // Eine gemeinsame Jahresbasis für Wochen-Zeitbilanz und Vergleichsstunden:
    // 220 Arbeitstage / 5 Arbeitstage je Woche = 44 Wochenäquivalente.
    const workingWeeks = safeDiv(s.workdaysYear, s.daysPerWeek);
    const workhoursYear = s.workdaysYear * safeDiv(s.hoursCurrent, s.daysPerWeek);
    const weeklyTimeBalancePerPerson = (s.hoursCurrent - s.hoursTarget) * workingWeeks;
    const annualTimeBalancePerPerson = weeklyTimeBalancePerPerson + extraVacationHoursPerPerson;
    const annualTimeBalanceGroup = annualTimeBalancePerPerson * OUR_EMPLOYEES;
    const hourlyValueRise = s.hoursTarget > 0 ? (s.hoursCurrent / s.hoursTarget - 1) * 100 : 0;
    const impliedWeeksFromDays = workingWeeks;

    // Zusätzliche Sensitivitätsrechnung: Faktor nur für das Geldpaket,
    // Zeitwert (optional) separat; keine behauptete echte Arbeitgeberkosten-Prognose.
    const extraFreedHours = Math.max(0, annualTimeBalanceGroup);
    const scenarioMoneyCost = moneyGroup === null ? null : moneyGroup * s.costFactor;
    const scenarioTimeCost = extraFreedHours * s.timeHourlyCost;
    const scenarioCost = scenarioMoneyCost === null ? null : scenarioMoneyCost + scenarioTimeCost;
    // Zwei feste HGB-Jahresbeträge. Keine Auswahl und kein Betrag aus Eingaben/URL.
    // Beide Rechnungen sind explizit Modellvergleiche, keine Kosten-/Gewinnprognosen.
    const compareAmount = amount => {
      const thenAmount = moneyGroup === null ? null : Math.max(0, amount - moneyGroup);
      const exhausted = moneyGroup !== null && moneyGroup > amount;
      const nowYear = safeDiv(amount, GROUP_EMPLOYEES);
      const thenYear = thenAmount === null ? null : safeDiv(thenAmount, GROUP_EMPLOYEES);
      return {
        amount, thenAmount, exhausted,
        reductionPct: moneyGroup === null ? null : safeDiv(moneyGroup, amount) * 100,
        nowYear, nowMonth: nowYear / 12,
        nowDay: safeDiv(nowYear, s.workdaysYear), nowHour: safeDiv(nowYear, workhoursYear),
        thenYear, thenMonth: thenYear === null ? null : thenYear / 12,
        thenDay: thenYear === null ? null : safeDiv(thenYear, s.workdaysYear),
        thenHour: thenYear === null ? null : safeDiv(thenYear, workhoursYear)
      };
    };
    const profitComparisons = [
      {name:'Bilanzgewinn 2025', key:'bilanz', ...compareAmount(BILANZGEWINN_2025)},
      {name:'Jahresüberschuss 2025', key:'ueberschuss', ...compareAmount(JAHRESUEBERSCHUSS_2025)}
    ];

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
      impliedWeeksFromDays, workingWeeks, workhoursYear,
      extraFreedHours, scenarioMoneyCost, scenarioTimeCost, scenarioCost,
      profitComparisons
    };
  }

  function renderProfitState(c) {
    $('twoBasisNowThen').innerHTML = c.profitComparisons.map(r => {
      const now = euro0.format(r.amount);
      const then = r.thenAmount === null ? '—' : euro0.format(r.thenAmount);
      const note = r.thenAmount === null ? 'keine gemeinsame Geldsumme bei Netto/Brutto-Mischung'
        : r.exhausted ? 'Geldpaket übersteigt diese Finanzgröße; Rest auf 0 € begrenzt'
        : `nach ${euro0.format(c.moneyGroup)} ${basisLabel(c.monthlyIncreaseBasis)} Geldpaket`;
      return `<article class="basis-comparison"><h3>${r.name}</h3>`+
        `<div class="compact-now-then">`+
        `<div class="compact-state now-state"><span>JETZT</span><strong>${now}</strong></div>`+
        `<div class="compact-arrow" aria-hidden="true">→</div>`+
        `<div class="compact-state then-state"><span>DANN · rechnerisch</span><strong>${then}</strong></div>`+
        `</div><p class="basis-comment">${note}</p></article>`;
    }).join('');
    const netWarning = c.monthlyIncreaseBasis === 'net'
      ? 'Netto gewählt: keine Berechnung der tatsächlichen Arbeitgeberkosten.'
      : 'Brutto gewählt: Arbeitgebernebenkosten sind nicht eingerechnet.';
    $('profitCaveat').textContent = c.moneyGroup === null
      ? 'Zusatzgehalt und 13. Gehalt haben unterschiedliche Netto-/Bruttobasen; daher keine rechnerischen Restbeträge.'
      : `${netWarning} Arbeitszeit und Urlaub werden nicht in diese Restbeträge eingerechnet.`;
  }

  function renderReferences(c) {
    const refs = [
      {name:'Bilanzgewinn 2025', amount:BILANZGEWINN_2025, tag:'vorgeschlagene Ausschüttung'},
      {name:'Jahresüberschuss 2025', amount:JAHRESUEBERSCHUSS_2025, tag:'Ergebnis des Geschäftsjahres'}
    ];
    $('referenceCards').innerHTML = refs.map(r => {
      const perPerson = safeDiv(r.amount, GROUP_EMPLOYEES);
      const relative = c.moneyGroup === null ? '—' : pct(safeDiv(c.moneyGroup, r.amount) * 100, 2);
      return `<article class="reference-card"><div class="reference-top"><h4>${r.name}</h4><div class="reference-amount">${euro0.format(r.amount)}</div><p>${r.tag}</p></div>`+
        `<div class="reference-values">`+
        profitMetric('pro Beschäftigtem/Jahr', euro0.format(perPerson))+
        profitMetric('pro Arbeitstag', euro2.format(safeDiv(perPerson,c.workdaysYear)))+
        profitMetric('pro Arbeitsstunde', euro2.format(safeDiv(perPerson,c.workhoursYear)))+
        `</div><div class="reference-share">Netto-/Brutto-Geldpaket als reine Größenrelation: <strong>${relative}</strong></div></article>`;
    }).join('');
  }

  function renderScenario(c) {
    if (c.scenarioCost === null) {
      $('scenarioResults').innerHTML = `<p class="notice strong">Keine addierbare Gesamtforderung bei gemischter Netto-/Bruttobasis. Das Kostenszenario wird daher nicht ausgewiesen.</p>`;
      return;
    }
    $('scenarioResults').innerHTML = `<div class="metrics">${[
      metric('Geldpaket für 300 Personen (ohne Umrechnung)', `${euro0.format(c.moneyGroup)} ${basisLabel(c.monthlyIncreaseBasis)}`),
      metric('Zusätzlich frei werdende Zeit', `${nf0.format(c.extraFreedHours)} Std./Jahr`, 'nur positive Zeitbilanz im Szenario bewertet'),
      metric('Angenommener jährlicher Geldaufwand', euro0.format(c.scenarioMoneyCost), `Geldpaket × ${nf1.format(c.costFactor)} (Szenario)`),
      metric('Angenommener Zeitwert/Jahr', euro0.format(c.scenarioTimeCost), `${euro2.format(c.timeHourlyCost)} je zusätzlicher freier Stunde`),
      metric('Kosten-Szenario gesamt', euro0.format(c.scenarioCost), 'keine betriebliche Kostenschätzung'),
      metric('Relation zu Bilanzgewinn / Jahresüberschuss', `${pct(safeDiv(c.scenarioCost,BILANZGEWINN_2025)*100)} / ${pct(safeDiv(c.scenarioCost,JAHRESUEBERSCHUSS_2025)*100)}`)
    ].join('')}</div>`;
  }

  function render() {
    const c = calculate();
    renderProfitState(c);
    renderReferences(c);
    renderScenario(c);

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
      metric('Zeitbilanz für uns/Jahr', `${c.annualTimeBalanceGroup >= 0 ? '+' : '−'}${nf0.format(Math.abs(c.annualTimeBalanceGroup))} Std.`, `mit ${nf1.format(c.workingWeeks)} Wochenäquivalenten`),
      metric('Stundenwert bei gleichem Monatsentgelt', `${c.hourlyValueRise > 0 ? '+' : ''}${pct(c.hourlyValueRise, 2)}`, 'rein rechnerisch aus der Wochenstundenänderung')
    ].join('');

    $('yearBasisNote').textContent = `${nf0.format(c.workdaysYear)} Arbeitstage ÷ ${nf1.format(c.daysPerWeek)} Tage je Woche = ${nf1.format(c.workingWeeks)} Wochenäquivalente. Bei ${nf1.format(c.hoursCurrent)} Std./Woche entsprechen sie ${nf0.format(c.workhoursYear)} Vergleichs-Arbeitsstunden/Jahr. Zeit- und Geldvergleich nutzen dieselbe Jahresbasis.`;

    // Ein separater, stets sichtbarer Jetzt/Dann-Vergleich je HGB-Größe.
    $('profitTables').innerHTML = c.profitComparisons.map(r => {
      const rows = [
        ['Jahr', r.nowYear, r.thenYear],
        ['Monat', r.nowMonth, r.thenMonth],
        ['Arbeitstag', r.nowDay, r.thenDay],
        ['Arbeitsstunde', r.nowHour, r.thenHour]
      ];
      const trs = rows.map(([label,now,then]) => {
        const delta = then === null ? null : now - then;
        const thenText = then === null ? '—' : euro2.format(then);
        const deltaText = delta === null ? '—' : label === 'Arbeitsstunde'
          ? `${delta > 0 ? '− ' : ''}${nf4.format(delta)} € (${nf2.format(delta * 100)} Cent)`
          : `${delta > 0 ? '− ' : ''}${euro2.format(delta)}`;
        return `<tr><th scope="row">${label}</th><td class="now-cell">${euro2.format(now)}</td><td class="then-cell">${thenText}</td><td>${deltaText}</td></tr>`;
      }).join('');
      return `<div class="comparison-table"><h4>${r.name}</h4>`+
        `<div class="delta-table-wrap"><table class="delta-table"><thead><tr><th scope="col">Zeitraum</th>`+
        `<th scope="col">Jetzt</th><th scope="col">Dann</th><th scope="col">Differenz</th></tr></thead><tbody>${trs}</tbody></table></div></div>`;
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
    lines.push('', 'Feste HGB-Berichtsgrößen 2025 der ERGO Group AG:');
    lines.push(`Zeitbasis: ${nf0.format(c.workdaysYear)} Arbeitstage / ${nf1.format(c.daysPerWeek)} Tage pro Woche = ${nf1.format(c.workingWeeks)} Wochenäquivalente = ${nf0.format(c.workhoursYear)} Stunden`);
    lines.push(`Entnahme aus Rücklagen 2025: ${euro2.format(RUECKLAGENENTNAHME_2025)}`);
    for (const r of c.profitComparisons) {
      lines.push('', `${r.name}: ${euro2.format(r.amount)}`);
      lines.push(`Pro Beschäftigtem/Jahr: ${euro2.format(r.nowYear)}`);
      lines.push(`Pro Arbeitstag: ${euro2.format(r.nowDay)}`);
      lines.push(`Pro Arbeitsstunde: ${euro2.format(r.nowHour)}`);
      if (r.thenAmount !== null) {
        lines.push(`Rechnerischer Rest nach Geldpaket: ${euro2.format(r.thenAmount)}`);
        lines.push(`Vergleich pro Beschäftigtem/Jahr: ${euro2.format(r.nowYear)} → ${euro2.format(r.thenYear)}`);
        lines.push(`Vergleich pro Arbeitsstunde: ${euro2.format(r.nowHour)} → ${euro2.format(r.thenHour)}`);
        lines.push(`Rechnerische Geldpaket-Relation: ${pct(r.reductionPct, 2)}`);
        if (r.exhausted) lines.push('Hinweis: Geldpaket übersteigt diese Berichtsgröße; Rest auf 0 € begrenzt.');
      } else {
        lines.push('Kein rechnerischer Rest bei gemischten Netto-/Bruttobasen.');
      }
    }
    if (c.scenarioCost !== null) {
      lines.push('', `Kostenszenario: Geldpaket × ${nf1.format(c.costFactor)} plus ${nf2.format(c.timeHourlyCost)} € je zusätzlicher freier Stunde`);
      lines.push(`Zusätzliche freie Stunden unserer Gruppe: ${nf1.format(c.extraFreedHours)} Std./Jahr`);
      lines.push(`Hypothetischer jährlicher Arbeitgeberaufwand gesamt: ${euro2.format(c.scenarioCost)}`);
      lines.push(`Davon im Verhältnis zum Bilanzgewinn: ${pct(safeDiv(c.scenarioCost, BILANZGEWINN_2025) * 100)}`);
      lines.push(`Davon im Verhältnis zum Jahresüberschuss: ${pct(safeDiv(c.scenarioCost, JAHRESUEBERSCHUSS_2025) * 100)}`);
    }
    lines.push('', 'Hinweis: Bilanzgewinn und Jahresüberschuss sind verschiedene HGB-Größen derselben Gesellschaft, keine erwirtschaftete Leistung pro Beschäftigtem. Die Division durch 15.000, 220 Tage bzw. 1.760 Stunden ist ein Größenvergleich. Die beiden festen „Dann“-Rechnungen sind keine Prognose tatsächlicher Ausschüttungen oder Arbeitgeberkosten; das Kostenmodell ist ein frei gesetztes Szenario.');
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
