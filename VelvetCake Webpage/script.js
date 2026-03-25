document.addEventListener('DOMContentLoaded', function() {
  const infoBtn = document.getElementById('info-btn');
  const modal = document.querySelector('.modal');
  const closeModal = document.querySelector('.close');
  
  if (infoBtn && modal && closeModal) {
    infoBtn.addEventListener('click', () => modal.classList.add('active'));
    closeModal.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
  
pageInteractions();
  
  checkLoginStatus();
});

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  if (email && password) {
    localStorage.setItem('user', JSON.stringify({ email, loggedIn: true }));
    alert('Login successful!');
    window.location.href = 'orders.html';
  } else {
    alert('Fill all fields.');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  if (name && email && password) {
    localStorage.setItem('user', JSON.stringify({ name, email, loggedIn: true }));
    alert('Registration successful!');
    window.location.href = 'orders.html';
  } else {
    alert('Fill all fields.');
  }
}

function pageInteractions() {
  const carouselTrack = document.querySelector('.carousel-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const designItems = document.querySelectorAll('.design-item');

  if (carouselTrack && prevBtn && nextBtn && designItems.length > 0) {
    let currentIndex = 0;
    const totalCards = designItems.length;

    function updateCarousel() {
      carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    });
  }

  document.querySelectorAll('.design-item').forEach(item => {
    item.addEventListener('click', () => {
      alert('Design selected: ' + item.querySelector('h4').textContent);
    });
  });

  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => alert('Order action (Demo)'));
  });
}

function checkLoginStatus() {
  const user = localStorage.getItem('user');
  if (!user) {
    const path = window.location.pathname.split('/').pop();
    if (path && ['orders.html', 'pickup.html', 'design.html'].includes(path)) {
      window.location.href = 'orders.html';
    }
  }
}

