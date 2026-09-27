/* Finance/Insurance2Agent — global presentation i18n/readability layer
 * Presentation only. Canonical values/codes remain untouched in data and code/pre audit areas.
 * Version 1.0 — 2026-09-27
 */
(function (global) {
  "use strict";

  const EXACT = {
    INSURANCE_GROUP:{de:"Versicherungsgruppe",en:"Insurance group"},
    INSURANCE_UNDERTAKING:{de:"Versicherungsunternehmen",en:"Insurance undertaking"},
    CREDIT_INSTITUTION:{de:"Kreditinstitut",en:"Credit institution"},
    BANK:{de:"Bank",en:"Bank"},
    SOLVENCY_II_EEA:{de:"Solvency II (EWR)",en:"Solvency II (EEA)"},
    SOLVENCY_II:{de:"Solvency II",en:"Solvency II"},
    SST:{de:"Schweizer Solvenztest (SST)",en:"Swiss Solvency Test (SST)"},
    SWISS_SOLVENCY_TEST:{de:"Schweizer Solvenztest (SST)",en:"Swiss Solvency Test (SST)"},
    EBA_BANKING:{de:"EBA-Bankenaufsicht",en:"EBA banking"},
    SOURCE_FACT:{de:"Quellenfakt",en:"Source fact"},
    NORMALIZED_FACT:{de:"Normalisierter Fakt",en:"Normalized fact"},
    DERIVED_FACT:{de:"Abgeleiteter Fakt",en:"Derived fact"},
    STATISTICAL_RESULT:{de:"Statistisches Ergebnis",en:"Statistical result"},
    EXACTLY_COMPARABLE:{de:"Exakt vergleichbar",en:"Exactly comparable"},
    COMPARABLE_AFTER_EXPLICIT_TRANSFORM:{de:"Nach expliziter Transformation vergleichbar",en:"Comparable after explicit transformation"},
    APPROXIMATE_ONLY:{de:"Nur näherungsweise vergleichbar",en:"Approximate comparison only"},
    NOT_COMPARABLE:{de:"Nicht vergleichbar",en:"Not comparable"},
    UNRESOLVED:{de:"Ungeklärt",en:"Unresolved"},
    GROUP_CONSOLIDATED:{de:"Konsolidierte Gruppe",en:"Consolidated group"},
    REFERENCE_DATE:{de:"Stichtag",en:"Reference date"},
    RATIO_MULTIPLE:{de:"Verhältnis (×)",en:"Ratio (×)"},
    PERCENT:{de:"Prozent",en:"Percent"},
    BASIS_POINTS:{de:"Basispunkte",en:"Basis points"},
    EUR_MILLION:{de:"Mio. EUR",en:"EUR million"},
    EUR_THOUSAND:{de:"Tsd. EUR",en:"EUR thousand"},
    EUR:{de:"EUR",en:"EUR"},
    E4_HASH_BOUND_EVIDENCE:{de:"Hashgebundene Evidenz (E4)",en:"Hash-bound evidence (E4)"},
    APP_DEFINED_HEURISTIC:{de:"App-definierte Heuristik",en:"App-defined heuristic"},
    OPEN_DETERMINISTIC:{de:"Offen – deterministisch",en:"Open — deterministic"},
    OPEN:{de:"Offen",en:"Open"},
    CLOSED:{de:"Geschlossen",en:"Closed"},
    TARGET_DECLARED:{de:"Zielzustand deklariert",en:"Target declared"},
    PILLAR_C_SCALAR_SOURCE_FACT:{de:"Primärquellenwert",en:"Primary-source value"},
    MUNICH_RE_GROUP:{de:"Munich Re Group",en:"Munich Re Group"},
    HANNOVER_RE_GROUP:{de:"Hannover Re Group",en:"Hannover Re Group"},
    ALLIANZ_GROUP:{de:"Allianz Group",en:"Allianz Group"},
    AXA_GROUP:{de:"AXA Group",en:"AXA Group"},
    GENERALI_GROUP:{de:"Generali Group",en:"Generali Group"},
    SCOR_GROUP:{de:"SCOR Group",en:"SCOR Group"},
    NN_GROUP:{de:"NN Group",en:"NN Group"},
    AGEAS_GROUP:{de:"Ageas Group",en:"Ageas Group"},
    UNIQA_GROUP:{de:"UNIQA Group",en:"UNIQA Group"},
    VIG_INSURANCE_GROUP:{de:"VIG Insurance Group",en:"VIG Insurance Group"},
    ERGO_GROUP:{de:"ERGO Group",en:"ERGO Group"},
    TALANX_GROUP:{de:"Talanx Group",en:"Talanx Group"},
    SWISS_RE_GROUP:{de:"Swiss Re Group",en:"Swiss Re Group"},
    ZURICH_INSURANCE_GROUP:{de:"Zurich Insurance Group",en:"Zurich Insurance Group"}
  };

  const METRICS = {
    PILLAR_B_ESRS_HIGHEST_PAID_TO_MEDIAN:{
      de:"ESRS S1-16: Vergütungsverhältnis – höchstbezahlte Person / Median der Beschäftigten",
      en:"ESRS S1-16: remuneration ratio — highest-paid individual / median employee"
    },
    ESRS_HIGHEST_PAID_TO_MEDIAN:{
      de:"ESRS S1-16: Vergütungsverhältnis – höchstbezahlte Person / Median der Beschäftigten",
      en:"ESRS S1-16: remuneration ratio — highest-paid individual / median employee"
    },
    PILLAR_C_SOLVENCY_II_RATIO_PERCENT:{de:"Solvency-II-Quote",en:"Solvency II ratio"},
    PILLAR_C_SOLVENCY_II_ELIGIBLE_OWN_FUNDS_FOR_SCR:{
      de:"Anrechenbare Eigenmittel für die SCR-Bedeckung",
      en:"Eligible own funds for SCR"
    },
    PILLAR_C_SOLVENCY_II_SCR:{de:"Solvenzkapitalanforderung (SCR)",en:"Solvency Capital Requirement (SCR)"},
    PILLAR_C_SOLVENCY_II_MCR:{de:"Mindestkapitalanforderung (MCR)",en:"Minimum Capital Requirement (MCR)"},
    PILLAR_C_SOLVENCY_II_MCR_PERCENT:{de:"MCR-Bedeckungsquote",en:"MCR coverage ratio"},
    PILLAR_C_COMBINED_RATIO:{de:"Combined Ratio",en:"Combined ratio"},
    PILLAR_C_IFRS17_CSM:{de:"IFRS 17: vertragliche Servicemarge (CSM)",en:"IFRS 17 contractual service margin (CSM)"},
    PILLAR_C_INSURANCE_REVENUE:{de:"Versicherungsumsatz",en:"Insurance revenue"},
    PILLAR_C_INSURANCE_SERVICE_RESULT:{de:"Versicherungstechnisches Ergebnis nach IFRS 17",en:"Insurance service result"},
    PILLAR_B_CET1_RATIO:{de:"Harte Kernkapitalquote (CET1)",en:"Common Equity Tier 1 (CET1) ratio"},
    PILLAR_B_LEVERAGE_RATIO:{de:"Verschuldungsquote (Leverage Ratio)",en:"Leverage ratio"},
    PILLAR_B_ROE:{de:"Eigenkapitalrendite (RoE)",en:"Return on equity (RoE)"},
    PILLAR_B_ROA:{de:"Gesamtkapitalrendite (RoA)",en:"Return on assets (RoA)"},
    PILLAR_B_NIM:{de:"Nettozinsmarge (NIM)",en:"Net interest margin (NIM)"}
  };

  const DE_PHRASES = [
    [/ESRS S1-16 highest-paid individual\s*\/\s*median employee remuneration ratio/gi,
      "ESRS S1-16: Vergütungsverhältnis – höchstbezahlte Person / Median der Beschäftigten"],
    [/\bhighest-paid individual\s*\/\s*median employee remuneration ratio\b/gi,
      "Vergütungsverhältnis – höchstbezahlte Person / Median der Beschäftigten"],
    [/\bSolvency II ratio\b/gi,"Solvency-II-Quote"],
    [/\beligible own funds for SCR\b/gi,"anrechenbare Eigenmittel für die SCR-Bedeckung"],
    [/\bSolvency Capital Requirement\b/gi,"Solvenzkapitalanforderung"],
    [/\bMinimum Capital Requirement\b/gi,"Mindestkapitalanforderung"],
    [/\bcombined ratio\b/gi,"Combined Ratio"],
    [/\bcontractual service margin\b/gi,"vertragliche Servicemarge"],
    [/\binsurance revenue\b/gi,"Versicherungsumsatz"],
    [/\binsurance service result\b/gi,"versicherungstechnisches Ergebnis nach IFRS 17"],
    [/\bCommon Equity Tier 1 ratio\b/gi,"harte Kernkapitalquote (CET1)"],
    [/\bleverage ratio\b/gi,"Verschuldungsquote (Leverage Ratio)"],
    [/\breturn on equity\b/gi,"Eigenkapitalrendite"],
    [/\breturn on assets\b/gi,"Gesamtkapitalrendite"],
    [/\bnet interest margin\b/gi,"Nettozinsmarge"],
    [/\bAnnual Report\b/gi,"Geschäftsbericht"],
    [/\bSolvency and Financial Condition Report\b/gi,"Bericht über Solvabilität und Finanzlage"]
  ];

  const TOK_DE = {
    INSURANCE:"Versicherung", GROUP:"Gruppe", UNDERTAKING:"Unternehmen", CREDIT:"Kredit",
    INSTITUTION:"Institut", SOURCE:"Quelle", FACT:"Fakt", NORMALIZED:"normalisiert",
    DERIVED:"abgeleitet", STATISTICAL:"statistisch", RESULT:"Ergebnis", ELIGIBLE:"anrechenbar",
    OWN:"Eigen", FUNDS:"Mittel", SOLVENCY:"Solvabilität", RATIO:"Quote", PERCENT:"Prozent",
    HIGHEST:"höchste", PAID:"vergütet", MEDIAN:"Median", EMPLOYEE:"Beschäftigte",
    REMUNERATION:"Vergütung", COMBINED:"Combined", REVENUE:"Umsatz", SERVICE:"Service",
    TECHNICAL:"technisch", PROVISIONS:"Rückstellungen", CAPITAL:"Kapital", REQUIREMENT:"Anforderung",
    RISK:"Risiko", MODULE:"Modul", CONSOLIDATED:"konsolidiert", REFERENCE:"Stichtag",
    DATE:"Datum", MODEL:"Modell", BASIS:"Basis", INTERNAL:"intern", PARTIAL:"partiell",
    FULL:"vollständig", TRANSITIONAL:"Übergangsmaßnahme", VOLATILITY:"Volatilität",
    ADJUSTMENT:"Anpassung", MATCHING:"Matching", PRIMARY:"Primär", SCALAR:"Einzelwert",
    BANKING:"Banken", EEA:"EWR", OPEN:"offen", CLOSED:"geschlossen"
  };
  const ACRONYMS = new Set(["ESRS","IFRS","SCR","MCR","SST","EBA","ECB","CET1","ROE","ROA","NIM","VA","MA","PDF","EU","EEA","EUR"]);

  function langNow() {
    try {
      const h=(document.documentElement.getAttribute("lang")||"").toLowerCase();
      if (h.startsWith("de")) return "de";
      if (h.startsWith("en")) return "en";
      const q=new URLSearchParams(location.search).get("lang");
      if (q==="de"||q==="en") return q;
      for (const k of ["finance2agent_lang","finance_insurance2agent_lang","language","lang"]) {
        const v=(localStorage.getItem(k)||"").toLowerCase();
        if (v==="de"||v==="en") return v;
      }
      const active=document.querySelector('[data-lang][aria-pressed="true"],[data-lang].active,[data-lang].selected');
      if (active) {
        const v=(active.getAttribute("data-lang")||"").toLowerCase();
        if (v==="de"||v==="en") return v;
      }
    } catch (_) {}
    return "de";
  }

  function wordsFromCode(code, lang) {
    let c=String(code||"").replace(/^PILLAR_[A-Z]_+/,"").replace(/^CANONICAL_+/,"");
    const parts=c.split("_").filter(Boolean);
    const out=parts.map(p=>{
      if (ACRONYMS.has(p)) return p==="EEA" && lang==="de" ? "EWR" : p;
      if (lang==="de" && TOK_DE[p]) return TOK_DE[p];
      const low=p.toLowerCase();
      return low.charAt(0).toUpperCase()+low.slice(1);
    });
    return out.join(" ").replace(/\s+/g," ").trim();
  }

  function readableCode(code, lang) {
    lang=lang==="en"?"en":"de";
    const c=String(code||"").trim();
    if (METRICS[c]) return METRICS[c][lang];
    if (EXACT[c]) return EXACT[c][lang];
    if (/^PILLAR_[A-Z]_/.test(c)) return metricLabel(c,lang);
    return wordsFromCode(c,lang);
  }

  function metricLabel(code, lang) {
    lang=lang==="en"?"en":"de";
    if (METRICS[code]) return METRICS[code][lang];
    const c=String(code||"");
    if (/SOLVENCY_II_RATIO/.test(c)) return lang==="de"?"Solvency-II-Quote":"Solvency II ratio";
    if (/ELIGIBLE_OWN_FUNDS.*SCR/.test(c)) return lang==="de"?"Anrechenbare Eigenmittel für die SCR-Bedeckung":"Eligible own funds for SCR";
    if (/(^|_)SCR($|_)/.test(c)) return lang==="de"?"Solvenzkapitalanforderung (SCR)":"Solvency Capital Requirement (SCR)";
    if (/(^|_)MCR($|_)/.test(c)) return lang==="de"?"Mindestkapitalanforderung (MCR)":"Minimum Capital Requirement (MCR)";
    if (/COMBINED_RATIO/.test(c)) return "Combined Ratio";
    if (/IFRS17.*CSM|CONTRACTUAL_SERVICE_MARGIN/.test(c)) return lang==="de"?"IFRS 17: vertragliche Servicemarge (CSM)":"IFRS 17 contractual service margin (CSM)";
    if (/INSURANCE_REVENUE/.test(c)) return lang==="de"?"Versicherungsumsatz":"Insurance revenue";
    if (/INSURANCE_SERVICE_RESULT/.test(c)) return lang==="de"?"Versicherungstechnisches Ergebnis nach IFRS 17":"Insurance service result";
    if (/CET1.*RATIO/.test(c)) return lang==="de"?"Harte Kernkapitalquote (CET1)":"Common Equity Tier 1 (CET1) ratio";
    if (/LEVERAGE.*RATIO/.test(c)) return lang==="de"?"Verschuldungsquote (Leverage Ratio)":"Leverage ratio";
    if (/_ROE$|RETURN_ON_EQUITY/.test(c)) return lang==="de"?"Eigenkapitalrendite (RoE)":"Return on equity (RoE)";
    if (/_ROA$|RETURN_ON_ASSETS/.test(c)) return lang==="de"?"Gesamtkapitalrendite (RoA)":"Return on assets (RoA)";
    if (/_NIM$|NET_INTEREST_MARGIN/.test(c)) return lang==="de"?"Nettozinsmarge (NIM)":"Net interest margin (NIM)";
    return wordsFromCode(c,lang);
  }

  const CODE_RE=/\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/g;

  function sanitizeText(raw, lang) {
    lang=lang==="en"?"en":"de";
    let s=String(raw==null?"":raw);
    if (!s.trim()) return s;

    // Select options often contain "canonical English name · TECHNICAL_CODE".
    const metricOpt=s.match(/^\s*(.*?)\s+·\s+(PILLAR_[A-Z0-9_]+)\s*$/);
    if (metricOpt) return metricLabel(metricOpt[2],lang);
    const genericOpt=s.match(/^\s*(.*?)\s+·\s+([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)\s*$/);
    if (genericOpt) return genericOpt[1].trim()+" · "+readableCode(genericOpt[2],lang);

    // Human-friendly locators / source metadata.
    if (lang==="de") {
      s=s.replace(/Seitenlocator:\s*PDF_PAGE_1BASED=(\d+)/gi,"PDF-Seite $1");
      s=s.replace(/(?:Tabelle|Table):\s*PILLAR_C_SCALAR_SOURCE_FACT/gi,"Datensatz: Primärquellenwert");
      s=s.replace(/Datapoint:\s*ESRS_HIGHEST_PAID_TO_MEDIAN/gi,"Datenpunkt: "+METRICS.ESRS_HIGHEST_PAID_TO_MEDIAN.de);
    } else {
      s=s.replace(/(?:Seitenlocator|Page locator):\s*PDF_PAGE_1BASED=(\d+)/gi,"PDF page $1");
      s=s.replace(/(?:Tabelle|Table):\s*PILLAR_C_SCALAR_SOURCE_FACT/gi,"Record: Primary-source value");
      s=s.replace(/(?:Datapoint|Data point):\s*ESRS_HIGHEST_PAID_TO_MEDIAN/gi,"Data point: "+METRICS.ESRS_HIGHEST_PAID_TO_MEDIAN.en);
    }
    s=s.replace(/PDF_PAGE_1BASED=(\d+)/g, lang==="de"?"PDF-Seite $1":"PDF page $1");

    // Compact units.
    s=s.replace(/(\b[-+]?\d+(?:[.,]\d+)?)\s+RATIO_MULTIPLE\b/g,"$1×");
    s=s.replace(/(\b[-+]?\d+(?:[.,]\d+)?)\s+PERCENT\b/g,"$1 %");

    if (lang==="de") for (const [repl,to] of DE_PHRASES) s=s.replace(repl,to);

    // Any remaining technical enum/code gets a readable display fallback.
    s=s.replace(CODE_RE,m=>readableCode(m,lang));
    return s;
  }

  function extractCodes(raw) {
    return Array.from(new Set((String(raw||"").match(CODE_RE)||[])));
  }

  const textState=new WeakMap();
  const attrState=new WeakMap();

  function skipNode(n) {
    const p=n && n.parentElement;
    if (!p) return true;
    return !!p.closest("script,style,noscript,textarea,pre,code,[data-keep-technical='true']");
  }

  function processTextNode(n, lang) {
    if (!n || n.nodeType!==3 || skipNode(n)) return;
    let st=textState.get(n);
    if (!st || n.data!==st.rendered) st={raw:n.data,rendered:n.data};
    const out=sanitizeText(st.raw,lang);
    const codes=extractCodes(st.raw);
    if (out!==n.data) n.data=out;
    st.rendered=out; textState.set(n,st);
    if (codes.length && n.parentElement && !n.parentElement.getAttribute("title")) {
      n.parentElement.setAttribute("title",(lang==="de"?"Technischer Code: ":"Technical code: ")+codes.join(", "));
      n.parentElement.setAttribute("data-f2a-presentation-humanized","true");
    }
  }

  function processAttrs(el, lang) {
    if (!el || el.nodeType!==1 || el.matches("script,style,pre,code")) return;
    let map=attrState.get(el)||{};
    for (const a of ["placeholder","aria-label"]) {
      if (!el.hasAttribute(a)) continue;
      const cur=el.getAttribute(a);
      const st=map[a];
      const raw=(!st || cur!==st.rendered)?cur:st.raw;
      const out=sanitizeText(raw,lang);
      if (out!==cur) el.setAttribute(a,out);
      map[a]={raw,rendered:out};
    }
    attrState.set(el,map);
  }

  function walk(root, lang) {
    if (!root) return;
    if (root.nodeType===3) return processTextNode(root,lang);
    if (root.nodeType!==1 && root.nodeType!==9 && root.nodeType!==11) return;
    if (root.nodeType===1) processAttrs(root,lang);
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n; while ((n=w.nextNode())) processTextNode(n,lang);
    if (root.querySelectorAll) root.querySelectorAll("*").forEach(el=>processAttrs(el,lang));
  }

  function refresh() { walk(document.body||document.documentElement,langNow()); }

  const api={sanitizeText,readableCode,metricLabel,wordsFromCode};

  if (typeof module!=="undefined" && module.exports) module.exports=api;
  global.F2APresentationI18n=api;

  if (typeof document==="undefined") {
    if (typeof process!=="undefined" && process.argv && process.argv.includes("--selftest")) {
      const A=[
        [sanitizeText("Munich Re Group · INSURANCE_GROUP","de"),"Munich Re Group · Versicherungsgruppe"],
        [sanitizeText("Munich Re Group · INSURANCE_GROUP","en"),"Munich Re Group · Insurance group"],
        [sanitizeText("SOURCE_FACT","de"),"Quellenfakt"],
        [sanitizeText("118 RATIO_MULTIPLE","de"),"118×"],
        [sanitizeText("ESRS S1-16 highest-paid individual / median employee remuneration ratio · PILLAR_B_ESRS_HIGHEST_PAID_TO_MEDIAN","de"),
          "ESRS S1-16: Vergütungsverhältnis – höchstbezahlte Person / Median der Beschäftigten"],
        [sanitizeText("ESRS S1-16 highest-paid individual / median employee remuneration ratio · PILLAR_B_ESRS_HIGHEST_PAID_TO_MEDIAN","en"),
          "ESRS S1-16: remuneration ratio — highest-paid individual / median employee"],
        [sanitizeText("SOLVENCY_II_EEA","de"),"Solvency II (EWR)"],
        [sanitizeText("MUNICH_RE_GROUP","de"),"Munich Re Group"],
        [sanitizeText("Seitenlocator: PDF_PAGE_1BASED=143 · Tabelle: PILLAR_C_SCALAR_SOURCE_FACT · Datapoint: ESRS_HIGHEST_PAID_TO_MEDIAN","de"),
          "PDF-Seite 143 · Datensatz: Primärquellenwert · Datenpunkt: ESRS S1-16: Vergütungsverhältnis – höchstbezahlte Person / Median der Beschäftigten"]
      ];
      for (const [got,exp] of A) if (got!==exp) throw new Error("SELFTEST mismatch:\n"+got+"\n!=\n"+exp);
      console.log("SELFTEST: PASS");
    }
    return;
  }

  function start() {
    refresh();
    const obs=new MutationObserver(muts=>{
      const lang=langNow();
      for (const m of muts) {
        if (m.type==="characterData") processTextNode(m.target,lang);
        else if (m.type==="childList") m.addedNodes.forEach(n=>walk(n,lang));
        else if (m.type==="attributes" && m.target===document.documentElement) refresh();
      }
    });
    obs.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["lang"]});
    document.addEventListener("click",e=>{
      const t=e.target && e.target.closest ? e.target.closest("[data-lang],button,a") : null;
      if (!t) return;
      const txt=(t.textContent||"").trim().toUpperCase();
      if (t.hasAttribute("data-lang") || txt==="DE" || txt==="EN" || txt==="DEUTSCH" || txt==="ENGLISH")
        setTimeout(refresh,0);
    },true);
    global.addEventListener("storage",()=>setTimeout(refresh,0));
    global.addEventListener("popstate",()=>setTimeout(refresh,0));
  }

  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})(typeof window!=="undefined"?window:globalThis);
