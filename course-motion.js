/* One decorative intro per document, plus non-blocking, progressively enhanced card motion. */
(()=>{'use strict';
const app=document.getElementById('app');if(!app)return;
const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)');
const selector='.course-choice,.lesson-link,.home-section-link';
const seen=new WeakSet(),watched=new Set(),timers=new Map();
let suspended=false;
let intersection=null,introPlayed=false,introHost=null,introTitle=null,introLayer=null,introTimer=null,floatHost=null,floatLayer=null;
const reduced=()=>reduce?.matches===true;
function endIntro(){if(introTimer!==null)clearTimeout(introTimer);introTimer=null;introLayer?.remove();introTitle?.classList.remove('course-title-pop');introHost=introTitle=introLayer=null;}
function endFloat(){floatLayer?.remove();floatHost?.classList.remove('course-motion-host');floatHost=floatLayer=null;}
function floating(){
 const host=app.querySelector('.home-heading');if(floatHost===host&&floatLayer?.isConnected)return;
 endFloat();if(!host||reduced())return;floatHost=host;
 const layer=document.createElement('div');floatLayer=layer;layer.className='course-floating-kana';layer.setAttribute('aria-hidden','true');layer.inert=true;
 ['あ','か','さ','た','な','は','ま','や'].forEach((glyph,i)=>{const part=document.createElement('span');part.textContent=glyph;part.style.cssText=`left:${7+i*12}%;top:${15+i%3*30}%;--float-time:${12+i*1.3}s;--float-delay:${-i*2}s;--float-turn:${i%2?12:-12}deg`;layer.append(part);});
 host.classList.add('course-motion-host');host.prepend(layer);
}
function intro(){
 if(introPlayed)return;
 const title=app.querySelector('h1'),host=title?.closest('header,.heading-row');if(!title||!host)return;
 introPlayed=true;if(reduced())return;
 introHost=host;introTitle=title;const layer=document.createElement('div');introLayer=layer;
 layer.className='course-intro-fx';layer.setAttribute('aria-hidden','true');layer.inert=true;
 const heading=title.getBoundingClientRect();
 layer.style.setProperty('--intro-x',(heading.left+heading.width/2)+'px');
 layer.style.setProperty('--intro-y',(heading.top+heading.height/2)+'px');
 for(const name of ['glow','rays','ring']){const part=document.createElement('span');part.className='course-intro-'+name;layer.append(part);}
 const glyphs=['あ','か','さ','た','な','は','ま','や','ら','わ'];
 for(let i=0;i<36;i++){
  const part=document.createElement('span'),angle=(i+Math.random()*.65)*Math.PI*2/36-Math.PI/2;
  const distance=Math.min(innerWidth*.7,540)*(.6+Math.random()*.4),x=Math.cos(angle)*distance,y=Math.sin(angle)*distance*.7;
  part.className='course-intro-particle';part.textContent=glyphs[i%glyphs.length];
  part.style.setProperty('--particle-x',x.toFixed(1)+'px');part.style.setProperty('--particle-y',(y+65).toFixed(1)+'px');
  part.style.setProperty('--particle-mid-x',(x*.72).toFixed(1)+'px');part.style.setProperty('--particle-mid-y',(y*.72-35).toFixed(1)+'px');
  part.style.setProperty('--particle-turn',((Math.random()-.5)*420).toFixed(1)+'deg');part.style.setProperty('--particle-size',(18+Math.random()*20).toFixed(1)+'px');layer.append(part);
 }
 title.classList.add('course-title-pop');document.body.append(layer);
 introTimer=setTimeout(endIntro,1200);
}
function finishCard(card){const timer=timers.get(card);if(timer!==undefined)clearTimeout(timer);timers.delete(card);card.classList.remove('course-card-reveal');card.style.removeProperty('--course-reveal-delay');}
function settle(card){seen.add(card);intersection?.unobserve(card);watched.delete(card);finishCard(card);}
function setupIntersection(){
 if(reduced()||intersection||typeof window.IntersectionObserver!=='function')return;
 intersection=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting),step=80;let order=0;for(const entry of visible){const card=entry.target;intersection?.unobserve(card);watched.delete(card);seen.add(card);if(reduced()||card.contains(document.activeElement))continue;
  card.style.setProperty('--course-reveal-delay',Math.min(order++*step,480)+'ms');card.classList.add('course-card-reveal');
  timers.set(card,setTimeout(()=>finishCard(card),1100));
 }},{threshold:.08,rootMargin:'0px 0px -8px 0px'});
}
function watch(node){if(reduced()||!intersection||node.nodeType!==1)return;const cards=[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)];for(const card of cards){if(seen.has(card)||watched.has(card))continue;watched.add(card);intersection.observe(card);}}
function refresh(){if(suspended)return;if(introHost&&!introHost.isConnected)endIntro();intro();floating();setupIntersection();watch(app);for(const card of watched)if(!card.isConnected){intersection?.unobserve(card);watched.delete(card);}for(const card of timers.keys())if(!card.isConnected)finishCard(card);}
function stopMotion(){endIntro();endFloat();intersection?.disconnect();intersection=null;watched.clear();for(const card of timers.keys())finishCard(card);}
function preferenceChanged(){if(reduced())stopMotion();else{floating();setupIntersection();watch(app);}}
reduce?.addEventListener?.('change',preferenceChanged);if(reduce&&!reduce.addEventListener)reduce.addListener?.(preferenceChanged);
for(const event of ['focusin','pointerdown'])app.addEventListener(event,e=>{const card=e.target.closest?.(selector);if(card)settle(card);},{passive:true});
if(typeof MutationObserver==='function')new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1)))refresh();}).observe(app,{childList:true,subtree:true});
window.addEventListener('pagehide',()=>{suspended=true;stopMotion();});window.addEventListener('pageshow',e=>{suspended=false;if(e.persisted)preferenceChanged();});
refresh();
})();
