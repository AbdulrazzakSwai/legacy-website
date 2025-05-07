import { loadCoursesFromCSV } from './education_courses-loader.js';
import { setProgressBar } from './education_certificate-progress-bars.js';

window.onload = () => {
  loadCoursesFromCSV();
  setProgressBar(100, 'psaa-progress');
  setProgressBar(100, 'pjpt-progress');
  setProgressBar(39, 'cdsa-progress');
  setProgressBar(54, 'cpts-progress');
  setProgressBar(88, 'cbbh-progress');
};