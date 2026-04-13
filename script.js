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


/* ---------- Hero-Grafik: Kinematische Master-Logik ---------- */
let introHasStarted = false;

function startIntroAnimations() {
if (introHasStarted) return;
introHasStarted = true;

// 1. DER NULLZUSTAND (Alles vorbereiten)
// Ö ist da, aber "tot" (schwarz/dunkel)
gsap.set("#leucht-o", { opacity: 0.2, filter: "blur(2px)" });

// Filamente glimmen nur ganz leicht (Standby)
gsap.set(["#filament-links", "#filament-rechts"], { opacity: 0.1, scale: 0.98 });

// Birnen-Glow ist komplett aus
gsap.set(["#birne-links", "#birne-rechts"], { opacity: 0 });

// Dom ist unsichtbar und klein (Startpunkt: Ö-Punkte)
gsap.set("#dom", {
opacity: 0,
scale: 0,
transformOrigin: "center bottom"
});

// Cursor Startposition
gsap.set("#cursor", { x: 40, y: 30, opacity: 0 });

// Leitung komplett versteckt (rechts startend)
gsap.set("#leitung", { strokeDasharray: 2500, strokeDashoffset: -2500 });

/* ---------- DIE TIMELINE ---------- */
const masterTL = gsap.timeline({
defaults: { ease: "power2.inOut" }
});

// SCHRITT 1: Der Cursor-Klick
masterTL.to("#cursor", { opacity: 1, x: 0, y: 0, duration: 0.5 })
.to("#powerbutton", { scale: 0.88, duration: 0.2, transformOrigin: "center" })
.to("#powerbutton", { scale: 1, duration: 0.2 })
.to("#cursor", { opacity: 0, x: 10, y: 10, duration: 0.5 }, "+=0.5"); // Cursor zieht sich dezent zurück

// SCHRITT 2: Die Leitung (Die "Zündschnur")
// Wir nehmen uns 6 Sekunden Zeit für die gesamte Strecke
masterTL.to("#leitung", {
strokeDashoffset: 0,
duration: 1.5,
ease: "none"
}, "-=0.5");

// SCHRITT 3: Birne RECHTS (Trigger nach ca. 1.5s Leitungsfahrt)
masterTL.to("#filament-rechts", {
opacity: 1,
scale: 1.02,
duration: 0.5,
ease: "power1.in"
}, "-=4.5") // Exakt wenn die Leitung dort ankommt
.to("#birne-rechts", {
opacity: 1,
duration: 0.5, // Langsames "Heißlaufen" des Glases
ease: "sine.out"
}, "-=4.0");

// SCHRITT 4: Birne LINKS (Trigger nach ca. 4s Leitungsfahrt)
masterTL.to("#filament-links", {
opacity: 1,
scale: 1.02,
duration: 0.5
}, "-=2.0")
.to("#birne-links", {
opacity: 1,
duration: 2.5
}, "-=1.5");

// SCHRITT 5: Das Ö (Trigger am Ende der Leitung)
masterTL.to("#leucht-o", {
opacity: 1,
filter: "drop-shadow(0 0 30px rgba(253, 144, 21, 0.8)) blur(0px)",
duration: 0.75
}, "-=0.2");

// SCHRITT 6: Der Dom-Plopp (Wächst aus dem Ö)
masterTL.to("#dom", {
opacity: 1,
scale: 1,
duration: 1.8,
ease: "back.out(1.2)"
}, "+=0.1")

// SCHRITT 7: Dom-Finale (Blinken/Verschwinden)
.to("#dom", {
opacity: 0,
scale: 0.95,
duration: 2,
delay: 4 // Er bleibt 4 Sekunden stolz stehen
});
}

// Start-Event
window.addEventListener("load", () => {
setTimeout(startIntroAnimations, 800);
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
