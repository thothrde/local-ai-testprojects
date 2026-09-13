(() => {
  "use strict";

  const EXPECTED_SCHEMA = "PILLAR_C_PUBLIC_READMODEL_V1";
  const EXPECTED_SHA256 = "72430d7cece4855b2e5705dc8bf69ade56b90072994e6d74efa09ce11ef71f44";
  const DATA_URL = "data/pillar_c_public_readmodel.json";

  const T = {
    de: {
      heading: "Säule C · Munich Re / ERGO",
      kicker: "Versicherer · Solvency · Klima · Steuertransparenz",
      internal: "Öffentliche Daten · E4 · quellengebunden",
      lede: "Munich Re und ERGO bilden die dritte gleichwertige Säule: quellengebundene Versicherungs-, Nachhaltigkeits- und Steuerdaten ohne Gesamtscore. Unterschiedliche Rechtsträger, Solvenzmethoden und Steuerdatensätze bleiben ausdrücklich getrennt.",
      solvency: "Solvency II",
      solvencyNote: "Keine Rangliste: Rechtsträger sowie Übergangs- und LTG-Behandlung sind nicht automatisch vergleichbar.",
      entity: "Rechtsträger",
      date: "Stichtag",
      ratio: "Quote",
      treatment: "Behandlung / Scope",
      audit: "Audit",
      auditOpen: "Quelldetails öffnen",
      climate: "Climate Ambition 2025 · Ziel vs. Ist",
      targetRange: "Zielkorridor",
      actualReduction: "Berichtete Reduktion",
      baseline: "Baseline 2019",
      actual: "Ist 2025",
      sensitivity: "Nominalwert-Sensitivität",
      renewables: "Erneuerbare-Energien-Ziel",
      reached: "laut Quelle erreicht",
      climateCaveat: "Die 59,5 % sind der von Munich Re berichtete Wert nach der Climate-Ambition-2025-Methodik. Bei Nominalwerten für Schuldinstrumente wären es 57,2 %. Immobilienemissionen 2025 waren zum Veröffentlichungszeitpunkt teilweise approximiert.",
      remuneration: "ESRS Vergütungsverhältnis",
      remunerationNote: "Höchstbezahlte Person / Median der jährlichen Gesamtvergütung aller Beschäftigten. Die öffentliche Detaildarstellung bleibt rollenbezogen; die finale menschliche Legal-/Datenschutzprüfung bleibt offen.",
      csm: "ERGO · IFRS 17 CSM",
      csmNote: "Contractual Service Margin ist kein Embedded Value und kein Value of New Business.",
      tax: "Munich Re · Tax Transparency 2024",
      taxNote: "Die veröffentlichte ETR ist ein Quellenwert. Sie wird nicht aus den gerundeten PBT-/Steuerbeträgen zurückgerechnet. Beschäftigtenzahlen sind Personen, nicht FTE.",
      jurisdiction: "Land / berichtetes Aggregat",
      reportedAggregate: "berichtetes Aggregat",
      pbt: "Ergebnis vor Steuern",
      currentTax: "Laufende Ertragssteuer",
      etr: "Veröffentlichte ETR",
      expectedRate: "Erwarteter Körperschaftsteuersatz",
      paidTax: "Gezahlte Ertragssteuer",
      employees: "Beschäftigte",
      notApplicable: "N/A",
      sources: "Quellenbindung",
      sourcesNote: "11 Primärquellen · 186 SOURCE_FACT/E4-Beobachtungen · Snapshot SHA-256",
      scopeNote: "Aktuelle Abdeckung: Solvency II, ESRS-Vergütungsverhältnis, Climate Ambition 2025, ERGO IFRS-17-CSM und Munich Re Tax Transparency 2024. Climate Ambition 2030 bleibt als nächster Inhaltscheck offen. EV/VNB wird nur bei belastbarer, konsistenter Serie ergänzt.",
      auditTitle: "Audit- und Quellenbeleg",
      close: "Schließen",
      observation: "Observation-ID",
      metric: "Metrik",
      source: "Quelle",
      sourceId: "Source-ID",
      sourceSha: "Source SHA-256",
      page: "PDF-Seite / Locator",
      raw: "Rohwert",
      datapoint: "Source-Datapoint",
      dimensions: "Quellendimensionen",
      value: "Wert",
      status: "Status",
      dataError: "Pillar-C-Daten konnten nicht sicher geladen werden.",
      hashError: "Snapshot-Hash stimmt nicht mit dem kanonischen Säule-C-Snapshot überein."
    },
    en: {
      heading: "Pillar C · Munich Re / ERGO",
      kicker: "Insurers · solvency · climate · tax transparency",
      internal: "Public data · E4 · source-bound",
      lede: "Munich Re and ERGO form the third equal pillar: source-bound insurance, sustainability and tax data without a composite score. Different legal entities, solvency treatments and tax datasets remain explicitly separate.",
      solvency: "Solvency II",
      solvencyNote: "No ranking: legal-entity scope and transitional/LTG treatment are not automatically comparable.",
      entity: "Entity",
      date: "Date",
      ratio: "Ratio",
      treatment: "Treatment / scope",
      audit: "Audit",
      auditOpen: "Open source details",
      climate: "Climate Ambition 2025 · target vs actual",
      targetRange: "Target range",
      actualReduction: "Reported reduction",
      baseline: "2019 baseline",
      actual: "2025 actual",
      sensitivity: "Nominal-value sensitivity",
      renewables: "Renewable-energy target",
      reached: "reported achieved",
      climateCaveat: "59.5% is Munich Re's reported value under the Climate Ambition 2025 methodology. Using nominal values for debt instruments would yield 57.2%. 2025 direct-real-estate emissions were partly approximated at publication.",
      remuneration: "ESRS remuneration ratio",
      remunerationNote: "Highest-paid individual / median annual total remuneration for all employees. Public detail remains role-only; direct person names are not served and final human legal/privacy review remains outstanding.",
      csm: "ERGO · IFRS 17 CSM",
      csmNote: "Contractual Service Margin is not Embedded Value and not Value of New Business.",
      tax: "Munich Re · Tax Transparency 2024",
      taxNote: "Published ETR is a source fact. It is not recomputed from rounded PBT/tax amounts. Employee counts are persons, not FTE.",
      jurisdiction: "Country / reported aggregate",
      reportedAggregate: "reported aggregate",
      pbt: "Profit before tax",
      currentTax: "Current income tax",
      etr: "Published ETR",
      expectedRate: "Expected corporate tax rate",
      paidTax: "Paid income tax",
      employees: "Employees",
      notApplicable: "N/A",
      sources: "Source binding",
      sourcesNote: "11 primary sources · 186 SOURCE_FACT/E4 observations · snapshot SHA-256",
      scopeNote: "Current coverage: Solvency II, ESRS remuneration ratio, Climate Ambition 2025, ERGO IFRS 17 CSM and Munich Re Tax Transparency 2024. Climate Ambition 2030 remains the next content review. EV/VNB will only be added if a robust, consistent series is available.",
      auditTitle: "Audit and source evidence",
      close: "Close",
      observation: "Observation ID",
      metric: "Metric",
      source: "Source",
      sourceId: "Source ID",
      sourceSha: "Source SHA-256",
      page: "PDF page / locator",
      raw: "Raw value",
      datapoint: "Source datapoint",
      dimensions: "Source dimensions",
      value: "Value",
      status: "Status",
      dataError: "Pillar-C data could not be loaded safely.",
      hashError: "Snapshot hash does not match the canonical Pillar-C snapshot."
    }
  };

  let state = { data: null, flatById: new Map(), taxFieldById: new Map() };
  const lang = () => (document.documentElement.lang || "de").toLowerCase().startsWith("en") ? "en" : "de";
  const tr = key => T[lang()][key] || key;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const fmtNum = (n,max=1) => n == null ? "—" : new Intl.NumberFormat(lang()==="de"?"de-DE":"en-US",{maximumFractionDigits:max}).format(Number(n));
  const fmtPct = n => n == null ? "—" : `${fmtNum(n,1)} %`;
  const fmtEuroM = n => n == null ? "—" : `${fmtNum(n,0)} Mio. €`;
  const fmtCO2 = n => n == null ? "—" : `${fmtNum(n,0)} t CO₂e`;
  const fmtRatio = n => n == null ? "—" : `${fmtNum(n,1)}×`;
  const fmtPersons = n => n == null ? "—" : fmtNum(n,0);

  async function sha256Hex(text) {
    if (!globalThis.crypto?.subtle) throw new Error("crypto.subtle unavailable");
    const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("");
  }

  function indexObservations(data) {
    const flat=new Map();
    for (const family of ["solvency","remuneration_esrs","climate_target_vs_actual","ergo_ifrs17_csm"]) {
      for (const o of data.readmodel[family]) flat.set(o.observation_id,o);
    }
    const tax=new Map();
    for (const row of data.readmodel.munich_re_tax_cbcr) {
      for (const [role,v] of Object.entries(row.metrics)) {
        tax.set(v.observation_id,{...v,
          entity_name:"Munich Re Group",reference_date:row.reference_date,
          source_document_id:row.source_document_id,source_id:row.source_id,
          source_title:row.source_title,source_sha256:row.source_sha256,
          source_page:row.source_page,source_datapoint:`${row.jurisdiction_key}:${role}`,
          source_dimensions:{
            jurisdiction_key:row.jurisdiction_key,
            jurisdiction_label_raw:row.jurisdiction_label_raw,
            jurisdiction_type:row.jurisdiction_type,
            footnote:row.footnote,
            published_etr_must_not_be_recomputed:row.published_etr_must_not_be_recomputed,
            employee_count_basis:row.employee_count_basis
          }
        });
      }
    }
    state.flatById=flat; state.taxFieldById=tax;
  }

  function treatment(o) {
    const d=o.source_dimensions||{};
    if (d.ltg_treatment==="WITH_APPLIED_LTG_MEASURES") return lang()==="de"?"mit angewandten LTG-Maßnahmen":"with applied LTG measures";
    if (d.ltg_treatment==="WITHOUT_LTG_MEASURES") return lang()==="de"?"ohne LTG-Maßnahmen":"without LTG measures";
    if (d.transitional_treatment==="INCLUDES_TRANSITIONAL_MEASURES") return lang()==="de"?"inkl. Übergangsmaßnahmen":"incl. transitional measures";
    if (d.transitional_treatment==="EXCLUDES_TRANSITIONAL_MEASURES") return lang()==="de"?"ohne Übergangsmaßnahmen":"excl. transitional measures";
    if (d.model==="INTERNAL_MODEL") return lang()==="de"?"internes Modell · Quellen-Scope":"internal model · source scope";
    return lang()==="de"?"Quellen-Scope":"source-reported scope";
  }

  const auditButton=id=>`<button type="button" class="pc-audit-btn" data-pc-audit="${esc(id)}">${esc(tr("audit"))}</button>`;
  const climateValue=(data,metric)=>data.readmodel.climate_target_vs_actual.find(x=>x.metric_id===metric);

  function render() {
    if (!state.data) return;
    const d=state.data,root=document.getElementById("pillarCRoot");
    if (!root) return;
    document.getElementById("pillarCHeading").textContent=tr("heading");
    document.getElementById("pillarCInternalBadge").textContent=tr("internal");
    const close=document.getElementById("pillarCAuditClose");
    if (close) { close.textContent=tr("close");close.setAttribute("aria-label",tr("close")); }

    const solvRows=d.readmodel.solvency.map(o=>`
      <tr><td>${esc(o.entity_name)}</td><td>${esc(o.reference_date)}</td>
      <td><strong>${esc(fmtPct(o.numeric_value))}</strong></td>
      <td><span class="pc-badge">${esc(treatment(o))}</span></td><td>${auditButton(o.observation_id)}</td></tr>`).join("");

    const cLo=climateValue(d,"PILLAR_C_MR_FINANCED_GHG_TARGET_REDUCTION_LOWER_BOUND_PERCENT");
    const cHi=climateValue(d,"PILLAR_C_MR_FINANCED_GHG_TARGET_REDUCTION_UPPER_BOUND_PERCENT");
    const cActual=climateValue(d,"PILLAR_C_MR_FINANCED_GHG_REPORTED_REDUCTION_PERCENT");
    const cBase=climateValue(d,"PILLAR_C_MR_FINANCED_GHG_BASELINE_TCO2E");
    const cNow=climateValue(d,"PILLAR_C_MR_FINANCED_GHG_ACTUAL_TCO2E");
    const cSens=climateValue(d,"PILLAR_C_MR_FINANCED_GHG_ALT_NOMINAL_REDUCTION_PERCENT");
    const cRenew=climateValue(d,"PILLAR_C_MR_RENEWABLE_ENERGY_INVESTMENT_TARGET_EUR_M");
    const rem2025=d.readmodel.remuneration_esrs.find(x=>x.reference_date==="2025-12-31");
    const rem2024=d.readmodel.remuneration_esrs.find(x=>x.reference_date==="2024-12-31");
    const csm25=d.readmodel.ergo_ifrs17_csm.find(x=>x.reference_date==="2025-12-31");
    const csm24=d.readmodel.ergo_ifrs17_csm.find(x=>x.reference_date==="2024-12-31");

    const taxOptions=d.readmodel.munich_re_tax_cbcr.map(r=>{
      const suffix=r.jurisdiction_type==="AGGREGATE"?` · ${tr("reportedAggregate")}`:"";
      return `<option value="${esc(r.jurisdiction_key)}">${esc(r.jurisdiction_label_raw+suffix)}</option>`;
    }).join("");

    root.innerHTML=`
      <p class="pc-kicker">${esc(tr("kicker"))}</p>
      <p class="pc-lede">${esc(tr("lede"))}</p>
      <div class="pc-scope-note" role="note">${esc(tr("scopeNote"))}</div>
      <div class="pc-panel"><h3>${esc(tr("solvency"))}</h3>
      <p class="pc-note pc-warning">${esc(tr("solvencyNote"))}</p>
      <div class="pc-table-wrap"><table class="pc-table"><thead><tr>
      <th scope="col">${esc(tr("entity"))}</th><th scope="col">${esc(tr("date"))}</th><th scope="col">${esc(tr("ratio"))}</th>
      <th scope="col">${esc(tr("treatment"))}</th><th scope="col">${esc(tr("audit"))}</th></tr></thead><tbody>${solvRows}</tbody></table></div></div>

      <div class="pc-panel"><h3>${esc(tr("climate"))}</h3><div class="pc-grid">
      <div class="pc-card"><div>${esc(tr("targetRange"))}</div><div class="pc-value">${esc(fmtNum(cLo.numeric_value,1))}–${esc(fmtNum(cHi.numeric_value,1))} %</div>${auditButton(cLo.observation_id)}</div>
      <div class="pc-card"><div>${esc(tr("actualReduction"))}</div><div class="pc-value">${esc(fmtPct(cActual.numeric_value))}</div>${auditButton(cActual.observation_id)}</div>
      <div class="pc-card"><div>${esc(tr("baseline"))}</div><div class="pc-value">${esc(fmtCO2(cBase.numeric_value))}</div>${auditButton(cBase.observation_id)}</div>
      <div class="pc-card"><div>${esc(tr("actual"))}</div><div class="pc-value">${esc(fmtCO2(cNow.numeric_value))}</div>${auditButton(cNow.observation_id)}</div>
      <div class="pc-card"><div>${esc(tr("sensitivity"))}</div><div class="pc-value">${esc(fmtPct(cSens.numeric_value))}</div>${auditButton(cSens.observation_id)}</div>
      <div class="pc-card"><div>${esc(tr("renewables"))}</div><div class="pc-value">${esc(fmtEuroM(cRenew.numeric_value))}</div><div class="pc-delta">${esc(tr("reached"))}</div>${auditButton(cRenew.observation_id)}</div>
      </div><p class="pc-note">${esc(tr("climateCaveat"))}</p></div>

      <div class="pc-grid">
      <div class="pc-card"><h3>${esc(tr("remuneration"))}</h3><div class="pc-value">${esc(fmtRatio(rem2025.numeric_value))}</div>
      <div class="pc-delta">${esc(rem2024.reference_date.slice(0,4))}: ${esc(fmtRatio(rem2024.numeric_value))}</div>
      <p>${esc(tr("remunerationNote"))}</p>${auditButton(rem2025.observation_id)}</div>
      <div class="pc-card"><h3>${esc(tr("csm"))}</h3><div class="pc-value">${esc(fmtEuroM(csm25.numeric_value))}</div>
      <div class="pc-delta">${esc(csm24.reference_date.slice(0,4))}: ${esc(fmtEuroM(csm24.numeric_value))}</div>
      <p>${esc(tr("csmNote"))}</p>${auditButton(csm25.observation_id)}</div></div>

      <div class="pc-panel"><h3>${esc(tr("tax"))}</h3><p class="pc-note pc-warning">${esc(tr("taxNote"))}</p>
      <div class="pc-controls"><label for="pcTaxJurisdiction">${esc(tr("jurisdiction"))}</label>
      <select id="pcTaxJurisdiction">${taxOptions}</select></div><div id="pcTaxDetail"></div></div>

      <div class="pc-panel"><h3>${esc(tr("sources"))}</h3>
      <p>${esc(tr("sourcesNote"))}: <code>${esc(EXPECTED_SHA256)}</code></p></div>`;

    const sel=document.getElementById("pcTaxJurisdiction");
    sel.addEventListener("change",()=>renderTax(sel.value));
    renderTax(sel.value);
    bindAuditButtons();
  }

  function taxFmt(role,v) {
    if (v.reporting_status==="NOT_APPLICABLE") return tr("notApplicable");
    if (role==="published_etr" || role==="expected_corporate_tax_rate") return fmtPct(v.numeric_value);
    if (role==="employee_count") return fmtPersons(v.numeric_value);
    return fmtEuroM(v.numeric_value);
  }

  function renderTax(key) {
    const row=state.data.readmodel.munich_re_tax_cbcr.find(x=>x.jurisdiction_key===key);
    const el=document.getElementById("pcTaxDetail");
    if (!row || !el) return;
    const roles=[["pbt","pbt"],["current_income_tax","currentTax"],["published_etr","etr"],
      ["expected_corporate_tax_rate","expectedRate"],["paid_income_tax","paidTax"],["employee_count","employees"]];
    el.innerHTML=`<div class="pc-grid">`+roles.map(([role,label])=>{
      const v=row.metrics[role];
      return `<div class="pc-card"><div>${esc(tr(label))}</div><div class="pc-value">${esc(taxFmt(role,v))}</div>${auditButton(v.observation_id)}</div>`;
    }).join("")+`</div>`;
    bindAuditButtons();
  }

  function findObs(id) { return state.flatById.get(id)||state.taxFieldById.get(id); }

  function showAudit(id) {
    const o=findObs(id); if (!o) return;
    const dialog=document.getElementById("pillarCAuditDialog");
    const body=document.getElementById("pillarCAuditBody");
    document.getElementById("pillarCAuditTitle").textContent=tr("auditTitle");
    const val=o.numeric_value==null?(o.text_value??"—"):o.numeric_value;
    const items=[[tr("observation"),o.observation_id],[tr("entity"),o.entity_name],[tr("metric"),o.metric_id],
      [tr("date"),o.reference_date],[tr("value"),val],[tr("status"),o.reporting_status],
      [tr("source"),o.source_title],[tr("sourceId"),o.source_id],[tr("sourceSha"),o.source_sha256],
      [tr("page"),o.source_page||"—"],[tr("datapoint"),o.source_datapoint||"—"],
      [tr("raw"),o.source_raw_value??"—"],[tr("dimensions"),JSON.stringify(o.source_dimensions||{},null,2)]];
    body.innerHTML=`<dl class="pc-audit-grid">`+items.map(([k,v])=>`<dt>${esc(k)}</dt><dd><code>${esc(v)}</code></dd>`).join("")+`</dl>`;
    if (typeof dialog.showModal==="function") dialog.showModal(); else dialog.setAttribute("open","");
  }

  function bindAuditButtons() {
    document.querySelectorAll("[data-pc-audit]").forEach(b=>{
      if (b.dataset.pcBound==="1") return;
      b.dataset.pcBound="1";b.setAttribute("aria-label",tr("auditOpen"));
      b.addEventListener("click",()=>showAudit(b.dataset.pcAudit));
    });
  }

  async function init() {
    const root=document.getElementById("pillarCRoot");
    if (!root) return;
    try {
      const res=await fetch(DATA_URL,{cache:"no-store"});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text=await res.text();
      const got=await sha256Hex(text);
      if (got!==EXPECTED_SHA256) throw new Error(tr("hashError")+` (${got})`);
      const data=JSON.parse(text);
      if (data.snapshot_schema!==EXPECTED_SCHEMA || data.audit?.observation_count!==186) throw new Error("snapshot contract");
      state.data=data;indexObservations(data);render();
      globalThis.__ebaBuild11ALPillarC={
        snapshotSha256:got,snapshotSchema:data.snapshot_schema,
        observationCount:data.audit.observation_count,taxRowCount:data.audit.tax_row_count,
        render,findObservation:findObs
      };
    } catch (err) {
      root.innerHTML=`<div class="pc-error" role="alert">${esc(tr("dataError"))} <code>${esc(err?.message||err)}</code></div>`;
    }
  }

  document.addEventListener("DOMContentLoaded",()=>{
    const close=document.getElementById("pillarCAuditClose");
    const dialog=document.getElementById("pillarCAuditDialog");
    close?.addEventListener("click",()=>dialog?.close?.());
    new MutationObserver(m=>{ if (m.some(x=>x.type==="attributes"&&x.attributeName==="lang")) render(); })
      .observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
    init();
  });
})();
