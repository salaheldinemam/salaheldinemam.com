// Basic behavior: print button, nav highlighting, mobile menu toggle, set year

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Print button
document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle && menuToggle.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.background = 'rgba(255,255,255,0.98)';
  navLinks.style.padding = '8px';
  navLinks.style.position = 'absolute';
  navLinks.style.right = '16px';
  navLinks.style.top = '64px';
  navLinks.style.borderRadius = '12px';
  navLinks.style.boxShadow = '0 10px 30px rgba(12,18,30,0.08)';
});

// Smooth scrolling & active link highlight
const links = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main .card, main section, header');

function removeActive(){
  links.forEach(l => l.classList.remove('active'));
}

function onScroll(){
  const scrollPos = window.scrollY + 120;
  let activeSet = false;
  // Check each section by id
  document.querySelectorAll('main [id]').forEach(sec => {
    const id = sec.id;
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    if (!activeSet && scrollPos >= top && scrollPos < top + height) {
      removeActive();
      const link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) link.classList.add('active');
      activeSet = true;
    }
  });
}

window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

// Smooth scroll for nav links (ensure smoother behavior across browsers)
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    const topOffset = 80;
    const y = target.getBoundingClientRect().top + window.pageYOffset - topOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    // close mobile menu if open
    if (window.innerWidth < 920) {
      document.querySelector('.nav-links').style.display = 'none';
    }
  });
});
