#!/usr/bin/env python3
"""Standing public capability-contract validator.

Fail-closed properties:
- PUBLIC_BUILD_IDENTITY capability codes must equal the explicit contract set.
- Every public_static_supported=1 capability must have >=1 PASS evidence test.
- Every referenced test id must exist and PASS.
- Reviewed public-copy/build bytes are SHA-256 bound; an unreviewed free-text claim
  or route/UI change therefore fails until the contract evidence is deliberately
  regenerated.
- The identity file must bind the exact capability-evidence bytes.

This is a repository test, not an independent audit.
"""
from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[1]

def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def fail(msg):
    raise AssertionError(msg)

def main():
    identity=json.loads((ROOT/'PUBLIC_BUILD_IDENTITY.json').read_text(encoding='utf-8'))
    evidence_path=ROOT/'PUBLIC_CAPABILITY_EVIDENCE.json'
    evidence=json.loads(evidence_path.read_text(encoding='utf-8'))
    rem=identity.get('postaudit_r2_scope_remediation',{})
    expected_evidence_hash=rem.get('capability_evidence_sha256')
    actual_evidence_hash=sha256(evidence_path)
    if expected_evidence_hash!=actual_evidence_hash:
        fail(f'identity/evidence hash mismatch: {expected_evidence_hash} != {actual_evidence_hash}')

    caps=identity.get('implemented_capabilities',[])
    by_code={c.get('code'):c for c in caps}
    if None in by_code or len(by_code)!=len(caps):
        fail('capability codes must be non-null and unique')
    contract=evidence.get('capability_contract',{})
    if set(contract)!=set(by_code):
        fail('unknown/missing capability code(s): identity and capability_contract sets differ')

    tests=evidence.get('tests',[])
    by_test={t.get('id'):t for t in tests}
    if None in by_test or len(by_test)!=len(tests):
        fail('test ids must be non-null and unique')
    for tid,t in by_test.items():
        if t.get('result')!='PASS':
            fail(f'evidence test not PASS: {tid}')

    for code,cap in by_code.items():
        spec=contract[code]
        if int(bool(spec.get('public_static_supported'))) != int(bool(cap.get('public_static_supported'))):
            fail(f'public_static_supported mismatch for {code}')
        test_ids=spec.get('test_ids',[])
        if cap.get('public_static_supported') and not test_ids:
            fail(f'public capability has no bound test: {code}')
        for tid in test_ids:
            if tid not in by_test:
                fail(f'contract references unknown test {tid} for {code}')
            if by_test[tid].get('result')!='PASS':
                fail(f'contract test not PASS {tid} for {code}')

    # Byte-bound reviewed build/copy. This specifically makes a free-text claim
    # mutation fail unless evidence is intentionally regenerated and reviewed.
    for rel,expected in evidence.get('bound_public_bytes',{}).items():
        p=ROOT/rel
        if not p.is_file(): fail(f'bound public file missing: {rel}')
        actual=sha256(p)
        if actual!=expected: fail(f'bound public byte drift: {rel}: {actual} != {expected}')
    for rel,expected in evidence.get('copy_contract_sha256',{}).items():
        p=ROOT/rel
        if not p.is_file(): fail(f'copy-contract file missing: {rel}')
        actual=sha256(p)
        if actual!=expected: fail(f'unreviewed public-copy drift: {rel}: {actual} != {expected}')

    print('PASS_PUBLIC_CAPABILITY_CONTRACT_STANDING_REPO_TEST')
    print(f'capabilities={len(by_code)} tests={len(by_test)} public_supported={sum(1 for c in caps if c.get("public_static_supported"))}')
    return 0

if __name__=='__main__':
    try: raise SystemExit(main())
    except AssertionError as e:
        print('FAIL_PUBLIC_CAPABILITY_CONTRACT:',e)
        raise SystemExit(2)
