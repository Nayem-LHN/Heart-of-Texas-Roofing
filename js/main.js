/* Heart of Texas Roofing — interactions */
(function () {
  "use strict";

  var onReady = function (fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  onReady(function () {
    /* ---------- Footer year ---------- */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* ---------- Header shadow on scroll ---------- */
    var header = document.getElementById("siteHeader");
    if (header) {
      var onScroll = function () {
        if (window.scrollY > 10) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---------- Mobile navigation ---------- */
    var body = document.body;
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("navPanel");
    var overlay = document.getElementById("navOverlay");
    var closeBtn = document.getElementById("navClose");

    function openNav() {
      body.classList.add("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "true");
    }
    function closeNav() {
      body.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
    if (toggle) toggle.addEventListener("click", function () {
      body.classList.contains("nav-open") ? closeNav() : openNav();
    });
    if (overlay) overlay.addEventListener("click", closeNav);
    if (closeBtn) closeBtn.addEventListener("click", closeNav);
    if (panel) panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    /* ---------- Active nav link ---------- */
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__link, .nav-panel__link").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === path) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll(".faq__item").forEach(function (item) {
      var btn = item.querySelector(".faq__q");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        item.parentElement.querySelectorAll(".faq__item").forEach(function (sib) {
          sib.classList.remove("is-open");
          var b = sib.querySelector(".faq__q");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    /* ---------- Back to top ---------- */
    var toTop = document.getElementById("toTop");
    if (toTop) {
      var toggleTop = function () {
        if (window.scrollY > 600) toTop.classList.add("is-visible");
        else toTop.classList.remove("is-visible");
      };
      toggleTop();
      window.addEventListener("scroll", toggleTop, { passive: true });
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ---------- Contact / quote forms ---------- */
    document.querySelectorAll("form[data-validate]").forEach(function (form) {
      var success = form.parentElement.querySelector(".form-success");

      function setError(field, msg) {
        field.classList.add("has-error");
        var err = field.querySelector(".field__error");
        if (err && msg) err.textContent = msg;
      }
      function clearError(field) { field.classList.remove("has-error"); }

      form.querySelectorAll(".field input, .field select, .field textarea").forEach(function (input) {
        input.addEventListener("input", function () {
          clearError(input.closest(".field"));
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;
        var firstBad = null;

        form.querySelectorAll("[required]").forEach(function (input) {
          var field = input.closest(".field") || input.closest(".consent");
          var value = (input.value || "").trim();
          var ok = true;
          var msg = "This field is required.";

          if (input.type === "checkbox") {
            ok = input.checked;
            msg = "Please agree to continue.";
          } else if (!value) {
            ok = false;
          } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            ok = false; msg = "Enter a valid email address.";
          } else if (input.type === "tel" && value.replace(/\D/g, "").length < 10) {
            ok = false; msg = "Enter a valid phone number.";
          }

          if (!ok) {
            valid = false;
            if (field) {
              setError(field, msg);
              if (!firstBad) firstBad = input;
            }
          }
        });

        if (!valid) {
          if (firstBad) firstBad.focus();
          return;
        }

        var submitBtn = form.querySelector("[type=submit]");
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

        window.setTimeout(function () {
          form.style.display = "none";
          if (success) {
            success.classList.add("is-visible");
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 700);
      });
    });

    /* ---------- Smooth hash links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          var top = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      });
    });
  });
})();
