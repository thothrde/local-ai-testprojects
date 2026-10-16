#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
EXPECTED_DB='7863537c7e03bc6a7a1fa46dd2a42da103fb4f30bc72914ad16334a87cde4e4a'
EXPECTED_SNAPSHOT='4ba2d5f1462bc1c40499e5ef643e6bb6f601d6298ba7af93ee8fbb7f37e565b2'
EXPECTED_COUNTS={'entities': 140, 'metrics': 118, 'observations': 7769, 'relations': 7, 'sources': 264, 'time_series_decisions': 119}
CACHEBUSTER='20261013-core-truth-parity-7863537'
APP_CACHEBUSTER='20261013-public-static-common-date-r1'
EXPECTED_RESEARCH_CONTEXT='195bc22c51a392baf1a237b16bb56c12471a0456a76b99e5452eaae6ccf10f92'
ENTITY_HASH='440c84d85ec19beed1f8b9abb7e066338ee6285a0150dad945d4759945bca981'
RELATION_HASH='31c74edb7667e880cdc472c96714fac9d7be965a70f78fe71eb91cea3c401c67'
DECISION_HASH='0b5701a5747784496552f0f3c0f421e0d8c3318ad8e8385efaf57198cc7307a3'
FORBIDDEN=['/api/integrity', '/api/network', 'fi2_ted', 'TED_PROCUREMENT', 'EPPO', 'OLAF', 'HELD_MULTIPLE_BUYER_CLUSTERS']
EXPECTED_FAMILY_MAP={'PILLAR_C_SOLVENCY_II_CONSOLIDATED_MCR_FLOOR_RATIO_PERCENT': 'INS_MCR', 'PILLAR_C_SOLVENCY_II_ELIGIBLE_OWN_FUNDS_FOR_CONSOLIDATED_MCR_FLOOR': 'INS_ELIGIBLE_OWN_FUNDS', 'PILLAR_C_SOLVENCY_II_ELIGIBLE_OWN_FUNDS_FOR_MCR': 'INS_ELIGIBLE_OWN_FUNDS', 'PILLAR_C_SOLVENCY_II_MCR': 'INS_MCR', 'PILLAR_C_SOLVENCY_II_MCR_RATIO_PERCENT': 'INS_MCR', 'PILLAR_C_SOLVENCY_II_TOTAL_GROUP_SCR_QRT_R0680': 'INS_SCR'}
EXPECTED_NEW_METRIC='PILLAR_C_SOLVENCY_II_RATIO_DERIVED_EOF_OVER_SCR_PERCENT'
EXPECTED_AUX_COUNTS={'generated_discovery_candidates': 200, 'investigation_candidates': 34, 'investigation_thread_members': 34, 'investigation_threads': 14, 'investigative_methods': 2, 'lineage': 3743}
def sh(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ch(o):return hashlib.sha256(json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def load():
 p=ROOT/"data/public_snapshot.js";assert sh(p)==EXPECTED_SNAPSHOT;t=p.read_text();pre="window.FI2A_PUBLIC_SNAPSHOT=";assert t.startswith(pre);r=t[len(pre):].strip();r=r[:-1] if r.endswith(";") else r;return json.loads(r),t
def load_research_context():
 p=ROOT/"data/research_context_v1.js";assert sh(p)==EXPECTED_RESEARCH_CONTEXT,(sh(p),EXPECTED_RESEARCH_CONTEXT)
 t=p.read_text(encoding="utf-8");pre="window.FI2A_RESEARCH_CONTEXT_V1=";assert t.startswith(pre);r=t[len(pre):].strip();r=r[:-1] if r.endswith(";") else r;return json.loads(r),t
def keys(o):
 if isinstance(o,dict):
  for k,v in o.items():yield k;yield from keys(v)
 elif isinstance(o,list):
  for v in o:yield from keys(v)
def main():
 s,txt=load();m=s["meta"];identity=json.loads((ROOT/"PUBLIC_BUILD_IDENTITY.json").read_text());evidence=json.loads((ROOT/"PUBLIC_CAPABILITY_EVIDENCE.json").read_text());validation=json.loads((ROOT/"VALIDATION_REPORT.json").read_text())
 rctx,rctx_txt=load_research_context()
 assert m["db_sha256"]==EXPECTED_DB==m["expected_db_sha256"]==identity["bound_database_sha256"]==validation["bound_database_sha256"]
 assert evidence["public_snapshot_sha256"]==EXPECTED_SNAPSHOT==validation["public_snapshot_sha256"]
 actual={"entities":len(s["entities"]),"metrics":len(s["metrics"]),"observations":len(s["observations"]),"sources":len(s["sources"]),"relations":len(s["relations"]),"time_series_decisions":len(s["time_series_decisions"])};assert actual==EXPECTED_COUNTS==m["counts"]
 assert len(s.get("source_quality_issues",[]))==3 and ch(s["entities"])==ENTITY_HASH and ch(s["relations"])==RELATION_HASH and ch(s["time_series_decisions"])==DECISION_HASH
 metric_by={x["code"]:x for x in s["metrics"]};assert EXPECTED_NEW_METRIC in metric_by
 for code,fam in EXPECTED_FAMILY_MAP.items():assert metric_by[code].get("families")==[fam],(code,metric_by[code].get("families"),fam)
 assert not any(str(d.get("comparability_status","")).upper()=="EXACTLY_COMPARABLE" for d in s["time_series_decisions"])
 assert "local_relpath" not in set(keys(s)) and "/Users/" not in txt and "file://" not in txt
 lo=txt.lower()
 for t in FORBIDDEN:assert t.lower() not in lo,t
 assert all(int(x.get("raw_redistribution_allowed") or 0)==0 for x in s["sources"])
 scor=[]
 for q in s.get("source_quality_issues",[]):
  try:o=json.loads(q.get("origin_record_json") or "{}")
  except:o={}
  if o.get("external_issue_id")=="SCOR_GROUP_FY2025_R0610_OFFICIAL_INTERNAL_SOURCE_CONFLICT":scor.append(o)
 assert len(scor)==1;q=scor[0];assert q["conflict_status"]=="CONFIRMED_OFFICIAL_SOURCE_INTERNAL_CONFLICT" and q["value_resolution_status"]=="UNRESOLVED_NO_WINNER" and q["selection_policy"]=="NO_CANONICAL_VALUE_SELECTION" and q["statistics_authorized"] is False and q["discovery_value_authorized"] is False
 assert sorted(float(w["numeric_value_real"]) for w in q.get("witnesses",[]) if w.get("numeric_value_real") is not None)==[3554000.0,3574832.0]
 cp=identity["core_truth_parity_20261013"];assert cp["source_database_sha256"]==EXPECTED_DB and cp["snapshot_sha256"]==EXPECTED_SNAPSHOT and cp["counts"]==EXPECTED_COUNTS and cp["required10"]=={"terminal":199,"nonterminal":1,"total":200} and cp["fi3_projection_unchanged"] is True
 ec=evidence["core_truth_parity_20261013"];assert ec["source_database_sha256"]==EXPECTED_DB and ec["snapshot_sha256"]==EXPECTED_SNAPSHOT and ec["source_quality_issue_count"]==3
 idx=(ROOT/"index.html").read_text();assert "data/public_snapshot.js?v="+CACHEBUSTER in idx and "app.js?v="+APP_CACHEBUSTER in idx
 app=(ROOT/"app.js").read_text();assert "sourceQualityIssuesForEntity" in app and "source-quality-notice" in app and "7.769" in app and "7,769" in app
 assert "function compareP3DHLocal" in app and "function compareGenericLocal" in app and "function latestCommonReferenceDate" in app and "EBA_P3DH_" in app
 assert "scopeLabel" in app and "EBA · höchste Konsolidierungsebene" in app and "EBA · highest level of consolidation" in app
 # Sprint A bounded static context — standing fail-closed checks.
 assert rctx["version"]=="FIRST_COMPLETE_VERSION_SPRINT_A_CONTEXT_V1"
 gov=rctx["governance"];assert gov=={"research_context_only":True,"screening":False,"risk_scoring":False,"natural_person_layer":False,"fi2_procurement_edges_installed":False,"fi2_value_currency_aggregation":False,"gleif_raw_relationships_public":False,"network_context_is_causal_evidence":False,"p3dh_direct_lead_metric_mapping":False}
 fi1=rctx["fi1"];assert fi1["case_corpus_count"]==427 and fi1["seed_candidate_count"]==0 and fi1["residual_source_gap_count"]==5 and fi1["institution_attachment_policy"]=="NO_CASE_ATTACHMENT_WITHOUT_EXACT_EVIDENCE"
 assert fi1["source_state"]["status"]=="HOLD_EXTERNAL_OFFICIAL_SOURCE" and fi1["source_state"]["reason"] and fi1["source_state"]["legal_authenticity_boundary"]
 assert rctx["fi2"]["global"]=={"entity_count":21,"identity_binding_count":156,"institution_notice_refs":84,"winner_event_count":92}
 assert len(rctx["fi2"]["by_entity"])==21 and sum(len(e.get("notices",[])) for e in rctx["fi2"]["by_entity"].values())==84
 allowed_notice={"publication_number","publication_date","notice_type","source_family","source_url"};allowed_entity={"canonical_legal_name","confirmed_identity_assertions","roles","notices","winner_event_count","publication_count"}
 assert all(set(e)==allowed_entity for e in rctx["fi2"]["by_entity"].values()) and all(set(n)==allowed_notice for e in rctx["fi2"]["by_entity"].values() for n in e.get("notices",[]))
 assert all(str(n.get("source_url") or "").startswith("https://ted.europa.eu") for e in rctx["fi2"]["by_entity"].values() for n in e.get("notices",[]))
 net=rctx["network"]["by_entity"];assert len(net)==116 and sum(bool(e.get("sovereign")) for e in net.values())==113 and sum(bool(e.get("credit_geography")) for e in net.values())==105 and sum(bool(e.get("nace")) for e in net.values())==104 and sum(bool(e.get("p3dh")) for e in net.values())==16
 sc=rctx["network"]["source_contract"];assert sc["source_layers_20261001/EBA_2025_SOVEREIGN_SEED_NONZERO_2025-06-30.csv"]=={"sha256":"423c66d219d64afa1a93b79904e9d081569e60fabfe724a9a7604967398b4076","rows":2014} and sc["source_layers_20261001/v0_4_20261001/EBA_TE2025_CREDIT_GEOGRAPHY_GRANULAR_SEED_2025-06-30.csv"]=={"sha256":"849f4ca54ba4f52520a182dfb386405928484a90a3c63ed4b2a51026b3a3d4f2","rows":15968} and sc["source_layers_20261001/v0_4_20261001/EBA_TE2025_NACE_GROSS_CARRYING_AMOUNT_SEED_NONZERO_2025-06-30.csv"]=={"sha256":"a296262fd7158529f9aca78f2a0cd324b3c6c8b47d25b2a6b1d6fdd9869f0fa2","rows":1903} and sc["source_layers_20261001/v0_5_20261002/P3DH_NORMALIZED_RESEARCH_LAYER_V0_5.csv"]=={"sha256":"ece6b63fcd8bae43213c1d54448c2aff4d906976aa2e2afaeef82b16289578c5","rows":22390}
 cov=rctx["coverage"];assert cov["logical_cells"]==200 and cov["terminal"]==199 and cov["nonterminal"]==1 and len(cov["frozen_contracts"])==17 and all(x["status"]=="FROZEN_CURRENT_CANONICAL_COVERAGE" for x in cov["frozen_contracts"])
 cq=cov["nonterminal_conflict"];assert cq["external_issue_id"]=="SCOR_GROUP_FY2025_R0610_OFFICIAL_INTERNAL_SOURCE_CONFLICT" and cq["value_resolution_status"]=="UNRESOLVED_NO_WINNER" and cq["selection_policy"]=="NO_CANONICAL_VALUE_SELECTION"
 low=rctx_txt.lower();assert "gleif_level2_seed_relationships" not in low and "buyer_cluster_id" not in low and "value_evidence_json" not in low
 assert 'id="researchContext"' in idx and idx.index("data/research_context_v1.js")<idx.index("app.js?v=20261013-public-static-common-date-r1")
 assert "function researchContextHtml" in app
 assert all(x in app for x in ["fs.status","fs.reason","fs.legal_authenticity_boundary","residual_source_gap_count","not clearance and is not a screening result","keine Entwarnung und kein Screening-Ergebnis","x.protocol==='https:'&&x.hostname==='ted.europa.eu'","Bounded static research and context excerpt","does not replace the broader procurement, network or enforcement-case functions"])
 sa=identity["sprint_a_public_context_20261016"];assert sa["context_data_sha256"]==EXPECTED_RESEARCH_CONTEXT and sa["delta_reaudit_pass_result_sha256"]=="c078622c1157b6ebfea82584659faa0556affd750e0eac5fdbee5f68d6dfa18e" and sa["coverage"]=={"logical_cells":200,"terminal":199,"nonterminal":1}
 assert evidence["sprint_a_public_context_20261016"]["delta_reaudit_pass_result_sha256"]==sa["delta_reaudit_pass_result_sha256"]

 assert len(s["lineage"])==EXPECTED_AUX_COUNTS["lineage"] and len(s["investigation_candidates"])==EXPECTED_AUX_COUNTS["investigation_candidates"] and len(s["investigation_threads"])==EXPECTED_AUX_COUNTS["investigation_threads"] and len(s["investigation_thread_members"])==EXPECTED_AUX_COUNTS["investigation_thread_members"] and len(s["investigative_methods"])==EXPECTED_AUX_COUNTS["investigative_methods"] and len(s["generated_discovery_candidates"])==EXPECTED_AUX_COUNTS["generated_discovery_candidates"]
 ver=(ROOT/"versionen.html").read_text();assert EXPECTED_DB in ver and EXPECTED_SNAPSHOT in ver and "SCOR" in ver and "199" in ver
 assert "Public Static Common-Date R1" in ver and "523" in ver and "gemischte Stichtage" in ver and "mixed dates" in ver
 cor=(ROOT/"korrekturen.html").read_text();assert "P3DH-Vergleichsstichtag" in cor and "P3DH comparison date" in cor
 assert (ROOT/"tests/validate_public_static_common_date.py").is_file()
 for line in (ROOT/"MANIFEST_SHA256.txt").read_text().splitlines():
  if not line.strip():continue
  h,rel=line.split(None,1);rel=rel.lstrip("*").strip();assert (ROOT/rel).is_file() and sh(ROOT/rel)==h,(rel,sh(ROOT/rel),h)
 print("PASS_PUBLIC_DATA_RELEASE_STANDING_REPO_TEST");print(json.dumps({"db":EXPECTED_DB,"snapshot":EXPECTED_SNAPSHOT,"counts":actual,"source_quality_issues":3},sort_keys=True))
if __name__=="__main__":main()
