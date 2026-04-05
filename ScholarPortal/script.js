const STORAGE_KEYS = {
    role: "scholarRole",
    userId: "scholarUserId",
    userName: "scholarUserName",
    users: "scholarRegisteredStudents",
    enrollments: "scholarEnrollments",
    legacyCourses: "scholarEnrolledCourses"
};

const DEMO_STUDENT = {
    userId: "STU123",
    password: "password",
    name: "Demo Student"
};

const DEFAULT_STUDENT_COURSES = [
    "Web Development Fundamentals",
    "Data Science Essentials",
    "Cloud Computing"
];

document.addEventListener("DOMContentLoaded", () => {
    migrateLegacyCourseStorage();
    initMobileMenu();
    initSmoothScrolling();
    initLoginCards();
    initLoginForms();
    initRegistrationForm();
    initDashboards();
    initCourseEnrollment();
    initActionButtons();
    initRevealAnimations();
});

function initMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.querySelector(".nav-menu");

    if (!mobileMenu || !navMenu) {
        return;
    }

    mobileMenu.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

function initSmoothScrolling() {
    const navMenu = document.querySelector(".nav-menu");

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetSelector = anchor.getAttribute("href");
            const target = targetSelector ? document.querySelector(targetSelector) : null;

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            navMenu?.classList.remove("active");
        });
    });
}

function initLoginCards() {
    const roleCards = document.querySelectorAll(".login-card");

    if (!roleCards.length) {
        return;
    }

    roleCards.forEach((card) => {
        card.addEventListener("click", () => setActiveRoleCard(card.dataset.role));

        card.querySelectorAll("input, button").forEach((control) => {
            control.addEventListener("focus", () => setActiveRoleCard(card.dataset.role));
        });
    });
}

function setActiveRoleCard(role) {
    document.querySelectorAll(".login-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.role === role);
    });
}

function initLoginForms() {
    document.querySelectorAll(".login-form").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const role = form.dataset.role || form.closest(".login-card")?.dataset.role;
            if (!role) {
                return;
            }

            const idField = document.getElementById(`${role}Id`);
            const passField = document.getElementById(`${role}Pass`);
            const userId = idField?.value.trim().toUpperCase();
            const password = passField?.value ?? "";

            if (!userId || !password) {
                alert("Please enter both your ID and password.");
                return;
            }

            if (role === "student") {
                const result = validateStudentLogin(userId, password);
                if (!result.valid) {
                    alert('Use demo login "STU123 / password" or a registered student account.');
                    passField?.focus();
                    return;
                }

                ensureStudentEnrollments(userId);
                signIn("student", userId, result.name);
                window.location.href = "index.html#student-dashboard";
                return;
            }

            if (password !== "password") {
                alert('Demo password is "password".');
                passField?.focus();
                return;
            }

            signIn(role, userId);
            window.location.href = `index.html#${role}-dashboard`;
        });
    });
}

function initRegistrationForm() {
    const registerForm = document.querySelector(".register-form");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("registerName")?.value.trim() ?? "";
        const email = document.getElementById("registerEmail")?.value.trim() ?? "";
        const userId = document.getElementById("registerStudentId")?.value.trim().toUpperCase() ?? "";
        const password = document.getElementById("registerPassword")?.value ?? "";
        const confirmPassword = document.getElementById("registerConfirmPassword")?.value ?? "";

        if (!name || !email || !userId || !password || !confirmPassword) {
            alert("Please complete every registration field.");
            return;
        }

        if (password.length < 4) {
            alert("Please choose a password with at least 4 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Your passwords do not match.");
            return;
        }

        if (userId === DEMO_STUDENT.userId) {
            alert("That student ID is reserved for the demo account. Please choose another one.");
            return;
        }

        const registeredStudents = getRegisteredStudents();
        const userExists = registeredStudents.some((student) => student.userId === userId);
        if (userExists) {
            alert("That student ID is already registered. Please sign in or choose another ID.");
            return;
        }

        registeredStudents.push({
            name,
            email,
            userId,
            password
        });

        saveRegisteredStudents(registeredStudents);
        setStudentEnrollments(userId, []);
        signIn("student", userId, name);
        window.location.href = "index.html#student-dashboard";
    });
}

function initDashboards() {
    const dashboardSections = document.querySelectorAll(".dashboard-section");

    if (!dashboardSections.length) {
        return;
    }

    const role = localStorage.getItem(STORAGE_KEYS.role);
    const userId = localStorage.getItem(STORAGE_KEYS.userId);

    bindLogoutButtons();

    if (!role) {
        hideDashboards();
        return;
    }

    if (role === "student" && userId) {
        ensureStudentEnrollments(userId);
    }

    showDashboard(role);
    updateDashboardNav(role);
    populateDashboard(role, userId, localStorage.getItem(STORAGE_KEYS.userName));
}

function bindLogoutButtons() {
    ["studentLogout", "teacherLogout", "adminLogout"].forEach((id) => {
        document.getElementById(id)?.addEventListener("click", logout);
    });
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.role);
    localStorage.removeItem(STORAGE_KEYS.userId);
    localStorage.removeItem(STORAGE_KEYS.userName);
    window.location.href = "login.html";
}

function hideDashboards() {
    document.querySelectorAll(".dashboard-section").forEach((section) => {
        section.hidden = true;
    });
}

function showDashboard(role) {
    const targetId = `${role}-dashboard`;

    document.querySelectorAll(".dashboard-section").forEach((section) => {
        section.hidden = section.id !== targetId;
    });
}

function updateDashboardNav(role) {
    const dashboardLink = document.getElementById("dashboardNavLink");
    if (!dashboardLink) {
        return;
    }

    dashboardLink.innerHTML = `<i class="fas fa-tachometer-alt"></i> ${capitalize(role)} Dashboard`;
    dashboardLink.href = `#${role}-dashboard`;
}

function populateDashboard(role, userId, userName) {
    if (role === "student") {
        renderStudentCourses(userId, userName);
        return;
    }

    if (role === "teacher") {
        document.querySelectorAll(".grade-btn").forEach((button) => {
            button.addEventListener("click", () => {
                alert(`Grades panel opened for ${userId || "teacher"}.`);
            });
        });
        return;
    }

    if (role === "admin") {
        document.querySelectorAll(".action-btn").forEach((button) => {
            button.addEventListener("click", () => {
                alert(`${button.textContent.trim()} is ready for the next backend step.`);
            });
        });
    }
}

function renderStudentCourses(userId, userName) {
    const enrolledCoursesElement = document.getElementById("studentEnrolledCourses");
    if (!enrolledCoursesElement || !userId) {
        return;
    }

    const courses = getStudentEnrollments(userId);
    const studentLabel = userName || userId || "Student";

    if (!courses.length) {
        enrolledCoursesElement.innerHTML = `<p class="dashboard-empty">${studentLabel}, you have not enrolled in any courses yet.</p>`;
        return;
    }

    enrolledCoursesElement.innerHTML = courses
        .map((course, index) => {
            const progress = 35 + (index % 4) * 15;
            return `<div class="enrolled-item"><span><i class="fas fa-book-open"></i> ${course}</span><strong>${progress}% complete</strong></div>`;
        })
        .join("");
}

function initCourseEnrollment() {
    const statusButtons = document.querySelectorAll(".course-card .status");

    if (!statusButtons.length) {
        return;
    }

    const role = localStorage.getItem(STORAGE_KEYS.role);
    const userId = localStorage.getItem(STORAGE_KEYS.userId);
    const isStudent = role === "student" && Boolean(userId);

    statusButtons.forEach((button) => {
        const note = ensureCourseAccessNote(button);

        if (!isStudent) {
            button.hidden = true;
            note.hidden = false;
            note.innerHTML = role
                ? '<i class="fas fa-lock"></i> Student enrollment only'
                : '<i class="fas fa-user-graduate"></i> Sign in as a student to enroll';
            return;
        }

        note.hidden = true;
        button.hidden = false;
    });

    if (!isStudent || !userId) {
        return;
    }

    ensureStudentEnrollments(userId);
    syncCourseButtonsWithStorage(statusButtons, userId);

    statusButtons.forEach((button) => {
        if (button.dataset.enrollmentBound === "true") {
            return;
        }

        button.dataset.enrollmentBound = "true";
        button.addEventListener("click", () => {
            if (button.classList.contains("enrolled")) {
                return;
            }

            const currentRole = localStorage.getItem(STORAGE_KEYS.role);
            const currentUserId = localStorage.getItem(STORAGE_KEYS.userId);

            if (currentRole !== "student" || !currentUserId) {
                return;
            }

            const courseName = button.closest(".course-card")?.querySelector("h3")?.textContent?.trim();
            if (!courseName) {
                return;
            }

            const courses = getStudentEnrollments(currentUserId);
            if (!courses.includes(courseName)) {
                courses.push(courseName);
                setStudentEnrollments(currentUserId, courses);
            }

            markCourseAsEnrolled(button);
            renderStudentCourses(currentUserId, localStorage.getItem(STORAGE_KEYS.userName));
            alert(`${courseName} added to your enrolled courses.`);
        });
    });
}

function ensureCourseAccessNote(button) {
    const card = button.closest(".course-card");
    let note = card?.querySelector(".course-access-note");

    if (!card) {
        return document.createElement("p");
    }

    if (!note) {
        note = document.createElement("p");
        note.className = "course-access-note";
        card.appendChild(note);
    }

    return note;
}

function syncCourseButtonsWithStorage(buttons, userId) {
    const courses = getStudentEnrollments(userId);

    buttons.forEach((button) => {
        const courseName = button.closest(".course-card")?.querySelector("h3")?.textContent?.trim();
        if (courseName && courses.includes(courseName)) {
            markCourseAsEnrolled(button);
            return;
        }

        markCourseAsAvailable(button);
    });
}

function markCourseAsEnrolled(button) {
    button.textContent = "Enrolled";
    button.classList.remove("available");
    button.classList.add("enrolled");
    button.disabled = true;
}

function markCourseAsAvailable(button) {
    button.textContent = "Enroll";
    button.classList.remove("enrolled");
    button.classList.add("available");
    button.disabled = false;
}

function initActionButtons() {
    document.querySelectorAll("input").forEach((input) => {
        input.addEventListener("focus", () => {
            input.closest(".login-card")?.classList.add("active");
        });
    });
}

function initRevealAnimations() {
    if (!("IntersectionObserver" in window)) {
        return;
    }

    const revealElements = document.querySelectorAll(".highlight-card, .course-card, .dashboard-card, .stat-card, .login-card, .login-copy, .register-card");
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal-on-scroll");
        observer.observe(element);
    });
}

function signIn(role, userId, userName = "") {
    localStorage.setItem(STORAGE_KEYS.role, role);
    localStorage.setItem(STORAGE_KEYS.userId, userId);

    if (userName) {
        localStorage.setItem(STORAGE_KEYS.userName, userName);
    } else {
        localStorage.removeItem(STORAGE_KEYS.userName);
    }
}

function validateStudentLogin(userId, password) {
    if (userId === DEMO_STUDENT.userId && password === DEMO_STUDENT.password) {
        return {
            valid: true,
            name: DEMO_STUDENT.name
        };
    }

    const student = getRegisteredStudents().find((registeredStudent) => {
        return registeredStudent.userId === userId && registeredStudent.password === password;
    });

    if (!student) {
        return {
            valid: false,
            name: ""
        };
    }

    return {
        valid: true,
        name: student.name
    };
}

function getRegisteredStudents() {
    const rawUsers = localStorage.getItem(STORAGE_KEYS.users);

    if (!rawUsers) {
        return [];
    }

    try {
        const parsedUsers = JSON.parse(rawUsers);
        return Array.isArray(parsedUsers) ? parsedUsers : [];
    } catch (error) {
        return [];
    }
}

function saveRegisteredStudents(users) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getAllEnrollments() {
    const rawEnrollments = localStorage.getItem(STORAGE_KEYS.enrollments);

    if (!rawEnrollments) {
        return {};
    }

    try {
        const parsedEnrollments = JSON.parse(rawEnrollments);
        return parsedEnrollments && typeof parsedEnrollments === "object" ? parsedEnrollments : {};
    } catch (error) {
        return {};
    }
}

function getStudentEnrollments(userId) {
    const enrollments = getAllEnrollments();
    return Array.isArray(enrollments[userId]) ? enrollments[userId] : [];
}

function setStudentEnrollments(userId, courses) {
    const enrollments = getAllEnrollments();
    enrollments[userId] = courses;
    localStorage.setItem(STORAGE_KEYS.enrollments, JSON.stringify(enrollments));
}

function ensureStudentEnrollments(userId) {
    const existingCourses = getStudentEnrollments(userId);
    if (existingCourses.length || hasEnrollmentRecord(userId)) {
        return;
    }

    const starterCourses = userId === DEMO_STUDENT.userId ? [...DEFAULT_STUDENT_COURSES] : [];
    setStudentEnrollments(userId, starterCourses);
}

function hasEnrollmentRecord(userId) {
    const enrollments = getAllEnrollments();
    return Object.prototype.hasOwnProperty.call(enrollments, userId);
}

function migrateLegacyCourseStorage() {
    const legacyCourses = localStorage.getItem(STORAGE_KEYS.legacyCourses);
    const currentUserId = localStorage.getItem(STORAGE_KEYS.userId);
    const currentRole = localStorage.getItem(STORAGE_KEYS.role);

    if (!legacyCourses || currentRole !== "student" || !currentUserId || hasEnrollmentRecord(currentUserId)) {
        return;
    }

    try {
        const parsedCourses = JSON.parse(legacyCourses);
        if (Array.isArray(parsedCourses)) {
            setStudentEnrollments(currentUserId, parsedCourses);
        }
    } catch (error) {
        setStudentEnrollments(currentUserId, []);
    }

    localStorage.removeItem(STORAGE_KEYS.legacyCourses);
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
