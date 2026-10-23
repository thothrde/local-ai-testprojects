const D=window.LT_DATA,C=window.LT_CATEGORIES,R=window.LT_ROUTES;
let lang=/^de\b/i.test(navigator.language||'')?'de':'en',activeCat='all',activeRole='all',lastFocus=null,currentItem=null;
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
const foldMap={'ß':'ss','ẞ':'ss','ø':'o','Ø':'o','ł':'l','Ł':'l','æ':'ae','Æ':'ae','œ':'oe','Œ':'oe'};
const norm=s=>(s||'').replace(/[ßẞøØłŁæÆœŒ]/g,ch=>foldMap[ch]||ch).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const asciiGerman=s=>(s||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue');
const searchNorms=s=>[norm(s),norm(asciiGerman(s))];
const searchMatch=(haystack,query)=>{const hs=searchNorms(haystack),qs=searchNorms(query);return qs.some(q=>hs.some(h=>h.includes(q)))};
$('#count').textContent=D.length;$('#catCount').textContent=Object.keys(C).length;
function roleLabel(r){return (roles[r]||roles.cluster)[lang]}
function visibleItems(){let q=$('#search').value.trim();return D.filter(x=>(activeCat==='all'||x.cats.includes(activeCat))&&(activeRole==='all'||x.role===activeRole)&&(!q||searchMatch([x.author,x.works,x.de,x.en,...x.cats.map(k=>C[k].de+' '+C[k].en)].join(' '),q)))}
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
function renderRoutes(){const by=new Map(D.map((x,i)=>[x.author,{x,i}]));$('#routes').innerHTML=R.map((r,ri)=>`<article class="route"><div><h3>${r[lang]}</h3><small>${lang==='de'?'Leseweg '+(ri+1):'Reading route '+(ri+1)}</small></div><div class="route-line">${r.authors.map((a,j)=>{let q=by.get(a);return q?`${j?'<span class="route-arrow" aria-hidden="true">→</span>':''}<button class="route-node" data-i="${q.i}">${a}</button>`:''}).join('')}</div></article>`).join('');$$('.route-node').forEach(b=>b.onclick=()=>openItem(D[+b.dataset.i],b))}
function renderCats(){let counts={};D.forEach(x=>x.cats.forEach(k=>counts[k]=(counts[k]||0)+1));$('#catGrid').innerHTML=Object.entries(C).map(([k,v],i)=>`<button class="cat ${activeCat===k?'active':''}" data-cat="${k}" aria-pressed="${activeCat===k}"><span class="topline"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="count">${counts[k]||0} ${lang==='de'?'Positionen':'entries'}</span></span><h3>${v[lang]}</h3><p>${fieldNotes[k][lang]}</p><span class="action">${activeCat===k?(lang==='de'?'Auswahl aufheben ×':'Clear selection ×'):(lang==='de'?'Dieses Feld erkunden →':'Explore this field →')}</span></button>`).join('');
 $$('.cat').forEach(b=>b.onclick=()=>{const key=b.dataset.cat;activeCat=activeCat===key?'all':key;renderAll();const fresh=document.querySelector(`.cat[data-cat="${key}"]`);if(fresh)fresh.focus();if(activeCat!=='all')$('#explore').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})})}
function renderRoles(){$('#roleFilters').innerHTML=Object.entries(roles).map(([k,v])=>`<button class="filter ${activeRole===k?'active':''}" data-role="${k}" aria-pressed="${activeRole===k}">${v[lang]}</button>`).join('');$$('.filter').forEach(b=>b.onclick=()=>{const key=b.dataset.role;activeRole=key;renderAll();const fresh=document.querySelector(`.filter[data-role="${key}"]`);if(fresh)fresh.focus()})}
function reset(focus=true){activeCat='all';activeRole='all';$('#search').value='';renderAll();if(focus)$('#search').focus()}
function renderCards(){const arr=visibleItems();$('#resultInfo').textContent=`${arr.length} ${lang==='de'?'Positionen sichtbar':'entries visible'}`;
 const sb=$('#selectionBar');sb.hidden=activeCat==='all';if(activeCat!=='all')$('#selectionText').innerHTML=`${lang==='de'?'Aktives Feld:':'Active field:'} <strong>${C[activeCat][lang]}</strong>`;
 $('#empty').hidden=arr.length!==0;$('#cards').hidden=arr.length===0;$('#cards').innerHTML=arr.map(x=>{let i=D.indexOf(x);return `<button class="card" data-i="${i}" aria-label="${x.author}: ${x.works}"><span class="role">${roleLabel(x.role)}</span><h3>${x.author}</h3><div class="works">${x.works}</div><div class="tags">${x.cats.map(k=>`<span class="tag">${C[k][lang]}</span>`).join('')}</div></button>`}).join('');$$('.card').forEach(b=>b.onclick=()=>openItem(D[+b.dataset.i],b))}
function renderAll(){renderRoutes();renderCats();renderRoles();renderCards()}
function relatedFor(x){return D.filter(y=>y!==x).map(y=>({y,score:y.cats.filter(k=>x.cats.includes(k)).length})).filter(z=>z.score>0).sort((a,b)=>b.score-a.score||a.y.author.localeCompare(b.y.author)).slice(0,4).map(z=>z.y)}
function renderModal(x){currentItem=x;const rel=relatedFor(x);$('#modalBody').innerHTML=`<div class="modal-content"><div class="modal-tags">${x.cats.map(k=>`<span class="tag">${C[k][lang]}</span>`).join('')}</div><h2 id="modalTitle">${x.author}</h2><h3>${x.works}</h3><p>${x[lang]}</p><div class="modal-meta">${roleLabel(x.role)} · ${lang==='de'?'Redaktionelle Einordnung innerhalb dieser Bibliothek; keine Rangliste und kein Lektürenachweis.':'Editorial position within this library; neither a ranking nor a claim of reading status.'}</div>${rel.length?`<div class="related"><h4>${lang==='de'?'Von hier weiterwandern':'Wander on from here'}</h4><div class="related-list">${rel.map(y=>`<button data-related="${D.indexOf(y)}">${y.author}</button>`).join('')}</div></div>`:''}</div>`;$$('[data-related]').forEach(b=>b.onclick=()=>renderModal(D[+b.dataset.related]))}
function openItem(x,source){lastFocus=source||document.activeElement;renderModal(x);if(!$('#modal').open)$('#modal').showModal();$('#modal .close').focus()}
function closeDialog(d){d.close();if(d.id==='modal')currentItem=null;if(lastFocus&&document.contains(lastFocus))lastFocus.focus()}
function surprise(){let arr=visibleItems();if(!arr.length)arr=D;const x=arr[Math.floor(Math.random()*arr.length)];openItem(x,document.activeElement)}
$('#lang').onclick=()=>{lang=lang==='de'?'en':'de';setLang()};
$('#search').oninput=renderCards;$('#reset').onclick=()=>reset();$('#emptyReset').onclick=()=>reset();$('#clearCategory').onclick=()=>{activeCat='all';renderAll();$('#search').focus()};
$('#surprise').onclick=surprise;$('#surpriseHero').onclick=surprise;
$('#aboutBtn').onclick=e=>{lastFocus=e.currentTarget;$('#about').showModal();$('#about .close').focus()};
$$('.close').forEach(b=>b.onclick=()=>closeDialog(b.closest('dialog')));
$$('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d)closeDialog(d)});d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d)})});
setLang();