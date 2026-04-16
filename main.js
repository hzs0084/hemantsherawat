/* ================================================================
   main.js — Portfolio Scripts
   Hemant Sherawat · hemantsherawat.com
   ================================================================

   TABLE OF CONTENTS
   -----------------
   1. Glitch Cycler
   2. Scroll Reveal
   3. Interview Row Clicks
   4. Footer Year

   ================================================================ */


/* ----------------------------------------------------------------
   1. GLITCH CYCLER
   Cycles through hacker-flavored phrases. Each phrase:
     1. Scrambles in  — characters randomize rapidly
     2. Resolves      — each character "locks in" left to right
     3. Holds         — phrase stays readable for a moment
     4. Scrambles out — randomizes again before the next phrase

   ── PHRASES ──────────────────────────────────────────────────
   Add, remove, or edit any string in GLITCH_PHRASES.
   Keep phrases roughly similar in length for the smoothest
   visual — very short and very long phrases in the same list
   cause noticeable layout shifts.
---------------------------------------------------------------- */
const GLITCH_PHRASES = [
  'sudo apt-get install curiosity',
  'nmap -sV --script vuln 0.0.0.0',
  './theHarvester.py -d target.com -b all',
  'msfconsole -q -x "use exploit/..."',
  'growing as a security professional, one day at a time',
  'hashcat -m 0 -a 0 hash.txt rockyou.txt',
  'beep boop',
];

/* ── CHARSET ──────────────────────────────────────────────────
   Controls what characters appear during the scramble phase.

   SWITCH BETWEEN TWO STYLES — change this one value:
     'hacker' → symbols: #@!%^&*<>/\|~;:?  (chaotic, aggressive)
     'alpha'  → letters: abcdefghijklmnop   (cleaner, subtle)

   Both styles resolve to the real text — only the scramble
   characters differ.
---------------------------------------------------------------- */
const GLITCH_CHARSET = 'hacker'; // ← change to 'alpha' to try the other style

const CHARSETS = {
  hacker: '!@#$%^&*<>[]{}|/\\;:?~+=_-0123456789',
  alpha:  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP',
};

/* ── TIMING ───────────────────────────────────────────────────
   All durations in milliseconds.
   Tweak these to change the feel of the animation.

   SCRAMBLE_CYCLES   — how many random frames show before resolving
                       More = longer chaos phase. Default: 10
   SCRAMBLE_INTERVAL — ms between each random frame during scramble
                       Lower = faster flickering. Default: 40ms
   RESOLVE_INTERVAL  — ms between each character locking in
                       Lower = faster reveal. Default: 55ms
   HOLD_DURATION     — ms to display the fully resolved phrase
                       Default: 2000ms (2 seconds)
   SCRAMBLE_OUT_CYCLES — random frames before clearing for next phrase
                         Default: 8
   INITIAL_DELAY     — ms before the very first phrase starts
                       Default: 400ms
---------------------------------------------------------------- */
const SCRAMBLE_CYCLES      = 10;
const SCRAMBLE_INTERVAL    = 40;
const RESOLVE_INTERVAL     = 55;
const HOLD_DURATION        = 2000;
const SCRAMBLE_OUT_CYCLES  = 8;
const INITIAL_DELAY        = 400;

/* ── ENGINE — no changes needed below this line ─────────────── */
const cyclerEl = document.querySelector('.glitch-cycler-text');

if (cyclerEl) {
  const charset = CHARSETS[GLITCH_CHARSET] || CHARSETS.hacker;
  let phraseIndex = 0;

  function randChar() {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  function scrambleIn(target, onDone) {
    // Phase 1: show random noise for SCRAMBLE_CYCLES frames
    let cycles = 0;
    cyclerEl.classList.add('scrambling');

    const noise = setInterval(() => {
      // Fill with random chars matching target length
      cyclerEl.textContent = target.split('').map(() => randChar()).join('');
      cycles++;
      if (cycles >= SCRAMBLE_CYCLES) {
        clearInterval(noise);
        resolveIn(target, onDone);
      }
    }, SCRAMBLE_INTERVAL);
  }

  function resolveIn(target, onDone) {
    // Phase 2: lock in each character left to right
    let pos = 0;
    cyclerEl.classList.remove('scrambling');

    const resolve = setInterval(() => {
      // Left portion = real text, right portion = noise
      const locked = target.slice(0, pos);
      const noise  = target.slice(pos).split('').map(() => randChar()).join('');
      cyclerEl.textContent = locked + noise;
      pos++;

      if (pos > target.length) {
        clearInterval(resolve);
        cyclerEl.textContent = target; // ensure perfectly clean final state
        onDone();
      }
    }, RESOLVE_INTERVAL);
  }

  function scrambleOut(target, onDone) {
    // Phase 3: randomize out before switching phrases
    let cycles = 0;
    cyclerEl.classList.add('scrambling');

    const noise = setInterval(() => {
      cyclerEl.textContent = target.split('').map(() => randChar()).join('');
      cycles++;
      if (cycles >= SCRAMBLE_OUT_CYCLES) {
        clearInterval(noise);
        cyclerEl.classList.remove('scrambling');
        cyclerEl.textContent = '';
        onDone();
      }
    }, SCRAMBLE_INTERVAL);
  }

  function runPhrase() {
    const phrase = GLITCH_PHRASES[phraseIndex];

    scrambleIn(phrase, () => {
      // Hold the resolved phrase, then scramble out
      setTimeout(() => {
        scrambleOut(phrase, () => {
          // Advance to next phrase (loops back to 0)
          phraseIndex = (phraseIndex + 1) % GLITCH_PHRASES.length;
          runPhrase();
        });
      }, HOLD_DURATION);
    });
  }

  setTimeout(runPhrase, INITIAL_DELAY);
}


/* ----------------------------------------------------------------
   2. SCROLL REVEAL
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