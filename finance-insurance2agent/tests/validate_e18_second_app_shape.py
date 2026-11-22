#!/usr/bin/env python3
"""E18 review-only exact second-app pin and schema; no legal/anonymity clearance.
The expected SHA is a reviewed external binding, not recomputed from target data.
"""
import hashlib,json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
B=ROOT/'finanztransparenz/data/pillar_b_public.json'
EXPECTED='4dc5a2ed5cfb7eeec6981dbd90fdf4ebf2996cc1c5ebfb97ce1320c41936a702'
FIRST_SHA='16333b3a1a89525bfd12a74fc9baf9417df2ca557e910a132bdbc469f3b38c20'
ALLOWED={'PILLAR_B_ESRS_HIGHEST_PAID_TO_MEDIAN','PILLAR_B_EMPLOYEE_AVG_FTE_SECTION162_EUR'}

def need(x,msg):
 if not x:raise RuntimeError(msg)
def verify():
 data=B.read_bytes()
 need(hashlib.sha256(data).hexdigest()==EXPECTED,'SECOND_APP_SHA_DRIFT')
 f=(ROOT/'finance-insurance2agent/data/public_snapshot.js').read_bytes()
 need(hashlib.sha256(f).hexdigest()==FIRST_SHA,'FIRST_APP_SHA_DRIFT')
 s=json.loads(data)
 need({k:len(s[k]) for k in ['observations','lineage','person_context','pay_ratio_extension','comparability_assessments','metric_definitions','comparability_profiles']}==
  {'observations':15,'lineage':0,'person_context':0,'pay_ratio_extension':4,'comparability_assessments':2,'metric_definitions':2,'comparability_profiles':4},'SECOND_COUNTS')
 need({x['metric_id'] for x in s['observations']}==ALLOWED,'SECOND_UNEXPECTED_ACTIVE_METRIC')
 need({x['metric_id'] for x in s['metric_definitions']}==ALLOWED,'SECOND_UNUSED_PERSON_METRIC_DEFINITION')
 ids={x['observation_id'] for x in s['observations']}
 need(len(ids)==15,'DUPLICATE_OBSERVATION_ID')
 profiles={x['comparability_profile_id'] for x in s['comparability_profiles']}
 referenced={x['comparability_profile_id'] for x in s['observations'] if x.get('comparability_profile_id')}
 need(profiles==referenced and len(profiles)==4,'SECOND_UNREFERENCED_PROFILE')
 need(all(x['observation_id'] in ids and x.get('highest_paid_is_ceo') is not True for x in s['pay_ratio_extension']),'SECOND_PAY_EXT_INVALID')
 need(all(x['observation_a'] in ids and x['observation_b'] in ids for x in s['comparability_assessments']),'SECOND_COMPARABILITY_DANGLING')
 need(s.get('contains_personal_data') is True and s.get('personal_data_review_required') is True,'FALSE_ANONYMITY_CLAIM')
 need(s.get('e18_e04_projection_review',{}).get('legal_release_authorized') is False,'MISSING_NO_GO')
 # Unknown newly added fields in observations must not pass silently.
 schema={
  'assertion_level','comparability_profile_id','currency','entity_id','evidence_level',
  'method_version','metric_id','numeric_value','observation_id','reference_date',
  'restatement_version','source_datapoint','source_dimensions','source_document_id',
  'source_page','source_raw_value','source_table','unit'}
 for i,rec in enumerate(s['observations']):
  need(set(rec)==schema,'SECOND_OBSERVATION_SCHEMA_DRIFT_'+str(i))
 print('E18_APP2_EXACT_PIN_AND_SHAPE_OK_NOT_A_RELEASE')
if __name__=='__main__':
 try:verify()
 except Exception as e:
  print('E18_HOLD:'+str(e),file=sys.stderr);sys.exit(2)
