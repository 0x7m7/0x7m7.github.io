(() => {
  'use strict';

  /* ---------- year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- typing effect ---------- */
  const phrases = [
    '> web3 smart contracts security researcher',
    '> finding vulnerabilities in the upkeep of defi',
    '> deep manual analysis · logic & economic exploits',
    '> solidity · foundry · using the blockchain, but safely',
    '> audit requests & security research always welcome',
  ];
  const target = document.getElementById('typed');
  let p = 0;
  let i = 0;
  let deleting = false;

  const tick = () => {
    const current = phrases[p];
    target.textContent = current.slice(0, i) + '▌';
    if (!deleting) {
      i++;
      if (i > current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      setTimeout(tick, 45 + Math.random() * 20);
    } else {
      i -= 2;
      if (i <= 0) {
        i = 0;
        deleting = false;
        p = (p + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 24);
    }
  };
  tick();

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- particle field ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, raf;
  const mouse = { x: null, y: null };

  const COLORS = ['#00ff9c', '#9b6cff', '#0e7cfe'];

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  const rand = (a, b) => a + Math.random() * (b - a);

  const makeParticles = () => {
    const count = Math.min(110, Math.floor((W * H) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.25, 0.25),
      r: rand(0.8, 2.2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: rand(0.2, 0.8),
    }));
  };

  const link = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const d = Math.hypot(dx, dy);
    if (d < 130) {
      ctx.strokeStyle = `rgba(0,255,156,${(1 - d / 130) * 0.25})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  };

  const frame = () => {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 160 && d > 0.01) {
          p.x += (dx / d) * 0.4;
          p.y += (dy / d) * 0.4;
        }
      }

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        link(particles[i], particles[j]);
      }
    }
    raf = requestAnimationFrame(frame);
  };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    resize();
    makeParticles();
    frame();
    window.addEventListener('resize', () => {
      resize();
      makeParticles();
    });
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }
})();