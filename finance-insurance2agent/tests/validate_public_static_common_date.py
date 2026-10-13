#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,itertools
ROOT=Path(__file__).resolve().parents[1]
EXPECTED_SNAPSHOT="4ba2d5f1462bc1c40499e5ef643e6bb6f601d6298ba7af93ee8fbb7f37e565b2"
EXPECTED_APP="04ef8ff20689bf1c772438b42a42afd0416b390178eeeab28142cc1bbe958c3b"
EXPECTED_INDEX="7af669976aa61858ef69af725d68bc138afe5b2d1e7db575b798185de8d10ad7"
EXPECTED_P3DH_PAIR_COUNT=1759
EXPECTED_P3DH_COMMON_PAIR_COUNT=1757
EXPECTED_P3DH_NO_COMMON_PAIR_COUNT=2
EXPECTED_P3DH_DIVERGENT_OWN_LATEST_COUNT=523
EXPECTED_P3DH_METRIC_COUNT=17
DEKA="102e7656-6ac6-5f75-9d8e-f0af2fc6b253"
UBS="310d02f6-ffb4-569e-acaa-616f9fa566f5"
DEKA_UBS_METRIC="EBA_P3DH_CET1_RATIO_KM1"
DEKA_UBS_COMMON="2025-12-31"

def sh(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load():
    p=ROOT/"data/public_snapshot.js"
    assert sh(p)==EXPECTED_SNAPSHOT,(sh(p),EXPECTED_SNAPSHOT)
    t=p.read_text(encoding="utf-8")
    pre="window.FI2A_PUBLIC_SNAPSHOT="
    assert t.startswith(pre)
    r=t[len(pre):].strip()
    if r.endswith(";"): r=r[:-1]
    return json.loads(r)
def dates(rows): return sorted({o.get("reference_date") for o in rows if o.get("reference_date")})
def common(a,b):
    x=sorted(set(a)&set(b))
    return x[-1] if x else None
def main():
    assert sh(ROOT/"app.js")==EXPECTED_APP
    assert sh(ROOT/"index.html")==EXPECTED_INDEX
    app=(ROOT/"app.js").read_text(encoding="utf-8")
    idx=(ROOT/"index.html").read_text(encoding="utf-8")
    assert "function compareGenericLocal" in app
    assert "function compareP3DHLocal" in app
    assert "function latestCommonReferenceDate" in app
    assert "function resolveEvidenceAtDate" in app
    assert "String(mc||'').startsWith('EBA_P3DH_')?compareP3DHLocal(mc,ids):compareGenericLocal(mc,ids)" in app
    assert "app.js?v=20261013-public-static-common-date-r1" in idx

    s=load()
    by={}
    for o in s["observations"]:
        mc=o["metric_code"]
        if not mc.startswith("EBA_P3DH_"): continue
        by.setdefault(mc,{}).setdefault(o["entity_id"],[]).append(o)
    p3pairs=commonpairs=nocommon=divergent=0
    common_metrics=set()
    example=None
    for mc,em in by.items():
        ids=sorted(em)
        for a,b in itertools.combinations(ids,2):
            p3pairs+=1
            da,db=dates(em[a]),dates(em[b])
            cd=common(da,db)
            la=da[-1] if da else None
            lb=db[-1] if db else None
            if cd is None:
                nocommon+=1
                continue
            commonpairs+=1
            common_metrics.add(mc)
            if la!=cd or lb!=cd: divergent+=1
            ra=[o for o in em[a] if o.get("reference_date")==cd]
            rb=[o for o in em[b] if o.get("reference_date")==cd]
            assert len(ra)==len(rb)==1,(mc,a,b,cd,len(ra),len(rb))
            oa,ob=ra[0],rb[0]
            sema,semb=oa.get("semantic") or {},ob.get("semantic") or {}
            axes=[
                (oa.get("unit"),ob.get("unit")),
                (oa.get("currency"),ob.get("currency")),
                (oa.get("consolidation_scope"),ob.get("consolidation_scope")),
                (sema.get("reporting_framework"),semb.get("reporting_framework")),
                (sema.get("period_type"),semb.get("period_type")),
                (sema.get("variant_key"),semb.get("variant_key")),
                (sema.get("semantic_fingerprint"),semb.get("semantic_fingerprint")),
            ]
            assert all(x==y for x,y in axes),(mc,a,b,cd,axes)
            if mc==DEKA_UBS_METRIC and {a,b}=={DEKA,UBS}:
                example=(cd,la,lb)
    assert p3pairs==EXPECTED_P3DH_PAIR_COUNT,p3pairs
    assert commonpairs==EXPECTED_P3DH_COMMON_PAIR_COUNT,commonpairs
    assert nocommon==EXPECTED_P3DH_NO_COMMON_PAIR_COUNT,nocommon
    assert divergent==EXPECTED_P3DH_DIVERGENT_OWN_LATEST_COUNT,divergent
    assert len(common_metrics)==EXPECTED_P3DH_METRIC_COUNT,len(common_metrics)
    assert example is not None and example[0]==DEKA_UBS_COMMON and "2026-03-31" in example[1:],example

    ver=(ROOT/"versionen.html").read_text(encoding="utf-8")
    cor=(ROOT/"korrekturen.html").read_text(encoding="utf-8")
    for t in ["523","gemischte Stichtage","Statistik","27","12"]:
        assert t in ver,t
    for t in ["523","mixed dates","statistics","27","12"]:
        assert t in ver,t
    assert "P3DH-Vergleichsstichtag" in cor and "P3DH comparison date" in cor
    print("PASS_PUBLIC_STATIC_COMMON_DATE_R1_STANDING_REPO_TEST")
    print(json.dumps({"pairs":p3pairs,"common":commonpairs,"no_common":nocommon,"divergent":divergent,"common_metrics":len(common_metrics)},sort_keys=True))
if __name__=="__main__": main()
