
"use strict";

const SIGNAL_REVIEW = "STATISTICAL_REVIEW_CANDIDATE";
const SIGNAL_NPL = "SUPERVISORY_NPL_5PCT_CONTEXT";

const files = {
  meta:"data/00_snapshot_meta.json",
  metricContract:"data/01_metrics.json",
  institutions:"data/02_institutions.json",
  headline:"data/03_headline_observations.json",
  support:"data/04_npl_support_components.json",
  lineage:"data/05_npl_lineage.json",
  missing:"data/06_missingness.json",
  peerGroups:"data/07_peer_groups.json",
  peerScores:"data/08_peer_scores.json",
  signals:"data/09_review_signals.json",
  sources:"data/10_sources.json",
  contract:"data/11_data_contract.json",
  labels:"data/12_ui_labels_de_en.json",
  releaseProvenance:"data/13_release_provenance_overlay.json",
  legal:"legal/legal_profile.json"
};

const periods = ["202409","202412","202503","202506"];
const periodDate = {202409:"2024-09-30",202412:"2024-12-31",202503:"2025-03-31",202506:"2025-06-30"};
const periodLabel = {
  de:{202409:"30.09.2024",202412:"31.12.2024",202503:"31.03.2025",202506:"30.06.2025"},
  en:{202409:"30 Sep 2024",202412:"31 Dec 2024",202503:"31 Mar 2025",202506:"30 Jun 2025"}
};

const ui = {
  de:{
    brandName:"Finanztransparenz-Monitor",brandSub:"Drei Säulen · quellengebundene Finanz- und Regulierungsdaten",method:"Methodik",legal:"Impressum & Datenschutz",
    notPublic:"Öffentliche Forschungs- und Transparenzanwendung",e4:"E4 · hashgebundene Quellenlage",
    noAdvice:"Keine Anlage- oder Bonitätsberatung",heroEyebrow:"Drei Säulen · Banken · Vergütung/CbCR · Munich Re/ERGO",
    heroTitle:"Finanzdaten verstehen, ohne sie in eine einzige Note zu pressen.",
    heroText:"Bankenaufsicht, Vergütung/CbCR und Versicherer-/Nachhaltigkeitsdaten bleiben getrennte, quellengebundene Informationsebenen.",
    intro1:"Der Monitor verbindet drei bewusst getrennte Transparenzbereiche: Bankenaufsicht, Vergütung und Länderberichterstattung sowie Munich Re / ERGO. Keine dieser Säulen wird zu einem Gesamtrisiko- oder Gütescore verdichtet.",
    intro2:"Säule A erschließt EBA- und P3DH-Daten: historische Zeitreihen, prudenzielle Kennzahlen, Peer-Kontext und sichtbare Reihenbrüche. Säule B hält unterschiedliche Vergütungsdefinitionen und CbCR-Länderangaben methodisch getrennt. Säule C bündelt quellengebundene Munich-Re-/ERGO-Daten zu Solvency II, Klima, IFRS 17, Vergütung und Steuertransparenz.",
    intro3:"Vergleiche bleiben dort begrenzt, wo Definitionen, Rechtsträger, Mitarbeiterbasen, Bilanzierungs- oder Solvenzmethoden nicht sauber zusammenpassen. Fehlende Werte bleiben fehlend; berichtete und abgeleitete Größen werden getrennt; statistische Auffälligkeit ist kein Fehlverhaltens- oder Qualitätsurteil.",
    intro4:"Entscheidend bleibt die Nachprüfbarkeit: Quellen, Stichtage, Definitionen, SHA-256-Bindung, Lineage und methodische Grenzen sind sichtbar. Die Anwendung soll nicht nur Zahlen zeigen, sondern nachvollziehbar machen, woher sie stammen und was man aus ihnen gerade nicht folgern darf.",
    search:"Institut suchen",choose:"Institut auswählen",latest:"Letzter Stichtag · 30.06.2025",metrics:"Kernkennzahlen",
    direct:"direkter Quellenwert",derived:"abgeleiteter Wert",trend:"Zeitverlauf",fourDates:"Vier EBA-Stichtage",
    trendIntro:"Linien zeigen nur die vier berichteten bzw. abgeleiteten Werte; die vertikale Skalierung ist je Kennzahl lokal und dient dem Verlauf, nicht dem Größenvergleich zwischen Kennzahlen.",
    peers:"Peer-Kontext",relative:"Relative Position",
    peerIntro:"Die Marke zeigt die Position innerhalb einer benannten Vergleichsgruppe. Sie ist keine Kapitalquote und kein Risikoscore.",
    review:"Review & Aufsichtskontext",signals:"Hinweise, keine Urteile",
    quality:"Datenqualität",missingTitle:"Fehlende Werte bleiben sichtbar",universe:"Universum",
    universeTitle:"119 Institute im historischen Snapshot",aggregate:"„All other banks“ ist als Reconciliation-Aggregat ausgeschlossen.",
    institution:"Institut",size:"Größenkohorte",missingCells:"Fehlende Zellen",footer:"Drei Säulen · provenance-first · öffentliche Forschungsanwendung",
    coverage:"Säule A · Headline-Abdeckung",available:"verfügbar",missing:"fehlend",germany:"Deutschland-Referenz",
    sizeCompare:"Größenvergleich",unavailable:"nicht verfügbar",validPeers:"gültige Peers",
    noPeer:"Für diesen Vergleich liegt kein Peer-Score vor.",noSignal:"Für dieses Institut gibt es in diesem Snapshot weder einen statistischen Review-Hinweis noch einen NPL-5%-Kontextfall.",
    reviewSignal:"Statistischer Review-Hinweis",nplContext:"Aufsichtsrechtlicher NPL-Kontext",
    reviewBadge:"statistischer Review",contextBadge:"Aufsichtskontext",
    noMissing:"Für dieses Institut sind alle zwölf Headline-Zellen verfügbar.",provenance:"Provenienz",
    source:"Quelle",officialSource:"Offizielle Quelle",hash:"SHA-256",datapoint:"Quell-Datapoint",row:"Quellzeile",assertion:"Aussagetyp",
    uncertainty:"Unsicherheitskennzeichen",uncertaintyFalse:"FALSE · nicht als unsicher markiert",uncertaintyTrue:"TRUE · als unsicher markiert",
    evidence:"Evidenzniveau",validation:"Validierung",version:"Methodenversion",
    peerPosition:"Position im Peer-Set",unfavourableEnd:"ungünstigeres Ende",favourableEnd:"günstigeres Ende",
    positionOf:"Rang {rank} von {n} · ab ungünstigerem Ende",techPercentile:"technisches favorable percentile",
    germanyLimitation:"Geografische Referenzgruppe: Die 23 deutschen Institute sind keine homogene Geschäftsmodell-Peergruppe. Eine extreme Position kann daher auch Geschäftsmodellunterschiede spiegeln.",
    sizeLimitation:"Analytische Größenkohorte auf Basis von Total Assets zum 30.06.2025; keine regulatorische Klassifikation.",
    reviewDisclaimerTitle:"Review-Hinweis ≠ Fehlverhaltensfeststellung",
    sizeDisclaimerTitle:"Größenkohorte ≠ regulatorische Klassifikation",
    methodTitle:"Methodik & Grenzen",methodIntro:"Diese Oberfläche verbindet drei getrennte quellengebundene Datenbereiche. Sie erzeugt keine neue fachliche Bewertung, keinen Gesamtscore und verändert den Datenkern nicht.",
    noComposite:"Kein Gesamtrisikoscore",noCompositeText:"Peer-Statistik, Aufsichtskontext und Quellwerte werden bewusst nicht zu einer Ampel oder Einzelnote verschmolzen.",
    noLookahead:"Kein Look-ahead bei Größenpeers",noLookaheadText:"Die Größenkohorten beruhen auf Total Assets zum 30.06.2025 und werden daher nur für diesen Stichtag peer-relativ verwendet.",
    noImpute:"Keine Imputation",noImputeText:"Fehlende Werte erscheinen als fehlend und niemals als Null oder geschätzter Wert.",
    e4Title:"E4-Provenienz",e4Text:"Die gezeigten Datenbereiche sind an archivierte bzw. verifizierte Quellen mit SHA-256 gebunden. E4 bezeichnet die quellengebundene Evidenzebene; die technische öffentliche Release-Fassung wurde separat verifiziert.",
    businessModelTitle:"Geschäftsmodell-Heterogenität",businessModelText:"Die Deutschlandgruppe ist eine geografische Referenzgruppe. Aussagen wie „gegenüber vergleichbaren Banken“ sind deshalb nicht zulässig, solange keine quellenbasierte Geschäftsmodellklassifikation eingefroren ist.",
    allDisclaimers:"Interpretations- und Nutzungshinweise",close:"Schließen",detailDialogLabel:"Auditdetail",methodDialogLabel:"Methodik & Grenzen",pillarNavLabel:"Drei Säulen",pillarALabel:"Säule A",pillarATitle:"Banken · EBA & P3DH",pillarADesc:"Aufsichtsdaten, Zeitreihen, Peers und methodische Grenzen.",pillarAIntro:"Historische EBA-Transparenzdaten und die kontrollierte P3DH-Fortführung bleiben als eigener prudenzeller Datenbereich sichtbar.",pillarBLabel:"Säule B",pillarBTitle:"Vergütung & CbCR",pillarBDesc:"Pay Ratios, Vergütungsdefinitionen und Länderberichterstattung.",pillarCLabel:"Säule C",pillarCTitle:"Munich Re & ERGO",pillarCDesc:"Solvency II, Klima, IFRS 17, Vergütung und Tax Transparency.",pillarADeepDiveEyebrow:"Säule A · Vertiefung",pillarADeepDiveTitle:"Zeitreihen, Peer-Kontext und vollständiges Institutsuniversum",pillarADeepDiveText:"Nach den drei Säulen folgt hier die vertiefte Bankenansicht mit Zeitverlauf, Vergleichskontext, Datenqualität und dem historischen 119-Institute-Snapshot.",documentTitle:"Finanztransparenz-Monitor — Banken · Vergütung · Munich Re / ERGO"
  },
  en:{
    brandName:"Financial Transparency Monitor",brandSub:"Three pillars · source-bound financial and regulatory data",method:"Method",legal:"Imprint & Privacy",
    notPublic:"Public research and transparency application",e4:"E4 · hash-bound source evidence",
    noAdvice:"Not investment advice or a credit assessment",heroEyebrow:"Three pillars · banks · remuneration/CbCR · Munich Re/ERGO",
    heroTitle:"Understand financial data without squeezing it into a single score.",
    heroText:"Bank supervision, remuneration/CbCR and insurer/sustainability data remain separate, source-bound information layers.",
    intro1:"The monitor combines three deliberately separate transparency areas: bank supervision, remuneration and country reporting, and Munich Re / ERGO. None of these pillars is collapsed into an overall risk or quality score.",
    intro2:"Pillar A makes EBA and P3DH data explorable: historical series, prudential metrics, peer context and visible series breaks. Pillar B keeps distinct remuneration definitions and CbCR country data methodologically separate. Pillar C brings together source-bound Munich Re / ERGO data on Solvency II, climate, IFRS 17, remuneration and tax transparency.",
    intro3:"Comparisons remain constrained wherever definitions, legal entities, workforce denominators, accounting or solvency methods are not genuinely compatible. Missing values remain missing; reported and derived measures stay separate; statistical outliers are not findings of misconduct or quality.",
    intro4:"Traceability remains central: sources, reference dates, definitions, SHA-256 binding, lineage and methodological limits stay visible. The application is meant not only to display numbers, but to show where they come from and what they do not justify concluding.",
    search:"Search institution",choose:"Select institution",latest:"Latest reference date · 30 Jun 2025",metrics:"Core metrics",
    direct:"direct source value",derived:"derived value",trend:"Trend",fourDates:"Four EBA reference dates",
    trendIntro:"Lines show only the four reported or derived values; the vertical scale is local to each metric and shows direction of change, not magnitude across metrics.",
    peers:"Peer context",relative:"Relative position",
    peerIntro:"The marker shows position within a named comparison group. It is not a capital ratio and not a risk score.",
    review:"Review & supervisory context",signals:"Signals, not conclusions",
    quality:"Data quality",missingTitle:"Missing values remain visible",universe:"Universe",
    universeTitle:"119 institutions in the historical snapshot",aggregate:"“All other banks” is excluded as a reconciliation aggregate.",
    institution:"Institution",size:"Size cohort",missingCells:"Missing cells",footer:"Three pillars · provenance-first · public research application",
    coverage:"Pillar A · headline coverage",available:"available",missing:"missing",germany:"Germany reference",
    sizeCompare:"Size comparison",unavailable:"unavailable",validPeers:"valid peers",
    noPeer:"No peer score is available for this comparison.",noSignal:"This institution has neither a statistical review signal nor an NPL 5% context case in this snapshot.",
    reviewSignal:"Statistical review signal",nplContext:"Supervisory NPL context",
    reviewBadge:"statistical review",contextBadge:"supervisory context",
    noMissing:"All twelve headline cells are available for this institution.",provenance:"Provenance",
    source:"Source",officialSource:"Official source",hash:"SHA-256",datapoint:"Source datapoint",row:"Source row",assertion:"Assertion type",
    uncertainty:"Uncertainty flag",uncertaintyFalse:"FALSE · not flagged uncertain",uncertaintyTrue:"TRUE · flagged uncertain",
    evidence:"Evidence level",validation:"Validation",version:"Method version",
    peerPosition:"Position in peer set",unfavourableEnd:"less favourable end",favourableEnd:"more favourable end",
    positionOf:"Rank {rank} of {n} · counted from less favourable end",techPercentile:"technical favourable percentile",
    germanyLimitation:"Geographic reference group: the 23 German institutions are not a homogeneous business-model peer group. An extreme position may therefore also reflect business-model differences.",
    sizeLimitation:"Analytical size cohort based on Total Assets at 30 Jun 2025; not a regulatory classification.",
    reviewDisclaimerTitle:"Review signal ≠ finding of misconduct",
    sizeDisclaimerTitle:"Size cohort ≠ regulatory classification",
    methodTitle:"Method & limitations",methodIntro:"This interface connects three separate source-bound data areas. It creates no new substantive judgement, no composite score and does not change the data core.",
    noComposite:"No composite risk score",noCompositeText:"Peer statistics, supervisory context and source values are deliberately not merged into a traffic light or single grade.",
    noLookahead:"No look-ahead in size peers",noLookaheadText:"Size cohorts use Total Assets at 30 Jun 2025 and are therefore used peer-relatively only for that reference date.",
    noImpute:"No imputation",noImputeText:"Missing values remain missing and are never displayed as zero or as an estimate.",
    e4Title:"E4 provenance",e4Text:"The displayed data areas are bound to archived or verified sources with SHA-256. E4 denotes the source-bound evidence level; the public technical release is verified separately.",
    businessModelTitle:"Business-model heterogeneity",businessModelText:"The Germany group is a geographic reference group. Wording such as “compared with similar banks” is therefore not justified until a source-backed business-model classification has been frozen.",
    allDisclaimers:"Interpretation and use notices",close:"Close",detailDialogLabel:"Audit detail",methodDialogLabel:"Method & limits",pillarNavLabel:"Three pillars",pillarALabel:"Pillar A",pillarATitle:"Banks · EBA & P3DH",pillarADesc:"Supervisory data, time series, peers and methodological limits.",pillarAIntro:"Historical EBA transparency data and the controlled P3DH continuation remain a distinct prudential data area.",pillarBLabel:"Pillar B",pillarBTitle:"Remuneration & CbCR",pillarBDesc:"Pay ratios, remuneration definitions and country reporting.",pillarCLabel:"Pillar C",pillarCTitle:"Munich Re & ERGO",pillarCDesc:"Solvency II, climate, IFRS 17, remuneration and tax transparency.",pillarADeepDiveEyebrow:"Pillar A · deep dive",pillarADeepDiveTitle:"Time series, peer context and the full institution universe",pillarADeepDiveText:"After the three pillars, this section returns to the deeper bank view with trends, comparison context, data quality and the historical 119-institution snapshot.",documentTitle:"Financial Transparency Monitor — Banks · Remuneration · Munich Re / ERGO"
  }
};

const state={lang:"de",data:null,lei:"7LTWFZYICNSX8D621K86",filtered:[]};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const n=x=>(x===null||x===undefined||x==="")?null:Number(x);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const t=k=>ui[state.lang][k]??k;
const percent=(x,d=2)=>n(x)===null?"—":`${(n(x)*100).toFixed(d)} %`;
const money=x=>n(x)===null?"—":new Intl.NumberFormat(state.lang==="de"?"de-DE":"en-GB",{maximumFractionDigits:0}).format(n(x))+" Mio. €";

async function load(){
  const pairs=await Promise.all(Object.entries(files).map(async([k,u])=>{
    const r=await fetch(u,{cache:"no-store"});
    if(!r.ok) throw new Error(`${u}: HTTP ${r.status}`);
    return [k,await r.json()];
  }));
  state.data=Object.fromEntries(pairs);
  state.filtered=state.data.institutions.slice();
}
function current(){return state.data.institutions.find(x=>x.lei===state.lei)}
function metricContract(mid){return state.data.metricContract.find(x=>x.metric_id===mid)}
function metricName(mid){return state.data.labels.metrics[mid]?.[state.lang]?.name??mid}
function metricShort(mid){return state.data.labels.metrics[mid]?.[state.lang]?.short??mid}
function peerName(gid){const x=state.data.labels.peer_groups[gid];return typeof x==="string"?x:(x?.[state.lang]??gid)}
function series(mid){return state.data.headline.filter(x=>x.lei===state.lei&&x.metric_id===mid).sort((a,b)=>a.reference_date.localeCompare(b.reference_date))}
function peerScore(mid,gid,p="202506"){return state.data.peerScores.find(x=>x.lei===state.lei&&x.metric_id===mid&&x.peer_group_id===gid&&x.period_text===p)}
function bankSignals(){return state.data.signals.filter(x=>x.lei===state.lei)}
function bankMissing(){return state.data.missing.filter(x=>x.lei===state.lei)}
function formatRank(x){
  const v=n(x); if(v===null)return "—";
  return Number.isInteger(v)?String(v):v.toFixed(1).replace(".",state.lang==="de"?",":".");
}
function favourableRank(score, mid){
  const asc=n(score.average_rank_ascending), cnt=n(score.valid_peer_count);
  if(asc===null||cnt===null)return null;
  return metricContract(mid)?.direction==="LOWER_BETTER" ? (cnt-asc+1) : asc;
}

function i18n(){
  document.documentElement.lang=state.lang;
  document.title=ui[state.lang].documentTitle;
  $$("[data-i18n]").forEach(x=>{if(ui[state.lang][x.dataset.i18n])x.textContent=ui[state.lang][x.dataset.i18n]});
  $$(`[data-i18n-aria-label]`).forEach(x=>{const k=x.dataset.i18nAriaLabel;if(ui[state.lang][k])x.setAttribute("aria-label",ui[state.lang][k])});
  $("#langButton").textContent=state.lang==="de"?"EN":"DE";
  $("#searchInput").placeholder=state.lang==="de"?"Deutsche Bank …":"Search bank …";
  const ds=state.data.labels.disclaimers[state.lang];
  // Contract disclaimer #2 and #4 are visible contextually, not hidden in method text.
  $("#reviewDisclaimer").textContent=ds[1];
  $("#sizeDisclaimer").textContent=ds[3];
}
function coverage(){
  const c=state.data.meta.counts,total=119*4*3,rate=c.headline_observations/total;
  $("#coverageBox").innerHTML=`<div class="eyebrow">${esc(t("coverage"))}</div>
    <div class="summary-big">${(rate*100).toFixed(1)} %</div>
    <div class="summary-row"><span>${esc(t("available"))}</span><strong>${c.headline_observations}</strong></div>
    <div class="summary-row"><span>${esc(t("missing"))}</span><strong>${c.missing_cells}</strong></div>
    <div class="summary-row"><span>Snapshot</span><strong>EBA TE2025</strong></div>`;
}
function controls(){
  const opts=state.filtered.slice().sort((a,b)=>a.legal_name.localeCompare(b.legal_name))
    .map(x=>`<option value="${esc(x.lei)}" ${x.lei===state.lei?"selected":""}>${esc(x.legal_name)} · ${esc(x.nsa)}</option>`).join("");
  $("#bankSelect").innerHTML=opts;
  const m=current(), chips=[`<span class="chip">LEI ${esc(m.lei)}</span>`,`<span class="chip">${esc(m.nsa)}</span>`];
  if(m.germany_reference_member)chips.push(`<span class="chip">${esc(t("germany"))}</span>`);
  if(m.size_cohort)chips.push(`<span class="chip">${esc(peerName(m.size_cohort.peer_group_id))}</span>`);
  else chips.push(`<span class="chip">${esc(t("sizeCompare"))}: ${esc(t("unavailable"))}</span>`);
  $("#bankMeta").innerHTML=chips.join("");
}
function spark(vals,derived=false){
  const good=vals.map(n).filter(x=>x!==null); if(good.length<2)return "";
  const lo=Math.min(...good),hi=Math.max(...good),range=(hi-lo)||1;
  const pts=vals.map((v,i)=>{v=n(v);if(v===null)return null;return [8+i*(84/(vals.length-1)),46-((v-lo)/range)*36]}).filter(Boolean);
  const line=pts.map((p,i)=>`${i?"L":"M"} ${p[0]} ${p[1]}`).join(" ");
  const area=`${line} L ${pts.at(-1)[0]} 51 L ${pts[0][0]} 51 Z`;
  return `<svg class="spark ${derived?"derived":""}" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true">
    <path class="area" d="${area}"></path><path class="line" d="${line}"></path>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="1.6"></circle>`).join("")}</svg>`;
}
function metricCards(){
  $("#metricCards").innerHTML=state.data.metricContract.map(mc=>{
    const s=series(mc.metric_id),latest=s.find(x=>x.reference_date==="2025-06-30"),derived=latest?.assertion_level==="DERIVED_METRIC";
    const vals=periods.map(p=>s.find(x=>x.reference_date===periodDate[p])?.numeric_value??null);
    const desc=state.data.labels.metrics[mc.metric_id]?.[state.lang]?.description??"";
    return `<article class="metric-card" role="button" tabindex="0" data-mid="${esc(mc.metric_id)}" aria-label="${esc(metricName(mc.metric_id))}: ${latest?percent(latest.numeric_value):"—"}. ${esc(t("provenance"))}">
      <div class="kind"><i class="dot ${derived?"derived":"direct"}"></i>${esc(derived?t("derived"):t("direct"))}</div>
      <div class="metric-name">${esc(metricName(mc.metric_id))}</div>
      <div class="metric-value">${latest?percent(latest.numeric_value):"—"}</div>
      <div class="metric-foot"><span>30.06.2025</span><span>E4</span></div>
      ${spark(vals,derived)}<div class="metric-desc">${esc(desc)}</div></article>`;
  }).join("");
  $$(".metric-card").forEach(c=>{
    const open=()=>provenance(c.dataset.mid);
    c.addEventListener("click",open);
    c.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}
    });
  });
}
function trendSvg(mid){
  const s=series(mid), by=Object.fromEntries(s.map(x=>[x.reference_date,n(x.numeric_value)]));
  const vals=periods.map(p=>by[periodDate[p]]??null), good=vals.filter(x=>x!==null);
  if(good.length<2)return `<div class="empty">—</div>`;
  let lo=Math.min(...good), hi=Math.max(...good);
  const spread=hi-lo, pad=spread===0?Math.max(Math.abs(hi)*.05,.001):spread*.18;
  lo-=pad; hi+=pad; const range=hi-lo||1;
  const xs=[34,143,252,361], y=v=>112-((v-lo)/range)*78;
  const pts=vals.map((v,i)=>v===null?null:[xs[i],y(v)]).filter(Boolean);
  const path=pts.map((p,i)=>`${i?"L":"M"} ${p[0]} ${p[1]}`).join(" ");
  const derived=metricContract(mid)?.assertion_type==="DERIVED_METRIC";
  return `<svg class="trend-svg" viewBox="0 0 395 145" role="img" aria-label="${esc(metricName(mid))} ${esc(t("trend"))}">
      <line class="trend-grid" x1="25" y1="34" x2="375" y2="34"></line>
      <line class="trend-grid" x1="25" y1="73" x2="375" y2="73"></line>
      <line class="trend-grid" x1="25" y1="112" x2="375" y2="112"></line>
      <path class="trend-line ${derived?"derived":""}" d="${path}"></path>
      ${vals.map((v,i)=>v===null?"":`<circle class="trend-point ${derived?"derived":""}" cx="${xs[i]}" cy="${y(v)}" r="4"></circle>`).join("")}
    </svg>
    <div class="trend-values">${periods.map((p,i)=>`<div class="trend-value-cell"><span>${esc(periodLabel[state.lang][p])}</span><strong>${vals[i]===null?"—":percent(vals[i])}</strong></div>`).join("")}</div>`;
}
function trends(){
  $("#trendPanel").innerHTML=state.data.metricContract.map(mc=>{
    const s=series(mc.metric_id), first=s[0], last=s.at(-1);
    const delta=(first&&last)?n(last.numeric_value)-n(first.numeric_value):null;
    const deltaText=delta===null?"":`${delta>=0?"+":""}${(delta*100).toFixed(2).replace(".",state.lang==="de"?",":".")} pp`;
    return `<div class="trend-chart"><div class="trend-chart-head"><strong>${esc(metricShort(mc.metric_id))}</strong><small>${esc(deltaText)}</small></div>${trendSvg(mc.metric_id)}</div>`;
  }).join("");
}
function peerMetric(mid,score){
  if(!score)return `<div class="peer-row"><div class="peer-row-head"><strong>${esc(metricShort(mid))}</strong><span class="subtle">${esc(t("noPeer"))}</span></div></div>`;
  const fav=Math.max(0,Math.min(1,n(score.favorable_percentile)));
  const rank=favourableRank(score,mid), cnt=n(score.valid_peer_count);
  const rankText=t("positionOf").replace("{rank}",formatRank(rank)).replace("{n}",formatRank(cnt));
  const tech=(fav*100).toFixed(1).replace(".",state.lang==="de"?",":".");
  return `<div class="peer-row">
    <div class="peer-row-head"><strong>${esc(metricShort(mid))}</strong><span class="peer-rank">${esc(rankText)}</span></div>
    <div class="position-axis" aria-label="${esc(rankText)}">
      <div class="position-line"></div>
      <div class="position-marker" style="left:${fav*100}%"></div>
    </div>
    <div class="position-labels"><span>${esc(t("unfavourableEnd"))}</span><span>${esc(t("favourableEnd"))}</span></div>
    <div class="peer-tech">${esc(t("techPercentile"))}: ${esc(tech)} % · ${esc(t("validPeers"))}: ${esc(score.valid_peer_count)}</div>
  </div>`;
}
function peers(){
  const m=current(), mids=state.data.metricContract.map(x=>x.metric_id),blocks=[];
  if(m.germany_reference_member)blocks.push({
    gid:"TE2025_DE_GEOGRAPHIC_REFERENCE",
    title:t("germany"),
    note:"30.06.2025",
    limitation:t("germanyLimitation")
  });
  if(m.size_cohort)blocks.push({
    gid:m.size_cohort.peer_group_id,
    title:peerName(m.size_cohort.peer_group_id),
    note:`30.06.2025 · ${money(m.size_cohort.total_assets_million_eur)}`,
    limitation:t("sizeLimitation")
  });
  $("#peerPanel").innerHTML=blocks.length?blocks.map(b=>`<div class="peer-block">
      <div class="peer-head"><strong>${esc(b.title)}</strong><small>${esc(b.note)}</small></div>
      <div class="peer-limitation">${esc(b.limitation)}</div>
      ${mids.map(mid=>peerMetric(mid,peerScore(mid,b.gid))).join("")}
    </div>`).join(""):`<div class="empty">${esc(t("noPeer"))}</div>`;
}
function signals(){
  const s=bankSignals(), contractDisclaimer=state.data.labels.disclaimers[state.lang][1];
  if(!s.length){$("#signalPanel").innerHTML=`<div class="empty">${esc(t("noSignal"))}</div>`;return}
  $("#signalPanel").innerHTML=s.map(x=>{
    const review=x.frontend_type===SIGNAL_REVIEW;
    const title=review?t("reviewSignal"):t("nplContext");
    const badge=review?t("reviewBadge"):t("contextBadge");
    const desc=state.data.labels.signal_types[x.frontend_type]?.[state.lang]?.description??"";
    const caveat=review?contractDisclaimer:(state.lang==="de"
      ?"Die 5%-Schwelle wird hier ausschließlich als separater EBA-Aufsichtskontext gezeigt; sie ist kein automatisches Qualitäts- oder Compliance-Urteil."
      :"The 5% threshold is shown only as separate EBA supervisory context; it is not an automatic quality or compliance conclusion.");
    return `<div class="signal ${review?"review":"context"}">
      <span class="signal-badge">${esc(badge)}</span>
      <strong>${esc(title)} · ${esc(periodLabel[state.lang][x.period_text])}</strong>
      <div>${esc(metricShort(x.metric_id))}: ${percent(x.numeric_value)}</div>
      <p>${esc(desc)}</p><div class="signal-caveat">${esc(caveat)}</div>
    </div>`;
  }).join("");
}
function missing(){
  const m=bankMissing();
  $("#missingPanel").innerHTML=m.length?m.map(x=>`<div class="missing-row"><span>${esc(metricShort(x.metric_id))} · ${esc(periodLabel[state.lang][x.period_text])}</span><span>${esc(t("missing"))}</span></div>`).join(""):`<div class="empty">${esc(t("noMissing"))}</div>`;
}
function universe(){
  $("#universeBody").innerHTML=state.data.institutions.slice().sort((a,b)=>a.legal_name.localeCompare(b.legal_name))
    .map(x=>`<tr tabindex="0" role="button" data-lei="${esc(x.lei)}" aria-label="${esc(x.legal_name)}"><td>${esc(x.legal_name)}</td><td>${esc(x.nsa)}</td><td>${x.size_cohort?esc(peerName(x.size_cohort.peer_group_id)):"—"}</td><td>${x.headline_missing_cell_count}</td></tr>`).join("");
  $$("#universeBody tr").forEach(tr=>{
    const activate=()=>{state.lei=tr.dataset.lei;state.filtered=state.data.institutions.slice();$("#searchInput").value="";render();window.scrollTo({top:document.querySelector(".chooser").offsetTop-80,behavior:"smooth"});};
    tr.addEventListener("click",activate);
    tr.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate();}});
  });
}
function provenance(mid){
  const o=series(mid).find(x=>x.reference_date==="2025-06-30"); if(!o)return;
  const rp=state.data.releaseProvenance||{};
  const sm=(rp.source_documents||[]).find(x=>x.source_document_id===o.source_document_id)||null;
  const um=(rp.headline_uncertainty||[]).find(x=>x.observation_id===o.observation_id)||null;
  const sourceUrl=sm&&(sm.canonical_url||sm.final_url);
  const sourceLink=sourceUrl?`<br><a href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(t("officialSource"))} ↗</a>`:"";
  const uncertaintyText=um&&um.uncertain===true?t("uncertaintyTrue"):t("uncertaintyFalse");
  $("#detailContent").innerHTML=`<div class="eyebrow">${esc(t("provenance"))}</div><h2>${esc(metricName(mid))} · ${percent(o.numeric_value)}</h2>
    <dl class="prov"><dt>${esc(t("source"))}</dt><dd>${esc(o.source_id)}<br><span class="mono">${esc(o.source_document_id)}</span>${sourceLink}</dd>
    <dt>${esc(t("hash"))}</dt><dd class="mono">${esc(o.sha256)}</dd><dt>${esc(t("datapoint"))}</dt><dd class="mono">${esc(o.source_datapoint)}</dd>
    <dt>${esc(t("row"))}</dt><dd>${o.source_row_number??"—"}</dd><dt>${esc(t("assertion"))}</dt><dd>${esc(o.assertion_level)}</dd>
    <dt>${esc(t("uncertainty"))}</dt><dd>${esc(uncertaintyText)}</dd>
    <dt>${esc(t("evidence"))}</dt><dd>${esc(o.evidence_level)}</dd><dt>${esc(t("validation"))}</dt><dd>${esc(o.validation_status)}</dd>
    <dt>${esc(t("version"))}</dt><dd>${esc(o.method_version)}</dd></dl>`;
  $("#detailDialog").showModal();
}
function method(){
  const ds=state.data.labels.disclaimers[state.lang];
  $("#methodContent").innerHTML=`<div class="eyebrow">${esc(t("methodTitle"))}</div><h2>${esc(t("methodTitle"))}</h2><p>${esc(t("methodIntro"))}</p>
    <div class="method-block"><strong>${esc(t("noComposite"))}</strong><p>${esc(t("noCompositeText"))}</p></div>
    <div class="method-block"><strong>${esc(t("businessModelTitle"))}</strong><p>${esc(t("businessModelText"))}</p></div>
    <div class="method-block"><strong>${esc(t("noLookahead"))}</strong><p>${esc(t("noLookaheadText"))}</p></div>
    <div class="method-block"><strong>${esc(t("noImpute"))}</strong><p>${esc(t("noImputeText"))}</p></div>
    <div class="method-block"><strong>${esc(t("e4Title"))}</strong><p>${esc(t("e4Text"))}</p></div>
    <div class="method-block"><strong>${esc(t("allDisclaimers"))}</strong><ul class="disclaimer-list">${ds.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="method-block mono">contract_version=${esc(state.data.contract.contract_version)}<br>public_release=true<br>technical_publication_verified=true<br>e5_release_verified=false<br>human_reviews_outstanding=true</div>`;
  $("#methodDialog").showModal();
}

function legalNotice(){
  const l=state.data.legal, c=l.ui[state.lang];
  $("#legalDialog").setAttribute("aria-label",c.title);
  const addr=l.provider.address_lines.map(esc).join("<br>");
  const editorAddr=l.responsible_editor.address_lines.map(esc).join("<br>");
    const yesno=v=>v?"TRUE":"FALSE";
  $("#legalContent").innerHTML=`
    <div class="legal-badge">${esc(c.local_badge)}</div>
    <div class="eyebrow">${esc(c.reviewed)}</div>
    <h2 id="legalDialogTitle">${esc(c.title)}</h2>

    <div class="legal-grid">
      <section class="legal-panel">
        <h3>${esc(c.provider_title)}</h3>
        <p>${esc(c.provider_intro)}</p>
        <p><strong>${esc(l.provider.name)}</strong><br>${addr}<br><span class="mono">${esc(l.provider.email)}</span></p>
        <p><strong>${esc(c.responsible_label)}</strong><br>${esc(l.responsible_editor.name)}<br>${editorAddr}</p>
      </section>
      <section class="legal-panel">
        <h3>${esc(c.independence_title)}</h3>
        <p>${esc(c.independence_text)}</p>
      </section>
    </div>

    <section class="legal-panel legal-wide">
      <h3>${esc(c.privacy_title)}</h3>
      <p>${esc(c.privacy_local)}</p>
      <p>${esc(c.privacy_future)}</p>
      <p>${esc(c.privacy_basis)}</p>
      <p>${esc(c.privacy_editorial)}</p>
      <h4>${esc(c.rights_title)}</h4>
      <p>${esc(c.rights_text)}</p>
    </section>

    <section class="legal-panel legal-wide">
      <h3>${esc(c.correction_title)}</h3>
      <p>${esc(c.correction_text)}</p>
      <p><strong>${esc(c.contact_label)}:</strong> <span class="mono">${esc(l.provider.email)}</span></p>
    </section>

    <section class="legal-panel legal-wide">
      <h3>${esc(c.source_title)}</h3>
      <p>${esc(c.source_text)}</p>
    </section>

    <section class="legal-panel legal-wide">
      <h3>${esc(c.editorial_title)}</h3>
      <p>${esc(c.editorial_text)}</p>
    </section>

    <section class="legal-panel legal-wide">
      <h3>${esc(c.source_reuse_title)}</h3>
      <p>${esc(c.source_reuse_policy_text)}</p>
    </section>

    <section class="legal-panel legal-wide">
      <h3>${esc(c.release_title)}</h3>
      <p>${esc(c.release_text)}</p>
      <div class="legal-status mono">
        public_deployment_profile=${esc(l.public_deployment_profile)}<br>
        imprint_review=${esc(l.release_gate_local_status.imprint_review)}<br>
        privacy_notice_review=${esc(l.release_gate_local_status.privacy_notice_review)}<br>
        pre_publication_legal_review=${esc(l.release_gate_local_status.pre_publication_legal_review)}<br>
        TECHNICAL_PUBLICATION_VERIFIED=${yesno(l.release_gate_local_status.TECHNICAL_PUBLICATION_VERIFIED)}<br>
        E5_RELEASE_VERIFIED=${yesno(l.release_gate_local_status.E5_RELEASE_VERIFIED)}<br>
        FINAL_HUMAN_LEGAL_REVIEW_REQUIRED=${yesno(l.release_gate_local_status.FINAL_HUMAN_LEGAL_REVIEW_REQUIRED)}<br>
        PERSONAL_DATA_REVIEW_REQUIRED=${yesno(l.release_gate_local_status.PERSONAL_DATA_REVIEW_REQUIRED)}<br>
        SOURCE_REUSE_FINAL_REVIEW_REQUIRED=${yesno(l.release_gate_local_status.SOURCE_REUSE_FINAL_REVIEW_REQUIRED)}<br>
        ACCESSIBILITY_MANUAL_AT_REVIEW_REQUIRED=${yesno(l.release_gate_local_status.ACCESSIBILITY_MANUAL_AT_REVIEW_REQUIRED)}<br>
        public_release_enabled=${yesno(l.release_gate_local_status.public_release_enabled)}
      </div>
    </section>`;
  $("#legalDialog").showModal();
}

function render(){
  i18n();coverage();controls();metricCards();trends();peers();signals();missing();universe();
  $("#snapshotStamp").textContent=state.lang==="de"?`Datenvertrag ${state.data.contract.contract_version} · öffentliche Fassung · 13.09.2026`:`Data contract ${state.data.contract.contract_version} · public edition · 13 Sep 2026`;
}
function bind(){
  $("#langButton").addEventListener("click",()=>{state.lang=state.lang==="de"?"en":"de";render()});
  $("#bankSelect").addEventListener("change",e=>{state.lei=e.target.value;render()});
  $("#searchInput").addEventListener("input",e=>{
    const q=e.target.value.trim().toLowerCase();
    state.filtered=state.data.institutions.filter(x=>!q||x.legal_name.toLowerCase().includes(q)||x.lei.toLowerCase().includes(q)||x.nsa.toLowerCase()===q);
    if(state.filtered.length&&!state.filtered.some(x=>x.lei===state.lei))state.lei=state.filtered[0].lei;
    controls();
  });
  $("#legalButton").addEventListener("click",legalNotice);
  $("#methodButton").addEventListener("click",method);
  $("#closeMethod").addEventListener("click",()=>$("#methodDialog").close());
  $("#closeLegal").addEventListener("click",()=>$("#legalDialog").close());
  $("#closeDetail").addEventListener("click",()=>$("#detailDialog").close());
}
(async()=>{
  try{
    await load();
    if(!state.data.institutions.some(x=>x.lei===state.lei))state.lei=state.data.institutions[0].lei;
    bind();render();
  }catch(e){
    console.error(e);
    document.querySelector("main").innerHTML=`<div class="error"><strong>Snapshot load failed.</strong><br>${esc(e.message)}<br><br>Please access this application over HTTP(S); direct file:// opening is not supported.</div>`;
  }
})();
