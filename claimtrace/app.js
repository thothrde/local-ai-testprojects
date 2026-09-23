"use strict";

const state={
  data:null,indexes:null,labels:null,view:"claims",q:"",institution:"",status:"",family:"",sort:"institution",
  claimByRule:new Map()
};
const $=id=>document.getElementById(id);
const text=v=>v===null||v===undefined||v===""?"—":String(v);
const nf=new Intl.NumberFormat("de-DE",{maximumFractionDigits:2});

function el(tag,cls,content){
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(content!==undefined)n.textContent=content;
  return n;
}
function label(group,code){
  return state.labels?.[group]?.[code]?.de||code||"—";
}
function statusLabel(code){return label("status",code)}
function familyLabel(code){return label("family",code)}
function metricLabel(code){return label("metric",code)}
function scopeLabel(code){return label("scope",code)}
function unitLabel(code){return label("unit",code)}
function relationLabel(code){return label("relation",code)}
function operatorInfo(code){
  const x=state.labels?.operator?.[code];
  return x||{de:code||"",symbol:code||""};
}
function formatNumber(v){
  return typeof v==="number"?nf.format(v):text(v);
}
function formatDate(iso){
  if(!iso)return "—";
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m?`${m[3]}.${m[2]}.${m[1]}`:iso;
}
function targetHorizon(c){
  return c?.target?.target_horizon||c?.target_horizon||null;
}
function horizonLiteralLabel(v){
  return state.labels?.horizon_literal?.[v]?.de||v;
}
function horizonText(c){
  const t=c.target||{},h=targetHorizon(c);
  if(h?.type==="DUAL_YEAR_LITERAL")return h.literal||h.years?.join("/")||"—";
  if(h?.type==="QUALITATIVE_HORIZON")return horizonLiteralLabel(h.literal)||"qualitativ";
  if(h?.type==="SINGLE_END_DATE")return formatDate(h.end_date);
  if(t.target_period_end)return formatDate(t.target_period_end);
  return "Ohne expliziten Zielzeitpunkt";
}
function formatTarget(c){
  const t=c.target||{},p=[],op=operatorInfo(t.operator);
  if(c.canonical_claim_id==="volkswagen_group:VW_C_E04_OVERHEAD_2030_MINUS20_TO37" &&
     t.unit==="compound_percent_and_EUR_billion" &&
     t.value!==null && t.value!==undefined &&
     t.reduction_parameter!==null && t.reduction_parameter!==undefined){
    const parts=[`Reduktion um ${formatNumber(t.reduction_parameter)} % auf rund ${formatNumber(t.value)} Mrd. €`];
    const horizon=horizonText(c);
    if(horizon&&horizon!=="Ohne expliziten Zielzeitpunkt")parts.push(horizon);
    return parts.join(" · ");
  }
  const low=t.value_low,high=t.value_high;
  if(low!==null&&low!==undefined || high!==null&&high!==undefined){
    const range=`${formatNumber(low)}–${formatNumber(high)}`;
    if(op.symbol)p.push(`${op.symbol} ${range}`);
    else if(op.de)p.push(`${op.de}: ${range}`);
    else p.push(range);
  }else if(t.value!==null&&t.value!==undefined){
    const value=formatNumber(t.value);
    if(op.symbol)p.push(`${op.symbol} ${value}`);
    else if(op.de)p.push(`${op.de}: ${value}`);
    else p.push(value);
  }else if(op.de){
    p.push(op.de);
  }
  if(t.unit)p.push(unitLabel(t.unit));
  const horizon=horizonText(c);
  if(horizon&&horizon!=="Ohne expliziten Zielzeitpunkt")p.push(horizon);
  return p.join(" · ")||"—";
}
function blob(c){
  return [
    c.canonical_claim_id,c.institution_name,c.institution_slug,c.family,familyLabel(c.family),
    c.metric_id,metricLabel(c.metric_id),c.metric_definition_version,c.scope_entity,scopeLabel(c.scope_entity),
    c.source_id,c.source_rule_id,c.decision.status,statusLabel(c.decision.status),c.decision.status_basis,
    c.decision.note,c.decision.comparability,c.decision.comparability_reason,c.decision.observation_rule_id,
    c.target.operator,operatorInfo(c.target.operator).de,c.target.unit,unitLabel(c.target.unit),
    c.target.value,c.target.value_low,c.target.value_high,horizonText(c)
  ].filter(Boolean).join(" ").toLowerCase();
}
function matches(c){
  if(state.institution&&c.institution_slug!==state.institution)return false;
  if(state.status&&c.decision.status!==state.status)return false;
  if(state.family&&c.family!==state.family)return false;
  if(state.q&&!blob(c).includes(state.q))return false;
  return true;
}
function targetKey(c){
  const h=targetHorizon(c),t=c.target||{};
  if(h?.type==="DUAL_YEAR_LITERAL"&&Array.isArray(h.years))return String(h.years[0]||9999);
  if(h?.type==="SINGLE_END_DATE"&&h.end_date)return h.end_date;
  if(t.target_period_end)return t.target_period_end;
  return "9999-99-99";
}
function sortClaims(items){
  return [...items].sort((a,b)=>{
    if(state.sort==="status")return `${a.decision.status}|${a.institution_name}|${a.canonical_claim_id}`.localeCompare(`${b.decision.status}|${b.institution_name}|${b.canonical_claim_id}`,"de");
    if(state.sort==="family")return `${a.family}|${a.institution_name}|${a.canonical_claim_id}`.localeCompare(`${b.family}|${b.institution_name}|${b.canonical_claim_id}`,"de");
    if(state.sort==="target")return `${targetKey(a)}|${a.institution_name}|${a.canonical_claim_id}`.localeCompare(`${targetKey(b)}|${b.institution_name}|${b.canonical_claim_id}`,"de");
    return `${a.institution_name}|${metricLabel(a.metric_id)}|${a.canonical_claim_id}`.localeCompare(`${b.institution_name}|${metricLabel(b.metric_id)}|${b.canonical_claim_id}`,"de");
  });
}
function detailBox(title,value,mono=false){
  const b=el("div","detail-box");
  b.appendChild(el("h3","",title));
  b.appendChild(el("p",mono?"mono":"",text(value)));
  return b;
}
function targetClaimForRelation(c){
  const r=c.relation||{};
  const rule=r.later_claim_rule_id||r.earlier_claim_rule_id;
  if(!rule)return null;
  return state.claimByRule.get(`${c.institution_slug}:${rule}`)||null;
}
function relationView(c){
  const r=c.relation||{};
  if(!r.relation_type)return null;
  const box=el("section","relation-view");
  box.appendChild(el("h3","","Beziehung / Revisionskette"));
  const row=el("div","relation-row");
  const current=el("div","relation-node");
  current.appendChild(el("strong","",metricLabel(c.metric_id)));
  current.appendChild(el("span","mono",c.source_rule_id));
  const otherClaim=targetClaimForRelation(c);
  const otherRule=r.later_claim_rule_id||r.earlier_claim_rule_id||"—";
  const other=el("div","relation-node");
  other.appendChild(el("strong","",otherClaim?metricLabel(otherClaim.metric_id):"Verknüpfter Claim"));
  other.appendChild(el("span","mono",otherRule));
  const link=el("div","relation-link");
  link.appendChild(el("span","relation-line","→"));
  link.appendChild(el("span","relation-label",relationLabel(r.relation_type)));
  if(r.earlier_claim_rule_id){
    row.append(other,link,current);
    if(r.relation_type==="EXTENDS_DEADLINE_OF"){
      row.setAttribute("aria-label",`Früherer Claim ${otherRule}; Frist verlängert durch aktuellen Claim ${c.source_rule_id}.`);
    }else{
      row.setAttribute("aria-label",`${otherRule}; ${relationLabel(r.relation_type)}; ${c.source_rule_id}.`);
    }
  }else{
    row.append(current,link,other);
    row.setAttribute("aria-label",`${c.source_rule_id}; ${relationLabel(r.relation_type)}; ${otherRule}.`);
  }
  box.appendChild(row);
  if(r.evidence_source_id)box.appendChild(el("p","relation-source",`Beziehungs-Evidenz: ${r.evidence_source_id}`));
  return box;
}
function claimCard(c){
  const card=el("article","card"),s=el("div","card-summary");
  s.setAttribute("role","button");s.setAttribute("tabindex","0");s.setAttribute("aria-expanded","false");

  const detailId="claim-detail-"+c.canonical_claim_id.replace(/[^A-Za-z0-9_-]/g,"-");
  const accessibilityLabel=open=>`${text(c.institution_name)}; ${metricLabel(c.metric_id)}; ${familyLabel(c.family)}; Status ${statusLabel(c.decision.status)}; Ziel ${formatTarget(c)}; ${open?"Details schließen":"Details öffnen"}.`;
  s.setAttribute("aria-controls",detailId);
  s.setAttribute("aria-label",accessibilityLabel(false));

  const a=el("div","");
  a.appendChild(el("div","institution-kicker",text(c.institution_name)));
  a.appendChild(el("div","claim-title metric-display",metricLabel(c.metric_id)));
  a.appendChild(el("div","claim-meta",familyLabel(c.family)));
  a.appendChild(el("div","scope-line",`Scope: ${scopeLabel(c.scope_entity)}`));

  const b=el("div","");
  b.appendChild(el("div","pill",statusLabel(c.decision.status)));
  if(c.decision.human_review_required)b.appendChild(el("div","pill human","Human Review"));

  const d=el("div","");
  d.appendChild(el("div","claim-meta","Dokumentiertes Ziel"));
  d.appendChild(el("div","target-main",formatTarget(c)));

  const e=el("div","");
  e.appendChild(el("div","claim-meta","Quelle"));
  e.appendChild(el("div","mono source-compact",text(c.source_id)));

  s.append(a,b,d,e);

  const detail=el("div","card-detail"),grid=el("div","detail-grid");
  detail.id=detailId;
  detail.setAttribute("role","region");
  detail.setAttribute("aria-label",`${metricLabel(c.metric_id)} – Details`);
  [
    ["Claim-ID (technisch)",c.canonical_claim_id,true],
    ["Metric-ID (technisch)",c.metric_id,true],
    ["Source Rule ID",c.source_rule_id,true],
    ["Source ID",c.source_id,true],
    ["Metrikdefinition",c.metric_definition_version,true],
    ["Scope",scopeLabel(c.scope_entity),false],
    ["Operator",operatorInfo(c.target.operator).de,false],
    ["Einheit",unitLabel(c.target.unit),false],
    ["Zielhorizont",horizonText(c),false],
    ["Statusbasis",c.decision.status_basis,false],
    ["Vergleichbarkeit",c.decision.comparability,false],
    ["Begründung Vergleichbarkeit",c.decision.comparability_reason,false],
    ["Numerischer Befund",c.decision.numeric_threshold_result,false],
    ["Emittentenbewertung",c.decision.issuer_assessment,false],
    ["Observation",c.decision.observation_rule_id,true],
    ["Observation Value",c.decision.observation_value,false],
    ["Notiz",c.decision.note,false],
    ["Publication",c.publication_state,false]
  ].forEach(x=>grid.appendChild(detailBox(...x)));
  detail.appendChild(grid);
  const rv=relationView(c);if(rv)detail.appendChild(rv);

  const toggle=()=>{
    const open=card.classList.toggle("open");
    s.setAttribute("aria-expanded",String(open));
    s.setAttribute("aria-label",accessibilityLabel(open));
  };
  s.addEventListener("click",toggle);
  s.addEventListener("keydown",ev=>{
    if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();toggle()}
  });
  card.append(s,detail);
  return card;
}
function deferredCard(c){
  const card=el("article","card deferred-card");
  card.appendChild(el("div","pill","Vor-kanonisch zurückgestellt"));
  card.appendChild(el("h2","","Zurückgestellter Claim-Kandidat"));
  card.appendChild(el("p","mono",text(c.candidate_id)));
  card.appendChild(el("p","",text(c.basis)));
  const grid=el("div","detail-grid");
  grid.appendChild(detailBox("Disposition",c.canonicalization_disposition,true));
  grid.appendChild(detailBox("Re-entry",c.reentry_condition));
  grid.appendChild(detailBox("Source Rule",c.proposed_source_rule_id,true));
  grid.appendChild(detailBox("Publication",c.publication_state));
  card.appendChild(grid);
  return card;
}
function countBy(items,fn){
  const m=new Map();
  items.forEach(x=>{const k=fn(x);m.set(k,(m.get(k)||0)+1)});
  return m;
}
function clearNode(n){while(n.firstChild)n.removeChild(n.firstChild)}
function renderBarChart(containerId,tbodyId,entries){
  const root=$(containerId),tbody=$(tbodyId);
  clearNode(root);clearNode(tbody);
  if(!entries.length){
    root.appendChild(el("p","viz-empty","Keine Daten in der aktuellen Auswahl."));
    return;
  }
  const max=Math.max(...entries.map(x=>x.value),1);
  entries.forEach(item=>{
    const row=el("div","bar-row");
    row.appendChild(el("div","bar-label",item.label));
    const track=el("div","bar-track");
    const bar=el("div","bar-fill");
    bar.style.width=`${Math.max(2,(item.value/max)*100)}%`;
    bar.setAttribute("aria-hidden","true");
    track.appendChild(bar);
    row.appendChild(track);
    row.appendChild(el("div","bar-value",String(item.value)));
    root.appendChild(row);

    const tr=document.createElement("tr");
    tr.appendChild(el("td","",item.label));
    tr.appendChild(el("td","table-number",String(item.value)));
    tbody.appendChild(tr);
  });
}
function horizonBucket(c){
  const h=targetHorizon(c),t=c.target||{};
  if(h?.type==="DUAL_YEAR_LITERAL")return h.literal||h.years?.join("/")||"Doppeljahr";
  if(h?.type==="QUALITATIVE_HORIZON")return horizonLiteralLabel(h.literal)||"Qualitativer Horizont";
  if(h?.type==="SINGLE_END_DATE"&&h.end_date)return h.end_date.slice(0,4);
  if(t.target_period_end)return t.target_period_end.slice(0,4);
  return "Ohne expliziten Zielzeitpunkt";
}
function horizonSort(a,b){
  const na=/^\d{4}$/.test(a.key),nb=/^\d{4}$/.test(b.key);
  if(na&&nb)return Number(a.key)-Number(b.key);
  if(na)return -1;if(nb)return 1;
  return a.label.localeCompare(b.label,"de");
}
function renderVisuals(items){
  const box=$("visualOverview");
  if(!box)return;
  if(state.view==="deferred"){box.hidden=true;return}
  box.hidden=false;
  $("vizSelectionText").textContent=`${items.length} Claims in der aktuellen Auswahl`;

  const statusMap=countBy(items,c=>c.decision.status);
  const statusOrder=["UNRESOLVED","MET","EXCEEDED","SUPERSEDED","AMBIGUOUS","NOT_MET","NOT_COMPARABLE"];
  const statusEntries=statusOrder.filter(k=>statusMap.has(k)).map(k=>({key:k,label:statusLabel(k),value:statusMap.get(k)}));
  renderBarChart("statusChart","statusTableBody",statusEntries);

  const familyMap=countBy(items,c=>c.family);
  const familyOrder=["FINANCIAL_GUIDANCE","EFFICIENCY_TRANSFORMATION","WORKFORCE_REMUNERATION_DISTRIBUTION_CONTEXT","CLIMATE_ESG"];
  const familyEntries=familyOrder.filter(k=>familyMap.has(k)).map(k=>({key:k,label:familyLabel(k),value:familyMap.get(k)}));
  renderBarChart("familyChart","familyTableBody",familyEntries);

  const hm=countBy(items,horizonBucket);
  const horizonEntries=[...hm.entries()].map(([k,v])=>({key:k,label:k,value:v})).sort(horizonSort);
  renderBarChart("horizonChart","horizonTableBody",horizonEntries);
}
function render(){
  const root=$("content");root.replaceChildren();let items=[];
  if(state.view==="deferred"){
    items=state.data.deferred_precanonical_candidates;
    $("claimControls").hidden=true;
    $("resultLabel").textContent="zurückgestellte Kandidaten";
    items.forEach(x=>root.appendChild(deferredCard(x)));
  }else{
    $("claimControls").hidden=false;
    items=sortClaims(state.data.claims.filter(matches));
    if(state.view==="human")items=items.filter(x=>x.decision.human_review_required);
    $("resultLabel").textContent=state.view==="human"?"Human-Review-Claims":"Claims";
    items.forEach(x=>root.appendChild(claimCard(x)));
  }
  $("resultCount").textContent=items.length;
  renderVisuals(items);
  if(!items.length)root.appendChild(el("div","empty","Keine Einträge für diese Auswahl."));
}
function fillSelect(id,values,labeler=x=>x){
  const sel=$(id);
  values.forEach(v=>{
    const o=document.createElement("option");
    o.value=v;o.textContent=labeler(v);sel.appendChild(o);
  });
}
function setup(){
  state.claimByRule=new Map(state.data.claims.map(c=>[`${c.institution_slug}:${c.source_rule_id}`,c]));
  const canonical=state.data.canonical_snapshot||{};
  $("statClaims").textContent=state.data.claims.length;
  $("statInstitutions").textContent=canonical.institutions||Object.keys(state.indexes.institution).length;
  $("statHuman").textContent=state.indexes.human_review.length;
  $("statDeferred").textContent=state.data.deferred_precanonical_candidates.length;
  $("snapshotBox").textContent=
    `Canonical ${state.data.generated_from_canonical_sha256.slice(0,12)}…\n`+
    `${canonical.claims||state.data.claims.length} Claims · ${canonical.decisions||state.data.claims.length} Decisions\n`+
    `Publication ${canonical.publication_state||"BLOCKED"}`;

  fillSelect("institutionFilter",Object.keys(state.indexes.institution).sort(),
    x=>state.data.claims.find(c=>c.institution_slug===x)?.institution_name||x);
  fillSelect("statusFilter",Object.keys(state.indexes.status),statusLabel);
  fillSelect("familyFilter",Object.keys(state.indexes.family),familyLabel);

  $("searchInput").addEventListener("input",e=>{state.q=e.target.value.trim().toLowerCase();render()});
  $("institutionFilter").addEventListener("change",e=>{state.institution=e.target.value;render()});
  $("statusFilter").addEventListener("change",e=>{state.status=e.target.value;render()});
  $("familyFilter").addEventListener("change",e=>{state.family=e.target.value;render()});
  $("sortOrder").addEventListener("change",e=>{state.sort=e.target.value;render()});
  $("clearFilters").addEventListener("click",()=>{
    state.q=state.institution=state.status=state.family="";state.sort="institution";
    $("searchInput").value="";$("institutionFilter").value="";$("statusFilter").value="";
    $("familyFilter").value="";$("sortOrder").value="institution";render();
  });
  document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");state.view=btn.dataset.view;render();
  }));
  render();
}
Promise.all([
  fetch("data/APP_READ_MODEL.json").then(r=>{if(!r.ok)throw new Error("APP_READ_MODEL fetch failed");return r.json()}),
  fetch("data/APP_INDEXES.json").then(r=>{if(!r.ok)throw new Error("APP_INDEXES fetch failed");return r.json()}),
  fetch("data/PRESENTATION_LABELS_DE_EN.json").then(r=>{if(!r.ok)throw new Error("labels fetch failed");return r.json()})
]).then(([data,indexes,labels])=>{state.data=data;state.indexes=indexes;state.labels=labels;setup()})
  .catch(err=>{$("content").textContent="Daten konnten nicht geladen werden: "+err.message});
