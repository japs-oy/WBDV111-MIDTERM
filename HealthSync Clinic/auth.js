(function () {
// Sessions now in state.js (future), localStorage for now
const SESSION_KEY = "healthsync-portal-session";

  const accounts = [
    {
      role: "default",
      label: "Default",
      username: "default",
      password: "default123",
      name: "Default Operator",
      dashboard: "default-dashboard.html",
      description: "Shared clinic overview for demos and general monitoring."
    },
    {
      role: "admin",
      label: "Admin",
      username: "admin",
      password: "admin123",
      name: "Angela Reed",
      dashboard: "admin-dashboard.html",
      description: "Branch-wide control for schedules, approvals, and staffing."
    },
    {
      role: "staff",
      label: "Staff",
      username: "staff",
      password: "staff123",
      name: "Lena Brooks",
      dashboard: "staff-dashboard.html",
      description: "Front desk and clinical coordination for daily operations."
    },
    {
      role: "user",
      label: "User",
      username: "user",
      password: "user123",
      name: "Mia Thompson",
      dashboard: "user-dashboard.html",
      description: "Patient access for profile, bookings, and reminders."
    }
  ];

  function getSession() {
    try {
      const stored = window.localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  function saveSession(account) {
    const session = {
      role: account.role,
      label: account.label,
      username: account.username,
      name: account.name,
      dashboard: account.dashboard
    };

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    window.localStorage.removeItem(SESSION_KEY);
  }

  function getAccount(username, password) {
    const normalizedUsername = username.trim().toLowerCase();
    return accounts.find((account) => {
      return account.username === normalizedUsername && account.password === password;
    }) || null;
  }

  function goToDashboard(role) {
    const account = accounts.find((entry) => entry.role === role);
    window.location.href = account ? account.dashboard : "login.html";
  }

  function setupLogoutButtons() {
    document.querySelectorAll("[data-logout]").forEach((button) => {
      button.addEventListener("click", () => {
        clearSession();
        window.location.href = "login.html";
      });
    });
  }

  function populateSession(session) {
    document.querySelectorAll("[data-auth-name]").forEach((node) => {
      node.textContent = session.name;
    });

    document.querySelectorAll("[data-auth-role]").forEach((node) => {
      node.textContent = session.label;
    });

    document.querySelectorAll("[data-auth-username]").forEach((node) => {
      node.textContent = session.username;
    });
  }

function renderLatestBooking(HealthSyncState) {
    const appts = HealthSyncState.getAppointments();
    const latest = appts[0]; // Latest pending/confirmed

    document.querySelectorAll("[data-latest-booking]").forEach((node) => {
      if (!latest) {
        node.innerHTML = `
          <div class="empty-box">
            No new booking has been submitted from the public wizard yet.
          </div>
        `;
        return;
      }

      const specialty = getSpecialtyById(latest.specialtyId);
      const doctor = getDoctorById(latest.doctorId);
      node.innerHTML = `
        <div class="booking-summary">
          <strong>${specialty?.label || 'N/A'}</strong>
          <small>${doctor?.name || 'N/A'}</small>
          <p>${formatDate(latest.date)} at ${latest.time}</p>
          <span class="status-pill status-${latest.status}">${latest.status}</span>
        </div>
      `;
    });
  }

function protectPage(expectedRole) {
    HealthSyncState.init(); // Ensure state ready
    const session = getSession();

    if (!session) {
      window.location.href = "login.html";
      return;
    }

    if (session.role !== expectedRole) {
      goToDashboard(session.role);
      return;
    }

    populateSession(session);
    renderLatestBooking(HealthSyncState);
    setupLogoutButtons();
  }

  function renderAccountCards() {
    const grid = document.getElementById("accountGrid");
    if (!grid) {
      return;
    }

    grid.innerHTML = accounts.map((account) => {
      return `
        <article class="account-card">
          <div class="card-head">
            <span class="role-chip">${account.label}</span>
            <button type="button" class="fill-button" data-fill="${account.role}">Use</button>
          </div>
          <h3>${account.name}</h3>
          <p>${account.description}</p>
          <div class="credential-line"><span>Username</span><strong>${account.username}</strong></div>
          <div class="credential-line"><span>Password</span><strong>${account.password}</strong></div>
        </article>
      `;
    }).join("");

    grid.querySelectorAll("[data-fill]").forEach((button) => {
      button.addEventListener("click", () => {
        const account = accounts.find((entry) => entry.role === button.dataset.fill);
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        if (!account || !usernameInput || !passwordInput) {
          return;
        }

        usernameInput.value = account.username;
        passwordInput.value = account.password;
      });
    });
  }

  function setLoginStatus(message, state) {
    const node = document.getElementById("loginStatus");
    if (!node) {
      return;
    }

    node.textContent = message;
    node.dataset.state = state;
  }

  function initLoginPage() {
    renderAccountCards();

    const session = getSession();
    const currentSession = document.getElementById("currentSession");
    const continueSession = document.getElementById("continueSession");

    if (session && currentSession && continueSession) {
      currentSession.hidden = false;
      continueSession.hidden = false;
      currentSession.textContent = `Current session: ${session.name} (${session.label})`;
      continueSession.addEventListener("click", () => {
        goToDashboard(session.role);
      });
    }

    setupLogoutButtons();

    const form = document.getElementById("loginForm");
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const account = getAccount(username, password);

      if (!account) {
        setLoginStatus("Incorrect username or password. Use one of the demo accounts below.", "error");
        return;
      }

      saveSession(account);
      setLoginStatus(`Login successful. Opening the ${account.label} dashboard...`, "success");
      goToDashboard(account.role);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    const protectedRole = document.body.dataset.protectedRole;

    if (page === "login") {
      initLoginPage();
      return;
    }

    if (protectedRole) {
      protectPage(protectedRole);
    }
  });
})();

// Global helpers for dashboards (specialties/doctors/formatDate from wizard.js)
window.getSpecialtyById = getSpecialtyById;
window.getDoctorById = getDoctorById;
window.formatDate = formatDate;
