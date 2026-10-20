(() => {
'use strict';
const theme=document.getElementById('reader-theme');
function sync(){theme.setAttribute('aria-pressed',String(document.documentElement.classList.contains('claude')));}
theme.addEventListener('click',()=>{const dark=!document.documentElement.classList.contains('claude');document.documentElement.classList.toggle('claude',dark);try{localStorage.setItem('zhaoxi-theme',dark?'dark':'light');}catch{}sync();});sync();
const progress=document.getElementById('reading-progress');let pending=false;
function update(){const article=document.getElementById('article'),rect=article.getBoundingClientRect(),top=rect.top+scrollY,total=article.offsetHeight-innerHeight*.5;const value=Math.max(0,Math.min(1,(scrollY-top+innerHeight*.25)/Math.max(1,total)));progress.style.transform=`scaleX(${value})`;pending=false;}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});document.fonts?.ready.then(schedule);update();
document.getElementById('reader-year').textContent=new Date().getFullYear();
})();
