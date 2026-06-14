(function () {
  const LANG_KEY = "ctth-lang";
  const htmlLangMap = { zh: "zh-CN", en: "en", th: "th" };
  const titles = {
    zh: "中国电信（泰国）有限公司 | China Telecom (Thailand) Co., Ltd.",
    en: "China Telecom (Thailand) Co., Ltd.",
    th: "บริษัท ไชน่า เทเลคอม (ประเทศไทย) จำกัด | China Telecom (Thailand)"
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- i18n ---------- */
  function applyLang(lang) {
    const dict = I18N[lang];
    if (!dict) return;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.documentElement.lang = htmlLangMap[lang];
    const titleKey = document.body.dataset.title;
    if (titleKey && dict[titleKey]) document.title = dict[titleKey];
    else if (titles[lang]) document.title = titles[lang];
    document.querySelectorAll(".lang-switch button").forEach(b =>
      b.classList.toggle("active", b.dataset.lang === lang)
    );
    localStorage.setItem(LANG_KEY, lang);
  }

  document.querySelectorAll(".lang-switch button").forEach(btn =>
    btn.addEventListener("click", () => applyLang(btn.dataset.lang))
  );

  const saved = localStorage.getItem(LANG_KEY);
  if (saved && saved !== "zh") applyLang(saved);

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  const nav = document.getElementById("mainNav");
  const navToggle = document.getElementById("navToggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      navToggle.classList.toggle("active");
    });
    nav.addEventListener("click", e => {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        navToggle.classList.remove("active");
      }
    });
  }

  /* ---------- Staggered reveal delays ---------- */
  document.querySelectorAll(".stagger").forEach(group => {
    [...group.children].forEach((child, i) => {
      if (child.classList.contains("reveal")) {
        child.style.transitionDelay = Math.min(i * 70, 420) + "ms";
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add("visible"));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = el => {
    const target = parseInt(el.dataset.count, 10);
    const isYear = target >= 1900 && target <= 2100;
    if (reduceMotion) {
      el.textContent = isYear ? String(target) : target.toLocaleString("en-US");
      return;
    }
    const duration = 1600;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const v = Math.round(target * eased);
      el.textContent = isYear ? String(v) : v.toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  };
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      counterIO.unobserve(en.target);
      runCounter(en.target);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Hero parallax (subtle) ---------- */
  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && !reduceMotion) {
    window.addEventListener("scroll", () => {
      const y = Math.min(window.scrollY, 600);
      heroVisual.style.transform = `translateY(${y * 0.06}px) scale(${1 - y * 0.00004})`;
    }, { passive: true });
  }

  /* ---------- Marquee duplicate (home only) ---------- */
  const track = document.getElementById("clientTrack");
  if (track) track.innerHTML += track.innerHTML;
})();
