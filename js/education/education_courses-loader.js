export function loadCoursesFromCSV() {
  fetch('../csv/courses.csv')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => {
      const rows = data.trim().split('\n').slice(1);
      const tbody = document.getElementById('courses-table-body');
      const container = document.getElementById('courses-container');

      tbody.innerHTML = '';
      container.querySelectorAll('.course-card').forEach(card => card.remove());

      rows.forEach(row => {
        const [course, courselink, type, provider, certlink] = row.split(',');

        const isTryHackMe = provider === 'TryHackMe';

        const desktopLink = `<a href="${certlink}" target="_blank" rel="noopener noreferrer">View</a>`;
        const mobileLink = `<a href="${certlink}" target="_blank" rel="noopener noreferrer">View Certificate</a>`;

        const certificateText = isTryHackMe ? `${desktopLink} *` : desktopLink;
        const certificateTextCard = isTryHackMe ? `${mobileLink} *` : mobileLink;

        const courseAnchor = `<a href="${courselink}" target="_blank" rel="noopener noreferrer">${course}</a>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${courseAnchor}</td>
          <td>${type}</td>
          <td>${provider}</td>
          <td>${certificateText}</td>
        `;
        tbody.appendChild(tr);

        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
          <div class="card-header">${courseAnchor}</div>
          <div class="card-content"><strong>Area:</strong> ${type}</div>
          <div class="card-content"><strong>Provider:</strong> ${provider}</div>
          <div class="card-content">${certificateTextCard}</div>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      document.getElementById('courses-fallback').style.display = 'block';
      console.error("Error loading CSV:", error);
    });
}
