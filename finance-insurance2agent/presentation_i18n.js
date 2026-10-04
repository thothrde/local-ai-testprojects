/* Finance/Insurance2Agent — global presentation i18n/readability layer
 * Presentation only. Canonical values/codes remain untouched in data and code/pre audit areas.
 * Version 1.10 — 2026-09-28
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
    [/^READY$/g,"BEREIT"],
    [/^Language$/gi,"Sprache"],
    [/\bInvestigation Threads\b/gi,"Untersuchungsstränge"],
    [/\bInvestigation Candidate\b/gi,"Untersuchungskandidat"],
    [/\bExploratory Only\b/gi,"Nur explorativ"],
    [/\bTime Series Change Candidate\b/gi,"Zeitreihen-Veränderungskandidat"],
    [/\bDeterministische Kandidaten und Threads\b/gi,"Deterministische Kandidaten und Untersuchungsstränge"],
    [/\bExplorative Kandidaten und Investigation Threads\b/gi,"Explorative Kandidaten und Untersuchungsstränge"],
    [/\bCbCR employees\s*—\s*Commerzbank average FTE\b/gi,"CbCR-Beschäftigte — durchschnittliche FTE der Commerzbank"],
    [/\bRelease-\/Methoden-Gates\b/gi,"Freigabe- und Methodenregeln"],
    [/\bAuditpfade\b/gi,"Prüfpfade"],
    [/\bPeer-Erkennung für Versicherungen\b/gi,"Vergleichsgruppen-Erkennung für Versicherungen"],
    [/Das ist ein Methodenfreigabe/gi,"Das ist eine Methodenfreigabe"],
    [/innerhalb eines semantisch homogenen Vergleichsgruppe/gi,"innerhalb einer semantisch homogenen Vergleichsgruppe"],
    [/durch die unterschiedliche Transitional-Behandlung/gi,"durch die unterschiedliche Behandlung von Übergangsmaßnahmen"],
    [/^01\s*·\s*ASK\s*\/\s*ABFRAGEN$/gi,"01 · ABFRAGEN"],
    [/^02\s*·\s*COMPARE\s*\/\s*VERGLEICHEN$/gi,"02 · VERGLEICHEN"],
    [/^03\s*·\s*INVESTIGATE\s*\/\s*UNTERSUCHEN$/gi,"03 · UNTERSUCHEN"],
    [/^04\s*·\s*DISCOVER\s*\/\s*ENTDECKEN$/gi,"04 · ENTDECKEN"],
    [/^05\s*·\s*AUDIT\s*\/\s*PRÜFEN$/gi,"05 · PRÜFEN"],
    [/\bOPEN\b/g,"Offen"],
    [/\bCLOSED\b/g,"Geschlossen"],
    [/\bFinance\s*\/\s*Insurance\b/gi,"Finanzen / Versicherungen"],
    [/\bOwnership\s*\/\s*Dependency\b/gi,"Eigentum / Abhängigkeiten"],
    [/\bInstitutionen-Browser\b/gi,"Institutionenübersicht"],
    [/\bPeer-Cohorts?\b/gi,"Vergleichsgruppe"],
    [/\bdes Cohorts\b/gi,"der Vergleichsgruppe"],
    [/\bCohorts?\b/gi,"Vergleichsgruppe"],
    [/\bScope\b/gi,"Abgrenzung"],
    [/\bDiscovery-Kandidaten\b/gi,"Entdeckungskandidaten"],
    [/\bMethoden-Gate\b/gi,"Methodenfreigabe"],
    [/Direct EBA 2025 EU-wide Transparency Exercise source item/gi,"Direkter EBA-Quelleneintrag aus der EU-weiten Transparenzübung 2025"],
    [/\bCOMMON EQUITY Tier-1-Kapitalquote\b/gi,"Harte Kernkapitalquote (CET1)"],
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
    [/^01\s*·\s*ASK\s*\/\s*ABFRAGEN$/gi,"01 · ASK"],
    [/^02\s*·\s*COMPARE\s*\/\s*VERGLEICHEN$/gi,"02 · COMPARE"],
    [/^03\s*·\s*INVESTIGATE\s*\/\s*UNTERSUCHEN$/gi,"03 · INVESTIGATE"],
    [/^04\s*·\s*DISCOVER\s*\/\s*ENTDECKEN$/gi,"04 · DISCOVER"],
    [/^05\s*·\s*AUDIT\s*\/\s*PRÜFEN$/gi,"05 · AUDIT"],
    [/Warum erscheint\s+(.+?)\s+bei\s+[„"](.+?)[“"]\s+wiederholt als robuster Peer-Kandidat,\s+und bleibt der Befund nach Prüfung von Geschäftsmodell,\s+Nenner-\/Komponentenmechanik,\s+Scope und benachbarten Perioden bestehen\?/gi,
      'Why does $1 repeatedly appear as a robust peer candidate for “$2”, and does the finding remain after checking business model, denominator/component mechanics, scope, and adjacent periods?'],
    [/Warum erscheint\s+(.+?)\s+bei\s+[„"](.+?)[“"]\s+an einem Stichtag als robuster Peer-Kandidat,\s+und bleibt der Befund nach Prüfung von Geschäftsmodell,\s+Nenner-\/Komponentenmechanik,\s+Scope und benachbarten Perioden bestehen\?/gi,
      'Why does $1 appear as a robust peer candidate for “$2” at a single reporting date, and does the finding remain after checking business model, denominator/component mechanics, scope, and adjacent periods?'],
    [/Welche analytische Aussage ändert sich bei\s+(.+?)\s+für\s+[„"](.+?)[“"]\s+am\s+(\d{4}-\d{2}-\d{2})\s+durch die unterschiedliche Transitional-Behandlung,\s+und in welchem Kontext darf welche Variante verwendet werden\?/gi,
      'How does the analytical statement change for $1 on “$2” as of $3 due to different transitional treatment, and in which context may each variant be used?'],
    [/Welche analytische Aussage ändert sich bei\s+(.+?)\s+für\s+[„"](.+?)[“"]\s+am\s+(\d{4}-\d{2}-\d{2})\s+durch die unterschiedliche LTG-Behandlung,\s+und in welchem Kontext darf welche Variante verwendet werden\?/gi,
      'How does the analytical statement change for $1 on “$2” as of $3 due to different LTG treatment, and in which context may each variant be used?'],
    [/Warum liegt\s+(.+?)\s+bei\s+[„"](.+?)[“"]\s+am\s+(\d{4}-\d{2}-\d{2})\s+innerhalb eines semantisch homogenen Peer-Cohorts \(n=(\d+)\) robust deutlich oberhalb des Cohorts\s+—\s+und bleibt der Befund nach Prüfung von Quelle, Scope, Zeitverlauf und Geschäftsstruktur bestehen\?/gi,
      'Why is $1 on “$2” as of $3 robustly well above the peer cohort within a semantically homogeneous peer cohort (n=$4), and does the finding remain after checking source, scope, time trend, and business structure?'],
    [/Warum liegt\s+(.+?)\s+bei\s+[„"](.+?)[“"]\s+am\s+(\d{4}-\d{2}-\d{2})\s+innerhalb eines semantisch homogenen Peer-Cohorts \(n=(\d+)\) robust deutlich unterhalb des Cohorts\s+—\s+und bleibt der Befund nach Prüfung von Quelle, Scope, Zeitverlauf und Geschäftsstruktur bestehen\?/gi,
      'Why is $1 on “$2” as of $3 robustly well below the peer cohort within a semantically homogeneous peer cohort (n=$4), and does the finding remain after checking source, scope, time trend, and business structure?'],
    [/\bOffen\b/gi,"Open"],
    [/\bGeschlossen\b/gi,"Closed"],
    [/\bFinanzen\s*\/\s*Versicherungen\b/gi,"Finance / Insurance"],
    [/\bEigentum\s*\/\s*Abhängigkeiten\b/gi,"Ownership / dependencies"],
    [/\bInstitutionenübersicht\b/gi,"Institution browser"],
    [/\bVergleichsgruppe\b/gi,"peer cohort"],
    [/\bAbgrenzung\b/gi,"scope"],
    [/\bEntdeckungskandidaten\b/gi,"discovery candidates"],
    [/\bMethodenfreigabe\b/gi,"method gate"],
    [/Direkter EBA-Quelleneintrag aus der EU-weiten Transparenzübung 2025/gi,"Direct EBA 2025 EU-wide Transparency Exercise source item"],
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
    [/\bKorrekturen\s*\/\s*Corrections\b/gi,"Corrections"],
    [/\bWelche analytische Aussage ändert sich bei\b/gi,"How does the analytical statement change for"],
    [/\bdurch die unterschiedliche Transitional-Behandlung\b/gi,"due to different transitional treatment"],
    [/\bdurch die unterschiedliche LTG-Behandlung\b/gi,"due to different LTG treatment"],
    [/\bund in welchem Kontext darf welche Variante verwendet werden\?/gi,"and in which context may each variant be used?"],
    [/\bWarum liegt\b/gi,"Why is"],
    [/\binnerhalb eines semantisch homogenen Peer-Cohorts\b/gi,"within a semantically homogeneous peer cohort"],
    [/\brobust deutlich oberhalb des Cohorts\b/gi,"robustly well above the cohort"],
    [/\brobust deutlich unterhalb des Cohorts\b/gi,"robustly well below the cohort"],
    [/\bund bleibt der Befund nach Prüfung von Quelle, Scope, Zeitverlauf und Geschäftsstruktur bestehen\?/gi,
      "and does the finding remain after checking source, scope, time trend, and business structure?"],
    [/\bZeitverlauf\b/gi,"time trend"],
    [/\bGeschäftsstruktur\b/gi,"business structure"],
    [/\bQuelle\b/gi,"source"],
    [/\bWarum erscheint\b/gi,"Why does"],
    [/\bwiederholt als robuster Peer-Kandidat\b/gi,"repeatedly appear as a robust peer candidate"],
    [/\ban einem Stichtag als robuster Peer-Kandidat\b/gi,"appear as a robust peer candidate at a single reporting date"],
    [/\bund bleibt der Befund nach Prüfung von Geschäftsmodell,\s*Nenner-\/Komponentenmechanik,\s*Scope und benachbarten Perioden bestehen\?/gi,
      "and does the finding remain after checking business model, denominator/component mechanics, scope, and adjacent periods?"],
    [/\bGeschäftsmodell\b/gi,"business model"],
    [/\bNenner-\/Komponentenmechanik\b/gi,"denominator/component mechanics"],
    [/\bbenachbarten Perioden\b/gi,"adjacent periods"]
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

  const JSON_KEY_LABELS = {
    multiple_testing_status:{de:"Status Mehrfachtests",en:"Multiple-testing status"},
    purpose:{de:"Zweck",en:"Purpose"},
    variant_kind:{de:"Variantenart",en:"Variant type"},
    candidate_condition:{de:"Kandidatenbedingung",en:"Candidate condition"},
    scale:{de:"Skala",en:"Scale"},
    top_per_semantic_cohort:{de:"Max. Kandidaten je semantischer Vergleichsgruppe",en:"Max. candidates per semantic cohort"},
    unit_filter:{de:"Einheitenfilter",en:"Unit filter"},
    thread_id:{de:"Untersuchungsstrang-ID",en:"Thread ID"},
    thread_type:{de:"Typ des Untersuchungsstrangs",en:"Thread type"},
    entity_id:{de:"Institutions-ID",en:"Institution ID"},
    entity_name:{de:"Institution",en:"Institution"},
    metric_code:{de:"Kennzahl-Code",en:"Metric code"},
    metric_name:{de:"Kennzahl",en:"Metric"},
    persistence_class:{de:"Persistenzklasse",en:"Persistence class"},
    occurrence_count:{de:"Anzahl Vorkommen",en:"Occurrence count"},
    period_count:{de:"Anzahl Perioden",en:"Period count"},
    first_date:{de:"Erstes Datum",en:"First date"},
    last_date:{de:"Letztes Datum",en:"Last date"},
    max_abs_robust_z:{de:"Max. |robustes z|",en:"Max. |robust z|"},
    median_abs_robust_z:{de:"Median |robustes z|",en:"Median |robust z|"},
    min_cohort_n:{de:"Min. Größe der Vergleichsgruppe",en:"Min. cohort size"},
    quality_flags_json:{de:"Qualitätshinweise",en:"Quality flags"},
    question:{de:"Fragestellung",en:"Question"},
    thread_version:{de:"Version des Untersuchungsstrangs",en:"Thread version"}
  };

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  }

  function humanizeReaderJson(s,lang) {
    for (const [key,labels] of Object.entries(JSON_KEY_LABELS)) {
      const rx=new RegExp('"'+escapeRegExp(key)+'"\\s*:','g');
      s=s.replace(rx,'"'+labels[lang]+'":');
    }
    if (lang==="de") {
      const reps=[
        ["Prevent semantic collapse and create an explicit investigation question",
         "Semantischen Kollaps verhindern und eine explizite Untersuchungsfrage erzeugen"],
        ["Not Applicable","Nicht anwendbar"],
        ["Exploratory Only","Nur explorativ"],
        ["Ratio Like Only","Nur quotenartige Kennzahlen"],
        ["Peer Pattern","Vergleichsgruppenmuster"],
        ["Semantic Variant","Semantische Variante"],
        ["Single Period","Einzelperiode"],
        ["REPEATED","Wiederholt"],
        ["PERSISTENT","Anhaltend"],
        ["TRANSITIONAL","Übergangsmaßnahmen"],
        ["Small Cohort Requires Structure Check","Kleine Vergleichsgruppe – Strukturprüfung erforderlich"],
        ["P3DH Partial Cohort","P3DH – unvollständige Vergleichsgruppe"],
        ["Extreme Robust Z Requires Denominator And Business Model Check",
         "Extremer robuster z-Wert – Nenner und Geschäftsmodell prüfen"],
        ["abs(robust_z) >= 3.5","|robustes z| ≥ 3,5"]
      ];
      for (const [a,b] of reps) s=s.split(a).join(b);
    } else {
      s=s.split("abs(robust_z) >= 3.5").join("|robust z| ≥ 3.5");
    }
    return s;
  }

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

    // First preserve exact reader-facing JSON semantics before generic word substitutions.
    s=humanizeReaderJson(s,lang);

    const phraseMap=lang==="de"?DE_PHRASES:EN_PHRASES;
    for (const [repl,to] of phraseMap) s=s.replace(repl,to);

    // Any remaining technical enum/code gets a readable display fallback.
    s=s.replace(CODE_RE,m=>readableCode(m,lang));

    // Fallback code humanization can expose phrase fragments; normalize once more.
    for (const [repl,to] of phraseMap) s=s.replace(repl,to);

    // Final reader cleanup is deliberately last. It catches mixed forms created by
    // earlier generic localization passes and prevents technical underscore codes
    // from remaining visible in ordinary reader UI.
    if (lang==="de") {
      const finalDe=[
        ["Not Applicable","Nicht anwendbar"],
        ["Semantic Variant","Semantische Variante"],
        ["Peer Pattern","Vergleichsgruppenmuster"],
        ["Single Period","Einzelperiode"],
        ["Check Quelle Version","Quellenversion prüfen"],
        ["Check Restatement","Neudarstellung prüfen"],
        ["Check Perimeter Change","Änderung des Konsolidierungskreises prüfen"],
        ["Check Method Change","Methodenänderung prüfen"],
        ["Small Vergleichsgruppe Requires Structure Check","Kleine Vergleichsgruppe – Strukturprüfung erforderlich"],
        ["Extreme Robust Z Requires Denominator And Business Modell Check","Extremer robuster z-Wert – Nenner und Geschäftsmodell prüfen"],
        ["P3DH partiell Vergleichsgruppe","P3DH – unvollständige Vergleichsgruppe"],
        ["Quote Like Only","Nur quotenartige Kennzahlen"],
        ["EBA_CET1_RATIO_Übergangsmaßnahmen","Harte Kernkapitalquote (CET1) – Übergangsdefinition"],
        ["EBA_LEVERAGE_RATIO_Übergangsmaßnahmen","Verschuldungsquote – Übergangsdefinition des Tier-1-Kapitals"],
        ["EBA_TIER1_RATIO_Übergangsmaßnahmen","Tier-1-Kapitalquote – Übergangsdefinition"],
        ["EBA_TOTAL_CAPITAL_RATIO_Übergangsmaßnahmen","Gesamtkapitalquote – Übergangsdefinition"],
        ["robuster Peer-Kandidat","robuster Vergleichsgruppen-Kandidat"],
        ["Peer-Kandidat","Vergleichsgruppen-Kandidat"]
      ];
      for (const [a,b] of finalDe) s=s.split(a).join(b);
    }
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
    return !!p.closest("script,style,noscript,textarea,[data-keep-technical='true']");
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
    if (!el || el.nodeType!==1 || el.matches("script,style")) return;
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
        [sanitizeText("OPEN","de"),"Offen"],
        [sanitizeText("CLOSED","de"),"Geschlossen"],
        [sanitizeText("Ownership / Dependency","de"),"Eigentum / Abhängigkeiten"],
        [sanitizeText("Institutionen-Browser","de"),"Institutionenübersicht"],
        [sanitizeText("Peer-Cohorts · Scope","de"),"Vergleichsgruppe · Abgrenzung"],
        [sanitizeText("Raw Quelle Redistribution","de"),"Weitergabe von Rohquellen"],
        [sanitizeText("geschlossen Normalization","de"),"Geschlossen – Normalisierung"],
        [sanitizeText("Observation → Entity → Metric → Semantic Profile → Source → Lineage → Time-Series-Entscheidung → Evidence Graph.","de"),
          "Beobachtung → Institution → Kennzahl → Semantikprofil → Quelle → Herkunftskette → Zeitreihen-Entscheidung → Evidenzgraph."],
        [sanitizeText("Liquidity Coverage Ratio","de"),"Liquiditätsdeckungsquote (LCR)"],
        [sanitizeText("Common Equity Tier 1 capital ratio — transitional period","de"),"Harte Kernkapitalquote (CET1) – Übergangsdefinition"],
        [sanitizeText("VIG Insurance Group · INSURANCE_GROUP","de"),"VIG Insurance Group · Versicherungsgruppe"],
        [sanitizeText("VIG Insurance Group · INSURANCE_GROUP","en"),"VIG Insurance Group · Insurance group"],
        [sanitizeText("Welche analytische Aussage ändert sich bei Munich Re Group für „Solvency II ratio — source-reported“ am 2025-12-31 durch die unterschiedliche Transitional-Behandlung, und in welchem Kontext darf welche Variante verwendet werden?","en"),
          "How does the analytical statement change for Munich Re Group on “Solvency II ratio — source-reported” as of 2025-12-31 due to different transitional treatment, and in which context may each variant be used?"],
        [sanitizeText("Warum liegt Erwerbsgesellschaft der S-Finanzgruppe mbH & Co. KG bei „Net Stable Funding Ratio“ am 2025-06-30 innerhalb eines semantisch homogenen Peer-Cohorts (n=15) robust deutlich oberhalb des Cohorts — und bleibt der Befund nach Prüfung von Quelle, Scope, Zeitverlauf und Geschäftsstruktur bestehen?","en"),
          "Why is Erwerbsgesellschaft der S-Finanzgruppe mbH & Co. KG on “Net Stable Funding Ratio” as of 2025-06-30 robustly well above the peer cohort within a semantically homogeneous peer cohort (n=15), and does the finding remain after checking source, scope, time trend, and business structure?"],
        [sanitizeText("Warum erscheint Kommuninvest - Grupp bei „Common Equity Tier 1 capital ratio — transitional period“ wiederholt als robuster Peer-Kandidat, und bleibt der Befund nach Prüfung von Geschäftsmodell, Nenner-/Komponentenmechanik, Scope und benachbarten Perioden bestehen?","en"),
          "Why does Kommuninvest - Grupp repeatedly appear as a robust peer candidate for “Common Equity Tier 1 capital ratio — transitional period”, and does the finding remain after checking business model, denominator/component mechanics, scope, and adjacent periods?"],
        [sanitizeText("Warum erscheint HASPA Finanzholding bei „NPL coverage ratio“ an einem Stichtag als robuster Peer-Kandidat, und bleibt der Befund nach Prüfung von Geschäftsmodell, Nenner-/Komponentenmechanik, Scope und benachbarten Perioden bestehen?","en"),
          "Why does HASPA Finanzholding appear as a robust peer candidate for “NPL coverage ratio” at a single reporting date, and does the finding remain after checking business model, denominator/component mechanics, scope, and adjacent periods?"],
        [sanitizeText("MUNICH_RE_GROUP","de"),"Munich Re Group"],
        [sanitizeText("Investigation Threads","de"),"Untersuchungsstränge"],
        [sanitizeText("Investigation Candidate","de"),"Untersuchungskandidat"],
        [sanitizeText("Exploratory Only","de"),"Nur explorativ"],
        [sanitizeText("Time Series Change Candidate","de"),"Zeitreihen-Veränderungskandidat"],
        [sanitizeText("READY","de"),"BEREIT"],
        [sanitizeText("Not Applicable","de"),"Nicht anwendbar"],
        [sanitizeText("Semantic Variant","de"),"Semantische Variante"],
        [sanitizeText("Peer Pattern","de"),"Vergleichsgruppenmuster"],
        [sanitizeText("Single Period","de"),"Einzelperiode"],
        [sanitizeText("Check Quelle Version","de"),"Quellenversion prüfen"],
        [sanitizeText("Check Restatement","de"),"Neudarstellung prüfen"],
        [sanitizeText("Check Perimeter Change","de"),"Änderung des Konsolidierungskreises prüfen"],
        [sanitizeText("Check Method Change","de"),"Methodenänderung prüfen"],
        [sanitizeText("Small Vergleichsgruppe Requires Structure Check","de"),"Kleine Vergleichsgruppe – Strukturprüfung erforderlich"],
        [sanitizeText("Extreme Robust Z Requires Denominator And Business Modell Check","de"),"Extremer robuster z-Wert – Nenner und Geschäftsmodell prüfen"],
        [sanitizeText("P3DH partiell Vergleichsgruppe","de"),"P3DH – unvollständige Vergleichsgruppe"],
        [sanitizeText("Quote Like Only","de"),"Nur quotenartige Kennzahlen"],
        [sanitizeText("EBA_CET1_RATIO_Übergangsmaßnahmen","de"),"Harte Kernkapitalquote (CET1) – Übergangsdefinition"],
        [sanitizeText("EBA_LEVERAGE_RATIO_Übergangsmaßnahmen","de"),"Verschuldungsquote – Übergangsdefinition des Tier-1-Kapitals"],
        [sanitizeText("EBA_TIER1_RATIO_Übergangsmaßnahmen","de"),"Tier-1-Kapitalquote – Übergangsdefinition"],
        [sanitizeText("EBA_TOTAL_CAPITAL_RATIO_Übergangsmaßnahmen","de"),"Gesamtkapitalquote – Übergangsdefinition"],
        [sanitizeText("04 · DISCOVER / ENTDECKEN","de"),"04 · ENTDECKEN"],
        [sanitizeText("04 · DISCOVER / ENTDECKEN","en"),"04 · DISCOVER"],
        [sanitizeText('{"thread_id":"x","thread_type":"Peer Pattern","persistence_class":"PERSISTENT","max_abs_robust_z":4.2,"quality_flags_json":"Small Cohort Requires Structure Check","question":"Q","thread_version":"1.0.0"}',"de"),
          '{"Untersuchungsstrang-ID":"x","Typ des Untersuchungsstrangs":"Vergleichsgruppenmuster","Persistenzklasse":"Anhaltend","Max. |robustes z|":4.2,"Qualitätshinweise":"Kleine Vergleichsgruppe – Strukturprüfung erforderlich","Fragestellung":"Q","Version des Untersuchungsstrangs":"1.0.0"}'],
        [sanitizeText('{"thread_id":"x","thread_type":"Peer Pattern","persistence_class":"PERSISTENT","max_abs_robust_z":4.2,"quality_flags_json":"Small Cohort Requires Structure Check","question":"Q","thread_version":"1.0.0"}',"en"),
          '{"Thread ID":"x","Thread type":"Peer Pattern","Persistence class":"PERSISTENT","Max. |robust z|":4.2,"Quality flags":"Small Cohort Requires Structure Check","Question":"Q","Thread version":"1.0.0"}'],
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

/* FI2A_COMPLETE_INVESTIGATIVE_INTRO_20261004_R1_BEGIN */
(() => {
  "use strict";
  const COPY = { de: ["Finance/Insurance2Agent verbindet Finanz-, Versicherungs-, Aufsichts-, Unternehmens- und öffentliche Daten zu einer provenance-first Forschungsumgebung. Banken, Versicherer, Konzernstrukturen, regulatorische Meldungen und – wo belastbare öffentliche Quellen vorliegen – Vergabeverfahren und weitere institutionelle Zusammenhänge lassen sich gemeinsam untersuchen. Jede verwendete Zahl und jede belastbare Verbindung soll bis zu ihrer Quelle zurückverfolgbar bleiben. Die App ist weder Aufsichtsveröffentlichung noch Anlage-, Versicherungs- oder Rechtsberatung: Sie ist ein Forschungsinstrument für diejenigen, die wissen wollen, wie ein Befund zustande kommt – und was die verfügbaren Daten gerade nicht hergeben.", "Das Herzstück ist das Untersuchen selbst. Eine auffällige Kapitalquote, eine unerwartete Strukturänderung oder ein Unternehmen, das zugleich in einem Vergabeverfahren und in einer komplexen Konzernstruktur auftaucht, wird nicht zur Schlagzeile, sondern zum Forschungsfall. Die App zeigt den Auslöser, bestimmt die relevante Vergleichsgruppe, prüft konkurrierende Erklärungen, sucht nach Gegenevidenz und macht sichtbar, welche Informationen noch fehlen, um zwischen verschiedenen Hypothesen zu unterscheiden. So entsteht ein nachvollziehbares Dossier – vom ersten Befund bis zur offenen Frage, nie ein automatisches Urteil.", "Dafür verbindet Finance/Insurance2Agent Datenebenen, die gewöhnlich getrennt betrachtet werden: Rechtsträger- und Konzernbeziehungen aus offiziellen Referenzdaten, europäische Vergabeverfahren mit Auftraggeber-, Bieter- und Gewinnerrollen, aufsichtsrechtliche Bankendaten bis zur einzelnen Meldeposition, Solvenz- und Versicherungskennzahlen mit Rückbindung an ihre Ursprungsberichte sowie Länder-, Branchen- und weitere Risikodimensionen. Hinzu kommen, soweit verlässlich erschlossen und rechtlich zugänglich, weitere öffentliche Quellen zu Projekten, Fördermitteln, Insolvenz- und Restrukturierungsereignissen, Sanktionen sowie Verfahren europäischer Kontroll- und Strafverfolgungsinstitutionen.", "Dabei gelten strenge Identitäts- und Evidenzregeln. Eine Tochtergesellschaft wird nie stillschweigend zur Mutter, eine Bieterrolle nie zum Zuschlag, eine Namensähnlichkeit nie zur bestätigten Identität. Jede Verbindung trägt ihre eigene Belegkette. Wo diese Belegkette nicht ausreicht, bleibt die Zuordnung offen.", "DISCOVER sucht systematisch nach Forschungsanlässen: Kennzahlen, die ihre Bedeutung verändert haben, später revidierte Werte, scheinbar gleiche Varianten mit unterschiedlicher Semantik, unerwartete Brüche in Zeitreihen, Beobachtungen, die eigentlich vorhanden sein müssten, aber fehlen. Solche Funde sind Research Leads — Ausgangspunkte für INVESTIGATE, keine Behauptungen.", "INVESTIGATE verfolgt solche Leads weiter. Ein Befund kann mit Vergleichsgruppen, Eigentums- und Abhängigkeitsstrukturen, öffentlichen Aufträgen, regulatorischen Daten, Projekten, Geographie, Handels- oder Enforcement-Kontext verbunden werden. Dabei werden nicht nur eine erste Hypothese, sondern auch ernsthafte Alternativerklärungen, Gegenevidenz, Datenlücken und der jeweilige epistemische Status festgehalten.", "Langfristig soll dieselbe Strenge auch dynamische Fragen tragen: Wie verändert sich ein Risiko unter Stress, welche unauffällige Verbindung wird bei einem Regimewechsel plötzlich relevant, welche Stabilität zeigt sich nur, solange man ein vereinfachtes Modell betrachtet. Dieselben Provenienz- und Unsicherheitsregeln würden auch dafür gelten.", "Eine Grenze bleibt dabei unverhandelbar: Muster sind keine Urteile. Kein Kriminalitäts- oder Betrugs-Score, kein Ranking von Verdächtigen, keine automatische Schuld- oder Korruptionszuschreibung, keine Analyse natürlicher Personen. Gleich benannte Kennzahlen werden nie gleichgesetzt, wenn Regime, Modell, Übergangsmaßnahme oder Konsolidierungsebene verschieden sind — ist die Vergleichsgrundlage ungeklärt, bleibt die Rechnung aus. Was sich nicht belastbar zuordnen lässt, bleibt sichtbar als offene Frage.", "Finance/Insurance2Agent soll Unsicherheit nicht verstecken, sondern untersuchbar machen."], en: ["Finance/Insurance2Agent connects financial, insurance, supervisory, corporate and public data in a provenance-first research environment. Banks, insurers, group structures, regulatory filings and – where reliable public sources are available – procurement procedures and other institutional relationships can be investigated together. Every number used and every substantiated connection should remain traceable to its source. The app is neither a supervisory publication nor investment, insurance or legal advice: it is a research instrument for those who want to know how a finding arises – and what the available data do not support.", "The core is investigation itself. An unusual capital ratio, an unexpected structural change, or a company that appears both in a procurement procedure and in a complex group structure is not turned into a headline but into a research case. The app shows the trigger, determines the relevant comparison group, tests competing explanations, searches for counterevidence, and makes visible what information is still missing to distinguish between competing hypotheses. The result is a traceable dossier – from the first finding to the open question, never an automatic judgment.", "To do this, Finance/Insurance2Agent connects data layers that are usually considered separately: legal-entity and group relationships from official reference data, European procurement procedures with buyer, tenderer and winner roles, supervisory banking data down to the individual reporting position, solvency and insurance metrics linked back to their source reports, as well as country, sector and other risk dimensions. Added to these, where reliably sourced and legally accessible, are further public sources on projects, funding, insolvency and restructuring events, sanctions, and proceedings of European oversight and prosecutorial institutions.", "Strict identity and evidence rules apply. A subsidiary is never silently turned into its parent, a tenderer role never into an award, and name similarity never into confirmed identity. Every connection carries its own chain of evidence. Where that chain is insufficient, the assignment remains open.", "DISCOVER systematically looks for research leads: metrics whose meaning has changed, values that were later revised, apparently identical variants with different semantics, unexpected breaks in time series, and observations that ought to be present but are missing. Such findings are Research Leads — starting points for INVESTIGATE, not claims.", "INVESTIGATE follows such leads further. A finding can be connected with comparison groups, ownership and dependency structures, public contracts, regulatory data, projects, geography, trade or enforcement context. The system records not only an initial hypothesis, but also serious alternative explanations, counterevidence, data gaps, and the respective epistemic status.", "In the long term, the same rigor should also support dynamic questions: How does a risk change under stress, which inconspicuous connection suddenly becomes relevant when the regime changes, which apparent stability persists only as long as one looks at a simplified model. The same provenance and uncertainty rules would apply there as well.", "One boundary remains non-negotiable: patterns are not judgments. No crime or fraud score, no ranking of suspects, no automatic attribution of guilt or corruption, no analysis of natural persons. Metrics with the same name are never equated when regime, model, transitional measure, or consolidation level differ — if the basis for comparison is unresolved, the calculation is withheld. What cannot be assigned reliably remains visible as an open question.", "Finance/Insurance2Agent is meant not to hide uncertainty, but to make it investigable."] };
  const OLD_DE = ["Finanzdaten verstehen, ohne sie in eine einzige Note zu pressen.", "Bankenaufsicht, Vergütung/CbCR und Versicherer-/Nachhaltigkeitsdaten bleiben getrennte, quellengebundene Informationsebenen.", "Der Monitor verbindet drei bewusst getrennte Transparenzbereiche", "Säule A erschließt EBA- und P3DH-Daten", "Vergleiche bleiben dort begrenzt", "Entscheidend bleibt die Nachprüfbarkeit"];
  const OLD_EN = ["banking supervision", "remuneration", "country-by-country", "Munich Re", "ERGO", "traceability"];
  const COMPLETE_KEY_DE = "Finance/Insurance2Agent soll Unsicherheit nicht verstecken, sondern untersuchbar machen.";
  const COMPLETE_KEY_EN = "Finance/Insurance2Agent is meant not to hide uncertainty, but to make it investigable.";
  let target = null;
  let companionNodes = [];
  let busy = false;

  function detectLang() {
    const l = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (l.startsWith("en")) return "en";
    if (l.startsWith("de")) return "de";
    const t = (document.body && document.body.innerText) || "";
    return /\bCOMPARE\b/.test(t) && /\bINVESTIGATE\b/.test(t) ? "en" : "de";
  }

  function score(el, anchors) {
    if (!el || !el.textContent) return -1;
    const txt = el.textContent.trim();
    if (txt.length < 120) return -1;
    const n = anchors.filter(a => txt.includes(a)).length;
    if (!n) return -1;
    let s = n * 100000 - txt.length;
    const cls = ((el.id || "") + " " + (typeof el.className === "string" ? el.className : "")).toLowerCase();
    if (/intro|hero|copy|description|lead|overview/.test(cls)) s += 5000;
    return s;
  }

  function bestContaining(anchors) {
    const all = Array.from(document.querySelectorAll("main *, body > *"));
    const ranked = all.map(el => [score(el, anchors), el]).filter(x => x[0] >= 0).sort((a,b)=>b[0]-a[0]);
    return ranked.length ? ranked[0][1] : null;
  }

  function findRegion() {
    const existing = document.querySelector("[data-fi2a-complete-intro='1']");
    if (existing) return existing;
    let el = bestContaining(OLD_DE);
    if (el) return el;

    // English fallback: prefer likely intro/hero containers with several characteristic hints.
    const cands = Array.from(document.querySelectorAll("main p, main div, main section, .hero *, #hero *"));
    let best = null, bestScore = -1;
    for (const x of cands) {
      const txt = (x.textContent || "").trim();
      if (txt.length < 250) continue;
      const lower = txt.toLowerCase();
      const n = OLD_EN.filter(a => lower.includes(a.toLowerCase())).length;
      const cls = ((x.id || "") + " " + (typeof x.className === "string" ? x.className : "")).toLowerCase();
      const s = n * 1000 + (/intro|hero|copy|description|lead|overview/.test(cls) ? 500 : 0) - txt.length/10000;
      if (n >= 3 && s > bestScore) { best = x; bestScore = s; }
    }
    if (best) return best;

    // Last-resort direct selectors, but only if the element is substantial.
    const sels = ["#heroText","#heroCopy","#heroIntro","#heroSubtitle","#intro","#introText","[data-i18n*='intro']","[data-i18n*='hero']",".hero-copy",".hero-text",".hero-intro",".intro-copy",".intro-text"];
    const ds = [...new Set(sels.flatMap(s => Array.from(document.querySelectorAll(s))))].filter(x => (x.textContent||"").trim().length > 250);
    return ds.length === 1 ? ds[0] : null;
  }

  function paragraphHTML(lang, p, i) {
    let x = p;
    if (i === 0) x = x.replace("Finance/Insurance2Agent", "<strong>Finance/Insurance2Agent</strong>");
    if (i === 1) {
      const a = lang === "de" ? "Das Herzstück ist das Untersuchen selbst." : "The core is investigation itself.";
      x = x.replace(a, "<strong>" + a + "</strong>");
    }
    if (i === 4) x = x.replace("DISCOVER", "<strong>DISCOVER</strong>");
    if (i === 5) x = x.replace("INVESTIGATE", "<strong>INVESTIGATE</strong>");
    if (i === 7) {
      const a = lang === "de" ? "Muster sind keine Urteile." : "patterns are not judgments.";
      x = x.replace(a, "<strong>" + a + "</strong>");
    }
    if (i === 8) x = "<strong>" + x + "</strong>";
    return '<span class="fi2a-complete-intro-paragraph" style="display:block;margin:0 0 1.05em 0">' + x + '</span>';
  }

  function render(lang) {
    return COPY[lang].map((p,i)=>paragraphHTML(lang,p,i)).join("");
  }

  function apply() {
    if (busy) return;
    busy = true;
    try {
      if (!target || !document.contains(target)) target = findRegion();
      if (!target) {
        document.documentElement.setAttribute("data-fi2a-complete-intro-status","TARGET_NOT_FOUND");
        return;
      }
      const lang = detectLang();
      const key = lang === "de" ? COMPLETE_KEY_DE : COMPLETE_KEY_EN;
      if (!target.textContent.includes(key) || target.getAttribute("data-fi2a-complete-intro-lang") !== lang) {
        target.innerHTML = render(lang);
      }
      target.setAttribute("data-fi2a-complete-intro","1");
      target.setAttribute("data-fi2a-complete-intro-lang",lang);
      document.documentElement.setAttribute("data-fi2a-complete-intro-status","PASS_" + lang.toUpperCase());
    } finally { busy = false; }
  }

  function schedule() { setTimeout(apply, 20); setTimeout(apply, 120); setTimeout(apply, 400); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule, {once:true}); else schedule();
  document.addEventListener("click", schedule, true);
  new MutationObserver(() => { if (!busy) schedule(); }).observe(document.documentElement, {attributes:true, attributeFilter:["lang"]});
})();
/* FI2A_COMPLETE_INVESTIGATIVE_INTRO_20261004_R1_END */
