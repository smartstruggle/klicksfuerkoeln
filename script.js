/* =========================================
1. MOBILE MENU
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
2. KONTAKT-MODAL & FLYER POPUP
========================================= */
const contactModal = document.getElementById("contact-modal");
const openButtons = document.querySelectorAll("[data-open-contact]");
const closeButtons = document.querySelectorAll("[data-close-contact]");
const flyerPopup = document.getElementById("flyer-popup");
const flyerPopupClose = document.getElementById("flyer-popup-close");
const flyerPopupX = document.getElementById("flyer-popup-x");
const flyerPopupMail = document.getElementById("flyer-popup-mail");
const flyerOpenContactFirst = document.querySelectorAll("[data-close-flyer-first]");

const urlParams = new URLSearchParams(window.location.search);
const isFlyerVisit = urlParams.get("flyer") === "1";

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
if (isFlyerVisit) startIntroAnimations();
}

openButtons.forEach(button => button.addEventListener("click", openModal));
closeButtons.forEach(button => button.addEventListener("click", closeModal));

if (flyerPopupClose) flyerPopupClose.addEventListener("click", closeFlyerPopup);
if (flyerPopupX) flyerPopupX.addEventListener("click", closeFlyerPopup);
if (flyerPopupMail) flyerPopupMail.addEventListener("click", closeFlyerPopup);

flyerOpenContactFirst.forEach((button) => {
button.addEventListener("click", () => {
closeFlyerPopup();
setTimeout(() => openModal(), 120);
});
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
closeModal();
closeFlyerPopup();
}
});


/* =========================================
3. COOKIE BANNER
========================================= */
const cookieBanner = document.getElementById("cookie-banner");
const cookieAccept = document.getElementById("cookie-accept");
if (!localStorage.getItem("kfk-cookie-accepted") && cookieBanner) {
cookieBanner.hidden = false;
}
if (cookieAccept) {
cookieAccept.addEventListener("click", () => {
localStorage.setItem("kfk-cookie-accepted", "true");
cookieBanner.hidden = true;
});
}


/* =========================================
4. FORMULAR-SENDEN (API)
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
headers: { "Content-Type": "application/json" },
body: JSON.stringify(formData)
});
const data = await response.json();
if (!response.ok) throw new Error(data.message || "E-Mail Fehler.");

statusElement.textContent = "Danke – deine Nachricht wurde gesendet.";
formElement.reset();
if (formElement.id === "contactForm") {
setTimeout(() => { closeModal(); statusElement.textContent = ""; }, 1400);
}
} catch (error) {
statusElement.textContent = error.message || "Senden fehlgeschlagen.";
}
});
}

const modalForm = document.getElementById("contactForm");
const modalStatus = document.getElementById("form-status");
if (modalForm) handleFormSubmit(modalForm, modalStatus);

const embeddedForm = document.getElementById("embeddedContactForm");
const embeddedStatus = document.getElementById("embedded-form-status");
if (embeddedForm) handleFormSubmit(embeddedForm, embeddedStatus);


/* =========================================
5. SMARTE FLOATING-BUTTON LOGIK
========================================= */
const floatingBtn = document.querySelector(".floating-project-btn");
const siteFooter = document.querySelector(".site-footer");
const heroGraphic = document.querySelector(".hero-graphic");

function updateBtnVisibility(shouldShow) {
if (!floatingBtn) return;
gsap.to(floatingBtn, {
opacity: shouldShow ? 1 : 0,
y: shouldShow ? 0 : 20,
autoAlpha: shouldShow ? 1 : 0,
duration: 0.4,
pointerEvents: shouldShow ? 'all' : 'none',
overwrite: 'auto'
});
}

const scrollObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
// Wenn Hero oder Footer sichtbar -> Button weg
if (entry.isIntersecting) {
updateBtnVisibility(false);
} else if (entry.target === heroGraphic) {
// Wenn man den Hero verlässt -> Button herzeigen
updateBtnVisibility(true);
}
});
}, { threshold: 0.1 });

if (floatingBtn) {
if (heroGraphic) scrollObserver.observe(heroGraphic);
if (siteFooter) scrollObserver.observe(siteFooter);
}


/* =========================================
6. DESKTOP HERO ANIMATION
========================================= */
let introHasStarted = false;

function startIntroAnimations() {
if (introHasStarted || window.innerWidth < 768) return;
const heroContainer = document.querySelector(".hero-graphic");
if (!heroContainer) return;
introHasStarted = true;

gsap.set("#leucht-o", { opacity: 0.2 });
gsap.set(["#filament-links", "#filament-rechts"], { opacity: 0.1, scale: 0.98 });
gsap.set(["#birne-links", "#birne-rechts"], { opacity: 0 });
gsap.set("#dom", { opacity: 0, scale: 0, transformOrigin: "center bottom" });
gsap.set("#cursor", { x: 40, y: 30, opacity: 0 });
gsap.set("#leitung", { strokeDasharray: 2500, strokeDashoffset: -2500 });

const masterTL = gsap.timeline({ defaults: { ease: "power2.inOut" } });

masterTL.to("#cursor", { opacity: 1, x: 0, y: 0, duration: 0.5 })
.to("#powerbutton", { scale: 0.88, duration: 0.2, transformOrigin: "center" })
.to("#powerbutton", { scale: 1, duration: 0.2 })
.to("#cursor", { opacity: 0, duration: 0.5 }, "+=0.2")
.addLabel("leitungStart")
.to("#leitung", { strokeDashoffset: 0, duration: 4, ease: "none" }, "leitungStart")
.to("#filament-rechts", { opacity: 1, scale: 1.02, duration: 0.3 }, "leitungStart+=0.8")
.to("#birne-rechts", { opacity: 1, duration: 0.8 }, "<")
.to("#filament-links", { opacity: 1, scale: 1.02, duration: 0.3 }, "leitungStart+=2.8")
.to("#birne-links", { opacity: 1, duration: 0.8 }, "<")
.to("#leucht-o", { opacity: 1, filter: "drop-shadow(0 0 30px #fd9015)", duration: 0.6 }, "leitungStart+=4")
.to("#dom", { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.2)" }, "+=0.2");
}


/* =========================================
7. MOBIL HERO (SMART SCROLL SAFE VERSION)
- ohne extra HTML
- linke Hero-Zone reagiert
- Scrollen bleibt möglich
========================================= */

function initMobilEntrance() {
const heroContainer = document.querySelector(".hero-graphic");
if (!heroContainer || window.innerWidth >= 768) return;

// Alles initial vorbereiten
gsap.set(
["#dom-mobil", "#leucht-o-mobil", "#leitung-mobil", "#cursor-mobil", "#powerbutton-mobil"],
{
autoAlpha: 0,
visibility: "visible"
}
);

gsap.set("#dom-mobil", {
scale: 0.8,
transformOrigin: "center bottom"
});

gsap.set("#leitung-mobil", {
strokeDasharray: 2000,
strokeDashoffset: 2000
});

gsap.set("#cursor-mobil", {
x: 40,
y: 40
});

const tl = gsap.timeline({
delay: 0.5,
onComplete: () => initMobilInteractions(heroContainer)
});

tl.to("#cursor-mobil", {
autoAlpha: 1,
x: 0,
y: 0,
duration: 0.4
})
.to("#powerbutton-mobil", {
autoAlpha: 1,
duration: 0.2
})
.to("#powerbutton-mobil", {
scale: 0.88,
duration: 0.15,
transformOrigin: "center center"
})
.to("#powerbutton-mobil", {
scale: 1,
duration: 0.15
})
.to("#leitung-mobil", {
autoAlpha: 1,
strokeDashoffset: 0,
duration: 1.2,
ease: "none"
}, "-=0.1")
.to("#dom-mobil", {
autoAlpha: 1,
scale: 1,
duration: 0.7,
ease: "back.out(1.6)"
}, "-=0.8")
.to("#leucht-o-mobil", {
autoAlpha: 1,
filter: "drop-shadow(0 0 25px #fd9015)",
duration: 0.5
}, "-=0.2");
}

function initMobilInteractions(container) {
const dom = document.querySelector("#dom-mobil");
const btn = document.querySelector("#powerbutton-mobil");
const cursor = document.querySelector("#cursor-mobil");

if (!dom || !btn || !cursor || !container) return;

let growthLevel = 0;
let pressTimer = null;
let startDelayTimer = null;

let pointerIsDown = false;
let interactionActive = false;
let activePointerId = null;

let startX = 0;
let startY = 0;

const HOLD_DELAY = 180;
const MOVE_THRESHOLD = 14;
const LEFT_ZONE_RATIO = 0.30;

const hintTl = gsap.timeline({ repeat: -1 });
hintTl
.to(btn, {
scale: 1.05,
filter: "drop-shadow(0 0 8px #fd9015)",
duration: 0.8,
yoyo: true,
repeat: 1,
ease: "sine.inOut",
transformOrigin: "center"
})
.to(cursor, {
x: 3,
y: -2,
duration: 0.18,
yoyo: true,
repeat: 3,
ease: "sine.inOut"
}, 0);

function isInLeftZone(e) {
const rect = container.getBoundingClientRect();
const x = e.clientX - rect.left;
return x >= 0 && x <= rect.width * LEFT_ZONE_RATIO;
}

function clearTimers() {
if (startDelayTimer) {
clearTimeout(startDelayTimer);
startDelayTimer = null;
}

if (pressTimer) {
clearInterval(pressTimer);
pressTimer = null;
}
}

function growDom() {
if (growthLevel >= 4) return;

growthLevel++;

gsap.to(dom, {
scale: 1 + (growthLevel * 0.3),
duration: 0.25,
ease: "back.out(1.5)",
transformOrigin: "center bottom"
});

if (growthLevel === 4) {
clearInterval(pressTimer);
pressTimer = null;

gsap.timeline()
.to(dom, {
filter: "brightness(1.8) drop-shadow(0 0 35px #fd9015)",
scale: "+=0.1",
duration: 0.15
})
.to(dom, {
filter: "brightness(1)",
duration: 0.3
});
}
}

function stopTracking() {
pointerIsDown = false;
interactionActive = false;
activePointerId = null;
clearTimers();
}

function resetDom() {
stopTracking();

gsap.to(dom, {
scale: 1,
duration: 0.4,
ease: "power3.in",
filter: "none",
onComplete: () => {
growthLevel = 0;
hintTl.restart();
}
});
}

function cancelBeforeActivation() {
stopTracking();
}

function beginGrowthIfStillHolding() {
if (!pointerIsDown) return;

interactionActive = true;
hintTl.pause();
growDom();
pressTimer = setInterval(growDom, 400);
}

function handlePointerDown(e) {
if (window.innerWidth >= 768) return;
if (pointerIsDown) return;
if (!isInLeftZone(e)) return;

pointerIsDown = true;
interactionActive = false;
activePointerId = e.pointerId;

startX = e.clientX;
startY = e.clientY;

startDelayTimer = setTimeout(beginGrowthIfStillHolding, HOLD_DELAY);
}

function handlePointerMove(e) {
if (!pointerIsDown) return;
if (e.pointerId !== activePointerId) return;

// Wenn Finger aus linker Zone rausgeht -> abbrechen
if (!isInLeftZone(e)) {
if (interactionActive || growthLevel > 0) {
resetDom();
} else {
cancelBeforeActivation();
}
return;
}

const dx = e.clientX - startX;
const dy = e.clientY - startY;

// Sobald merkliche Bewegung da ist, werten wir das als Scroll / Swipe
if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) {
if (interactionActive || growthLevel > 0) {
resetDom();
} else {
cancelBeforeActivation();
}
}
}

function handlePointerEnd(e) {
if (!pointerIsDown) return;
if (activePointerId !== null && e.pointerId !== activePointerId) return;

if (interactionActive || growthLevel > 0) {
resetDom();
} else {
cancelBeforeActivation();
}
}

container.addEventListener("pointerdown", handlePointerDown, { passive: true });
container.addEventListener("pointermove", handlePointerMove, { passive: true });
container.addEventListener("pointerup", handlePointerEnd, { passive: true });
container.addEventListener("pointercancel", handlePointerEnd, { passive: true });

window.addEventListener("pointerup", handlePointerEnd, { passive: true });
window.addEventListener("pointercancel", handlePointerEnd, { passive: true });
}

/* =========================================
8. GLOBALER START-CHECK
========================================= */
window.addEventListener("load", () => {
if (typeof isFlyerVisit !== 'undefined' && isFlyerVisit) {
if (typeof openFlyerPopup === 'function') openFlyerPopup();
} else {
if (window.innerWidth < 768) {
initMobilEntrance();
} else {
startIntroAnimations();
}
}
});

