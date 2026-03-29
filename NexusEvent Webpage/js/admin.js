// Admin login + guard + fixed ticket check for Nexus Events

document.addEventListener('DOMContentLoaded', () => {
  const AUTH_KEY = 'nexusAdminAuth';
  const USER = 'admin';
  const PASS = 'nexus2026';

  const page = document.body.dataset.page;

  if (page === 'admin-login' || page === 'admin') {
    if (localStorage.getItem(AUTH_KEY) === 'true') {
      window.location.href = 'admin/index.html';
      return;
    }
    const form = document.querySelector('[data-admin-form]');
    const status = document.querySelector('[data-admin-status]');
    const userInput = document.querySelector('[data-admin-user]');
    const passInput = document.querySelector('[data-admin-pass]');

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const user = userInput ? userInput.value.trim() : '';
        const pass = passInput ? passInput.value.trim() : '';

        if (user === USER && pass === PASS) {
          localStorage.setItem(AUTH_KEY, 'true');
          window.location.href = 'admin/index.html';
        } else {
          if (status) {
            status.textContent = 'Invalid admin credentials. Try admin / nexus2026.';
            status.classList.add('status', 'status--red');
          }
        }
      });
    }
  }

  if (page === 'admin-dashboard') {
    if (localStorage.getItem(AUTH_KEY) !== 'true') {
      window.location.href = '../admin-login.html';
      return;
    }

    const logout = document.querySelector('[data-admin-logout]');
    if (logout) {
      logout.addEventListener('click', () => {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = '../admin-login.html';
      });
    }
  }

  // Mock ticket check - using DOM to avoid raw HTML bug
  const checkBtn = document.getElementById('checkTicketBtn');
  const qrModal = document.getElementById('mockQR');
  const overlay = document.getElementById('qrOverlay');

  if (checkBtn && qrModal && overlay) {
    checkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showQR();
    });
  }

  function showQR() {
    qrModal.style.display = 'block';
    overlay.style.display = 'block';
    qrModal.innerHTML = '';

    // Create SVG QR
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.style.cssText = 'width:200px;height:200px;margin:1rem auto;display:block;box-shadow:var(--shadow-glow);';
    svg.innerHTML = `
      <rect width="200" height="200" fill="#2a2a2a" stroke="#D4AF37" stroke-width="4" rx="10"/>
      <rect x="20" y="20" width="60" height="60" fill="#D4AF37" rx="4"/>
      <rect x="120" y="20" width="60" height="60" fill="#D4AF37" rx="4"/>
      <rect x="20" y="120" width="60" height="60" fill="#D4AF37" rx="4"/>
      <rect x="120" y="120" width="60" height="60" fill="#D4AF37" rx="4"/>
      <circle cx="100" cy="100" r="10" fill="#FFD700"/>
      <text x="100" y="190" font-family="Arial" font-size="14" fill="#D4AF37" text-anchor="middle" font-weight="bold">VALID TICKET</text>
    `;
    qrModal.appendChild(svg);

    const p = document.createElement('p');
    p.textContent = 'Ticket validated. Ready for checkout.';
    p.style.textAlign = 'center';
    p.style.fontSize = '1.1rem';
    qrModal.appendChild(p);

    const proceedBtn = document.createElement('button');
    proceedBtn.className = 'btn';
    proceedBtn.textContent = 'Proceed to Checkout';
    proceedBtn.style.display = 'block';
    proceedBtn.style.margin = '1rem auto 0.5rem';
    qrModal.appendChild(proceedBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn--ghost';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.display = 'block';
    cancelBtn.style.margin = '0 auto';
    qrModal.appendChild(cancelBtn);

    proceedBtn.addEventListener('click', doCheckout);
    cancelBtn.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);
  }

  function doCheckout() {
    qrModal.innerHTML = '<p style="text-align:center;font-size:1.2rem;">Processing checkout...</p>';
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = 'width:100%;height:24px;background:var(--paper);border:3px solid var(--ink);border-radius:12px;overflow:hidden;margin:1rem auto;max-width:300px;box-shadow:var(--shadow);';
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'width:0;height:100%;background:linear-gradient(90deg,var(--gold),var(--neon-gold));transition:width 2.5s ease;box-shadow:var(--shadow-glow);';
    progressContainer.appendChild(progressBar);
    qrModal.appendChild(progressContainer);

    setTimeout(() => {
      progressBar.style.width = '100%';
    }, 100);

    setTimeout(() => {
      qrModal.innerHTML = `
        <div style="text-align:center;">
          <svg viewBox="0 0 100 80" width="100" height="80" style="margin:1rem auto;display:block;">
            <circle cx="50" cy="40" r="35" fill="none" stroke="#D4AF37" stroke-width="8" stroke-dasharray="220" stroke-dashoffset="220">
              <animate attributeName="stroke-dashoffset" from="220" to="0" dur="1s" fill="freeze"/>
            </circle>
            <polyline points="25,40 45,60 75,25" fill="none" stroke="#FFD700" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p style="font-size:1.4rem;font-weight:700;color:var(--gold);margin:1rem 0;">✓ Checkout Complete!</p>
          <p>Ticket purchased. Check your email.</p>
        </div>
        <button class="btn" id="closeQR" style="display:block;margin:1rem auto;">Done</button>
      `;
      const closeBtn = qrModal.querySelector('#closeQR');
      closeBtn.addEventListener('click', hideModal);
    }, 2800);
  }

  function hideModal() {
    if (qrModal) qrModal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
  }
});
