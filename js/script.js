// Ensure the DOM is fully loaded before executing the script

document.addEventListener('DOMContentLoaded', () => {

  // Get the hamburger button and nav menu elements

  const hamburger = document.getElementById('hamburger');

  const navMenu = document.getElementById('nav-menu');


  // Add click event listener to the hamburger button

  hamburger.addEventListener('click', () => {

    // Toggle the 'active' class on the nav menu

    navMenu.classList.toggle('active');

  });

});
