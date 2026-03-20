<script>
/* ── PARTICLE CANVAS ── */
(function(){
  const canvas=document.getElementById('bgCanvas');
  const ctx=canvas.getContext('2d');
  let W,H,particles,mouse={x:-999,y:-999};

  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}

  function Particle(){
    this.x=Math.random()*W;this.y=Math.random()*H;
    this.vx=(Math.random()-.5)*.32;this.vy=(Math.random()-.5)*.32;
    this.r=Math.random()*1.8+.4;this.alpha=Math.random()*.5+.15;
    this.color=Math.random()>.5?'0,255,136':'0,200,255';
  }

  function init(){
    resize();
    const count=Math.min(Math.floor(W*H/7500),130);
    particles=Array.from({length:count},()=>new Particle());
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){const f=((120-dist)/120)*.013;p.x+=dx*f;p.y+=dy*f}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.color},${p.alpha})`;ctx.fill();
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<105){
          ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(0,255,136,${(1-dist/105)*.15})`;ctx.lineWidth=.5;ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize',init);
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});
  window.addEventListener('touchmove',e=>{if(e.touches[0]){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY}},{passive:true});
  window.addEventListener('mouseleave',()=>{mouse.x=-999;mouse.y=-999});
  init();draw();
})();

/* ── EMAILJS ── */
(function(){emailjs.init({publicKey:"p7W3nx5dQDD9WC47n"})})();

document.getElementById('contactForm').addEventListener('submit',async function(e){
  e.preventDefault();
  const btn=document.getElementById('sendBtn'),btnText=document.getElementById('btnText'),btnIcon=document.getElementById('btnIcon');
  const name=document.getElementById('from_name').value.trim();
  const email=document.getElementById('email').value.trim();
  const subject=document.getElementById('subject').value.trim();
  const message=document.getElementById('message').value.trim();
  if(!name||!email||!subject||!message){showToast('Please fill in all fields.','error');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast('Please enter a valid email address.','error');return}
  btn.disabled=true;btnText.textContent='Sending...';btnIcon.textContent='⏳';
  try{
    await emailjs.sendForm('service_7c2j55c','template_bwzpi5r',this);
    await emailjs.send('service_7c2j55c','template_plkqyps',{from_name:name,email,subject,message});
    showToast("✅ Message sent! I'll get back to you soon.",'success');
    this.reset();
  }catch(err){
    console.error(err);showToast('❌ Failed to send. Please email me directly.','error');
  }finally{
    btn.disabled=false;btnText.textContent='Send Message';btnIcon.textContent='→';
  }
});

function showToast(msg,type){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='toast '+type;
  t.offsetHeight;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),4200);
}

/* ── THEME ── */
const root=document.documentElement;
root.setAttribute('data-theme',localStorage.getItem('sdTheme')||'dark');
document.getElementById('themeToggle').addEventListener('click',()=>{
  const n=root.getAttribute('data-theme')==='dark'?'light':'dark';
  root.setAttribute('data-theme',n);localStorage.setItem('sdTheme',n);
});

/* ── MOBILE NAV ── */
const menuBtn=document.getElementById('menuBtn'),mobileNav=document.getElementById('mobileNav');
menuBtn.addEventListener('click',()=>{mobileNav.classList.toggle('open');menuBtn.classList.toggle('open')});
function closeMob(){mobileNav.classList.remove('open');menuBtn.classList.remove('open')}

/* ── SCROLL ── */
window.addEventListener('scroll',()=>{
  const t=document.documentElement.scrollTop,h=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('progress').style.width=(t/h*100)+'%';
  document.getElementById('scrollTop').classList.toggle('show',window.scrollY>400);
});

/* ── TYPED TEXT ── */
const words=['Python / Full Stack Developer','Django REST API Engineer','Web Performance Optimizer','ML Application Developer'];
let wi=0,ci=0,del=false;
const tel=document.getElementById('typed');
function type(){
  const w=words[wi];
  if(!del){tel.innerHTML=w.slice(0,ci+1)+'<span class="cursor-blink"></span>';ci++;
    if(ci===w.length){del=true;setTimeout(type,1900);return}}
  else{tel.innerHTML=w.slice(0,ci-1)+'<span class="cursor-blink"></span>';ci--;
    if(ci===0){del=false;wi=(wi+1)%words.length}}
  setTimeout(type,del?48:70);
}
type();

/* ── COUNTER ANIMATION ── */
function animateCounter(el){
  const target=parseInt(el.dataset.target),suffix=el.dataset.suffix||'';
  let current=0;
  const interval=setInterval(()=>{
    current+=Math.ceil(target/30);
    if(current>=target){current=target;clearInterval(interval)}
    el.textContent=current+suffix;
  },50);
}
let countersStarted=false;
new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting&&!countersStarted){
    countersStarted=true;
    document.querySelectorAll('.stat-n[data-target]').forEach(animateCounter);
  }
},{threshold:.5}).observe(document.getElementById('hero'));

/* ── SCROLL REVEAL ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}});
},{threshold:.08});
document.querySelectorAll('.fi').forEach(el=>obs.observe(el));

/* ── SEC-BAR ANIMATION ── */
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('animate');barObs.unobserve(e.target)}});
},{threshold:.3});
document.querySelectorAll('.sec-bar').forEach(el=>barObs.observe(el));

/* ── NAV ACTIVE ── */
const secs=document.querySelectorAll('section[id],[id]');
const links=document.querySelectorAll('.nav-links a,.mobile-nav a');
const spy=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id));
  });
},{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>spy.observe(s));

/* ── 3D TILT ON CARDS ── */
document.querySelectorAll('.proj-c,.cert-c,.skill-c').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`translateY(-4px) rotateX(${-y*7}deg) rotateY(${x*7}deg)`;
    card.style.transition='transform .05s';
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='';
    card.style.transition='transform .4s ease';
  });
});
</script>