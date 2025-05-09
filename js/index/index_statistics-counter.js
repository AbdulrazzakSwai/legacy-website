export function setCertificationsAwardedCount() {
  const counter = document.querySelector('.stat-number[data-target="1"]');
  if (counter) counter.innerText = '1';
}

export function handleScrollAnimation() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    if (counter.getAttribute('data-target') === '1') return;

    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0 && !counter.classList.contains('started')) {
      counter.classList.add('started');
      animateCounter(counter, 1200);
    }
  });
}

function animateCounter(counter, duration) {
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

    if (progress < 1) {
      counter.innerText = value;
      requestAnimationFrame(update);
    } else {
      counter.innerText = showPlus ? `${target}+` : target;
    }
  }

  requestAnimationFrame(update);
}
