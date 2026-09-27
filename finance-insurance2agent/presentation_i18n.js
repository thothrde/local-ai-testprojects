/* Finance/Insurance2Agent — global presentation i18n/readability layer
 * Presentation only. Canonical values/codes remain untouched in data and code/pre audit areas.
 * Version 1.2 — 2026-09-27
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
    ZURICH_INSURANCE_GROUP:{de:"Zurich Insurance Group",en:"Zurich Insurance Group"},
    PUBLIC_RELEASE:{de:"Öffentliche Freigabe",en:"Public release"},
    RAW_SOURCE_REDISTRIBUTION:{de:"Weitergabe von Rohquellen",en:"Raw-source redistribution"},
    AUTONOMOUS_LLM_HYPOTHESIS:{de:"Autonome LLM-Hypothesen",en:"Autonomous LLM hypotheses"},
    CONFIRMATORY_RESEARCH:{de:"Bestätigende Analyse",en:"Confirmatory analysis"},
    INSURANCE_PEER_DISCOVERY:{de:"Peer-Erkennung für Versicherungen",en:"Insurance peer discovery"},
    CLOSED_NORMALIZATION:{de:"Geschlossen – Normalisierung",en:"Closed — normalization"},
    STATIC:{de:"Statisch",en:"Static"}
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
    PILLAR_B_NIM:{de:"Nettozinsmarge (NIM)",en:"Net interest margin (NIM)"},
    EBA_CET1_RATIO_TRANSITIONAL:{de:"Harte Kernkapitalquote (CET1) – Übergangsdefinition",en:"Common Equity Tier 1 (CET1) ratio — transitional definition"},
    EBA_LEVERAGE_RATIO_TRANSITIONAL:{de:"Verschuldungsquote – Übergangsdefinition des Tier-1-Kapitals",en:"Leverage ratio — transitional definition of Tier 1 capital"},
    EBA_TIER1_RATIO_TRANSITIONAL:{de:"Tier-1-Kapitalquote – Übergangsdefinition",en:"Tier 1 capital ratio — transitional definition"},
    EBA_TOTAL_CAPITAL_RATIO_TRANSITIONAL:{de:"Gesamtkapitalquote – Übergangsdefinition",en:"Total capital ratio — transitional definition"},
    EBA_NPL_RATIO_DERIVED_TE2025:{de:"NPL-Quote – TE2025",en:"Non-performing loans ratio — TE2025"},
    EBA_P3DH_LCR_KM1:{de:"Liquiditätsdeckungsquote (LCR)",en:"Liquidity Coverage Ratio (LCR)"},
    EBA_P3DH_NSFR_KM1:{de:"Strukturelle Liquiditätsquote (NSFR)",en:"Net Stable Funding Ratio (NSFR)"},
    EBA_P3DH_TIER1_RATIO_KM1:{de:"Tier-1-Kapitalquote",en:"Tier 1 capital ratio"},
    EBA_P3DH_TOTAL_CAPITAL_RATIO_KM1:{de:"Gesamtkapitalquote",en:"Total capital ratio"},
    EBA_P3DH_CET1_RATIO_KM1:{de:"P3DH-CET1-Quote (EU KM1)",en:"P3DH CET1 ratio (EU KM1)"},
    EBA_P3DH_LEVERAGE_RATIO_LR2:{de:"P3DH-Verschuldungsquote (EU LR2)",en:"P3DH leverage ratio (EU LR2)"},
    EBA_RWA_ASSETS_RATIO_DERIVED_TE2025:{de:"Verhältnis RWA / Gesamtaktiva – TE2025",en:"RWA / total assets ratio — TE2025"},
    EBA_P3DH_NPL_COVERAGE_DERIVED_CR1:{de:"NPL-Deckungsquote",en:"NPL coverage ratio"},
    EBA_P3DH_FORBORNE_LOANS_RATIO_DERIVED:{de:"Forbearance-Quote",en:"Forborne loans ratio"},
    EBA_P3DH_NPL_RATIO_DERIVED_CR1:{de:"P3DH-NPL-Quote aus EU CR1.a",en:"P3DH NPL ratio derived from EU CR1.a"},
    EBA_P3DH_TREA_PRUDENTIAL_ASSETS_RATIO_DERIVED:{de:"Verhältnis TREA / Aktiva im aufsichtsrechtlichen Konsolidierungskreis",en:"TREA / prudential-scope assets ratio"},
    EBA_CIR_DERIVED_TE2025:{de:"Aufwand-Ertrag-Verhältnis – TE2025",en:"Cost-income ratio — TE2025"},
    EBA_TOTAL_ASSETS_TE2025:{de:"Gesamtaktiva – TE2025",en:"Total assets — TE2025"},
    EBA_ADMIN_EXPENSES_TE2025:{de:"Verwaltungsaufwendungen – TE2025",en:"Administrative expenses — TE2025"},
    EBA_DEPRECIATION_TE2025:{de:"Abschreibungen – TE2025",en:"Depreciation — TE2025"},
    EBA_OPERATING_INCOME_NET_TE2025:{de:"Netto-Gesamtbetriebsertrag – TE2025",en:"Total operating income, net — TE2025"},
    EBA_TOTAL_RISK_EXPOSURE_AMOUNT_TE2025:{de:"Gesamtrisikobetrag (TREA) – TE2025",en:"Total risk exposure amount — TE2025"},
    EBA_P3DH_TREA_KM1:{de:"Gesamtrisikobetrag (TREA)",en:"Total risk exposure amount"}
  };

  const DE_PHRASES = [
    [/CANONICAL EVIDENCE\s*·\s*SEMANTICS\s*·\s*METHODS\s*·\s*PROVENANCE/gi,"KANONISCHE EVIDENZ · SEMANTIK · METHODEN · PROVENIENZ"],
    [/\bPublic Release\b/gi,"Öffentliche Freigabe"],
    [/\bRaw Quelle Redistribution\b/gi,"Weitergabe von Rohquellen"],
    [/\bRaw[- ]Source Redistribution\b/gi,"Weitergabe von Rohquellen"],
    [/\bAutonomous Llm Hypothesis\b/gi,"Autonome LLM-Hypothesen"],
    [/\bInsurance Peer Discovery\b/gi,"Peer-Erkennung für Versicherungen"],
    [/\bVersicherung Peer Discovery\b/gi,"Peer-Erkennung für Versicherungen"],
    [/\bgeschlossen Normalization\b/gi,"Geschlossen – Normalisierung"],
    [/\bSource Browser\b/gi,"Quellenbrowser"],
    [/\bMetric-\/Component-Explorer\b/gi,"Kennzahlen-/Komponenten-Explorer"],
    [/\bOwnership\/Dependency Graph\b/gi,"Eigentums-/Abhängigkeitsgraph"],
    [/\bObservation ID\b/gi,"Beobachtungs-ID"],
    [/\bTrace\b/gi,"Nachverfolgen"],
    [/Observation\s*→\s*Entity\s*→\s*Metric\s*→\s*Semantic Profile\s*→\s*Source\s*→\s*Lineage\s*→\s*Time-Series-Entscheidung\s*→\s*Evidence Graph\.?/gi,"Beobachtung → Institution → Kennzahl → Semantikprofil → Quelle → Herkunftskette → Zeitreihen-Entscheidung → Evidenzgraph."],
    [/canonical evidence\s*→\s*semantics\s*→\s*deterministic methods\s*→\s*provenance/gi,"kanonische Evidenz → Semantik → deterministische Methoden → Provenienz"],
    [/\bUnabhängigkeit\s*\/\s*Independence\b/gi,"Unabhängigkeit"],
    [/\bKorrekturen\s*\/\s*Corrections\b/gi,"Korrekturen"],
    [/\bsource-reported\b/gi,"quellengemeldet"],
    [/\bCommon Equity Tier 1 capital ratio\s*[—-]\s*transitional period\b/gi,"Harte Kernkapitalquote (CET1) – Übergangsdefinition"],
    [/\bTier 1 capital ratio\s*\(transitional period\)/gi,"Tier-1-Kapitalquote – Übergangsdefinition"],
    [/\bTier 1 capital ratio\b/gi,"Tier-1-Kapitalquote"],
    [/\bTotal capital ratio\s*\(transitional period\)/gi,"Gesamtkapitalquote – Übergangsdefinition"],
    [/\bTotal capital ratio\b/gi,"Gesamtkapitalquote"],
    [/\bLeverage ratio\s*[—-]\s*transitional definition of Tier 1 capital\b/gi,"Verschuldungsquote – Übergangsdefinition des Tier-1-Kapitals"],
    [/\bLiquidity Coverage Ratio\b/gi,"Liquiditätsdeckungsquote (LCR)"],
    [/\bNet Stable Funding Ratio\b/gi,"Strukturelle Liquiditätsquote (NSFR)"],
    [/\bNon-performing loans ratio\b/gi,"NPL-Quote"],
    [/\bNPL coverage ratio\b/gi,"NPL-Deckungsquote"],
    [/\bForborne loans ratio\b/gi,"Forbearance-Quote"],
    [/\bRWA\s*\/\s*total assets ratio\s*[—-]\s*TE2025\b/gi,"Verhältnis RWA / Gesamtaktiva – TE2025"],
    [/\bP3DH CET1 ratio\s*\(EU KM1\)/gi,"P3DH-CET1-Quote (EU KM1)"],
    [/\bP3DH leverage ratio\s*\(EU LR2\)/gi,"P3DH-Verschuldungsquote (EU LR2)"],
    [/\bP3DH NPL ratio derived from EU CR1\.a\b/gi,"P3DH-NPL-Quote aus EU CR1.a"],
    [/\bTREA\s*\/\s*prudential-scope assets ratio\b/gi,"Verhältnis TREA / Aktiva im aufsichtsrechtlichen Konsolidierungskreis"],
    [/\bNon-performing loans and advances\s*[—-]\s*NPL ratio numerator\b/gi,"Notleidende Kredite und Forderungen – Zähler der NPL-Quote"],
    [/\bTotal loans and advances\s*[—-]\s*NPL ratio denominator\b/gi,"Kredite und Forderungen insgesamt – Nenner der NPL-Quote"],
    [/\bAccumulated impairment on non-performing loans and advances\b/gi,"Kumulierte Wertberichtigungen auf notleidende Kredite und Forderungen"],
    [/\bAssets carrying value under prudential consolidation scope\b/gi,"Buchwert der Aktiva im aufsichtsrechtlichen Konsolidierungskreis"],
    [/\bForborne loans and advances total\b/gi,"Kredite und Forderungen mit Forbearance-Maßnahmen insgesamt"],
    [/\bNon-performing forborne loans and advances\b/gi,"Notleidende Kredite und Forderungen mit Forbearance-Maßnahmen"],
    [/\bPerforming forborne loans and advances\b/gi,"Bediente Kredite und Forderungen mit Forbearance-Maßnahmen"],
    [/\bP3DH non-performing loans and advances\s*\(EU CR1\.a\)/gi,"P3DH: notleidende Kredite und Forderungen (EU CR1.a)"],
    [/\bP3DH performing loans and advances\s*\(EU CR1\.a\)/gi,"P3DH: bediente Kredite und Forderungen (EU CR1.a)"],
    [/\bP3DH total loans and advances derived from CR1\.a components\b/gi,"P3DH: Kredite und Forderungen insgesamt aus CR1.a-Komponenten"],
    [/\bCost-income ratio\s*[—-]\s*TE2025\b/gi,"Aufwand-Ertrag-Verhältnis – TE2025"],
    [/\bTotal assets\s*[—-]\s*TE2025\b/gi,"Gesamtaktiva – TE2025"],
    [/\bAdministrative expenses\s*[—-]\s*TE2025\b/gi,"Verwaltungsaufwendungen – TE2025"],
    [/\bDepreciation\s*[—-]\s*TE2025\b/gi,"Abschreibungen – TE2025"],
    [/\bTotal operating income, net\s*[—-]\s*TE2025\b/gi,"Netto-Gesamtbetriebsertrag – TE2025"],
    [/\bTotal risk exposure amount\s*[—-]\s*TE2025\b/gi,"Gesamtrisikobetrag (TREA) – TE2025"],
    [/\bTotal risk exposure amount\b/gi,"Gesamtrisikobetrag (TREA)"],
    [/ESRS S1-16 highest-paid individual\s*\/\s*median employee remuneration ratio/gi,"ESRS S1-16: Vergütungsverhältnis – höchstbezahlte Person / Median der Beschäftigten"],
    [/\bhighest-paid individual\s*\/\s*median employee remuneration ratio\b/gi,"Vergütungsverhältnis – höchstbezahlte Person / Median der Beschäftigten"],
    [/\bSolvency II ratio\b/gi,"Solvency-II-Quote"],
    [/\beligible own funds for SCR\b/gi,"anrechenbare Eigenmittel für die SCR-Bedeckung"],
    [/\bSolvency Capital Requirement\b/gi,"Solvenzkapitalanforderung"],
    [/\bMinimum Capital Requirement\b/gi,"Mindestkapitalanforderung"],
    [/\bcontractual service margin\b/gi,"vertragliche Servicemarge"],
    [/\binsurance revenue\b/gi,"Versicherungsumsatz"],
    [/\binsurance service result\b/gi,"versicherungstechnisches Ergebnis nach IFRS 17"],
    [/\bCommon Equity Tier 1 ratio\b/gi,"harte Kernkapitalquote (CET1)"],
    [/\breturn on equity\b/gi,"Eigenkapitalrendite"],
    [/\breturn on assets\b/gi,"Gesamtkapitalrendite"],
    [/\bnet interest margin\b/gi,"Nettozinsmarge"],
    [/\bAnnual Report\b/gi,"Geschäftsbericht"],
    [/\bSolvency and Financial Condition Report\b/gi,"Bericht über Solvabilität und Finanzlage"],
    [/Solvency II source risk component\s*[—-]\s*market risk life primary insurance/gi,"Solvency-II-Risikokomponente – Marktrisiko, Lebensversicherung (Primärversicherung)"]
  ];

  const EN_PHRASES = [
    [/\bÖffentliche Freigabe\b/gi,"Public release"],
    [/\bWeitergabe von Rohquellen\b/gi,"Raw-source redistribution"],
    [/\bAutonome LLM-Hypothesen\b/gi,"Autonomous LLM hypotheses"],
    [/\bPeer-Erkennung für Versicherungen\b/gi,"Insurance peer discovery"],
    [/\bGeschlossen\s*[–-]\s*Normalisierung\b/gi,"Closed — normalization"],
    [/\bQuellenbrowser\b/gi,"Source browser"],
    [/\bKennzahlen-\/Komponenten-Explorer\b/gi,"Metric/component explorer"],
    [/\bEigentums-\/Abhängigkeitsgraph\b/gi,"Ownership/dependency graph"],
    [/\bBeobachtungs-ID\b/gi,"Observation ID"],
    [/\bNachverfolgen\b/gi,"Trace"],
    [/Beobachtung\s*→\s*Institution\s*→\s*Kennzahl\s*→\s*Semantikprofil\s*→\s*Quelle\s*→\s*Herkunftskette\s*→\s*Zeitreihen-Entscheidung\s*→\s*Evidenzgraph\.?/gi,"Observation → Institution → Metric → Semantic profile → Source → Lineage → Time-series decision → Evidence graph."],
    [/kanonische Evidenz\s*→\s*Semantik\s*→\s*deterministische Methoden\s*→\s*Provenienz/gi,"canonical evidence → semantics → deterministic methods → provenance"],
    [/\bUnabhängigkeit\s*\/\s*Independence\b/gi,"Independence"],
    [/\bKorrekturen\s*\/\s*Corrections\b/gi,"Corrections"]
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
    BANKING:"Banken", EEA:"EWR", OPEN:"offen", CLOSED:"geschlossen",
    MARKET:"Markt", LIFE:"Leben", NONLIFE:"Nichtleben", UNDERWRITING:"Versicherungstechnik",
    DIVERSIFICATION:"Diversifikation", NATCAT:"Naturkatastrophen", OPERATIONAL:"operationell",
    PREMIUM:"Prämien", RESERVE:"Rückstellungen", TOTAL:"Gesamt", ASSETS:"Aktiva",
    LIABILITIES:"Verbindlichkeiten", RESTRICTED:"beschränkt", UNRESTRICTED:"unbeschränkt",
    ECONOMIC:"ökonomisch", SHARE:"Anteil", TAX:"Steuer", RAW:"Rohwert", TURNOVER:"Umsatz",
    EMPLOYEES:"Beschäftigte", AVERAGE:"durchschnittlich", YEAR:"Jahr", END:"Ende",
    NET:"Netto", REVENUES:"Erträge", EXPENSE:"Aufwand", COUNT:"Anzahl", PERSONS:"Personen",
    ACTUAL:"Ist", BASELINE:"Basiswert", REPORTED:"gemeldet", REDUCTION:"Reduktion", TARGET:"Ziel",
    LOWER:"untere", UPPER:"obere", BOUND:"Grenze", RENEWABLE:"erneuerbar", ENERGY:"Energie",
    INVESTMENT:"Investition", EXPECTED:"erwartet", CORPORATE:"Unternehmen", RATE:"Satz",
    PUBLISHED:"veröffentlicht", INCOME:"Einkommen", COMP:"Vergütung", GRANTED:"gewährt",
    OWED:"geschuldet", FRINGE:"Nebenleistungen", PENSION:"Pension", SECTION162:"§ 162",
    MANAGEMENT:"Management", NARRATIVE:"Textauszug", EXCERPT:"Auszug", FINANCED:"finanziert",
    BEARING:"tragend", CONFORM:"konform", VALUE:"Wert", MARGIN:"Marge", BASIC:"Basis",
    REQUIREMENT:"Anforderung", PBT:"Ergebnis vor Steuern", PPE:"Sachanlagen", FTE:"FTE", M:"Mio."
  };
  const ACRONYMS = new Set(["ESRS","IFRS","SCR","MCR","SST","EBA","ECB","CET1","ROE","ROA","NIM","VA","MA","PDF","EU","EEA","EUR","CBCR","DB","CBK","FTE","GHG","TCO2E","LTG","NPL","RWA","TREA","P3DH","KM1","LR2","CR1","CQ1","TE2025"]);

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
    if (genericOpt) {
      const code=genericOpt[2];
      const entityTypeCodes=new Set(["INSURANCE_GROUP","INSURANCE_UNDERTAKING","CREDIT_INSTITUTION","BANK","INSURANCE_HOLDING"]);
      const metricLike=/^(?:EBA|CBCR|CEO|EXECUTIVE|EMPLOYEES|MR|SST|INTERNAL|SOLVENCY|UNDERWRITING|MANAGEMENT|PILLAR)_/.test(code);
      if (metricLike && !entityTypeCodes.has(code)) return metricLabel(code,lang);
      return genericOpt[1].trim()+" · "+readableCode(code,lang);
    }

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

    const phraseMap=lang==="de"?DE_PHRASES:EN_PHRASES;
    for (const [repl,to] of phraseMap) s=s.replace(repl,to);

    // Any remaining technical enum/code gets a readable display fallback.
    s=s.replace(CODE_RE,m=>readableCode(m,lang));

    // Fallback code humanization can expose phrase fragments; normalize once more.
    for (const [repl,to] of phraseMap) s=s.replace(repl,to);
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
        [sanitizeText("Public Release","de"),"Öffentliche Freigabe"],
        [sanitizeText("Raw Quelle Redistribution","de"),"Weitergabe von Rohquellen"],
        [sanitizeText("geschlossen Normalization","de"),"Geschlossen – Normalisierung"],
        [sanitizeText("Observation → Entity → Metric → Semantic Profile → Source → Lineage → Time-Series-Entscheidung → Evidence Graph.","de"),
          "Beobachtung → Institution → Kennzahl → Semantikprofil → Quelle → Herkunftskette → Zeitreihen-Entscheidung → Evidenzgraph."],
        [sanitizeText("Liquidity Coverage Ratio","de"),"Liquiditätsdeckungsquote (LCR)"],
        [sanitizeText("Common Equity Tier 1 capital ratio — transitional period","de"),"Harte Kernkapitalquote (CET1) – Übergangsdefinition"],
        [sanitizeText("VIG Insurance Group · INSURANCE_GROUP","de"),"VIG Insurance Group · Versicherungsgruppe"],
        [sanitizeText("VIG Insurance Group · INSURANCE_GROUP","en"),"VIG Insurance Group · Insurance group"],
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
