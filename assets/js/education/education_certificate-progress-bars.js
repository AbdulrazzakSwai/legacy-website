export function setProgressBar(progress, elementId, percentElementId, duration) {
  const progressBar = document.getElementById(elementId);
  const progressPercent = document.getElementById(percentElementId);

  if (!progressBar || !progressPercent) {
    console.error(`Element with ID "${elementId}" or "${percentElementId}" not found.`);
    return;
  }

  const startTime = performance.now();
  const startWidth = 0;
  const targetWidth = Math.min(Math.max(progress, 0), 100);

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOut(progress);
    const currentWidth = startWidth + easedProgress * (targetWidth - startWidth);

    progressBar.style.setProperty('--progress', `${currentWidth}%`);
    progressPercent.textContent = `${Math.floor(currentWidth)}%`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export function setProjectProgressDisplay(completedProjects, totalProjects, elementId, countElementId, duration) {
  const progressBar = document.getElementById(elementId);
  const progressCount = document.getElementById(countElementId);

  if (!progressBar || !progressCount) {
    console.error(`Element with ID "${elementId}" or "${countElementId}" not found.`);
    return;
  }

  if (totalProjects <= 0) {
    console.error("Total projects must be greater than 0.");
    return;
  }

  const progress = (completedProjects / totalProjects) * 100;
  const startTime = performance.now();
  const startWidth = 0;
  const startCount = 0;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progressFraction = Math.min(elapsed / duration, 1);
    const easedProgress = easeOut(progressFraction);

    const currentWidth = startWidth + easedProgress * (progress - startWidth);
    progressBar.style.setProperty('--progress', `${currentWidth}%`);

    const currentCount = Math.floor(startCount + easedProgress * completedProjects);
    progressCount.textContent = `${currentCount}/${totalProjects}`;

    if (progressFraction < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export function observeProgressBars(progressBars, duration) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const { barId, percentId, isProjectCert, completedProjects, totalProjects } = entry.target.dataset;

          if (isProjectCert === 'true') {
            setProjectProgressDisplay(
              parseInt(completedProjects, 10),
              parseInt(totalProjects, 10),
              barId,
              percentId,
              duration
            );
          } else {
            const progress = entry.target.dataset.progress;
            setProgressBar(parseInt(progress, 10), barId, percentId, duration);
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach(({ progress, barId, percentId, isProjectCert, completedProjects, totalProjects }) => {
    const progressBarElement = document.getElementById(barId);
    progressBarElement.dataset.barId = barId;
    progressBarElement.dataset.percentId = percentId;
    progressBarElement.dataset.isProjectCert = isProjectCert || false;

    if (isProjectCert) {
      progressBarElement.dataset.completedProjects = completedProjects;
      progressBarElement.dataset.totalProjects = totalProjects;
    } else {
      progressBarElement.dataset.progress = progress;
    }

    observer.observe(progressBarElement);
  });
}