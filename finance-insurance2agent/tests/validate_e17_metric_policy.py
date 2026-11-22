#!/usr/bin/env python3
"""E17 current-scope active metric allowlist (frozen on pinned E04 source HEAD).

This is a fail-closed code-and-count gate for BOTH apps, not a GDPR determination
and not a substitute for human review of re-identification via derived data.
A subsequent RC1.8 candidate must NOT silently rewrite this policy; it needs
separate owner approval and new independent assessment.
"""
from __future__ import annotations
from pathlib import Path
from collections import Counter
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2]
APP=ROOT/'finance-insurance2agent'
FIRST=APP/'data/public_snapshot.js'
SECOND=ROOT/'finanztransparenz/data/pillar_b_public.json'
POLICY=APP/'tests/E17_ACTIVE_METRIC_POLICY.json'
PREFIX=b'window.FI2A_PUBLIC_SNAPSHOT='

def require(ok,code):
 if not ok:raise RuntimeError(code)

def check(first,second,p):
 require(isinstance(p,dict) and p.get('schema')=='E17_LOCKED_CURRENT_ACTIVE_METRICS_V1','POLICY_SCHEMA')
 require(p.get('locked_source_head')=='1f0bf3712a74b06ebba7442cd925be146c5a53ad','POLICY_BASE')
 a=Counter(x['metric_code'] for x in first['observations'])
 b=Counter(x['metric_id'] for x in second['observations'])
 require(dict(a)==p['active_app1_metric_counts'],'FIRST_ACTIVE_METRIC_INVENTORY_DRIFT')
 require(dict(b)==p['active_app2_metric_counts'],'SECOND_ACTIVE_METRIC_INVENTORY_DRIFT')
 require(sum(a.values())==7807 and sum(b.values())==15,'APP_METRIC_TOTALS')
 forbidden=set(p['explicitly_forbidden_person_metric_codes'])
 require(len(forbidden)==5,'FORBIDDEN_METRIC_LIST_CHANGED')
 require(not (set(a)|set(b))&forbidden,'FORBIDDEN_PERSON_METRIC_ACTIVE')
 require(second.get('person_context')==[],'PERSON_CONTEXT_REINTRODUCED')
 require(second.get('suppressions',[None])[0].get('metric_id')=='PERSON_METRIC_WITHHELD_E17','SUPPRESSION_METRIC_NOT_NEUTRAL')
 require(all(x.get('highest_paid_is_ceo') is not True for x in second['pay_ratio_extension']),'DIRECT_CEO_LINK_IN_PAY_RATIO')
 return True

def main():
 raw=FIRST.read_bytes();require(raw.startswith(PREFIX) and raw.endswith(b';\n'),'FIRST_WRAPPER')
 p=json.loads(POLICY.read_text(encoding='utf-8'))
 require(hashlib.sha256(raw).hexdigest()==p['public_projection_sha256'],'FIRST_SHA')
 first=json.loads(raw[len(PREFIX):-2]);second=json.loads(SECOND.read_text(encoding='utf-8'))
 check(first,second,p)
 print('E17_ACTIVE_METRIC_POLICY_OK_REVIEW_ONLY_NO_LEGAL_GO')
if __name__=='__main__':
 try:main()
 except Exception as e:
  print('E17_METRIC_POLICY_HOLD:'+str(e),file=sys.stderr);sys.exit(2)
