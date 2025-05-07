export function setProgressBar(progress, elementId) {
  const progressBar = document.getElementById(elementId);
  const percentage = Math.min(Math.max(progress, 0), 100);
  progressBar.style.setProperty('--progress', `${percentage}%`);
}
