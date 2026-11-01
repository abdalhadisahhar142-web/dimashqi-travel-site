/* ==========================================================================
   الدمشقي للسياحة والسفر — script.js
   Plain JavaScript, no dependencies. Sections, in order:
    1. Helpers
    2. Office details (edit phone, WhatsApp and address here)
    3. Photos (edit or replace any photo here)
    4. Content (edit trips, prices, destinations and reviews here)
    5. Header
    6. Hero
    7. Destinations marquee
    8. Booking form
    9. Packages & local trips
   10. Services accordion
   11. Destinations lightbox
   12. Testimonials slider
   13. Number counters
   14. Location map
   15. Scroll progress & reveal
   16. Start
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. Helpers
     ------------------------------------------------------------------ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

  /** Runs `callback` at most once per animation frame. */
  function rafThrottle(callback) {
    let scheduled = false;
    return (...args) => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        callback(...args);
      });
    };
  }

  /* ------------------------------------------------------------------
     2. Office details
     ------------------------------------------------------------------ */

  const SITE = Object.freeze({
    whatsappNumber: "963935111077",
    phone: "+963 935 111 077",
  });

  const whatsappLink = (message = "") =>
    `https://wa.me/${SITE.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  /* ------------------------------------------------------------------
     3. Photos
     Photos live in the images folder. To change one, replace the file
     or change its path here.
     ------------------------------------------------------------------ */

  const PHOTOS = {
    umrah: "images/umrah.webp",
    umrahg: "images/umrahg.webp",
    lebanon: "images/lebanon.webp",
    lebanong: "images/lebanong.webp",
    egypt: "images/egypt.webp",
    egyptg: "images/egyptg.webp",
    balkans: "images/balkans.webp",
    balkansg: "images/balkansg.webp",
    saydnaya: "images/saydnaya.webp",
    qandil: "images/qandil.webp",
    tartus: "images/tartus.webp",
    umayyad: "images/umayyad-mosque.webp",
    souk: "images/hamidiyah-souk.webp",
    traveler: "images/gallery.webp",
  };

  /** Returns an <img> tag for a photo in the images folder. */
  function photoTag(src, { alt = "", className = "" } = {}) {
    return `<img class="${className}" src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" loading="lazy" decoding="async" />`;
  }

  /* ------------------------------------------------------------------
     4. Content
     Trips, prices and destinations come from the office's Instagram.
     `destination` must match an <option> in the booking form.
     ------------------------------------------------------------------ */

  const PACKAGES = [
    {
      photo: PHOTOS.umrah,
      alt: "الكعبة المشرفة في المسجد الحرام",
      title: "حملة نفحات مكة",
      detail: "3 ليالي بالمدينة · 8 ليالي بمكة",
      destination: "عمرة",
      badge: "مع هدايا للرحلة",
      price: { label: "ابتداءً من", amount: "$385" },
    },
    {
      photo: PHOTOS.lebanon,
      alt: "صخرة الروشة في بيروت وقت الغروب",
      title: "رحلة إلى لبنان",
      detail: "12 – 14 نوفمبر · WH Hotel الحمرا",
      destination: "لبنان",
      badge: "احجز مقعدك",
      tag: "الرحلة الجاية",
    },
    {
      photo: PHOTOS.egypt,
      alt: "أهرامات الجيزة",
      title: "مصر",
      detail: "والرحلة إلها حكاية",
      destination: "مصر",
      tag: "اسأل عن العرض",
    },
    {
      photo: PHOTOS.balkans,
      alt: "المتحف الوطني في بلغراد",
      title: "البلقان",
      detail: "صربيا وألبانيا",
      destination: "البلقان (صربيا وألبانيا)",
      tag: "اسأل عن العرض",
    },
  ];

  const LOCAL_TRIPS = [
    { photo: PHOTOS.saydnaya, title: "دير صيدنايا ومنتزه أبو النخل", detail: "يوم مليان أجواء حلوة" },
    { photo: PHOTOS.qandil, title: "وادي العيون · مشقيتا · وادي قنديل", detail: "مع منتجع لابلاج" },
    { photo: PHOTOS.tartus, title: "طرطوس", detail: "بحر وشمس ومسبح" },
  ];

  const DESTINATIONS = [
    "مكة المكرمة",
    "المدينة المنورة",
    "لبنان",
    "مصر",
    "صربيا",
    "ألبانيا",
    "السعودية",
    "طرطوس",
    "وادي قنديل",
    "صيدنايا",
  ];

  const GALLERY_SLIDES = [
    { photo: PHOTOS.umayyad, caption: "الجامع الأموي، دمشق" },
    { photo: PHOTOS.souk, caption: "سوق الحميدية، دمشق" },
    { photo: PHOTOS.umrahg, caption: "مكة المكرمة" },
    { photo: PHOTOS.lebanong, caption: "بيروت" },
    { photo: PHOTOS.egyptg, caption: "مصر" },
    { photo: PHOTOS.balkansg, caption: "صربيا" },
  ];

  /** Sample reviews. Replace with real ones, then set this to false. */
  const TESTIMONIALS_ARE_SAMPLES = true;

  const TESTIMONIALS = [
    {
      name: "اسم العميل",
      city: "دمشق",
      color: "#3b5560",
      quote:
        "من أول اتصال لآخر يوم بالرحلة كانوا معنا خطوة بخطوة. الفندق كان أحلى من الصور والاستقبال بالمطار على الوقت.",
    },
    {
      name: "اسم العميل",
      city: "حلب",
      color: "#8a5a44",
      quote: "رتبولي عمرة لأهلي بكل تفاصيلها، وكانوا يطمنوني عليهم كل يوم. خدمة محترمة وأسعار واضحة.",
    },
    {
      name: "اسم العميل",
      city: "حمص",
      color: "#5a4a6e",
      quote: "أول سفرة إلنا لبرا وما حسينا بأي ضغط. البرنامج كان متوازن بين الجولات والراحة.",
    },
    {
      name: "اسم العميل",
      city: "اللاذقية",
      color: "#2f5a4c",
      quote: "حجزنا رحلة لبنان عن طريقهم، وكل شي كان مرتب بذوق. أكيد رح نرجع نسافر معهم.",
    },
  ];

  /* ------------------------------------------------------------------
     5. Header
     ------------------------------------------------------------------ */

  function initHeader() {
    const header = $("[data-header]");
    const toggle = $("[data-nav-toggle]");
    if (!header || !toggle) return;

    const updateScrolled = () => header.classList.toggle("is-scrolled", window.scrollY > 40);

    const setMenuOpen = (open) => {
      header.classList.toggle("is-menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    };

    toggle.addEventListener("click", () => setMenuOpen(!header.classList.contains("is-menu-open")));
    $$("[data-nav-list] a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });

    window.addEventListener("scroll", rafThrottle(updateScrolled), { passive: true });
    updateScrolled();
  }

  /* ------------------------------------------------------------------
     6. Hero: word-by-word title entrance and a slow parallax on the photo
     ------------------------------------------------------------------ */

  function splitTitleWords(title) {
    let index = 0;

    const wrap = (text) => {
      const fragment = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(part);
          return;
        }
        const word = document.createElement("span");
        word.className = "word";
        word.style.setProperty("--word-index", index++);
        word.textContent = part;
        fragment.append(word);
      });
      return fragment;
    };

    [...title.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.replaceWith(wrap(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.classList.add("word");
        node.style.setProperty("--word-index", index++);
      }
    });
  }

  function initHero() {
    const hero = $(".hero");
    if (!hero) return;

    const title = $("[data-split-words]", hero);
    if (title) splitTitleWords(title);

    const photo = $(".hero__photo", hero);
    if (!photo || prefersReducedMotion()) return;

    const render = () => {
      const y = window.scrollY;
      if (y > hero.offsetHeight) return;
      photo.style.transform = `translate3d(0, ${(y * 0.3).toFixed(1)}px, 0) scale(1.08)`;
    };

    window.addEventListener("scroll", rafThrottle(render), { passive: true });
    render();
  }

  /* ------------------------------------------------------------------
     7. Destinations marquee (repeated so the loop never shows a gap)
     ------------------------------------------------------------------ */

  function initMarquee(items) {
    const track = $("[data-marquee]");
    if (!track) return;
    const row = items.map((item) => `<span class="marquee__item">${escapeHTML(item)}</span>`).join("");
    track.innerHTML = row.repeat(4);
  }

  /* ------------------------------------------------------------------
     8. Booking form
     No backend: a valid submission becomes a prefilled WhatsApp message.
     ------------------------------------------------------------------ */

  function selectDestination(value) {
    const select = $("[data-destination-select]");
    if (select && [...select.options].some((option) => option.value === value)) select.value = value;
  }

  function initBookingForm() {
    const form = $("[data-booking-form]");
    const body = $("[data-booking-body]");
    if (!form || !body) return;

    const nameInput = form.elements.namedItem("name");
    const phoneInput = form.elements.namedItem("phone");
    const destinationSelect = form.elements.namedItem("destination");

    form.addEventListener("input", (event) => {
      if (event.target.getAttribute("aria-invalid") === "true") {
        event.target.setAttribute("aria-invalid", "false");
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const invalid = [nameInput, phoneInput].filter((field) => !field.value.trim());
      [nameInput, phoneInput].forEach((field) =>
        field.setAttribute("aria-invalid", String(invalid.includes(field))),
      );
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const name = nameInput.value.trim();
      const destination = destinationSelect.value;
      const message = `مرحبا الدمشقي، أنا ${name}. بدي استفسر عن: ${destination}. رقمي: ${phoneInput.value.trim()}`;

      body.innerHTML = `
        <div class="booking-success" role="status">
          <div class="booking-success__tick" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
          </div>
          <h3>تمام يا ${escapeHTML(name.split(" ")[0])}، طلبك جاهز</h3>
          <p>اضغط الزر لترسل طلبك (${escapeHTML(destination)}) على واتساب المكتب، أو اتصل على <span class="ltr">${SITE.phone}</span>.</p>
          <a class="btn btn--dark" href="${whatsappLink(message)}" target="_blank" rel="noopener">أرسل على واتساب <span class="btn__arrow" aria-hidden="true">←</span></a>
        </div>`;
    });
  }

  /* ------------------------------------------------------------------
     9. Packages & local trips
     ------------------------------------------------------------------ */

  const HEART_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3 1.7-1.8 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';

  function packageCardHTML(pkg, index) {
    const priceOrTag = pkg.price
      ? `<span class="package-card__price"><small>${escapeHTML(pkg.price.label)}</small><strong>${escapeHTML(pkg.price.amount)}</strong></span>`
      : `<span class="package-card__tag">${escapeHTML(pkg.tag)}</span>`;

    return `
      <article class="package-card" data-reveal style="--reveal-delay:${index * 0.1}s">
        ${photoTag(pkg.photo, { alt: pkg.alt, className: "package-card__photo" })}
        <button class="favorite-button" type="button" aria-label="أضف ${escapeHTML(pkg.title)} للمفضلة" aria-pressed="false">${HEART_ICON}</button>
        ${pkg.badge ? `<span class="package-card__badge">${escapeHTML(pkg.badge)}</span>` : ""}
        <div class="package-card__meta">
          <div>
            <h3 class="package-card__title">
              <a class="package-card__link" href="#contact" data-destination="${escapeHTML(pkg.destination)}">${escapeHTML(pkg.title)}</a>
            </h3>
            <div class="package-card__detail">${escapeHTML(pkg.detail)}</div>
          </div>
          ${priceOrTag}
        </div>
      </article>`;
  }

  function localTripHTML(trip, index) {
    return `
      <a href="#contact" class="trip-row" data-reveal data-destination="رحلة داخلية" style="--reveal-delay:${index * 0.08}s">
        <span class="trip-row__thumb">${photoTag(trip.photo)}</span>
        <span>
          <h4 class="trip-row__title">${escapeHTML(trip.title)}</h4>
          <p class="trip-row__text">${escapeHTML(trip.detail)}</p>
        </span>
      </a>`;
  }

  function initPackages() {
    const grid = $("[data-packages]");
    const localList = $("[data-local-trips]");

    if (grid) grid.innerHTML = PACKAGES.map(packageCardHTML).join("");
    if (localList) localList.innerHTML = LOCAL_TRIPS.map(localTripHTML).join("");

    $$(".favorite-button").forEach((button) => {
      button.addEventListener("click", () => {
        const pressed = button.getAttribute("aria-pressed") === "true";
        button.setAttribute("aria-pressed", String(!pressed));
        button.classList.remove("is-popping");
        void button.offsetWidth; // restart the animation
        button.classList.add("is-popping");
      });
    });

    $$("[data-destination]").forEach((link) => {
      link.addEventListener("click", () => selectDestination(link.dataset.destination));
    });

    if (!hasFinePointer() || prefersReducedMotion()) return;

    $$(".package-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------
     10. Services accordion: titles only; a click opens one card at a time
     ------------------------------------------------------------------ */

  function initServices() {
    const cards = $$("[data-service-stack] .service-card");

    const setOpen = (card, open) => {
      card.classList.toggle("is-open", open);
      $(".service-card__toggle", card).setAttribute("aria-expanded", String(open));
    };

    cards.forEach((card) => {
      $(".service-card__toggle", card).addEventListener("click", () => {
        const willOpen = !card.classList.contains("is-open");
        cards.forEach((other) => setOpen(other, other === card && willOpen));
      });
    });
  }

  /* ------------------------------------------------------------------
     11. Destinations lightbox
     Auto-advancing slideshow with arrows, keyboard (← →) and swipe.
     ------------------------------------------------------------------ */

  const SLIDE_DURATION_MS = 4000;

  function initLightbox() {
    const lightbox = $("[data-lightbox]");
    const stage = $("[data-lightbox-stage]");
    const caption = $("[data-lightbox-caption]");
    const counter = $("[data-lightbox-counter]");
    const progress = $("[data-lightbox-progress]");
    const openButton = $("[data-lightbox-open]");
    const closeButton = $("[data-lightbox-close]");
    if (!lightbox || !stage || !openButton) return;

    stage.insertAdjacentHTML(
      "afterbegin",
      GALLERY_SLIDES.map((slide) => photoTag(slide.photo, { alt: slide.caption })).join(""),
    );
    const frames = $$("img", stage);
    const total = frames.length;
    progress.style.setProperty("--slide-duration", `${SLIDE_DURATION_MS}ms`);

    let current = 0;
    let timer = null;

    const restartProgress = () => {
      progress.classList.remove("is-running");
      void progress.offsetWidth; // restart the CSS animation
      progress.classList.add("is-running");
    };

    const show = (index) => {
      current = (index + total) % total;
      frames.forEach((frame, i) => frame.classList.toggle("is-current", i === current));
      caption.textContent = GALLERY_SLIDES[current].caption;
      counter.textContent = `${current + 1} / ${total}`;
      restartProgress();
    };

    const startAutoplay = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => show(current + 1), SLIDE_DURATION_MS);
    };

    /** Manual navigation also resets the autoplay countdown. */
    const go = (step) => {
      show(current + step);
      startAutoplay();
    };

    const open = () => {
      frames.forEach((frame) => (frame.loading = "eager"));
      lightbox.hidden = false;
      requestAnimationFrame(() => lightbox.classList.add("is-open"));
      document.body.style.overflow = "hidden";
      show(0);
      startAutoplay();
      closeButton.focus();
    };

    const close = () => {
      if (lightbox.hidden) return;
      window.clearInterval(timer);
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      window.setTimeout(() => (lightbox.hidden = true), 400);
      openButton.focus();
    };

    openButton.addEventListener("click", open);
    closeButton.addEventListener("click", close);
    $("[data-lightbox-next]").addEventListener("click", () => go(1));
    $("[data-lightbox-prev]").addEventListener("click", () => go(-1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    // In RTL, the left arrow key moves forward
    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") go(1);
      if (event.key === "ArrowRight") go(-1);
    });

    let touchStartX = null;
    stage.addEventListener("touchstart", (event) => (touchStartX = event.touches[0].clientX), {
      passive: true,
    });
    stage.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 40) go(deltaX > 0 ? 1 : -1);
      touchStartX = null;
    });
  }

  /* ------------------------------------------------------------------
     12. Testimonials slider (in RTL the track moves right)
     ------------------------------------------------------------------ */

  function testimonialHTML({ name, city, color, quote }) {
    return `
      <article class="testimonial">
        <div>
          <div class="testimonial__stars" aria-label="تقييم 5 من 5">★★★★★</div>
          <p class="testimonial__quote">${escapeHTML(quote)}</p>
        </div>
        <div class="testimonial__author">
          <span class="testimonial__avatar" style="background:${escapeHTML(color)}" aria-hidden="true">${escapeHTML(name.charAt(0))}</span>
          <div>
            <b class="testimonial__name">${escapeHTML(name)}</b>
            <span class="testimonial__city">${escapeHTML(city)}</span>
          </div>
        </div>
      </article>`;
  }

  function initTestimonials() {
    const track = $("[data-slider-track]");
    const prev = $("[data-slider-prev]");
    const next = $("[data-slider-next]");
    const note = $("[data-sample-note]");
    if (!track || !prev || !next) return;

    if (note) note.hidden = !TESTIMONIALS_ARE_SAMPLES;
    track.innerHTML = TESTIMONIALS.map(testimonialHTML).join("");

    const GAP_PX = 28;
    let index = 0;

    const update = () => {
      const visible = window.innerWidth <= 820 ? 1 : 2;
      const maxIndex = Math.max(0, TESTIMONIALS.length - visible);
      index = Math.min(Math.max(index, 0), maxIndex);

      const cardWidth = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 0;
      track.style.transform = `translateX(${index * (cardWidth + GAP_PX)}px)`;
      prev.disabled = index === 0;
      next.disabled = index === maxIndex;
    };

    prev.addEventListener("click", () => {
      index -= 1;
      update();
    });
    next.addEventListener("click", () => {
      index += 1;
      update();
    });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------
     13. Number counters (the final value is already in the HTML)
     ------------------------------------------------------------------ */

  function initCounters() {
    const counters = $$("[data-count-to]");
    if (!counters.length || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const countUp = (el) => {
      const target = Number(el.dataset.countTo);
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - start) / 1600);
        const eased = 1 - (1 - progress) ** 3;
        el.textContent = Math.round(target * eased).toLocaleString("en-US");
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        countUp(entry.target);
      });
    });
    counters.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------
     14. Location map: plays its entrance once it scrolls into view
     ------------------------------------------------------------------ */

  function initMap() {
    const card = $("[data-map]");
    if (!card || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const motion = $("[data-map-motion]", card);
    card.classList.add("is-armed");

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        card.classList.add("is-animating");
        // The traveling dot starts once the route has been drawn
        window.setTimeout(() => motion && motion.beginElement && motion.beginElement(), 2600);
      },
      { threshold: 0.35 },
    );
    observer.observe(card);
  }

  /* ------------------------------------------------------------------
     15. Scroll progress & reveal
     Reveal hides only elements below the fold at load, so the first
     screen is always complete; a safety timeout shows everything.
     ------------------------------------------------------------------ */

  function initScrollProgress() {
    const bar = $("[data-scroll-progress]");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    window.addEventListener("scroll", rafThrottle(update), { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function initReveal() {
    const elements = $$("[data-reveal]");
    if (!elements.length || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("is-pending");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("is-pending");
        observer.observe(el);
      }
    });

    window.setTimeout(() => {
      elements.forEach((el) => el.classList.remove("is-pending"));
      observer.disconnect();
    }, 3000);
  }

  /* ------------------------------------------------------------------
     16. Start
     ------------------------------------------------------------------ */

  initHeader();
  initHero();
  initMarquee(DESTINATIONS);
  initPackages();
  initServices();
  initLightbox();
  initTestimonials();
  initBookingForm();
  initCounters();
  initMap();
  initScrollProgress();

  const year = $("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  initReveal();
})();
