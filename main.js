/* ================================================================
   main.js — Portfolio Scripts
   Hemant Sherawat · hemantsherawat.com
   ================================================================

   TABLE OF CONTENTS
   -----------------
   1. Scroll Reveal
   2. Interview Row Clicks
   3. Footer Year

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
   2. INTERVIEW ROW CLICKS
   Makes each <tr class="interview-row"> in index.html clickable.
   Reads the data-href attribute and navigates to the detail page.

   HOW TO WIRE UP A ROW TO A PAGE:
     In index.html, set data-href on the <tr>:
       <tr class="interview-row" data-href="./interviews/company-role.html">
     The value must be the relative path from index.html to the file.
     Use "#" as a placeholder while the detail page doesn't exist yet —
     clicking will do nothing until you replace it with a real path.

   HOW TO MAKE ONE ROW NON-CLICKABLE:
     Remove the data-href attribute from that <tr> entirely.
---------------------------------------------------------------- */
document.querySelectorAll('.interview-row').forEach(row => {
  row.addEventListener('click', () => {
    const href = row.dataset.href;
    // Skip rows where href is missing or still a "#" placeholder
    if (href && href !== '#') {
      window.location.href = href;
    }
  });
});


/* ----------------------------------------------------------------
   3. FOOTER YEAR
   Automatically inserts the current year into the footer so
   you never need to manually update it.

   HOW TO UPDATE YOUR NAME / DOMAIN:
     Change "Hemant Sherawat" and "hemantsherawat.com" below.
---------------------------------------------------------------- */
document.getElementById('footer-text').textContent =
  `© ${new Date().getFullYear()} Hemant Sherawat · hemantsherawat.com`;