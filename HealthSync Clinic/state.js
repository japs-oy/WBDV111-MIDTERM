


const STATE_KEY = 'healthsync-state-v2';
const NOTIFS_KEY = 'healthsync-notifications';


const seedAppointments = [

  { id: 'a1', specialtyId: 'dermatology', doctorId: 'd3', date: '2026-03-24', time: '11:00 AM', status: 'confirmed', notes: '', room: '', branch: 'Central' },
  { id: 'a2', specialtyId: 'pediatrics', doctorId: 'd4', date: '2026-03-28', time: '01:30 PM', status: 'pending', notes: '', room: '', branch: 'West' },
  { id: 'a3', specialtyId: 'cardiology', doctorId: 'd1', date: '2026-03-22', time: '09:00 AM', status: 'completed', notes: 'Follow-up prescribed', room: '2', branch: 'Central' },
  { id: 'a4', specialtyId: 'orthopedics', doctorId: 'd5', date: '2026-03-22', time: '03:00 PM', status: 'cancelled', notes: 'Patient no-show', room: '', branch: 'South' },

  { id: 'a5', specialtyId: 'cardiology', doctorId: 'd2', date: '2026-03-25', time: '10:30 AM', status: 'pending', notes: '', room: '', branch: 'North' },
  { id: 'a6', specialtyId: 'dermatology', doctorId: 'd3', date: '2026-03-26', time: '02:00 PM', status: 'confirmed', notes: '', room: '4', branch: 'Central' },
  { id: 'a7', specialtyId: 'pediatrics', doctorId: 'd6', date: '2026-03-27', time: '09:00 AM', status: 'completed', notes: 'Vaccination given', room: '1', branch: 'North' },
  { id: 'a8', specialtyId: 'orthopedics', doctorId: 'd5', date: '2026-03-29', time: '04:00 PM', status: 'pending', notes: '', room: '', branch: 'South' },
  { id: 'a9', specialtyId: 'cardiology', doctorId: 'd1', date: '2026-03-30', time: '02:00 PM', status: 'cancelled', notes: 'Rescheduled', room: '', branch: 'Central' },
  { id: 'a10', specialtyId: 'dermatology', doctorId: 'd3', date: '2026-03-31', time: '03:30 PM', status: 'confirmed', notes: '', room: '3', branch: 'Central' },
  { id: 'a11', specialtyId: 'pediatrics', doctorId: 'd4', date: '2026-04-01', time: '11:30 AM', status: 'pending', notes: '', room: '', branch: 'West' },
  { id: 'a12', specialtyId: 'orthopedics', doctorId: 'd5', date: '2026-04-02', time: '01:00 PM', status: 'completed', notes: 'Cast removed', room: '5', branch: 'South' },
  { id: 'a13', specialtyId: 'cardiology', doctorId: 'd2', date: '2026-04-03', time: '08:30 AM', status: 'confirmed', notes: '', room: '', branch: 'North' },
  { id: 'a14', specialtyId: 'dermatology', doctorId: 'd3', date: '2026-04-04', time: '01:00 PM', status: 'pending', notes: '', room: '', branch: 'Central' },
  { id: 'a15', specialtyId: 'pediatrics', doctorId: 'd6', date: '2026-04-05', time: '04:00 PM', status: 'cancelled', notes: 'Family emergency', room: '', branch: 'North' },
  { id: 'a16', specialtyId: 'orthopedics', doctorId: 'd5', date: '2026-04-06', time: '12:30 PM', status: 'confirmed', notes: '', room: '2', branch: 'South' },
  { id: 'a17', specialtyId: 'cardiology', doctorId: 'd1', date: '2026-04-07', time: '10:00 AM', status: 'completed', notes: 'BP stable', room: '1', branch: 'Central' },
  { id: 'a18', specialtyId: 'dermatology', doctorId: 'd3', date: '2026-04-08', time: '09:30 AM', status: 'pending', notes: '', room: '', branch: 'Central' },
  { id: 'a19', specialtyId: 'pediatrics', doctorId: 'd4', date: '2026-04-09', time: '03:30 PM', status: 'confirmed', notes: '', room: '3', branch: 'West' },
  { id: 'a20', specialtyId: 'orthopedics', doctorId: 'd5', date: '2026-04-10', time: '11:00 AM', status: 'pending', notes: '', room: '', branch: 'South' }
];

const defaultState = {
  wizard: {
    step: 0,
    specialtyId: '',
    doctorId: '',
    date: '',
    time: '',
    confirmed: false
  },
  appointments: seedAppointments,
  notifications: [],
  userPrefs: { darkMode: false },
  version: '2.0'
};

let state = {};
let subscribers = [];


function loadState() {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      state = { ...defaultState, ...parsed, appointments: [...defaultState.appointments, ...(parsed.appointments || [])] };
    } else {
      state = { ...defaultState };
      saveState();
    }
  } catch {
    state = { ...defaultState };
    saveState();
  }
}


function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}


function subscribe(callback) {
  subscribers.push(callback);
  return () => { subscribers = subscribers.filter(cb => cb !== callback); };
}


function notify() {
  saveState();
  subscribers.forEach(cb => cb(state));
}


function getAppointments() { return [...state.appointments]; }
function getWizardState() { return { ...state.wizard }; }
function getNotifications() { return [...state.notifications]; }
function getUserPrefs() { return { ...state.userPrefs }; }


function setWizardState(patch) {
  state.wizard = { ...state.wizard, ...patch };
  notify();
}

function addAppointment(appt) {
  state.appointments.unshift({ id: `a${Date.now()}`, ...appt, status: 'pending' });
  notify();
}

function updateAppointment(id, updates) {
  const idx = state.appointments.findIndex(a => a.id === id);
  if (idx !== -1) {
    state.appointments[idx] = { ...state.appointments[idx], ...updates };
    notify();
    return true;
  }
  return false;
}

function addNotification(notif) {
  state.notifications.unshift({ id: `n${Date.now()}`, read: false, timestamp: new Date().toISOString(), ...notif });
  notify();
}

function markNotificationRead(id) {
  const idx = state.notifications.findIndex(n => n.id === id);
  if (idx !== -1) state.notifications[idx].read = true;
  notify();
}

function setDarkMode(enabled) {
  state.userPrefs.darkMode = enabled;
  notify();
  // Apply immediately
  document.body.classList.toggle('dark-mode', enabled);
}


function getMetrics(role) {
  const appts = getAppointments();
  const total = appts.length;
  const pending = appts.filter(a => a.status === 'pending').length;
  const completed = appts.filter(a => a.status === 'completed').length;
  const noShows = appts.filter(a => a.status === 'cancelled').length;

  return {
    totalAppointments: total,
    pending,
    completed,
    noShows,
    // Role-specific
    ...(role === 'admin' && { approvalsNeeded: pending }),
    ...(role === 'staff' && { waitingPatients: Math.floor(Math.random() * 10) + 1 })
  };
}


function initState() {
  loadState();

  setInterval(() => {
    if (Math.random() < 0.3) {
      addNotification({ message: `New appointment request: Pediatrics at ${new Date().toLocaleTimeString()}`, type: 'booking' });
    }
  }, 30000);


  window.addEventListener('storage', (e) => {
    if (e.key === STATE_KEY) loadState();
  });
}


window.HealthSyncState = {
  init: initState,
  getAppointments,
  getWizardState,
  setWizardState,
  addAppointment,
  updateAppointment,
  getNotifications,
  addNotification,
  markNotificationRead,
  getMetrics,
  getUserPrefs,
  setDarkMode,
  subscribe
};

