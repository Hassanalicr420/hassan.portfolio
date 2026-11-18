/* Loader */
window.addEventListener('load', () => {
  const l = document.getElementById('loader');
  if (l) setTimeout(() => l.classList.add('hide'), 500);
});

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const progress = document.getElementById('progress');
  const toTop = document.getElementById('toTop');

  /* Mobile menu */
  const menuBtn = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menuBtn.textContent = isOpen ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      links.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      menuBtn.textContent = '☰';
    }));
  }

  /* Scroll effects */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (y / h) * 100 + '%';
    if (toTop) toTop.classList.toggle('show', y > 500);
  });
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Reveal on scroll */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach((r, i) => {
    r.style.transitionDelay = (i % 4) * 0.08 + 's';
    io.observe(r);
  });

  /* Skill bars */
  const bars = document.querySelectorAll('.bar span');
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        barIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach((b) => barIO.observe(b));

  /* Counters */
  const counters = document.querySelectorAll('[data-count]');
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isFloat = !Number.isInteger(target);
      let cur = 0;
      const step = target / 60;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = (isFloat ? cur.toFixed(1) : Math.floor(cur)) + suffix;
      }, 25);
      cIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => cIO.observe(c));

  /* Typing effect */
  const typed = document.getElementById('typed');
  if (typed) {
    const words = ['Web Developer', 'Laravel Developer', 'MERN Stack Developer', 'Problem Solver'];
    let w = 0, c = 0, del = false;
    (function type() {
      const word = words[w];
      typed.textContent = word.substring(0, c);
      if (!del && c < word.length) { c++; setTimeout(type, 90); }
      else if (!del) { del = true; setTimeout(type, 1400); }
      else if (c > 0) { c--; setTimeout(type, 45); }
      else { del = false; w = (w + 1) % words.length; setTimeout(type, 300); }
    })();
  }

  /* Project filter */
  const fbtns = document.querySelectorAll('.filters button');
  const projects = document.querySelectorAll('.project');
  fbtns.forEach((b) => b.addEventListener('click', () => {
    fbtns.forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    const f = b.dataset.filter;
    projects.forEach((p) => {
      p.classList.toggle('hidden', !(f === 'all' || p.dataset.cat.includes(f)));
    });
  }));

  /* Contact form -> opens email client */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim() || 'Portfolio Inquiry';
      const msg = form.message.value.trim();
      const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
      window.location.href = 'mailto:hassanali.software@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
      document.getElementById('formMsg').textContent = 'Your email app should open so you can send your message. Thank you!';
    });
  }

  /* Particles background */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let pts = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      pts = Array.from({ length: Math.min(70, Math.floor(canvas.width / 18)) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,211,238,.7)';
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(99,102,241,' + (1 - d / 120) * 0.35 + ')';
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    })();
  }

  /* Card tilt */
  document.querySelectorAll('.project,.stat').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg) translateY(-8px)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
});
