const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle) {
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

/* Kontakt-Modal */
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
if (event.key === "Escape") closeModal();
});

/* Cookie Banner */
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

/* Formular-Senden */
async function handleFormSubmit(formElement, statusElement) {
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

if (!response.ok) {
throw new Error("Fehler beim Senden");
}

formElement.reset();
statusElement.textContent = "Danke – deine Nachricht wurde gesendet.";
} catch (error) {
statusElement.textContent =
"Das Senden hat gerade nicht funktioniert. Bitte versuche es nochmal.";
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

/* Flyer Popup nur mobil + nur bei ?flyer=1 */
function isMobileDevice() {
return window.innerWidth <= 860;
}

function shouldShowFlyerPopup() {
const params = new URLSearchParams(window.location.search);
return params.get("flyer") === "1";
}

const flyerPopup = document.getElementById("flyer-popup");
const flyerPopupClose = document.getElementById("flyer-popup-close");
const flyerPopupX = document.getElementById("flyer-popup-x");

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
}

if (flyerPopupClose) {
flyerPopupClose.addEventListener("click", closeFlyerPopup);
}

if (flyerPopupX) {
flyerPopupX.addEventListener("click", closeFlyerPopup);
}

window.addEventListener("load", () => {
if (isMobileDevice() && shouldShowFlyerPopup()) {
setTimeout(() => {
openFlyerPopup();
}, 500);
}
});
