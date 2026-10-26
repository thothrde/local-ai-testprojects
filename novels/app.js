const D=window.LT_DATA,C=window.LT_CATEGORIES,R=window.LT_ROUTES;
let lang=/^de\b/i.test(navigator.language||'')?'de':'en',activeCat='all',activeRole='all',lastFocus=null,currentItem=null,currentRoute=null,lastSurprise=null;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const roles={all:{de:'Alle Rollen',en:'All roles'},signature:{de:'Signatur',en:'Signature'},cluster:{de:'Cluster',en:'Cluster'},bridge:{de:'Brücke',en:'Bridge'},context:{de:'Kontext',en:'Context'}};
const fieldNotes={
thought:{de:'Romane und Grenztexte, in denen Denken selbst zur literarischen Bewegung wird.',en:'Novels and border texts in which thinking itself becomes a literary movement.'},
form:{de:'Bücher, die Sprache, Seite, Stimme oder Erzählregel zum Material machen.',en:'Books that turn language, page, voice, or narrative rule into material.'},
archive:{de:'Bibliotheken, Kommentare, Enzyklopädien und Bücher, die über Bücher nachdenken.',en:'Libraries, commentary, encyclopedias, and books that think about books.'},
sideways:{de:'Eigensinnige Nebenlinien jenseits der bequemsten Literaturgeschichten.',en:'Idiosyncratic side roads beyond the most familiar literary histories.'},
strange:{de:'Phantastik, Traum und Unwirklichkeit ohne feste Genregrenze.',en:'The fantastic, dream, and unreality without a fixed genre border.'},
east:{de:'Eine dichte mittel- und osteuropäische Zone aus Moderne, Groteske und Spekulation.',en:'A dense Central and Eastern European zone of modernism, grotesque, and speculation.'},
grotesque:{de:'Komik dort, wo Weltordnung, Körper oder Vernunft aus dem Takt geraten.',en:'Comedy where world order, bodies, or reason slip out of joint.'},
sf:{de:'Spekulative Literatur als Erkenntnisform — nicht bloß als Zukunftskulisse.',en:'Speculative literature as a mode of inquiry—not merely a futuristic setting.'},
void:{de:'Verlust von Welt, Gesellschaft oder Selbst und das, was danach übrig bleibt.',en:'Loss of world, society, or self—and what remains afterwards.'},
history:{de:'Vergangenheit nicht als Kulisse, sondern als fremde, widerständige Lebenswelt.',en:'The past not as scenery but as a strange and resistant lived world.'},
fragment:{de:'Essay, Notat, Splitter und Bücher, die sich dem geschlossenen Roman entziehen.',en:'Essay, note, fragment, and books that resist the closed form of the novel.'},
modern:{de:'Große moderne Projekte als Bezugspunkte, nicht als Pflichtkanon.',en:'Major modernist projects as reference points, not obligatory canon.'},
outlier:{de:'Bücher, die selbst in dieser Karte nur schwer Nachbarn finden.',en:'Books that struggle to find neighbours even within this map.'}};
const routeNotes=[
{de:'Vom Buch als Gegenstand zum Buch als Denkmaschine: zehn Stationen über Archive, Kommentare, Listen und erfundene Dokumente.',en:'From the book as object to the book as thinking machine: ten stations through archives, commentary, lists, and invented documents.'},
{de:'Spekulation aus Mittel- und Osteuropa: Groteske, Wissenschaft, Imperium und Zukunft kippen ineinander.',en:'Speculation from Central and Eastern Europe: grotesque, science, empire, and futurity tip into one another.'},
{de:'Wenn Form selbst zum Ereignis wird: Stimme, Typographie, Montage und Regel verändern, was ein Buch sein kann.',en:'When form becomes the event: voice, typography, montage, and rule change what a book can be.'},
{de:'Eine Seitenmoderne der Eigensinnigen: Autoren, die sich nur widerwillig in die üblichen Literaturgeschichten fügen.',en:'An idiosyncratic side-modernism: writers who fit only reluctantly into familiar literary histories.'}
];
const foldMap={'ß':'ss','ẞ':'ss','ø':'o','Ø':'o','ł':'l','Ł':'l','æ':'ae','Æ':'ae','œ':'oe','Œ':'oe'};
const norm=s=>(s||'').replace(/[ßẞøØłŁæÆœŒ]/g,ch=>foldMap[ch]||ch).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const asciiGerman=s=>(s||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue');
const searchNorms=s=>[norm(s),norm(asciiGerman(s))];
const searchMatch=(haystack,query)=>{const hs=searchNorms(haystack),qs=searchNorms(query);return qs.some(q=>hs.some(h=>h.includes(q)))};
$('#count').textContent=D.length;$('#catCount').textContent=Object.keys(C).length;
function roleLabel(r){return (roles[r]||roles.cluster)[lang]}
function visibleItems(){let q=$('#search').value.trim();return D.filter(x=>(activeCat==='all'||x.cats.includes(activeCat))&&(activeRole==='all'||x.role===activeRole)&&(!q||searchMatch([x.author,x.works,x.de,x.en,...(x.aliases||[]),...x.cats.map(k=>C[k].de+' '+C[k].en)].join(' '),q)))}
function setLang(){
 document.documentElement.lang=lang;
 document.title=lang==='de'?'Literarische Topographie · Private Leselandschaft':'Literary Topography · A private landscape of reading';
 document.querySelector('meta[name="description"]').content=lang==='de'?'Eine bilinguale, kuratierte literarische Topographie einer Privatbibliothek: Seitenwege, Grenzgebiete, Signaturen und Kontexte.':'A bilingual editorial topography of a private literary library: side roads, borderlands, signatures, and contexts.';
 $$('[data-de]').forEach(el=>el.textContent=el.dataset[lang]);
 $$('[data-aria-de]').forEach(el=>el.setAttribute('aria-label',el.dataset[lang==='de'?'ariaDe':'ariaEn']));
 $('#lang').textContent=lang==='de'?'EN':'DE';$('#lang').setAttribute('aria-label',lang==='de'?'Sprache zu Englisch wechseln':'Switch language to German');
 $('#search').placeholder=$('#search').dataset[lang==='de'?'placeholderDe':'placeholderEn'];
 $('#roleFilters').setAttribute('aria-label',lang==='de'?'Positionsfilter':'Editorial role filters');
 $$('.close').forEach(b=>b.setAttribute('aria-label',lang==='de'?'Schließen':'Close'));
 renderAll();
 if($('#modal').open&&currentItem)renderModal(currentItem);
}
function renderRoutes(){const by=new Map(D.map((x,i)=>[x.author,{x,i}]));$('#routes').innerHTML=R.map((r,ri)=>`<article class="route"><div><h3>${r[lang]}</h3><small>${lang==='de'?'Leseweg '+(ri+1):'Reading route '+(ri+1)}</small><p class="route-note">${routeNotes[ri][lang]}</p></div><div class="route-line">${r.authors.map((author,j)=>{let q=by.get(author);return q?`${j?'<span class="route-arrow" aria-hidden="true">→</span>':''}<button class="route-node" data-i="${q.i}" data-route="${ri}" data-pos="${j}">${author}</button>`:''}).join('')}</div></article>`).join('');$$('.route-node').forEach(b=>b.onclick=()=>{currentRoute={ri:+b.dataset.route,pos:+b.dataset.pos};openItem(D[+b.dataset.i],b,true)})}
function renderCats(){let counts={};D.forEach(x=>x.cats.forEach(k=>counts[k]=(counts[k]||0)+1));$('#catGrid').innerHTML=Object.entries(C).map(([k,v],i)=>`<button class="cat ${activeCat===k?'active':''}" data-cat="${k}" aria-pressed="${activeCat===k}"><span class="topline"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="count">${counts[k]||0} ${lang==='de'?'Positionen':'entries'}</span></span><h3>${v[lang]}</h3><p>${fieldNotes[k][lang]}</p><span class="action">${activeCat===k?(lang==='de'?'Auswahl aufheben ×':'Clear selection ×'):(lang==='de'?'Dieses Feld erkunden →':'Explore this field →')}</span></button>`).join('');
 $$('.cat').forEach(b=>b.onclick=()=>{const key=b.dataset.cat;activeCat=activeCat===key?'all':key;renderAll();const fresh=document.querySelector(`.cat[data-cat="${key}"]`);if(fresh)fresh.focus();if(activeCat!=='all'){const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;$('#explore').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});setTimeout(()=>$('#exploreTitle').focus({preventScroll:true}),reduce?0:450)}})}
function renderRoles(){const q=$('#search').value.trim();const base=D.filter(x=>(activeCat==='all'||x.cats.includes(activeCat))&&(!q||searchMatch([x.author,x.works,x.de,x.en,...(x.aliases||[]),...x.cats.map(k=>C[k].de+' '+C[k].en)].join(' '),q)));const counts={all:base.length};['signature','cluster','bridge','context'].forEach(k=>counts[k]=base.filter(x=>x.role===k).length);if(activeRole!=='all'&&counts[activeRole]===0)activeRole='all';$('#roleFilters').innerHTML=Object.entries(roles).map(([k,v])=>`<button class="filter ${activeRole===k?'active':''}" data-role="${k}" aria-pressed="${activeRole===k}" ${counts[k]===0?'disabled':''}>${v[lang]} <span class="filter-count">${counts[k]}</span></button>`).join('');$$('.filter:not([disabled])').forEach(b=>b.onclick=()=>{activeRole=b.dataset.role;renderAll();const fresh=document.querySelector(`.filter[data-role="${activeRole}"]`);if(fresh)fresh.focus()})}
function reset(focus=true){activeCat='all';activeRole='all';$('#search').value='';renderAll();if(focus)$('#search').focus()}
function renderCards(){const arr=visibleItems();$('#resultInfo').textContent=`${arr.length} ${lang==='de'?'Positionen sichtbar':'entries visible'}`;
 const sb=$('#selectionBar');sb.hidden=activeCat==='all';if(activeCat!=='all')$('#selectionText').innerHTML=`${lang==='de'?'Aktives Feld:':'Active field:'} <strong>${C[activeCat][lang]}</strong>`;
 $('#empty').hidden=arr.length!==0;$('#cards').hidden=arr.length===0;$('#cards').innerHTML=arr.map(x=>{let i=D.indexOf(x);return `<button class="card" data-i="${i}" aria-label="${x.author}: ${x.works}"><span class="role">${roleLabel(x.role)}</span><span class="card-title">${x.author}</span><span class="works">${x.works}</span><span class="preview">${x[lang]}</span><div class="tags">${x.cats.map(k=>`<span class="tag">${C[k][lang]}</span>`).join('')}</div></button>`}).join('');$$('.card').forEach(b=>b.onclick=()=>openItem(D[+b.dataset.i],b))}
function renderAll(){renderRoutes();renderCats();renderRoles();renderCards();if($('#topographySelect'))renderTopography(+$('#topographySelect').value||0)}
function stableHash(s){let h=2166136261;for(const ch of s){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0}return h}
function buildRelated(){const usage=new Map(D.map(x=>[x,0])),map=new Map();D.forEach(x=>{const candidates=D.filter(y=>y!==x).map(y=>({y,shared:y.cats.filter(k=>x.cats.includes(k))})).filter(z=>z.shared.length).sort((a,b)=>b.shared.length-a.shared.length||(usage.get(a.y)-usage.get(b.y))||stableHash(x.author+'|'+a.y.author)-stableHash(x.author+'|'+b.y.author));const picks=candidates.slice(0,4);picks.forEach(z=>usage.set(z.y,usage.get(z.y)+1));map.set(x,picks)});return map}

function routeLinksFor(x,y){
 const links=[];
 R.forEach((r,ri)=>{const a=r.authors.indexOf(x.author),b=r.authors.indexOf(y.author);if(a>=0&&b>=0){const distance=Math.abs(a-b);links.push({ri,distance})}});
 return links;
}
function topologyCandidates(x){
 return D.filter(y=>y!==x).map(y=>{
  const shared=y.cats.filter(k=>x.cats.includes(k));
  const routes=routeLinksFor(x,y);
  const adjacent=routes.some(r=>r.distance===1);
  const sameRoute=routes.length>0;
  const connected=shared.length>0||sameRoute;
  const score=connected?(shared.length*10+(adjacent?9:sameRoute?4:0)+(y.role==='signature'?1:0)):0;
  return {y,shared,routes,adjacent,sameRoute,score};
 }).filter(z=>z.score>0).sort((a,b)=>b.score-a.score||stableHash(x.author+'|'+a.y.author)-stableHash(x.author+'|'+b.y.author)).slice(0,6);
}
function topologyReason(z){
 const bits=[];
 if(z.shared.length)bits.push((lang==='de'?'gemeinsame Felder: ':'shared fields: ')+z.shared.map(k=>C[k][lang]).join(' · '));
 if(z.adjacent)bits.push(lang==='de'?'direkt benachbart in einem redaktionellen Leseweg':'adjacent on an editorial reading route');
 else if(z.sameRoute)bits.push(lang==='de'?'im selben redaktionellen Leseweg':'on the same editorial reading route');
 return bits.join(' · ');
}
function topologyWorkLabel(x){const v=x.works_label;return v&&typeof v==='object'?(v[lang]||v.de||v.en||x.works):x.works}
function renderTopography(index){
 const select=$('#topographySelect'); if(!select)return;
 select.innerHTML=D.map((x,i)=>`<option value="${i}">${x.author} — ${topologyWorkLabel(x)}</option>`).join('')
 const i=Math.max(0,Math.min(D.length-1,index==null?+select.value:index));select.value=String(i);const x=D[i],rel=topologyCandidates(x);
 const positions=[[50,50],[18,18],[50,12],[82,18],[84,72],[50,88],[16,72]];
 let svg=`<svg viewBox="0 0 100 100" role="img" aria-labelledby="topologySvgTitle topologySvgDesc"><title id="topologySvgTitle">${x.author}</title><desc id="topologySvgDesc">${lang==='de'?'Redaktionelle Nachbarschaften von ':'Editorial neighbourhoods of '}${x.author}</desc>`;
 rel.forEach((z,j)=>{const p=positions[j+1];svg+=`<line x1="50" y1="50" x2="${p[0]}" y2="${p[1]}" class="topo-edge ${z.adjacent?'route-edge':''}"/>`});
 svg+=`<g class="topo-focus" tabindex="0" role="button" data-topo-open="${i}"><circle cx="50" cy="50" r="10"/><text x="50" y="48">${x.author}</text><text class="topo-work" x="50" y="54">${topologyWorkLabel(x).length>30?topologyWorkLabel(x).slice(0,28)+'…':topologyWorkLabel(x)}</text></g>`;
 rel.forEach((z,j)=>{const p=positions[j+1],yi=p[1];svg+=`<g class="topo-node" tabindex="0" role="button" data-topo-select="${D.indexOf(z.y)}"><circle cx="${p[0]}" cy="${yi}" r="7"/><text x="${p[0]}" y="${yi+1}">${z.y.author}</text></g>`});
 svg+='</svg>';
 const reasons=rel.map(z=>`<button class="topo-reason" data-topo-select="${D.indexOf(z.y)}"><strong>${z.y.author}</strong><span>${topologyReason(z)}</span></button>`).join('');
 $('#topographyMap').innerHTML=svg+`<div class="topography-reasons">${reasons}</div>`;
 $('#topographyNote').textContent=lang==='de'?`${x.author}: ${rel.length} redaktionelle Nachbarn. Die Auswahl wird aus Feldüberschneidungen und den vier bewusst gesetzten Lesewegen gebildet; sie behauptet weder Einfluss noch objektive Ähnlichkeit.`:`${x.author}: ${rel.length} editorial neighbours. The selection is formed from overlapping fields and the four deliberately composed reading routes; it claims neither influence nor objective similarity.`;
 $$('[data-topo-select]').forEach(el=>{const go=()=>renderTopography(+el.dataset.topoSelect);el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});
 $$('[data-topo-open]').forEach(el=>{const go=()=>openItem(D[+el.dataset.topoOpen],el);el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});
}
function initTopography(){const s=$('#topographySelect');if(!s)return;s.innerHTML=D.map((x,i)=>`<option value="${i}">${x.author} — ${topologyWorkLabel(x)}</option>`).join('');s.value='0';s.onchange=()=>renderTopography(+s.value);$('#topographySurprise').onclick=()=>{let i=Math.floor(Math.random()*D.length);if(D.length>1&&i===+s.value)i=(i+1)%D.length;renderTopography(i)};renderTopography(0)}

const RELATED=buildRelated();
function relatedFor(x){return RELATED.get(x)||[]}
function renderModal(x,focusTitle=false){currentItem=x;const rel=relatedFor(x);let routeBlock='';if(currentRoute){const r=R[currentRoute.ri],pos=currentRoute.pos,prev=pos>0?r.authors[pos-1]:null,next=pos<r.authors.length-1?r.authors[pos+1]:null;routeBlock=`<div class="route-context"><span>${lang==='de'?'Leseweg':'Reading route'} ${currentRoute.ri+1} · ${lang==='de'?'Station':'station'} ${pos+1}/${r.authors.length}</span><strong>${r[lang]}</strong><div>${prev?`<button data-route-step="-1">← ${prev}</button>`:''}${next?`<button data-route-step="1">${next} →</button>`:''}<button data-route-exit>${lang==='de'?'Weg verlassen':'Leave route'}</button></div></div>`}$('#modalBody').innerHTML=`<div class="modal-content">${routeBlock}<div class="modal-tags">${x.cats.map(k=>`<span class="tag">${C[k][lang]}</span>`).join('')}</div><h2 id="modalTitle" tabindex="-1">${x.author}</h2><h3>${x.works}</h3><p>${x[lang]}</p><div class="modal-meta">${roleLabel(x.role)} · ${lang==='de'?'Redaktionelle Einordnung innerhalb dieser Bibliothek; keine Rangliste und kein Lektürenachweis.':'Editorial position within this library; neither a ranking nor a claim of reading status.'}</div>${rel.length?`<div class="related"><h4>${lang==='de'?'Von hier weiterwandern':'Wander on from here'}</h4><div class="related-list">${rel.map(z=>`<button data-related="${D.indexOf(z.y)}">${z.y.author}<small>${lang==='de'?'teilt':'shares'}: ${z.shared.map(k=>C[k][lang]).join(' · ')}</small></button>`).join('')}</div></div>`:''}</div>`;$$('[data-related]').forEach(b=>b.onclick=()=>{currentRoute=null;renderModal(D[+b.dataset.related],true)});$$('[data-route-step]').forEach(b=>b.onclick=()=>{currentRoute.pos+=+b.dataset.routeStep;const author=R[currentRoute.ri].authors[currentRoute.pos];renderModal(D.find(y=>y.author===author),true)});const exit=$('[data-route-exit]');if(exit)exit.onclick=()=>{currentRoute=null;renderModal(x,true)};if(focusTitle){$('#modal').scrollTop=0;$('#modalTitle').focus()}}
function openItem(x,source,keepRoute=false){lastFocus=source||document.activeElement;if(!keepRoute)currentRoute=null;renderModal(x);if(!$('#modal').open)$('#modal').showModal();$('#modal .close').focus()}
function closeDialog(d){d.close();if(d.id==='modal')currentItem=null;if(lastFocus&&document.contains(lastFocus))lastFocus.focus()}
function surprise(global=false){let arr=global?D:visibleItems();if(!arr.length)arr=D;if(arr.length>1&&lastSurprise)arr=arr.filter(x=>x!==lastSurprise);const x=arr[Math.floor(Math.random()*arr.length)];lastSurprise=x;openItem(x,document.activeElement)}
$('#lang').onclick=()=>{lang=lang==='de'?'en':'de';setLang()};
$('#search').oninput=()=>{renderRoles();renderCards()};$('#reset').onclick=()=>reset();$('#emptyReset').onclick=()=>reset();$('#clearCategory').onclick=()=>{activeCat='all';renderAll();$('#search').focus()};
$('#surprise').onclick=()=>surprise(false);$('#surpriseHero').onclick=()=>surprise(true);
$$('[data-hero-cat]').forEach(b=>b.onclick=()=>{activeCat=b.dataset.heroCat;activeRole='all';renderAll();const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;$('#explore').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});setTimeout(()=>$('#exploreTitle').focus({preventScroll:true}),reduce?0:450)});
$('#aboutBtn').onclick=e=>{lastFocus=e.currentTarget;$('#about').showModal();$('#about .close').focus()};
$$('.close').forEach(b=>b.onclick=()=>closeDialog(b.closest('dialog')));
$$('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d)closeDialog(d)});d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d)})});
initTopography();
setLang();