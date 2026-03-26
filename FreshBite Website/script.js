document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.querySelector('.login-btn');
  const loginOverlay = document.querySelector('.login-overlay');
  const closeBtn = document.querySelector('.close-btn');
  const loginForm = document.querySelector('.login-form');
  
  if (loginBtn && loginOverlay && closeBtn && loginForm) {

    loginBtn.addEventListener('click', function() {
      loginOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    });
    
    closeBtn.addEventListener('click', function() {
      loginOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
    
    loginOverlay.addEventListener('click', function(e) {
      if (e.target === loginOverlay) {
        loginOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Login demo: This is a non-functioning demo login. User: demo@example.com | Pass: demo123');

      loginForm.reset();
      loginOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
