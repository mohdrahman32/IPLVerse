// Initialize AOS.js
AOS.init({
  duration: 1000,
  once: true,
});

// Smooth scroll for navigation links (optional enhancement)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// Auto-scroll for Featured Matches (optional enhancement)
const scrollContainer = document.querySelector('.scroll-container');
let scrollAmount = 0;

function autoScroll() {
  scrollAmount += 2;
  if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
      scrollAmount = 0;
  }
  scrollContainer.scrollLeft = scrollAmount;
}

setInterval(autoScroll, 50);