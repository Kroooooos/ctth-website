/* Lightweight time-bucketed pageview logger (keyless, CounterAPI).
   Each visit increments an hour bucket and a day bucket keyed to Bangkok time
   (UTC+7). The admin page reads these buckets to chart visits per time slot.
   Public counters — adequate for a brochure site, not for sensitive metrics. */
(function () {
  window.CTTH_ANALYTICS = {
    BASE: "https://api.counterapi.dev/v1",
    NS: "ctth-site-prod-2026",
    // Bangkok (UTC+7, no DST) calendar parts for a given Date
    bkk: function (d) {
      const t = new Date((d || new Date()).getTime() + 7 * 3600 * 1000);
      return {
        y: t.getUTCFullYear(),
        m: t.getUTCMonth() + 1,
        d: t.getUTCDate(),
        h: t.getUTCHours(),
        date: t
      };
    },
    pad: n => String(n).padStart(2, "0"),
    hourKey: function (p) { return "h" + p.y + this.pad(p.m) + this.pad(p.d) + this.pad(p.h); },
    dayKey:  function (p) { return "d" + p.y + this.pad(p.m) + this.pad(p.d); },
    up: function (key) {
      // fire-and-forget increment
      try { fetch(`${this.BASE}/${this.NS}/${key}/up`, { keepalive: true, mode: "cors" }); } catch (e) {}
    },
    read: function (key) {
      return fetch(`${this.BASE}/${this.NS}/${key}/`, { mode: "cors" })
        .then(r => (r.ok ? r.json() : null))
        .then(j => (j && typeof j.count === "number" ? j.count : 0))
        .catch(() => 0);
    }
  };

  const A = window.CTTH_ANALYTICS;
  const host = location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1" || host === "";
  const isAdmin = /admin\.html$/.test(location.pathname);

  // Log a pageview once per page load, excluding local previews and the admin page.
  if (!isLocal && !isAdmin) {
    const p = A.bkk();
    A.up(A.hourKey(p));
    A.up(A.dayKey(p));
  }
})();
