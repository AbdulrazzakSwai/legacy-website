export function initMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
  });

  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
    });
  });

  document.addEventListener('click', (event) => {
    if (
      navMenu?.classList.contains('active') &&
      !navMenu.contains(event.target) &&
      !hamburger.contains(event.target)
    ) {
      navMenu.classList.remove('active');
    }
  });
}