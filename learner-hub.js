(()=>{'use strict';if(window.LearnerHub)return;const C=window.KotobaLearnerCore,sandbox=new URLSearchParams(location.search).get('sandbox')==='1',KEY=sandbox?'kotoba-learner-sandbox-v1':'kotoba-learner-v1',STUDIO_KEY=sandbox?'kotoba-studio-sandbox-v1':'kotoba-studio-v1';if(!C){window.KotobaCourseBoot?.fail();return;}let volatile=C.empty(),storageFailed=false,failedBase=C.empty(),originalRaw=null;
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
function read(){if(storageFailed)return projectNotebook(volatile);try{return projectNotebook(restore(JSON.parse(localStorage.getItem(KEY)||'null'))||volatile);}catch{return projectNotebook(volatile);}}
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
function commit(fn){
 // Read successfully before writing: a readable fallback is not proof the saved original is safe to replace.
 let raw=null,remote=null,safe=false;
 try{raw=localStorage.getItem(KEY);if(raw===null)safe=true;else{const parsed=JSON.parse(raw);remote=restore(parsed);safe=!!remote&&preservesSaved(parsed,remote);}}catch{}
 if(remote)remote=projectNotebook(remote);
 let state=storageFailed?projectNotebook(volatile):(remote||projectNotebook(volatile)),baseline=JSON.parse(JSON.stringify(storageFailed?failedBase:state));
 if(storageFailed&&remote){state=mergePending(failedBase,state,remote);baseline=JSON.parse(JSON.stringify(remote));}
 const value=fn(state);if(value===SKIP_COMMIT)return null;volatile=state;
 if(!safe){storageFailed=true;failedBase=baseline;if(raw!==null)originalRaw=raw;}
 else try{localStorage.setItem(KEY,JSON.stringify(state));storageFailed=false;originalRaw=null;}catch{storageFailed=true;failedBase=baseline;}

 window.dispatchEvent(new CustomEvent('kotoba-learning-change'));return value;
}
function retrySave(){if(storageFailed)commit(()=>{});return !storageFailed;}
function exportState(){
 let state=read();
 if(storageFailed)try{const remote=projectNotebook(restore(JSON.parse(localStorage.getItem(KEY)||'null')));if(remote)state=mergePending(failedBase,state,remote);}catch{}
 return JSON.stringify(projectNotebook(state),null,2);
}
function href(path){const u=new URL(path,document.baseURI);if(sandbox)u.searchParams.set('sandbox','1');return u.pathname.split('/').pop()+u.search+u.hash;}
function practiceItem(x,kind){return kind==='kanji'?{id:'kanji:'+x.id,kind:'kanji',title:x.char+' · '+x.meaning,front:'Read this word in Japanese: '+x.word,answer:x.reading,model:x.word,translation:x.en,audioText:x.reading,source:'practice.html#kanji',note:'Readings belong to words. This is the example reading, not every reading of the character.'}:{id:'phrase:'+x.id,kind:'phrase',title:x.en,front:'How would you say this? '+x.en,answer:x.ja,model:x.ja,translation:x.en,audioText:x.audioText,source:'practice.html#phrases',note:x.note};}
function seedPractice(data,ids){if(sandbox||!data||!Array.isArray(ids))return;ids=ids.filter(id=>typeof id==='string');const old=read();const missing=ids.filter(id=>!old.items[(id.startsWith('k')?'kanji:':'phrase:')+id]);if(!missing.length)return;commit(s=>{for(const id of missing){const kind=id.startsWith('k')?'kanji':'phrase',x=data[kind==='kanji'?'kanji':'phrases'].find(x=>x.id===id);if(x)C.upsert(s,practiceItem(x,kind),'saved');}});}
function resolve(text){return window.KOTOBA_STUDIO_AUDIO?.[text]||window.KOTOBA_EDITORIAL_AUDIO?.[text]||window.KOTOBA_BEGINNER_AUDIO?.[text]||window.KOTOBA_JOURNEY_AUDIO?.[text]||window.KOTOBA_TOOLKIT_AUDIO?.[text]||window.KOTOBA_PRACTICE_AUDIO?.[text]||window.KOTOBA_LESSON_351_AUDIO?.[text]||window.KOTOBA_COURSE_AUDIO?.[text]||window.KOTOBA_DISCOVERY_AUDIO?.[text]||window.KOTOBA_AUDIO?.['std-f|'+text];}
const api={key:KEY,read,href,reviewFingerprint,studioItem,practiceItem,seedPractice,resolve,retrySave,originalData:()=>originalRaw,storageFailed:()=>storageFailed,summary:()=>C.summary(read()),due:(kind='all')=>C.due(read(),Date.now(),kind),save:item=>commit(s=>C.upsert(s,item)),miss:item=>commit(s=>C.miss(s,item)),unsave:id=>commit(s=>C.unsave(s,id)),grade:(id,rating,options)=>commit(s=>{const item=s.items[id];if(Object.prototype.hasOwnProperty.call(options||{},'expected')&&(!item||item.suspended||reviewFingerprint(item)!==options.expected))return SKIP_COMMIT;return C.grade(s,id,rating,options);}),suspend:id=>commit(s=>{if(s.items[id])s.items[id].suspended=true;}),resume:id=>commit(s=>{if(s.items[id])s.items[id].suspended=false;}),journey:id=>read().journeys[id]||null,saveJourney:(id,value)=>commit(s=>{s.journeys[id]=value;}),recordAbility:(id,evidence)=>commit(s=>C.recordAbility(s,id,evidence)),ability:id=>read().abilities[id]||null,stage:id=>C.abilityStage(read().abilities[id]),export:exportState};window.LearnerHub=api;
function updateCounts(){const n=api.summary();document.querySelectorAll('[data-hub-due]').forEach(e=>e.textContent=n.due);document.querySelectorAll('[data-hub-practiced]').forEach(e=>e.textContent=n.practiced);}
window.addEventListener('beforeunload',e=>{if(storageFailed){e.preventDefault();e.returnValue='';}});window.addEventListener('storage',e=>{if(e.key===KEY||e.key===STUDIO_KEY){updateCounts();window.dispatchEvent(new CustomEvent('kotoba-learning-change'));}});window.addEventListener('kotoba-learning-change',updateCounts);})();
