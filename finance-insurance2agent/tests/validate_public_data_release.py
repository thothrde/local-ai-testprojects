#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
EXPECTED_DB='7863537c7e03bc6a7a1fa46dd2a42da103fb4f30bc72914ad16334a87cde4e4a'
EXPECTED_SNAPSHOT='4ba2d5f1462bc1c40499e5ef643e6bb6f601d6298ba7af93ee8fbb7f37e565b2'
EXPECTED_COUNTS={'entities': 140, 'metrics': 118, 'observations': 7769, 'relations': 7, 'sources': 264, 'time_series_decisions': 119}
CACHEBUSTER='20261013-core-truth-parity-7863537'
APP_CACHEBUSTER='20261013-core-truth-parity-semantic-scope-v1'
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
def keys(o):
 if isinstance(o,dict):
  for k,v in o.items():yield k;yield from keys(v)
 elif isinstance(o,list):
  for v in o:yield from keys(v)
def main():
 s,txt=load();m=s["meta"];identity=json.loads((ROOT/"PUBLIC_BUILD_IDENTITY.json").read_text());evidence=json.loads((ROOT/"PUBLIC_CAPABILITY_EVIDENCE.json").read_text());validation=json.loads((ROOT/"VALIDATION_REPORT.json").read_text())
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
 assert "scopeLabel" in app and "EBA · höchste Konsolidierungsebene" in app and "EBA · highest level of consolidation" in app
 assert len(s["lineage"])==EXPECTED_AUX_COUNTS["lineage"] and len(s["investigation_candidates"])==EXPECTED_AUX_COUNTS["investigation_candidates"] and len(s["investigation_threads"])==EXPECTED_AUX_COUNTS["investigation_threads"] and len(s["investigation_thread_members"])==EXPECTED_AUX_COUNTS["investigation_thread_members"] and len(s["investigative_methods"])==EXPECTED_AUX_COUNTS["investigative_methods"] and len(s["generated_discovery_candidates"])==EXPECTED_AUX_COUNTS["generated_discovery_candidates"]
 ver=(ROOT/"versionen.html").read_text();assert EXPECTED_DB in ver and EXPECTED_SNAPSHOT in ver and "SCOR" in ver and "199" in ver
 for line in (ROOT/"MANIFEST_SHA256.txt").read_text().splitlines():
  if not line.strip():continue
  h,rel=line.split(None,1);rel=rel.lstrip("*").strip();assert (ROOT/rel).is_file() and sh(ROOT/rel)==h,(rel,sh(ROOT/rel),h)
 print("PASS_PUBLIC_DATA_RELEASE_STANDING_REPO_TEST");print(json.dumps({"db":EXPECTED_DB,"snapshot":EXPECTED_SNAPSHOT,"counts":actual,"source_quality_issues":3},sort_keys=True))
if __name__=="__main__":main()
