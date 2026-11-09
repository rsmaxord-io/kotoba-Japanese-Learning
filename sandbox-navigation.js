/* Keep practice runs isolated when following links, including open-in-new-tab. */
(()=>{'use strict';
const enabled=new URLSearchParams(location.search).get('sandbox')==='1';
window.KotobaSandbox={enabled,key:key=>enabled?'sandbox:'+key:key};
if(!enabled)return;
function annotate(a){
  const href=a.getAttribute('href');
  if(!href||href.startsWith('#')||a.hasAttribute('download'))return;
  try{const url=new URL(href,document.baseURI);
    if(!/^https?:$/.test(url.protocol)||url.origin!==location.origin||!url.pathname.endsWith('.html')||url.searchParams.get('sandbox')==='1')return;
    url.searchParams.set('sandbox','1');a.setAttribute('href',url.href);
  }catch{}
}
function scan(root){if(root.nodeType!==1&&root.nodeType!==9)return;if(root.matches?.('a[href]'))annotate(root);root.querySelectorAll('a[href]').forEach(annotate);}
const observer=new MutationObserver(records=>records.forEach(r=>{if(r.type==='attributes')annotate(r.target);else r.addedNodes.forEach(scan);}));
observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
scan(document);
document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(a)annotate(a);},true);
})();
