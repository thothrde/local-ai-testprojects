#!/usr/bin/env python3
"""POSTLIVE_L1_L4_CURRENT_CONTRACT_V1 — current, fail-closed, read-only checks.
This is not an independent audit, legal decision or release authorization.
Legacy test bytes are in the non-public HISTORICAL_TEST_ORIGINALS bundle.
The external app-asset SHA manifest must be checked independently.
"""
from pathlib import Path
from collections import Counter
from itertools import combinations
import hashlib, json, re
ROOT = Path(__file__).resolve().parents[2]
A = ROOT/'finance-insurance2agent'
B = ROOT/'finanztransparenz'
SHA = {'finance-insurance2agent/data/public_snapshot.js': 'f80830bea1dbae4818521ff1770ffc17b8bb7d649af3d8e1bc86af4862835157', 'finance-insurance2agent/data/fi3_public_projection.js': 'fc19a136a40cf97fe2b22d975567fda9e8ac663ea2086398fce0aca2cea7b30b', 'finance-insurance2agent/data/research_context_v1.js': '195bc22c51a392baf1a237b16bb56c12471a0456a76b99e5452eaae6ccf10f92', 'finance-insurance2agent/data/public_research_workspace_v1.js': 'b47a0ce5b4c914fab22783f0296dcd0a8373ec7acd43b9aa2e607af1ba68f02f', 'finance-insurance2agent/app.js': 'b01fd00d23bf57d9355d23c25944cf966e59f487aa4927981ca1ad3d88642db2', 'finance-insurance2agent/index.html': '78a7dae70fa487039f42446d4bd36d1c90cf085b442e5c8541618f72baedae5f', 'finance-insurance2agent/v2a_explainer.js': 'da73b043aa01483b9aa8742e9609b699134107220db27e06670cee802333b9a2', 'finanztransparenz/data/pillar_b_public.json': 'a3b8d1953dad21b088678d7168abfdd1ca0acf4b172da67bcadbfced302d21d8', 'finanztransparenz/data/pillar_c_public_readmodel.json': 'd8bdbd821ce7590ed7eb9c9b6879502dd7d7424f969b75e94528c509135b43ad', 'finance-insurance2agent/tests/E17_ACTIVE_METRIC_POLICY.json': 'bfe0c314ce4af52800741c4f4468afa3955cc2795385a099a658cdf5e56773a0'}
BASE_HEAD = 'c8b6384701310606ef24dd4d9c7485abaad2e921'
SNAP_PREFIX = b'window.FI2A_PUBLIC_SNAPSHOT='
FORBIDDEN_PERSON_METRICS = {
 'PILLAR_B_CEO_COMP_GCGC_TOTAL_EXCL_FRINGE_PENSION_EUR',
 'PILLAR_B_CEO_COMP_GCGC_TOTAL_INCL_FRINGE_PENSION_EUR',
 'PILLAR_B_CEO_COMP_SECTION162_PAID_OR_OWED_EUR',
 'PILLAR_B_CEO_TO_AVERAGE_FTE_SECTION162',
 'PILLAR_B_EXECUTIVE_COMP_SECTION162_GRANTED_AND_OWED_EUR'
}

def require(ok, code):
    if not ok: raise RuntimeError(code)

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def pin(rel):
    dest = ROOT/rel
    require(dest.is_file(), 'MISSING_PINNED_FILE:'+rel)
    require(sha(dest)==SHA[rel], 'PIN_DRIFT:'+rel)

def load():
    pin('finance-insurance2agent/data/public_snapshot.js')
    raw=(A/'data/public_snapshot.js').read_bytes()
    require(raw.startswith(SNAP_PREFIX) and raw.endswith(b';\n'),'FIRST_WRAPPER')
    first=json.loads(raw[len(SNAP_PREFIX):-2])
    pin('finanztransparenz/data/pillar_b_public.json')
    b=json.loads((B/'data/pillar_b_public.json').read_text('utf-8'))
    pin('finanztransparenz/data/pillar_c_public_readmodel.json')
    c=json.loads((B/'data/pillar_c_public_readmodel.json').read_text('utf-8'))
    return first,b,c

def qjson(rel):return json.loads((ROOT/rel).read_text('utf-8'))

def counts(first):
    return {k:len(first[k]) for k in ('entities','metrics','observations','sources','relations','time_series_decisions')}

def current_chain():
    ident=qjson('finance-insurance2agent/PUBLIC_BUILD_IDENTITY.json')
    evid=qjson('finance-insurance2agent/PUBLIC_CAPABILITY_EVIDENCE.json')
    val=qjson('finance-insurance2agent/VALIDATION_REPORT.json')
    ep=A/'PUBLIC_CAPABILITY_EVIDENCE.json';vp=A/'VALIDATION_REPORT.json'
    require(ident.get('current_capability_evidence_sha256')==sha(ep),'CURRENT_IDENTITY_EVIDENCE_SHA')
    require(ident.get('current_validation_report_sha256')==sha(vp),'CURRENT_IDENTITY_VALIDATION_SHA')
    require(val.get('current_capability_evidence_sha256')==sha(ep),'CURRENT_VALIDATION_EVIDENCE_SHA')
    require(evid.get('public_snapshot_sha256')==SHA['finance-insurance2agent/data/public_snapshot.js'],'EVIDENCE_SNAPSHOT')
    require(val.get('public_snapshot_sha256')==SHA['finance-insurance2agent/data/public_snapshot.js'],'VALIDATION_SNAPSHOT')
    require(val.get('counts',{}).get('observations')==7801,'VALIDATION_COUNT')
    return ident,evid,val

def manifest():
    lines=(A/'MANIFEST_SHA256.txt').read_text('utf-8').splitlines()
    actual={}
    for line in lines:
        h,sep,rel=line.partition('  ')
        require(bool(sep) and bool(re.fullmatch('[0-9a-f]{64}',h)),'MANIFEST_FORMAT')
        require(rel and rel not in actual and '..' not in Path(rel).parts and not Path(rel).is_absolute(),'MANIFEST_PATH')
        f=A/rel;require(f.is_file(),'MANIFEST_MISSING:'+rel)
        require(sha(f)==h,'MANIFEST_HASH:'+rel)
        actual[rel]=h
    expect={str(f.relative_to(A)) for f in A.rglob('*') if f.is_file() and f.name!='MANIFEST_SHA256.txt'}
    require(set(actual)==expect,'MANIFEST_INCOMPLETE_OR_STALE')
    return len(actual)


def check_capability_contract():
    first,b,c=load()
    ident,evid,val=current_chain()
    caps=ident.get('implemented_capabilities');require(isinstance(caps,list) and caps,'CAPABILITY_LIST')
    by_code={x.get('code'):x for x in caps}
    require(None not in by_code and len(by_code)==len(caps),'DUPLICATE_CAPABILITY_CODE')
    contracts=evid.get('capability_contract',{})
    require(set(by_code)==set(contracts),'CAPABILITY_COVERAGE')
    tests=evid.get('tests');require(isinstance(tests,list),'EVIDENCE_TEST_LIST')
    test_map={t.get('id'):t for t in tests}
    require(None not in test_map and len(test_map)==len(tests),'EVIDENCE_TEST_DUPLICATE')
    for x in tests:require(x.get('result')=='PASS','HISTORICAL_EVIDENCE_REPORTED_FAIL:'+str(x.get('id')))
    for code,cap in by_code.items():
        spec=contracts[code]
        require(bool(spec.get('public_static_supported'))==bool(cap.get('public_static_supported')),'CAPABILITY_SUPPORT_STATUS:'+code)
        tids=spec.get('test_ids',[])
        require(not cap.get('public_static_supported') or bool(tids),'CAPABILITY_NO_EVIDENCE:'+code)
        require(all(t in test_map for t in tids),'CAPABILITY_TEST_REF:'+code)
    for key in ('bound_public_bytes','copy_contract_sha256'):
        for rel,expected in evid.get(key,{}).items():
            f=A/rel;require(f.is_file() and sha(f)==expected,'EVIDENCE_BOUND_FILE:'+rel)
    successor=evid.get('postlive_l1_l4_current_successor')
    require(isinstance(successor,dict) and successor.get('source_release_head')==BASE_HEAD,'MISSING_CURRENT_SUCCESSOR_EVIDENCE')
    for rel,h in successor.get('current_validators_sha256',{}).items():
        require((A/rel).is_file() and sha(A/rel)==h,'CURRENT_VALIDATOR_SHA:'+rel)
    require(len(successor.get('current_validators_sha256',{}))==10,'CURRENT_VALIDATOR_COUNT')
    require(evid['fi3_public_r15']['standing_validator_sha256'] == 'a818fb9e4f143f3791c2502b63c7dc8a36623fc21dbad999713e520dd8141b61','HISTORICAL_FI3_PIN_MUTATED')
    return {'capabilities':len(caps),'evidence_tests_reported_pass':len(tests),'current_validators_bound':10}

def check_current_integrity():
    first,b,c=load();pin('finance-insurance2agent/app.js');pin('finance-insurance2agent/index.html')
    require(counts(first)=={'entities':144,'metrics':118,'observations':7801,'sources':279,'relations':7,'time_series_decisions':119},'CURRENT_COUNTS')
    require(len(first.get('lineage',[]))==3723,'LINEAGE_COUNT')
    require(first['meta']['counts']==counts(first),'META_COUNTS')
    require(len(b['observations'])==11,'PILLAR_B_OBS_COUNT')
    require(len(c['readmodel']['munich_re_tax_cbcr'])==28,'PILLAR_C_TAX_ROWS')
    require(sum([len(c['readmodel']['solvency']),len(c['readmodel']['climate_target_vs_actual']),len(c['readmodel']['ergo_ifrs17_csm']),6*len(c['readmodel']['munich_re_tax_cbcr'])])==184,'PILLAR_C_OBS_COUNT')
    i,e,v=current_chain();require(manifest()>=37,'MANIFEST_TOO_SMALL')
    require(i.get('current_release_gate')=='RELEASE_STATUS_REQUIRES_EXTERNAL_GITHUB_PAGES_ATTESTATION','CANDIDATE_RELEASE_GATE')
    return {'observations':7801,'lineage':3723,'pillar_b':11,'pillar_c':184,'manifest':manifest()}

def check_metric_policy():
    first,b,c=load();pin('finance-insurance2agent/tests/E17_ACTIVE_METRIC_POLICY.json')
    p=qjson('finance-insurance2agent/tests/E17_ACTIVE_METRIC_POLICY.json')
    require(p.get('schema')=='POSTLIVE_L4_CURRENT_ACTIVE_METRICS_V1','CURRENT_POLICY_SCHEMA')
    require(p.get('source_release_head')==BASE_HEAD,'POLICY_SOURCE_HEAD')
    a=Counter(x['metric_code'] for x in first['observations']);d=Counter(x['metric_id'] for x in b['observations'])
    require(dict(a)==p['active_app1_metric_counts'],'APP1_METRIC_COUNTS')
    require(dict(d)==p['active_app2_metric_counts'],'APP2_METRIC_COUNTS')
    require(sum(a.values())==7801 and sum(d.values())==11,'METRIC_TOTALS')
    require('PILLAR_B_ESRS_HIGHEST_PAID_TO_MEDIAN' not in a and 'PILLAR_B_ESRS_HIGHEST_PAID_TO_MEDIAN' not in d,'ESRS_ACTIVE')
    require(not ((set(a)|set(d))&FORBIDDEN_PERSON_METRICS),'PERSON_METRIC_ACTIVE')
    require(set(p.get('explicitly_forbidden_person_metric_codes',[]))==FORBIDDEN_PERSON_METRICS,'FORBIDDEN_LIST_CHANGED')
    require(p.get('public_projection_sha256')==SHA['finance-insurance2agent/data/public_snapshot.js'],'POLICY_APP1_SHA')
    require(p.get('second_public_sha256')==SHA['finanztransparenz/data/pillar_b_public.json'],'POLICY_APP2_SHA')
    require(p.get('pillar_c_public_sha256')==SHA['finanztransparenz/data/pillar_c_public_readmodel.json'],'POLICY_APP2C_SHA')
    require(p.get('approved_current_totals')=={'app1':7801,'app2_pillar_b':11,'app2_pillar_c':184},'POLICY_TOTALS')
    return {'app1_metrics_active':len(a),'app2_metrics_active':len(d),'old_ratio_unit_active':False}

def check_second_app_shape():
    first,b,c=load()
    need={'observations':11,'lineage':0,'person_context':0,'pay_ratio_extension':0,'comparability_assessments':0,'comparability_profiles':0,'metric_definitions':2}
    for k,n in need.items():require(isinstance(b.get(k),list) and len(b[k])==n,'PILLAR_B_SHAPE:'+k)
    require({x.get('metric_id') for x in b['observations']}=={'PILLAR_B_EMPLOYEE_AVG_FTE_SECTION162_EUR'},'PILLAR_B_ACTIVE_DOMAIN')
    ids={x['observation_id'] for x in b['observations']};require(len(ids)==11,'PILLAR_B_DUPLICATE_IDS')
    schema={'assertion_level','comparability_profile_id','currency','entity_id','evidence_level','method_version','metric_id','numeric_value','observation_id','reference_date','restatement_version','source_datapoint','source_dimensions','source_document_id','source_page','source_raw_value','source_table','unit'}
    require(all(set(o)==schema for o in b['observations']),'PILLAR_B_SCHEMA_DRIFT')
    require(b.get('contains_personal_data') is True and b.get('personal_data_review_required') is True,'PILLAR_B_FALSE_ANONYMITY_CLAIM')
    require(c.get('contains_personal_data') is True and c.get('personal_data_review_required') is True,'PILLAR_C_FALSE_ANONYMITY_CLAIM')
    require(c['readmodel']['remuneration_esrs']==[],'PILLAR_C_ESRS_REINTRODUCED')
    require(c['contract']['families']['remuneration']['observations']==0,'PILLAR_C_ESRS_COUNTER')
    require(c['contract']['families']['munich_re_tax_cbcr']['rows']==28,'PILLAR_C_TAX_CONTRACT')
    require(len(c['readmodel']['munich_re_tax_cbcr'])==28,'PILLAR_C_TAX_ROWS')
    return {'pillar_b':11,'pillar_c':184,'tax_rows':28,'dangling_assessments':0}

def check_public_data_release():
    first,b,c=load();i,e,v=current_chain()
    require(first['meta']['db_sha256']==first['meta']['expected_db_sha256']==i['bound_database_sha256']==v['bound_database_sha256'],'CANONICAL_DB_BINDING')
    require(len(first.get('source_quality_issues',[]))==3,'SOURCE_QUALITY_ISSUE_COUNT')
    ids={x['id'] for x in first['observations']}
    require(len(ids)==7801,'OBSERVATION_ID_DUPLICATES')
    require(all(x['derived_observation_id'] in ids and x['input_observation_id'] in ids for x in first['lineage']),'LINEAGE_DANGLING')
    entities={x['id'] for x in first['entities']};sources={x['id'] for x in first['sources']};metrics={x['code'] for x in first['metrics']}
    require(all(o['entity_id'] in entities and o['source_id'] in sources and o['metric_code'] in metrics for o in first['observations']),'ORPHAN_REFERENCE')
    require(all(int(x.get('raw_redistribution_allowed') or 0)==0 for x in first['sources']),'RAW_REUSE_UNGOVERNED')
    require(not any(str(d.get('comparability_status','')).upper()=='EXACTLY_COMPARABLE' for d in first['time_series_decisions']),'UNAUTHORIZED_TIME_SERIES_EQUIVALENCE')
    require(len(first.get('generated_discovery_candidates',[]))==200,'DISCOVERY_CANDIDATES')
    require(len(first.get('investigation_candidates',[]))==34 and len(first.get('investigation_threads',[]))==14,'INVESTIGATION_COUNTS')
    require(all(x.get('status')=='EXPLORATORY_ONLY' for x in first.get('generated_discovery_candidates',[])),'UNAUTHORIZED_DISCOVERY_EVIDENCE')
    # Retain the identified unresolved official-source conflict; no winner or statistical use.
    issues=[]
    for x in first['source_quality_issues']:
        obj=json.loads(x.get('origin_record_json') or '{}')
        if obj.get('external_issue_id')=='SCOR_GROUP_FY2025_R0610_OFFICIAL_INTERNAL_SOURCE_CONFLICT': issues.append(obj)
    require(len(issues)==1,'SCOR_CONFLICT_MISSING')
    issue=issues[0]
    require(issue.get('value_resolution_status')=='UNRESOLVED_NO_WINNER' and issue.get('statistics_authorized') is False and issue.get('discovery_value_authorized') is False,'SCOR_UNRESOLVED_MUST_STAY_HOLD')
    for rel in ('finance-insurance2agent/data/public_snapshot.js','finance-insurance2agent/index.html'):
        raw=(ROOT/rel).read_text('utf-8')
        require('token=' not in raw and '/Users/' not in raw and 'file://' not in raw,'PUBLIC_SOURCE_LEAK:'+rel)
    app=(A/'app.js').read_text('utf-8')
    for func in ('function compareP3DHLocal','function compareGenericLocal','function latestCommonReferenceDate','function runDiscover'):
        require(func in app,'APP_FUNCTION_MISSING:'+func)
    pin('finance-insurance2agent/data/research_context_v1.js')
    pin('finance-insurance2agent/data/public_research_workspace_v1.js')
    return {'observations':7801,'investigations':34,'discovery_candidates_exploratory':200,'scor_winner':False}

def check_v2a_guided_explainer():
    first,b,c=load()
    pin('finance-insurance2agent/v2a_explainer.js');pin('finance-insurance2agent/app.js');pin('finance-insurance2agent/index.html')
    v2=(A/'v2a_explainer.js').read_text('utf-8');app=(A/'app.js').read_text('utf-8');idx=(A/'index.html').read_text('utf-8')
    for name in ('V2A_SPEC_V0_2_1','unitPolicyOf','Object.prototype.hasOwnProperty.call(UNIT_POLICY,u)','UNKNOWN_UNIT_UNGOVERNED','CURRENCY_REQUIRED_BUT_UNKNOWN','REFERENCE_DATE_DIFF_UNGOVERNED','CONSOLIDATION_SCOPE_COMPATIBILITY_UNKNOWN','PERIOD_TYPE_COMPATIBILITY_UNKNOWN','VARIANT_KEY_COMPATIBILITY_UNKNOWN'):
        require(name in v2,'V2A_GOVERNANCE_MISSING:'+name)
    for marker in ('v2aEvidenceAxis','v2aStatsSafe','getV2AExplainer','v2aExplainerHtml','Nicht bestimmbar aus den verfügbaren Daten','Cannot be determined from the available data'):
        require(marker in app,'GUIDED_EXPLAINER_UI_MISSING:'+marker)
    require('id="compareResult" class="result" aria-live="polite"' in idx,'COMPARE_ARIA_LIVE_MISSING')
    for bad in ('/api/','fetch(','XMLHttpRequest','localStorage','sessionStorage'):
        require(bad not in v2,'V2A_UNAPPROVED_RUNTIME:'+bad)
    by={}
    for o in first['observations']:by.setdefault(o['metric_code'],set()).add(o['entity_id'])
    pair_count=sum(len(ids)*(len(ids)-1)//2 for ids in by.values())
    require(pair_count==34797,'CURRENT_V2A_PAIR_COUNT')
    # The detailed pairwise symmetry/unit/value-blindness test is the independently executed V2B validator.
    return {'current_pairs':pair_count,'detailed_semantics_in':'validate_v2b_semantic_invariants.py'}

PROFILES = {
 'capability_contract': check_capability_contract,
 'e17_current_integrity': check_current_integrity,
 'e17_metric_policy': check_metric_policy,
 'e18_second_app_shape': check_second_app_shape,
 'public_data_release': check_public_data_release,
 'v2a_guided_explainer': check_v2a_guided_explainer,
}

def run(which):
    require(which in PROFILES,'UNKNOWN_PROFILE')
    result=PROFILES[which]()
    print('PASS_POSTLIVE_L4_CURRENT_'+which.upper())
    print(json.dumps(result,sort_keys=True,ensure_ascii=False))
    return 0
