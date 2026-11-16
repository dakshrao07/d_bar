// ===== EDIT DATES HERE (your local time) =====
const T=s=>new Date(s).getTime();
const S=T('2026-09-13T00:00'),   // 0%
      CF=T('2026-11-03T00:00'),  // confession, 60%
      YES=T('2026-11-11T11:11'), // she said yes, about 90%
      V=T('2026-11-15T00:00'),   // reached 91%
      END=T('2027-11-11T11:11'); // meter reaches 100% (1 year of YES)
const pts=[[S,0],[CF,60],[YES,90],[V,91]];
const $=id=>document.getElementById(id),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const fmt=t=>new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
function pctAt(t){if(t<=S)return 0;for(let i=1;i<pts.length;i++){if(t<=pts[i][0]){const a=pts[i-1],b=pts[i];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0])}}return 91}

// ---- starfield with parallax + shooting stars ----
const cv=$('sky'),cx=cv.getContext('2d');let W,H,ox=0,oy=0;
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener('resize',rs);
const stars=[...Array(170)].map(()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.3,d:Math.random(),p:Math.random()*6}));
const shoot=[];const spawn=()=>shoot.push({x:Math.random()*W,y:Math.random()*H*.5,vx:6+Math.random()*5,vy:3+Math.random()*3,l:1});
setInterval(spawn,4500);
addEventListener('pointermove',e=>{ox=(e.clientX/W-.5)*-30;oy=(e.clientY/H-.5)*-30});
(function loop(t){cx.clearRect(0,0,W,H);
  stars.forEach(s=>{cx.globalAlpha=.4+.6*Math.abs(Math.sin(t/900+s.p));cx.fillStyle='#fff';cx.beginPath();cx.arc((s.x+ox*s.d+W)%W,(s.y+oy*s.d+H)%H,s.r,0,7);cx.fill()});
  for(let i=shoot.length-1;i>=0;i--){const s=shoot[i];cx.globalAlpha=s.l;cx.strokeStyle='#ffd9f5';cx.lineWidth=2;cx.beginPath();cx.moveTo(s.x,s.y);cx.lineTo(s.x-s.vx*9,s.y-s.vy*9);cx.stroke();s.x+=s.vx;s.y+=s.vy;s.l-=.012;if(s.l<=0)shoot.splice(i,1)}
  requestAnimationFrame(loop)})(0);

// ---- bursts, toast ----
const em=['💖','✨','🌟','💫','🌙','💕'];
function burst(x,y,n=4){for(let i=0;i<n;i++){const s=document.createElement('span');s.className='pop';s.textContent=em[Math.random()*em.length|0];s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--x',(Math.random()*240-120)+'px');s.style.setProperty('--y',(-60-Math.random()*140)+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),1300)}}
addEventListener('pointerdown',e=>burst(e.clientX,e.clientY,3));
const confetti=()=>{for(let i=0;i<40;i++)setTimeout(()=>burst(Math.random()*innerWidth,innerHeight*.75,2),i*60)};
let tt;function toast(m,ms=2600){const e=$('toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),ms);return sleep(ms)}

// ---- bar ----
function setBar(p,t){$('fill').style.width=p+'%';$('rocket').style.left=p+'%';$('pct').textContent=p.toFixed(2);if(t)$('date').textContent=fmt(t)}
function run(a,b,ms){return new Promise(res=>{const t0=performance.now();(function f(n){const k=Math.min((n-t0)/ms,1),t=a+(b-a)*k;setBar(pctAt(t),t);k<1?requestAnimationFrame(f):res()})(t0)})}

let timer;
async function story(){
  clearInterval(timer);setBar(0,S);$('hint').textContent='Our story is travelling through space...';
  await sleep(700);await run(S,CF,6000);
  burst(innerWidth/2,innerHeight/2,14);await toast('3 Nov: I confessed, and the meter was at 60% 💌',3200);
  await run(CF,YES,3500);$('date').textContent='11 Nov 2026, 11:11';
  confetti();await toast('11:11 💍 She said YES! Meter at about 90% 💖',3200);
  await run(YES,V,1800);
  burst(innerWidth/2,innerHeight/2,16);await toast('15 Nov: the meter reached 91% 🌟',2800);
  $('hint').textContent='And it keeps filling, a little every moment 👇';
  startLive();
}

// ---- live slow fill ----
const live=()=>Math.max(91,Math.min(100,91+9*(Date.now()-V)/(END-V)));
function startLive(){
  $('rate').textContent=(9/((END-V)/864e5)).toFixed(4);
  const u=()=>{const p=live();setBar(p);$('pct').textContent=p.toFixed(3);$('date').textContent=fmt(Date.now())+' · live';
    $('liveVal').textContent=p.toFixed(5);$('days').textContent=Math.max(0,Math.floor((Date.now()-YES)/864e5));
    $('left').textContent=Math.max(0,Math.ceil((END-Date.now())/864e5))};
  u();timer=setInterval(u,200);
}
const M=["Every drop of this meter is you 💖","Slow and steady, like the stars 🌙","I'm always here for you 🫶","You are my whole universe 🌌"];let mi=0;
$('bar').onclick=()=>toast(M[mi++%4]);

// ---- wish ----
const W2=["Wish granted: more laughs, more memories, more of us 🌙","The stars heard you, Disha ji. I'm yours always 💞","Wish noted: a thousand more sunsets with you 🌅","The universe says: you two are meant to be ✨"];let wi=0;
$('wish').onclick=()=>{for(let i=0;i<4;i++)setTimeout(spawn,i*250);toast(W2[wi++%4],3200)};

// ---- constellation heart ----
(function(){const svg=$('heart'),N=16,P=[];
  for(let i=0;i<=N;i++){const t=i/N*Math.PI*2;P.push([110+6.2*16*Math.pow(Math.sin(t),3)/1.2,85-6.2*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/1.2])}
  const ns='http://www.w3.org/2000/svg',pl=document.createElementNS(ns,'polyline');pl.setAttribute('points',P.map(p=>p.join(',')).join(' '));svg.appendChild(pl);
  const L=["You are my brightest star ⭐","Your smile lights my sky 🌟","I'd cross galaxies for you 🚀","You're my favourite hello 💫","My heart's address: Disha 💌","Forever isn't long enough 🌙","You + Me = infinity ♾️","My wish came true: you 💖"];
  P.slice(0,N).forEach((p,i)=>{const c=document.createElementNS(ns,'circle');c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r',3.2);c.style.animationDelay=(i*.15)+'s';c.onclick=()=>toast(L[i%8]);svg.appendChild(c)});
  new IntersectionObserver(e=>e[0].isIntersecting&&svg.classList.add('on'),{threshold:.5}).observe(svg)})();

$('replay').onclick=()=>{scrollTo({top:0,behavior:'smooth'});story()};
$('launch').onclick=e=>{burst(e.clientX,e.clientY,18);$('intro').classList.add('gone');$('main').classList.remove('hidden');story()};
