const categories = ['cybersec', 'webdev', 'programming', 'education'];

let isModalActive = false;
let isAnimating = false;
let lastFocusedCard = null;

function disableCards() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.pointerEvents = 'none';
  });
}

function enableCards() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.pointerEvents = 'auto';
  });
}

function trapFocus(element) {
  const focusableSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const focusableElements = Array.from(element.querySelectorAll(focusableSelectors));
  if (focusableElements.length === 0) return;
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  function handleTab(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  element.addEventListener('keydown', handleTab);
  return () => element.removeEventListener('keydown', handleTab);
}

categories.forEach(category => {
  fetch(`../assets/data/projects/projects_${category}.json`)
    .then(res => res.json())
    .then(projects => {
      if (!Array.isArray(projects)) return;
      const container = document.getElementById(`${category}-projects`);
      if (!container) return;
      projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.textContent = project.title || 'Untitled Project';
        card.dataset.title = project.title || 'Untitled Project';
        card.dataset.motivation = project.motivation || '';
        card.dataset.details = project.details || '';
        card.dataset.skills = Array.isArray(project.skills) ? project.skills.join(', ') : '';
        if (Array.isArray(project.links) && project.links.length) {
          card.dataset.links = project.links.map(l => l.url || '').join('|');
          card.dataset.linktitle = project.links.map(l => l.title || '').join('|');
        } else {
          card.dataset.links = '';
          card.dataset.linktitle = '';
        }
        card.dataset.category = category;
        card.addEventListener('click', () => {
          if (isModalActive || isAnimating) return;
          lastFocusedCard = card;
          showSplitBarAnimation(card);
        });
        container.appendChild(card);
      });
    });
});

const modal = document.getElementById('project-modal');
const overlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const splitBarContainer = document.getElementById('split-bar-container');
const leftBar = splitBarContainer.querySelector('.split-bar.left');
const rightBar = splitBarContainer.querySelector('.split-bar.right');
const modalContent = document.querySelector('.modal-content');

let releaseFocusTrap = null;

function openModal(card) {
  const accentColors = {
    cybersec: '#1db954',
    webdev: '#e06c75',
    programming: '#61afef',
    education: '#c678dd',
  };
  document.body.style.overflow = 'hidden';
  modal.style.setProperty('--accent-color', accentColors[card.dataset.category] || '#1db954');
  document.getElementById('modal-title').textContent = card.dataset.title;
  document.getElementById('modal-motivation').textContent = card.dataset.motivation;
  document.getElementById('modal-details').textContent = card.dataset.details;
  document.getElementById('modal-skills').textContent = card.dataset.skills;
  const linkEl = document.getElementById('modal-links');
  const links = card.dataset.links ? card.dataset.links.split('|') : [];
  const titles = card.dataset.linktitle ? card.dataset.linktitle.split('|') : [];
  if (links.length && links[0].trim() !== '') {
    linkEl.innerHTML = links.map((link, i) => {
      const label = titles[i] || `Link ${i + 1}`;
      return `<a href="${link.trim()}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    }).join(' ');
  } else {
    linkEl.textContent = 'No links available.';
  }
  modalContent.style.display = 'block';
  modal.setAttribute('tabindex', '-1');
  modal.focus();
  releaseFocusTrap = trapFocus(modal);
}

function closeModal() {
  if (!isModalActive || isAnimating) return;
  isAnimating = true;

  splitBarContainer.style.display = 'block';

  const slideDistance = window.innerWidth / 2 + 40;

  const leftAnim = leftBar.animate([
    { transform: `translateX(-${slideDistance}px)` },
    { transform: 'translateX(0)' }
  ], { duration: 500, easing: 'ease-in-out', fill: 'forwards' });

  const rightAnim = rightBar.animate([
    { transform: `translateX(${slideDistance}px)` },
    { transform: 'translateX(0)' }
  ], { duration: 500, easing: 'ease-in-out', fill: 'forwards' });

  const fadeOut = modal.animate([
    { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
    { opacity: 0, transform: 'translate(-50%, -50%) scale(0.7)' }
  ], { duration: 500, easing: 'ease-in-out', fill: 'forwards' });

  Promise.all([leftAnim.finished, rightAnim.finished, fadeOut.finished]).then(() => finalizeClose());

  setTimeout(() => {
    if (isAnimating) finalizeClose();
  }, 500);
}

function finalizeClose() {
  document.body.style.overflow = '';

  overlay.classList.remove('show');
  modal.classList.remove('show');
  splitBarContainer.style.display = 'none';
  modal.style.opacity = '0';
  modal.style.transform = 'translate(-50%, -50%) scale(0.7)';
  modal.style.zIndex = '1100';
  overlay.style.pointerEvents = 'none';
  modal.style.pointerEvents = 'none';
  modalContent.style.display = 'none';
  enableCards();
  isModalActive = false;
  isAnimating = false;
  if (releaseFocusTrap) {
    releaseFocusTrap();
    releaseFocusTrap = null;
  }
  if (lastFocusedCard) {
    lastFocusedCard.focus();
    lastFocusedCard = null;
  }
}

function showSplitBarAnimation(card) {
  if (isModalActive || isAnimating) return;
  isModalActive = true;
  isAnimating = true;
  disableCards();
  splitBarContainer.style.display = 'block';
  openModal(card);
  leftBar.style.transform = 'translateX(0)';
  rightBar.style.transform = 'translateX(0)';
  modal.style.opacity = '0';
  modal.style.transform = 'translate(-50%, -50%) scale(0.7)';
  modal.style.zIndex = '1100';
  overlay.classList.add('show');
  modal.classList.add('show');
  overlay.style.pointerEvents = 'auto';
  modal.style.pointerEvents = 'auto';
  const slideDistance = window.innerWidth / 2 + 40;
  const leftAnim = leftBar.animate([
    { transform: 'translateX(0)' },
    { transform: `translateX(-${slideDistance}px)` }
  ], { duration: 500, easing: 'ease-in-out', fill: 'forwards' });
  const rightAnim = rightBar.animate([
    { transform: 'translateX(0)' },
    { transform: `translateX(${slideDistance}px)` }
  ], { duration: 500, easing: 'ease-in-out', fill: 'forwards' });
  const modalAnim = modal.animate([
    { opacity: 0, transform: 'translate(-50%, -50%) scale(0.7)' },
    { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
  ], { duration: 500, easing: 'ease-in-out', fill: 'forwards' });
  Promise.all([leftAnim.finished, rightAnim.finished, modalAnim.finished]).then(() => {
    splitBarContainer.style.display = 'none';
    modal.style.zIndex = '1200';
    modal.style.opacity = '1';
    modal.style.transform = 'translate(-50%, -50%) scale(1)';
    overlay.style.pointerEvents = 'auto';
    modal.style.pointerEvents = 'auto';
    isAnimating = false;
  });
  setTimeout(() => {
    if (isAnimating) {
      splitBarContainer.style.display = 'none';
      modal.style.zIndex = '1200';
      modal.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
      overlay.style.pointerEvents = 'auto';
      modal.style.pointerEvents = 'auto';
      isAnimating = false;
    }
  }, 500);
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isModalActive && !isAnimating) closeModal();
});
