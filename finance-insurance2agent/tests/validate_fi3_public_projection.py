#!/usr/bin/env python3
"""L4 current successor: preserves relevant historical semantic tests; all conditions execute under python -O.
Original historical bytes are archived outside the public candidate in HISTORICAL_TEST_ORIGINALS."""
from pathlib import Path
import hashlib, json
ROOT = Path(__file__).resolve().parents[1]
EXPECTED_PROJECTION = 'fc19a136a40cf97fe2b22d975567fda9e8ac663ea2086398fce0aca2cea7b30b'
EXPECTED_IDENTITY = '2da1a2669fd683f73706be761b59ce0cd2c6d94e8fc14ed77555ed23b37d17b7'
EXPECTED_SNAPSHOT = 'f80830bea1dbae4818521ff1770ffc17b8bb7d649af3d8e1bc86af4862835157'
EXPECTED_ROBOTS = 'fe9c8cfcbb5fc083d6e8dbfcc6423b068787321a82fc8052a928709164d6219d'
REVIEW = 'CANDIDATE_REVIEW_REQUIRED'
HOLD = 'HOLD_INSUFFICIENT_IDENTITY_EVIDENCE'
REJECT = 'REJECTED_DIFFERENT_ENTITY'
CONFIRMED = 'CONFIRMED_SAME_LEGAL_ENTITY_ROLE'
REJECT_REASONS = {'BROAD_QUERY_HIT_WITH_MATERIALLY_DIFFERENT_LEGAL_NAME': 38, 'INDEPENDENT_AUDIT_RECONCILIATION': 5}

def sh(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1024 * 1024), b''):
            h.update(b)
    return h.hexdigest()

def load_projection():
    p = ROOT / 'data/fi3_public_projection.js'
    if not sh(p) == EXPECTED_PROJECTION:
        raise AssertionError((sh(p), EXPECTED_PROJECTION))
    t = p.read_text('utf-8')
    prefix = 'window.FI2A_FI3_PUBLIC_PROJECTION='
    if not t.startswith(prefix):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    raw = t[len(prefix):].strip()
    if raw.endswith(';'):
        raw = raw[:-1]
    return json.loads(raw)

def walk_keys(o):
    if isinstance(o, dict):
        for k, v in o.items():
            yield k
            yield from walk_keys(v)
    elif isinstance(o, list):
        for x in o:
            yield from walk_keys(x)

def main():
    p = load_projection()
    ident = json.loads((ROOT / 'FI3_PUBLIC_BUILD_IDENTITY.json').read_text('utf-8'))
    if not sh(ROOT / 'FI3_PUBLIC_BUILD_IDENTITY.json') == EXPECTED_IDENTITY:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not sh(ROOT / 'data/public_snapshot.js') == EXPECTED_SNAPSHOT:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not sh(ROOT / 'robots.txt') == EXPECTED_ROBOTS:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta']['epistemic_class'] == 'CANDIDATE_EVIDENCE_ONLY':
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta']['counts']['identity_audited_total'] == 85:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta']['counts']['role_audited_total'] == 175:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta']['counts']['identity_detail_published'] == 42:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta']['counts']['role_detail_published'] == 129:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['reject_summary']['identity_count'] == 43:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['reject_summary']['role_count'] == 46:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['reject_summary']['reason_classes'] == REJECT_REASONS:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    ids = p['identity_candidates']
    roles = p['role_assertions']
    hold_roles = [r for r in roles if r.get('decision_status') == HOLD]
    review_roles = [r for r in roles if r.get('decision_status') == REVIEW]
    if not (len(hold_roles) == 81 and len(review_roles) == 48):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not all((r.get('amount_text') is None for r in hold_roles)):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not all((r.get('currency') is None for r in hold_roles)):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not all((r.get('amount_publication') == 'WITHHELD_IDENTITY_HOLD_PUBLIC' for r in hold_roles)):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not all(('amount_publication' not in r for r in review_roles)):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta'].get('hold_amount_public_policy') == 'PUBLIC_HOLD_AMOUNT_WITHHELD_IDENTITY_INSUFFICIENT':
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta'].get('hold_amount_withheld_role_count') == 81:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta'].get('hold_amount_exact_values_public') == 'NO':
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not p['meta'].get('hold_amount_exact_values_local_audit') == 'YES':
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not (len(ids) == 42 and len(roles) == 129 and (len(p['seed_entities']) == 32)):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not all((x['decision_status'] in {REVIEW, HOLD} for x in ids + roles)):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not not any((x['decision_status'] in {REJECT, CONFIRMED} for x in ids + roles)):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not all((x['candidate_notice_de'] == 'Kandidat – nicht bestätigt' and x['candidate_notice_en'] == 'Candidate – not confirmed' for x in ids + roles)):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    banned = {'origin_record_json', 'independent_audit_json', 'source_identifiers_json', 'source_locators_json', 'strong_identifier_matches_json', 'name_metrics_json', 'source_record_key'}
    if not not set(walk_keys(p)) & banned:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    raw = json.dumps(p, ensure_ascii=False)
    app = (ROOT / 'app.js').read_text('utf-8')
    if not '/api/fi3' not in app:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'fi3AmountWithheld' in app:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'WITHHELD_IDENTITY_HOLD_PUBLIC' in app:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not ('function fi3ContextHtml' in app and "$('#fi3Context')" in app):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'fi3_public_projection.js' in (ROOT / 'index.html').read_text('utf-8'):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    compare_seg = app.split('async function runCompare', 1)[1].split('function svgSeries', 1)[0]
    discover_seg = app.split('function runDiscover', 1)[1].split('function graphHtml', 1)[0]
    if not ('fi3Context' not in compare_seg and 'FI2A_FI3_PUBLIC_PROJECTION' not in compare_seg):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not ('fi3Context' not in discover_seg and 'FI2A_FI3_PUBLIC_PROJECTION' not in discover_seg):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    scope = (ROOT / 'presentation_i18n.js').read_text('utf-8')
    if not 'a tightly bounded candidate extract on EU projects and funding from FTS, CORDIS, and Kohesio (internal FI3 layer)' in scope:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'einen eng begrenzten Kandidatenauszug zu EU-Projekten und Förderungen aus FTS, CORDIS und Kohesio (interne Schicht FI3)' in scope:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'REVIEW/HOLD explicitly marks unconfirmed candidates; REJECT is shown only in aggregate' in scope:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'REVIEW/HOLD kennzeichnet dort ausdrücklich unbestätigte Kandidaten; REJECT wird nur aggregiert gezeigt' in scope:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'static FI1/FI2 and EBA/P3DH context extract' in scope:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'statischen FI1/FI2- und EBA/P3DH-Kontextauszug' in scope:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'Confirmed funding edges, Integrity Signals, and analysis of natural persons' in scope:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not 'Bestätigte Förderverbindungen (Funding Edges), Integritätssignale und die Analyse natürlicher Personen' in scope:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not ident['epistemic_class'] == 'CANDIDATE_EVIDENCE_ONLY':
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not ident['confirmed_identity_candidates'] == 0:
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not (ident['funding_edges'] == 0 and ident['integrity_signals'] == 0):
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    if not ident['natural_person_layer'] == 'OFF':
        raise AssertionError('CONTRACT_CONDITION_FAILED')
    print('PASS_FI3_PUBLIC_STATIC_PROJECTION_STANDING_TEST')
    print(json.dumps({'identity_detail': len(ids), 'role_detail': len(roles), 'seed_entities': len(p['seed_entities']), 'reject_identity': p['reject_summary']['identity_count']}, sort_keys=True))
if __name__ == '__main__':
    main()
