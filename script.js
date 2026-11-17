(()=>{
/* ====== CONFIGURE AQUI ====== */
const WA='5511999999999';   // DDI + DDD + número
const MSG='Olá, Pet love! Quero agendar um horário para o meu cão. Vi a oferta de primeira visita.';
/* ============================ */

const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const root=document.documentElement;
const waURL=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

$$('[data-wa]').forEach(a=>{a.href=waURL(a.dataset.msg||MSG);a.target='_blank';a.rel='noopener'});
$('#yr').textContent=new Date().getFullYear();

/* marquee: duplica o conteúdo para loop contínuo */
const track=$('#track');track.innerHTML+=track.innerHTML;

/* hero ready (após fontes) */
const ready=()=>requestAnimationFrame(()=>root.classList.add('ready'));
(document.fonts&&document.fonts.ready?Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,900))]):Promise.resolve()).then(ready);

/* split de palavras */
function splitWords(el,cls,inner){
  let i=0;
  const walk=n=>[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){
      const f=document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(p=>{
        if(!p)return;
        if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(' '));return}
        const w=document.createElement('span');w.className=cls;
        if(inner){const s=document.createElement('span');s.style.setProperty('--i',i++);s.textContent=p;w.appendChild(s)}else w.textContent=p;
        f.appendChild(w);
      });
      c.replaceWith(f);
    }else if(c.nodeType===1)walk(c);
  });
  walk(el);
}
$$('[data-split]').forEach(el=>splitWords(el,'w',true));
const mani=$('#maniText');splitWords(mani,'sw',false);
const maniW=$$('.sw',mani);

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
$$('[data-r],[data-split],[data-reveal]').forEach(el=>io.observe(el));

/* menu mobile */
const burger=$('#burger');
const toggleMenu=o=>{const open=o??!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',open);document.body.style.overflow=open?'hidden':''};
burger.addEventListener('click',()=>toggleMenu());
$$('#menu a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});

/* acordeões */
$$('[data-acc]').forEach(acc=>{
  const items=$$(':scope > .acc-item',acc);
  items.forEach(it=>$('.acc-btn',it).addEventListener('click',()=>{
    const was=it.classList.contains('open');
    items.forEach(o=>{o.classList.remove('open');$('.acc-btn',o).setAttribute('aria-expanded','false')});
    if(!was){it.classList.add('open');$('.acc-btn',it).setAttribute('aria-expanded','true')}
  }));
});

/* scroll loop único */
const hdr=$('#hdr'),prog=$('.prog'),pars=$$('[data-par]'),steps=$('#steps'),stepEls=$$('.step');
const difItems=$$('.dif-item'),difImgs=$$('.dif-frame .ph'),difN=$('#difN');
let vh=innerHeight,vw=innerWidth,tick=false,lastN=-1,difI=-1;
const req=()=>{if(!tick){tick=true;requestAnimationFrame(update)}};
function update(){
  tick=false;
  const y=scrollY;
  hdr.classList.toggle('scrolled',y>24);
  prog.style.setProperty('--p',(y/Math.max(1,document.documentElement.scrollHeight-vh)).toFixed(4));

  if(!reduce)pars.forEach(el=>{
    const r=el.parentElement.getBoundingClientRect();
    if(r.bottom<-150||r.top>vh+150)return;
    const c=r.top+r.height/2-vh/2;
    el.style.transform=`translate3d(0,${(-c*parseFloat(el.dataset.par)).toFixed(1)}px,0)`;
  });

  // manifesto
  const mr=mani.getBoundingClientRect();
  const mp=clamp((vh*.82-mr.top)/(vh*.37+mr.height));
  const n=Math.round(mp*maniW.length);
  if(n!==lastN){maniW.forEach((w,i)=>w.classList.toggle('on',i<n));lastN=n}

  // diferenciais
  const probe=vh*(vw<960?.72:.5);let best=0,bd=1e9;
  difItems.forEach((it,i)=>{const r=it.getBoundingClientRect();const d=Math.abs(r.top+r.height/2-probe);if(d<bd){bd=d;best=i}});
  if(best!==difI){difI=best;difItems.forEach((it,i)=>it.classList.toggle('active',i===best));difImgs.forEach((im,i)=>im.classList.toggle('on',i===best));difN.textContent='0'+(best+1)}

  // processo
  const sr=steps.getBoundingClientRect();
  const sp=clamp((vh*.72-sr.top)/(sr.height+(vw<960?0:vh*.1)));
  steps.style.setProperty('--prog',sp.toFixed(3));
  stepEls.forEach((s,i)=>s.classList.toggle('on',sp>(i+.15)/stepEls.length));
}
addEventListener('scroll',req,{passive:true});
addEventListener('resize',()=>{vh=innerHeight;vw=innerWidth;req()});
update();

/* antes/depois */
const ba=$('#ba'),rng=$('input',ba);let touched=false;
const setP=v=>ba.style.setProperty('--p',v+'%');
rng.addEventListener('input',()=>{touched=true;setP(rng.value)});
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting&&!reduce){o.disconnect();const t0=performance.now(),D=1600;
  const step=t=>{if(touched)return;const k=clamp((t-t0)/D);const e=1-Math.pow(1-k,4);const v=92-(42*e);setP(v.toFixed(1));rng.value=v;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}},{threshold:.5}).observe(ba);

/* contadores */
const ease=k=>k===1?1:1-Math.pow(2,-10*k);
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,end=parseFloat(el.dataset.count),dec=+el.dataset.dec||0,fmt=v=>v.toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  if(reduce||end===0){el.textContent=fmt(end);return}
  const t0=performance.now(),D=1800;const s=t=>{const k=clamp((t-t0)/D);el.textContent=fmt(end*ease(k));if(k<1)requestAnimationFrame(s)};requestAnimationFrame(s)}),{threshold:.6});
$$('[data-count]').forEach(el=>cio.observe(el));

/* depoimentos */
const qs=$$('.q'),qi=$$('.testi-pics .ph'),pets=$$('.pet');let cur=0,auto=true,visible=false;
const go=i=>{cur=i;qs.forEach((q,k)=>q.classList.toggle('on',k===i));qi.forEach((q,k)=>q.classList.toggle('on',k===i));pets.forEach((p,k)=>{p.classList.toggle('on',k===i);p.setAttribute('aria-pressed',k===i)})};
pets.forEach((p,i)=>p.addEventListener('click',()=>{auto=false;go(i)}));
new IntersectionObserver(es=>visible=es[0].isIntersecting).observe($('#depoimentos'));
if(!reduce)setInterval(()=>{if(auto&&visible)go((cur+1)%qs.length)},7000);

/* magnético (só desktop) */
if(fine&&!reduce)$$('[data-magnet]').forEach(b=>{
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.16}px,${(e.clientY-r.top-r.height/2)*.26}px)`});
  b.addEventListener('mouseleave',()=>b.style.transform='');
});

/* barra fixa mobile */
const bar=$('#bar');let heroV=true,ctaV=false;
const setBar=()=>bar.classList.toggle('show',!heroV&&!ctaV);
new IntersectionObserver(es=>{heroV=es[0].isIntersecting;setBar()},{threshold:0}).observe($('.hero-copy .cta-row'));
new IntersectionObserver(es=>{ctaV=es[0].isIntersecting;setBar()},{threshold:.15}).observe($('#agendar'));

/* formulário → WhatsApp */
const form=$('#book');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const f=new FormData(form),pet=(f.get('pet')||'').trim();
  if(!pet){const i=form.elements.pet;i.focus();i.classList.remove('shake');void i.offsetWidth;i.classList.add('shake');i.style.borderColor='var(--cherry)';return}
  const t=`Olá, Pet love! Quero agendar para o ${pet}.\n• Porte: ${f.get('porte')}\n• Serviço: ${f.get('servico')}\n• Período: ${f.get('periodo')}\nVi a oferta de 10% na primeira visita. Quais horários vocês têm?`;
  window.open(waURL(t),'_blank','noopener');
});
form.elements.pet.addEventListener('input',e=>e.target.style.borderColor='');
})();