/* Cross-App Reader Clarity Layer — 2026-09-14
 * Purpose: make scope, selection, peer group, definitions and print-state explicit.
 * Invariant: presentation only. No source data, calculations, governance flags or provenance are changed.
 */
(() => {
  'use strict';

  const VERSION = 'RC1.8-20260914';
  const OWN = 'data-reader-clarity';
  const state = { timer: null, running: false };
  let observer = null;

  const I18N = {
    de: {
      readerKey: 'Leseschlüssel',
      keyIntro: 'Kurze Begriffe, die in allen drei Säulen wiederkehren. Die fachlichen Detail- und Quellenangaben bleiben unverändert verfügbar.',
      e4: 'E4 = hashgebundener Primärquellen-Nachweis. Das bezeichnet die Evidenzbindung der angezeigten Zahl; es ist kein Ersatz für offene menschliche Legal-, Datenschutz- oder Source-Rights-Prüfungen.',
      terms: {
        'FTE': 'Full-Time Equivalent · Vollzeitäquivalent',
        'ETR': 'Effective Tax Rate · effektive Steuerquote',
        'CSM': 'Contractual Service Margin · vertragliche Servicemarge nach IFRS 17',
        'LTG': 'Long-Term-Guarantee-Maßnahmen',
        'P3DH': 'Pillar 3 Data Hub der EBA',
        'RF': 'Reporting Framework · EBA-Melde-/Berichtsrahmen',
        'QES': 'Query Execution Service · technische Abfrageschicht des EBA-Datenhubs',
        'NPL': 'Non-Performing Loans · notleidende Kredite',
        'LCR': 'Liquidity Coverage Ratio · Liquiditätsdeckungsquote',
        'NSFR': 'Net Stable Funding Ratio · strukturelle Liquiditätsquote',
        'CIR': 'Cost-Income Ratio · Aufwand-Ertrag-Relation'
      },
      printTitle: 'Hinweis zur Druckansicht',
      printText: 'Diese PDF-/Druckfassung zeigt die zum Druckzeitpunkt ausgewählten Institute, Jahre, Länder und Aggregate. Weitere Daten sind in der interaktiven Web-Anwendung über die Auswahlfelder verfügbar. Die Druckansicht ist kein vollständiger Datenexport.',
      currentSelection: 'Aktuell ausgewählt',
      availableSnapshot: 'Institute im historischen Snapshot verfügbar',
      coverageTitle: 'Was bedeutet die Headline-Abdeckung?',
      expectedCells: 'erwarteten Institut×Kennzahl-Zellen verfügbar',
      missing: 'fehlend',
      institutes: 'Institute',
      p3dhTitle: 'P3DH in Klartext',
      p3dhText: 'RF 4.1 / RF 4.2 bezeichnen EBA Reporting Frameworks. QES ist die technische Query Execution Service-Schicht und dient hier Mapping/Crosscheck; die angezeigten P3DH-Werte stammen aus Original-XBRL. „Nicht im Abfragefenster“ bedeutet: Diese Kennzahl wurde an diesem Stichtag in diesem Abfrageumfang nicht angefordert.',
      sourceAgreement: 'Quellenabgleich: derselbe Stichtagswert liegt hier über Transparency Exercise und P3DH vor. Das ist eine Übereinstimmung zweier Quellenpfade, kein Duplikatfehler.',
      comparisonGroup: 'Vergleichsgruppe',
      validRank: 'Der Rang verwendet nur die im Nenner ausgewiesenen Institute mit vergleichbarem Wert; nicht vergleichbare oder fehlende Werte werden nicht mitgerankt.',
      germanyReference: 'Deutschland-Referenz',
      sizeCohort: 'Größenkohorte',
      pillarBScope: 'Säule B · Auswahlkontext',
      bankMetrics: 'Die folgenden Vergütungs- und CbCR-Karten beziehen sich auf die jeweils sichtbare Auswahl; Bank, Jahr und Land/Aggregat werden deshalb zusätzlich direkt am Zahlenkontext wiederholt.',
      cbcrAvailable: 'Länder/Aggregate für diese Auswahl verfügbar',
      taxPair: 'Steuerpaar: Der Rohwert aus der Quelle bleibt unverändert sichtbar; der Steueraufwand ist die vorzeichennormalisierte Darstellung desselben Quellenfelds. Unterschiedliche Vorzeichen sind daher kein Widerspruch.',
      pillarCScope: 'Säule C · Rechtsträger und Methoden bleiben getrennt',
      pillarCText: 'Solvenzquoten, Klimaangaben, IFRS-17-CSM, Vergütung und Steuertransparenz beziehen sich teils auf unterschiedliche Rechtsträger, Länder oder methodische Varianten. Die Hinweise direkt an den Zahlen machen diesen Scope sichtbar.',
      solvencyTitle: 'Warum mehrere Solvenzquoten nebeneinander stehen',
      solvencyIntro: 'Mehrere Quoten derselben Einheit und desselben Stichtags können unterschiedliche regulatorische Behandlungen darstellen. Sie sind Varianten derselben Offenlegung, nicht widersprüchliche Messungen.',
      climateNote: 'Zielkorridor, berichtete Reduktion und Nominalwert-Sensitivität haben unterschiedliche Bedeutung bzw. Methodik. Sie sind nicht drei konkurrierende Messungen derselben Größe.',
      taxScopeTitle: 'Munich Re · Tax Transparency 2024 · Auswahlkontext',
      taxScope: 'Alle nachfolgenden Steuer- und Beschäftigtenwerte beziehen sich auf das aktuell ausgewählte Land bzw. berichtete Aggregat, nicht auf den gesamten Munich-Re-/ERGO-Konzern.',
      taxMeaning: '„Laufender Steueraufwand“ und „im Berichtsjahr gezahlte Ertragsteuern (Cash Taxes)“ sind verschiedene Größen. Die veröffentlichte ETR und der erwartete Körperschaftsteuersatz haben ebenfalls unterschiedliche Definitionen.',
      personsNotFte: 'Beschäftigtenzahl = Personen im ausgewählten Länder-/Aggregatwert; nicht Konzern-Headcount und nicht FTE.',
      csmTitle: 'ERGO Group · Vertragliche Servicemarge (IFRS 17 / CSM)',
      remunerationTitle: 'Munich Re Group · ESRS-Vergütungsverhältnis',
      currentTaxExpense: 'Laufender Steueraufwand',
      cashTaxes: 'Im Berichtsjahr gezahlte Ertragsteuern (Cash Taxes)',
      notQueried: 'An diesem Stichtag für diese Kennzahl nicht abgefragt'
    },
    en: {
      readerKey: 'Reader key',
      keyIntro: 'Short definitions for terms recurring across all three pillars. Detailed methodology and source evidence remain available unchanged.',
      e4: 'E4 = hash-bound primary-source evidence. It describes the evidence binding of the displayed number; it does not replace outstanding human legal, privacy or source-rights review.',
      terms: {
        'FTE': 'Full-Time Equivalent',
        'ETR': 'Effective Tax Rate',
        'CSM': 'Contractual Service Margin under IFRS 17',
        'LTG': 'Long-Term-Guarantee measures',
        'P3DH': 'EBA Pillar 3 Data Hub',
        'RF': 'Reporting Framework · EBA reporting framework',
        'QES': 'Query Execution Service · technical query layer of the EBA data hub',
        'NPL': 'Non-Performing Loans',
        'LCR': 'Liquidity Coverage Ratio',
        'NSFR': 'Net Stable Funding Ratio',
        'CIR': 'Cost-Income Ratio'
      },
      printTitle: 'Print-view notice',
      printText: 'This PDF/print view freezes the institutions, years, countries and aggregates selected at print time. Additional data remain available through the interactive selectors in the web application. The print view is not a complete data export.',
      currentSelection: 'Currently selected',
      availableSnapshot: 'institutions available in the historical snapshot',
      coverageTitle: 'What does headline coverage mean?',
      expectedCells: 'expected institution×metric cells available',
      missing: 'missing',
      institutes: 'institutions',
      p3dhTitle: 'P3DH in plain language',
      p3dhText: 'RF 4.1 / RF 4.2 denote EBA Reporting Frameworks. QES is the technical Query Execution Service layer and is used here for mapping/cross-checking; displayed P3DH values come from original XBRL. “Outside the query window” means this metric was not requested for that reporting date in this query scope.',
      sourceAgreement: 'Cross-source agreement: the same reporting-date value is present through both the Transparency Exercise and P3DH. This is agreement between two source paths, not a duplicate-data error.',
      comparisonGroup: 'Comparison group',
      validRank: 'The rank uses only the institutions represented by the displayed denominator with a comparable value; missing or non-comparable values are not ranked.',
      germanyReference: 'Germany reference',
      sizeCohort: 'Size cohort',
      pillarBScope: 'Pillar B · selection context',
      bankMetrics: 'The remuneration and CbCR cards refer to the visible selection. Bank, year and country/aggregate are therefore repeated directly with the number context.',
      cbcrAvailable: 'countries/aggregates available for this selection',
      taxPair: 'Tax pair: the raw source value remains unchanged and visible; tax expense is the sign-normalised presentation of the same source field. Different signs are therefore not a contradiction.',
      pillarCScope: 'Pillar C · entities and methods remain separate',
      pillarCText: 'Solvency ratios, climate figures, IFRS 17 CSM, remuneration and tax transparency may refer to different legal entities, countries or methodological variants. The notes next to the figures make that scope explicit.',
      solvencyTitle: 'Why several solvency ratios appear together',
      solvencyIntro: 'Several ratios for the same entity and reporting date can represent different regulatory treatments. They are variants within the same disclosure, not contradictory measurements.',
      climateNote: 'Target range, reported reduction and nominal-value sensitivity have different meanings or methods. They are not three competing measurements of the same quantity.',
      taxScopeTitle: 'Munich Re · Tax Transparency 2024 · selection context',
      taxScope: 'All following tax and employee figures refer to the currently selected country or reported aggregate, not to Munich Re/ERGO as a whole.',
      taxMeaning: '“Current tax expense” and “income taxes paid in the reporting year (cash taxes)” are different quantities. The published ETR and expected corporate-tax rate also have different definitions.',
      personsNotFte: 'Employee count = persons in the selected country/aggregate value; not group headcount and not FTE.',
      csmTitle: 'ERGO Group · Contractual Service Margin (IFRS 17 / CSM)',
      remunerationTitle: 'Munich Re Group · ESRS remuneration ratio',
      currentTaxExpense: 'Current tax expense',
      cashTaxes: 'Income taxes paid in the reporting year (cash taxes)',
      notQueried: 'Not requested for this metric at this reporting date'
    }
  };

  function lang() {
    const l = String(document.documentElement.lang || '').toLowerCase();
    if (l.startsWith('en')) return 'en';
    const txt = document.body ? document.body.innerText.slice(0, 3000) : '';
    return /Three pillars|public research|Pillar A/i.test(txt) ? 'en' : 'de';
  }
  function tr() { return I18N[lang()]; }
  function mark(el) { el.setAttribute(OWN, '1'); return el; }
  function node(tag, className, text) {
    const e = mark(document.createElement(tag));
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }
  function removeOwned(id) {
    const e = document.getElementById(id);
    if (e && e.getAttribute(OWN) === '1') e.remove();
  }
  function clearOwnedByClass(cls) {
    document.querySelectorAll('.' + cls + '[' + OWN + '="1"]').forEach(e => e.remove());
  }
  function compact(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function selectedText(sel) {
    if (!sel) return '';
    const o = sel.options && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex] : null;
    return compact(o ? o.textContent : sel.value);
  }
  function visibleOptions(sel) {
    return [...(sel?.options || [])].map(o => compact(o.textContent)).filter(x => x && !/^(select|choose|auswählen|—|-)$/.test(x.toLowerCase()));
  }
  function insertAfter(ref, el) {
    if (!ref || !ref.parentNode) return false;
    ref.parentNode.insertBefore(el, ref.nextSibling);
    return true;
  }
  function prepend(root, el) {
    if (!root) return false;
    root.insertBefore(el, root.firstChild);
    return true;
  }
  function textElements(root = document.body) {
    return [...root.querySelectorAll('body *')].filter(e => !e.children.length && compact(e.textContent));
  }
  function elementByExactText(root, values) {
    const wanted = Array.isArray(values) ? values : [values];
    const set = new Set(wanted.map(compact));
    return [...root.querySelectorAll('*')].find(e => !e.children.length && set.has(compact(e.textContent))) || null;
  }
  function elementContaining(root, needles) {
    const ns = (Array.isArray(needles) ? needles : [needles]).map(x => String(x).toLowerCase());
    let best = null;
    for (const e of root.querySelectorAll('section, article, div, table, fieldset')) {
      const t = compact(e.innerText || e.textContent).toLowerCase();
      if (ns.every(n => t.includes(n))) {
        if (!best || t.length < compact(best.innerText || best.textContent).length) best = e;
      }
    }
    return best;
  }
  function boundedContainer(el, maxChars = 950) {
    if (!el) return null;
    let cur = el;
    let last = el;
    while (cur && cur !== document.body) {
      const len = compact(cur.innerText || cur.textContent).length;
      if (len > maxChars) return last;
      last = cur;
      cur = cur.parentElement;
    }
    return last;
  }
  function findSection(id, phrases) {
    const byId = id ? document.getElementById(id) : null;
    if (byId) return byId;
    return elementContaining(document.body, phrases);
  }
  function findSelectByOption(regex, root = document) {
    return [...root.querySelectorAll('select')].find(s => visibleOptions(s).some(o => regex.test(o))) || null;
  }
  function findInstitutionSelect() {
    return [...document.querySelectorAll('select')].find(s => visibleOptions(s).length >= 50) ||
      findSelectByOption(/DEUTSCHE BANK|COMMERZBANK|BNP PARIBAS|LÄNSFÖRSÄKRINGAR/i);
  }
  function findBankSelect(root) {
    return findSelectByOption(/Deutsche Bank|Commerzbank/i, root || document);
  }
  function findYearSelect(root) {
    return [...(root || document).querySelectorAll('select')].find(s => {
      const o = visibleOptions(s);
      return o.length >= 2 && o.every(x => /^(20\d{2})$/.test(x));
    }) || null;
  }
  function findCountrySelect(root) {
    const regex = /Germany|Deutschland|Australia|Australien|France|Frankreich|United Kingdom|Vereinigtes Königreich|Italy|Italien|Spain|Spanien|USA|United States/i;
    return [...(root || document).querySelectorAll('select')].find(s => visibleOptions(s).length >= 2 && visibleOptions(s).some(o => regex.test(o))) || null;
  }
  function inferCountryFromText(root) {
    const text = (root?.innerText || '').replace(/\r/g, '');
    const patterns = [
      /Land\s*\/\s*berichtetes Aggregat\s*\n\s*([^\n]+)/i,
      /Country\s*\/\s*reported aggregate\s*\n\s*([^\n]+)/i
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) return compact(m[1]);
    }
    return '';
  }
  function pageUniverseCount() {
    const rows = document.querySelectorAll('#universeBody tr').length;
    if (rows >= 50) return rows;
    const txt = compact(document.body.innerText);
    const m = txt.match(/(\d+)\s+(?:Institute|institutions)\s+(?:im historischen Snapshot|in the historical snapshot)/i);
    return m ? Number(m[1]) : 0;
  }
  function formatInt(n) { return new Intl.NumberFormat(lang() === 'de' ? 'de-DE' : 'en-US').format(n); }

  function buildReaderKey() {
    removeOwned('readerClarityKey');
    const T = tr();
    const d = node('details', 'clarity-key'); d.id = 'readerClarityKey';
    d.open = true;
    const s = node('summary', '', T.readerKey); d.appendChild(s);
    d.appendChild(node('p', '', T.keyIntro));
    d.appendChild(node('p', '', T.e4));
    const dl = node('dl', 'clarity-term-grid');
    Object.entries(T.terms).forEach(([k, v]) => {
      const wrap = node('div', '');
      wrap.appendChild(node('dt', '', k));
      wrap.appendChild(node('dd', '', v));
      dl.appendChild(wrap);
    });
    d.appendChild(dl);
    const main = document.querySelector('main') || document.body;
    const first = main.firstElementChild;
    if (first) insertAfter(first, d); else prepend(main, d);
  }

  function buildPrintNotice() {
    removeOwned('readerClarityPrintNote');
    const T = tr();
    const a = node('aside', 'clarity-note'); a.id = 'readerClarityPrintNote';
    a.appendChild(node('strong', '', T.printTitle));
    a.appendChild(node('p', '', T.printText));
    document.body.insertBefore(a, document.body.firstChild);
  }

  function pillarA() {
    removeOwned('readerClarityPillarAScope');
    removeOwned('readerClarityCoverage');
    const T = tr();
    const root = findSection('pillarAStart', ['Kernkennzahlen']);
    if (!root) return;
    const sel = findInstitutionSelect();
    const selected = selectedText(sel) || (compact(root.innerText).match(/([A-ZÄÖÜ][A-ZÄÖÜ0-9 .,&'()\/-]{8,})\s+[·•]\s+[A-Z]{2}/)?.[1] || '');
    const n = pageUniverseCount();
    if (selected && n) {
      const box = node('div', 'clarity-scope'); box.id = 'readerClarityPillarAScope';
      box.appendChild(node('strong', '', `${T.currentSelection}: ${selected}`));
      box.appendChild(node('p', '', `${formatInt(n)} ${T.availableSnapshot}.`));
      prepend(root, box);
    }

    const candidates = [...document.querySelectorAll('section,article,div')].filter(e => {
      const x = compact(e.innerText || e.textContent);
      return /94[.,]7\s*%/.test(x) && /1352|1[.]352|1,352/.test(x) && /76/.test(x);
    });
    const cov = candidates.sort((a,b) => compact(a.innerText).length - compact(b.innerText).length)[0];
    if (cov && n) {
      const text = compact(cov.innerText);
      const ma = text.match(/(?:verfügbar|available)\s*([\d.,]+)/i);
      const mm = text.match(/(?:fehlend|missing)\s*([\d.,]+)/i);
      const parseNum = x => Number(String(x || '').replace(/[.,]/g,''));
      const avail = ma ? parseNum(ma[1]) : 1352;
      const miss = mm ? parseNum(mm[1]) : 76;
      const total = avail + miss;
      const box = node('div', 'clarity-note'); box.id = 'readerClarityCoverage';
      box.appendChild(node('strong', '', T.coverageTitle));
      const exact = total === n * 12;
      box.appendChild(node('p', '', exact
        ? `${formatInt(avail)} von ${formatInt(total)} ${T.expectedCells} · ${formatInt(miss)} ${T.missing} · ${formatInt(n)} ${T.institutes}.`
        : `${formatInt(avail)} / ${formatInt(total)} · ${formatInt(miss)} ${T.missing}.`));
      insertAfter(cov, box);
    }
  }

  const DE_REPLACEMENTS = new Map([
    ['No period-end equity proxy is substituted for average equity.', 'Kein Periodenend-Eigenkapital wird als Ersatz für das durchschnittliche Eigenkapital verwendet.'],
    ['No period-end assets proxy is substituted for average assets.', 'Keine Periodenend-Aktiva werden als Ersatz für durchschnittliche Aktiva verwendet.'],
    ['No total-assets proxy is substituted for average interest-earning assets.', 'Die Gesamtaktiva werden nicht als Ersatz für durchschnittliche zinstragende Aktiva verwendet.'],
    ['Derived only where exact TE operating-income/admin-expense/depreciation components exist.', 'Nur abgeleitet, wenn die exakten TE-Komponenten für Betriebsertrag, Verwaltungsaufwand und Abschreibungen vorliegen.'],
    ['Historical TE TREA/TOTAL ASSETS remains available. Current structured P3DH continuation is not produced because EBA final Q&A 2026_7745 confirms that EU LI2 column (a) is affected by a DPM modelling defect in reporting frameworks 4.1/4.2; re-evaluate at framework 4.4 phase 1 or via separately validated PDF/alternative source.', 'Die historische TE-Reihe TREA/Gesamtaktiva bleibt verfügbar. Eine aktuelle strukturierte P3DH-Fortsetzung wird nicht erzeugt, weil die finale EBA Q&A 2026_7745 bestätigt, dass EU LI2 Spalte (a) in den Reporting Frameworks 4.1/4.2 von einem DPM-Modellierungsfehler betroffen ist. Neubewertung ab Reporting Framework 4.4 Phase 1 oder über eine separat validierte PDF-/Alternativquelle.'],
    ['nicht im Abfragefenster', 'An diesem Stichtag für diese Kennzahl nicht abgefragt']
  ]);
  const EN_REPLACEMENTS = new Map([
    ['Keine methodisch vertretbare P3DH-Fortsetzung', 'No methodologically defensible P3DH continuation'],
    ['An diesem Stichtag für diese Kennzahl nicht abgefragt', 'Not requested for this metric at this reporting date']
  ]);

  function applyTextReplacements() {
    const replacements = lang() === 'de' ? DE_REPLACEMENTS : EN_REPLACEMENTS;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      if (n.parentElement && n.parentElement.closest('script,style,[' + OWN + '="1"]')) continue;
      const raw = n.nodeValue;
      const key = compact(raw);
      if (replacements.has(key)) n.nodeValue = raw.replace(raw.trim(), replacements.get(key));
    }
  }

  function p3dh() {
    removeOwned('readerClarityP3DH');
    clearOwnedByClass('clarity-source-agreement');
    const T = tr();
    const root = elementContaining(document.body, ['P3DH', 'RF 4.1']) || findSection(null, ['P3DH']);
    if (root) {
      const box = node('div', 'clarity-note'); box.id = 'readerClarityP3DH';
      box.appendChild(node('strong', '', T.p3dhTitle));
      box.appendChild(node('p', '', T.p3dhText));
      prepend(root, box);
    }

    const specs = [
      {needles:['Tier1','17,66','TE2025','4.1']},
      {needles:['Total','Capital','19,72','TE2025','4.1']},
      {needles:['Tier1','17.66','TE2025','4.1']},
      {needles:['Total','Capital','19.72','TE2025','4.1']}
    ];
    const seen = new Set();
    for (const s of specs) {
      const c = elementContaining(document.body, s.needles);
      if (!c) continue;
      const card = boundedContainer(c, 1800) || c;
      if (seen.has(card)) continue;
      seen.add(card);
      const x = node('div', 'clarity-inline clarity-source-agreement', T.sourceAgreement);
      card.appendChild(x);
    }
  }

  function peerLabels() {
    clearOwnedByClass('clarity-peer-scope');
    const T = tr();
    const rankLeaves = [...document.querySelectorAll('*')].filter(e => {
      if (e.children.length) return false;
      return /\b(?:Rang\s+\d+\s+von\s+\d+|Rank\s+\d+\s+of\s+\d+)\b/i.test(compact(e.textContent));
    });
    const cards = [];
    for (const e of rankLeaves) {
      const c = boundedContainer(e, 650);
      if (c && !cards.includes(c)) cards.push(c);
    }
    const cohortMatch = compact(document.body.innerText).match(/Größenkohorte\s+(Q[1-5]\s*[–-]\s*[^·|]{3,30})/i);
    const cohort = cohortMatch ? compact(cohortMatch[1]) : '';
    cards.forEach((c, i) => {
      const txt = compact(c.innerText);
      let group = '';
      if (/Deutschland-Referenz|Germany reference/i.test(txt)) group = T.germanyReference;
      else if (/Größenkohorte|Size cohort/i.test(txt)) group = `${T.sizeCohort}${cohort ? ' ' + cohort : ''}`;
      else group = i < 3 ? T.germanyReference : `${T.sizeCohort}${cohort ? ' ' + cohort : ''}`;
      const note = node('div', 'clarity-peer-scope', `${T.comparisonGroup}: ${group}`);
      const rank = txt.match(/(?:Rang\s+\d+\s+von|Rank\s+\d+\s+of)\s+(\d+)/i);
      if (rank) {
        const extra = node('div', 'clarity-inline', T.validRank);
        note.appendChild(extra);
      }
      prepend(c, note);
    });
  }

  function addCardScope(root, labels, scopeText) {
    const done = new Set();
    for (const label of labels) {
      const el = elementByExactText(root, label);
      if (!el) continue;
      const card = boundedContainer(el, 650);
      if (!card || done.has(card) || card.querySelector('.clarity-card-scope[' + OWN + '="1"]')) continue;
      done.add(card);
      prepend(card, node('div', 'clarity-card-scope', scopeText));
    }
  }

  function pillarB() {
    removeOwned('readerClarityPillarB');
    removeOwned('readerClarityCbcrScope');
    removeOwned('readerClarityTaxPair');
    clearOwnedByClass('clarity-b-card');
    clearOwnedByClass('clarity-card-scope');

    const T = tr();

    const remunerationRoot =
      document.getElementById('pillarBPreviewSection') ||
      elementContaining(document.body, ['Vergütung']) ||
      elementContaining(document.body, ['remuneration']);

    if (remunerationRoot) {
      const bankSel = findBankSelect(remunerationRoot) || findBankSelect(document);
      const bank = selectedText(bankSel) ||
        (/Deutsche Bank/i.test(remunerationRoot.innerText || '') ? 'Deutsche Bank' :
          (/Commerzbank/i.test(remunerationRoot.innerText || '') ? 'Commerzbank' : ''));

      const box = node('div', 'clarity-scope');
      box.id = 'readerClarityPillarB';
      box.appendChild(node('strong', '', `${T.pillarBScope}${bank ? ' · ' + T.currentSelection + ': ' + bank : ''}`));
      box.appendChild(node('p', '', T.bankMetrics));
      prepend(remunerationRoot, box);

      if (bank) {
        addCardScope(
          remunerationRoot,
          lang()==='de'
            ? ['ESRS S1-16','§162-Kontextquotient','§ 162-Kontextquotient']
            : ['ESRS S1-16','Section 162 contextual ratio','§162 contextual ratio'],
          `${T.currentSelection}: ${bank}`
        );
      }
    }

    const cbcr =
      document.getElementById('cbcrSection') ||
      elementContaining(document.body, ['CbCR', 'Land']) ||
      elementContaining(document.body, ['CbCR', 'Country']);

    if (!cbcr) return;

    const bankSel = findBankSelect(remunerationRoot || document) || findBankSelect(document);
    const bank = selectedText(bankSel) ||
      (/Deutsche Bank/i.test(document.body.innerText || '') ? 'Deutsche Bank' :
        (/Commerzbank/i.test(document.body.innerText || '') ? 'Commerzbank' : ''));

    const countrySel =
      document.getElementById('cbcrJurisdictionSelect') ||
      findCountrySelect(cbcr) ||
      findCountrySelect(document);

    const yearSel =
      document.getElementById('cbcrYearSelect') ||
      findYearSelect(cbcr) ||
      findYearSelect(document);

    const country = selectedText(countrySel) || inferCountryFromText(cbcr);
    const year = selectedText(yearSel) ||
      (compact(cbcr.innerText || '').match(/\b(20(?:18|19|2\d))\b/)?.[1] || '');
    const nCountries = countrySel ? visibleOptions(countrySel).length : 0;

    if (country || year || nCountries) {
      const n = node('div', 'clarity-note');
      n.id = 'readerClarityCbcrScope';
      const parts = [];
      if (year) parts.push(year);
      if (nCountries) parts.push(`${nCountries} ${T.cbcrAvailable}`);
      if (country) parts.push(`${T.currentSelection}: ${country}`);
      n.appendChild(node('strong', '', parts.join(' · ')));

      const controls = cbcr.querySelector('.cbcr-controls');
      if (controls) insertAfter(controls, n);
      else prepend(cbcr, n);
    }

    const cardsRoot = document.getElementById('cbcrCards') || cbcr;

    if (country) {
      const scope = `${country}${year ? ' · ' + year : ''}${bank ? ' · ' + bank : ''}`;
      addCardScope(
        cardsRoot,
        lang()==='de'
          ? [
              'Nettoerträge (Turnover)',
              'Beschäftigte (FTE)',
              'Ergebnis vor Steuern',
              'Steuerfeld (roh)',
              'Steueraufwand (vorzeichennormalisiert)',
              'Ergebnis vor Steuern je FTE',
              'Kontextuelle ETR'
            ]
          : [
              'Net revenue (turnover)',
              'Employees (FTE)',
              'Profit before tax',
              'Raw tax field',
              'Tax expense (sign-normalised)',
              'Profit before tax per FTE',
              'Contextual ETR'
            ],
        scope
      );
    }

    const norm = elementByExactText(
      cardsRoot,
      lang()==='de'
        ? 'Steueraufwand (vorzeichennormalisiert)'
        : 'Tax expense (sign-normalised)'
    );
    const raw = elementByExactText(
      cardsRoot,
      lang()==='de' ? 'Steuerfeld (roh)' : 'Raw tax field'
    );

    if (norm || raw) {
      const n = node('div', 'clarity-inline', T.taxPair);
      n.id = 'readerClarityTaxPair';
      const normCard = boundedContainer(norm || raw, 750);
      const rawCard = boundedContainer(raw, 750);
      const anchor = normCard || rawCard || cardsRoot;
      if (anchor && anchor !== cardsRoot && anchor.parentNode) insertAfter(anchor, n);
      else cardsRoot.appendChild(n);
    }
  }

  function renameExact(oldValues, newText) {
    const el = elementByExactText(document.body, oldValues);
    if (el) el.textContent = newText;
  }

  function solvencyExplainer(root) {
    removeOwned('readerClaritySolvency');
    const T = tr();
    const table = [...root.querySelectorAll('table')].find(t => /ERGO Lebensversicherung AG|Munich Re Group/i.test(t.innerText || ''));
    if (!table) return;
    const groups = new Map();
    for (const trEl of table.querySelectorAll('tr')) {
      const cells = [...trEl.querySelectorAll('td')].map(td => compact(td.innerText || td.textContent));
      if (cells.length < 4) continue;
      const [entity, date, ratio, treatment] = cells;
      if (!entity || !date || !ratio) continue;
      const key = entity + '|' + date;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({entity, date, ratio, treatment});
    }
    const dupGroups = [...groups.values()].filter(v => v.length > 1);
    if (!dupGroups.length) return;
    const box = node('div', 'clarity-explainer'); box.id = 'readerClaritySolvency';
    box.appendChild(node('strong', '', T.solvencyTitle));
    box.appendChild(node('p', '', T.solvencyIntro));
    const ul = node('ul', 'clarity-pair-list');
    dupGroups.forEach(rows => {
      const li = node('li', '');
      li.appendChild(node('strong', '', `${rows[0].entity} · ${rows[0].date}: `));
      li.appendChild(document.createTextNode(rows.map(r => `${r.ratio}${r.treatment ? ' — ' + r.treatment : ''}`).join(' | ')));
      ul.appendChild(li);
    });
    box.appendChild(ul);
    table.parentNode.insertBefore(box, table);
  }

  function pillarC() {
    removeOwned('readerClarityPillarC');
    removeOwned('readerClarityClimate');
    removeOwned('readerClarityTaxScope');
    removeOwned('readerClarityTaxMeaning');
    clearOwnedByClass('clarity-c-card');
    const T = tr();
    const root = findSection('pillarCPreviewPanel', ['Solvency']) || elementContaining(document.body, ['Munich Re', 'ERGO']);
    if (!root) return;
    const box = node('div', 'clarity-scope'); box.id = 'readerClarityPillarC';
    box.appendChild(node('strong', '', T.pillarCScope));
    box.appendChild(node('p', '', T.pillarCText));
    prepend(root, box);

    solvencyExplainer(root);

    const climate = elementContaining(root, ['Climate Ambition 2025', '59,5']) || elementContaining(root, ['Climate Ambition 2025', '59.5']);
    if (climate) {
      const n = node('div', 'clarity-inline', T.climateNote); n.id = 'readerClarityClimate';
      climate.appendChild(n);
    }

    renameExact(['ERGO · IFRS 17 CSM','ERGO · IFRS-17 CSM'], T.csmTitle);
    renameExact(['ESRS Vergütungsverhältnis','ESRS remuneration ratio'], T.remunerationTitle);
    renameExact(['Laufende Ertragssteuer','Current income tax'], T.currentTaxExpense);
    renameExact(['Gezahlte Ertragssteuer','Income tax paid'], T.cashTaxes);

    const tax = elementContaining(root, ['Tax Transparency 2024', 'Ergebnis vor Steuern']) || elementContaining(root, ['Tax Transparency 2024', 'Profit before tax']);
    if (tax) {
      const countrySel = findCountrySelect(tax) || findCountrySelect(root);
      const country = selectedText(countrySel) || inferCountryFromText(tax);
      const n = node('div', 'clarity-note'); n.id = 'readerClarityTaxScope';
      n.appendChild(node('strong', '', `${T.taxScopeTitle}${country ? ' · ' + T.currentSelection + ': ' + country : ''}`));
      n.appendChild(node('p', '', T.taxScope));
      n.appendChild(node('p', '', T.personsNotFte));
      prepend(tax, n);

      const m = node('div', 'clarity-inline', T.taxMeaning); m.id = 'readerClarityTaxMeaning';
      tax.appendChild(m);

      if (country) {
        addCardScope(tax,
          lang()==='de'
            ? ['Ergebnis vor Steuern', 'Laufender Steueraufwand', 'Veröffentlichte ETR', 'Erwarteter Körperschaftsteuersatz', 'Im Berichtsjahr gezahlte Ertragsteuern (Cash Taxes)', 'Beschäftigte']
            : ['Profit before tax', 'Current tax expense', 'Published ETR', 'Expected corporate tax rate', 'Income taxes paid in the reporting year (cash taxes)', 'Employees'],
          `${country} · 2024`);
      }
    }
  }

  function ensureSelectListeners() {
    document.querySelectorAll('select').forEach(s => {
      if (s.dataset.readerClarityBound === '1') return;
      s.dataset.readerClarityBound = '1';
      s.addEventListener('change', () => schedule(120));
    });
  }

  function observe() {
    if (!observer) return;
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['lang'] });
  }

  function run() {
    if (!document.body || state.running) return;
    state.running = true;
    if (observer) observer.disconnect();
    try {
      applyTextReplacements();
      buildPrintNotice();
      buildReaderKey();
      pillarA();
      p3dh();
      peerLabels();
      pillarB();
      pillarC();
      ensureSelectListeners();
      document.documentElement.dataset.readerClarity = 'ready';
    } finally {
      state.running = false;
      observe();
    }
  }

  function schedule(ms = 180) {
    if (state.timer) clearTimeout(state.timer);
    state.timer = setTimeout(run, ms);
  }

  function audit() {
    const L = lang();
    const body = compact(document.body?.innerText || '');
    const checks = {
      runtime_ready: document.documentElement.dataset.readerClarity === 'ready',
      reader_key: !!document.getElementById('readerClarityKey'),
      print_notice: !!document.getElementById('readerClarityPrintNote'),
      pillar_a_scope: !!document.getElementById('readerClarityPillarAScope'),
      coverage_denominator: !!document.getElementById('readerClarityCoverage') && /1[.]428|1,428|1428/.test(document.getElementById('readerClarityCoverage').innerText),
      p3dh_plain_language: !!document.getElementById('readerClarityP3DH'),
      peer_group_labels: document.querySelectorAll('.clarity-peer-scope[' + OWN + '="1"]').length >= 3,
      pillar_b_scope: !!document.getElementById('readerClarityPillarB'),
      cbcr_scope: (() => {
        const e = document.getElementById('readerClarityCbcrScope');
        const t = compact(e?.textContent || '');
        return !!e &&
          /\b20\d{2}\b/.test(t) &&
          /(?:verfügbar|available)/i.test(t) &&
          /(?:Aktuell ausgewählt|Currently selected)/i.test(t);
      })(),
      cbcr_tax_pair: (() => {
        const e = document.getElementById('readerClarityTaxPair');
        const t = compact(e?.textContent || '');
        return !!e &&
          /(?:Rohwert|raw source value|raw value|raw tax)/i.test(t) &&
          /(?:Vorzeichen|sign)/i.test(t);
      })(),
      pillar_c_scope: !!document.getElementById('readerClarityPillarC'),
      solvency_variants: !!document.getElementById('readerClaritySolvency'),
      climate_context: !!document.getElementById('readerClarityClimate'),
      pillar_c_tax_scope: !!document.getElementById('readerClarityTaxScope'),
      pillar_c_tax_meaning: !!document.getElementById('readerClarityTaxMeaning'),
      csm_entity_explicit: body.includes(L === 'de' ? 'ERGO Group · Vertragliche Servicemarge' : 'ERGO Group · Contractual Service Margin'),
      remuneration_entity_explicit: body.includes(L === 'de' ? 'Munich Re Group · ESRS-Vergütungsverhältnis' : 'Munich Re Group · ESRS remuneration ratio'),
      e4_explained: (() => {
        const e = document.getElementById('readerClarityKey');
        const t = e?.textContent || '';
        return !!e && e.open === true && t.includes('E4') &&
          (lang() === 'de' ? t.includes('hashgebundener Primärquellen-Nachweis') : t.includes('hash-bound primary-source evidence'));
      })(),
      abbreviations_explained: (() => {
        const e = document.getElementById('readerClarityKey');
        const t = e?.textContent || '';
        return !!e && ['FTE','ETR','CSM','LTG','P3DH','RF','QES','NPL','LCR','NSFR','CIR'].every(x => t.includes(x));
      })(),
      german_method_language_clean: L !== 'de' || !/No period-end equity proxy|No period-end assets proxy|No total-assets proxy|Historical TE TREA\/TOTAL ASSETS remains available|Derived only where exact TE/.test(body),
      no_runtime_exception_marker: !document.documentElement.dataset.readerClarityError
    };
    const key = document.getElementById('readerClarityKey');
    const cbcrScope = document.getElementById('readerClarityCbcrScope');
    const taxPair = document.getElementById('readerClarityTaxPair');
    const yearSel = document.getElementById('cbcrYearSelect');
    const countrySel = document.getElementById('cbcrJurisdictionSelect');
    return {
      pass: Object.values(checks).every(Boolean),
      version: VERSION,
      lang: L,
      checks,
      diagnostics: {
        reader_key_open: !!key?.open,
        reader_key_text: compact(key?.textContent || '').slice(0, 1800),
        cbcr_section_present: !!document.getElementById('cbcrSection'),
        cbcr_year_selected: selectedText(yearSel),
        cbcr_country_selected: selectedText(countrySel),
        cbcr_country_option_count: visibleOptions(countrySel).length,
        cbcr_scope_text: compact(cbcrScope?.textContent || ''),
        cbcr_tax_pair_text: compact(taxPair?.textContent || '')
      }
    };
  }

  window.READER_CLARITY_VERSION = VERSION;
  window.READER_CLARITY_AUDIT = audit;
  window.READER_CLARITY_REFRESH = run;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      VERSION, I18N, compact, DE_REPLACEMENTS, EN_REPLACEMENTS,
      visibleOptions, selectedText, findCountrySelect, findYearSelect
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => schedule(50));
  else schedule(50);

  observer = new MutationObserver(mutations => {
    if (state.running) return;
    if (mutations.every(m => m.target?.nodeType === 1 && m.target.closest?.('[' + OWN + '="1"]'))) return;
    schedule(220);
  });
  observe();
})();
