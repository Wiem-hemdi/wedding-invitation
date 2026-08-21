// Main interactive behaviors: countdown, RSVP handling, gallery preview, particles, reveal on scroll
document.addEventListener('DOMContentLoaded',function(){
  // Countdown
  const target = new Date('2026-09-20T17:00:00'); // wedding date/time (local) - adjust as needed
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  function updateCountdown(){
    const now = new Date();
    const diff = Math.max(0,target - now);
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    daysEl.textContent = String(days).padStart(2,'0');
    hoursEl.textContent = String(hours).padStart(2,'0');
    minsEl.textContent = String(minutes).padStart(2,'0');
    secsEl.textContent = String(seconds).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown,1000);

  // RSVP form — envoi par email via FormSubmit
  const RSVP_EMAIL = 'wiem.hemdi@polytechnicien.tn';
  const form = document.getElementById('rsvpForm');
  const msg = document.getElementById('rsvpMsg');
  const submitBtn = form.querySelector('button[type="submit"]');

  function showRsvpMessage(text, isError){
    msg.textContent = text;
    msg.classList.toggle('rsvp-error', !!isError);
    msg.hidden = false;
    setTimeout(()=> msg.hidden = true, isError ? 6000 : 5000);
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const data = new FormData(form);
    const payload = {
      _subject: 'RSVP Mariage — Idriss & Insaf',
      _template: 'table',
      _captcha: 'false',
      name: data.get('name'),
      email: data.get('email'),
      guests: data.get('guests'),
      message: data.get('message') || '(aucun message)'
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${RSVP_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error('Erreur serveur');
      form.reset();
      showRsvpMessage('Merci ! Votre confirmation a bien été envoyée.');
    } catch {
      showRsvpMessage('Une erreur est survenue. Réessayez ou écrivez-nous directement par email.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer';
    }
  });

  // Simple reveal on scroll
  const reveals = document.querySelectorAll('.section, .gallery img, .story-photo');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting) ent.target.classList.add('visible');
    });
  },{threshold:0.08});
  reveals.forEach(r=>{r.classList.add('reveal');io.observe(r)});

  // Hero names entrance
  const namesEl = document.querySelector('.names');
  if(namesEl) setTimeout(()=> namesEl.classList.add('visible'), 400);

  // Gallery click -> open in new tab (simple preview)
  document.getElementById('galleryGrid').addEventListener('click',function(e){
    const img = e.target.closest('img');
    if(!img) return;
    window.open(img.src,'_blank');
  });

  // Particles background (lightweight)
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  const particles = [];
  const confetti = [];
  function rand(min,max){return Math.random()*(max-min)+min}
  function initParticles(){
    particles.length = 0;
    const count = Math.round((W*H)/80000);
    for(let i=0;i<count;i++){
      particles.push({x:rand(0,W),y:rand(0,H),r:rand(0.6,2.2),vx:rand(-0.3,0.3),vy:rand(-0.1,0.1),alpha:rand(0.1,0.9)});
    }
  }
  // confetti helper
  function spawnConfettiBurst(x,y,amount=40){
    const colors = ['#b8923e','#d4b56a','#7a9a8a','#faf8f5','#e8f0ec'];
    for(let i=0;i<amount;i++){
      confetti.push({
        x:x||rand(0,W), y:y||rand(0,H/3),
        vx:rand(-6,6), vy:rand(-10,-2),
        sz:rand(6,12), rot:rand(0,360), vr:rand(-6,6),
        color:colors[Math.floor(rand(0,colors.length))], life:rand(60,140)
      });
    }
  }
  function onResize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;initParticles()}
  addEventListener('resize',onResize);
  initParticles();
  function tick(){
    ctx.clearRect(0,0,W,H);
    // draw background particles
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      // slight vertical bob
      p.y += Math.sin((Date.now()+p.x)/5000)*0.01;
      if(p.x < -10) p.x = W+10;
      if(p.x > W+10) p.x = -10;
      if(p.y < -10) p.y = H+10;
      if(p.y > H+10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = `rgba(184,146,62,${p.alpha*0.35})`;
      ctx.arc(p.x,p.y,p.r*1.2,0,Math.PI*2);
      ctx.fill();
    }

    // draw confetti pieces
    for(let i=confetti.length-1;i>=0;i--){
      const c = confetti[i];
      c.vy += 0.35; // gravity
      c.x += c.vx; c.y += c.vy; c.rot += c.vr; c.life--;
      ctx.save();
      ctx.translate(c.x,c.y);
      ctx.rotate(c.rot*Math.PI/180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.sz/2,-c.sz/2,c.sz,c.sz*0.6);
      ctx.restore();
      if(c.life<=0 || c.y>H+50) confetti.splice(i,1);
    }
    requestAnimationFrame(tick);
  }
  tick();

  // spawn welcoming confetti on load (subtle)
  setTimeout(()=> spawnConfettiBurst(W/2,H/4,32),650);

  // parallax: move particle field slightly on mouse
  let mx=0,my=0;
  addEventListener('mousemove',e=>{mx=(e.clientX-W/2)/W; my=(e.clientY-H/2)/H});
  setInterval(()=>{
    for(const p of particles){ p.x += mx*0.3; p.y += my*0.15; }
  },80);

  // Smooth scroll for nav
  document.querySelectorAll('.main-nav a, .cta').forEach(a=>{
    a.addEventListener('click',function(e){
      if(this.hash && document.querySelector(this.hash)){
        e.preventDefault();
        document.querySelector(this.hash).scrollIntoView({behavior:'smooth'});
      }
    });
  });

});
