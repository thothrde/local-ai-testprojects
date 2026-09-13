"use strict";
(() => {
  const METRIC_ESRS="PILLAR_B_ESRS_HIGHEST_PAID_TO_MEDIAN";
  const METRIC_CTX="PILLAR_B_CEO_TO_AVERAGE_FTE_SECTION162";
  const DB_ENTITY="58091005-f8fd-51fa-917c-e44529559a63";
  const CBK_ENTITY="cbc3d4ee-0fe2-57fd-9be8-050291cb9c39";
  const TXT={
    de:{eyebrow:"Säule B · Vergütung & Pay Ratio",title:"Vergütungsverhältnisse — getrennte Definitionen, sichtbare Grenzen",
    intro:"Zwei bewusst getrennte Kennzahlfamilien: ESRS S1-16 (höchstbezahlte Person / Median) und ein eigener §162-Kontextquotient (CEO-Vergütung / durchschnittliche FTE-Vergütung). Sie werden nicht ineinander umgerechnet oder zu einem Gesamtscore verschmolzen.",
    warningTitle:"Role-only Public-Payload · Human Review offen",warning:"Vergütungsangaben werden öffentlich nur rollenbezogen dargestellt. Direkte Personennamen und Personen-IDs sind aus der ausgelieferten Säule-B-Payload entfernt; indirekte Identifizierbarkeit bleibt möglich. Die finale menschliche Legal-/Datenschutz-Einzelfallprüfung ist ausdrücklich noch offen.",
    source:"15 hashgebundene Primärquellen",evidence:"47 E4-Observations",definitions:"2 getrennte Headline-Definitionen",
    esrsTitle:"ESRS S1-16 · höchste Vergütung / Median",esrsDef:"Direkt berichtete Verhältniszahl. „Höchstbezahlte Person“ ist nicht automatisch CEO.",
    ctxTitle:"§162 · CEO / durchschnittliche FTE-Vergütung",ctxDef:"Eigener kontextueller Quotient; kein gesetzlicher Like-for-like-Pay-Ratio.",
    unsupported:"Säule-B-Pilot derzeit nur für Deutsche Bank und Commerzbank.",suppression:"2024 unterdrückt",
    suppressionWhy:"Kein einzelner Volljahres-CEO-Zähler: CEO-Wechsel im Jahr; keine synthetische Jahreszahl.",
    detail:"Audit-Detail",personGate:"Rollenbezogene Vergütungsdaten · Review erforderlich",ratio:"Verhältnis",numerator:"Zähler",denominator:"Nenner",
    person:"Person",role:"Rolle",basis:"Vergütungsbasis",assertion:"Assertion",evidenceLevel:"Evidence",sourceDoc:"Quelle",sourceHash:"SHA-256",
    sourcePages:"Seiten",method:"Methode",caveats:"Methodische Hinweise",highestPaidCEO:"Höchstbezahlte Person = CEO?",
    yes:"ja",no:"nein",unknown:"nicht festgestellt",
    dbRestatement:"Deutsche Bank: 2020/2021 FTE-Durchschnittswerte folgen der ausdrücklich revidierten Fassung des 2022er Berichts; ältere Werte bleiben nur Auditkontext.",
    cbk2024:"Commerzbank 2024: kein numerischer CEO/FTE-Quotient. Die Suppression ist selbst Teil des Evidenzmodells.",
    provenance:"15 Primärquellen · E4 · Role-only Public-Payload · quellengebunden",multiple:"×"},
    en:{eyebrow:"Pillar B · remuneration & pay ratio",title:"Remuneration ratios — separate definitions, visible limits",
    intro:"Two deliberately separate metric families: ESRS S1-16 (highest-paid individual / median) and a separate §162 contextual ratio (CEO remuneration / average FTE remuneration). They are not converted into one another or merged into a composite score.",
    warningTitle:"Role-only public payload · human review outstanding",warning:"Public remuneration detail is shown by role only. Direct person names and person IDs are removed from the served Pillar-B payload; indirect identifiability may remain. Final human legal/privacy case review is explicitly still outstanding.",
    source:"15 hash-bound primary sources",evidence:"47 E4 observations",definitions:"2 separate headline definitions",
    esrsTitle:"ESRS S1-16 · highest-paid / median",esrsDef:"Directly reported ratio. “Highest-paid individual” is not automatically the CEO.",
    ctxTitle:"§162 · CEO / average FTE remuneration",ctxDef:"Separate contextual ratio; not a statutory like-for-like pay ratio.",
    unsupported:"Pillar-B pilot currently covers Deutsche Bank and Commerzbank only.",suppression:"2024 suppressed",
    suppressionWhy:"No single full-year CEO numerator: CEO changed during the year; no synthetic annual number.",
    detail:"Audit detail",personGate:"Role-based remuneration data · review required",ratio:"Ratio",numerator:"Numerator",denominator:"Denominator",
    person:"Person",role:"Role",basis:"Remuneration basis",assertion:"Assertion",evidenceLevel:"Evidence",sourceDoc:"Source",sourceHash:"SHA-256",
    sourcePages:"Pages",method:"Method",caveats:"Methodological caveats",highestPaidCEO:"Highest-paid individual = CEO?",
    yes:"yes",no:"no",unknown:"not established",
    dbRestatement:"Deutsche Bank: 2020/2021 average-FTE values use the explicit restatement in the 2022 report; superseded values remain audit context only.",
    cbk2024:"Commerzbank 2024: no numeric CEO/FTE ratio. The suppression is itself part of the evidence model.",
    provenance:"15 primary sources · E4 · role-only public payload · source-bound",multiple:"×"}
  };
  let data=null,contract=null;
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const lang=()=>document.documentElement.lang==="en"?"en":"de";
  const t=k=>TXT[lang()][k]||k;
  const selectedLei=()=>document.querySelector("#bankSelect")?.value||"";
  const fmtRatio=v=>v===null||v===undefined||v===""?"—":new Intl.NumberFormat(lang()==="de"?"de-DE":"en-GB",{minimumFractionDigits:1,maximumFractionDigits:2}).format(Number(v))+t("multiple");
  const fmtMoney=v=>v===null||v===undefined||v===""?"—":new Intl.NumberFormat(lang()==="de"?"de-DE":"en-GB",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Number(v));
  const year=d=>String(d||"").slice(0,4);
  const entities=()=>Object.values(data?.entities||{});
  const currentEntity=()=>entities().find(x=>x.lei===selectedLei())||null;
  const sourceMap=()=>new Map((data?.source_documents||[]).map(x=>[x.source_document_id,x]));
  const profileMap=()=>new Map((data?.comparability_profiles||[]).map(x=>[x.comparability_profile_id,x]));
  const personMap=()=>new Map((data?.person_context||[]).map(x=>[x.observation_id,x]));
  const payExtMap=()=>new Map((data?.pay_ratio_extension||[]).map(x=>[x.observation_id,x]));
  const byId=()=>new Map((data?.observations||[]).map(x=>[x.observation_id,x]));
  const obs=(eid,mid)=>(data?.observations||[]).filter(x=>x.entity_id===eid&&x.metric_id===mid).sort((a,b)=>a.reference_date.localeCompare(b.reference_date));
  const suppression=eid=>(data?.suppressions||[]).find(x=>x.entity_id===eid&&x.metric_id===METRIC_CTX);

  function headlineCard(title,defn,recs,kind,eid){
    const periods=recs.map(r=>`<button type="button" class="pb-period" data-pb-oid="${esc(r.observation_id)}"><small>${esc(year(r.reference_date))}</small><strong>${esc(fmtRatio(r.numeric_value))}</strong><span>${esc(r.assertion_level)}</span></button>`);
    if(kind==="contextual"){
      const s=suppression(eid);
      if(s)periods.push(`<div class="pb-period suppressed" data-pb-suppression="${esc(s.suppression_id)}"><small>${esc(year(s.reference_date))}</small><strong>${esc(t("suppression"))}</strong><span>${esc(t("suppressionWhy"))}</span></div>`);
    }
    return `<article class="pb-card" data-pb-kind="${esc(kind)}"><header><div><h3>${esc(title)}</h3><p class="pb-definition">${esc(defn)}</p></div><span class="pb-badge">E4</span></header><div class="pb-periods">${periods.join("")||`<div class="pb-empty">—</div>`}</div>${kind==="contextual"?`<div class="pb-method-note">${esc(t("ctxDef"))}</div>`:""}</article>`;
  }

  function detail(r){
    const dlg=document.querySelector("#detailDialog"),box=document.querySelector("#detailContent");
    if(!dlg||!box||!r)return;
    const sm=sourceMap(),pm=personMap(),pe=payExtMap(),prof=profileMap(),om=byId();
    const src=sm.get(r.source_document_id)||{},pc=pm.get(r.observation_id)||null,ext=pe.get(r.observation_id)||null,profile=prof.get(r.comparability_profile_id)||null;
    const lineage=(data.lineage||[]).filter(x=>x.derived_observation_id===r.observation_id);
    const inputForRole=role=>{
      const edge=lineage.find(x=>x.input_role===role);
      return edge?om.get(edge.input_observation_id)||null:null;
    };
    const num=inputForRole("NUMERATOR");
    const den=inputForRole("DENOMINATOR");
    const highest=ext?.highest_paid_is_ceo===true?t("yes"):ext?.highest_paid_is_ceo===false?t("no"):t("unknown");
    const caveats=(r.source_dimensions?.basis_caveats||[]).join(" · ");
    const rows=[[t("ratio"),fmtRatio(r.numeric_value)],[t("assertion"),r.assertion_level],[t("evidenceLevel"),r.evidence_level],
      [t("basis"),pc?.compensation_basis||profile?.compensation_basis||"—"],[t("role"),pc?.role_status||"—"],
      [t("numerator"),num?`${fmtMoney(num.numeric_value)} · ${num.metric_id}`:"—"],[t("denominator"),den?`${fmtMoney(den.numeric_value)} · ${den.metric_id}`:"—"],
      [t("method"),r.source_dimensions?.method||r.method_version||"—"],[t("caveats"),caveats||"—"],
      [t("sourceDoc"),src.title||src.source_id||"—"],[t("sourcePages"),r.source_page||"—"],[t("sourceHash"),src.sha256||r.source_dimensions?.source_pdf_sha256||"—"]];
    if(r.metric_id===METRIC_ESRS)rows.splice(4,0,[t("highestPaidCEO"),highest]);
    const link=src.canonical_url?`<p><a href="${esc(src.canonical_url)}" target="_blank" rel="noopener noreferrer">${esc(t("sourceDoc"))} ↗</a></p>`:"";
    box.innerHTML=`<div class="eyebrow">${esc(t("detail"))} · ${esc(t("eyebrow"))}</div><h2>${esc(year(r.reference_date))} · ${esc(fmtRatio(r.numeric_value))}</h2><div class="pb-detail-warning"><strong>${esc(t("personGate"))}</strong></div><dl class="prov">${rows.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join("")}</dl>${link}`;
    dlg.showModal();
  }

  function render(){
    if(!data||!contract)return;
    const sec=document.querySelector("#pillarBPreviewSection"),panel=document.querySelector("#pillarBPreviewPanel"),notes=document.querySelector("#pillarBAuditNotes");
    if(!sec||!panel||!notes)return;
    sec.querySelector("[data-pb-eyebrow]").textContent=t("eyebrow");
    sec.querySelector("[data-pb-title]").textContent=t("title");
    sec.querySelector("[data-pb-intro]").textContent=t("intro");
    sec.querySelector("[data-pb-meta]").innerHTML=`<span>${esc(t("source"))}</span><span>${esc(t("evidence"))}</span><span>${esc(t("definitions"))}</span>`;
    sec.querySelector("[data-pb-warning]").innerHTML=`<strong>${esc(t("warningTitle"))}</strong>${esc(t("warning"))}`;
    const entity=currentEntity();
    if(!entity){panel.innerHTML=`<div class="pb-empty">${esc(t("unsupported"))}</div>`;notes.innerHTML=`<div class="pb-audit-note">${esc(t("provenance"))}</div>`;return;}
    const esrs=obs(entity.entity_id,METRIC_ESRS),ctx=obs(entity.entity_id,METRIC_CTX);
    panel.innerHTML=[headlineCard(t("esrsTitle"),t("esrsDef"),esrs,"esrs",entity.entity_id),headlineCard(t("ctxTitle"),t("ctxDef"),ctx,"contextual",entity.entity_id)].join("");
    panel.querySelectorAll("button.pb-period[data-pb-oid]").forEach(btn=>btn.addEventListener("click",()=>detail(byId().get(btn.dataset.pbOid))));
    const extra=[];
    if(entity.entity_id===DB_ENTITY)extra.push(t("dbRestatement"));
    if(entity.entity_id===CBK_ENTITY)extra.push(t("cbk2024"));
    extra.push(t("provenance"));
    notes.innerHTML=extra.map(x=>`<div class="pb-audit-note">${esc(x)}</div>`).join("");
  }

  async function init(){
    try{
      const [d,c]=await Promise.all([
        fetch("./data/pillar_b_public.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}),
        fetch("./data/pillar_b_public_contract.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()})
      ]);
      const serialized=JSON.stringify(d);
      if(serialized.includes('"person_name"')||serialized.includes('"person_id"'))throw new Error("direct person identifiers present in public Pillar-B payload");
      data=d;contract=c;window.__financialTransparencyPillarB={data,contract,publicIdentityMode:"ROLE_ONLY",directIdentifiersAbsent:true};
      const wait=n=>{
        const sel=document.querySelector("#bankSelect");
        if(!sel||!sel.options.length){if(n>250)throw new Error("bankSelect not initialized");setTimeout(()=>wait(n+1),40);return;}
        sel.addEventListener("change",()=>setTimeout(render,0));
        new MutationObserver(()=>render()).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
        render();
      };
      wait(0);
    }catch(e){
      console.error("Pillar B",e);
      const p=document.querySelector("#pillarBPreviewPanel");if(p)p.innerHTML=`<div class="error">Pillar B data load failed: ${esc(e.message)}</div>`;
    }
  }
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init,{once:true}):init();
})();
