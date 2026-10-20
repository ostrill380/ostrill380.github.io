/* Native details semantics with an interruptible height and fade transition. */
(() => {
'use strict';
const motion=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('details.project-details').forEach(details=>{
 const summary=details.querySelector('summary'),panel=details.querySelector('.details-panel');
 if(!summary||!panel)return;
 let expanded=details.open,animation=null;
 function sync(){details.dataset.expanded=String(expanded);summary.setAttribute('aria-expanded',String(expanded));panel.setAttribute('aria-hidden',String(!expanded));panel.inert=!expanded;}
 function stop(){if(animation){animation.onfinish=null;animation.cancel();animation=null;}}
 function settle(){stop();details.open=expanded;panel.style.removeProperty('height');panel.style.removeProperty('opacity');panel.style.removeProperty('transform');details.classList.remove('is-animating');sync();}
 function toggle(){
  const start=details.open?panel.getBoundingClientRect().height:0;
  const opacity=details.open?getComputedStyle(panel).opacity:0;
  const transform=details.open?getComputedStyle(panel).transform:'translateY(-6px)';
  stop();expanded=!expanded;sync();
  if(motion.matches||typeof panel.animate!=='function'){settle();return;}
  details.open=true;
  panel.style.height='auto';
  const end=expanded?panel.getBoundingClientRect().height:0;
  panel.style.height=start+'px';
  details.classList.add('is-animating');
  const current=panel.animate([
   {height:start+'px',opacity,transform},
   {height:end+'px',opacity:expanded?1:0,transform:expanded?'translateY(0)':'translateY(-6px)'}
  ],{duration:expanded?400:300,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
  animation=current;
  current.onfinish=()=>{if(animation===current)settle();};
 }
 summary.addEventListener('click',e=>{e.preventDefault();toggle();});
 // Native key activation of summary continues to generate the same click.
 addEventListener('resize',()=>{if(animation)settle();},{passive:true});
 document.getElementById('language')?.addEventListener('click',()=>{if(animation)settle();});
 motion.addEventListener?.('change',()=>{if(motion.matches)settle();});
 sync();
});
})();
