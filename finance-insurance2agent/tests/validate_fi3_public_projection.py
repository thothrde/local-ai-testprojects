#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
EXPECTED_PROJECTION="79e0a5d13eceb187408b097f51f548107f2036c3b3946cd735b600c88c53084e"
EXPECTED_IDENTITY="b5bfa2a4a896063ec6debf1437f8770ad089171eab3f1fff3ea8198c1cd32d06"
EXPECTED_SNAPSHOT="ad290e31b4c4c745e50c38d254fd5f2b3309a276d804c67cd4a75d8db6e8bc53"
EXPECTED_ROBOTS="fe9c8cfcbb5fc083d6e8dbfcc6423b068787321a82fc8052a928709164d6219d"
REVIEW="CANDIDATE_REVIEW_REQUIRED"
HOLD="HOLD_INSUFFICIENT_IDENTITY_EVIDENCE"
REJECT="REJECTED_DIFFERENT_ENTITY"
CONFIRMED="CONFIRMED_SAME_LEGAL_ENTITY_ROLE"
REJECT_REASONS={"BROAD_QUERY_HIT_WITH_MATERIALLY_DIFFERENT_LEGAL_NAME": 38, "INDEPENDENT_AUDIT_RECONCILIATION": 5}
def sh(p):
    h=hashlib.sha256()
    with open(p,"rb") as f:
        for b in iter(lambda:f.read(1024*1024),b""): h.update(b)
    return h.hexdigest()
def load_projection():
    p=ROOT/"data/fi3_public_projection.js"
    assert sh(p)==EXPECTED_PROJECTION,(sh(p),EXPECTED_PROJECTION)
    t=p.read_text("utf-8"); prefix="window.FI2A_FI3_PUBLIC_PROJECTION="
    assert t.startswith(prefix)
    raw=t[len(prefix):].strip()
    if raw.endswith(";"): raw=raw[:-1]
    return json.loads(raw)
def walk_keys(o):
    if isinstance(o,dict):
        for k,v in o.items():
            yield k
            yield from walk_keys(v)
    elif isinstance(o,list):
        for x in o: yield from walk_keys(x)
def main():
    p=load_projection()
    ident=json.loads((ROOT/"FI3_PUBLIC_BUILD_IDENTITY.json").read_text("utf-8"))
    assert sh(ROOT/"FI3_PUBLIC_BUILD_IDENTITY.json")==EXPECTED_IDENTITY
    assert sh(ROOT/"data/public_snapshot.js")==EXPECTED_SNAPSHOT
    assert sh(ROOT/"robots.txt")==EXPECTED_ROBOTS
    assert p["meta"]["epistemic_class"]=="CANDIDATE_EVIDENCE_ONLY"
    assert p["meta"]["counts"]["identity_audited_total"]==85
    assert p["meta"]["counts"]["role_audited_total"]==175
    assert p["meta"]["counts"]["identity_detail_published"]==42
    assert p["meta"]["counts"]["role_detail_published"]==129
    assert p["reject_summary"]["identity_count"]==43
    assert p["reject_summary"]["role_count"]==46
    assert p["reject_summary"]["reason_classes"]==REJECT_REASONS
    ids=p["identity_candidates"]; roles=p["role_assertions"]
    assert len(ids)==42 and len(roles)==129 and len(p["seed_entities"])==32
    assert all(x["decision_status"] in {REVIEW,HOLD} for x in ids+roles)
    assert not any(x["decision_status"] in {REJECT,CONFIRMED} for x in ids+roles)
    assert all(x["candidate_notice_de"]=="Kandidat – nicht bestätigt" and x["candidate_notice_en"]=="Candidate – not confirmed" for x in ids+roles)
    banned={"origin_record_json","independent_audit_json","source_identifiers_json","source_locators_json","strong_identifier_matches_json","name_metrics_json","source_record_key"}
    assert not (set(walk_keys(p)) & banned)
    raw=json.dumps(p,ensure_ascii=False)
    app=(ROOT/"app.js").read_text("utf-8")
    assert "/api/fi3" not in app
    assert "function fi3ContextHtml" in app and "$('#fi3Context')" in app
    assert "fi3_public_projection.js" in (ROOT/"index.html").read_text("utf-8")
    compare_seg=app.split("async function runCompare",1)[1].split("function svgSeries",1)[0]
    discover_seg=app.split("function runDiscover",1)[1].split("function graphHtml",1)[0]
    assert "fi3Context" not in compare_seg and "FI2A_FI3_PUBLIC_PROJECTION" not in compare_seg
    assert "fi3Context" not in discover_seg and "FI2A_FI3_PUBLIC_PROJECTION" not in discover_seg
    scope=(ROOT/"presentation_i18n.js").read_text("utf-8")
    assert "a bounded FI3 project/funding candidate-evidence layer" in scope
    assert "eine eng begrenzte FI3-Projekt-/Funding-Kandidatenevidenzschicht" in scope
    assert ident["epistemic_class"]=="CANDIDATE_EVIDENCE_ONLY"
    assert ident["confirmed_identity_candidates"]==0
    assert ident["funding_edges"]==0 and ident["integrity_signals"]==0
    assert ident["natural_person_layer"]=="OFF"
    print("PASS_FI3_PUBLIC_STATIC_PROJECTION_STANDING_TEST")
    print(json.dumps({"identity_detail":len(ids),"role_detail":len(roles),"seed_entities":len(p["seed_entities"]),"reject_identity":p["reject_summary"]["identity_count"]},sort_keys=True))
if __name__=="__main__": main()
