/* Aryan's Engineering site interactions */

document.body.classList.add("js-ready");

const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navMenuWrap = document.querySelector(".nav-menu-wrap");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const revealElements = document.querySelectorAll(".reveal, .stagger");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const portfolioCards = Array.from(document.querySelectorAll(".portfolio-card"));
const counters = document.querySelectorAll(".counter");
const statsSection = document.querySelector(".stats-bar");
const form = document.getElementById("quote-form");
const successMessage = document.getElementById("form-success");
const whatsappFloat = document.getElementById("whatsapp-float");
const heroTitle = document.querySelector(".hero-title");
const observedSections = Array.from(document.querySelectorAll("main section[id], header[id]"));
const imageFallback =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'>" +
      "<rect width='1600' height='1000' fill='#111111'/>" +
      "<rect x='60' y='60' width='1480' height='880' fill='none' stroke='#2a2a2a' stroke-width='4'/>" +
      "<path d='M0 760 L1600 320' stroke='#e07b2a' stroke-width='6' opacity='0.35'/>" +
      "<text x='120' y='470' fill='#f0f2f4' font-family='Arial, sans-serif' font-size='110' letter-spacing='8'>ARYAN'S ENGINEERING</text>" +
      "<text x='120' y='590' fill='#b0b8c1' font-family='Arial, sans-serif' font-size='46' letter-spacing='10'>INDUSTRIAL IMAGE UNAVAILABLE</text>" +
    "</svg>"
  );
let countersStarted = false;

const setNavState = () => {
  nav.classList.toggle("scrolled", window.scrollY > 80);
};

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    if (img.dataset.fallbackApplied) {
      return;
    }

    img.dataset.fallbackApplied = "true";
    img.src = imageFallback;
  });
});

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

if (heroTitle && window.matchMedia("(pointer:fine)").matches) {
  const resetHeroTitle = () => {
    heroTitle.style.setProperty("--hero-title-x", "0");
    heroTitle.style.setProperty("--hero-title-y", "0");
    heroTitle.style.setProperty("--hero-title-glow-x", "50%");
    heroTitle.style.setProperty("--hero-title-glow-y", "50%");
    heroTitle.style.transform = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)";
  };

  heroTitle.addEventListener("pointermove", (event) => {
    const rect = heroTitle.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -8;
    const ry = (px - 0.5) * 10;

    heroTitle.style.setProperty("--hero-title-x", (px - 0.5).toFixed(3));
    heroTitle.style.setProperty("--hero-title-y", (py - 0.5).toFixed(3));
    heroTitle.style.setProperty("--hero-title-glow-x", `${(px * 100).toFixed(1)}%`);
    heroTitle.style.setProperty("--hero-title-glow-y", `${(py * 100).toFixed(1)}%`);
    heroTitle.style.transform = `translate3d(${ry * 0.2}px, ${rx * 0.18}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  heroTitle.addEventListener("pointerleave", resetHeroTitle);
  resetHeroTitle();
}

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenuWrap.classList.toggle("open", !expanded);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    navMenuWrap.classList.remove("open");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    if (entry.target.classList.contains("stagger")) {
      Array.from(entry.target.children).forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.1}s`;
      });
    }

    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

revealElements.forEach((element) => revealObserver.observe(element));

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 2000;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = `${target}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (statsSection) {
  counterObserver.observe(statsSection);
}

const portfolioTimers = new WeakMap();

const showCard = (card) => {
  if (portfolioTimers.has(card)) {
    clearTimeout(portfolioTimers.get(card));
    portfolioTimers.delete(card);
  }

  card.hidden = false;
  requestAnimationFrame(() => card.classList.remove("is-hidden"));
};

const hideCard = (card) => {
  card.classList.add("is-hidden");
  const timer = setTimeout(() => {
    card.hidden = true;
  }, 280);
  portfolioTimers.set(card, timer);
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    portfolioCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const matches = filter === "all" || categories.includes(filter);

      if (matches) {
        showCard(card);
      } else {
        hideCard(card);
      }
    });
  });
});

if (form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const defaultButtonHtml = submitButton ? submitButton.innerHTML : "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending enquiry...";
    }

    successMessage.classList.remove("visible");

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Quote request failed");
      }

      form.reset();
      form.style.display = "none";
      successMessage.innerHTML = "&#10003; Your enquiry has been received. We'll contact you within 24 hours.";
      successMessage.classList.add("visible");
    } catch (error) {
      successMessage.textContent = "Unable to send the enquiry right now. Start the included Node server or deploy the site to a serverless host with RESEND_API_KEY configured.";
      successMessage.classList.add("visible");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = defaultButtonHtml;
      }
    }
  });
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const activeId = entry.target.id;
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", isActive);
    });
  });
}, {
  threshold: 0.45,
  rootMargin: "-20% 0px -35% 0px"
});

observedSections.forEach((section) => {
  if (section.id && section.id !== "hero") {
    sectionObserver.observe(section);
  }
});

window.setTimeout(() => {
  whatsappFloat.classList.add("visible");
}, 3000);

