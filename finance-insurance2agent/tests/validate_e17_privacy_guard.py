#!/usr/bin/env python3
"""E17 semantic, hash-INDEPENDENT guard for two public projections.

A current-data screening test, NOT a legal anonymity determination. Designed
never to use assert and to work with python -O. Tests observations and all
nonhistoric, nondefinition collections for unknown/relabelled personal metric
IDs; refuses non-empty person-context and event-/amount-coded suppressions.
"""
from __future__ import annotations
import json,re,sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
CODES={
 'PILLAR_B_CEO_COMP_GCGC_TOTAL_EXCL_FRINGE_PENSION_EUR',
 'PILLAR_B_CEO_COMP_GCGC_TOTAL_INCL_FRINGE_PENSION_EUR',
 'PILLAR_B_CEO_COMP_SECTION162_PAID_OR_OWED_EUR',
 'PILLAR_B_CEO_TO_AVERAGE_FTE_SECTION162',
 'PILLAR_B_EXECUTIVE_COMP_SECTION162_GRANTED_AND_OWED_EUR',
}
# Intentionally broad semantic heuristic: unknown remuneration IDs require review.
RULES=[re.compile(p,re.I) for p in (
 r'CEO[^A-Z0-9]*(?:COMP|PAY|REMUN|EARN|SALARY|BONUS|TOTAL|FTE|RATIO)',
 r'EXECUTIVE[^A-Z0-9]*(?:COMP|PAY|REMUN|EARN|SALARY|BONUS)',
 r'(?:CEO|EXECUTIVE).*SECTION_?162',
 r'PERSON(?:AL)?[_-]?(?:COMP|PAY|REMUN)',
 r'PILLAR_B_CEO_TO_AVERAGE_FTE',
)]
# Specific publicly aggregated measures retained (not person amounts):
ALLOWED_AGG={'PILLAR_B_EMPLOYEE_AVG_FTE_SECTION162_EUR','PILLAR_B_ESRS_HIGHEST_PAID_TO_MEDIAN'}
EXEMPT_TOPLEVEL_FIRST={'metrics','sources','coverage_contracts','meta'}
EXEMPT_TOPLEVEL_SECOND={'metric_definitions','source_documents','comparability_profiles','legal_profile','e17_e04_projection_review'}

def demand(ok, code):
 if not ok:raise RuntimeError(code)

def is_person_metric(value):
 if not isinstance(value,str):return False
 if value in ALLOWED_AGG:return False
 return value in CODES or any(x.search(value) for x in RULES)

def scan(node, where='root'):
 if isinstance(node,dict):
  for k,v in node.items():
   if k in ('metric_code','metric_id','metric_key','metric_name','metric_identifier'):
    demand(not is_person_metric(v),'PERSON_METRIC_IN_CURRENT_RECORD:'+where)
   if k=='person_context' and isinstance(v,list):
    demand(not v,'PERSON_CONTEXT_REINTRODUCED:'+where)
   scan(v,where+'/'+k)
 elif isinstance(node,list):
  for i,v in enumerate(node):scan(v,where+'/'+str(i))

def verify(first,second):
 demand(isinstance(first,dict) and isinstance(second,dict),'NOT_JSON_OBJECT')
 for k,v in first.items():
  if k not in EXEMPT_TOPLEVEL_FIRST:scan(v,'first/'+k)
 demand(not second.get('person_context'),'SECOND_PERSON_CONTEXT_REINTRODUCED')
 for k,v in second.items():
  if k not in EXEMPT_TOPLEVEL_SECOND:scan(v,'second/'+k)
 ids1={x['id'] for x in first['observations']}
 demand(len(ids1)==len(first['observations']),'FIRST_DUPLICATE_IDS')
 demand(all(x['derived_observation_id'] in ids1 and x['input_observation_id'] in ids1 for x in first['lineage']),'FIRST_DANGLING_EDGE')
 ids2={x['observation_id'] for x in second['observations']}
 demand(len(ids2)==len(second['observations']),'SECOND_DUPLICATE_IDS')
 for k in ('person_context','pay_ratio_extension'):
  demand(all(x['observation_id'] in ids2 for x in second[k]),'SECOND_ORPHAN_'+k)
 for x in second['lineage']:
  demand(x['derived_observation_id'] in ids2 and x['input_observation_id'] in ids2,'SECOND_DANGLING_EDGE')
 for x in second['comparability_assessments']:
  demand(x['observation_a'] in ids2 and x['observation_b'] in ids2,'SECOND_DANGLING_COMPARABILITY')
 suppressions=second.get('suppressions',[])
 demand(len(suppressions)==1,'SECOND_SUPPRESSION_COUNT_CHANGED')
 for x in suppressions:
  demand(x.get('reason_codes')==['PERSON_METRIC_WITHHELD_E17'],'SECOND_UNREDACTED_REASON_CODE')
 demand(second.get('contains_personal_data') is True,'FALSE_CLAIM_PERSONAL_DATA_CLEARED')
 demand(second.get('personal_data_review_required') is True,'FALSE_CLAIM_REVIEW_FINISHED')
 return True

def main():
 b=(ROOT/'finance-insurance2agent/data/public_snapshot.js').read_bytes()
 p=b'window.FI2A_PUBLIC_SNAPSHOT='
 demand(b.startswith(p) and b.endswith(b';\n'),'FIRST_WRAPPER')
 first=json.loads(b[len(p):-2]);second=json.loads((ROOT/'finanztransparenz/data/pillar_b_public.json').read_text())
 verify(first,second)
 print('E17_SEMANTIC_GUARD_OK_NOT_RELEASE_CLEARANCE')

if __name__=='__main__':
 try:main()
 except Exception as ex:
  print('E17_GUARD_HOLD:'+str(ex).split(':')[0],file=sys.stderr)
  sys.exit(2)
