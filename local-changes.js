/* Merge a tab's changed fields with a newer local record. No network or storage access. */
(function(g){'use strict';
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function merge(base,local,remote,setFields=[],path=''){
 if(JSON.stringify(local)===JSON.stringify(base))return remote;
 if(Array.isArray(local)&&Array.isArray(remote)&&setFields.includes(path)){
  const prior=new Set(Array.isArray(base)?base:[]),here=new Set(local);
  return [...new Set([...remote.filter(x=>!prior.has(x)||here.has(x)),...local.filter(x=>!prior.has(x))])];
 }
 if(record(local)&&record(remote)){
  const result={},prior=record(base)?base:{};
  for(const key of new Set([...Object.keys(prior),...Object.keys(local),...Object.keys(remote)])){
   if(['__proto__','constructor','prototype'].includes(key))continue;
   const value=merge(prior[key],local[key],remote[key],setFields,path?path+'.'+key:key);
   if(value!==undefined)result[key]=value;
  }
  return result;
 }
 return local;
}
g.KotobaLocalChanges={merge};
})(typeof window==='undefined'?globalThis:window);
