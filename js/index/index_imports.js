import { setCertificationsAwardedCount, handleScrollAnimation } from './index_statistics-counter.js';
import { initTerminalTyping } from './index_terminal.js';

document.addEventListener('DOMContentLoaded', () => {
  setCertificationsAwardedCount();
  initTerminalTyping();
});

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);