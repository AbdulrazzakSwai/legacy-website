document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close menu after clicking a link
  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  const certificationsAwardedCounter = document.querySelector('.stat-number[data-target="1"]');
  if (certificationsAwardedCounter) {
    certificationsAwardedCounter.innerText = '1';
  }
});

// Animate a single counter with synced timing
function animateCounter(counter, duration = 2000) {
  const target = +counter.getAttribute('data-target');
  const startTime = performance.now();
  const showPlus = counter.classList.contains('with-plus'); // Check if the counter needs a '+'

  // Ease-out function
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOut(progress);  // Apply easing

    const value = Math.floor(easedProgress * target); // Use eased progress to calculate the value
    counter.innerText = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Append the '+' if the class is present
      counter.innerText = showPlus ? `${target}+` : target;
    }
  }

  requestAnimationFrame(update);
}


// Detect if counters are in view, then start animation
function handleScrollAnimation() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach(counter => {
    if (counter.getAttribute('data-target') === '1') {
      return;
    }

    const rect = counter.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible && !counter.classList.contains('started')) {
      counter.classList.add('started');
      animateCounter(counter, 1500);
    }
  });
}

// Listen for scroll or page load
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);
