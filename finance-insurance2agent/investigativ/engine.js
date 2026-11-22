/* FI2A investigative lab, strictly deterministic, no fetch, no external calls */
(function(root,factory){const x=factory();if(typeof module==='object'&&module.exports)module.exports=x;else root.FI2ALab=x;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function parseSnapshot(text){if(typeof text!=='string'||text.length>32000000)throw Error('Ungültige Dateigröße');let s=text.trim();const prefix='window.FI2A_PUBLIC_SNAPSHOT=';if(s.startsWith(prefix)){s=s.slice(prefix.length).replace(/;\s*$/,'')}else if(!s.startsWith('{'))throw Error('Nur JSON oder der bekannte FI2A-Snapshot akzeptiert');const d=JSON.parse(s);if(!Array.isArray(d.observations)||!Array.isArray(d.entities)||!Array.isArray(d.metrics)||!Array.isArray(d.sources))throw Error('Unvollständiger Snapshot');return d;}
const sensitive=x=>/CEO|PERSON|REMUNERAT|COMPENSATION|VERGUET|VERGÜT|PAY_RATIO|SALARY|SEVERANCE|FTE|EMPLOYEE_AVERAGE|INDIVIDUAL/i.test(String(x||''));
const n=x=>typeof x==='number'&&Number.isFinite(x)?x:typeof x==='string'&&x.trim()!==''&&Number.isFinite(Number(x))?Number(x):null;
function structural(d){const m=new Map(d.metrics.map(x=>[x.code,x]));const e=new Map(d.entities.map(x=>[x.id,x]));const s=new Map(d.sources.map(x=>[x.id,x]));const rows=d.observations.filter(o=>o&&o.entity_id&&o.metric_code&&e.has(o.entity_id)&&m.has(o.metric_code)).map(o=>({o,e:e.get(o.entity_id),m:m.get(o.metric_code),source:s.get(o.source_id)||null}));return {rows,m,e,s};}
function allowed(r){return !sensitive(r.o.metric_code)&&!sensitive(r.m.name)&&!sensitive(r.m.definition);}
function semkey(o){const s=o.semantic||{};return [s.semantic_fingerprint||'',s.consolidation_scope||o.consolidation_scope||'',s.unit||o.unit||'',s.currency||o.currency||'',s.reporting_framework||''].join('|')}
function audit(d){const t=structural(d),filtered=t.rows.filter(allowed),missing=t.rows.length-filtered.length;const all=d.sources||[];const tokenSources=all.filter(s=>/([?&]|%3[fF]|&amp;)token\s*(=|%3[dD])/i.test(String(s.url||'')));return {entities:d.entities.length,metrics:d.metrics.length,observations:d.observations.length,sources:d.sources.length,lineage:(d.lineage||[]).length,validRows:t.rows.length,excludedSensitive:missing,permittedRows:filtered.length,tokenSources:tokenSources.length,sourceRightsOpen:all.filter(s=>s.raw_redistribution_allowed!==1).length};}
function listEntities(d,q){const t=structural(d),v=String(q||'').toLocaleLowerCase('de');return [...t.e.values()].filter(e=>String(e.legal_name||'').toLocaleLowerCase('de').includes(v)).sort((a,b)=>String(a.legal_name).localeCompare(String(b.legal_name))).slice(0,100)}
function listMetrics(d,entityId){const t=structural(d),codes=new Set(t.rows.filter(r=>r.o.entity_id===entityId&&allowed(r)).map(r=>r.o.metric_code));return [...codes].map(code=>t.m.get(code)).sort((a,b)=>String(a.name||a.code).localeCompare(String(b.name||b.code)))}
function inspect(d,entityId,metricCode){const t=structural(d);const rs=t.rows.filter(r=>r.o.entity_id===entityId&&r.o.metric_code===metricCode&&allowed(r));const clusters=new Map();for(const r of rs){const k=semkey(r.o);if(!clusters.has(k))clusters.set(k,[]);clusters.get(k).push(r);}return [...clusters].map(([key,rows])=>({key,rows:rows.sort((a,b)=>String(a.o.reference_date||a.o.period_end||'').localeCompare(String(b.o.reference_date||b.o.period_end||'')))})).sort((a,b)=>b.rows.length-a.rows.length)}
function pairwise(rows){let result=[];for(let i=1;i<rows.length;i++){const a=rows[i-1].o,b=rows[i].o,va=n(a.numeric_value_real),vb=n(b.numeric_value_real),ad=a.reference_date||a.period_end||'',bd=b.reference_date||b.period_end||'';let flags=[];if(!ad||!bd||ad===bd)flags.push('UNRESOLVED_PERIOD');if(a.reporting_status!==b.reporting_status)flags.push('REPORTING_STATUS_CHANGED');if(a.restatement_version!==b.restatement_version)flags.push('RESTATEMENT_CHANGED');if(a.assertion_level!==b.assertion_level)flags.push('ASSERTION_CHANGED');if(a.method_version!==b.method_version)flags.push('METHOD_VERSION_CHANGED');if((a.semantic||{}).semantic_fingerprint!==(b.semantic||{}).semantic_fingerprint)flags.push('SEMANTIC_PROFILE_CHANGED');if(va===null||vb===null)flags.push('NON_NUMERIC');result.push({a,b,delta:va!==null&&vb!==null&&flags.length===0?vb-va:null,relative:va!==null&&vb!==null&&va!==0&&flags.length===0?(vb-va)/Math.abs(va):null,flags,status:flags.length?'HOLD':'CALCULABLE_NOT_ATTESTED'});}return result}
function provenance(d,obs){const s=new Map(d.sources.map(x=>[x.id,x]));const matches=(d.lineage||[]).filter(l=>l.derived_observation_id===obs.id||l.input_observation_id===obs.id).slice(0,75);return {primary:s.get(obs.source_id)||null,edges:matches,claim:'Eine Quellverknüpfung ist keine eigenständige Quellenrechte- oder Methodenfreigabe.'};}
function comparisons(d,entityId,metricCode){return (d.time_series_decisions||[]).filter(x=>x.entity_id===entityId&&x.metric_code===metricCode).map(x=>({id:x.id,status:x.comparability_status,period_a:x.period_a,period_b:x.period_b,reasons:x.reasons_json,authorization:x.transformation_contract_json}));}

/* E28: exact, source-grounded, non-inferential inventory tools */
function scope(d,entityId,metricCode){const t=structural(d);return t.rows.filter(r=>r.o.entity_id===entityId&&r.o.metric_code===metricCode&&allowed(r));}
function sourceCoverage(d,entityId,metricCode){let rows=scope(d,entityId,metricCode),by=new Map();for(let r of rows){let x=by.get(r.o.source_id)||{source_id:r.o.source_id,publisher:r.source?.publisher||'UNRESOLVED_SOURCE',title:r.source?.title||'',count:0,years:new Set(),links_restricted:!r.source?.url,rights_hold:r.source?.raw_redistribution_allowed!==1};x.count++;let date=r.o.reference_date||r.o.period_end||'';if(date)x.years.add(String(date).slice(0,4));by.set(r.o.source_id,x)}return [...by.values()].map(x=>({...x,years:[...x.years].sort().join(', ')})).sort((a,b)=>b.count-a.count||a.source_id.localeCompare(b.source_id))}
function cohort(d,metricCode,date,entityId){let t=structural(d),ref=t.rows.find(r=>r.o.entity_id===entityId&&r.o.metric_code===metricCode&&allowed(r)&&String(r.o.reference_date||r.o.period_end)===String(date));if(!ref)return {status:'NO_REFERENCE',rows:[]};let key=semkey(ref.o), matching=t.rows.filter(r=>allowed(r)&&r.o.metric_code===metricCode&&String(r.o.reference_date||r.o.period_end)===String(date)&&semkey(r.o)===key);let unique=new Map();for(let r of matching){let a=unique.get(r.o.entity_id)||[];a.push(r);unique.set(r.o.entity_id,a)}let rows=[...unique].map(([id,rs])=>({id,name:t.e.get(id)?.legal_name||id,count:rs.length,values:rs.map(x=>x.o.numeric_value_real),source_ids:[...new Set(rs.map(x=>x.o.source_id))],status:rs.length===1?'SOURCE_FACT_UNCOMPARED':'AMBIGUOUS_MULTIPLE_ROWS'})).sort((a,b)=>a.name.localeCompare(b.name));return {status:'COHORT_EVIDENCE_ONLY_NO_RANKING',semantic_key:key,reference_date:date,rows,unique_records:rows.filter(x=>x.count===1).length,has_duplicates:rows.some(x=>x.count!==1)}}
function candidateStatus(d,entityId,metricCode){let all=(d.investigation_candidates||[]).filter(x=>x.entity_id===entityId&&x.metric_code===metricCode);return all.map(x=>({id:x.candidate_id,status:x.status,question:x.question||'',type:x.candidate_type,source_id:x.primary_source_id||null,notice:'EXPLORATORY_ONLY is not confirmed evidence'}));}
function discoveryGate(d,entityId,metricCode){let rows=scope(d,entityId,metricCode);let blocked=rows.filter(x=>x.o.allowed_for_discovery_mode!==1);return {status:rows.length&&blocked.length===0?'DATA_FLAG_ONLY_METHOD_GATE_STILL_REQUIRED':'HOLD_NOT_AUTHORIZED',evidence_count:rows.length,blocked_count:blocked.length,computed_outliers:0,notice:'No automated hypothesis scoring without separate methodological authorization'};}

/* E30: evidence dossiers and explicit gates. Not discovery/scoring. */
function evidenceDossier(d,entityId,metricCode,date){
  const t=structural(d),rs=scope(d,entityId,metricCode).filter(r=>String(r.o.reference_date||r.o.period_end||'')===String(date));
  const items=rs.map(r=>{
    const o=r.o,source=r.source||null;
    return {observation_id:o.id,entity_id:o.entity_id,metric_code:o.metric_code,date:o.reference_date||o.period_end||'',value:o.numeric_value_real,unit:o.unit||r.m.unit||'',currency:o.currency||'',source_id:o.source_id,source_title:source?.title||'',publisher:source?.publisher||'',source_location:o.source_locator||o.source_page||'',evidence_level:o.evidence_level||'',assertion_level:o.assertion_level||'',method_version:o.method_version||'',reporting_status:o.reporting_status||'',epistemic_class:o.epistemic_class||'',semantic_key:semkey(o),discovery_allowed:o.allowed_for_discovery_mode===1,raw_redistribution_allowed:source?.raw_redistribution_allowed===1,lineage:provenance(d,o).edges.map(e=>({id:e.id,input_observation_id:e.input_observation_id,derived_observation_id:e.derived_observation_id,input_role:e.input_role}))};
  });
  return {status:items.length?'SOURCE_RECORDS_NO_INFERRED_COMPARABILITY':'NO_PUBLIC_RECORDS',count:items.length,ambiguous:items.length>1,items,warning:'Belegakte: Quellenbindung und vorhandene Evidenz; keine Rechtefreigabe, keine juristische oder statistische Einzelfallentscheidung.'};
}
function semanticCoverage(d,metricCode,date){
  const t=structural(d),groups=new Map();
  for(const r of t.rows){if(!allowed(r)||r.o.metric_code!==metricCode||String(r.o.reference_date||r.o.period_end||'')!==String(date))continue;
    const key=semkey(r.o);let x=groups.get(key);if(!x){x={key,entities:new Set(),records:0,sources:new Set(),ambiguities:0};groups.set(key,x)}x.entities.add(r.o.entity_id);x.sources.add(r.o.source_id);x.records++;}
  const result=[...groups.values()].map(x=>({semantic_key:x.key,entities:x.entities.size,records:x.records,sources:x.sources.size,warning:x.key.startsWith('|')?'MISSING_SEMANTIC_FINGERPRINT':'NO_AUTOMATIC_COMPARABILITY'}));
  return {status:'INVENTORY_ONLY',groups:result.sort((a,b)=>b.records-a.records),unverified:result.filter(x=>x.warning==='MISSING_SEMANTIC_FINGERPRINT').length};
}
function linkedRelations(d,entityId){const em=new Map(d.entities.map(e=>[e.id,e]));const src=new Map(d.sources.map(s=>[s.id,s]));return (d.relations||[]).filter(x=>x.subject_entity_id===entityId||x.object_entity_id===entityId).map(x=>({relation_type:x.relation_type,from:em.get(x.subject_entity_id)?.legal_name||x.subject_entity_id,to:em.get(x.object_entity_id)?.legal_name||x.object_entity_id,status:x.status||'',source_id:x.source_id,source_publisher:src.get(x.source_id)?.publisher||'',evidence_level:x.evidence_level||''}));}
function lineageIntegrity(d){const obs=new Set(d.observations.map(x=>x.id));let missing=0,valid=0;for(const edge of d.lineage||[]){if(!obs.has(edge.derived_observation_id)||!obs.has(edge.input_observation_id))missing++;else valid++;}return {total:(d.lineage||[]).length,valid,missing,status:missing===0?'REFERENCES_PRESENT_NOT_RECALCULATED':'HOLD_MISSING_OBSERVATIONS'};}


/* E31 – auditable evidence multiplicity and coverage gaps.
 * This is an INVENTORY, never a contradiction verdict or approved discovery. */
function multiplicityAudit(d,entityId,metricCode){
 const rows=scope(d,entityId,metricCode), groups=new Map();
 for(const r of rows){const date=String(r.o.reference_date||r.o.period_end||'');const key=[date,semkey(r.o)].join(' :: ');
   if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
 let result=[];for(const [key,rs] of groups){if(rs.length<2)continue;
   let nums=rs.map(x=>n(x.o.numeric_value_real)), unique=new Set(nums.map(x=>String(x)));
   const statuses=[...new Set(rs.map(x=>String(x.o.reporting_status||'UNSPECIFIED')))];
   const roles=[...new Set(rs.map(x=>String(x.o.view_role||x.o.component_role||'UNSPECIFIED')))];
   const sourceIds=[...new Set(rs.map(x=>x.o.source_id).filter(Boolean))];
   const nonnumeric=nums.some(x=>x===null);
   result.push({date:String(rs[0].o.reference_date||rs[0].o.period_end||''),semantic_key:semkey(rs[0].o),record_count:rs.length,source_count:sourceIds.length,source_ids:sourceIds,role_count:roles.length,reporting_status_count:statuses.length,numeric_variants:unique.size,status:nonnumeric?'HOLD_NON_NUMERIC':unique.size>1?'REVIEW_MULTIPLE_VALUES_NO_CONTRADICTION_ATTESTED':'MULTIPLE_RECORDS_SAME_VALUE',notice:'Gleiche Semantik-/Datumsgruppe ist keine hinreichende Identität der Berichtsansicht oder Messgröße.'});
 }
 return {status:'CANDIDATE_INVENTORY_ONLY',total_groups:groups.size,multiple_groups:result.length,items:result.sort((a,b)=>b.record_count-a.record_count||a.date.localeCompare(b.date)).slice(0,250)};
}
function temporalCoverage(d,entityId,metricCode){
 const rows=scope(d,entityId,metricCode), years=new Map(), undated=[];
 for(const r of rows){let raw=String(r.o.reference_date||r.o.period_end||'');const y=/^(\d{4})/.exec(raw);
  if(!y){undated.push(r.o.id);continue}if(!years.has(y[1]))years.set(y[1],{year:y[1],records:0,sources:new Set(),semantic:new Set(),dates:new Set()});
  const x=years.get(y[1]);x.records++;x.sources.add(r.o.source_id);x.semantic.add(semkey(r.o));x.dates.add(raw);
 }
 const list=[...years.values()].sort((a,b)=>Number(a.year)-Number(b.year)).map(x=>({year:x.year,records:x.records,sources:x.sources.size,semantic_variants:x.semantic.size,distinct_dates:x.dates.size}));
 let gaps=[];for(let i=1;i<list.length;i++){let a=Number(list[i-1].year),b=Number(list[i].year);if(b>a+1&&b-a<=100)gaps.push({after:a,before:b,missing_years:b-a-1,reason:'NO_OBSERVATION_IN_SELECTED_SCOPE_NOT_A_PROOF_OF_NON_REPORTING'});}
 return {status:'OBSERVED_COVERAGE_ONLY',year_rows:list,apparent_gaps:gaps,undated_count:undated.length,notice:'Beobachtungslücken sind keine gesicherten Publikationslücken. Dokument-, Scope- und Methodenwechsel separat prüfen.'};
}

return {multiplicityAudit,temporalCoverage,parseSnapshot,structural,allowed,audit,listEntities,listMetrics,inspect,pairwise,provenance,comparisons,sensitive,semkey,scope,sourceCoverage,cohort,candidateStatus,discoveryGate,evidenceDossier,semanticCoverage,linkedRelations,lineageIntegrity};

});
