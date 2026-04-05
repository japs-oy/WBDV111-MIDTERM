

// Data (unchanged for now)
const specialties = [
  {
    id: "cardiology",
    label: "Cardiology",
    badge: "CRD",
    description: "Heart health, blood pressure, palpitations, and preventive cardiac care."
  },
  {
    id: "dermatology",
    label: "Dermatology",
    badge: "DER",
    description: "Skin, hair, and nail concerns with fast consultations for common conditions."
  },
  {
    id: "pediatrics",
    label: "Pediatrics",
    badge: "PDS",
    description: "Child wellness, vaccinations, growth monitoring, and sick visits."
  },
  {
    id: "orthopedics",
    label: "Orthopedics",
    badge: "ORT",
    description: "Bones, joints, mobility, injuries, and recovery-focused treatment plans."
  }
];

const doctors = [
  {
    id: "d1",
    name: "Dr. Alicia Mendoza",
    specialtyId: "cardiology",
    title: "Consultant Cardiologist",
    experience: 12,
    branch: "Central Branch",
    availability: {
      0: ["09:00 AM", "10:30 AM", "02:00 PM"],
      1: ["11:00 AM", "01:30 PM", "03:30 PM"],
      2: ["09:30 AM", "12:30 PM", "04:00 PM"]
    }
  },
  {
    id: "d2",
    name: "Dr. Ethan Cruz",
    specialtyId: "cardiology",
    title: "Cardiac Imaging Specialist",
    experience: 9,
    branch: "North Branch",
    availability: {
      0: ["08:30 AM", "01:00 PM", "03:00 PM"],
      3: ["09:30 AM", "11:30 AM", "02:30 PM"],
      4: ["10:00 AM", "01:30 PM", "04:30 PM"]
    }
  },
  {
    id: "d3",
    name: "Dr. Priya Velasco",
    specialtyId: "dermatology",
    title: "Dermatology Consultant",
    experience: 11,
    branch: "Central Branch",
    availability: {
      0: ["09:00 AM", "11:00 AM", "03:30 PM"],
      1: ["10:00 AM", "01:00 PM", "04:00 PM"],
      5: ["09:30 AM", "12:00 PM", "02:30 PM"]
    }
  },
  {
    id: "d4",
    name: "Dr. Marco Lim",
    specialtyId: "pediatrics",
    title: "Senior Pediatrician",
    experience: 14,
    branch: "West Branch",
    availability: {
      1: ["08:30 AM", "10:30 AM", "01:30 PM"],
      2: ["09:00 AM", "11:30 AM", "03:30 PM"],
      4: ["08:00 AM", "12:00 PM", "04:00 PM"]
    }
  },
  {
    id: "d5",
    name: "Dr. Nora Santos",
    specialtyId: "orthopedics",
    title: "Orthopedic Surgeon",
    experience: 10,
    branch: "South Branch",
    availability: {
      0: ["10:00 AM", "01:00 PM", "03:00 PM"],
      2: ["09:00 AM", "12:30 PM", "04:30 PM"],
      6: ["10:30 AM", "01:30 PM", "03:30 PM"]
    }
  },
  {
    id: "d6",
    name: "Dr. Samuel Yu",
    specialtyId: "pediatrics",
    title: "Child Development Specialist",
    experience: 7,
    branch: "North Branch",
    availability: {
      0: ["09:00 AM", "01:00 PM", "04:00 PM"],
      3: ["08:30 AM", "11:00 AM", "02:00 PM"],
      5: ["10:30 AM", "12:30 PM", "03:30 PM"]
    }
  }
];


const stepMeta = [
  {
    title: "Step 1 of 4",
    subtitle: "Select the type of care you need.",
    question: "Which specialty should we book for you?"
  },
  {
    title: "Step 2 of 4",
    subtitle: "Choose a doctor matched to your specialty.",
    question: "Who would you like to see?"
  },
  {
    title: "Step 3 of 4",
    subtitle: "Pick an available date and time.",
    question: "When works best for your appointment?"
  },
  {
    title: "Step 4 of 4",
    subtitle: "Review the appointment before final confirmation.",
    question: "Everything look right before we book it?"
  }
];

const defaultWizardState = {
  step: 0,
  specialtyId: "",
  doctorId: "",
  date: "",
  time: "",
  confirmed: false
};

let HealthSyncState;

// Wait for state init
function initWizard() {
  try {
    console.log('initWizard: window.HealthSyncState exists?', !!window.HealthSyncState);
    if (!window.HealthSyncState) {
      console.error('HealthSyncState not found! Ensure state.js loads before wizard.js.');
      // Fallback: render with local state
      renderWizard();
      return;
    }
    
    HealthSyncState = window.HealthSyncState;
    HealthSyncState.init();
    renderWizard();
    // Subscribe to changes
    HealthSyncState.subscribe((state) => {
      updateHeroStats();
      renderWizard(); // Re-render on state change
    });
    console.log('Wizard initialized successfully');
  } catch (error) {
    console.error('Wizard init error:', error);
  }
}

const wizardScreen = document.getElementById("wizardScreen");
const wizardQuestion = document.getElementById("wizardQuestion");
const stepLabel = document.getElementById("stepLabel");
const stepSubtitle = document.getElementById("stepSubtitle");
const progressFill = document.getElementById("progressFill");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const resetWizardButton = document.getElementById("resetWizard");
const resumeNotice = document.getElementById("resumeNotice");
const heroDoctorCount = document.getElementById("heroDoctorCount");
const heroPendingCount = document.getElementById("heroPendingCount");

const summarySpecialty = document.getElementById("summarySpecialty");
const summaryDoctor = document.getElementById("summaryDoctor");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");
const carouselElement = document.getElementById("careCarousel");
const carouselCaption = document.getElementById("carouselCaption");
const carouselDotsContainer = document.getElementById("carouselDots");
const carouselPrevButton = document.getElementById("carouselPrev");
const carouselNextButton = document.getElementById("carouselNext");

function getWizardStateLocal() {
  try {
    return HealthSyncState?.getWizardState() || defaultWizardState;
  } catch (error) {
    console.warn('getWizardStateLocal failed, using default:', error);
    return defaultWizardState;
  }
}

function resetWizard() {
  try {
    if (HealthSyncState) {
      HealthSyncState.setWizardState({ ...defaultWizardState });
    }
    renderWizard();
  } catch (e) {
    console.error('Reset failed', e);
  }
}

function updateWizardState(patch) {
  try {
    const current = getWizardStateLocal();
    if (HealthSyncState) {
      HealthSyncState.setWizardState({ ...current, ...patch });
    } else {
      console.warn('HealthSyncState not available, local update only');
    }
    renderWizard();
  } catch (e) {
    console.error('updateWizardState failed', e);
  }
}

function getSpecialtyById(id) {
  return specialties.find((specialty) => specialty.id === id);
}

function getDoctorById(id) {
  return doctors.find((doctor) => doctor.id === id);
}

function formatDate(dateString) {
  if (!dateString) {
    return "Not selected";
  }

  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function getDateChoices() {
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return {
      offset,
      iso: date.toISOString().split("T")[0],
      day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    };
  });
}

function isSlotBooked(doctorId, dateIso, time) {
  const appts = HealthSyncState.getAppointments();
  return appts.some(appt => appt.doctorId === doctorId && appt.date === dateIso && appt.time === time);
}

function getAvailableTimes(doctor) {
  if (!doctor) {
    return [];
  }

  const currentState = getWizardStateLocal();
  const match = getDateChoices().find((item) => item.iso === currentState.date);
  if (!match) {
    return [];
  }

  let times = doctor.availability[match.offset] || [];
  const dateIso = currentState.date;

  // Filter booked slots
  times = times.filter(time => !isSlotBooked(doctor.id, dateIso, time));
  return times;
}

function updateHeroStats() {
  if (heroDoctorCount) {
    heroDoctorCount.textContent = String(doctors.length);
  }

  if (heroPendingCount) {
    const pendingCount = HealthSyncState.getAppointments().filter((appointment) => appointment.status === "pending").length;
    heroPendingCount.textContent = String(pendingCount);
  }
}

function updateSummary() {
  const currentState = getWizardStateLocal();
  const specialty = getSpecialtyById(currentState.specialtyId);
  const doctor = getDoctorById(currentState.doctorId);

  summarySpecialty.textContent = specialty ? specialty.label : "Not selected";
  summaryDoctor.textContent = doctor ? doctor.name : "Not selected";
  summaryDate.textContent = currentState.date ? formatDate(currentState.date) : "Not selected";
  summaryTime.textContent = currentState.time || "Not selected";

  const hasPartialState = Boolean(
    currentState.specialtyId || currentState.doctorId || currentState.date || currentState.time
  );
  resumeNotice.textContent = hasPartialState
    ? "Progress detected. Patients can leave and return later without losing their selections."
    : "Your progress is stored locally in this browser so patients can safely resume later.";
}

function renderSpecialtyStep(wizardState) {
  wizardScreen.innerHTML = `
    <div class="choice-grid">
      ${specialties
        .map((specialty) => {
          const active = wizardState.specialtyId === specialty.id ? "active" : "";
          return `
            <button type="button" class="choice-card ${active}" data-specialty-id="${specialty.id}">
              <span class="choice-badge">${specialty.badge}</span>
              <h3>${specialty.label}</h3>
              <p>${specialty.description}</p>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wizardScreen.querySelectorAll("[data-specialty-id]").forEach((button) => {
    button.addEventListener("click", () => {
      updateWizardState({
        specialtyId: button.dataset.specialtyId,
        doctorId: "",
        date: "",
        time: "",
        confirmed: false
      });
    });
  });
}

function renderDoctorStep(wizardState) {
  const filteredDoctors = doctors.filter((doctor) => doctor.specialtyId === wizardState.specialtyId);

  if (!filteredDoctors.length) {
    wizardScreen.innerHTML = `<div class="empty-state">Pick a specialty first so we can show the right doctors.</div>`;
    return;
  }

  wizardScreen.innerHTML = `
    <div class="doctor-grid">
      ${filteredDoctors
        .map((doctor) => {
          const active = wizardState.doctorId === doctor.id ? "active" : "";
          return `
            <button type="button" class="doctor-card ${active}" data-doctor-id="${doctor.id}">
              <h3>${doctor.name}</h3>
              <p>${doctor.title}</p>
              <div class="doctor-meta">
                <span class="meta-pill">${doctor.experience} yrs exp</span>
                <span class="meta-pill">${doctor.branch}</span>
              </div>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wizardScreen.querySelectorAll("[data-doctor-id]").forEach((button) => {
    button.addEventListener("click", () => {
      updateWizardState({
        doctorId: button.dataset.doctorId,
        date: "",
        time: "",
        confirmed: false
      });
    });
  });
}

function renderTimeStep(wizardState) {
  const doctor = getDoctorById(wizardState.doctorId);
  const dateChoices = getDateChoices();
  const availableTimes = getAvailableTimes(doctor);

  wizardScreen.innerHTML = `
    <div>
      <p class="slot-heading">Choose a day</p>
      <div class="date-grid">
        ${dateChoices
          .map((dateChoice) => {
            const active = wizardState.date === dateChoice.iso ? "active" : "";
            const availableCount = ((doctor && doctor.availability[dateChoice.offset]) || []).length;
            return `
              <button type="button" class="date-card ${active}" data-date="${dateChoice.iso}">
                <h3>${dateChoice.day}</h3>
                <p>${dateChoice.label}</p>
                <p>${availableCount} slots</p>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
    <div>
      <p class="slot-heading">Choose a time</p>
      ${
        wizardState.date
          ? availableTimes.length
            ? `
              <div class="time-grid">
                ${availableTimes
                  .map((time) => {
                    const currentState = getWizardStateLocal();
                    const active = currentState.time === time ? "active" : "";
                    const booked = isSlotBooked(doctor.id, currentState.date, time);
                    return `
                      <button type="button" class="time-card ${active} ${booked ? 'booked' : 'available'}" data-time="${time}" ${booked ? 'disabled' : ''} aria-label="${booked ? 'Booked' : 'Available'}">
                        <h3>${time}</h3>
                        <p>${booked ? 'Booked' : 'Available'} with ${doctor.name}</p>
                      </button>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `<div class="empty-state">No open slots for this doctor on the selected day. Choose another date.</div>`
          : `<div class="empty-state">Select a date to reveal open time slots.</div>`
      }
    </div>
  `;

  wizardScreen.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      updateWizardState({
        date: button.dataset.date,
        time: "",
        confirmed: false
      });
    });
  });

  wizardScreen.querySelectorAll("[data-time]:not([disabled])").forEach((button) => {
    button.addEventListener("click", () => {
      const currentState = getWizardStateLocal();
      updateWizardState({
        time: button.dataset.time,
        confirmed: false
      });
    });
  });
}

function renderConfirmStep(wizardState) {
  const specialty = getSpecialtyById(wizardState.specialtyId);
  const doctor = getDoctorById(wizardState.doctorId);

  wizardScreen.innerHTML = `
    ${
      wizardState.confirmed
        ? `<div class="confirmation-banner">Appointment request submitted. You can now log in and open the matching dashboard.</div>`
        : ""
    }
    <div class="summary-card">
      <h3>Appointment Summary</h3>
      <p><strong>Specialty:</strong> ${specialty ? specialty.label : "Not selected"}</p>
      <p><strong>Doctor:</strong> ${doctor ? doctor.name : "Not selected"}</p>
      <p><strong>Date:</strong> ${wizardState.date ? formatDate(wizardState.date) : "Not selected"}</p>
      <p><strong>Time:</strong> ${wizardState.time || "Not selected"}</p>
    </div>
    <div class="helper-copy">
      Tapping Book Now saves a pending appointment request and keeps the latest booking available for the role-based dashboards.
    </div>
  `;
}

function renderWizard() {
  const wizardState = getWizardStateLocal() || defaultWizardState;
  console.log('Rendering wizard step:', wizardState.step, 'state:', wizardState);
  
  const meta = stepMeta[wizardState.step] || stepMeta[0];
  const progress = ((wizardState.step + 1) / stepMeta.length) * 100;

  stepLabel.textContent = meta.title;
  stepSubtitle.textContent = meta.subtitle;
  wizardQuestion.textContent = meta.question;
  progressFill.style.width = `${progress}%`;

  backButton.disabled = wizardState.step === 0;
  nextButton.textContent = wizardState.step === 3
    ? (wizardState.confirmed ? "Booked" : "Book Now")
    : "Continue";
  nextButton.disabled = !canContinue(wizardState) || (wizardState.step === 3 && wizardState.confirmed);

  // Animate step transition
  wizardScreen.classList.add('fade-out');
  setTimeout(() => {
    if (wizardState.step === 0) {
      renderSpecialtyStep(wizardState);
    } else if (wizardState.step === 1) {
      renderDoctorStep(wizardState);
    } else if (wizardState.step === 2) {
      renderTimeStep(wizardState);
    } else {
      renderConfirmStep(wizardState);
    }
    wizardScreen.classList.remove('fade-out');
    console.log('Step rendered, screen HTML length:', wizardScreen.innerHTML.length);
  }, 200);

  updateSummary();
  updateHeroStats();
}

function canContinue(wizardState) {
  wizardState = wizardState || defaultWizardState;
  if (wizardState.step === 0) {
    return Boolean(wizardState.specialtyId);
  }

  if (wizardState.step === 1) {
    return Boolean(wizardState.doctorId);
  }

  if (wizardState.step === 2) {
    return Boolean(wizardState.date && wizardState.time);
  }

  return Boolean(
    wizardState.specialtyId && wizardState.doctorId && wizardState.date && wizardState.time
  );
}

function saveLatestBooking() {
  const specialty = getSpecialtyById(wizardState.specialtyId);
  const doctor = getDoctorById(wizardState.doctorId);

  const latestBooking = {
    specialty: specialty ? specialty.label : "Not selected",
    doctor: doctor ? doctor.name : "Not selected",
    date: formatDate(wizardState.date),
    time: wizardState.time || "Not selected",
    status: "Pending"
  };

  window.localStorage.setItem(LATEST_BOOKING_KEY, JSON.stringify(latestBooking));
}

function goToNextStep() {
  const currentState = getWizardStateLocal() || defaultWizardState;
  if (!canContinue(currentState)) {
    return;
  }

  if (currentState.step < 3) {
    updateWizardState({ step: currentState.step + 1 });
    return;
  }

  if (!currentState.confirmed) {
    HealthSyncState.addAppointment({
      specialtyId: currentState.specialtyId,
      doctorId: currentState.doctorId,
      date: currentState.date,
      time: currentState.time
    });
    HealthSyncState.addNotification({
      message: `New appointment booked: ${getSpecialtyById(currentState.specialtyId)?.label || ''} with ${getDoctorById(currentState.doctorId)?.name || ''}`,
      type: 'booking'
    });
    // Show toast
    const toast = document.getElementById('toast');
    toast.textContent = 'Booking Confirmed! Check your dashboard.';
    toast.classList.add('show', 'success');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  updateWizardState({ confirmed: true });
}

function goToPreviousStep() {
  const wizardState = getWizardStateLocal() || defaultWizardState;
  if (wizardState.step === 0) {
    return;
  }

  updateWizardState({
    step: wizardState.step - 1,
    confirmed: false
  });
}

function initCarousel() {
  if (!carouselElement || !carouselCaption || !carouselDotsContainer) {
    return;
  }

  const slides = Array.from(carouselElement.querySelectorAll(".carousel-slide"));
  const dots = Array.from(carouselDotsContainer.querySelectorAll(".carousel-dot"));

  if (!slides.length || slides.length !== dots.length) {
    return;
  }

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("active"));
  activeIndex = activeIndex >= 0 ? activeIndex : 0;
  let intervalId = null;

  function renderCarousel(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });

    carouselCaption.textContent = slides[activeIndex].dataset.slideCaption || "";
  }

  function startAutoPlay() {
    stopAutoPlay();
    intervalId = window.setInterval(() => {
      renderCarousel(activeIndex + 1);
    }, 4800);
  }

  function stopAutoPlay() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      renderCarousel(dotIndex);
      startAutoPlay();
    });
  });

  if (carouselPrevButton) {
    carouselPrevButton.addEventListener("click", () => {
      renderCarousel(activeIndex - 1);
      startAutoPlay();
    });
  }

  if (carouselNextButton) {
    carouselNextButton.addEventListener("click", () => {
      renderCarousel(activeIndex + 1);
      startAutoPlay();
    });
  }

  carouselElement.addEventListener("mouseenter", stopAutoPlay);
  carouselElement.addEventListener("mouseleave", startAutoPlay);

  renderCarousel(activeIndex);
  startAutoPlay();
}

backButton.addEventListener("click", goToPreviousStep);
nextButton.addEventListener("click", goToNextStep);
resetWizardButton.addEventListener("click", resetWizard);

// Init on DOM ready
document.addEventListener('DOMContentLoaded', initWizard);

initCarousel();
