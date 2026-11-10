'use strict';
importScripts('lookup-core.js?v=1');
let dictionary=[],examples=[],loadPromise=null;
async function jsonAsset(url,compressed=false){
 const controller=typeof AbortController==='function'?new AbortController():null;
 const timed=typeof setTimeout==='function'&&typeof clearTimeout==='function';let idle=null,total=null,expire,finished=false;
 const pulse=()=>{if(!timed||finished)return;if(idle!==null)clearTimeout(idle);idle=setTimeout(()=>expire('The dictionary download stopped responding. Check your connection and retry.'),30000);};
 const deadline=timed?new Promise((_,reject)=>{expire=message=>{if(finished)return;finished=true;const error=Error(message);error.code='DICTIONARY_TIMEOUT';reject(error);controller?.abort();};pulse();total=setTimeout(()=>expire('The dictionary download took too long. Check your connection and retry.'),180000);}):null;
 const operation=(async()=>{const r=await fetch(url,controller?{signal:controller.signal}:{});if(!r.ok)throw Error('The dictionary file could not load. Check your connection and retry.');
  let body=r.body;
  if(body&&typeof TransformStream==='function')body=body.pipeThrough(new TransformStream({transform(chunk,out){pulse();out.enqueue(chunk);}}));
  if(compressed)body=body.pipeThrough(new DecompressionStream('gzip'));
  return await (body?new Response(body):r).json();
 })();
 try{return await (deadline?Promise.race([operation,deadline]):operation);}
 finally{finished=true;if(timed){if(idle!==null)clearTimeout(idle);if(total!==null)clearTimeout(total);}}
}
function load(){if(loadPromise)return loadPromise;loadPromise=(async()=>{
 examples=await jsonAsset('dictionary/course-examples.json');if(!Array.isArray(examples))throw Error('The lesson examples could not be read. Retry dictionary.');self.postMessage({type:'examples-ready',count:examples.length});let data;
 try{if(typeof DecompressionStream!=='function')throw Error('fallback');data=await jsonAsset('dictionary/jmdict.json.gz',true);}
 catch(e){if(e.code==='DICTIONARY_TIMEOUT')throw e;data=await jsonAsset('dictionary/jmdict.json');}
 if(!Array.isArray(data?.entries))throw Error('The dictionary data could not be read. Retry dictionary.');dictionary=data.entries;self.postMessage({type:'ready',count:dictionary.length,date:data.date});
 })().catch(e=>{loadPromise=null;throw e;});return loadPromise;}
self.onmessage=async({data})=>{if(data.type==='load'){try{await load();}catch(e){self.postMessage({type:'error',message:e.message});}return;}if(data.type!=='search')return;try{await load();const core=self.KotobaLookupCore;self.postMessage({type:'results',id:data.id,query:data.query,dict:core.dictionary(dictionary,data.query,data.direction,data.limit),examples:core.examples(examples,data.query,data.direction)});}catch(e){self.postMessage({type:'error',id:data.id,message:e.message});}};
