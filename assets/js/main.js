// Main interactive behaviors: countdown, RSVP handling, gallery preview, particles, reveal on scroll

// ─── White antique SVG flower for hero section ─────────────────────────────
function makeAntiqueFlower(size, rotation, opacity) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 120 120');
  svg.setAttribute('xmlns', svgNS);
  svg.setAttribute('aria-hidden', 'true');

  // ── Outer peony petals (layer 1) ──
  const outerPetals = 8;
  for (let i = 0; i < outerPetals; i++) {
    const angle = (i / outerPetals) * 360;
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `rotate(${angle} 60 60)`);
    // Main petal ellipse
    const petal = document.createElementNS(svgNS, 'ellipse');
    petal.setAttribute('cx', '60'); petal.setAttribute('cy', '22');
    petal.setAttribute('rx', '11'); petal.setAttribute('ry', '22');
    petal.setAttribute('fill', i % 2 === 0 ? '#fffdf8' : '#f9f4ea');
    petal.setAttribute('stroke', '#e8dcc8');
    petal.setAttribute('stroke-width', '0.4');
    petal.setAttribute('opacity', '0.95');
    g.appendChild(petal);
    // Vein line on petal
    const vein = document.createElementNS(svgNS, 'line');
    vein.setAttribute('x1', '60'); vein.setAttribute('y1', '38');
    vein.setAttribute('x2', '60'); vein.setAttribute('y2', '8');
    vein.setAttribute('stroke', '#d4c8a8'); vein.setAttribute('stroke-width', '0.4');
    vein.setAttribute('opacity', '0.5');
    g.appendChild(vein);
    svg.appendChild(g);
  }

  // ── Inner petals (layer 2 — slightly smaller, rotated 22.5°) ──
  const innerPetals = 8;
  for (let i = 0; i < innerPetals; i++) {
    const angle = (i / innerPetals) * 360 + 22.5;
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `rotate(${angle} 60 60)`);
    const petal = document.createElementNS(svgNS, 'ellipse');
    petal.setAttribute('cx', '60'); petal.setAttribute('cy', '30');
    petal.setAttribute('rx', '8'); petal.setAttribute('ry', '16');
    petal.setAttribute('fill', '#fdf8ee');
    petal.setAttribute('stroke', '#dfd0b0');
    petal.setAttribute('stroke-width', '0.35');
    petal.setAttribute('opacity', '0.9');
    g.appendChild(petal);
    svg.appendChild(g);
  }

  // ── Innermost petals (layer 3 — tightly cupped) ──
  const innermost = 6;
  for (let i = 0; i < innermost; i++) {
    const angle = (i / innermost) * 360 + 10;
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `rotate(${angle} 60 60)`);
    const petal = document.createElementNS(svgNS, 'ellipse');
    petal.setAttribute('cx', '60'); petal.setAttribute('cy', '42');
    petal.setAttribute('rx', '5'); petal.setAttribute('ry', '10');
    petal.setAttribute('fill', '#fffaf0');
    petal.setAttribute('opacity', '0.85');
    g.appendChild(petal);
    svg.appendChild(g);
  }

  // ── Flower center (golden stamens) ──
  const centerGlow = document.createElementNS(svgNS, 'circle');
  centerGlow.setAttribute('cx', '60'); centerGlow.setAttribute('cy', '60');
  centerGlow.setAttribute('r', '10');
  centerGlow.setAttribute('fill', '#f5e6c0'); centerGlow.setAttribute('opacity', '0.9');
  svg.appendChild(centerGlow);

  // Stamen dots
  const stamens = 7;
  for (let i = 0; i < stamens; i++) {
    const angle = (i / stamens) * Math.PI * 2;
    const r = 5.5;
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('cx', String(60 + r * Math.cos(angle)));
    dot.setAttribute('cy', String(60 + r * Math.sin(angle)));
    dot.setAttribute('r', '1.5');
    dot.setAttribute('fill', '#d4a855'); dot.setAttribute('opacity', '0.85');
    svg.appendChild(dot);
  }
  const centerDot = document.createElementNS(svgNS, 'circle');
  centerDot.setAttribute('cx', '60'); centerDot.setAttribute('cy', '60');
  centerDot.setAttribute('r', '3'); centerDot.setAttribute('fill', '#c49830');
  svg.appendChild(centerDot);

  // ── Decorative leaves ──
  const leafPositions = [0, 60, 120, 180, 240, 300];
  leafPositions.forEach(ang => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `rotate(${ang} 60 60)`);
    const leaf = document.createElementNS(svgNS, 'ellipse');
    leaf.setAttribute('cx', '60'); leaf.setAttribute('cy', '96');
    leaf.setAttribute('rx', '5'); leaf.setAttribute('ry', '13');
    leaf.setAttribute('fill', '#c8d8c0'); leaf.setAttribute('opacity', '0.55');
    leaf.setAttribute('stroke', '#b0c4a8'); leaf.setAttribute('stroke-width', '0.3');
    g.appendChild(leaf);
    svg.appendChild(g);
  });

  // ── Small decorative buds around the main flower ──
  const budAngles = [45, 135, 225, 315];
  budAngles.forEach(ang => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `rotate(${ang} 60 60) translate(0 -28)`);
    // Small bud
    const bud = document.createElementNS(svgNS, 'ellipse');
    bud.setAttribute('cx', '60'); bud.setAttribute('cy', '60');
    bud.setAttribute('rx', '4'); bud.setAttribute('ry', '6');
    bud.setAttribute('fill', '#fdf8ee'); bud.setAttribute('opacity', '0.7');
    g.appendChild(bud);
    // Bud calyx
    const calyx = document.createElementNS(svgNS, 'ellipse');
    calyx.setAttribute('cx', '60'); calyx.setAttribute('cy', '66');
    calyx.setAttribute('rx', '3'); calyx.setAttribute('ry', '4');
    calyx.setAttribute('fill', '#c0d4b8'); calyx.setAttribute('opacity', '0.55');
    g.appendChild(calyx);
    svg.appendChild(g);
  });

  return svg;
}

// ── Hero section antique white flowers ──────────────────────────────────────
function buildHeroFlowers(container) {
  // Positions: x%, y%, size(px), rotation(deg), opacity, driftDelay(s)
  const positions = [
    // Top-left corner — 3 overlapping flowers
    { x: -8,  y: -8,  s: 130, r: 15,  op: 0.82, fd: 0.0 },
    { x:  4,  y: -4,  s: 90,  r: -25, op: 0.70, fd: 0.3 },
    { x: -4,  y:  8,  s: 70,  r: 40,  op: 0.60, fd: 0.6 },
    { x: 11,  y:  3,  s: 50,  r: 10,  op: 0.45, fd: 0.9 },

    // Top-right corner — 3 overlapping flowers
    { x: 92,  y: -8,  s: 130, r: -20, op: 0.82, fd: 0.15 },
    { x: 82,  y: -3,  s: 88,  r: 30,  op: 0.70, fd: 0.45 },
    { x: 93,  y:  9,  s: 68,  r: -40, op: 0.60, fd: 0.75 },
    { x: 78,  y:  4,  s: 48,  r: 18,  op: 0.45, fd: 1.05 },

    // Bottom-left corner — 3 overlapping flowers
    { x: -8,  y: 88,  s: 124, r: 10,  op: 0.80, fd: 0.2 },
    { x:  4,  y: 82,  s: 86,  r: -30, op: 0.68, fd: 0.5 },
    { x: -4,  y: 76,  s: 64,  r: 45,  op: 0.55, fd: 0.8 },
    { x: 12,  y: 90,  s: 46,  r: -12, op: 0.42, fd: 1.1 },

    // Bottom-right corner — 3 overlapping flowers
    { x: 92,  y: 88,  s: 126, r: -15, op: 0.82, fd: 0.05 },
    { x: 82,  y: 82,  s: 88,  r: 28,  op: 0.70, fd: 0.35 },
    { x: 93,  y: 76,  s: 66,  r: -45, op: 0.58, fd: 0.65 },
    { x: 78,  y: 91,  s: 44,  r: 20,  op: 0.42, fd: 0.95 },

    // Top edge — scattered blooms
    { x: 28,  y: -7,  s: 72,  r: 8,   op: 0.55, fd: 0.4 },
    { x: 48,  y: -8,  s: 80,  r: -12, op: 0.60, fd: 0.7 },
    { x: 68,  y: -7,  s: 68,  r: 18,  op: 0.52, fd: 1.0 },

    // Bottom edge — scattered blooms
    { x: 30,  y: 94,  s: 70,  r: -8,  op: 0.55, fd: 0.25 },
    { x: 50,  y: 95,  s: 76,  r: 14,  op: 0.58, fd: 0.55 },
    { x: 70,  y: 94,  s: 62,  r: -20, op: 0.50, fd: 0.85 },

    // Left edge — side blooms
    { x: -7,  y: 30,  s: 76,  r: 25,  op: 0.58, fd: 0.6 },
    { x: -7,  y: 55,  s: 68,  r: -18, op: 0.52, fd: 0.9 },
    { x: -6,  y: 72,  s: 60,  r: 35,  op: 0.48, fd: 1.2 },

    // Right edge — side blooms
    { x: 93,  y: 30,  s: 74,  r: -25, op: 0.58, fd: 0.45 },
    { x: 93,  y: 55,  s: 66,  r: 18,  op: 0.50, fd: 0.75 },
    { x: 93,  y: 72,  s: 58,  r: -35, op: 0.46, fd: 1.05 },
  ];

  positions.forEach((pos, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'flower-decor flower-decor--antique';
    wrapper.style.cssText = `
      position: absolute;
      left: ${pos.x}%;
      top: ${pos.y}%;
      width: ${pos.s}px;
      height: ${pos.s}px;
      transform: rotate(${pos.r}deg) scale(0.08);
      opacity: 0;
      pointer-events: none;
      filter: drop-shadow(0 2px 8px rgba(255,255,255,0.6)) drop-shadow(0 0 20px rgba(255,248,220,0.4));
      will-change: transform, opacity;
      transition: none;
    `;
    wrapper.appendChild(makeAntiqueFlower(pos.s, pos.r, pos.op));
    container.appendChild(wrapper);

    // Staggered bloom animation using Web Animations API
    const delay = i * 70;
    wrapper.animate([
      { transform: `rotate(${pos.r - 15}deg) scale(0.08) translateY(10px)`, opacity: 0 },
      { transform: `rotate(${pos.r + 4}deg) scale(1.05) translateY(-2px)`, opacity: pos.op * 1.05, offset: 0.65 },
      { transform: `rotate(${pos.r}deg) scale(1) translateY(0)`, opacity: pos.op }
    ], {
      duration: 1400,
      delay: delay,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards'
    });

    // Gentle drift loop after bloom
    setTimeout(() => {
      wrapper.animate([
        { translate: '0 0' },
        { translate: '0 -6px' },
        { translate: '0 0' }
      ], {
        duration: (5000 + (i % 5) * 1000),
        delay: pos.fd * 1000,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }, delay + 1400);
  });
}

document.addEventListener('DOMContentLoaded',function(){
  // Background music
  const overlay = document.getElementById('entryOverlay');

  // Build antique white flower decorations around the HERO section
  const heroFlowerContainer = document.getElementById('heroFlowers');
  if (heroFlowerContainer) buildHeroFlowers(heroFlowerContainer);

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

  // Interactive envelope opening sequence
  const envelope = document.getElementById('envelope');
  if (envelope) {
    envelope.addEventListener('click', async function(e) {
      if (envelope.classList.contains('open')) return;
      
      // Step 1: Open the flap
      envelope.classList.add('open');
      
      // Step 2: Extract the card
      setTimeout(() => {
        envelope.classList.add('extracted');
      }, 550);
      
      // Step 3: Turn/flip the card, fade out overlay, & start the music
      setTimeout(async () => {
        envelope.classList.add('turned');
        overlay.classList.add('is-closed');
        await startMusic();
      }, 1450);
      
      // Step 4: Finalize entrance & trigger welcoming confetti
      setTimeout(() => {
        document.body.classList.add('invite-open');
        setTimeout(() => {
          try { spawnConfettiBurst(W/2, H/4, 48); } catch(e) {}
        }, 150);
      }, 2150);
    });
  }

  // Fallback for button listener (legacy support)
  if (openBtn) {
    openBtn.addEventListener('click', async function(){
      overlay.classList.add('is-closed');
      document.body.classList.add('invite-open');
      await startMusic();
      setTimeout(()=>{
        try{ spawnConfettiBurst(W/2, H/4, 40); }catch(e){}
      }, 400);
    });
  }

  musicToggle.addEventListener('click', async function(){
    if(bgMusic.paused){
      await startMusic();
    } else {
      bgMusic.pause();
      setMusicUI(false);
    }
  });

  // Countdown — explicit UTC+01:00 offset (Tunisia timezone)
  const target = new Date('2026-09-20T17:00:00+01:00'); // Mariage, 20 Sept 17:00 TN
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  const countdownLabelEl = document.querySelector('.countdown-label');

  function updateCountdown(){
    const now = new Date();
    const label = 'Jusqu\u2019au Mariage';
    if (countdownLabelEl && countdownLabelEl.textContent !== label) {
      countdownLabelEl.textContent = label;
    }
    const diff = Math.max(0, target - now);
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
  setInterval(updateCountdown, 1000);

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
  const reveals = document.querySelectorAll('.section, .gallery img, .story-photo, .event-card, .contact-block, .countdown, .timeline li');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(!ent.isIntersecting) return;
      ent.target.classList.add('visible');
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
