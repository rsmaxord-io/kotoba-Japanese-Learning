/* One decorative intro per document, plus non-blocking, progressively enhanced card motion. */
(()=>{'use strict';
const app=document.getElementById('app');if(!app)return;
const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)');
const selector='.course-choice,.lesson-link,.home-section-link';
const seen=new WeakSet(),watched=new Set(),timers=new Map();
let intersection=null,introPlayed=false,introHost=null,introTitle=null,introLayer=null,introTimer=null;
const reduced=()=>reduce?.matches===true;
function endIntro(){if(introTimer!==null)clearTimeout(introTimer);introTimer=null;introLayer?.remove();introTitle?.classList.remove('course-title-pop');introHost?.classList.remove('course-motion-host');introHost=introTitle=introLayer=null;}
function intro(){
 if(introPlayed)return;
 const title=app.querySelector('h1'),host=title?.closest('header,.heading-row');if(!title||!host)return;
 introPlayed=true;if(reduced())return;
 introHost=host;introTitle=title;const layer=document.createElement('div');introLayer=layer;
 layer.className='course-intro-fx';layer.setAttribute('aria-hidden','true');layer.inert=true;
 const box=host.getBoundingClientRect(),heading=title.getBoundingClientRect();
 layer.style.setProperty('--intro-y',(heading.top-box.top+heading.height/2)+'px');
 for(const name of ['glow','rays']){const part=document.createElement('span');part.className='course-intro-'+name;layer.append(part);}
 const glyphs=['あ','か','さ','た','な','は','ま','や','ら','わ','✦','✧'],distance=Math.min(box.width*.31,170);
 glyphs.forEach((glyph,i)=>{const part=document.createElement('span'),angle=i*Math.PI*2/glyphs.length-Math.PI/2;
  part.className='course-intro-particle';part.textContent=glyph;
  part.style.setProperty('--particle-x',(Math.cos(angle)*distance).toFixed(1)+'px');
  part.style.setProperty('--particle-y',(Math.sin(angle)*Math.min(distance*.64,box.height*.6)).toFixed(1)+'px');
  part.style.setProperty('--particle-turn',((i%2?1:-1)*(12+i*3))+'deg');
  part.style.setProperty('--particle-size',(15+i%3*2)+'px');layer.append(part);
 });
 host.classList.add('course-motion-host');title.classList.add('course-title-pop');host.append(layer);
 introTimer=setTimeout(endIntro,850);
}
function finishCard(card){const timer=timers.get(card);if(timer!==undefined)clearTimeout(timer);timers.delete(card);card.classList.remove('course-card-reveal');card.style.removeProperty('--course-reveal-delay');}
function settle(card){seen.add(card);intersection?.unobserve(card);watched.delete(card);finishCard(card);}
function setupIntersection(){
 if(reduced()||intersection||typeof window.IntersectionObserver!=='function')return;
 intersection=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting),step=Math.min(45,240/Math.max(1,visible.length-1));let order=0;for(const entry of visible){const card=entry.target;intersection?.unobserve(card);watched.delete(card);seen.add(card);if(reduced()||card.contains(document.activeElement))continue;
  card.style.setProperty('--course-reveal-delay',Math.round(order++*step)+'ms');card.classList.add('course-card-reveal');
  timers.set(card,setTimeout(()=>finishCard(card),740));
 }},{threshold:.08,rootMargin:'0px 0px -8px 0px'});
}
function watch(node){if(reduced()||!intersection||node.nodeType!==1)return;const cards=[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)];for(const card of cards){if(seen.has(card)||watched.has(card))continue;watched.add(card);intersection.observe(card);}}
function refresh(){if(introHost&&!introHost.isConnected)endIntro();intro();setupIntersection();watch(app);for(const card of watched)if(!card.isConnected){intersection?.unobserve(card);watched.delete(card);}for(const card of timers.keys())if(!card.isConnected)finishCard(card);}
function stopMotion(){endIntro();intersection?.disconnect();intersection=null;watched.clear();for(const card of timers.keys())finishCard(card);}
function preferenceChanged(){if(reduced())stopMotion();else{setupIntersection();watch(app);}}
reduce?.addEventListener?.('change',preferenceChanged);if(reduce&&!reduce.addEventListener)reduce.addListener?.(preferenceChanged);
for(const event of ['focusin','pointerdown'])app.addEventListener(event,e=>{const card=e.target.closest?.(selector);if(card)settle(card);},{passive:true});
if(typeof MutationObserver==='function')new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1)))refresh();}).observe(app,{childList:true,subtree:true});
window.addEventListener('pagehide',stopMotion);window.addEventListener('pageshow',e=>{if(e.persisted)preferenceChanged();});
refresh();
})();
