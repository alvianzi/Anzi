(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // fallback: langsung tampilkan semua jika browser tidak mendukung
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---- stagger delay untuk grid ---- */
  function stagger(selector) {
    document.querySelectorAll(selector).forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (child, i) {
        child.style.setProperty('--d', (i * 0.08) + 's');
      });
    });
  }
  stagger('.skill-groups');
  stagger('.ach-grid');
  stagger('.cert-grid');
  stagger('.org-grid');

  var timelineItems = document.querySelectorAll('.t-item');
  if ('IntersectionObserver' in window) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.4 });
    timelineItems.forEach(function (el) { timelineObserver.observe(el); });
  } else {
    timelineItems.forEach(function (el) { el.classList.add('in-view'); });
  }

  var timelineProgressEl = document.getElementById('timelineProgress');
  var timelineWrap = document.querySelector('.timeline');
  function updateTimelineProgress() {
    if (!timelineWrap || !timelineProgressEl) return;
    var rect = timelineWrap.getBoundingClientRect();
    var viewportH = window.innerHeight;
    var total = rect.height;
    var progressed = viewportH * 0.75 - rect.top;
    progressed = Math.max(0, Math.min(progressed, total));
    var pct = total > 0 ? (progressed / total) * 100 : 0;
    timelineProgressEl.style.height = pct + '%';
  }

 
  var topProgress = document.getElementById('topProgress');
  function updateTopProgress() {
    if (!topProgress) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    topProgress.style.width = pct + '%';
  }

  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a, .mobile-nav a'));
  var spyTargets = navAnchors
    .map(function (a) { return { a: a, el: document.querySelector(a.getAttribute('href')) }; })
    .filter(function (x) { return x.el; });
  function updateScrollSpy() {
    if (!spyTargets.length) return;
    var fromTop = window.scrollY + 140;
    var current = spyTargets[0].el;
    spyTargets.forEach(function (t) { if (t.el.offsetTop <= fromTop) current = t.el; });
    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
    });
  }

  var navEl = document.querySelector('.nav');
  function updateNavScrolled() {
    if (!navEl) return;
    navEl.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  var backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 600);
  }
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  
  function onScroll() {
    updateTimelineProgress();
    updateTopProgress();
    updateScrollSpy();
    updateNavScrolled();
    updateBackToTop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateTimelineProgress);
  onScroll();

 
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  function setMobileNavOpen(isOpen) {
    if (!navToggle || !mobileNav) return;
    mobileNav.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', isOpen);
    mobileNav.querySelectorAll('a').forEach(function (a) {
      if (isOpen) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1');
    });
  }
  if (navToggle && mobileNav) {
    setMobileNavOpen(false);
    navToggle.addEventListener('click', function () {
      setMobileNavOpen(!mobileNav.classList.contains('open'));
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMobileNavOpen(false); });
    });
    // tutup menu mobile dengan tombol Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) setMobileNavOpen(false);
    });
  }

  
  var glow = document.querySelector('.cursor-glow');
  if (glow && canHover && !prefersReduced) {
    window.addEventListener('mousemove', function (e) {
      glow.style.transform = 'translate(' + (e.clientX - 260) + 'px, ' + (e.clientY - 260) + 'px)';
      glow.classList.add('active');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glow.classList.remove('active'); });
  }

  function attachMagnetic(el, strength) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * strength;
      var y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px) scale(1.04)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  }
  if (canHover && !prefersReduced) {
    document.querySelectorAll('.btn').forEach(function (b) { attachMagnetic(b, 0.25); });
  }

 
  function attachTilt(el, max, lift) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      var liftPart = lift ? 'translateY(-5px) ' : '';
      el.style.transform = liftPart + 'perspective(700px) rotateY(' + (px * max).toFixed(2) + 'deg) rotateX(' + (-py * max).toFixed(2) + 'deg)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  }
  if (canHover && !prefersReduced) {
    document.querySelectorAll('.cert-card').forEach(function (el) { attachTilt(el, 6, true); });
    var photo = document.querySelector('.summary-photo');
    if (photo) attachTilt(photo, 5, false);
  }


  var heroEl = document.querySelector('.hero');
  var orbs = document.querySelectorAll('.hero-orb');
  if (heroEl && orbs.length && canHover && !prefersReduced) {
    heroEl.addEventListener('mousemove', function (e) {
      var r = heroEl.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      orbs.forEach(function (orb, i) {
        var depth = (i + 1) * 14;
        orb.style.transform = 'translate(' + (px * depth).toFixed(1) + 'px, ' + (py * depth).toFixed(1) + 'px)';
      });
    }, { passive: true });
    heroEl.addEventListener('mouseleave', function () {
      orbs.forEach(function (orb) { orb.style.transform = ''; });
    });
  }

  
  var statNum = document.querySelector('.stat-num');
  if (statNum) {
    var target = parseFloat(statNum.textContent);
    if (!isNaN(target)) {
      if (prefersReduced || !('IntersectionObserver' in window)) {
        statNum.textContent = target.toFixed(2);
      } else {
        var statObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var start = performance.now();
              var duration = 1200;
              function tick(now) {
                var p = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                statNum.textContent = (target * eased).toFixed(2);
                if (p < 1) requestAnimationFrame(tick); else statNum.textContent = target.toFixed(2);
              }
              requestAnimationFrame(tick);
              statObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });
        statObserver.observe(statNum);
      }
    }
  }

 
  var roleTextEl = document.getElementById('roleCycleText');
  var rolePhrases = [
    'Memimpin unit IT/SIMRS di Rumah Sakit Santa Familia',
    'Membangun website dengan PHP & Laravel',
    'Merancang sistem IoT berbasis Arduino',
    'Mendigitalkan layanan Kampung Juaq Asa'
  ];
  if (roleTextEl) {
    if (prefersReduced) {
      roleTextEl.textContent = rolePhrases[0];
    } else {
      var phraseIndex = 0, charIndex = 0, deleting = false;
      var typeLoop = function () {
        var current = rolePhrases[phraseIndex];
        if (!deleting) {
          charIndex++;
          roleTextEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeLoop, 1800);
            return;
          }
          setTimeout(typeLoop, 55);
        } else {
          charIndex--;
          roleTextEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % rolePhrases.length;
            setTimeout(typeLoop, 400);
            return;
          }
          setTimeout(typeLoop, 28);
        }
      };
      setTimeout(typeLoop, 900);
    }
  }

 
  var toastEl = null;
  var toastTimer = null;
  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.style.cssText = [
        'position:fixed', 'left:50%', 'bottom:28px', 'transform:translate(-50%, 20px)',
        'background:#16302b', 'color:#f2efe9', 'border:1px solid rgba(242,239,233,0.12)',
        'padding:12px 20px', 'border-radius:999px', 'font-family:"Inter",sans-serif',
        'font-size:14px', 'letter-spacing:.01em', 'box-shadow:0 12px 30px rgba(0,0,0,0.35)',
        'z-index:9999', 'opacity:0', 'transition:opacity .25s ease, transform .25s ease',
        'pointer-events:none'
      ].join(';');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    requestAnimationFrame(function () {
      toastEl.style.opacity = '1';
      toastEl.style.transform = 'translate(-50%, 0)';
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translate(-50%, 20px)';
    }, 2200);
  }

  
  var mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  mailLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var email = link.getAttribute('href').replace('mailto:', '').split('?')[0];
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () {
          showToast('Email disalin: ' + email);
        }).catch(function () { /* diam-diam gagal, biarkan mailto tetap jalan */ });
      }
    });
  });

 
  document.querySelectorAll('.fact').forEach(function (fact) {
    var key = fact.querySelector('.fact-k');
    var value = fact.querySelector('.fact-v');
    if (!key || !value) return;
    if (key.textContent.trim().toLowerCase() === 'email') {
      fact.style.cursor = 'pointer';
      fact.setAttribute('title', 'Klik untuk menyalin email');
      fact.addEventListener('click', function () {
        var email = value.textContent.trim();
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(email).then(function () {
            showToast('Email disalin: ' + email);
          });
        }
      });
    }
  });

  
  var footBottom = document.querySelector('.foot-bottom');
  if (footBottom && !/\d{4}/.test(footBottom.textContent)) {
    footBottom.textContent += '  ·  © ' + new Date().getFullYear();
  }

  
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', id);
    });
  });

  
  var konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var konamiPos = 0;
  document.addEventListener('keydown', function (e) {
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konami[konamiPos]) {
      konamiPos++;
      if (konamiPos === konami.length) {
        konamiPos = 0;
        document.body.classList.add('easter-egg-spin');
        showToast('🎉 Mode rahasia aktif!');
        setTimeout(function () { document.body.classList.remove('easter-egg-spin'); }, 2000);
      }
    } else {
      konamiPos = (key === konami[0]) ? 1 : 0;
    }
  });

})();
