const terminalLines = [
  { text: '> cat projects.txt', class: 'command' },
  { text: '- Built two (2) Active Directory home labs with domain controllers & connected machines', class: 'line' },
  { text: '- Wrote custom Bash script to automate Nmap scanning (targets, ports, enumeration)', class: 'line' },
  { text: "- Built this very website you're browsing :)", class: 'line' },
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
    if (i >= lines.length) return;
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
