(() => {
  'use strict';
  // ---------- 1. Ayudantes, banderas y tokens de movimiento ----------
  const d = document, html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const safe = (fn) => { try { fn(); } catch (e) { console.warn('[purina]', e); } };
  const M = { ease: 'power3.out', io: 'power3.inOut', pop: 'back.out(1.4)', dur: .9, st: .08, dist: 28 };
  const intro = $('#intro');

  // ---------- 2. Scroll suave ----------
  let lenis = null;
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (window.Lenis && !RM) safe(() => {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    });
  }
  // Anclas con Lenis
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); const el = id.length > 1 && $(id);
    if (!el) return; e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -68 }); else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  }));

  // ---------- 3. Lo que siempre funciona ----------
  // Menú que se esconde al bajar y vuelve al subir
  safe(() => {
    const nav = $('#nav'); let last = 0;
    addEventListener('scroll', () => {
      const y = scrollY; nav.classList.toggle('is-hidden', y > last && y > 400); last = y;
    }, { passive: true });
  });

  // Filtro de marcas
  safe(() => {
    const btns = $$('.filter button'), cards = $$('.brand');
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.f;
      cards.forEach((c) => { c.hidden = f !== 'todos' && !c.dataset.for.includes(f); });
      $('#rail').scrollTo({ left: 0 });
      if (hasGSAP && !RM) gsap.fromTo(cards.filter((c) => !c.hidden), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: M.ease, stagger: .05 });
    }));
  });

  // Carril que se arrastra con el mouse
  safe(() => {
    const rail = $('#rail'); if (!FINE) return;
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add('grabbing'); } rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { down = false; rail.classList.remove('grabbing'); });
    rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
  });

  // Buscador: la parte viva
  safe(() => {
    const IMG = {
      dcMulti: 'https://purina.com.gt/sites/default/files/2024-09/Empaque_Multiproteina_Diversity.jpg',
      ppDog: 'https://purina.com.gt/sites/default/files/2023-04/7501072215277_1.jpg',
      ppCat: 'https://purina.com.gt/sites/default/files/2023-04/7501072215284_1.jpg',
      ccKit: 'https://purina.com.gt/sites/default/files/2024-08/gatitos_pescado_carne_leche_cat_chow.png',
      ccAd: 'https://purina.com.gt/sites/default/files/2024-08/ccg1.png',
      ccEst: 'https://purina.com.gt/sites/default/files/2024-08/esterilizados_pescado_cat_chow.jpg.png',
      ppLogo: 'https://purina.com.gt/sites/default/files/2024-03/Proplan_C-2.png',
      dcLogo: 'https://purina.com.gt/sites/default/files/2026-02/DC-LOGO-ESPANOL-1.png',
      oneCat: 'https://purina.com.gt/sites/default/files/2024-03/OneGatos_C.png',
    };
    const R = {
      'perro-joven': { n: 'Dog Chow® o Pro Plan® para cachorros', w: 'En su primer año crece rápido: busca la fórmula que diga cachorros o crecimiento.', p: '22.5 %', i: IMG.dcLogo, l: 'https://purina.com.gt/dogchow' },
      'perro-adulto': { n: 'Dog Chow® Multi Proteínas', w: 'Cinco proteínas: carne, pollo, salmón, cerdo y pavo, con EXTRAlife® para su día a día.', p: '18 %', i: IMG.dcMulti, l: 'https://purina.com.gt/dogchow' },
      'perro-mayor': { n: 'Pro Plan® para perros mayores', w: 'Desde los siete años se mueve menos: busca la fórmula para adulto mayor de tu marca.', p: '18 %', i: IMG.ppLogo, l: 'https://purina.com.gt/proplan' },
      'perro-sensible': { n: 'Pro Plan® Estómago Sensible', w: 'Para perros adultos de todos los tamaños con piel y tracto intestinal sensibles.', p: '18 %', i: IMG.ppDog, l: 'https://purina.com.gt/proplan' },
      'gato-joven': { n: 'Cat Chow® Defense Plus+® Gatitos', w: 'Para gatos en crecimiento, hasta los 12 meses: más proteína para su etapa más intensa.', p: '30 %', i: IMG.ccKit, l: 'https://purina.com.gt/catchow' },
      'gato-adulto': { n: 'Cat Chow® Defense Plus+® Adultos', w: 'Para el día a día de un gato adulto con actividad normal.', p: '26 %', i: IMG.ccAd, l: 'https://purina.com.gt/catchow' },
      'gato-mayor': { n: 'Purina® ONE o Pro Plan® para gatos mayores', w: 'Desde los siete años, busca la versión para adulto mayor y lleva sus revisiones al día.', p: '26 %', i: IMG.oneCat, l: 'https://purina.com.gt/purina-one' },
      'gato-sensible': { n: 'Pro Plan® Sensitive Skin and Stomach felino', w: 'Para gatos adultos con piel y tracto intestinal sensibles.', p: '26 %', i: IMG.ppCat, l: 'https://purina.com.gt/proplan' },
      'gato-ester': { n: 'Cat Chow® Defense Plus+® Esterilizados', w: 'Un gato esterilizado suele necesitar menos calorías: esta fórmula está hecha para él.', p: '26 %', i: IMG.ccEst, l: 'https://purina.com.gt/catchow' },
    };
    const form = $('#finderForm'), ester = $('#optEster'), lbl = $('#lblJoven');
    const val = (n) => (form.querySelector(`input[name="${n}"]:checked`) || {}).value;
    function update(animate) {
      const sp = val('sp');
      ester.hidden = sp !== 'gato';
      if (sp !== 'gato' && val('nd') === 'ester') form.querySelector('input[name="nd"][value="no"]').checked = true;
      lbl.textContent = sp === 'gato' ? 'Gatito, hasta 1 año' : 'Cachorro, hasta 1 año';
      const st = val('st'), nd = val('nd');
      let key = `${sp}-${st}`;
      if (st !== 'joven' && nd === 'sensible') key = `${sp}-sensible`;
      if (sp === 'gato' && st === 'adulto' && nd === 'ester') key = 'gato-ester';
      const r = R[key];
      const prot = st === 'joven' ? (sp === 'gato' ? '30 %' : '22.5 %') : (sp === 'gato' ? '26 %' : '18 %');
      const apply = () => {
        $('#rName').textContent = r.n; $('#rWhy').textContent = r.w;
        $('#rProt').textContent = prot; $('#rDays').textContent = nd === 'sensible' ? '10 días' : '7 días';
        const img = $('#rImg'); img.src = r.i; img.alt = r.n; $('#rLink').href = r.l;
      };
      if (animate && hasGSAP && !RM) {
        gsap.timeline()
          .to(['#rImg', '#result .result__body > *'], { y: -16, opacity: 0, duration: .22, ease: 'power2.in', stagger: .02 })
          .add(apply)
          .fromTo('#rImg', { y: 30, opacity: 0, rotate: -4, scale: .92 }, { y: 0, opacity: 1, rotate: 0, scale: 1, duration: .7, ease: M.pop })
          .fromTo('#result .result__body > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: M.ease, stagger: .05 }, '<.05');
      } else apply();
    }
    form.addEventListener('change', () => update(true));
    update(false);
  });

  // Cartas que se voltean (toque y teclado)
  safe(() => $$('.flip').forEach((f) => f.addEventListener('click', () => f.setAttribute('aria-pressed', String(f.getAttribute('aria-pressed') !== 'true')))));

  // Acordeón
  safe(() => $$('.acc__btn').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open));
    setTimeout(() => hasGSAP && ScrollTrigger.refresh(), 480);
  })));

  // Guía de 7 días: tocar un día cambia la barra
  const setDay = (i) => {
    const days = $$('#days .day'); const old = +days[i].dataset.old;
    days.forEach((x, k) => x.classList.toggle('is-on', k === i));
    $('#barOld').style.width = old + '%';
    $('#barOld').textContent = old ? `Anterior ${old} %` : '';
    $('#barNew').textContent = `Nuevo ${100 - old} %`;
  };
  safe(() => $$('#days .day').forEach((x, i) => x.addEventListener('click', () => setDay(i))));

  // Tablero que se arrastra en el cierre
  safe(() => {
    const toy = $('#toy'); let sx, sy, dx = 0, dy = 0, drag = false;
    toy.addEventListener('pointerdown', (e) => { drag = true; sx = e.clientX - dx; sy = e.clientY - dy; toy.setPointerCapture(e.pointerId); if (hasGSAP) gsap.killTweensOf(toy); });
    toy.addEventListener('pointermove', (e) => { if (!drag) return; dx = e.clientX - sx; dy = e.clientY - sy; toy.style.transform = `translate(${dx}px,${dy}px) rotate(${dx / 8}deg)`; });
    const up = () => {
      if (!drag) return; drag = false;
      if (hasGSAP && !RM) gsap.to({ x: dx, y: dy }, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1,.4)', onUpdate() { dx = this.targets()[0].x; dy = this.targets()[0].y; toy.style.transform = `translate(${dx}px,${dy}px) rotate(${dx / 8}deg)`; } });
      else { dx = dy = 0; toy.style.transform = ''; }
    };
    toy.addEventListener('pointerup', up); toy.addEventListener('pointercancel', up);
  });

  // Sin GSAP: todo visible y quieto
  if (!hasGSAP) { html.classList.remove('js'); intro && intro.classList.add('done'); return; }
  if (RM) { intro && intro.classList.add('done'); $('#statement').classList.add('done'); return; }

  // ---------- 4. Efectos de scroll ----------
  // Entradas por sección: título, texto, imagen, con desfase
  safe(() => {
    gsap.set('[data-reveal]', { y: M.dist });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%', once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: M.dur, ease: M.ease, stagger: M.st, overwrite: true }),
    });
  });

  // La frase se enciende palabra por palabra
  safe(() => {
    const p = $('#statement');
    p.innerHTML = p.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    gsap.to($$('.w', p), { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    gsap.fromTo('.diff__bowl', { rotate: -6, scale: .9 }, { rotate: 4, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.diff', start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Fotos de etapas: se acercan despacio con el scroll
  safe(() => $$('[data-zoom]').forEach((img) => gsap.fromTo(img, { scale: 1.3 }, { scale: 1.12, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom 40%', scrub: true } })));

  // Tablero de la portada: ligero desplazamiento al bajar
  safe(() => gsap.to('#board', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));

  // Guía de 7 días: en escritorio la sección se queda fija y avanza con el scroll
  safe(() => {
    const mm = gsap.matchMedia();
    const steps = (self) => setDay(Math.min(3, Math.floor(self.progress * 4)));
    mm.add('(min-width: 900px)', () => {
      ScrollTrigger.create({ trigger: '#switchPin', start: 'top 100px', end: '+=1400', pin: true, onUpdate: steps });
    });
    mm.add('(max-width: 899px)', () => {
      ScrollTrigger.create({ trigger: '#days', start: 'top 75%', end: 'bottom 35%', onUpdate: steps });
    });
  });

  // Recalcula posiciones cuando cargan las imágenes
  addEventListener('load', () => ScrollTrigger.refresh());

  // Marca gigante del cierre
  safe(() => gsap.from('#mega span', { yPercent: 100, opacity: 0, duration: 1, ease: M.ease, stagger: .06, scrollTrigger: { trigger: '#mega', start: 'top 92%', once: true } }));
  safe(() => gsap.from('#toy', { scale: 0, rotate: -90, duration: .9, ease: M.pop, scrollTrigger: { trigger: '.close', start: 'top 70%', once: true } }));

  // ---------- 5. Arranque: intro firma + portada ----------
  safe(() => {
    const cells = $$('#board .cell'), ib = $$('#introBoard .ib'), letters = $$('.intro__word span'), cols = $$('.intro__bg span');
    const lines = $$('#t-hero .li');
    gsap.set(ib, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set('.ib-frame', { strokeDasharray: 348, strokeDashoffset: 348 });
    gsap.set(letters, { yPercent: 110 });
    gsap.set(lines, { yPercent: 105 });
    gsap.set('[data-hero]', { opacity: 0, y: 24 });
    gsap.set(cells, { scale: .6, opacity: 0 });
    gsap.set('#nav', { yPercent: -100 });
    if (lenis) lenis.stop();
    const tl = gsap.timeline({ defaults: { ease: M.ease }, paused: true, onComplete: () => lenis && lenis.start() });
    tl.to('.ib-frame', { strokeDashoffset: 0, duration: .6, ease: 'power2.inOut' }, 0)
      .to([ib[2], ib[0], ib[1], ib[4], ib[3]], { scale: 1, duration: .45, ease: M.pop, stagger: .08 }, .2)
      .to(letters, { yPercent: 0, duration: .6, stagger: .05 }, .55)
      .addLabel('open', 1.45)
      .to('.intro__mark,.intro__skip', { scale: .6, opacity: 0, duration: .5, ease: M.io }, 'open')
      .to(cols, { yPercent: -100, duration: .8, ease: M.io, stagger: .08 }, 'open+=.1')
      .add(() => { intro.classList.add('done'); if (lenis) lenis.start(); }, 'open+=1.05')
      .to(lines, { yPercent: 0, duration: M.dur, stagger: .1 }, 'open+=.4')
      .to('[data-hero]', { opacity: 1, y: 0, duration: .7, stagger: .08 }, 'open+=.7')
      .to([0, 4, 8, 2, 6, 1, 3, 5, 7].map((i) => cells[i]), { scale: 1, opacity: 1, duration: .6, ease: M.pop, stagger: .06 }, 'open+=.55')
      .to('#nav', { yPercent: 0, duration: .6, ease: M.io, clearProps: 'transform' }, 'open+=.8');
    const skip = () => { if (tl.time() < tl.labels.open) tl.seek('open'); };
    intro.addEventListener('pointerdown', skip, { once: true });
    addEventListener('keydown', skip, { once: true });
    const go = () => { tl.play(); ScrollTrigger.refresh(); };
    // Espera las letras, pero nunca más de 1.2 s
    Promise.race([d.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(go);
    // Respaldo: a los 6 s todo queda visible pase lo que pase
    setTimeout(() => { if (tl.progress() < 1) tl.progress(1); intro.classList.add('done'); }, 6000);
  });
})();
