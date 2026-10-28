/* =============================================================================
   Eric Reboisson — script du site
   -----------------------------------------------------------------------------
   Vanilla JavaScript, sans dependance. Trois responsabilites :
     1. Bascule de theme clair / sombre (memorise dans localStorage)
     2. Menu mobile (burger)
     3. Apparition des blocs au scroll (IntersectionObserver)
   Plus un detail : l'annee du pied de page.
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'er-theme';
  var root = document.documentElement;

  /* Respecte la preference systeme "reduire les animations". */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ===========================================================================
     1. THEME CLAIR / SOMBRE
     Le theme initial est deja pose par le script inline de index.html, avant le
     premier rendu. Ici, on ne fait que gerer le clic.
     ======================================================================== */

  var themeButton = document.querySelector('.theme-toggle');

  if (themeButton) {
    /** Renvoie le theme actuellement affiche. */
    function currentTheme() {
      return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    /** Met a jour le libelle et l'etat du bouton pour les lecteurs d'ecran. */
    function syncThemeButton() {
      var isLight = currentTheme() === 'light';
      // Le libelle annonce l'action a venir, pas l'etat courant.
      themeButton.setAttribute('aria-label', isLight ? 'Passer en thème sombre' : 'Passer en thème clair');
      themeButton.setAttribute('aria-pressed', String(isLight));
    }

    syncThemeButton();

    themeButton.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* Mode prive ou stockage plein : le theme change quand meme, sans memorisation. */
      }
      syncThemeButton();
    });

    /* Si l'utilisateur n'a jamais choisi, on suit le changement de theme systeme. */
    var systemLight = window.matchMedia('(prefers-color-scheme: light)');
    var onSystemChange = function (e) {
      var saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) { saved = null; }
      if (!saved) {
        root.setAttribute('data-theme', e.matches ? 'light' : 'dark');
        syncThemeButton();
      }
    };
    if (systemLight.addEventListener) systemLight.addEventListener('change', onSystemChange);
  }

  /* ===========================================================================
     2. MENU MOBILE
     ======================================================================== */

  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    /** Ouvre ou ferme le menu, et garde aria-expanded coherent. */
    function setMenu(open) {
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation');
      siteNav.classList.toggle('is-open', open);
      if (open) {
        var firstLink = siteNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    }

    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    /* La touche Echap referme le menu et rend le focus au bouton. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus();
      }
    });

    /* Un clic sur un lien referme le menu : la navigation ancre reste lisible. */
    siteNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    /* Revient a la mise en page bureau : on remet le menu dans le flux. */
    var desktop = window.matchMedia('(min-width: 768px)');
    var onBreakpoint = function (e) { if (e.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
  }

  /* ===========================================================================
     3. APPARITION AU SCROLL
     Chaque bloc .reveal est masque par le CSS (uniquement si la classe "js" est
     presente sur <html>), puis revele a l'entree dans le viewport.
     ======================================================================== */

  var revealables = document.querySelectorAll('.reveal');

  function revealAll() {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  }

  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    /* Pas de IntersectionObserver, ou animations non souhaitees : tout est montre. */
    revealAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); /* Une seule fois : pas d'animation en boucle. */
        }
      });
    }, {
      rootMargin: '0px 0px -12% 0px', /* Declenche un peu avant que le bloc soit fully visible. */
      threshold: 0.05
    });

    Array.prototype.forEach.call(revealables, function (el) {
      observer.observe(el);
    });

    /* Si l'utilisateur demande l'animation en cours de visite, on tout montre. */
    var onMotionChange = function (e) { if (e.matches) revealAll(); };
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
  }

  /* ===========================================================================
     4. ANNEE DU PIED DE PAGE
     ======================================================================== */

  var year = document.getElementById('annee');
  if (year) year.textContent = String(new Date().getFullYear());

})();
