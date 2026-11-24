/* Coach Ton Bac · JavaScript vanilla, sans dépendance. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  // Menu mobile
  var btn = document.querySelector(".menu-btn");
  var panel = document.getElementById("mobile-nav");
  if (btn && panel) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        btn.setAttribute("aria-expanded", "false");
        panel.classList.remove("is-open");
        btn.focus();
      }
    });
  }

  // Copie annotée : les annotations s'écrivent quand la copie entre à l'écran
  var copies = document.querySelectorAll(".copy");
  if (copies.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            setTimeout(function () { en.target.classList.add("is-reading"); }, 350);
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.35 });
      copies.forEach(function (c) { io.observe(c); });
    } else {
      copies.forEach(function (c) { c.classList.add("is-reading"); });
    }
  }

  // Barre de réservation mobile : visible après le héros
  var sticky = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero, .page-hero");
  if (sticky && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(hero);
  }

  // Agenda Calendly (page rendez-vous) : chargé seulement sur cette page
  var box = document.querySelector("[data-calendly]");
  if (box) {
    var url = box.getAttribute("data-calendly");
    var fallback = box.querySelector(".calendly-fallback");
    if (url && url.indexOf("VOTRE-LIEN") === -1) {
      var sep = url.indexOf("?") === -1 ? "?" : "&";
      var frame = document.createElement("iframe");
      frame.src = url + sep + "hide_gdpr_banner=1&embed_domain=" + encodeURIComponent(location.hostname || "coachtonbac.fr") + "&embed_type=Inline";
      frame.title = "Agenda de réservation du rendez-vous gratuit de 45 minutes";
      frame.loading = "lazy";
      box.insertBefore(frame, box.firstChild);
      if (fallback) fallback.classList.add("sr-only");
    }
  }

  // Message de retour du formulaire de contact (?envoi=ok|erreur)
  var msg = document.querySelector("[data-form-msg]");
  if (msg) {
    var q = location.search;
    if (q.indexOf("envoi=ok") !== -1) {
      msg.hidden = false; msg.className = "form-msg ok";
      msg.textContent = "Merci, votre message est bien parti. Je vous réponds au plus vite.";
    } else if (q.indexOf("envoi=erreur") !== -1) {
      msg.hidden = false; msg.className = "form-msg err";
      msg.textContent = "Le message n'a pas pu partir. Vérifiez les champs ou écrivez directement à l'adresse indiquée.";
    }
  }

  // Année du pied de page
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
