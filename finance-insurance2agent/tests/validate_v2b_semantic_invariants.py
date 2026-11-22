#!/usr/bin/env python3
"""L4 current successor: preserves relevant historical semantic tests; all conditions execute under python -O.
Original historical bytes are archived outside the public candidate in HISTORICAL_TEST_ORIGINALS."""
from pathlib import Path
import hashlib, json, re, subprocess
ROOT = Path(__file__).resolve().parents[1]
SNAP = ROOT / 'data/public_snapshot.js'
V2A = ROOT / 'v2a_explainer.js'
APP = ROOT / 'app.js'
EXPECTED_REAL_UNITS = ['EUR', 'EUR_BILLION', 'EUR_M', 'EUR_MILLION', 'EUR_M_MARKET_VALUE', 'EUR_PER_FTE', 'EUR_THOUSAND', 'FTE', 'MONETARY', 'PERCENT', 'PERCENT_REDUCTION_VS_2019', 'PERSONS', 'RATIO_MULTIPLE', 'RATIO_PER_UNIT', 'SOURCE_NATIVE_AMOUNT', 'SOURCE_NATIVE_MONETARY_AMOUNT', 'TEXT', 'T_CO2E', 'USD_MILLION', 'million EUR', 'ratio']
SCENARIOS = ['__V2B_UNKNOWN_UNIT_SENTINEL__', 'constructor', 'toString', '__proto__', 'hasOwnProperty', 'valueOf', 'isPrototypeOf', 'toLocaleString', 'propertyIsEnumerable', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'eur', 'Eur', ' EUR', 'EUR ', 'percent', '', '0']

def parse_snapshot():
    t = SNAP.read_text(encoding='utf-8')
    pre = 'window.FI2A_PUBLIC_SNAPSHOT='
    if not t.startswith(pre):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    return json.loads(t[len(pre):].strip().rstrip(';'))

def source_policy_keys(v2):
    m = re.search('const UNIT_POLICY = Object\\.freeze\\(\\{(.*?)\\}\\);', v2, re.S)
    if not m:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    return set(re.findall('^\\s*"([^"]+)"\\s*:', m.group(1), re.M))

def main():
    snap = parse_snapshot()
    v2 = V2A.read_text(encoding='utf-8')
    app = APP.read_text(encoding='utf-8')
    real_units = {str(o['unit']) for o in snap['observations'] if o.get('unit') not in (None, '')}
    expected = set(EXPECTED_REAL_UNITS)
    active_expected = expected - {'RATIO_MULTIPLE'}
    policy = source_policy_keys(v2)
    if not real_units == active_expected:
        raise AssertionError(('REAL_UNIT_DOMAIN_DRIFT', sorted(real_units), sorted(active_expected)))
    if not policy == expected:
        raise AssertionError(('UNIT_POLICY_DOMAIN_DRIFT', sorted(policy), sorted(expected)))
    if not 'Object.prototype.hasOwnProperty.call(UNIT_POLICY,u)' in v2:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not v2.count('UNIT_POLICY[') == 1:
        raise AssertionError(('DIRECT_UNIT_POLICY_INDEX_READS', v2.count('UNIT_POLICY[')))
    if not "UNKNOWN_UNIT_UNGOVERNED:'reasonUnitUnknown'" in app:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'Einheit ist nicht in der freigegebenen Unit-Policy geregelt' in app:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'unit is not governed by the approved unit policy' in app:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    for pat in ['\\bdocument\\b', '\\bfetch\\s*\\(', '\\bXMLHttpRequest\\b', '\\blocalStorage\\b', '\\bsessionStorage\\b']:
        if not not re.search(pat, v2):
            raise AssertionError(('RUNTIME_DEPENDENCY', pat))
    probe = '\n"use strict";\nconst fs=require("fs"),vm=require("vm"),crypto=require("crypto");\nconst root=process.argv[1];\nconst EXPECTED=__EXPECTED__;\nconst SCENARIOS=__SCENARIOS__;\nconst raw=fs.readFileSync(root+"/data/public_snapshot.js","utf8"),pre="window.FI2A_PUBLIC_SNAPSHOT=";\nconst snap=JSON.parse(raw.slice(pre.length).trim().replace(/;$/,""));\nconst win={};vm.runInNewContext(fs.readFileSync(root+"/v2a_explainer.js","utf8"),{window:win});\nconst V=win.FI2A_V2A,ex=V.createExplainer(snap);\nconst OWN=new Map(Object.entries({\n"EUR":"E","EUR_BILLION":"E","EUR_M":"E","EUR_MILLION":"E","EUR_M_MARKET_VALUE":"E","EUR_PER_FTE":"E","EUR_THOUSAND":"E","million EUR":"E",\n"USD_MILLION":"U","MONETARY":"X","SOURCE_NATIVE_AMOUNT":"X","SOURCE_NATIVE_MONETARY_AMOUNT":"X",\n"FTE":"N","PERCENT":"N","PERCENT_REDUCTION_VS_2019":"N","PERSONS":"N","RATIO_MULTIPLE":"N","RATIO_PER_UNIT":"N","T_CO2E":"N","ratio":"N","TEXT":"T"\n}));\nif(JSON.stringify([...OWN.keys()].sort())!==JSON.stringify([...EXPECTED].sort()))throw new Error("INDEPENDENT_UNIT_TABLE_DRIFT");\nconst gov=u=>typeof u==="string"&&OWN.has(u);\nconst reg=new Map();for(const r of snap.regime_memberships||[])if(String(r.status||"").startsWith("ACTIVE")){if(!reg.has(r.entity_id))reg.set(r.entity_id,[]);reg.get(r.entity_id).push(r.regime_code)}\nconst rk=e=>(reg.get(e)||[]).slice().sort().join("|");\nfunction cur(o){const t=OWN.get(o.unit),ex=o.currency||"";if(t==="E")return{k:1,v:"EUR",c:!!ex&&ex!=="EUR",req:0};if(t==="U")return{k:1,v:"USD",c:!!ex&&ex!=="USD",req:0};if(t==="X")return{k:ex?1:0,v:ex||null,c:false,req:1};return{k:0,v:null,c:false,req:0}}\nfunction oracle(p3,x,y){\n const bl=new Set(),un=new Set(),cv=new Set(),g=gov(x.unit)&&gov(y.unit);\n if(!g)un.add("UNKNOWN_UNIT_UNGOVERNED");\n if(OWN.get(x.unit)==="T"||OWN.get(y.unit)==="T")un.add("NON_NUMERIC_VALUE_UNSUPPORTED_V0_2");\n if((x.reference_date||"")!==(y.reference_date||""))(p3?bl:un).add(p3?"REFERENCE_DATE_DIFF":"REFERENCE_DATE_DIFF_UNGOVERNED");\n if(g&&x.unit!==y.unit)bl.add(p3?"UNIT_DIFF":"UNIT_MISMATCH");\n const cx=cur(x),cy=cur(y);if(cx.c||cy.c)bl.add("UNIT_CURRENCY_INTERNAL_CONFLICT");if((cx.req&&!cx.k)||(cy.req&&!cy.k))un.add("CURRENCY_REQUIRED_BUT_UNKNOWN");if(cx.k&&cy.k&&cx.v!==cy.v)bl.add(p3?"CURRENCY_DIFF":"CURRENCY_MISMATCH");\n const sx=x.semantic||{},sy=y.semantic||{};\n if((x.consolidation_scope||"")!==(y.consolidation_scope||""))(p3?cv:un).add(p3?"CONSOLIDATION_SCOPE_DIFF":"CONSOLIDATION_SCOPE_COMPATIBILITY_UNKNOWN");\n if((sx.period_type||"")!==(sy.period_type||""))(p3?cv:un).add(p3?"PERIOD_TYPE_DIFF":"PERIOD_TYPE_COMPATIBILITY_UNKNOWN");\n if((sx.variant_key||"")!==(sy.variant_key||""))(p3?cv:un).add(p3?"VARIANT_KEY_DIFF":"VARIANT_KEY_COMPATIBILITY_UNKNOWN");\n if((sx.reporting_framework||"")!==(sy.reporting_framework||""))cv.add(p3?"REPORTING_FRAMEWORK_DIFF":"FRAMEWORK_MISMATCH");\n if((sx.semantic_fingerprint||"")!==(sy.semantic_fingerprint||""))cv.add(p3?"SEMANTIC_FINGERPRINT_DIFF":"SEMANTIC_FINGERPRINT_DIFFERS");\n if(!p3){const g1=rk(x.entity_id),g2=rk(y.entity_id);if(g1&&g2&&g1!==g2)bl.add("REGIME_MISMATCH");else if(!!g1!==!!g2)cv.add("REGIME_COVERAGE_ASYMMETRIC")}\n if((x.restatement_version||"")||(y.restatement_version||""))cv.add("RESTATEMENT_METADATA_PRESENT");\n const verdict=bl.size?"NOT_COMPARABLE":un.size?"NOT_DETERMINABLE":cv.size?"COMPARABLE_WITH_CAVEATS":"COMPARABLE";\n return{verdict,reasons:[...bl,...un,...cv].sort()}\n}\nconst byMetric=new Map();for(const o of snap.observations){if(!byMetric.has(o.metric_code))byMetric.set(o.metric_code,new Set());byMetric.get(o.metric_code).add(o.entity_id)}\nconst pairs=[];for(const [mc,set] of byMetric){const ids=[...set].sort();for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)pairs.push([mc,ids[i],ids[j]])}\nlet totality=0,symmetry=0,order=0,valueBlind=0;const singles=[];const digestLines=[];\nfor(const [mc,a,b] of pairs){\n let r1,r2;try{r1=ex.explainComparison(mc,[a,b]);r2=ex.explainComparison(mc,[b,a])}catch(e){totality++;continue}\n const p=r1.pairwise[0],q=r2.pairwise[0],rp=[...p.reasons].sort(),rq=[...q.reasons].sort();\n if(p.verdict!==q.verdict||JSON.stringify(rp)!==JSON.stringify(rq))symmetry++;\n digestLines.push([mc,a,b,p.verdict,rp.join(","),p.evidence_status].join("|"));\n if(r1.resolutions.every(x=>x.state==="SINGLE"))singles.push({mc,p3:r1.contract_path==="P3DH",x:r1.resolutions[0].observations[0],y:r1.resolutions[1].observations[0],base:p.verdict});\n}\nconst mut=JSON.parse(JSON.stringify(snap));let mutatedNumeric=0;\nfor(const o of mut.observations)if(typeof o.numeric_value_real==="number"){o.numeric_value_real=o.numeric_value_real*(-17.31)+91.7;mutatedNumeric++}\nconst exm=V.createExplainer(mut);for(const [mc,a,b] of pairs)if(ex.explainComparison(mc,[a,b]).overall_verdict!==exm.explainComparison(mc,[a,b]).overall_verdict)valueBlind++;\nconst shuffled=JSON.parse(JSON.stringify(snap));shuffled.observations.reverse();const exs=V.createExplainer(shuffled);for(const [mc,a,b] of pairs)if(ex.explainComparison(mc,[a,b]).overall_verdict!==exs.explainComparison(mc,[a,b]).overall_verdict)order++;\n\nconst evalF=(p3,x,y)=>p3?ex.evaluateP3DH(x,y):ex.evaluateGeneric(x,y);\nconst scenarioReport={};let scenarioMismatches=0;\nfor(const s of SCENARIOS){\n let bothMismatch=0,oneMismatch=0,bothComparable=0,falseUnitMismatch=0;\n for(const sp of singles){\n  const xb={...sp.x,unit:s},yb={...sp.y,unit:s},eb=evalF(sp.p3,xb,yb),ob=oracle(sp.p3,xb,yb);\n  if(eb.verdict!==ob.verdict||JSON.stringify([...eb.reasons].sort())!==JSON.stringify(ob.reasons)){bothMismatch++;scenarioMismatches++}\n  if(eb.verdict==="COMPARABLE"||eb.verdict==="COMPARABLE_WITH_CAVEATS")bothComparable++;\n  const xo={...sp.x,unit:s},eo=evalF(sp.p3,xo,sp.y),oo=oracle(sp.p3,xo,sp.y);\n  if(eo.verdict!==oo.verdict||JSON.stringify([...eo.reasons].sort())!==JSON.stringify(oo.reasons)){oneMismatch++;scenarioMismatches++}\n  if(eo.reasons.includes("UNIT_MISMATCH")||eo.reasons.includes("UNIT_DIFF"))falseUnitMismatch++;\n }\n scenarioReport[JSON.stringify(s)]={bothMismatch,oneMismatch,bothComparable,falseUnitMismatch};\n}\nlet knownMismatchFailures=0;\nfor(const sp of singles){\n const y=sp.y;let alt=y.unit==="PERCENT"?"RATIO_MULTIPLE":"PERCENT";\n const e=evalF(sp.p3,{...sp.x,unit:alt},y);\n if(e.verdict!=="NOT_COMPARABLE"||!(e.reasons.includes("UNIT_MISMATCH")||e.reasons.includes("UNIT_DIFF")))knownMismatchFailures++;\n}\nconst rank={COMPARABLE:0,COMPARABLE_WITH_CAVEATS:1,NOT_DETERMINABLE:2,NOT_COMPARABLE:3};\nconst bases=[];const seen=new Set();\nfor(const sp of singles)if(sp.base==="COMPARABLE"&&!seen.has(sp.mc)){seen.add(sp.mc);bases.push(sp);if(bases.length>=32)break}\nlet monotonicFailures=0;\nfor(const sp of bases){\n const base=evalF(sp.p3,sp.x,sp.y);\n const cave=evalF(sp.p3,{...sp.x,semantic:{...(sp.x.semantic||{}),semantic_fingerprint:"__G3_CAVEAT__"}},sp.y);\n const unk=evalF(sp.p3,{...sp.x,consolidation_scope:"__G3_UNKNOWN_SCOPE__"},sp.y);\n const alt=sp.y.unit==="PERCENT"?"RATIO_MULTIPLE":"PERCENT";\n const blk=evalF(sp.p3,{...sp.x,unit:alt},sp.y);\n if(!(rank[base.verdict]<=rank[cave.verdict]&&rank[cave.verdict]<=rank[unk.verdict]&&rank[unk.verdict]<=rank[blk.verdict]))monotonicFailures++;\n}\nlet p3count=0,p3bad=0;for(const [mc,a,b] of pairs)if(mc.startsWith("EBA_P3DH_")){p3count++;if(ex.explainComparison(mc,[a,b]).contract_path!=="P3DH")p3bad++}\nconst digest=crypto.createHash("sha256").update(digestLines.join("\\n")).digest("hex");\nconsole.log(JSON.stringify({\n pair_count:pairs.length,single_pairs:singles.length,totality_errors:totality,symmetry_violations:symmetry,\n entity_order_violations:order,value_blindness_violations:valueBlind,mutated_numeric_fields:mutatedNumeric,\n scenario_count:SCENARIOS.length,scenario_mismatches:scenarioMismatches,scenario_report:scenarioReport,\n known_governed_mismatch_failures:knownMismatchFailures,monotonicity_base_pairs:bases.length,monotonicity_failures:monotonicFailures,\n p3dh_pairs:p3count,p3dh_delegation_failures:p3bad,digest_sha256:digest\n}));\n'.replace('__EXPECTED__', json.dumps(EXPECTED_REAL_UNITS, ensure_ascii=False)).replace('__SCENARIOS__', json.dumps(SCENARIOS, ensure_ascii=False))
    cp = subprocess.run(['node', '-e', probe, str(ROOT)], capture_output=True, text=True, timeout=300)
    if not cp.returncode == 0:
        raise AssertionError((cp.stdout, cp.stderr))
    r = json.loads(cp.stdout)
    if not r['pair_count'] == 34797:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not r['single_pairs'] == 34538:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not r['totality_errors'] == 0:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not r['symmetry_violations'] == 0:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not r['entity_order_violations'] == 0:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not r['value_blindness_violations'] == 0:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not r['scenario_mismatches'] == 0:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not r['known_governed_mismatch_failures'] == 0:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not (r['monotonicity_base_pairs'] >= 8 and r['monotonicity_failures'] == 0):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not (r['p3dh_pairs'] > 0 and r['p3dh_delegation_failures'] == 0):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    print('PASS_V2B_SEMANTIC_INVARIANTS_STANDING_TEST')
    print(json.dumps({'pair_count': r['pair_count'], 'single_pairs': r['single_pairs'], 'real_unit_count': len(real_units), 'policy_unit_count': len(policy), 'unit_scenarios': r['scenario_count'], 'monotonicity_base_pairs': r['monotonicity_base_pairs'], 'unknown_unit_reason': 'UNKNOWN_UNIT_UNGOVERNED', 'digest_sha256': r['digest_sha256']}, sort_keys=True))
    return 0
if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except AssertionError as e:
        print('FAIL_V2B_SEMANTIC_INVARIANTS:', repr(e))
        raise SystemExit(2)
