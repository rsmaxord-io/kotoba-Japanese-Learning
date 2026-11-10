(()=>{'use strict';const sandbox=new URLSearchParams(location.search).get('sandbox')==='1',KEY=sandbox?'kotoba-library-owner-sandbox-v1':'kotoba-library-owner-v1';const endpoint=new URL(location.hostname==='rsmaxord-io.github.io'?'https://kotoba-community-library.bonnymochi23.chatgpt.site/api/media-bookmarks':'api/media-bookmarks',document.baseURI);if(sandbox)endpoint.searchParams.set('sandbox','1');let owners={},ownerChanges=new Map(),state={items:[],loading:false,loaded:false,error:''},listeners=[],timer=null,pending=null,revision=0,resumeOnRestore=false;function syncOwners(id){
 let latest=owners;try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');latest=raw&&typeof raw==='object'&&!Array.isArray(raw)?Object.fromEntries(Object.entries(raw).filter(([key,token])=>typeof token==='string'&&!!token)):{};}catch{}
 const ids=new Set([...Object.keys(owners),...Object.keys(latest),...ownerChanges.keys(),...(id?[id]:[])]);
 for(const key of ids){try{const token=localStorage.getItem(KEY+':'+key);if(token!==null){if(token)latest[key]=token;else delete latest[key];}}catch{}}
 owners=latest;for(const [key,token] of ownerChanges){if(token===null)delete owners[key];else owners[key]=token;}
}
syncOwners();const emit=()=>listeners.forEach(f=>f(state));
function remember(id,token){ownerChanges.set(id,token);syncOwners(id);for(const [key,value] of [...ownerChanges]){try{localStorage.setItem(KEY+':'+key,value===null?'':value);ownerChanges.delete(key);}catch{}}}
function uncertain(options){return options.method==='POST'?'Could not confirm whether your favorite was saved. Keep this form open and try Add for everyone again; an identical favorite will not be added twice.':options.method==='DELETE'?'Could not confirm removal. Refresh the library when the connection returns.':'Cannot load the library right now. Check the connection and choose Refresh.';}
async function request(url,options={}){
 if(typeof window.fetch!=='function')throw Error('The shared library needs the Kotoba app server.');
 const controller=typeof window.AbortController==='function'?new window.AbortController():null;let timer=null;
 const operation=(async()=>{let r;
  try{r=await window.fetch(url,{...options,...(controller?{signal:controller.signal}:{}),cache:'no-store',credentials:'same-origin',headers:{'Accept':'application/json',...(options.headers||{})}});}catch{throw Error(uncertain(options));}
  let data;try{data=await r.json();}catch{throw Error(uncertain(options));}
  if(!r.ok)throw Error(data.error||'The shared library request failed.');return data;
 })();
 try{
  if(typeof window.setTimeout!=='function')return await operation;
  const deadline=new Promise((_,reject)=>{timer=window.setTimeout(()=>{reject(Error('The library took too long to respond. '+uncertain(options)));controller?.abort();},15000);});
  return await Promise.race([operation,deadline]);
 }finally{if(timer!==null)window.clearTimeout(timer);}
}
async function refresh(){if(pending)return pending;const startedAt=revision;state.loading=true;emit();pending=(async()=>{try{const d=await request(endpoint.href);if(!Array.isArray(d.items))throw Error('The library response could not be read.');if(startedAt===revision){state.items=d.items;state.loaded=true;state.error='';}}catch(e){if(startedAt===revision)state.error=e.message;}finally{state.loading=false;pending=null;emit();}})();return pending;}
const submissionTokens=new Map();
function submission(item){
 const key=KEY+':submission:'+encodeURIComponent(JSON.stringify([item.type,String(item.title).normalize('NFKC').toLowerCase(),item.link]));
 let token=submissionTokens.get(key);try{token=token||localStorage.getItem(key);}catch{}
 if(!/^[a-f0-9]{64}$/.test(token||'')){
  if(!window.crypto?.getRandomValues)return {key,token:null};
  const bytes=new Uint8Array(32);window.crypto.getRandomValues(bytes);token=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
 }
 submissionTokens.set(key,token);try{localStorage.setItem(key,token);}catch{}return {key,token};
}
function outgoingLink(value){try{const u=new URL(value);if(['http:','https:'].includes(u.protocol)&&!u.username&&!u.password&&!/[\x00-\x1f]/.test(String(value)))return u.href;}catch{}return value;}
async function publish(item){const attempt=submission(item);const d=await request(endpoint.href,{method:'POST',headers:{'Content-Type':'application/json',...(attempt.token?{'Authorization':'Bearer '+attempt.token}:{})},body:JSON.stringify({title:item.title,type:item.type,link:outgoingLink(item.link),note:item.note||''})});if(!d.item?.id)throw Error('The saved bookmark could not be confirmed.');if(d.deleteToken){remember(d.item.id,d.deleteToken);d.ownershipStored=!ownerChanges.has(d.item.id);}if(d.ownershipStored!==false){submissionTokens.delete(attempt.key);try{localStorage.removeItem(attempt.key);}catch{}}revision++;state.items=[d.item,...state.items.filter(x=>x.id!==d.item.id)];state.loaded=true;state.error='';emit();return d;}
async function remove(id){syncOwners(id);if(typeof owners[id]!=='string'||!owners[id])throw Error('Only the browser that added this item can remove it.');const url=new URL(endpoint);url.pathname=url.pathname.replace(/\/$/,'')+'/'+encodeURIComponent(id);await request(url.href,{method:'DELETE',headers:{'Authorization':'Bearer '+owners[id]}});revision++;state.items=state.items.filter(x=>x.id!==id);remember(id,null);emit();}
function stop(){resumeOnRestore=false;if(timer!==null)window.clearInterval(timer);timer=null;}function start(){refresh();if(timer===null&&typeof window.setInterval==='function')timer=window.setInterval(()=>{if(!document.hidden)refresh();},20000);}document.addEventListener('visibilitychange',()=>{if(!document.hidden&&timer!==null)refresh();});window.addEventListener('pagehide',()=>{const wasActive=timer!==null;stop();resumeOnRestore=wasActive;});window.addEventListener('pageshow',event=>{const resume=resumeOnRestore;resumeOnRestore=false;if(event.persisted&&resume)start();});window.KotobaMediaLibrary={state:()=>state,subscribe:f=>{listeners.push(f);return()=>{listeners=listeners.filter(x=>x!==f);};},refresh,start,stop,publish,remove,owns:id=>{syncOwners(id);return typeof owners[id]==='string'&&!!owners[id];}};})();
