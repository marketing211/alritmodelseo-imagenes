const {chromium}=require('playwright');const fs=require('fs');
const data=JSON.parse(fs.readFileSync(process.argv[2]));const out=process.argv[3];fs.mkdirSync(out,{recursive:true});
const css=`*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Urbanist}
.dark{background:#1c1917;color:#f5f5f4}.light{background:#f5f5f4;color:#1c1917}
.pad{position:absolute;left:96px;right:96px;top:110px;bottom:260px;display:flex;flex-direction:column;justify-content:center}
.k{font-family:Urbanist;font-weight:600;font-size:34px;letter-spacing:.24em;text-transform:uppercase;color:#f59e0b;margin-bottom:44px}
h1{font-family:Fraunces;font-weight:600;font-size:104px;line-height:1.04;letter-spacing:-.015em}
h2{font-family:Fraunces;font-weight:600;font-size:76px;line-height:1.08;letter-spacing:-.01em}
em{font-style:normal;color:#0d9488}.dark em{color:#2dd4bf}
.s{font-size:44px;line-height:1.35;margin-top:56px;color:#a8a29e;font-weight:500}
.b{font-size:46px;line-height:1.42;margin-top:56px;font-weight:500;color:#44403c}
.dark .b{color:#d6d3d1}
.n{font-family:Fraunces;font-weight:600;font-size:200px;line-height:1;color:#0d9488;margin-bottom:30px}
ul{list-style:none;margin-top:60px}li{font-size:48px;font-weight:500;line-height:1.3;padding:30px 0 30px 64px;border-top:2px solid #d6d3d1;position:relative}
li:before{content:"";position:absolute;left:0;top:50px;width:24px;height:24px;background:#0d9488}
.st{margin-top:50px}.st div{padding:34px 0;border-top:2px solid #d6d3d1;display:flex;align-items:baseline;gap:36px}
.st b{font-family:Fraunces;font-weight:600;font-size:120px;color:#0d9488;min-width:270px}.st span{font-size:42px;font-weight:500;line-height:1.3}
.kw b{color:#f59e0b}
.ft{position:absolute;left:96px;right:96px;bottom:80px;display:flex;justify-content:space-between;align-items:center;font-size:32px;font-weight:600;letter-spacing:.04em}
.dark .ft{color:#a8a29e}.light .ft{color:#78716c}
svg.pl{position:absolute;left:0;bottom:150px}
.story{height:1920px}.story .pad{top:300px;bottom:420px}`;
const pulse=(w,y,c)=>`<svg class="pl" width="${w}" height="90" viewBox="0 0 ${w} 90"><polyline fill="none" stroke="${c}" stroke-width="7" stroke-linecap="square" points="0,60 ${w*.55},60 ${w*.55+30},60 ${w*.55+55},18 ${w*.55+85},86 ${w*.55+113},36 ${w*.55+137},60 ${w},60"/><rect x="${w-26}" y="50" width="20" height="20" fill="#f59e0b"/></svg>`;
function html(s,i,n){const dark=['cover','cta','story'].includes(s.t);let c='';
if(s.t=='cover')c=`<div class="k">${s.k}</div><h1>${s.h}</h1><div class="s">${s.s}</div>`;
if(s.t=='text')c=`<h2>${s.h}</h2><div class="b">${s.b}</div>`;
if(s.t=='num')c=`<div class="n">${s.n}</div><h2>${s.h}</h2><div class="b">${s.b}</div>`;
if(s.t=='list')c=`<h2>${s.h}</h2><ul>${s.i.map(x=>`<li>${x}</li>`).join('')}</ul>`;
if(s.t=='stats')c=`<h2>${s.h}</h2><div class="st">${s.i.map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>`;
if(s.t=='cta'||s.t=='story')c=`<h1 style="font-size:${s.t=='story'?110:96}px">${s.h}</h1><div class="b kw" style="font-size:52px">${s.b}</div>`;
const story=s.t=='story';
return `<html><head><link rel="stylesheet" href="file://${__dirname}/fonts.css"><style>${css}</style></head><body class="${dark?'dark':'light'} ${story?'story':''}"><div class="pad">${c}</div>${dark?pulse(1080,0,'#0d9488'):''}<div class="ft"><span>@alritmodelseo</span><span>${n>1?(i+1)+' / '+n:''}</span></div></body></html>`}
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
for(const [k,slides] of Object.entries(data)){for(let i=0;i<slides.length;i++){const s=slides[i];const h=s.t=='story'?1920:1350;
const p=await b.newPage({viewport:{width:1080,height:h}});const f=`${out}/${k}-${i+1}.html`;fs.writeFileSync(f,html(s,i,slides.length));
await p.goto('file://'+f);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
const ov=await p.evaluate(()=>{const pad=document.querySelector('.pad').getBoundingClientRect();const ft=document.querySelector('.ft').getBoundingClientRect();return pad.bottom>ft.top-120});
if(ov)console.log('OVERFLOW',k,i+1);
await p.screenshot({path:`${out}/${k}-${i+1}.png`});await p.close()}}await b.close()})();
