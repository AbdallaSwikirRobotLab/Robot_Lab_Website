(function () {
  "use strict";

  var body = document.body;
  var masthead = document.querySelector(".masthead");
  var hero = document.querySelector(".jumbotron.subhead");
  var activeNav = document.querySelector("#primary-nav li.active a");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  body.classList.add("js-enabled");

  if (hero && activeNav) {
    var pageName = (activeNav.textContent || "").replace(/^\s+|\s+$/g, "");
    if (pageName) {
      var chip = document.createElement("span");
      chip.className = "page-chip";
      chip.textContent = pageName;
      hero.appendChild(chip);
    }
  }

  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  body.appendChild(progress);

  var scrollQueued = false;
  function updateScrollEffects() {
    var top = window.pageYOffset || document.documentElement.scrollTop || 0;
    var height = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var ratio = Math.max(0, Math.min(1, top / height));

    progress.style.transform = "scaleX(" + ratio + ")";
    if (masthead) {
      if (top > 18) {
        masthead.classList.add("is-scrolled");
      } else {
        masthead.classList.remove("is-scrolled");
      }
    }
    scrollQueued = false;
  }

  function queueScrollEffects() {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateScrollEffects);
    }
  }

  window.addEventListener("scroll", queueScrollEffects, { passive: true });
  window.addEventListener("resize", queueScrollEffects);
  updateScrollEffects();

  var revealTargets = document.querySelectorAll(
    ".hero-intro, .hero-research, .feature, .person-card, .proj-item, .pub-item, " +
    ".news-item, .news-preview, .home-link-strip, .home-section-heading, .course-card, .contact-card, " +
    ".resource-box, .callout, .tile, .page-header"
  );

  for (var i = 0; i < revealTargets.length; i += 1) {
    revealTargets[i].classList.add("reveal");
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    for (var j = 0; j < revealTargets.length; j += 1) {
      revealTargets[j].classList.add("is-visible");
    }
  } else {
    var observer = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k += 1) {
        if (entries[k].isIntersecting) {
          entries[k].target.classList.add("is-visible");
          observer.unobserve(entries[k].target);
        }
      }
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    });

    for (var n = 0; n < revealTargets.length; n += 1) {
      observer.observe(revealTargets[n]);
    }
  }

  var hashLinks = document.querySelectorAll('a[href^="#"]');
  for (var h = 0; h < hashLinks.length; h += 1) {
    hashLinks[h].addEventListener("click", function (event) {
      var href = this.getAttribute("href");
      if (!href || href === "#") {
        return;
      }
      var target = document.querySelector(href);
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", href);
      }
    });
  }
})();
