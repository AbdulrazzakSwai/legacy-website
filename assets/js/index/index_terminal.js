const terminalLines = [
  { text: '> cat top_projects.txt', class: 'command' },
  { text: '- Discovered and reported a critical IDOR vulnerability in the university’s course system; identified a second one that was patched before I had the chance to report it', class: 'line' },
  { text: '- Built and configured 20+ virtual machines and 2 Active Directory labs to simulate enterprise environments for cybersecurity testing', class: 'line' },
  { text: '- Led a hands-on cybersecurity curriculum reform at Al Ain University, collaborating with the Head of Cybersecurity and senior professors to transform the entire program', class: 'line' },
  { text: '- Developed structured cybersecurity roadmaps and delivered multiple talks at the university to guide students through practical, platform-based learning paths', class: 'line' },
];

let terminalStarted = false;

export function initTerminalTyping() {
  const terminalBody = document.getElementById('terminal-body');
  if (!terminalBody) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !terminalStarted) {
        terminalStarted = true;
        typeTerminal(terminalLines, '#terminal-body', 25, 200);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(terminalBody);
}

function typeTerminal(lines, selector, speed = 50, pause = 300) {
  const container = document.querySelector(selector);
  let i = 0;

  function typeLine() {
    if (i >= lines.length) {
      const inputLine = document.createElement('div');
      inputLine.classList.add('line', 'command');
      inputLine.innerHTML = '&gt; <span class="blinking-caret">|</span>';
      container.appendChild(inputLine);
      return;
    }

    const { text, class: cls } = lines[i];
    const el = document.createElement('div');
    el.classList.add('line', cls);
    container.appendChild(el);

    let char = 0;
    (function tick() {
      if (char < text.length) {
        el.textContent += text[char++];
        setTimeout(tick, speed);
      } else {
        i++;
        setTimeout(typeLine, pause);
      }
    })();
  }

  typeLine();
}
