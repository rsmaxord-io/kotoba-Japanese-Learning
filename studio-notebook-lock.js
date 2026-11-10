/* Serialize synchronous notebook read/merge/write actions across same-origin tabs. */
(()=>{'use strict';let database=null,opening=null;
function open(){
 if(database)return Promise.resolve(database);
 if(opening)return opening;
 opening=new Promise((resolve,reject)=>{
  if(!window.indexedDB){reject(Error('Notebook coordination unavailable'));return;}
  let request;try{request=indexedDB.open('kotoba-notebook-mutex-v1',1);}catch(e){reject(e);return;}
  request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('mutex'))request.result.createObjectStore('mutex');};
  request.onerror=()=>reject(request.error||Error('Notebook coordination unavailable'));
  request.onsuccess=()=>{database=request.result;const db=database;db.onversionchange=()=>{db.close();if(database===db)database=null;};resolve(db);};
 });
 opening.then(()=>{opening=null;},()=>{opening=null;});return opening;
}
function run(key,work){return new Promise((resolve,reject)=>{
 let settled=false,transaction=null,result;const finish=(error)=>{if(settled)return;settled=true;clearTimeout(timer);error?reject(error):resolve(result);};
 const timer=setTimeout(()=>{if(transaction)try{transaction.abort();}catch{}finish(Error('Notebook coordination timed out'));},5000);
 open().then(db=>{if(settled)return;
  try{transaction=db.transaction('mutex','readwrite');const request=transaction.objectStore('mutex').get(key);
   request.onsuccess=()=>{if(settled)return;try{result=work();if(result&&typeof result.then==='function')throw Error('Notebook actions must be synchronous');}catch(e){try{transaction.abort();}catch{}finish(e);}};
   transaction.oncomplete=()=>finish();transaction.onerror=transaction.onabort=()=>finish(transaction.error||Error('Notebook coordination interrupted'));
  }catch(e){if(database===db){database=null;db.close();}finish(e);}
 },finish);
});}
window.addEventListener('pagehide',()=>{database?.close();database=null;});
window.StudioNotebookLock={run};
})();
