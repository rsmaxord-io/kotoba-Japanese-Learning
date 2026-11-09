(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);};
function read(key,fallback){try{var v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v);}catch(e){return fallback;}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch(e){}}
var rawSettings=read('kotoba-listening-v1',{});var settings={rate:rawSettings&&rawSettings.rate===0.85?0.85:1,dialects:!!(rawSettings&&rawSettings.dialects===true)};
window.KOTOBA_LISTENING=settings;
function notice(message){var old=$('.adventure-toast');if(old)old.remove();var el=document.createElement('div');el.className='adventure-toast';el.setAttribute('role','status');el.textContent=message;document.body.appendChild(el);setTimeout(function(){el.remove();},6500);}
window.kotobaNotice=notice;
function settingsHTML(){return '<div class="audio-settings"><strong>Listening studio</strong><label>Speed <select data-listening-rate aria-label="Audio playback speed"><option value="1">Natural</option><option value="0.85">Slow · 0.85×</option></select></label><label><input type="checkbox" data-dialect-toggle> Include synthetic dialect readings</label><span class="audio-now-playing" role="status">Ready to listen</span><details><summary>About these voices</summary><p>The bundled clips are synthesized. Standard Japanese is the pronunciation reference. Kansai and regional clips use standard Japanese voices reading dialect words; they do not reproduce authentic regional pitch or intonation. They are optional reading aids. For regional pronunciation, compare with a native speaker. Slow playback keeps the original pitch where your browser supports it.</p><p><a href="https://mmsrv.ninjal.ac.jp/hogendanwa_siryo/en/index.html" target="_blank" rel="noopener noreferrer">Explore real regional conversation recordings at NINJAL ↗</a> · Historical recordings with transcripts; these are listening references, rather than recordings of our lesson sentences.</p></details></div>';}
function decorate(){
var target=$('.lesson-audio-settings');
if(!target && !$('[data-global-listening]')){var main=$('main');if(main){target=document.createElement('div');target.className='wrap';target.setAttribute('data-global-listening','');var hero=main.querySelector('.hero,.page-hero');if(hero)hero.insertAdjacentElement('afterend',target);else main.prepend(target);}}
if(target && !$('.audio-settings',target)) target.innerHTML=settingsHTML();
document.querySelectorAll('[data-listening-rate]').forEach(function(el){el.value=String(settings.rate);});
document.querySelectorAll('[data-dialect-toggle]').forEach(function(el){el.checked=settings.dialects;});
document.querySelectorAll('[data-voice^="kansai-"],[data-voice^="dialect-"]').forEach(function(el){el.classList.add('dialect-unverified');el.title='Synthetic dialect reading · regional intonation not verified';var label=el.getAttribute('aria-label');if(label&&!label.includes('Synthetic reading'))el.setAttribute('aria-label','Synthetic reading, regional intonation unverified: '+label);});
}
document.addEventListener('kotoba:lesson',decorate);
document.addEventListener('change',function(e){if(e.target.matches('[data-listening-rate]'))settings.rate=Number(e.target.value)===0.85?0.85:1;else if(e.target.matches('[data-dialect-toggle]'))settings.dialects=e.target.checked;else return;save('kotoba-listening-v1',settings);decorate();document.dispatchEvent(new CustomEvent('kotoba:audio-settings'));});
document.addEventListener('kotoba:celebrate',function(e){var n=e.detail.n;notice(n%10===0?'Unit complete. Ten more discoveries in your passport. Take a breath and enjoy the progress.':'Level '+n+' complete. One more thing you can do in Japanese. Nice work showing up.');});
var state=read('kotoba-course-v2',{levels:{}}),levels=state&&state.levels&&typeof state.levels==='object'&&!Array.isArray(state.levels)?state.levels:{};
var done=Object.keys(levels).filter(function(n){return Number(n)>=1&&Number(n)<=100&&!!levels[n];}).length,next=1;
while(levels[next]&&next<=100)next++;
document.querySelectorAll('[data-resume]').forEach(function(el){el.href='lessons.html#level-'+Math.min(next,100);if(done)el.textContent=next>100?'Revisit my discoveries ↗':'Continue my adventure ↗';});
var progress=$('[data-home-progress]');if(progress&&done){progress.hidden=false;progress.textContent=done+' discoveries in your passport. '+(next>100?'You have reached level 100. Keep the conversation going.':'Next stop: level '+next+'.');}
decorate();
})();
