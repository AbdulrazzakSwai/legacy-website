const terminalLines = [
  { text: '> cat top_projects.txt', class: 'command' },
  { text: '- Currently leading the integration of real-world labs and challenges into my university\'s cybersecurity curriculum', class: 'line' },
  { text: '- Developed a personal website from scratch to showcase my cybersecurity and web development skills. FYI, You’re currently viewing it!', class: 'line' },
  { text: '- Created and presented free cybersecurity roadmaps in university talks to promote hands-on learning', class: 'line' },
  { text: "- Discovered and reported two critical IDOR vulnerabilities in the university’s course system, exposing unauthorized access to student data", class: 'line' },
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
