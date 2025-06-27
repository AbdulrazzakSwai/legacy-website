async function loadLastUpdated() {
    try {
        const response = await fetch('/json/last-updated.json');
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();

        document.getElementById('last-updated').textContent = `Last updated on ${data.date}`;
    } catch (error) {
        console.error('Failed to load update info', error);
        document.getElementById('last-updated').textContent = `Last updated: unknown`;
    }
}

import { setCertificationsAwardedCount, handleScrollAnimation } from './index_statistics-counter.js';
import { initTerminalTyping } from './index_terminal.js';

window.onload = () => {
  setCertificationsAwardedCount();
  initTerminalTyping();
  loadLastUpdated();
};

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);