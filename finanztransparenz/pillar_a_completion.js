"use strict";
(() => {
 const TXT={
  de:{eyebrow:"Säule A · Kennzahlenkatalog",title:"Prudenzielle Kennzahlen — Fortsetzung, Reihenbruch und methodische Grenzen",intro:"Der Kennzahlenkatalog vervollständigt den vorgesehenen Säule-A-Umfang, ohne nicht vergleichbare oder methodisch unbelegte Reihen künstlich fortzuschreiben. Original-XBRL ist die Wertquelle für P3DH; historische TE-Werte bleiben getrennt. 'Historical-only' ist eine methodische Entscheidung, kein Datenfehler.",source:"Original-XBRL / hashgebundene TE-Quelle",historical:"Nur historisch",noContinuation:"Keine methodisch vertretbare P3DH-Fortsetzung",currentOnly:"Aktuell standardisiert",seriesBreak:"Methodischer Reihenbruch",caveat:"Vergleichbar mit Hinweis",missing:"Keine Meldung beobachtet",noData:"Für dieses Institut liegt für diese Kennzahl im kontrollierten Umfang kein Wert vor.",method:"Methodischer Status",reason:"Grund",framework:"Framework",freshness:"Freshness",derived:"abgeleitet",sourceFact:"Quellenwert",audit:"Prüfebene",mapping:"Mappingvertrag",sign:"Vorzeichenregel",catalog:"Katalogstatus",knownIssue:"Bekannter EBA-DPM-Fehler",activeMappings:"aktive Mappingverträge",knownIssueBlocks:"bekannte Issue-Blocks"},
  en:{eyebrow:"Pillar A · metric catalogue",title:"Prudential metrics — continuation, series breaks and methodological limits",intro:"The metric catalogue completes the intended Pillar-A scope without manufacturing continuity for non-comparable or methodologically unsupported series. Original XBRL is the value source for P3DH; historical TE values remain separate. 'Historical-only' is a methodological decision, not a data error.",source:"Original XBRL / hash-bound TE source",historical:"Historical only",noContinuation:"No methodologically defensible P3DH continuation",currentOnly:"Current standardized",seriesBreak:"Series break",caveat:"Comparable with caveat",missing:"No disclosure observed",noData:"No value is available for this institution and metric in the controlled scope.",method:"Methodological status",reason:"Reason",framework:"Framework",freshness:"Freshness",derived:"derived",sourceFact:"source fact",audit:"Audit view",mapping:"Mapping contract",sign:"Sign rule",catalog:"Catalogue status",knownIssue:"Known EBA DPM issue",activeMappings:"active mapping contracts",knownIssueBlocks:"known-issue blocks"}
 };
 let data=null;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const lang=()=>document.documentElement.lang==='en'?'en':'de'; const t=k=>TXT[lang()][k]||k;
 const selectedLei=()=>document.querySelector('#bankSelect')?.value||'';
 const pct=v=>v===null||v===undefined||v===''?'—':new Intl.NumberFormat(lang()==='de'?'de-DE':'en-GB',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(v)*100)+' %';
 const money=v=>v===null||v===undefined||v===''?'—':new Intl.NumberFormat(lang()==='de'?'de-DE':'en-GB',{notation:'compact',maximumFractionDigits:2}).format(Number(v))+' EUR';
 const fmt=r=>r.unit==='RATIO_PER_UNIT'?pct(r.value):money(r.value);
 const METRICS=[
  {key:'Tier1',ids:['EBA_TIER1_RATIO_TRANSITIONAL','EBA_P3DH_TIER1_RATIO_KM1']},
  {key:'Total Capital',ids:['EBA_TOTAL_CAPITAL_RATIO_TRANSITIONAL','EBA_P3DH_TOTAL_CAPITAL_RATIO_KM1']},
  {key:'RWA / Assets',ids:['EBA_RWA_ASSETS_RATIO_DERIVED_TE2025','EBA_P3DH_TREA_PRUDENTIAL_ASSETS_RATIO_DERIVED']},
  {key:'NPL Coverage',ids:['EBA_P3DH_NPL_COVERAGE_DERIVED_CR1']},
  {key:'Forborne',ids:['EBA_P3DH_FORBORNE_LOANS_RATIO_DERIVED']},
  {key:'LCR',ids:['EBA_P3DH_LCR_KM1']},
  {key:'NSFR',ids:['EBA_P3DH_NSFR_KM1']},
  {key:'CIR',ids:['EBA_CIR_DERIVED_TE2025']},
  {key:'RoE',ids:[]},{key:'RoA',ids:[]},{key:'NIM',ids:[]}
 ];
 const KNOWN_ISSUE_STATUS='HISTORICAL_ONLY_CURRENT_P3DH_BLOCKED_EBA_DPM_KNOWN_ISSUE_2026_7745';
 const statusFor=k=>data.metric_status.find(x=>x.metric_key===k);
 const labelMode=m=>m==='SERIES_BREAK_REQUIRED'?t('seriesBreak'):m==='COMPARABLE_WITH_EXPLICIT_CAVEAT'?t('caveat'):m?.startsWith('HISTORICAL_ONLY')?t('historical'):t('currentOnly');
 const publicLifecycle=s=>s==='LIVE_AND_HISTORICAL_DONE_BUILD09'?'LIVE_AND_HISTORICAL_COMPLETE':s;
 const publicReason=(k,s)=>{if(!String(s||'').includes('Build09'))return s;const x={de:{CET1:'Kanonische historische und aktuelle Serie.',Leverage:'Kanonische historische und aktuelle Serie mit basisbezogenen Reihenbrüchen.','NPL Ratio':'Kanonische historische und aktuelle abgeleitete Serie.'},en:{CET1:'Canonical historical and current series.',Leverage:'Canonical historical and current series with basis-aware breaks.','NPL Ratio':'Canonical historical and current derived series.'}};return x[lang()][k]||String(s).replace(/Build09/g,'');};
 function detail(r){const d=document.querySelector('#detailDialog'),c=document.querySelector('#detailContent');if(!d||!c)return;const rows=[[t('framework'),r.framework],[t('freshness'),r.freshness_status],['Metric ID',r.metric_id],['Assertion',r.assertion_level],[t('method'),labelMode(r.comparison_mode)],[t('reason'),r.derivation||'—']]; if(r.sign_normalization_policy)rows.push([t('sign'),r.sign_normalization_policy]); c.innerHTML=`<div class="eyebrow">${esc(t('audit'))}</div><h2>${esc(r.metric)} · ${esc(r.reference_date)}</h2><p class="value-big">${esc(fmt(r))}</p><dl class="prov">${rows.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b??'—')}</dd>`).join('')}</dl>`;d.showModal();}
 function card(spec,recs){
  const key=spec.key, st=statusFor(key)||{lifecycle_status:'UNRESOLVED',reason:'—'};
  const rs=recs.filter(r=>spec.ids.includes(r.metric_id)).sort((a,b)=>a.reference_date.localeCompare(b.reference_date)||a.metric_id.localeCompare(b.metric_id));
  const histOnly=st.lifecycle_status.startsWith('HISTORICAL_ONLY'); const isBreak=st.lifecycle_status.includes('SERIES_BREAK'); const knownIssue=st.lifecycle_status===KNOWN_ISSUE_STATUS;
  let body='';
  if(rs.length){
   let seenCurrent=false; const bits=[];
   rs.forEach(r=>{const current=r.framework!=='TE2025'; if(isBreak&&current&&!seenCurrent){bits.push(`<div class="pa-series-break" role="separator"><span>${esc(t('seriesBreak'))}</span></div>`); seenCurrent=true;} bits.push(`<button type="button" class="pa-period ${r.framework==='TE2025'?'historical-period':'current-period'}" data-oid="${esc(r.observation_id)}"><small>${esc(r.reference_date)}</small><strong>${esc(fmt(r))}</strong><span>${esc(r.framework)}</span></button>`);});
   body=`<div class="pa-periods">${bits.join('')}</div>`; if(knownIssue)body+=`<div class="pa-method-note known-issue-block"><strong>${esc(t('knownIssue'))} · EBA Q&A 2026_7745</strong><p>${esc(st.reason)}</p></div>`;
  } else if(histOnly){body=`<div class="pa-method-note ${knownIssue?'known-issue-block':'historical-only'}"><strong>${esc(knownIssue?t('knownIssue'):t('noContinuation'))}${knownIssue?' · EBA Q&A 2026_7745':''}</strong><p>${esc(publicReason(key,st.reason))}</p></div>`;}
  else {body=`<div class="pa-method-note"><strong>${esc(t('noData'))}</strong><p>${esc(publicReason(key,st.reason))}</p></div>`;}
  const mode=st.lifecycle_status.includes('SERIES_BREAK')?'SERIES_BREAK_REQUIRED':st.lifecycle_status.startsWith('HISTORICAL_ONLY')?st.lifecycle_status:st.lifecycle_status.includes('CAVEAT')?'COMPARABLE_WITH_EXPLICIT_CAVEAT':'CURRENT_ONLY';
  return `<article class="pa-card" data-metric-key="${esc(key)}"><header><h3>${esc(key)}</h3><span class="pa-status">${esc(labelMode(mode))}</span></header>${body}<details><summary>${esc(t('catalog'))}</summary><p><code>${esc(publicLifecycle(st.lifecycle_status))}</code></p><p>${esc(publicReason(key,st.reason))}</p></details></article>`;
 }
 function render(){if(!data)return;const sec=document.querySelector('#pillarACompletionSection'),panel=document.querySelector('#pillarACompletionPanel');if(!sec||!panel)return;sec.querySelector('[data-pa-eyebrow]').textContent=t('eyebrow');sec.querySelector('[data-pa-title]').textContent=t('title');sec.querySelector('[data-pa-intro]').textContent=t('intro');sec.querySelector('[data-pa-meta]').innerHTML=`<span>${esc(t('source'))}</span><span>16 ${esc(t('activeMappings'))} + 2 ${esc(t('knownIssueBlocks'))}</span><span>RoE · RoA · NIM: ${esc(t('historical'))}</span>`;const lei=selectedLei();const recs=data.records.filter(r=>r.lei===lei);panel.innerHTML=METRICS.map(spec=>card(spec,recs)).join('');const byId=new Map(recs.map(r=>[r.observation_id,r]));panel.querySelectorAll('.pa-period').forEach(b=>b.addEventListener('click',()=>detail(byId.get(b.dataset.oid))));}
 async function init(){try{data=await fetch('./data/15_pillar_a_completion.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()});window.__ebaBuild10Completion=data;render();document.querySelector('#bankSelect')?.addEventListener('change',render);new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});}catch(e){console.error('Build10 completion load failed',e);}}
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
