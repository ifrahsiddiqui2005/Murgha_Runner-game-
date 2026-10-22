(()=>{
const $=i=>document.getElementById(i),ld=$('ld');
const fail=m=>{ld.textContent=m;ld.classList.add('show')};
window.onerror=m=>fail('Error: '+m);
if(typeof THREE==='undefined'){fail('Could not load the 3D engine. Check your connection and reload.');return}
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
const show=id=>document.querySelectorAll('.ov').forEach(e=>e.classList.toggle('show',e.id===id));
/* ---------- save ---------- */
let SV={best:0,coins:0,own:[0],skin:0,snd:1,mv:.6,sv:.8,m:{}};
try{Object.assign(SV,JSON.parse(localStorage.getItem('mr3d')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('mr3d',JSON.stringify(SV))}catch(e){}};
const day=new Date().toISOString().slice(0,10);
if(SV.m.d!==day)SV.m={d:day,c:0,t:0,a:0,b:0};
/* ---------- audio (synthesized) ---------- */
let AC,mg,sg,st='menu';
function initAudio(){if(AC){if(AC.state==='suspended')AC.resume();return}
 try{AC=new(window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();sg=AC.createGain();mg.connect(AC.destination);sg.connect(AC.destination);setVol()}catch(e){}}
function setVol(){if(!AC)return;mg.gain.value=SV.snd?SV.mv*.25:0;sg.gain.value=SV.snd?SV.sv:0}
const now=()=>AC?AC.currentTime:0;
function tone(f,d,ty,v,f2,dst,dl){if(!AC)return;const t=now()+(dl||0),o=AC.createOscillator(),g=AC.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v||.3,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(dst||sg);o.start(t);o.stop(t+d+.02)}
const SFX={jump:()=>tone(300,.18,'square',.15,700),land:()=>tone(120,.1,'sine',.3,60),step:()=>tone(90,.05,'triangle',.12,50),
 coin:()=>{tone(988,.08,'square',.1);tone(1319,.15,'square',.1,0,0,.07)},
 pow:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.12,'triangle',.25,0,0,i*.07)),
 hit:()=>tone(150,.4,'sawtooth',.4,40),over:()=>[392,330,262,196].forEach((f,i)=>tone(f,.25,'triangle',.3,0,0,i*.2)),
 cluck:()=>{tone(600,.07,'square',.12,900);tone(500,.08,'square',.12,800,0,.1);tone(700,.1,'square',.12,450,0,.2)}};
const mel=[523,659,784,659,587,698,880,698,523,659,784,1047,988,784,659,587];let mi=0;
setInterval(()=>{if(!AC||!SV.snd||st==='pause'||st==='over')return;const f=mel[mi++%16];tone(f,.2,'triangle',.5,0,mg);if(mi%2)tone(f/4,.2,'sine',.6,0,mg)},230);
/* ---------- scene ---------- */
const R=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8fd3ff);scene.fog=new THREE.Fog(0x8fd3ff,50,140);
const cam=new THREE.PerspectiveCamera(60,1,.1,200);
scene.add(new THREE.HemisphereLight(0xffffff,0x6b8f4e,.95));
const sun=new THREE.DirectionalLight(0xfff2c0,.9);sun.position.set(8,20,6);sun.target.position.set(0,0,-6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-12,right:12,top:20,bottom:-20,near:1,far:50});scene.add(sun,sun.target);
const G={box:new THREE.BoxGeometry(1,1,1),sph:new THREE.SphereGeometry(1,14,10),cyl:new THREE.CylinderGeometry(1,1,1,12),cone:new THREE.ConeGeometry(1,1,12)};
const triG=new THREE.CylinderGeometry(.5,.5,.05,3);triG.rotateX(Math.PI/2);
const tG=new THREE.TorusGeometry(.7,.06,8,20),mc={};
const mat=c=>mc[c]||(mc[c]=new THREE.MeshLambertMaterial({color:c}));
function mesh(g,c,x,y,z,sx,sy,sz,par,sh){const m=new THREE.Mesh(g,typeof c==='number'?mat(c):c);m.position.set(x,y,z);m.scale.set(sx,sy||sx,sz||sx);if(sh)m.castShadow=true;if(par)par.add(m);return m}
const L=30,NS=6,LX=[-2.4,0,2.4],segs=[];
for(let i=0;i<NS;i++){const g=new THREE.Group();
 mesh(G.box,0x3b3b45,0,-.05,0,7.6,.1,L,g).receiveShadow=true;
 [-1,1].forEach(s=>{mesh(G.box,0x62c24d,s*13.8,-.1,0,20,.1,L,g).receiveShadow=true;mesh(G.box,0xffffff,s*3.7,.02,0,.15,.02,L,g);mesh(G.box,0xdcb98a,s*4.6,.55,0,.1,.12,L,g);
  for(let k=0;k<6;k++)mesh(G.box,0xdcb98a,s*4.6,.4,-12.5+k*5,.2,.8,.2,g);
  for(let k=0;k<2;k++){const x=s*rnd(6.5,9),z=rnd(-13,13);mesh(G.cyl,0x7a4a21,x,1,z,.25,2,.25,g,1);mesh(G.sph,0x2e9d3f,x,3,z,1.5,1.6,1.5,g,1)}
  mesh(G.box,pick([0xf48fb1,0x90caf9,0xffcc80,0xb39ddb]),s*rnd(15,19),5,rnd(-8,8),5,10,5,g)});
 for(let k=0;k<3;k++){mesh(G.box,0xffffff,-1.2,.02,-10+k*10,.12,.02,3,g);mesh(G.box,0xffffff,1.2,.02,-10+k*10,.12,.02,3,g)}
 g.position.z=10-i*L;scene.add(g);segs.push(g)}
const clouds=[];for(let i=0;i<7;i++){const c=new THREE.Group();for(let k=0;k<4;k++)mesh(G.sph,0xffffff,k*2-3,rnd(0,1),rnd(-1,1),rnd(1.5,2.5),1.3,1.5,c);c.position.set(rnd(-60,60),rnd(22,34),rnd(-130,-40));scene.add(c);clouds.push(c)}
/* ---------- rooster ---------- */
const SK=[{n:'Classic',p:0,b:0xffd43b,c:0xe53935,k:0xff9800,t:0xf9a825},{n:'Fire',p:60,b:0xff7043,c:0xb71c1c,k:0xffc107,t:0xd84315},
{n:'Snow',p:120,b:0xffffff,c:0xff4081,k:0xffb300,t:0xb3e5fc},{n:'Mint',p:200,b:0x69f0ae,c:0x00897b,k:0xffa000,t:0x00bfa5},{n:'Royal',p:350,b:0x9575cd,c:0xffd600,k:0xffd600,t:0x4527a0}];
const lm=()=>new THREE.MeshLambertMaterial(),bodyM=lm(),combM=lm(),beakM=lm(),tailM=lm();
const applySkin=i=>{const s=SK[i];bodyM.color.setHex(s.b);combM.color.setHex(s.c);beakM.color.setHex(s.k);tailM.color.setHex(s.t)};
const P=new THREE.Group(),pv=new THREE.Group();P.add(pv);scene.add(P);
mesh(G.sph,bodyM,0,.95,.05,.55,.55,.65,pv,1);mesh(G.sph,bodyM,0,1.6,-.25,.38,.38,.38,pv,1);
const bk=mesh(G.cone,beakM,0,1.55,-.7,.13,.3,.13,pv);bk.rotation.x=-Math.PI/2;
[[1.97,-.3,.1],[2.02,-.18,.12],[1.95,-.05,.1]].forEach(a=>mesh(G.sph,combM,0,a[0],a[1],.09,a[2]+.04,.09,pv));
mesh(G.sph,combM,0,1.38,-.5,.07,.14,.07,pv);
[-1,1].forEach(s=>{mesh(G.sph,0xffffff,s*.19,1.68,-.57,.11,.12,.08,pv);mesh(G.sph,0x111111,s*.2,1.69,-.62,.06,.06,.06,pv)});
for(let i=-1;i<2;i++){const m=mesh(G.cone,tailM,i*.2,1.45,.7,.14,.7,.14,pv,1);m.rotation.x=.9;m.rotation.z=-i*.4}
const legs=[],wings=[];
[-1,1].forEach(s=>{const lg=new THREE.Group();lg.position.set(s*.22,.55,0);mesh(G.cyl,beakM,0,-.25,0,.05,.5,.05,lg);mesh(G.box,beakM,0,-.52,-.1,.2,.06,.3,lg);pv.add(lg);legs.push(lg);
 const w=new THREE.Group();w.position.set(s*.52,1.15,.05);mesh(G.sph,tailM,s*.06,-.2,0,.1,.32,.4,w,1);pv.add(w);wings.push(w)});
const shield=mesh(G.sph,new THREE.MeshBasicMaterial({color:0x4fc3f7,transparent:true,opacity:.3}),0,1,0,1.5,1.5,1.5,P);shield.visible=false;
const ring=new THREE.Mesh(tG,new THREE.MeshBasicMaterial({color:0xe53935}));ring.rotation.x=Math.PI/2;ring.position.y=1;ring.visible=false;P.add(ring);
/* ---------- pools ---------- */
const coinG=new THREE.CylinderGeometry(.4,.4,.08,16);coinG.rotateX(Math.PI/2);
const coinM=new THREE.MeshLambertMaterial({color:0xffc400,emissive:0x664400});
const cpool=[],coins=[],obs=[],pws=[],parts=[];
for(let i=0;i<80;i++){const m=new THREE.Mesh(coinG,coinM);m.visible=false;scene.add(m);cpool.push(m)}
for(let i=0;i<40;i++){const m=new THREE.Mesh(G.sph,new THREE.MeshBasicMaterial({color:0xffd54f}));m.scale.setScalar(.09);m.visible=false;m.userData={vx:0,vy:0,vz:0,l:0};scene.add(m);parts.push(m)}
const addCoin=(x,y,z)=>{const m=cpool.pop();if(!m)return;m.position.set(x,y,z);m.visible=true;coins.push(m)};
const rmCoin=i=>{const m=coins[i];m.visible=false;cpool.push(m);coins.splice(i,1)};
function burst(x,y,z,c,n){for(const p of parts){if(n<=0)break;if(p.visible)continue;n--;p.visible=true;p.material.color.setHex(c);p.position.set(x,y,z);const u=p.userData;u.vx=rnd(-4,4);u.vy=rnd(1,6);u.vz=rnd(-3,3);u.l=.5}}
const PW=[{k:'mag',c:0xe53935,e:'🧲',d:9,n:'Magnet!'},{k:'shd',c:0x29b6f6,e:'🛡️',d:15,n:'Shield!'},{k:'x2',c:0xab47bc,e:'×2',d:10,n:'Coins ×2!'},{k:'spd',c:0x66bb6a,e:'⚡',d:6,n:'Boost!'}];
PW.forEach(d=>{const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d');x.font='40px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(d.e,32,36);
 d.sm=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv)});d.m1=new THREE.MeshLambertMaterial({color:d.c,emissive:d.c,emissiveIntensity:.6,transparent:true,opacity:.8});d.m2=new THREE.MeshBasicMaterial({color:d.c});
 const s=document.createElement('span');s.id='b_'+d.k;$('pb').appendChild(s);d.el=s});
function addPw(x,z){const d=pick(PW),g=new THREE.Group();mesh(G.sph,d.m1,0,0,0,.5,.5,.5,g);g.add(new THREE.Mesh(tG,d.m2));const s=new THREE.Sprite(d.sm);s.scale.set(.9,.9,1);g.add(s);g.position.set(x,1.2,z);g.userData=d;scene.add(g);pws.push(g)}
function mkObs(t,x){const g=new THREE.Group();let o={y0:0,y1:.9,hw:1,hd:.7};
 if(t==='crate'){mesh(G.box,0xb5834a,0,.45,0,1.8,.9,1.2,g,1);mesh(G.box,0x7d5528,0,.45,.61,1.8,.14,.04,g);mesh(G.box,0x7d5528,0,.45,.61,.14,.9,.04,g)}
 else if(t==='barrier'){[-.67,0,.67].forEach((a,i)=>mesh(G.box,i%2?0xffffff:0xe53935,a,.7,0,.67,.35,.2,g,1));[-.85,.85].forEach(a=>mesh(G.box,0x555555,a,.4,0,.14,.8,.14,g));mesh(triG,0xffd600,0,1.4,0,1.1,1.1,1.1,g);mesh(G.box,0x222222,0,1.38,.04,.1,.4,.06,g)}
 else if(t==='over'){o={y0:1.2,y1:3,hw:1.05,hd:.5};[-1,1].forEach(s=>mesh(G.box,0x555555,s*1.05,1.5,0,.2,3,.2,g,1));mesh(G.box,0xffd600,0,1.7,0,2.3,.9,.4,g,1);[-.8,0,.8].forEach(a=>mesh(G.box,0x222222,a,1.7,.21,.4,.9,.02,g))}
 else{const tr=t==='truck';o={y0:0,y1:tr?2.8:1.9,hw:1.05,hd:tr?2.5:2};
  if(tr){mesh(G.box,pick([0xeeeeee,0xffb74d,0x80cbc4]),0,1.55,.6,2.1,2.4,3.6,g,1);mesh(G.box,0x1565c0,0,1.1,-1.9,2,1.6,1.4,g,1)}
  else{mesh(G.box,pick([0xef5350,0x42a5f5,0x66bb6a,0xab47bc]),0,.55,0,2,.8,4,g,1);mesh(G.box,0xcfe8ff,0,1.4,.2,1.7,.95,2.2,g,1)}
  [-1,1].forEach(s=>[-1,1].forEach(z=>{const w=mesh(G.cyl,0x111111,s*1.05,.35,z*(tr?1.5:1.2),.35,.3,.35,g);w.rotation.z=Math.PI/2}))}
 g.position.x=x;o.g=g;return o}
function trail(l,z,n,y){for(let i=0;i<n;i++)addCoin(LX[l],y,z-i*2.2+n*1.1)}
function spawnRow(z){const ls=[0,1,2].sort(()=>Math.random()-.5),t=pick(['crate','barrier','over','car','truck','coin','coin']);let free=ls;
 if(t!=='coin'){const big=t==='car'||t==='truck',k=big?1+(Math.random()<.5):(Math.random()<.2?3:1+(Math.random()<.5));free=ls.slice(k);
  ls.slice(0,k).forEach(l=>{const o=mkObs(t,LX[l]);o.g.position.z=z;scene.add(o.g);obs.push(o)})}
 else if(free[1]!==undefined)trail(free[1],z-4,3,1);
 if(free.length){trail(free[0],z,4+(Math.random()*4|0),1);if(Math.random()<.14)addPw(LX[free[free.length-1]],z-12)}else trail(1,z,3,2.3)}
/* ---------- state ---------- */
const T={mag:0,shd:0,x2:0,spd:0},pl={lane:1,x:0,y:0,vy:0,slide:0};
let at=0,last=0,sp=16,vv=0,dist=0,runT=0,coinsRun=0,spawnD=0,gap=40,shake=0,cdT=0,dyT=0,H=2,sq=0,rp=0,stepT=0,cluckT=8,hudT=0,prev='play';
const cp=new THREE.Vector3(0,1.7,4.4),cl=new THREE.Vector3(0,1.1,0),tp=new THREE.Vector3(),tl=new THREE.Vector3();
const score=()=>(dist/2|0)+coinsRun*5;
function pop(t){const e=$('pops');if(e.childElementCount>4)return;const d=document.createElement('div');d.className='pop';d.textContent=t;d.style.marginLeft=rnd(-60,60)+'px';e.appendChild(d);setTimeout(()=>d.remove(),800)}
function clearAll(){obs.forEach(o=>scene.remove(o.g));obs.length=0;for(let i=coins.length-1;i>=0;i--)rmCoin(i);pws.forEach(g=>scene.remove(g));pws.length=0;parts.forEach(p=>p.visible=false)}
function upMenu(){$('mb').textContent='🏆 Best '+SV.best;$('mc').textContent='🪙 '+SV.coins;const m=SV.m;
 $('ms').innerHTML='Daily: 🪙 100 coins ('+Math.min(m.c,100)+'/100)'+(m.a?' ✅':'')+' · ⏱ Survive 60 s ('+Math.min(m.t|0,60)+'/60)'+(m.b?' ✅':'')+' · +50🪙 each'}
function goMenu(){st='menu';clearAll();vv=0;pl.x=0;pl.y=0;pl.lane=1;pl.slide=0;P.position.set(0,0,0);pv.rotation.set(0,0,0);pv.scale.set(1,1,1);shield.visible=ring.visible=false;
 applySkin(SV.skin);upMenu();$('hud').classList.remove('show');$('tc').classList.remove('on');$('cd').style.display='none';show('menu')}
function startRun(){initAudio();clearAll();Object.assign(pl,{lane:1,x:0,y:0,vy:0,slide:0});dist=runT=coinsRun=0;T.mag=T.shd=T.x2=T.spd=0;sp=16;vv=0;gap=40;spawnD=gap*.45;
 P.rotation.set(0,0,0);P.position.set(0,0,0);pv.rotation.set(0,0,0);pv.scale.set(1,1,1);cdT=3.6;st='count';show('');applySkin(SV.skin);
 $('hud').classList.add('show');$('tc').classList.add('on');$('cd').style.display='flex';SFX.cluck()}
function showOver(){const s=score(),m=SV.m;let n='';if(s>SV.best){SV.best=s;n='🏆 New best!<br>'}
 m.c+=coinsRun;m.t=Math.max(m.t,runT);
 if(!m.a&&m.c>=100){m.a=1;SV.coins+=50;n+='✅ Mission: 100 coins! +50🪙<br>'}
 if(!m.b&&m.t>=60){m.b=1;SV.coins+=50;n+='✅ Mission: survive 60 s! +50🪙<br>'}
 save();$('os').textContent=s;$('od').textContent=(dist/2|0)+' m';$('oc').textContent=coinsRun;$('ob').textContent=SV.best;$('on').innerHTML=n;
 $('hud').classList.remove('show');$('tc').classList.remove('on');show('over');upMenu()}
function togglePause(){if(st==='play'||st==='count'){prev=st;st='pause';save();show('pause')}else if(st==='pause'){st=prev;show('')}}
function act(a){if(st!=='play')return;
 if(a==='l'&&pl.lane>0)pl.lane--;else if(a==='r'&&pl.lane<2)pl.lane++;
 else if(a==='u'&&pl.y<=0&&pl.vy<=0){pl.vy=11;pl.slide=0;SFX.jump()}
 else if(a==='d'){if(pl.y>0)pl.vy=-22;pl.slide=.7}}
function hit(i){const o=obs[i];
 if(T.spd>0||T.shd>0){if(T.spd<=0)T.shd=0;burst(o.g.position.x,1,0,0xffffff,14);scene.remove(o.g);obs.splice(i,1);shake=.3;SFX.hit();pop(T.spd>0?'Smash!':'Shield broke!');return}
 st='dying';dyT=0;shake=.7;SFX.hit();SFX.cluck()}
/* ---------- update ---------- */
function update(dt){at+=dt;if(st==='pause')return;let tv=0;
 if(st==='menu'){tv=8;P.rotation.y=Math.PI+Math.sin(at)*.5}
 else if(st==='count'){cdT-=dt;const n=Math.ceil(cdT-.6);$('cd').textContent=n>0?n:'GO!';if(cdT<=0){st='play';$('cd').style.display='none'}}
 else if(st==='play'){runT+=dt;sp=Math.min(16+runT*.35,36);tv=sp*(T.spd>0?1.5:1);
  for(const k in T)if(T[k]>0)T[k]-=dt;
  spawnD+=vv*dt;if(spawnD>=gap){spawnD=0;gap=Math.max(26,40-runT*.25);spawnRow(-115)}
  pl.x+=(LX[pl.lane]-pl.x)*Math.min(1,dt*14);
  if(pl.y>0||pl.vy>0){pl.vy-=30*dt;pl.y+=pl.vy*dt;if(pl.y<=0){pl.y=0;pl.vy=0;sq=.3;SFX.land()}}
  if(pl.slide>0)pl.slide-=dt;H=pl.slide>0?.9:2;
  for(let i=obs.length-1;i>=0;i--){const o=obs[i],z=o.g.position.z;
   if(Math.abs(z)<o.hd+.3&&Math.abs(o.g.position.x-pl.x)<o.hw+.3&&pl.y<o.y1&&pl.y+H>o.y0){hit(i);if(st==='dying')break}}
  stepT-=dt;if(pl.y<=0&&stepT<=0){SFX.step();stepT=.3-vv*.003}
  cluckT-=dt;if(cluckT<=0){SFX.cluck();cluckT=rnd(8,15)}
  dist+=vv*dt}
 else if(st==='dying'){dyT+=dt;if(dyT>.9){st='over';SFX.over();showOver()}}
 vv+=(tv-vv)*Math.min(1,dt*(st==='play'?3:8));
 const d=vv*dt;
 for(const s of segs){s.position.z+=d;if(s.position.z>25)s.position.z-=NS*L}
 for(const c of clouds){c.position.z+=d*.15+dt*.5;if(c.position.z>40)c.position.z=-140}
 for(let i=obs.length-1;i>=0;i--){const o=obs[i];o.g.position.z+=d;if(o.g.position.z>10){scene.remove(o.g);obs.splice(i,1)}}
 const cy=pl.y+H/2,pl_=st==='play';
 for(let i=coins.length-1;i>=0;i--){const m=coins[i],q=m.position;q.z+=d;m.rotation.y+=dt*5;
  if(pl_&&T.mag>0){const dx=pl.x-q.x,dz=-q.z;if(dx*dx+dz*dz<64){const k=Math.min(1,dt*7);q.x+=dx*k;q.z+=dz*k*.6;q.y+=(1-q.y)*k}}
  if(pl_&&Math.abs(q.z)<.9&&Math.abs(q.x-pl.x)<.9&&Math.abs(q.y-cy)<1.1){const g=T.x2>0?2:1;coinsRun+=g;SV.coins+=g;SFX.coin();burst(q.x,q.y,q.z,0xffd54f,6);pop('+'+g);rmCoin(i)}
  else if(q.z>8)rmCoin(i)}
 for(let i=pws.length-1;i>=0;i--){const g=pws[i],q=g.position;q.z+=d;g.rotation.y+=dt*3;q.y=1.2+Math.sin(at*4)*.15;
  if(pl_&&Math.abs(q.z)<1.1&&Math.abs(q.x-pl.x)<1.1&&Math.abs(q.y-cy)<1.5){const u=g.userData;T[u.k]=u.d;SFX.pow();burst(q.x,q.y,q.z,u.c,18);pop(u.n);scene.remove(g);pws.splice(i,1)}
  else if(q.z>8){scene.remove(g);pws.splice(i,1)}}
 for(const p of parts)if(p.visible){const u=p.userData;u.l-=dt;p.position.x+=u.vx*dt;p.position.y+=u.vy*dt;p.position.z+=u.vz*dt+d;u.vy-=12*dt;if(u.l<=0)p.visible=false}
 /* rooster animation */
 const air=pl.y>.05;rp+=dt*(8+vv*.45);P.position.x=pl.x;P.position.y=pl.y;sq=Math.max(0,sq-dt*2);
 if(st==='dying'){P.rotation.y+=dt*12;pv.rotation.z=Math.min(1.5,pv.rotation.z+dt*6)}
 else if(st!=='over'){const s=Math.sin(rp),sl=pl.slide>0&&pl_;
  legs[0].rotation.x=air?-.9:s;legs[1].rotation.x=air?.7:-s;
  const wa=air?1.2:.35+Math.abs(Math.sin(rp*1.3))*.5;wings[0].rotation.z=-wa;wings[1].rotation.z=wa;
  pv.position.y=air||sl?0:Math.abs(s)*.1;pv.rotation.x+=((sl?-1.15:0)-pv.rotation.x)*Math.min(1,dt*20);
  pv.scale.set(1+sq*.5,1-sq+(air&&pl.vy>0?.1:0),1+sq*.5)}
 shield.visible=T.shd>0&&st!=='dying';ring.visible=T.mag>0;ring.scale.setScalar(1.7+Math.sin(at*8)*.15);
 /* camera */
 const m=st==='menu';tp.set(m?0:pl.x*.6,m?1.7:4.6,m?4.4:(innerWidth<innerHeight?9.5:8));tl.set(m?0:pl.x*.4,m?1.1:1.4,m?0:-6);
 const k=Math.min(1,dt*3);cp.lerp(tp,k);cl.lerp(tl,k);cam.position.copy(cp);
 if(shake>0){cam.position.x+=rnd(-1,1)*shake;cam.position.y+=rnd(-1,1)*shake;shake=Math.max(0,shake-dt*1.6)}
 cam.lookAt(cl);const ft=(innerWidth<innerHeight?72:60)+(T.spd>0?12:0);cam.fov+=(ft-cam.fov)*Math.min(1,dt*4);cam.updateProjectionMatrix();
 /* HUD at 10 Hz */
 hudT-=dt;if(hudT<=0){hudT=.1;$('sc').textContent=score();$('cn').textContent='🪙 '+coinsRun;PW.forEach(p=>{const e=p.el;if(T[p.k]>0){e.style.display='inline-block';e.textContent=p.e+' '+Math.ceil(T[p.k])}else e.style.display='none'})}}
function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.05);last=t;update(dt);R.render(scene,cam)}
/* ---------- input ---------- */
const KM={ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',ArrowUp:'u',KeyW:'u',Space:'u',ArrowDown:'d',KeyS:'d'};
addEventListener('keydown',e=>{initAudio();if(e.code==='Escape'||e.code==='KeyP'){togglePause();return}
 const a=KM[e.code];if(a&&(st==='play'||st==='count')){e.preventDefault();if(!e.repeat)act(a)}});
let sx=0,sy=0,sw=0;const cv=$('c');
cv.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;sw=1});
cv.addEventListener('pointermove',e=>{if(!sw)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))>30){act(Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d'));sx=e.clientX;sy=e.clientY}});
addEventListener('pointerup',()=>sw=0);addEventListener('pointercancel',()=>sw=0);
addEventListener('pointerdown',initAudio);
document.querySelectorAll('#tc button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();act(b.dataset.a)}));
document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&st==='play')togglePause()});
addEventListener('pagehide',save);
function rs(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight}
addEventListener('resize',rs);addEventListener('orientationchange',rs);
/* ---------- UI wiring ---------- */
function buildSkins(){const el=$('sk');el.innerHTML='';SK.forEach((s,i)=>{const own=SV.own.includes(i),d=document.createElement('div');d.className='sc'+(SV.skin===i?' on':'');
 d.innerHTML='<div class="sw" style="background:#'+s.b.toString(16).padStart(6,'0')+'"></div>'+s.n;
 const b=document.createElement('button');b.className='bt '+(own?'s':'g');b.textContent=SV.skin===i?'Using':own?'Use':'🪙 '+s.p;
 b.onclick=e=>{e.stopPropagation();if(own)SV.skin=i;else if(SV.coins>=s.p){SV.coins-=s.p;SV.own.push(i);SV.skin=i;SFX.pow()}else{b.textContent='Need coins';return}save();applySkin(i);buildSkins();upMenu()};
 d.onclick=()=>applySkin(i);d.appendChild(b);el.appendChild(d)})}
$('play').onclick=startRun;$('pa').onclick=startRun;$('prs').onclick=startRun;$('pr').onclick=togglePause;$('bp').onclick=togglePause;
$('pm').onclick=$('om').onclick=goMenu;$('hwb').onclick=()=>show('how');$('hx').onclick=()=>show('menu');
$('skb').onclick=()=>{buildSkins();show('skin')};$('skx').onclick=()=>{applySkin(SV.skin);show('menu')};
$('snd').checked=!!SV.snd;$('mv').value=SV.mv;$('sv').value=SV.sv;
$('snd').onchange=e=>{SV.snd=e.target.checked?1:0;setVol();save()};
$('mv').oninput=e=>{SV.mv=+e.target.value;setVol();save()};$('sv').oninput=e=>{SV.sv=+e.target.value;setVol();save()};
$('sv').onchange=()=>SFX.coin();
rs();goMenu();requestAnimationFrame(loop);
})();
