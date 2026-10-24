#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,re
ROOT=Path(__file__).resolve().parents[1]
EXPECTED_SNAPSHOT="d4c269c61c929f3e36d2ba3d11e051c96257e41384f4d4246f868fa2fb0afd13"
EXPECTED_APP="0685b9dd032da92c724e8b2e54b37847de4ba67e54bb33105ad89edea84b627b"
EXPECTED_INDEX="1308030a8ac7a3740f1b41800dc7118873f03231d6a39d5fb2eaafde8a55d4f6"
EXPECTED_STYLES="767593151cd8b107e0f7378c437ec73f8b02c501c254f970e77528ef32c8b794"
EXPECTED_V2A="9adbebd412cd87328292f5443ec34ec6c79563dcf8ef9aeef0e5d13d94212762"
EXPECTED_COUNTS={"COMPARABLE":30637,"COMPARABLE_WITH_CAVEATS":2921,"NOT_DETERMINABLE":1127,"NOT_COMPARABLE":116}
EXPECTED_PAIRS=34801
def sh(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 assert sh(ROOT/'data/public_snapshot.js')==EXPECTED_SNAPSHOT
 assert sh(ROOT/'app.js')==EXPECTED_APP
 assert sh(ROOT/'index.html')==EXPECTED_INDEX
 assert sh(ROOT/'styles.css')==EXPECTED_STYLES
 assert sh(ROOT/'v2a_explainer.js')==EXPECTED_V2A
 app=(ROOT/'app.js').read_text(encoding='utf-8');idx=(ROOT/'index.html').read_text(encoding='utf-8');v2=(ROOT/'v2a_explainer.js').read_text(encoding='utf-8');ver=(ROOT/'versionen.html').read_text(encoding='utf-8')
 assert "V2B_G2_G3_SEMANTIC_HARDENING_RELEASE_CANDIDATE_V1_20261024" in app
 assert all(x in idx for x in ['styles.css?v=20261023-v2a-guided-research-v1','v2a_explainer.js?v=20261024-v2b-g2-g3-v1','app.js?v=20261024-v2b-g2-g3-v1'])
 assert idx.index('v2a_explainer.js?v=20261024-v2b-g2-g3-v1')<idx.index('app.js?v=20261024-v2b-g2-g3-v1')
 assert 'id="compareResult" class="result" aria-live="polite"' in idx
 assert all(x in app for x in ['Nicht bestimmbar aus den verfügbaren Daten','Cannot be determined from the available data','v2aEvidenceAxis','v2aStatsSafe','getV2AExplainer','v2aExplainerHtml'])
 assert all(x in v2 for x in ['V2A_SPEC_V0_2_1','unitPolicyOf','Object.prototype.hasOwnProperty.call(UNIT_POLICY,u)','UNKNOWN_UNIT_UNGOVERNED','CURRENCY_REQUIRED_BUT_UNKNOWN','REFERENCE_DATE_DIFF_UNGOVERNED','CONSOLIDATION_SCOPE_COMPATIBILITY_UNKNOWN','PERIOD_TYPE_COMPATIBILITY_UNKNOWN','VARIANT_KEY_COMPATIBILITY_UNKNOWN'])
 assert '/api/' not in v2 and 'fetch(' not in v2 and 'XMLHttpRequest' not in v2 and 'localStorage' not in v2 and 'sessionStorage' not in v2
 assert 'data-v2a-release="20261023"' in ver and '34.801' in ver and '34,801' in ver
 ident=json.loads((ROOT/'PUBLIC_BUILD_IDENTITY.json').read_text(encoding='utf-8'));ev=json.loads((ROOT/'PUBLIC_CAPABILITY_EVIDENCE.json').read_text(encoding='utf-8'));val=json.loads((ROOT/'VALIDATION_REPORT.json').read_text(encoding='utf-8'))
 for o in [ident,ev,val]:
  b=o.get('v2a_guided_research_20261023');assert isinstance(b,dict)
  assert b.get('spec_version')=='0.2.1' and b.get('pair_count')==EXPECTED_PAIRS and b.get('verdict_counts')==EXPECTED_COUNTS
  assert b.get('canonical_data_unchanged') is True and b.get('public_snapshot_unchanged') is True
 assert ev['capability_contract']['COMPARE_PAIR']['test_ids'].count('PUBLIC_V2A_GUIDED_COMPARISON_EXPLAINER')==1
 print('PASS_PUBLIC_V2A_GUIDED_EXPLAINER_STANDING_TEST')
 print(json.dumps({'pairs':EXPECTED_PAIRS,'verdict_counts':EXPECTED_COUNTS},sort_keys=True))
 return 0
if __name__=='__main__':
 try:raise SystemExit(main())
 except AssertionError as e:
  print('FAIL_PUBLIC_V2A_GUIDED_EXPLAINER:',e);raise SystemExit(2)
