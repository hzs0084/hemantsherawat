/* ================================================================
   main.js — Portfolio Scripts
   Hemant Sherawat · hemantsherawat.com
   ================================================================

   TABLE OF CONTENTS
   -----------------
   1. Scroll Reveal
   2. Footer Year

   ================================================================ */


/* ----------------------------------------------------------------
   1. SCROLL REVEAL
   Uses IntersectionObserver to watch every element with the
   class "reveal". When an element scrolls into the viewport,
   the class "visible" is added — which triggers the CSS
   fade + slide-up transition defined in styles.css.

   HOW TO ADJUST:
     - threshold: 0.1 → triggers when 10% of the element is visible.
       Increase to 0.2 or 0.3 if you want elements to wait longer
       before animating in.
     - observer.unobserve() → animates once, then stops watching.
       Remove this line if you want elements to re-animate every
       time they scroll in and out of view.

   HOW TO DISABLE ENTIRELY:
     Delete this block and add class="visible" directly to every
     element that has class="reveal" in index.html.
---------------------------------------------------------------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // animate once only
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


/* ----------------------------------------------------------------
   2. FOOTER YEAR
   Automatically inserts the current year into the footer so
   you never need to manually update it.

   HOW TO UPDATE YOUR NAME / DOMAIN:
     Change "Hemant Sherawat" and "hemantsherawat.com" below.
---------------------------------------------------------------- */
document.getElementById('footer-text').textContent =
  `© ${new Date().getFullYear()} Hemant Sherawat · hemantsherawat.com`;