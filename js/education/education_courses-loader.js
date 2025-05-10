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
        const linkElement = `<a href="${certlink}" target="_blank" rel="noopener noreferrer">View</a>`;
        const certificateText = isTryHackMe ? `${linkElement} *` : linkElement;

        // Create an anchor for the course name
        const courseAnchor = `<a href="${courselink}" target="_blank" rel="noopener noreferrer">${course}</a>`;

        // Insert data into table
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${courseAnchor}</td>
          <td>${type}</td>
          <td>${provider}</td>
          <td>${certificateText}</td>
        `;
        tbody.appendChild(tr);

        // Create a course card
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
          <div class="card-header">${courseAnchor}</div>
          <div class="card-content"><strong>Area:</strong> ${type}</div>
          <div class="card-content"><strong>Provider:</strong> ${provider}</div>
          <div class="card-content">${certificateText}</div>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      document.getElementById('courses-fallback').style.display = 'block';
      console.error("Error loading CSV:", error);
    });
}
