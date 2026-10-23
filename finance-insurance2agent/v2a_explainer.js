(function(global){
/* Finance/Insurance2Agent V2-A Phase B reference explainer.
 * Pure deterministic public-static implementation. No DOM, network, storage, or mutation.
 */
"use strict";

const CONTRACT_VERSION = "V2A_SPEC_V0_2_1";
const SUPPORTED_CONTEXT = "EXISTING_PUBLIC_COMPARE_SAME_METRIC_CROSS_SECTIONAL";
const UNSUPPORTED_CONTEXTS = Object.freeze([
  "ARBITRARY_RAW_OBSERVATION_PAIR",
  "LONGITUDINAL_WHY_DID_VALUE_CHANGE",
  "CAUSAL_EVENT_EXPLANATION",
  "PUBLIC_LLM_EXPLANATION"
]);

const UNIT_POLICY = Object.freeze({
  "EUR": {currency_policy:"EMBEDDED_EUR", value_kind:"NUMERIC"},
  "EUR_BILLION": {currency_policy:"EMBEDDED_EUR", value_kind:"NUMERIC"},
  "EUR_M": {currency_policy:"EMBEDDED_EUR", value_kind:"NUMERIC"},
  "EUR_MILLION": {currency_policy:"EMBEDDED_EUR", value_kind:"NUMERIC"},
  "EUR_M_MARKET_VALUE": {currency_policy:"EMBEDDED_EUR", value_kind:"NUMERIC"},
  "EUR_PER_FTE": {currency_policy:"EMBEDDED_EUR", value_kind:"NUMERIC"},
  "EUR_THOUSAND": {currency_policy:"EMBEDDED_EUR", value_kind:"NUMERIC"},
  "million EUR": {currency_policy:"EMBEDDED_EUR", value_kind:"NUMERIC"},
  "USD_MILLION": {currency_policy:"EMBEDDED_USD", value_kind:"NUMERIC"},
  "MONETARY": {currency_policy:"EXPLICIT_REQUIRED", value_kind:"NUMERIC"},
  "SOURCE_NATIVE_AMOUNT": {currency_policy:"EXPLICIT_REQUIRED", value_kind:"NUMERIC"},
  "SOURCE_NATIVE_MONETARY_AMOUNT": {currency_policy:"EXPLICIT_REQUIRED", value_kind:"NUMERIC"},
  "FTE": {currency_policy:"NOT_APPLICABLE", value_kind:"NUMERIC"},
  "PERCENT": {currency_policy:"NOT_APPLICABLE", value_kind:"NUMERIC"},
  "PERCENT_REDUCTION_VS_2019": {currency_policy:"NOT_APPLICABLE", value_kind:"NUMERIC"},
  "PERSONS": {currency_policy:"NOT_APPLICABLE", value_kind:"NUMERIC"},
  "RATIO_MULTIPLE": {currency_policy:"NOT_APPLICABLE", value_kind:"NUMERIC"},
  "RATIO_PER_UNIT": {currency_policy:"NOT_APPLICABLE", value_kind:"NUMERIC"},
  "TEXT": {currency_policy:"NOT_APPLICABLE", value_kind:"NON_NUMERIC_UNSUPPORTED_V0_2"},
  "T_CO2E": {currency_policy:"NOT_APPLICABLE", value_kind:"NUMERIC"},
  "ratio": {currency_policy:"NOT_APPLICABLE", value_kind:"NUMERIC"}
});

const VERDICT_RANK = Object.freeze({
  COMPARABLE: 0,
  COMPARABLE_WITH_CAVEATS: 1,
  NOT_DETERMINABLE: 2,
  NOT_COMPARABLE: 3
});
const EVIDENCE_RANK = Object.freeze({
  COMPLETE: 0,
  PARTIAL: 1,
  LIMITED: 2,
  AMBIGUOUS: 3,
  CONFLICTED: 4,
  UNKNOWN: 5
});

function stableUnique(xs) {
  return [...new Set(xs.filter(Boolean))].sort();
}
function jsonObj(s) {
  try { return JSON.parse(s || "{}"); } catch (_) { return {}; }
}
function embeddedCurrency(unit) {
  const p = UNIT_POLICY[unit];
  if (!p) return null;
  if (p.currency_policy === "EMBEDDED_EUR") return "EUR";
  if (p.currency_policy === "EMBEDDED_USD") return "USD";
  return null;
}
function currencyState(o) {
  const p = UNIT_POLICY[o.unit];
  if (!p) return {policy:"UNKNOWN_UNIT", known:false, value:null, conflict:false};
  const explicit = o.currency || "";
  const embedded = embeddedCurrency(o.unit);
  if (embedded) {
    return {
      policy:p.currency_policy,
      known:true,
      value:embedded,
      explicit:explicit || null,
      conflict:!!explicit && explicit !== embedded
    };
  }
  if (p.currency_policy === "EXPLICIT_REQUIRED") {
    return {policy:p.currency_policy, known:!!explicit, value:explicit || null, explicit:explicit || null, conflict:false};
  }
  return {policy:p.currency_policy, known:false, value:null, explicit:explicit || null, conflict:false, not_applicable:true};
}
function finalize(blocking, unknown, caveats) {
  const b = stableUnique(blocking), u = stableUnique(unknown), c = stableUnique(caveats);
  let verdict = "COMPARABLE";
  if (b.length) verdict = "NOT_COMPARABLE";
  else if (u.length) verdict = "NOT_DETERMINABLE";
  else if (c.length) verdict = "COMPARABLE_WITH_CAVEATS";
  return {verdict, blocking_reasons:b, unknown_reasons:u, caveat_reasons:c, reasons:[...b,...u,...c]};
}
function resolutionReason(r) {
  if (!r || r.state === "NONE") return "MISSING_OBSERVATION";
  if (r.state === "UNRESOLVED_CONFLICT") return "UNRESOLVED_SOURCE_CONFLICT";
  if (r.state === "MULTIPLE_ROWS") return "MULTIPLE_ROWS";
  return null;
}
function evidenceStatusForResolution(r) {
  if (!r || r.state === "NONE") return {status:"UNKNOWN", reasons:["MISSING_OBSERVATION"]};
  if (r.state === "UNRESOLVED_CONFLICT") return {status:"CONFLICTED", reasons:["EXPLICIT_UNRESOLVED_SOURCE_CONFLICT"]};
  if (r.state === "MULTIPLE_ROWS") return {status:"AMBIGUOUS", reasons:["MULTIPLE_EVIDENCE_ROWS"]};
  const o = r.observations && r.observations[0];
  if (!o || !o.source_id) return {status:"UNKNOWN", reasons:["SOURCE_ID_MISSING"]};
  const comps = ["source_page","source_table","source_datapoint"];
  const present = comps.filter(k => o[k] !== null && o[k] !== undefined && o[k] !== "");
  if (present.length === 3) return {status:"COMPLETE", reasons:[]};
  if (present.length === 0) return {status:"LIMITED", reasons:comps.map(k => k.toUpperCase()+"_MISSING")};
  return {status:"PARTIAL", reasons:comps.filter(k=>!present.includes(k)).map(k=>k.toUpperCase()+"_MISSING")};
}
function worseEvidence(a,b) {
  return EVIDENCE_RANK[a] >= EVIDENCE_RANK[b] ? a : b;
}

function createExplainer(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.observations)) throw new Error("INVALID_SNAPSHOT");
  const obsByEM = new Map();
  for (const o of snapshot.observations) {
    const k = `${o.entity_id}\u0000${o.metric_code}`;
    if (!obsByEM.has(k)) obsByEM.set(k, []);
    obsByEM.get(k).push(o);
  }
  const activeRegimes = new Map();
  for (const r of (snapshot.regime_memberships || [])) {
    if (!String(r.status || "").startsWith("ACTIVE")) continue;
    if (!activeRegimes.has(r.entity_id)) activeRegimes.set(r.entity_id, []);
    activeRegimes.get(r.entity_id).push(r.regime_code);
  }
  for (const [k,v] of activeRegimes) v.sort();

  function emRows(eid,mc) { return obsByEM.get(`${eid}\u0000${mc}`) || []; }
  function unresolvedGovernanceForRows(eid, rows) {
    if (rows.length < 2) return null;
    const ids = new Set(rows.map(o=>o.id));
    for (const q of (snapshot.source_quality_issues || [])) {
      const d = jsonObj(q.origin_record_json);
      const affected = Array.isArray(d.affected_observation_ids) ? d.affected_observation_ids : [];
      if (d.canonical_entity_id !== eid ||
          d.value_resolution_status !== "UNRESOLVED_NO_WINNER" ||
          d.selection_policy !== "NO_CANONICAL_VALUE_SELECTION" ||
          affected.length < 2) continue;
      if (rows.every(o=>affected.includes(o.id)) && affected.every(id=>ids.has(id))) return {q,d};
    }
    return null;
  }
  function latestRows(eid,mc) {
    const xs = emRows(eid,mc);
    if (!xs.length) return [];
    let d = "";
    for (const o of xs) if ((o.reference_date || "") > d) d = o.reference_date || "";
    return xs.filter(o => (o.reference_date || "") === d);
  }
  function rowsAtReferenceDate(eid,mc,referenceDate) {
    return emRows(eid,mc).filter(o => (o.reference_date || "") === (referenceDate || ""));
  }
  function resolveRows(eid,mc,rows,referenceDate) {
    const rd = (rows[0] && rows[0].reference_date) || referenceDate || null;
    if (!rows.length) return {state:"NONE",entity_id:eid,metric_code:mc,reference_date:rd,observations:[],governance:null,reason:"NO_OBSERVATION"};
    if (rows.length === 1) return {state:"SINGLE",entity_id:eid,metric_code:mc,reference_date:rd,observations:rows,governance:null,reason:null};
    const governance = unresolvedGovernanceForRows(eid,rows);
    return governance
      ? {state:"UNRESOLVED_CONFLICT",entity_id:eid,metric_code:mc,reference_date:rd,observations:rows,governance,reason:"UNRESOLVED_SOURCE_CONFLICT"}
      : {state:"MULTIPLE_ROWS",entity_id:eid,metric_code:mc,reference_date:rd,observations:rows,governance:null,reason:"MULTIPLE_ROWS"};
  }
  function resolveLatestEvidence(eid,mc) {
    const rows = latestRows(eid,mc);
    return resolveRows(eid,mc,rows,rows[0]?.reference_date || null);
  }
  function resolveEvidenceAtDate(eid,mc,date) {
    return resolveRows(eid,mc,rowsAtReferenceDate(eid,mc,date),date);
  }
  function latestCommonReferenceDate(mc,ids) {
    const sets = ids.map(eid => new Set(emRows(eid,mc).filter(o=>o.reference_date).map(o=>o.reference_date)));
    if (!sets.length || sets.some(s=>!s.size)) return null;
    const common = [...sets[0]].filter(d=>sets.slice(1).every(s=>s.has(d)));
    return common.sort().at(-1) || null;
  }
  function regimeKey(eid) {
    return (activeRegimes.get(eid) || []).join("|");
  }
  function evaluateGeneric(a,b) {
    const blocking=[], unknown=[], caveats=[];
    const pa=UNIT_POLICY[a.unit], pb=UNIT_POLICY[b.unit];
    if (pa?.value_kind === "NON_NUMERIC_UNSUPPORTED_V0_2" || pb?.value_kind === "NON_NUMERIC_UNSUPPORTED_V0_2")
      unknown.push("NON_NUMERIC_VALUE_UNSUPPORTED_V0_2");
    if ((a.reference_date || "") !== (b.reference_date || "")) unknown.push("REFERENCE_DATE_DIFF_UNGOVERNED");
    if (a.unit !== b.unit) blocking.push("UNIT_MISMATCH");
    const ca=currencyState(a), cb=currencyState(b);
    if (ca.conflict || cb.conflict) blocking.push("UNIT_CURRENCY_INTERNAL_CONFLICT");
    if ((ca.policy === "EXPLICIT_REQUIRED" && !ca.known) || (cb.policy === "EXPLICIT_REQUIRED" && !cb.known))
      unknown.push("CURRENCY_REQUIRED_BUT_UNKNOWN");
    if (ca.known && cb.known && ca.value !== cb.value) blocking.push("CURRENCY_MISMATCH");
    if ((a.consolidation_scope || "") !== (b.consolidation_scope || ""))
      unknown.push("CONSOLIDATION_SCOPE_COMPATIBILITY_UNKNOWN");
    const sa=a.semantic || {}, sb=b.semantic || {};
    if ((sa.period_type || "") !== (sb.period_type || "")) unknown.push("PERIOD_TYPE_COMPATIBILITY_UNKNOWN");
    if ((sa.variant_key || "") !== (sb.variant_key || "")) unknown.push("VARIANT_KEY_COMPATIBILITY_UNKNOWN");
    if ((sa.reporting_framework || "") !== (sb.reporting_framework || "")) caveats.push("FRAMEWORK_MISMATCH");
    if ((sa.semantic_fingerprint || "") !== (sb.semantic_fingerprint || "")) caveats.push("SEMANTIC_FINGERPRINT_DIFFERS");
    const rga=regimeKey(a.entity_id), rgb=regimeKey(b.entity_id);
    if (rga && rgb && rga !== rgb) blocking.push("REGIME_MISMATCH");
    else if (!!rga !== !!rgb) caveats.push("REGIME_COVERAGE_ASYMMETRIC");
    if ((a.restatement_version || "") || (b.restatement_version || "")) caveats.push("RESTATEMENT_METADATA_PRESENT");
    return finalize(blocking,unknown,caveats);
  }
  function evaluateP3DH(a,b) {
    const blocking=[], unknown=[], caveats=[];
    const pa=UNIT_POLICY[a.unit], pb=UNIT_POLICY[b.unit];
    if (pa?.value_kind === "NON_NUMERIC_UNSUPPORTED_V0_2" || pb?.value_kind === "NON_NUMERIC_UNSUPPORTED_V0_2")
      unknown.push("NON_NUMERIC_VALUE_UNSUPPORTED_V0_2");
    if ((a.reference_date || "") !== (b.reference_date || "")) blocking.push("REFERENCE_DATE_DIFF");
    if (a.unit !== b.unit) blocking.push("UNIT_DIFF");
    const ca=currencyState(a), cb=currencyState(b);
    if (ca.conflict || cb.conflict) blocking.push("UNIT_CURRENCY_INTERNAL_CONFLICT");
    if ((ca.policy === "EXPLICIT_REQUIRED" && !ca.known) || (cb.policy === "EXPLICIT_REQUIRED" && !cb.known))
      unknown.push("CURRENCY_REQUIRED_BUT_UNKNOWN");
    if (ca.known && cb.known && ca.value !== cb.value) blocking.push("CURRENCY_DIFF");
    if ((a.consolidation_scope || "") !== (b.consolidation_scope || "")) caveats.push("CONSOLIDATION_SCOPE_DIFF");
    const sa=a.semantic || {}, sb=b.semantic || {};
    if ((sa.reporting_framework || "") !== (sb.reporting_framework || "")) caveats.push("REPORTING_FRAMEWORK_DIFF");
    if ((sa.period_type || "") !== (sb.period_type || "")) caveats.push("PERIOD_TYPE_DIFF");
    if ((sa.variant_key || "") !== (sb.variant_key || "")) caveats.push("VARIANT_KEY_DIFF");
    if ((sa.semantic_fingerprint || "") !== (sb.semantic_fingerprint || "")) caveats.push("SEMANTIC_FINGERPRINT_DIFF");
    if ((a.restatement_version || "") || (b.restatement_version || "")) caveats.push("RESTATEMENT_METADATA_PRESENT");
    return finalize(blocking,unknown,caveats);
  }
  function evaluateResolvedPair(contractPath,ra,rb) {
    if (ra.state !== "SINGLE" || rb.state !== "SINGLE") {
      const reasons=stableUnique([resolutionReason(ra),resolutionReason(rb)]);
      return {
        verdict:"NOT_DETERMINABLE",
        blocking_reasons:[],
        unknown_reasons:reasons,
        caveat_reasons:[],
        reasons
      };
    }
    return contractPath === "P3DH"
      ? evaluateP3DH(ra.observations[0],rb.observations[0])
      : evaluateGeneric(ra.observations[0],rb.observations[0]);
  }
  function explainComparison(metricCode, entityIds) {
    if (!metricCode || !Array.isArray(entityIds) || entityIds.length < 2) throw new Error("INVALID_COMPARE_INPUT");
    const ids=[...entityIds];
    const contractPath=String(metricCode).startsWith("EBA_P3DH_") ? "P3DH" : "GENERIC";
    const commonDate=contractPath==="P3DH" ? latestCommonReferenceDate(metricCode,ids) : null;
    const resolutions=ids.map(eid =>
      contractPath==="P3DH" && commonDate
        ? resolveEvidenceAtDate(eid,metricCode,commonDate)
        : resolveLatestEvidence(eid,metricCode)
    );
    const evidence=resolutions.map((r,i)=>({entity_id:ids[i],...evidenceStatusForResolution(r)}));
    const pairs=[];
    let overall="COMPARABLE";
    for (let i=0;i<ids.length;i++) for (let j=i+1;j<ids.length;j++) {
      const ev=evaluateResolvedPair(contractPath,resolutions[i],resolutions[j]);
      const pairEvidence=worseEvidence(evidence[i].status,evidence[j].status);
      pairs.push({a:ids[i],b:ids[j],...ev,evidence_status:pairEvidence});
      if (VERDICT_RANK[ev.verdict] > VERDICT_RANK[overall]) overall=ev.verdict;
    }
    return {
      contract_version:CONTRACT_VERSION,
      supported_context:SUPPORTED_CONTEXT,
      contract_path:contractPath,
      metric_code:metricCode,
      entity_ids:ids,
      selected_reference_date:commonDate,
      resolutions,
      evidence,
      pairwise:pairs,
      overall_verdict:overall,
      ranking_authorized:false,
      causal_inference_authorized:false,
      longitudinal_inference_authorized:false
    };
  }
  return {
    explainComparison,
    resolveLatestEvidence,
    resolveEvidenceAtDate,
    latestCommonReferenceDate,
    evidenceStatusForResolution,
    evaluateGeneric,
    evaluateP3DH,
    evaluateResolvedPair,
    regimeKey
  };
}


global.FI2A_V2A = Object.freeze({
  CONTRACT_VERSION,
  SUPPORTED_CONTEXT,
  UNSUPPORTED_CONTEXTS,
  UNIT_POLICY,
  VERDICT_RANK,
  EVIDENCE_RANK,
  currencyState,
  evidenceStatusForResolution,
  createExplainer
});
})(window);
