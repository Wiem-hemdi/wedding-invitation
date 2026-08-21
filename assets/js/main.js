// Main interactive behaviors: countdown, RSVP handling, gallery preview, particles, reveal on scroll
document.addEventListener('DOMContentLoaded',function(){
  // Background music
  const overlay = document.getElementById('entryOverlay');
  const openBtn = document.getElementById('openInvite');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  bgMusic.volume = 0.35;

  function setMusicUI(playing){
    musicToggle.hidden = false;
    musicToggle.classList.toggle('is-muted', !playing);
    musicToggle.querySelector('.music-on').hidden = !playing;
    musicToggle.querySelector('.music-off').hidden = playing;
    musicToggle.setAttribute('aria-label', playing ? 'Couper la musique' : 'Activer la musique');
  }

  async function startMusic(){
    try {
      await bgMusic.play();
      setMusicUI(true);
    } catch {
      setMusicUI(false);
    }
  }

  openBtn.addEventListener('click', async function(){
    overlay.classList.add('is-closed');
    document.body.classList.add('invite-open');
    await startMusic();
    setTimeout(()=>{
      try{ spawnConfettiBurst(W/2, H/4, 40); }catch(e){}
    }, 400);
  });

  musicToggle.addEventListener('click', async function(){
    if(bgMusic.paused){
      await startMusic();
    } else {
      bgMusic.pause();
      setMusicUI(false);
    }
  });

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
    const secStr = String(seconds).padStart(2,'0');
    if(secsEl.textContent !== secStr){
      secsEl.textContent = secStr;
      const secBox = secsEl.closest('div');
      if(secBox){
        secBox.classList.remove('tick-pop');
        void secBox.offsetWidth;
        secBox.classList.add('tick-pop');
      }
    } else {
      secsEl.textContent = secStr;
    }
    daysEl.textContent = String(days).padStart(2,'0');
    hoursEl.textContent = String(hours).padStart(2,'0');
    minsEl.textContent = String(minutes).padStart(2,'0');
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
      event: data.get('event'),
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
      // celebratory confetti on successful RSVP
      try{ spawnConfettiBurst(W/2, H/3, 48); }catch(e){}
    } catch {
      showRsvpMessage('Une erreur est survenue. Réessayez ou écrivez-nous directement par email.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer';
    }
  });

  // Bottom nav — highlight active section
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  const navSections = ['hero', 'events', 'gallery', 'rsvp', 'contact'];
  const sectionEls = navSections.map(id => document.getElementById(id)).filter(Boolean);

  function setActiveNav(id){
    navItems.forEach(a => a.classList.toggle('active', a.dataset.nav === id));
  }

  const navObserver = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting) setActiveNav(ent.target.id);
    });
  }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });
  sectionEls.forEach(s => navObserver.observe(s));
  setActiveNav('hero');

  // Scroll reveal + timeline stagger
  const reveals = document.querySelectorAll('.section, .gallery img, .story-photo, .event-card, .contact-block, .countdown');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(!ent.isIntersecting) return;
      ent.target.classList.add('visible');
      ent.target.querySelectorAll('.timeline').forEach(tl => tl.classList.add('animate'));
    });
  },{threshold:0.1});
  reveals.forEach(r=>{
    r.classList.add('reveal');
    if(r.closest('#contact')) r.classList.add('reveal-left');
    io.observe(r);
  });

  // Hero parallax on scroll (background only — keeps kenBurns animation)
  const heroBg = document.querySelector('.hero-bg');
  const hero = document.getElementById('hero');
  if(heroBg && hero){
    let ticking = false;
    function parallaxHero(){
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
      heroBg.style.backgroundPosition = `center ${25 + progress * 10}%`;
      ticking = false;
    }
    addEventListener('scroll', ()=>{
      if(!ticking){ requestAnimationFrame(parallaxHero); ticking = true; }
    }, {passive:true});
    parallaxHero();
  }

  // Gallery click -> open in new tab (simple preview)
  document.getElementById('galleryGrid').addEventListener('click',function(e){
    const img = e.target.closest('img');
    if(!img) return;
    window.open(img.src,'_blank');
  });

  // Particles background (lightweight)
  const canvas = document.getElementById('particles');
  const shell = document.querySelector('.app-shell');
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const confetti = [];
  function rand(min,max){return Math.random()*(max-min)+min}
  function sizeCanvas(){
    W = canvas.width = shell ? shell.offsetWidth : innerWidth;
    H = canvas.height = shell ? shell.offsetHeight : innerHeight;
  }
  function initParticles(){
    particles.length = 0;
    const count = Math.round((W*H)/70000);
    for(let i=0;i<count;i++){
      particles.push({x:rand(0,W),y:rand(0,H),r:rand(0.6,2.2),vx:rand(-0.35,0.35),vy:rand(-0.15,0.15),alpha:rand(0.15,0.7)});
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
  function onResize(){ sizeCanvas(); initParticles(); }
  addEventListener('resize',onResize);
  sizeCanvas();
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

  // spawn welcoming confetti on load (after invitation opened only — handled in openBtn)

  // parallax: move particles on touch/mouse
  let mx=0,my=0;
  addEventListener('mousemove',e=>{
    if(!shell) return;
    const r = shell.getBoundingClientRect();
    mx=(e.clientX-r.left-W/2)/W;
    my=(e.clientY-r.top-H/2)/H;
  });
  addEventListener('touchmove',e=>{
    if(!shell || !e.touches[0]) return;
    const r = shell.getBoundingClientRect();
    const t = e.touches[0];
    mx=(t.clientX-r.left-W/2)/W;
    my=(t.clientY-r.top-H/2)/H;
  },{passive:true});
  setInterval(()=>{
    for(const p of particles){ p.x += mx*0.4; p.y += my*0.2; }
  },80);

  // Smooth scroll for nav
  document.querySelectorAll('.bottom-nav a, .cta').forEach(a=>{
    a.addEventListener('click',function(e){
      if(this.hash && document.querySelector(this.hash)){
        e.preventDefault();
        document.querySelector(this.hash).scrollIntoView({behavior:'smooth'});
      }
    });
  });

});
