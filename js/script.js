document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close menu after clicking a link
  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  const certificationsAwardedCounter = document.querySelector('.stat-number[data-target="1"]');
  if (certificationsAwardedCounter) {
    certificationsAwardedCounter.innerText = '1';
  }

  // ─── IntersectionObserver for Terminal Typing ───
  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !terminalStarted) {
          terminalStarted = true;
          typeTerminal(terminalLines, '#terminal-body', 25, 200);
        }
      });
    }, {
      threshold: 0.5  // start when 50% of the terminal is visible
    });
    observer.observe(terminalBody);
  }
});


// ─── Counter Animation ───
function animateCounter(counter, duration = 2000) {
  const target = +counter.getAttribute('data-target');
  const startTime = performance.now();
  const showPlus = counter.classList.contains('with-plus');

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOut(progress);
    const value = Math.floor(eased * target);

    counter.innerText = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.innerText = showPlus ? `${target}+` : target;
    }
  }

  requestAnimationFrame(update);
}

// Detect if counters are in view, then start animation
function handleScrollAnimation() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    if (counter.getAttribute('data-target') === '1') return;

    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0 && !counter.classList.contains('started')) {
      counter.classList.add('started');
      animateCounter(counter, 1500);
    }
  });
}

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);


// ─── Terminal Typing Effect ───
const terminalLines = [
	{ text: '> cat projects.txt', class: 'command' },
	{ text: '- Built two (2) Active Directory home labs with domain controllers & connected machines', class: 'line' },
	{ text: '- Wrote custom Bash script to automate Nmap scanning (targets, ports, enumeration)', class: 'line' },
	{ text: "- Built this very website you're browsing :)", class: 'line' },
];

let terminalStarted = false;

function typeTerminal(lines, containerSelector, speed = 50, pause = 300) {
  const container = document.querySelector(containerSelector);
  let i = 0;

  function typeLine() {
    if (i >= lines.length) return;
    const { text, class: cls } = lines[i];
    const el = document.createElement('div');
    el.classList.add('line', cls);
    container.appendChild(el);

    let char = 0;
    function tick() {
      if (char < text.length) {
        el.textContent += text[char++];
        setTimeout(tick, speed);
      } else {
        i++;
        setTimeout(typeLine, pause);
      }
    }
    tick();
  }

  typeLine();
}
