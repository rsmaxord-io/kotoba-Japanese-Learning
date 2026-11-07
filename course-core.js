(function(){'use strict';
const intervals=[1,3,7,21],day=86400000;
function norm(s){return String(s||'').normalize('NFKC').replace(/[\s。、，,.!?！？]/g,'');}
function options(q,seed){const a=q.options.map((text,index)=>({text,index}));const shift=seed%a.length;return a.slice(shift).concat(a.slice(0,shift));}
function due(entry,now=Date.now()){return !!entry&&now>=Number(entry.at)+intervals[Math.min(Number(entry.reps)||0,3)]*day;}
function record(old,now=Date.now()){return {at:now,reps:old&&due(old,now)?Math.min((old.reps||0)+1,3):old?.reps||0,practices:(old?.practices||0)+1};}
function split(text){if(typeof Intl.Segmenter==='function')return Array.from(new Intl.Segmenter('ja',{granularity:'word'}).segment(text),x=>x.segment).filter(x=>x.trim());return text.split(/\s+/).filter(Boolean);}
function shuffle(a,seed){const b=a.slice();for(let i=b.length-1;i>0;i--){seed=(seed*1664525+1013904223)>>>0;const j=seed%(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;}
function filter(lessons,units,{band='all',skill='all',query=''}){const q=query.trim().toLowerCase();return lessons.filter(l=>(band==='all'||l.band===band)&&(skill==='all'||l.skill===skill)&&(!q||[l.id,l.title,l.objective,units[l.unit-1].pattern,units[l.unit-1].reading.text].join(' ').toLowerCase().includes(q)));}
window.CourseCore={norm,options,due,record,split,shuffle,filter};
})();
