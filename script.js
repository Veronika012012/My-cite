// script.js

(() => {
  "use strict";

  // --- Helpers ---
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // --- Mobile nav toggle ---
  const toggleBtn = $(".nav__toggle");
  const navMenu = $("#navMenu");

  const setMenuState = (open) => {
    if (!toggleBtn || !navMenu) return;
    toggleBtn.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("is-open", open);
  };

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");
      setMenuState(!isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const clickInsideNav = e.target.closest(".nav");
      if (!clickInsideNav) setMenuState(false);
    });

    // Close menu on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuState(false);
    });
  }

  // --- Smooth scroll for nav links (+ close mobile menu) ---
  const headerEl = $(".header");
  const getHeaderOffset = () => (headerEl ? headerEl.getBoundingClientRect().height : 0);

  const smoothTo = (targetEl) => {
    if (!targetEl) return;
    const y =
      window.scrollY +
      targetEl.getBoundingClientRect().top -
      getHeaderOffset() -
      10;

    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      setMenuState(false);
      smoothTo(target);
    });
  });

  // --- Reveal on scroll (IntersectionObserver) ---
  const reveals = $$(".reveal");
  if (reveals.length) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      reveals.forEach((el) => el.classList.add("visible"));
    } else {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { root: null, threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
      );

      reveals.forEach((el) => io.observe(el));
    }
  }

  // --- Footer year ---
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
