(()=>{'use strict';if(window.LearnerHub)return;const C=window.KotobaLearnerCore,sandbox=new URLSearchParams(location.search).get('sandbox')==='1',KEY=sandbox?'kotoba-learner-sandbox-v1':'kotoba-learner-v1',STUDIO_KEY=sandbox?'kotoba-studio-sandbox-v1':'kotoba-studio-v1';if(!C){window.KotobaCourseBoot?.fail();return;}let cachedBase=C.empty(),storageFailed=false,originalRaw=null,queue=[],running=false,flight=null,notice='',banner=null,bannerTimer=null;
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const timestamp=x=>Number.isFinite(x)&&x>=0;
function restore(x){
 if(!object(x)||x.version!==1)return null;
 const state=C.empty();
 if(object(x.items))for(const [id,item] of Object.entries(x.items)){
  if(!C.validItem(item)||item.id!==id)continue;
  state.items[id]={...item,createdAt:timestamp(item.createdAt)?item.createdAt:0,dueAt:timestamp(item.dueAt)?item.dueAt:0,
   step:Number.isInteger(item.step)&&item.step>=0?Math.min(item.step,C.INTERVALS.length-1):0,
   lapses:Number.isInteger(item.lapses)&&item.lapses>=0?item.lapses:0,suspended:item.suspended===true,
   reasons:Array.isArray(item.reasons)?item.reasons.filter(r=>typeof r==='string'):['saved'],
   history:Array.isArray(item.history)?item.history.filter(h=>object(h)&&timestamp(h.at)&&['again','hard','good'].includes(h.rating)).slice(-20):[]};
 }
 if(object(x.abilities))for(const [id,a] of Object.entries(x.abilities)){
  if(!object(a)||!timestamp(a.practiceAt)||!a.practiceAt||typeof a.output!=='string')continue;
  Object.defineProperty(state.abilities,id,{enumerable:true,configurable:true,writable:true,value:{...a,id,
   attempts:Number.isInteger(a.attempts)&&a.attempts>=0?a.attempts:1,
   transferAt:timestamp(a.transferAt)?a.transferAt:null,recalledAt:timestamp(a.recalledAt)?a.recalledAt:null}});
 }
 if(object(x.journeys))for(const [id,j] of Object.entries(x.journeys))if(object(j))Object.defineProperty(state.journeys,id,{enumerable:true,configurable:true,writable:true,value:j});
 return state;
}
function studioItem(word){
 if(!word||typeof word.id!=='string'||!/^[A-Za-z0-9_-]{1,120}$/.test(word.id)||!['noun','verb','pronoun','phrase'].includes(word.category))return null;
 for(const [key,max,required] of [['hiragana',500,true],['english',1000,true],['romaji',500,false],['note',1500,false],['situation',120,false]]){
  const value=word[key];if(value===undefined&&!required)continue;if(typeof value!=='string'||value.length>max||(required&&!value.trim()))return null;
 }
 const jp=word.hiragana.trim(),en=word.english.trim(),reading=(word.romaji||'').trim(),situation=(word.situation||'').trim()||'General';
 return {id:'studio:'+word.id,kind:'phrase',title:en,front:'Say this in Japanese: '+en,answer:jp,model:jp,audioText:jp,note:[reading,word.note,'Notebook category: '+word.category+' · '+situation].filter(Boolean).join(' · '),source:'studio.html#jp-to-en'};
}
// Cache only immutable text models; every read still gets current scheduling and membership.
let studioRaw,studioModels=null;
function notebookModels(){
 const raw=localStorage.getItem(STUDIO_KEY);if(raw===studioRaw)return studioModels;
 let models=null;
 try{const notebook=JSON.parse(raw||'null');if(notebook?.version===1&&['vocab','grammar','media'].every(k=>Array.isArray(notebook[k]))){
  const counts=new Map();for(const word of notebook.vocab)if(typeof word?.id==='string')counts.set(word.id,(counts.get(word.id)||0)+1);
  models=new Map();for(const word of notebook.vocab){if(counts.get(word?.id)!==1)continue;const model=studioItem(word);if(model)models.set(model.id,model);}
 }}catch{}
 studioRaw=raw;studioModels=models;return models;
}
// Notebook text is authoritative; projecting it never writes or changes review scheduling.
function projectNotebook(state){
 if(!state||!Object.keys(state.items).some(id=>id.startsWith('studio:')))return state;
 try{const models=notebookModels();if(!models)return state;let result=state;
  for(const [id,old] of Object.entries(state.items)){const model=models.get(id);if(!model||Object.keys(model).every(key=>old[key]===model[key]))continue;
   if(result===state)result={...state,items:{...state.items}};result.items[id]={...old,...model};
  }return result;
 }catch{return state;}
}
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
function stored(){let raw=null,state=null,safe=false;try{raw=localStorage.getItem(KEY);if(raw===null){state=C.empty();safe=true;}else{const parsed=JSON.parse(raw);state=restore(parsed);safe=!!state&&preservesSaved(parsed,state);}}catch{}if(state)cachedBase=clone(state);return {raw,safe,state:projectNotebook(clone(state||cachedBase))};}
function read(){let state=stored().state;for(const op of queue){try{const next=clone(state);if(op.fn(next)!==SKIP_COMMIT)state=next;}catch{}}return state;}
function mergePending(base,local,remote){
 if(JSON.stringify(local)===JSON.stringify(base))return remote;
 if(object(local)&&object(remote)){const result={},prior=object(base)?base:{};
  for(const key of new Set([...Object.keys(prior),...Object.keys(local),...Object.keys(remote)])){
   if(['__proto__','constructor','prototype'].includes(key))continue;
   const value=mergePending(prior[key],local[key],remote[key]);if(value!==undefined)result[key]=value;
  }return result;
 }return local;
}
// Compare learning content, excluding scheduling and other-tab progress.
const SKIP_COMMIT=Symbol('unchanged review');
function reviewFingerprint(item){
 if(!object(item))return null;
 const reference=window.KOTOBA_LISTENING_REVIEWS?.[item.id];
 if(item.kind==='lesson'&&!item.promptAudio&&reference)item={...item,...reference};
 return JSON.stringify(['id','kind','title','front','context','promptAudio','answer','model','translation','audioText','note','abilityId'].map(key=>String((key==='model'?(item.model||item.answer):item[key])??'')));
}
// Defaults may be added, but restoration must not discard or rewrite existing saved fields.
function preservesSaved(before,after){
 if(Object.is(before,after))return true;
 if(Array.isArray(before))return Array.isArray(after)&&before.length===after.length&&before.every((value,i)=>preservesSaved(value,after[i]));
 if(!object(before)||!object(after))return false;
 return Object.keys(before).every(key=>Object.prototype.hasOwnProperty.call(after,key)&&preservesSaved(before[key],after[key]));
}
function changed(){window.dispatchEvent(new CustomEvent('kotoba-learning-change'));showSaving();}
function settle(op,value){if(op.settled)return;op.settled=true;op.value=value;op.resolve(value);}
function failed(batch,raw){storageFailed=true;if(raw!==null)originalRaw=raw;for(const op of batch)settle(op,op.preview);changed();return false;}
function drive(force=false){
 if(running)return flight;if(!queue.length)return !storageFailed;if(storageFailed&&!force)return false;
 const coordinator=window.KotobaLearnerLock;if(!coordinator?.run)return failed(queue,null);
 running=true;let handled=false;
 const work=()=>{handled=true;const snapshot=stored(),batch=queue.slice();if(!snapshot.safe)return failed(batch,snapshot.raw);
  let state=snapshot.state;const outcomes=[];let writes=false;
  for(const op of batch){try{const next=clone(state),value=op.fn(next);if(value===SKIP_COMMIT){outcomes.push([op,null]);if(op.settled)notice='A question changed before its rating could be saved. That rating was not applied.';}else{state=next;writes=true;outcomes.push([op,value]);}}catch{outcomes.push([op,null]);notice='An item changed before saving. Its earlier action was not applied.';}}
  try{if(writes)localStorage.setItem(KEY,JSON.stringify(state));}catch{const rejected=new Set(outcomes.filter(([,value])=>value===null).map(([op])=>op));queue=queue.filter(op=>!rejected.has(op));for(const [op,value] of outcomes)if(value===null)settle(op,null);return failed(batch.filter(op=>!rejected.has(op)),snapshot.raw);}
  const applied=new Set(batch);queue=queue.filter(op=>!applied.has(op));cachedBase=clone(state);storageFailed=false;originalRaw=null;
  for(const [op,value] of outcomes)settle(op,value);changed();return true;
 };
 try{const result=coordinator.run(KEY,work);if(result&&typeof result.then==='function'){flight=Promise.resolve(result).catch(()=>handled?!storageFailed:failed(queue,null)).finally(()=>{running=false;flight=null;if(queue.length&&!storageFailed)drive();});return flight;}running=false;if(queue.length&&!storageFailed)drive();return result;}
 catch{return handled?!storageFailed:failed(queue,null);}
 finally{if(!flight)running=false;}
}
function commit(fn){const next=read(),preview=fn(next);if(preview===SKIP_COMMIT)return null;let resolve;const promise=new Promise(done=>resolve=done),op={fn,preview,resolve,promise,settled:false};queue.push(op);changed();drive(true);return op.settled?op.value:promise;}
function retrySave(){const result=drive(true);return result&&typeof result.then==='function'?result.then(()=>whenIdle()):!storageFailed&&!queue.length;}
function whenIdle(){const result=running?flight:drive();return Promise.resolve(result).then(()=>running||queue.length&&!storageFailed?whenIdle():!storageFailed&&!queue.length);}
function exportState(){return JSON.stringify(read(),null,2);}
function downloadLearning(text,name){const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function showSaving(){
 if(!document.body?.appendChild)return;
 clearTimeout(bannerTimer);bannerTimer=null;
 if(!storageFailed&&!notice&&!queue.length){banner?.remove();banner=null;return;}
 if(!storageFailed&&!notice){if(!banner){bannerTimer=setTimeout(()=>{if(queue.length)renderSaving();},250);}return;}renderSaving();
}
function renderSaving(){
 // Page-owned recovery controls already explain the failure; a floating duplicate must not cover them.
 if(storageFailed&&document.querySelector?.('#learning-status [data-recovery="pending"],#practice-recovery-host [data-export-review]')){banner?.remove();banner=null;return;}
 if(!document.body?.appendChild)return;if(!banner){banner=document.createElement('section');banner.id='learner-saving-status';banner.setAttribute('role','status');banner.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;max-width:560px;z-index:90;background:var(--surface,#fff);color:var(--ink,#141824);border:1px solid var(--line,#d9dfeb);border-radius:14px;padding:14px;max-height:45vh;overflow:auto;box-shadow:0 8px 30px #172d5428';document.body.appendChild(banner);}
 banner.replaceChildren();const message=document.createElement('p');message.textContent=storageFailed?'Changes are kept in this tab. Export your learning or retry saving before leaving.':notice||'Saving your learning…';banner.append(message);
 const button=(label,action)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='min-height:44px;margin:6px 8px 0 0;padding:8px 12px';b.addEventListener('click',action);banner.append(b);};
 if(storageFailed){button('Export learning',()=>downloadLearning(exportState(),'kotoba-personal-learning.json'));if(typeof originalRaw==='string')button('Download original data',()=>downloadLearning(originalRaw,'kotoba-learning-original.json'));button('Retry saving',()=>retrySave());}if(notice)button('Dismiss',()=>{notice='';showSaving();});
}
function href(path){const u=new URL(path,document.baseURI);if(sandbox)u.searchParams.set('sandbox','1');return u.pathname.split('/').pop()+u.search+u.hash;}
function practiceItem(x,kind){return kind==='kanji'?{id:'kanji:'+x.id,kind:'kanji',title:x.char+' · '+x.meaning,front:'Read this word in Japanese: '+x.word,answer:x.reading,model:x.word,translation:x.en,audioText:x.reading,source:'practice.html#kanji',note:'Readings belong to words. This is the example reading, not every reading of the character.'}:{id:'phrase:'+x.id,kind:'phrase',title:x.en,front:'How would you say this? '+x.en,answer:x.ja,model:x.ja,translation:x.en,audioText:x.audioText,source:'practice.html#phrases',note:x.note};}
function seedPractice(data,ids){if(sandbox||!data||!Array.isArray(ids))return;const old=read(),items=ids.filter(id=>typeof id==='string').map(id=>{const kind=id.startsWith('k')?'kanji':'phrase',x=data[kind==='kanji'?'kanji':'phrases'].find(x=>x.id===id);return x&&!old.items[kind+':'+id]?clone(practiceItem(x,kind)):null;}).filter(Boolean);if(!items.length)return;const now=Date.now();return commit(state=>{let added=false;for(const item of items)if(!state.items[item.id]){C.upsert(state,item,'saved',now);added=true;}if(!added)return SKIP_COMMIT;});}
function resolve(text){return window.KOTOBA_STUDIO_AUDIO?.[text]||window.KOTOBA_EDITORIAL_AUDIO?.[text]||window.KOTOBA_BEGINNER_AUDIO?.[text]||window.KOTOBA_JOURNEY_AUDIO?.[text]||window.KOTOBA_TOOLKIT_AUDIO?.[text]||window.KOTOBA_PRACTICE_AUDIO?.[text]||window.KOTOBA_LESSON_351_AUDIO?.[text]||window.KOTOBA_COURSE_AUDIO?.[text]||window.KOTOBA_DISCOVERY_AUDIO?.[text]||window.KOTOBA_AUDIO?.['std-f|'+text];}
function saveItem(item,missed=false){const value=clone(item),now=Date.now();return commit(state=>missed?C.miss(state,value,now):C.upsert(state,value,'saved',now));}
function gradeItem(id,rating,options={}){const value={...options,now:options.now===undefined?Date.now():options.now};return commit(state=>{const item=state.items[id];if(Object.prototype.hasOwnProperty.call(value,'expected')&&(!item||item.suspended||reviewFingerprint(item)!==value.expected))return SKIP_COMMIT;return C.grade(state,id,rating,value);});}
function finishJourney(id,item,options={}){const base=clone(options.base===undefined?read().journeys[id]:options.base),local=clone(options.local===undefined?base:options.local),model=clone(item),merge=typeof options.merge==='function'?options.merge:mergePending,now=Date.now();return commit(state=>{const latest=state.journeys[id];if(latest?.stage!=='output')return SKIP_COMMIT;const final=merge(base,local,latest);if(final?.stage!=='output'||typeof final.output!=='string'||!final.output.trim()||!Array.isArray(final.checks)||final.checks.length!==3||!final.checks.every(Boolean)||(final.mode==='speak'&&!final.aloud))return SKIP_COMMIT;C.recordAbility(state,id,{probeFirstTry:final.probeFirstTry,assisted:final.assisted,output:final.output,mode:final.mode,checks:final.checks,source:model.source},now);C.upsert(state,model,'saved',now);state.journeys[id]={...final,stage:'finished'};return state.journeys[id];});}
const api={key:KEY,read,href,finishJourney,reviewFingerprint,studioItem,practiceItem,seedPractice,resolve,retrySave,whenIdle,refreshSaving:showSaving,storagePending:()=>queue.length>0&&!storageFailed,originalData:()=>originalRaw,storageFailed:()=>storageFailed,summary:()=>C.summary(read()),due:(kind='all')=>C.due(read(),Date.now(),kind),save:item=>saveItem(item),miss:item=>saveItem(item,true),unsave:id=>commit(state=>C.unsave(state,id)),grade:gradeItem,suspend:id=>commit(state=>{if(state.items[id])state.items[id].suspended=true;}),resume:id=>commit(state=>{if(state.items[id])state.items[id].suspended=false;}),journey:id=>read().journeys[id]||null,saveJourney:(id,value,options={})=>{const base=clone(Object.prototype.hasOwnProperty.call(options,'base')?options.base:read().journeys[id]),local=clone(value),merge=typeof options.merge==='function'?options.merge:mergePending;return commit(state=>{state.journeys[id]=merge(base,local,state.journeys[id]);return state.journeys[id];});},recordAbility:(id,evidence)=>{const value=clone(evidence),now=Date.now();return commit(state=>C.recordAbility(state,id,value,now));},ability:id=>read().abilities[id]||null,stage:id=>C.abilityStage(read().abilities[id]),export:exportState};window.LearnerHub=api;
let countsTimer=null,countsSuspended=false;
function notifyCounts(){window.dispatchEvent(new CustomEvent('kotoba-learning-change'));}
function updateCounts(){
 const state=read(),now=Date.now(),n=C.summary(state,now);
 document.querySelectorAll('[data-hub-due]').forEach(e=>{if(e.textContent!==String(n.due))e.textContent=n.due;});
 document.querySelectorAll('[data-hub-due-badge]').forEach(e=>e.hidden=n.due===0);
 document.querySelectorAll('[data-hub-practiced]').forEach(e=>{if(e.textContent!==String(n.practiced))e.textContent=n.practiced;});
 if(countsTimer!==null)window.clearTimeout?.(countsTimer);countsTimer=null;
 if(countsSuspended||typeof window.setTimeout!=='function')return;
 const next=Object.values(state.items).filter(i=>!i.suspended&&i.dueAt>now).reduce((time,i)=>Math.min(time,i.dueAt),Infinity);
 if(Number.isFinite(next))countsTimer=window.setTimeout(()=>{countsTimer=null;notifyCounts();},Math.min(2147483647,Math.max(1,next-now)));
}
// A delayed link must never override a newer link, section change, or browser Back/Forward.
let navigationVersion=0;
for(const event of ['hashchange','popstate','pagehide'])window.addEventListener(event,()=>{navigationVersion++;});
document.addEventListener?.('click',e=>{
 if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 const a=e.target.closest?.('a[href]');if(!a||a.target&&a.target!=='_self'||a.hasAttribute('download'))return;
 let url;try{url=new URL(a.href,document.baseURI);}catch{return;}if(!/^https?:$/.test(url.protocol))return;
 const intent=++navigationVersion;
 const stores=[window.KotobaCourseSaving,window.KotobaPracticeSaving,window.KotobaStudioSaving,window.KotobaToolkitSaving,window.KotobaReviewLabSaving].filter(Boolean);
 const pending=()=>queue.length>0||stores.some(store=>store.pending());
 if(!pending()||storageFailed||url.href.split('#')[0]===location.href?.split('#')[0])return;
 e.preventDefault();
 function followWhenIdle(){
  if(intent!==navigationVersion)return;
  Promise.all([whenIdle(),...stores.map(store=>store.whenIdle())]).then(results=>{
   if(intent!==navigationVersion)return;
   if(!results.every(Boolean)||storageFailed||stores.some(store=>store.failed?.())){showSaving();return;}
   // Another save may have joined a queue after its first wait finished.
   if(pending())followWhenIdle();else location.assign(url.href);
  });
 }
 followWhenIdle();
},true);
window.addEventListener('beforeunload',e=>{if(storageFailed||queue.length){e.preventDefault();e.returnValue='';}});window.addEventListener('storage',e=>{if(e.key===KEY||e.key===STUDIO_KEY||e.key===null)notifyCounts();});window.addEventListener('kotoba-learning-change',updateCounts);
window.addEventListener('pagehide',()=>{countsSuspended=true;if(countsTimer!==null)window.clearTimeout?.(countsTimer);countsTimer=null;});
window.addEventListener('pageshow',event=>{countsSuspended=false;if(event.persisted)notifyCounts();});
window.addEventListener('focus',notifyCounts);
document.addEventListener?.('visibilitychange',()=>{if(!document.hidden)notifyCounts();});
updateCounts();})();
