#!/usr/bin/env python3
"""E17 strict pinned current-candidate data and manifest checks (no asserts).

Not a full replacement of the six historical Standing tests; NOT release GO.
The companion e17_privacy_guard is hash-independent.
"""
import hashlib,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
APP=ROOT/'finance-insurance2agent'
TARGET='16333b3a1a89525bfd12a74fc9baf9417df2ca557e910a132bdbc469f3b38c20'

def check(ok,msg):
 if not ok:raise RuntimeError(msg)

def hashbytes(b):return hashlib.sha256(b).hexdigest()
def main():
 b=(APP/'data/public_snapshot.js').read_bytes()
 check(hashbytes(b)==TARGET and len(b)==14826682,'FIRST_SNAPSHOT_HASH_OR_SIZE')
 p=b'window.FI2A_PUBLIC_SNAPSHOT='
 check(b.startswith(p) and b.endswith(b';\n'),'FIRST_WRAPPER')
 d=json.loads(b[len(p):-2])
 check([len(d['observations']),len(d['lineage']),len(d['sources']),len(d['metrics']),len(d['entities'])]==[7807,3723,279,118,144],'FIRST_COUNTS')
 check(d['meta']['counts']['observations']==7807,'FIRST_META_COUNT')
 s=json.loads((ROOT/'finanztransparenz/data/pillar_b_public.json').read_text())
 check([len(s['observations']),len(s['person_context']),len(s['pay_ratio_extension']),len(s['comparability_assessments']),len(s['lineage'])]==[15,0,4,2,0],'SECOND_COUNTS')
 check(s.get('e17_e04_projection_review',{}).get('status')=='REVIEW_NONAPPLIED_NOT_RELEASED','SECOND_REVIEW_MARKER')
 for name in ('PUBLIC_BUILD_IDENTITY.json','PUBLIC_CAPABILITY_EVIDENCE.json','VALIDATION_REPORT.json'):
  check((APP/name).is_file(),'MISSING_'+name)
 ident=json.loads((APP/'PUBLIC_BUILD_IDENTITY.json').read_text())
 evidence=json.loads((APP/'PUBLIC_CAPABILITY_EVIDENCE.json').read_text())
 validation=json.loads((APP/'VALIDATION_REPORT.json').read_text())
 check(validation['counts']['observations']==7807,'VALIDATION_COUNT')
 check(validation['public_snapshot_sha256']==TARGET,'VALIDATION_SNAPSHOT_SHA')
 check(evidence['public_snapshot_sha256']==TARGET,'EVIDENCE_SNAPSHOT_SHA')
 check(ident.get('e17_e04_minimization_review',{}).get('db_sha256_scope')=='HISTORICAL_CANONICAL_NOT_MINIMIZED_PUBLIC_DERIVATIVE','DB_PROVENANCE_SCOPE')
 check(ident.get('current_capability_evidence_sha256')==hashbytes((APP/'PUBLIC_CAPABILITY_EVIDENCE.json').read_bytes()),'EVIDENCE_CHAIN')
 check(ident.get('current_validation_report_sha256')==hashbytes((APP/'VALIDATION_REPORT.json').read_bytes()),'VALIDATION_CHAIN')
 lines=(APP/'MANIFEST_SHA256.txt').read_text().splitlines();seen=set()
 for line in lines:
  h,sep,rel=line.partition('  ')
  check(bool(sep) and bool(re.fullmatch(r'[0-9a-f]{64}',h)),'MANIFEST_FORMAT')
  check(rel not in seen,'MANIFEST_DUPLICATE');seen.add(rel)
  dest=APP/rel
  check(dest.is_file() and hashbytes(dest.read_bytes())==h,'MANIFEST_HASH')
 check({'tests/validate_e17_privacy_guard.py','tests/validate_e17_current_integrity.py','tests/validate_e17_metric_policy.py','tests/E17_ACTIVE_METRIC_POLICY.json'}.issubset(seen),'MANIFEST_NEW_TEST_MISSING')
 check(ident.get('current_release_gate')=='NO_GO_E17_NONAPPLIED_REVIEW_ONLY','IDENTITY_GATE_NOT_NO_GO')
 check(validation.get('current_release_gate')=='NO_GO_E17_NONAPPLIED_REVIEW_ONLY','VALIDATION_GATE_NOT_NO_GO')
 check('public_release_gate' not in ident and 'public_release_gate' not in validation,'AMBIGUOUS_OLD_RELEASE_GATE')
 check('historic_public_release_gate_20261023' in ident and 'historic_public_release_gate_20261023' in validation,'LOST_HISTORIC_GATE')
 v=(APP/'versionen.html').read_text()
 check(TARGET in v and '7.807' in v and '7,807' in v,'VERSIONEN_CURRENT_STATUS')
 print('E17_CURRENT_INTEGRITY_OK_NOT_RELEASE_CLEARANCE')
if __name__=='__main__':
 try:main()
 except Exception as ex:
  print('E17_INTEGRITY_HOLD:'+str(ex).split(':')[0],file=sys.stderr);sys.exit(2)
