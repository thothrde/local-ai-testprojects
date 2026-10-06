#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
EXPECTED_DB='ef65ecc870aa99629c5d955247d00393814c81c4d7102ee7d182986e092a97c2'
EXPECTED_SNAPSHOT='09ca0d67627f2e591da80912288dc289b18ec444c051670c9694ea377422d353'
EXPECTED_COUNTS={'entities': 140, 'metrics': 117, 'observations': 7501, 'sources': 207, 'relations': 7, 'time_series_decisions': 119}
CACHEBUSTER='20261006-public-refresh-ef65'
def sh(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load_snapshot():
    t=(ROOT/"data/public_snapshot.js").read_text("utf-8")
    assert sh(ROOT/"data/public_snapshot.js")==EXPECTED_SNAPSHOT
    prefix="window.FI2A_PUBLIC_SNAPSHOT="
    assert t.startswith(prefix)
    raw=t[len(prefix):].strip()
    if raw.endswith(";"):
        raw=raw[:-1]
    return json.loads(raw),t
def walk_keys(o):
    if isinstance(o,dict):
        for k,v in o.items():
            yield k
            yield from walk_keys(v)
    elif isinstance(o,list):
        for v in o:
            yield from walk_keys(v)
def main():
    s,txt=load_snapshot()
    meta=s["meta"]
    identity=json.loads((ROOT/"PUBLIC_BUILD_IDENTITY.json").read_text())
    evidence=json.loads((ROOT/"PUBLIC_CAPABILITY_EVIDENCE.json").read_text())
    validation=json.loads((ROOT/"VALIDATION_REPORT.json").read_text())
    assert meta["db_sha256"]==EXPECTED_DB==meta["expected_db_sha256"]
    assert identity["bound_database_sha256"]==EXPECTED_DB
    assert evidence["public_snapshot_sha256"]==EXPECTED_SNAPSHOT
    assert validation["bound_database_sha256"]==EXPECTED_DB
    assert validation["public_snapshot_sha256"]==EXPECTED_SNAPSHOT
    actual={"entities":len(s["entities"]),"metrics":len(s["metrics"]),"observations":len(s["observations"]),"sources":len(s["sources"]),"relations":len(s["relations"]),"time_series_decisions":len(s["time_series_decisions"])}
    assert actual==EXPECTED_COUNTS,(actual,EXPECTED_COUNTS)
    assert meta["counts"]==EXPECTED_COUNTS
    assert "local_relpath" not in set(walk_keys(s))
    sentinel="/"+("Users")+"/"
    assert sentinel not in txt
    assert evidence["public_data_refresh_performed"] is True
    rr=identity["public_data_refresh_20261006"]
    assert rr["snapshot_sha256"]==EXPECTED_SNAPSHOT
    assert rr["counts"]==EXPECTED_COUNTS
    idx=(ROOT/"index.html").read_text()
    assert ("data/public_snapshot.js?v="+CACHEBUSTER) in idx
    ver=(ROOT/"versionen.html").read_text()
    assert EXPECTED_DB in ver and "7.501" in ver and "7,501" in ver
    lines=(ROOT/"MANIFEST_SHA256.txt").read_text().splitlines()
    seen=set()
    for line in lines:
        if not line.strip():
            continue
        h,rel=line.split(None,1)
        rel=rel.lstrip("*").strip()
        p=ROOT/rel
        assert p.is_file(),rel
        assert sh(p)==h,(rel,sh(p),h)
        seen.add(rel)
    assert "data/public_snapshot.js" in seen
    assert "tests/validate_public_data_release.py" in seen
    print("PASS_PUBLIC_DATA_RELEASE_STANDING_REPO_TEST")
    print(json.dumps({"db":EXPECTED_DB,"snapshot":EXPECTED_SNAPSHOT,"counts":actual},sort_keys=True))
if __name__=="__main__":
    main()
