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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Initialisierung (Alles unsichtbar machen)
gsap.set(["#birne-links", "#birne-rechts", "#leucht-o", "#dom"], {
opacity: 0,
scale: 0.85,
transformOrigin: "50% 50%"
});
gsap.set("#cursor", { x: 18, y: 12, opacity: 0 });
gsap.set("#leitung", { strokeDasharray: 2000, strokeDashoffset: 2000 }); // Höherer Wert zur Sicherheit

if (prefersReducedMotion) {
gsap.set([".eyebrow", ".hero h1", ".services-anim", ".floating-project-btn", "#birne-links", "#birne-rechts", "#leucht-o", "#dom", "#cursor"], {
opacity: 1, x: 0, y: 0, scale: 1
});
gsap.set("#leitung", { strokeDashoffset: 0 });
return;
}

/* ---------- Die kombinierte Timeline ---------- */
const mainTL = gsap.timeline({ defaults: { ease: "power3.out" } });

// TEIL A: Text & Button
mainTL.from(".eyebrow", { x: -60, opacity: 0, duration: 0.7 })
.from(".hero h1", { x: -100, opacity: 0, duration: 1.2, ease: "back.out(1.2)" }, "-=0.4")
.from(".services-anim", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
.fromTo(".floating-project-btn", { x: 80, opacity: 0 }, {
x: 0, opacity: 1, duration: 0.9,
onStart: () => document.querySelector(".floating-project-btn")?.classList.remove("is-hidden")
}, "-=0.6")

// TEIL B: Die Grafik-Animation (Startet direkt im Anschluss)
.to("#cursor", { opacity: 1, x: 0, y: 0, duration: 0.45 }, "-=0.2")
.to("#powerbutton", {
scale: 0.94,
transformOrigin: "center center",
duration: 0.08,
yoyo: true,
repeat: 1
}, "-=0.08")
.to("#leitung", { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" })
.to("#birne-links", { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.5)" }, "-=0.4")
.to("#birne-rechts", { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.5)" }, "-=0.3")
.to("#leucht-o", {
opacity: 1, scale: 1, duration: 0.5,
filter: "drop-shadow(0 0 15px rgba(253, 144, 21, 0.6))"
}, "-=0.2")
.to("#dom", { opacity: 1, duration: 0.6, ease: "back.out(1.2)" }, "-=0.1");
}

// DER ZÜNDER: Ersetze dein altes window.addEventListener("load") am Ende des Scripts hiermit:
window.addEventListener("load", () => {
// Kurze Verzögerung, damit der Browser alles gerendert hat
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
