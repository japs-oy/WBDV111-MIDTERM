document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage || link.textContent.trim() === 'Dashboard' && currentPage === 'dashboard.html') {
      link.classList.add('active');
    }
    link.addEventListener('click', () => {
      document.querySelector('.nav-link.active')?.classList.remove('active');
      link.classList.add('active');
    });
  });

  document.querySelectorAll('.container, .main, .login-card, .stat-card, .chart-container').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'all 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 100);
  });
});
