/* A living conversation between a double helix and a social network. */
(() => {
'use strict';
const svg=document.getElementById('connections');if(!svg)return;
const NS='http://www.w3.org/2000/svg',tau=Math.PI*2;
const media=matchMedia('(prefers-reduced-motion: reduce)');let reduced=media.matches;
const group=id=>document.getElementById(id);
const make=(parent,name,attrs)=>{const e=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));parent.append(e);return e;};
const attr=(e,key,value)=>{const v=typeof value==='number'?value.toFixed(3):value;if(key==='opacity'||key==='stroke-width')e.style.setProperty(key,v);else e.setAttribute(key,v);};
const lerp=(a,b,f)=>a+(b-a)*f;
const rungs=[...group('connection-rungs').children],strands=[...group('connection-strands').children],beads=[...group('connection-beads').children];
const base=[{x:424,y:177,r:10},{x:535,y:263,r:13},{x:407,y:315,r:9},{x:498,y:391,r:11},{x:586,y:474,r:9},{x:461,y:545,r:8},{x:374,y:472,r:7}];
const edges=[[0,1],[0,2],[1,2],[1,3],[1,4],[2,3],[3,4],[3,6],[4,5],[5,6],[2,5],[0,5]];
const edgePaths=[...group('connection-edges').children],nodeCircles=[...group('connection-nodes').children];
const halos=base.map(()=>make(group('connection-wave'),'circle',{class:'connection-halo',r:0,opacity:0}));
const signalDots=Array.from({length:6},()=>make(group('connection-signals'),'circle',{class:'connection-signal',r:2.7,opacity:0}));
const bridge=make(group('connection-bridges'),'path',{class:'connection-bridge'});
const shimmer=make(group('connection-bridges'),'path',{class:'connection-bridge-light'});
const orbitDots=[...group('connection-orbit-dots').children];
let time=0,last=0,phase=0,velocity=0,paused=false,inView=true,hover=-1,focused=false,warp=0;
let pointer={x:345,y:340,inside:false},drag=null,positions=base.map(n=>({...n})),waves=[];
function helix(u,side=1){const a=u*tau*2+phase+time*.26;return{x:223+Math.sin(a)*62*side,y:137+u*400,z:Math.cos(a)*side};}
function projectNodes(){const tilt=Math.sin(time*.12)*.11+Math.sin(phase*.35)*.1;return base.map((n,i)=>{const z=Math.sin(i*2.1+time*.15);return{x:485+(n.x-485)*Math.cos(tilt)+z*Math.sin(tilt)*23+Math.sin(time*.35+i)*2.1,y:n.y+Math.sin(time*.28+i*1.7)*2.2,r:n.r};});}
function pathLine(points){return points.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+','+p.y.toFixed(2)).join(' ');}
function cubic(a,b,c,d,f){const q=1-f;return{x:q*q*q*a.x+3*q*q*f*b.x+3*q*f*f*c.x+f*f*f*d.x,y:q*q*q*a.y+3*q*q*f*b.y+3*q*f*f*c.y+f*f*f*d.y};}
function distances(start){const dist=base.map(()=>Infinity);dist[start]=0;const remaining=new Set(base.map((_,i)=>i));while(remaining.size){let closest=[...remaining].reduce((a,b)=>dist[a]<dist[b]?a:b);remaining.delete(closest);for(const [a,b] of edges){const next=a===closest?b:b===closest?a:-1;if(next<0)continue;const length=Math.hypot(base[a].x-base[b].x,base[a].y-base[b].y);dist[next]=Math.min(dist[next],dist[closest]+length/255);}}return dist;}
function sendWave(start=2){if(reduced){hover=start;draw();return;}waves.push({start:time,dist:distances(start)});if(waves.length>4)waves.shift();}
function draw(){
 positions=projectNodes();
 for(let i=0;i<rungs.length;i++){
  const u=i/(rungs.length-1),a=helix(u),b=helix(u,-1),pulse=reduced?0:Math.exp(-Math.pow(((u-time*.11)%1+1)%1-.5,2)*140);
  attr(rungs[i],'x1',a.x);attr(rungs[i],'y1',a.y);attr(rungs[i],'x2',b.x);attr(rungs[i],'y2',b.y);attr(rungs[i],'opacity',.38+Math.abs(a.z)*.19+pulse*.38);attr(rungs[i],'stroke-width',pulse>.5?1.5:.85);
  for(let s=0;s<2;s++){const p=s?b:a,e=beads[i*2+s];attr(e,'cx',p.x);attr(e,'cy',p.y);attr(e,'r',1.3+(p.z+1)*.45);attr(e,'opacity',.38+(p.z+1)*.28);}
 }
 for(let side=0;side<2;side++){const points=Array.from({length:101},(_,i)=>helix(i/100,side?-1:1));attr(strands[side],'d',pathLine(points));}
 edgePaths.forEach((e,i)=>{const[a,b]=edges[i],p=positions[a],q=positions[b];attr(e,'d',`M${p.x},${p.y}L${q.x},${q.y}`);const lit=hover===a||hover===b;attr(e,'opacity',hover<0?(i>=10?.35:.62):lit?.98:.15);attr(e,'stroke-width',lit?1.9:1.35);});
 positions.forEach((p,i)=>{const e=nodeCircles[i];attr(e,'cx',p.x);attr(e,'cy',p.y);attr(e,'r',p.r+(hover===i?1.6:0));e.classList.toggle('is-hovered',hover===i);let ring=hover===i?1.1:0,alpha=hover===i?.4:0;
  for(const wave of waves){const age=time-wave.start-wave.dist[i];if(age>=0&&age<1.5){ring=age*19+1;alpha=Math.max(alpha,(1-age/1.5)*.75);}}
  const h=halos[i];attr(h,'cx',p.x);attr(h,'cy',p.y);attr(h,'r',p.r+ring);attr(h,'opacity',alpha);
 });
 const a=helix(.5),d=positions[2],b={x:320,y:a.y-28},c={x:350,y:d.y+28};const bridgePath=`M${a.x},${a.y}C${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`;
 attr(bridge,'d',bridgePath);attr(shimmer,'d',bridgePath);attr(shimmer,'stroke-dashoffset',-time*16);attr(bridge,'opacity',pointer.inside?.38:.2);
 // A pulse travels along the helix, across the bridge, then through the network.
 const cycle=(time*.18)%1,helixSignal=helix(cycle);attr(signalDots[0],'cx',helixSignal.x);attr(signalDots[0],'cy',helixSignal.y);attr(signalDots[0],'opacity',reduced?0:.75);
 const bridgeProgress=(time*.26)%1,point=cubic(a,b,c,d,bridgeProgress);attr(signalDots[1],'cx',point.x);attr(signalDots[1],'cy',point.y);attr(signalDots[1],'opacity',reduced?0:Math.sin(bridgeProgress*Math.PI)*.75);
 const route=[2,0,1,3,4,5,6,3,2];
 for(let i=2;i<6;i++){const progress=(time*.29+(i-2)*1.91)%8,j=Math.floor(progress),f=progress-j,p=positions[route[j]],q=positions[route[j+1]];attr(signalDots[i],'cx',lerp(p.x,q.x,f));attr(signalDots[i],'cy',lerp(p.y,q.y,f));attr(signalDots[i],'opacity',reduced?0:.15+Math.sin(f*Math.PI)*.65);}
 const angle=(-37+Math.sin(time*.08)*3+Math.sin(phase*.1)*4)*Math.PI/180;
 attr(group('outer-orbit'),'transform',`rotate(${angle*180/Math.PI} 345 347)`);
 orbitDots.forEach((e,i)=>{const t=time*.055+i*Math.PI+.6,x=Math.cos(t)*320,y=Math.sin(t)*244;attr(e,'cx',345+x*Math.cos(angle)-y*Math.sin(angle));attr(e,'cy',347+x*Math.sin(angle)+y*Math.cos(angle));});
 waves=waves.filter(w=>time-w.start<5.5);
}
function frame(now){const dt=last?Math.min(.05,(now-last)/1000):0;last=now;if(!paused&&!reduced&&inView&&!document.hidden){time+=dt*(warp>0?3.5:1);warp=Math.max(0,warp-dt);if(!drag){phase+=velocity;velocity*=.94;if(Math.abs(velocity)<.0001)velocity=0;}draw();}requestAnimationFrame(frame);}
function coordinates(e){const r=svg.getBoundingClientRect(),scale=Math.min(r.width/691,r.height/681)||1;return{x:(e.clientX-r.left-(r.width-691*scale)/2)/scale,y:(e.clientY-r.top-(r.height-681*scale)/2)/scale};}
function nearby(p){let index=-1,distance=34;positions.forEach((n,i)=>{const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<distance){index=i;distance=d;}});return index;}
svg.style.touchAction='pan-y';
svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;const p=coordinates(e);drag={start:e.clientX,last:e.clientX,moved:0,p};svg.setPointerCapture?.(e.pointerId);svg.classList.add('is-dragging');});
svg.addEventListener('pointermove',e=>{const p=coordinates(e);pointer={...p,inside:true};hover=nearby(p);if(drag){const dx=e.clientX-drag.last;phase+=dx*.012;velocity=dx*.0016;drag.last=e.clientX;drag.moved=Math.max(drag.moved,Math.abs(e.clientX-drag.start));}draw();});
function end(e,cancel=false){if(drag&&!cancel&&drag.moved<6){const p=coordinates(e);const hit=nearby(p);sendWave(hit<0?2:hit);}drag=null;svg.classList.remove('is-dragging');}
svg.addEventListener('pointerup',e=>end(e));svg.addEventListener('pointercancel',e=>end(e,true));svg.addEventListener('lostpointercapture',()=>{drag=null;svg.classList.remove('is-dragging');});
svg.addEventListener('pointerleave',()=>{pointer.inside=false;hover=-1;draw();});
svg.addEventListener('focus',()=>{focused=true;});svg.addEventListener('blur',()=>{focused=false;hover=-1;draw();});
svg.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();sendWave(hover<0?2:hover);}if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();hover=(hover+(e.key==='ArrowUp'?6:1)+7)%7;draw();}});
const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;last=0;},{rootMargin:'100px'}):null;observer?.observe(svg);
media.addEventListener?.('change',e=>{reduced=e.matches;time=0;waves=[];draw();});
document.addEventListener('visibilitychange',()=>{last=0;});
window.__connections={pause(value){paused=value;draw();},rotate(value){phase+=value;draw();},warp(){warp=reduced?0:2.6;sendWave(2);},reset(){time=0;phase=0;velocity=0;hover=-1;waves=[];draw();}};
draw();requestAnimationFrame(frame);
})();
