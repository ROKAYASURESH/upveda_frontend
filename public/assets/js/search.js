// assets/js/Search.js

// JavaScript for toggling the icon
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const toggleIcon = document.getElementById('toggleIcon');
    const collapseExample = document.getElementById('collapseExample');
  
    if (collapseExample) {
      collapseExample.addEventListener('show.bs.collapse', () => {
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
      });
  
      collapseExample.addEventListener('hide.bs.collapse', () => {
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
      });
    }
  });
  