import { loadCoursesFromCSV } from './education_courses-loader.js';
import { observeProgressBars } from './education_certificate-progress-bars.js';

window.onload = () => {
  loadCoursesFromCSV();

  const progressBars = [
    { progress: 100, barId: 'psaa-progress', percentId: 'psaa-percent' },
    { progress: 100, barId: 'pjpt-progress', percentId: 'pjpt-percent' },
    { progress: 39, barId: 'cdsa-progress', percentId: 'cdsa-percent' },
    { progress: 54, barId: 'cpts-progress', percentId: 'cpts-percent' },
    { progress: 88, barId: 'cbbh-progress', percentId: 'cbbh-percent' },
    { progress: 4, barId: 'airt-progress', percentId: 'airt-percent' },
    { barId: 'rwd-progress', percentId: 'rwd-ratio', isProjectCert: true, completedProjects: 1, totalProjects: 20 },
    { barId: 'jsads-progress', percentId: 'jsads-ratio', isProjectCert: true, completedProjects: 0, totalProjects: 25 },
    { barId: 'fedl-progress', percentId: 'fedl-ratio', isProjectCert: true, completedProjects: 0, totalProjects: 11 },
  ];

  observeProgressBars(progressBars, 1000);
};
