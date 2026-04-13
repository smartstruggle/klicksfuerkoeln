/* =========================================
Mobile Menu
========================================= */
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
menuToggle.addEventListener("click", () => {
const expanded = menuToggle.getAttribute("aria-expanded") === "true";
menuToggle.setAttribute("aria-expanded", String(!expanded));
mobileMenu.classList.toggle("is-open");
});
}

document.querySelectorAll(".mobile-nav a, .mobile-contact-btn").forEach((item) => {
item.addEventListener("click", () => {
if (mobileMenu) mobileMenu.classList.remove("is-open");
if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
});
});


/* =========================================
Kontakt-Modal
========================================= */
const contactModal = document.getElementById("contact-modal");
const openButtons = document.querySelectorAll("[data-open-contact]");
const closeButtons = document.querySelectorAll("[data-close-contact]");

function openModal() {
if (!contactModal) return;
contactModal.classList.add("is-open");
contactModal.setAttribute("aria-hidden", "false");
document.body.classList.add("modal-open");
}

function closeModal() {
if (!contactModal) return;
contactModal.classList.remove("is-open");
contactModal.setAttribute("aria-hidden", "true");
document.body.classList.remove("modal-open");
}

openButtons.forEach((button) => {
button.addEventListener("click", openModal);
});

closeButtons.forEach((button) => {
button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
closeModal();
closeFlyerPopup();
}
});


/* =========================================
Cookie Banner
========================================= */
const cookieBanner = document.getElementById("cookie-banner");
const cookieAccept = document.getElementById("cookie-accept");
const cookieAccepted = localStorage.getItem("kfk-cookie-accepted");

if (!cookieAccepted && cookieBanner) {
cookieBanner.hidden = false;
}

if (cookieAccept) {
cookieAccept.addEventListener("click", () => {
localStorage.setItem("kfk-cookie-accepted", "true");
cookieBanner.hidden = true;
});
}



/* =========================================
Smarte Footer-Erkennung (Intersection Observer)
========================================= */
const floatingBtn = document.querySelector(".floating-project-btn");
const siteFooter = document.querySelector(".site-footer");

// Die Logik, die prüft, ob der Footer sichtbar wird
const footerObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
// Wenn der Footer den Sichtbereich berührt: Ausblenden
gsap.to(floatingBtn, {
opacity: 0,
y: 20,
duration: 0.4,
pointerEvents: 'none',
overwrite: 'auto'
});
} else {
// Wenn wir wieder nach oben scrollen: Einblenden
// Aber nur, wenn die Start-Animation (dein Master-Code) schon durch ist
if (typeof floatingVisibilityEnabled !== 'undefined' && floatingVisibilityEnabled) {
gsap.to(floatingBtn, {
opacity: 1,
y: 0,
duration: 0.4,
pointerEvents: 'all',
overwrite: 'auto'
});
}
}
});
}, {
rootMargin: '0px 0px -20px 0px', // Erscheint/Verschwindet 20px vor Kontakt
threshold: 0
});

if (siteFooter && floatingBtn) {
footerObserver.observe(siteFooter);
}

/* =========================================
Formular-Senden
========================================= */
async function handleFormSubmit(formElement, statusElement) {
if (!formElement || !statusElement) return;

formElement.addEventListener("submit", async (e) => {
e.preventDefault();

statusElement.textContent = "Nachricht wird gesendet …";

const formData = {
name: formElement.name.value.trim(),
email: formElement.email.value.trim(),
message: formElement.message.value.trim()
};

try {
const response = await fetch("/api/contact", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(formData)
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.message || "E-Mail konnte nicht gesendet werden.");
}

statusElement.textContent = "Danke – deine Nachricht wurde gesendet.";
formElement.reset();

// Nur beim Modal-Formular automatisch schließen
if (formElement.id === "contactForm") {
setTimeout(() => {
closeModal();
statusElement.textContent = "";
}, 1400);
}

} catch (error) {
console.error(error);
statusElement.textContent =
error.message || "Das Senden hat gerade nicht funktioniert.";
}
});
}

const modalForm = document.getElementById("contactForm");
const modalStatus = document.getElementById("form-status");

if (modalForm && modalStatus) {
handleFormSubmit(modalForm, modalStatus);
}

const embeddedForm = document.getElementById("embeddedContactForm");
const embeddedStatus = document.getElementById("embedded-form-status");

if (embeddedForm && embeddedStatus) {
handleFormSubmit(embeddedForm, embeddedStatus);
}


/* =========================================
Flyer Popup
========================================= */
const flyerPopup = document.getElementById("flyer-popup");
const flyerPopupClose = document.getElementById("flyer-popup-close");
const flyerPopupX = document.getElementById("flyer-popup-x");
const flyerPopupMail = document.getElementById("flyer-popup-mail");
const flyerOpenContactFirst = document.querySelectorAll("[data-close-flyer-first]");

const urlParams = new URLSearchParams(window.location.search);
const isFlyerVisit = urlParams.get("flyer") === "1";

function openFlyerPopup() {
if (!flyerPopup) return;
flyerPopup.classList.add("is-open");
flyerPopup.setAttribute("aria-hidden", "false");
document.body.classList.add("modal-open");
}

function closeFlyerPopup() {
if (!flyerPopup) return;
flyerPopup.classList.remove("is-open");
flyerPopup.setAttribute("aria-hidden", "true");
document.body.classList.remove("modal-open");

// Beim Flyer-Besuch startet das Intro erst NACH dem Schließen
if (isFlyerVisit) {
startIntroAnimations();
}
}

if (flyerPopupClose) {
flyerPopupClose.addEventListener("click", closeFlyerPopup);
}

if (flyerPopupX) {
flyerPopupX.addEventListener("click", closeFlyerPopup);
}

if (flyerPopupMail) {
flyerPopupMail.addEventListener("click", closeFlyerPopup);
}

flyerOpenContactFirst.forEach((button) => {
button.addEventListener("click", () => {
closeFlyerPopup();
setTimeout(() => openModal(), 120);
});
});


/* ---------- GSAP Intro + Hero-Grafik FUSION ---------- */
let introHasStarted = false;

function startIntroAnimations() {
if (introHasStarted) return;
introHasStarted = true;

// A. SETUP (Alles im "Aus"-Zustand vorbereiten)
// Wir setzen die Birnen auf 0, die Filamente auf ein gaaanz schwaches Glimmen
gsap.set(["#birne-links", "#birne-rechts", "#leucht-o", "#dom"], { opacity: 0 });
gsap.set(["#filament-links", "#filament-rechts"], { opacity: 0.1, scale: 0.95 });

gsap.set("#cursor", { x: 50, y: 30, opacity: 0 });

// Leitung vorbereiten: Wir nutzen 2000, um sicherzugehen, dass sie komplett weg ist
gsap.set("#leitung", {
strokeDasharray: 2000,
strokeDashoffset: -2000 // Das sorgt oft für den Start am Button (rechts)
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) {
gsap.set([".eyebrow", ".hero h1", ".services-anim", "#birne-links", "#birne-rechts", "#leucht-o"], { opacity: 1 });
gsap.set("#leitung", { strokeDashoffset: 0 });
return;
}

/* ---------- Die kombinierte Timeline ---------- */
const mainTL = gsap.timeline({ defaults: { ease: "power3.out" } });

// 1. Zuerst kommt dein Text (wie vorher)
mainTL.from(".eyebrow", { x: -60, opacity: 0, duration: 0.7 })
.from(".hero h1", { x: -100, opacity: 0, duration: 1.2, ease: "back.out(1.2)" }, "-=0.4")
.from(".services-anim", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")

// 2. JETZT DIE GRAFIK-LOGIK
// Cursor fliegt zum Powerbutton
.to("#cursor", { opacity: 1, x: 0, y: 0, duration: 1.2, ease: "power2.out" }, "-=0.2")

// Realistischer Klick-Effekt
.to("#powerbutton", { scale: 0.9, duration: 0.15, transformOrigin: "center center" })
.to("#powerbutton", { scale: 1, duration: 0.15 })

// Leitung wächst langsam vom Button aus nach links
.to("#leitung", {
strokeDashoffset: 0,
duration: 3,
ease: "none"
})

// Effekt Birne RECHTS (während die Leitung noch läuft)
.to("#filament-rechts", { opacity: 1, scale: 1, duration: 0.6 }, "-=2.4")
.to("#birne-rechts", { opacity: 1, duration: 0.8 }, "-=2.0")

// Effekt Birne LINKS (später, wenn die Leitung weiter links ist)
.to("#filament-links", { opacity: 1, scale: 1, duration: 0.6 }, "-=1.2")
.to("#birne-links", { opacity: 1, duration: 0.8 }, "-=0.8")

// Das Finale: Ö leuchtet und Dom blinkt
.to("#leucht-o", {
opacity: 1,
filter: "drop-shadow(0 0 20px rgba(253, 144, 21, 0.8))",
duration: 0.8
})
.to("#dom", { opacity: 1, duration: 0.4 })
.to("#dom", { opacity: 0, duration: 0.8, delay: 0.4 });
}

// Ganz wichtig: Der Aufruf beim Laden der Seite
window.addEventListener("load", () => {
setTimeout(startIntroAnimations, 500);
});


/* =========================================
Startlogik beim Laden
========================================= */
window.addEventListener("load", () => {
if (isFlyerVisit) {
openFlyerPopup();
} else {
startIntroAnimations();
}
});
