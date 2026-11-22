#!/usr/bin/env python3
"""Current L4 public_data_release successor. The historical original is separately archived."""
from pathlib import Path
import runpy,sys
try:
    module=runpy.run_path(str(Path(__file__).with_name('current_l4_contract.py')),run_name='fi2a_l4_contract_module')
    raise SystemExit(module['run']('public_data_release'))
except Exception as ex:
    print('HOLD_POSTLIVE_L4_PUBLIC_DATA_RELEASE: '+str(ex),file=sys.stderr)
    raise SystemExit(2)
