export function loadCoursesFromCSV() {
  fetch('../assets/data/education/education_courses.csv')
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

      let counter = 1;

      const areaCounts = {
        defensive: 0,
        offensive: 0,
        general: 0
      };

      rows.forEach(row => {
        const [course, courselink, type, provider, certlink] = row.split(',');
        const area = type.toLowerCase();
        if (areaCounts[area] !== undefined) areaCounts[area]++;

        const isTryHackMe = provider === 'TryHackMe';

        const desktopLink = `<a href="${certlink}" target="_blank" rel="noopener noreferrer">View</a>`;
        const mobileLink = `<a href="${certlink}" target="_blank" rel="noopener noreferrer">View Certificate</a>`;
        const certificateText = isTryHackMe ? `${desktopLink} *` : desktopLink;
        const certificateTextCard = isTryHackMe ? `${mobileLink} *` : mobileLink;
        const courseAnchor = `<span class="course-number">${counter}.</span> <a href="${courselink}" target="_blank" rel="noopener noreferrer">${course}</a>`;

        const tr = document.createElement('tr');
        tr.setAttribute('data-area', area);
        tr.innerHTML = `
          <td>${courseAnchor}</td>
          <td><span class="area-tag area-${area}">${type}</span></td>
          <td>${provider}</td>
          <td>${certificateText}</td>
        `;
        tbody.appendChild(tr);

        const card = document.createElement('div');
        card.className = 'course-card';
        card.setAttribute('data-area', area);
        card.innerHTML = `
          <div class="card-header">${courseAnchor}</div>
          <div class="card-content"><strong>Area:</strong> <span class="area-tag area-${area}">${type}</span></div>
          <div class="card-content"><strong>Provider:</strong> ${provider}</div>
          <div class="card-content">${certificateTextCard}</div>
        `;
        container.appendChild(card);

        counter++;
      });

      const filter = document.getElementById('course-filter');
      filter.querySelector('option[value="all"]').textContent = `All (${rows.length})`;
      filter.querySelector('option[value="defensive"]').textContent = `Defensive (${areaCounts.defensive})`;
      filter.querySelector('option[value="offensive"]').textContent = `Offensive (${areaCounts.offensive})`;
      filter.querySelector('option[value="general"]').textContent = `General (${areaCounts.general})`;

      filter.value = 'all';

      filter.addEventListener('change', filterCourses);
    })
    .catch(error => {
      document.getElementById('courses-fallback').style.display = 'block';
      console.error("Error loading CSV:", error);
    });
}

function filterCourses() {
  const selected = document.getElementById('course-filter').value;

  const tableRows = document.querySelectorAll('#courses-table-body tr');
  const cards = document.querySelectorAll('.course-card');

  let counter = 1;

  tableRows.forEach(row => {
    const area = row.getAttribute('data-area');
    if (selected === 'all' || area === selected) {
      row.style.display = '';
      const numberSpan = row.querySelector('.course-number');
      if (numberSpan) numberSpan.textContent = `${counter}.`;
      counter++;
    } else {
      row.style.display = 'none';
    }
  });

  counter = 1;

  cards.forEach(card => {
    const area = card.getAttribute('data-area');
    if (selected === 'all' || area === selected) {
      card.style.display = 'block';
      const numberSpan = card.querySelector('.course-number');
      if (numberSpan) numberSpan.textContent = `${counter}.`;
      counter++;
    } else {
      card.style.display = 'none';
    }
  });
}
