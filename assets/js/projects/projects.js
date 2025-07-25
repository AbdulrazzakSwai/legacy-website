const categories = ['cybersec', 'webdev', 'programming', 'education'];

let isModalActive = false;
let isAnimating = false;
let lastFocusedCard = null;
let releaseFocusTrap = null;

const projectsData = {};
const projectsPage = {};
const projectsTotal = {};
const PROJECTS_PER_PAGE = 12;
const allDataLoaded = {};

function fetchTotalCount(category) {
  if (typeof projectsTotal[category] === 'number') return Promise.resolve(projectsTotal[category]);
  return fetch(`../assets/data/projects/projects_${category}.json`)
    .then(res => res.json())
    .then(result => {
      let allProjects;
      if (Array.isArray(result)) {
        allProjects = result;
      } else if (result.projects) {
        allProjects = result.projects;
      } else {
        allProjects = [];
      }
      projectsTotal[category] = allProjects.length;
      return allProjects.length;
    });
}

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

function updateCategoryCount(category) {
  const header = document.getElementById(`${category}-projects-header`);
  if (header) {
    const total = projectsTotal[category];
    header.textContent = header.textContent.replace(/\s*\(\d+\)$/, '');
    if (typeof total === 'number') {
      header.textContent += ` (${total})`;
    }
  }
}

function renderProjects(category) {
  const container = document.getElementById(`${category}-projects`);
  if (!container) return;

  const projects = projectsData[category] || [];
  updateCategoryCount(category);

  const page = projectsPage[category] || 1;
  const start = 0;
  const end = page * PROJECTS_PER_PAGE;
  const visibleProjects = projects.slice(start, end);

  const existingBtn = container.querySelector('.load-more-projects-btn');
  if (existingBtn) existingBtn.remove();

  container.querySelectorAll('.project-card').forEach(card => card.remove());

  visibleProjects.forEach(project => {
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
      history.pushState({ modal: true }, '', '');
      showSplitBarAnimation(card);
    });

    container.appendChild(card);
  });

  const moreToShow = (projects.length > end) || !allDataLoaded[category];
  if (moreToShow) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'load-more-projects-btn';
    loadMoreBtn.textContent = 'Load More Projects';
    loadMoreBtn.style.margin = '20px auto 0 auto';
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.addEventListener('click', () => {
      loadMoreProjects(category);
    });
    container.appendChild(loadMoreBtn);
  }
}

function loadMoreProjects(category) {
  if (allDataLoaded[category]) {
    const projects = projectsData[category] || [];
    const page = projectsPage[category] || 1;
    const nextEnd = (page + 1) * PROJECTS_PER_PAGE;
    if (projects.length > page * PROJECTS_PER_PAGE) {
      projectsPage[category]++;
      renderProjects(category);
    }
    if (projects.length <= nextEnd) {
      allDataLoaded[category] = true;
      renderProjects(category);
    }
    return;
  }

  const offset = projectsData[category] ? projectsData[category].length : 0;
  fetch(`../assets/data/projects/projects_${category}.json?offset=${offset}&limit=${PROJECTS_PER_PAGE}`)
    .then(res => res.json())
    .then(result => {
      let newProjects;
      if (Array.isArray(result)) {
        newProjects = result.slice(offset, offset + PROJECTS_PER_PAGE);
      } else if (result.projects) {
        newProjects = result.projects.slice(offset, offset + PROJECTS_PER_PAGE);
      } else {
        newProjects = [];
      }
      if (!projectsData[category]) projectsData[category] = [];
      const existingTitles = new Set(projectsData[category].map(p => p.title));
      newProjects = newProjects.filter(p => !existingTitles.has(p.title));
      projectsData[category] = projectsData[category].concat(newProjects);

      if (newProjects.length < PROJECTS_PER_PAGE) {
        allDataLoaded[category] = true;
      }

      projectsPage[category] = (projectsPage[category] || 1) + 1;
      renderProjects(category);
    });
}

categories.forEach(category => {
  allDataLoaded[category] = false;
  projectsPage[category] = 1;
  fetchTotalCount(category).then(() => updateCategoryCount(category));
  fetch(`../assets/data/projects/projects_${category}.json`)
    .then(res => res.json())
    .then(result => {
      let initialProjects;
      if (Array.isArray(result)) {
        initialProjects = result.slice(0, PROJECTS_PER_PAGE);
      } else if (result.projects) {
        initialProjects = result.projects.slice(0, PROJECTS_PER_PAGE);
      } else {
        initialProjects = [];
      }
      projectsData[category] = initialProjects;
      if (initialProjects.length < PROJECTS_PER_PAGE) {
        allDataLoaded[category] = true;
      }
      renderProjects(category);
    });
});

const modal = document.getElementById('project-modal');
const overlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const splitBarContainer = document.getElementById('split-bar-container');
const leftBar = splitBarContainer.querySelector('.split-bar.left');
const rightBar = splitBarContainer.querySelector('.split-bar.right');
const modalContent = document.querySelector('.modal-content');

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

function closeModal(pushBack = true) {
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
  Promise.all([leftAnim.finished, rightAnim.finished, fadeOut.finished]).then(() => finalizeClose(pushBack));
  setTimeout(() => {
    if (isAnimating) finalizeClose(pushBack);
  }, 500);
}

function finalizeClose(pushBack) {
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
  if (pushBack) {
    history.pushState({}, '', '');
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

modalClose.addEventListener('click', () => {
  if (isModalActive && !isAnimating) {
    history.back();
  }
});
overlay.addEventListener('click', () => {
  if (isModalActive && !isAnimating) {
    history.back();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isModalActive && !isAnimating) closeModal();
});

window.addEventListener('popstate', () => {
  if (isModalActive) closeModal(false);
});