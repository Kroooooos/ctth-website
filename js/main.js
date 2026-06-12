(function () {
  const LANG_KEY = "ctth-lang";
  const htmlLangMap = { zh: "zh-CN", en: "en", th: "th" };
  const titles = {
    zh: "中国电信（泰国）有限公司 | China Telecom (Thailand) Co., Ltd.",
    en: "China Telecom (Thailand) Co., Ltd.",
    th: "บริษัท ไชน่า เทเลคอม (ประเทศไทย) จำกัด | China Telecom (Thailand)"
  };

  function applyLang(lang) {
    const dict = I18N[lang];
    if (!dict) return;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.documentElement.lang = htmlLangMap[lang];
    document.title = titles[lang];
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

  // Mobile nav
  const nav = document.getElementById("mainNav");
  document.getElementById("navToggle").addEventListener("click", () =>
    nav.classList.toggle("open")
  );
  nav.addEventListener("click", e => {
    if (e.target.tagName === "A") nav.classList.remove("open");
  });

  // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Counter animation
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      counterIO.unobserve(en.target);
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const isYear = target >= 1900 && target <= 2100;
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(target * eased);
        el.textContent = isYear ? String(v) : v.toLocaleString("en-US");
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-count]").forEach(el => counterIO.observe(el));

  // Duplicate marquee content for seamless loop
  const track = document.getElementById("clientTrack");
  track.innerHTML += track.innerHTML;
})();
