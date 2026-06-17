/* =====================================================================
   THE DEBORAH NETWORK — Interactions
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector(".header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", () => document.body.classList.toggle("menu-open"));
    document.querySelectorAll(".nav__link").forEach((l) =>
      l.addEventListener("click", (e) => {
        // toggle dropdown on mobile
        const parent = l.closest(".has-dropdown");
        if (parent && window.innerWidth <= 920 && l.getAttribute("href") === "#") {
          e.preventDefault();
          parent.classList.toggle("open");
          return;
        }
        document.body.classList.remove("menu-open");
      })
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + (p === 1 ? "" : "");
      if (p < 1) requestAnimationFrame(step);
      else el.innerHTML = target.toLocaleString() + '<span class="plus">' + suffix + "</span>";
    };
    requestAnimationFrame(step);
  };
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            runCounter(en.target);
            cio.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Testimonial carousel ---------- */
  const track = document.querySelector(".testi-track");
  if (track) {
    const slides = track.querySelectorAll(".testi");
    const dotsWrap = track.parentElement.querySelector(".testi-dots");
    let idx = 0;
    let timer;
    const dots = [];
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.addEventListener("click", () => go(i));
      dotsWrap && dotsWrap.appendChild(b);
      dots.push(b);
    });
    const go = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === idx));
      dots.forEach((d, k) => d.classList.toggle("active", k === idx));
      restart();
    };
    const next = () => go(idx + 1);
    const prev = () => go(idx - 1);
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    };
    const nextBtn = document.querySelector("[data-testi-next]");
    const prevBtn = document.querySelector("[data-testi-prev]");
    nextBtn && nextBtn.addEventListener("click", next);
    prevBtn && prevBtn.addEventListener("click", prev);
    go(0);
  }

  /* ---------- Countdown timers ---------- */
  document.querySelectorAll("[data-countdown]").forEach((el) => {
    const target = new Date(el.dataset.countdown).getTime();
    const boxes = {
      d: el.querySelector("[data-cd='d']"),
      h: el.querySelector("[data-cd='h']"),
      m: el.querySelector("[data-cd='m']"),
      s: el.querySelector("[data-cd='s']"),
    };
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        Object.values(boxes).forEach((b) => b && (b.textContent = "00"));
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = (n) => String(n).padStart(2, "0");
      boxes.d && (boxes.d.textContent = pad(d));
      boxes.h && (boxes.h.textContent = pad(h));
      boxes.m && (boxes.m.textContent = pad(m));
      boxes.s && (boxes.s.textContent = pad(s));
    };
    tick();
    setInterval(tick, 1000);
  });

  /* ---------- Forms (demo handling) ---------- */
  document.querySelectorAll("form[data-demo]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector("[data-form-note]") || (() => {
        const n = document.createElement("p");
        n.setAttribute("data-form-note", "");
        n.style.cssText = "margin-top:16px;color:#B8932B;font-weight:600;";
        form.appendChild(n);
        return n;
      })();
      note.textContent = form.dataset.demo || "Thank you! Your submission has been received. We'll be in touch shortly. 💛";
      form.querySelectorAll("input, textarea, select").forEach((f) => {
        if (f.type !== "submit") f.value = "";
      });
    });
  });

  /* ---------- Pills filter (resources) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const pills = group.querySelectorAll(".pill");
    const items = document.querySelectorAll("[data-cat]");
    pills.forEach((pill) =>
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        const f = pill.dataset.filter;
        items.forEach((it) => {
          const show = f === "all" || it.dataset.cat === f;
          it.style.display = show ? "" : "none";
        });
      })
    );
  });

  /* ---------- Prayer wall (add + intercede) ---------- */
  const prayerForm = document.querySelector("[data-prayer-form]");
  if (prayerForm) {
    const wall = document.querySelector(".prayer-wall");
    prayerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = prayerForm.querySelector("textarea, input[type=text]");
      const name = prayerForm.querySelector("[name=name]");
      if (!input || !input.value.trim()) return;
      const note = document.createElement("div");
      note.className = "prayer-note reveal in";
      note.innerHTML =
        '<p>"' + input.value.trim() + '"</p><div class="meta"><span>— ' +
        ((name && name.value.trim()) || "Anonymous") +
        ', just now</span><button class="pray-btn" type="button">🙏 <span>0</span> praying</button></div>';
      wall.prepend(note);
      input.value = "";
      if (name) name.value = "";
    });
  }
  // intercede counter (delegated)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".pray-btn");
    if (!btn) return;
    const span = btn.querySelector("span");
    if (span) span.textContent = parseInt(span.textContent, 10) + 1;
    btn.style.color = "#B8932B";
  });

  /* ---------- AI Mentor widget ---------- */
  const fab = document.querySelector(".ai-fab");
  const panel = document.querySelector(".ai-panel");
  if (fab && panel) {
    const body = panel.querySelector(".ai-body");
    const input = panel.querySelector(".ai-input input");
    const sendBtn = panel.querySelector(".ai-input button");
    const closeBtn = panel.querySelector("[data-ai-close]");

    fab.addEventListener("click", () => panel.classList.toggle("open"));
    closeBtn && closeBtn.addEventListener("click", () => panel.classList.remove("open"));

    const replies = {
      leadership:
        "Leadership in the Deborah model starts with surrender. Deborah led from a place of communion with God — she heard first, then acted. Begin each day in the Word and prayer, then lead with courage and wisdom. 🌿",
      career:
        "For career guidance, identify the gifts God has placed in you and steward them with excellence. Our Leadership Academy and Women in Leadership Forum are built exactly for this. Would you like me to point you to the next intake?",
      bible:
        "A wonderful place to study Deborah is Judges 4–5. Notice how she balanced worship, wisdom, and warfare. Try reading the Song of Deborah (Judges 5) slowly this week and journaling what stirs your heart.",
      event:
        "Our next major gathering is The Deborah Network Convention 2026 — 'The Glory of God' on June 21st in Abuja. You can also join our Weekly Prayer Network online. Shall I take you to the Events page?",
      resource:
        "I'd recommend starting with our Leadership Guides and the Sermon library under Resources. For new members, the 'Becoming a Deborah' starter track is a beautiful first step.",
      default:
        "I'm Deborah AI, here to help you grow in leadership, faith, and purpose. You can ask me about leadership, career direction, Bible study, events, or resources. How can I support you today? 💛",
    };
    const matchReply = (text) => {
      const t = text.toLowerCase();
      if (/(lead|leader|influence|courage)/.test(t)) return replies.leadership;
      if (/(career|job|work|profession|skill)/.test(t)) return replies.career;
      if (/(bible|scripture|study|deborah|judges|pray)/.test(t)) return replies.bible;
      if (/(event|conference|summit|convention|gather)/.test(t)) return replies.event;
      if (/(resource|book|sermon|podcast|video|read)/.test(t)) return replies.resource;
      return replies.default;
    };
    const addMsg = (text, who) => {
      const m = document.createElement("div");
      m.className = "ai-msg " + who;
      m.textContent = text;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      return m;
    };
    const send = (text) => {
      const v = (text || input.value).trim();
      if (!v) return;
      addMsg(v, "user");
      input.value = "";
      const typing = addMsg("…", "bot");
      setTimeout(() => {
        typing.textContent = matchReply(v);
        body.scrollTop = body.scrollHeight;
      }, 650);
    };
    sendBtn && sendBtn.addEventListener("click", () => send());
    input &&
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") send();
      });
    panel.querySelectorAll(".ai-suggest button").forEach((b) =>
      b.addEventListener("click", () => send(b.textContent))
    );
  }

  /* ---------- Leadership assessment (mini demo) ---------- */
  const assessForm = document.querySelector("[data-assess]");
  if (assessForm) {
    assessForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const vals = [...assessForm.querySelectorAll("input[type=range]")].map((r) => +r.value);
      const avg = Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 10)) * 100);
      const ring = document.querySelector(".score-ring");
      const out = document.querySelector("[data-assess-out]");
      if (ring) {
        ring.style.setProperty("--p", avg + "%");
        ring.querySelector("span").textContent = avg;
      }
      if (out) {
        let msg = "Emerging Leader — you have a strong foundation to build on.";
        if (avg >= 80) msg = "Transformational Leader — you're ready to multiply yourself in others. 🌟";
        else if (avg >= 60) msg = "Established Leader — sharpen your vision and step into greater influence.";
        out.textContent = msg;
        out.parentElement.style.display = "block";
      }
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
