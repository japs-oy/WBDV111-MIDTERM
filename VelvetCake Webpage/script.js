document.addEventListener('DOMContentLoaded', function() {
  const canContinue = checkLoginStatus();

  initAuthForms();
  initLoginReminder();
  initScheduleModal();

  if (!canContinue) {
    return;
  }

  pageInteractions();
});

function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  const regForm = document.getElementById('reg-form');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (regForm) {
    regForm.addEventListener('submit', handleRegister);
  }
}

function initScheduleModal() {
  const infoBtn = document.getElementById('info-btn');
  const modal = document.getElementById('schedule-modal');

  if (!infoBtn || !modal) {
    return;
  }

  const closeModal = modal.querySelector('[data-close-modal]');

  infoBtn.addEventListener('click', () => modal.classList.add('active'));

  if (closeModal) {
    closeModal.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

function initLoginReminder() {
  const reminder = document.getElementById('login-reminder');

  if (!reminder) {
    return;
  }

  try {
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');

    if (redirectPath) {
      reminder.textContent = `Reminder: Please log in first. After you sign in, we'll bring you to ${getPageLabel(redirectPath)}.`;
    }
  } catch (error) {
    // Keep the default reminder if session storage is unavailable.
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (email && password) {
    saveUser({ email, loggedIn: true });
    alert('Login successful!');
    window.location.href = getPostLoginDestination();
  } else {
    alert('Fill all fields.');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  if (name && email && password) {
    saveUser({ name, email, loggedIn: true });
    alert('Registration successful!');
    window.location.href = getPostLoginDestination();
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
  const user = getUser();
  const path = getCurrentPage();
  const isLoggedIn = Boolean(user && user.loggedIn);

  if (!isLoggedIn && ['orders.html', 'pickup.html', 'design.html'].includes(path)) {
    try {
      sessionStorage.setItem('redirectAfterLogin', path);
    } catch (error) {
      // Ignore storage issues and still send the visitor to the login page.
    }

    window.location.replace('index.html');
    return false;
  }

  return true;
}

function getCurrentPage() {
  const path = window.location.pathname.split('/').pop();
  return path || 'index.html';
}

function getPostLoginDestination() {
  try {
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');

    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      return redirectPath;
    }
  } catch (error) {
    // Fall through to the default destination if session storage is unavailable.
  }

  return 'orders.html';
}

function getPageLabel(path) {
  const labels = {
    'orders.html': 'Orders',
    'design.html': 'Design',
    'pickup.html': 'Pickup'
  };

  return labels[path] || 'the page you selected';
}

function getUser() {
  try {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    return null;
  }
}

function saveUser(user) {
  try {
    localStorage.setItem('user', JSON.stringify({ ...user, loggedIn: true }));
  } catch (error) {
    // Ignore storage errors so the page stays usable even in restricted browsers.
  }
}

