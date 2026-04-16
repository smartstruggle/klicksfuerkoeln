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
6. DESKTOP HERO ANIMATION (Glow-Impulse Version)
========================================= */
let introHasStarted = false;

function startIntroAnimations() {
  if (introHasStarted || window.innerWidth < 768) return;
  const heroContainer = document.querySelector(".hero-graphic");
  if (!heroContainer) return;
  introHasStarted = true;

  // --- 1. SETUP (Startzustand: Nur Button & Cursor sichtbar) ---
  // Wir blenden die Gruppen inkl. ihrer Filter aus
  gsap.set(["#birne-links", "#dom", "#leucht-o", "#line-vertikal", "#line-horizontal"], { 
    opacity: 0, 
    scale: 1,
    transformOrigin: "center center" 
  });

  // Filter-Glows initial auf 0 setzen (wir animieren die stdDeviation der Filter)
  gsap.set(["#filter1_d_28_70 feGaussianBlur", "#filter2_d_28_70 feGaussianBlur", "#filter3_d_28_70 feGaussianBlur"], {
    attr: { stdDeviation: 0 }
  });
  
  gsap.set("#dom", { transformOrigin: "center bottom" });
  
  // Leitungen vorbereiten (Pfadlänge ca. 840 / 140)
  gsap.set("#line-vertikal", { strokeDasharray: 840, strokeDashoffset: 840, stroke: "#FFEA00" });
  gsap.set("#line-horizontal", { strokeDasharray: 140, strokeDashoffset: 140, stroke: "#FFEA00" });

  const masterTL = gsap.timeline({ defaults: { ease: "power2.out" } });

  masterTL
    // --- SCHRITT 1: Interaktion ---
    .to("#cursor", { x: -80, y: -40, duration: 0.8 }) // Bewegt sich zum Powerbutton
    .to("#powerbutton", { scale: 0.9, duration: 0.1, transformOrigin: "center" })
    .to("#powerbutton", { scale: 1, duration: 0.1 })
    .to("#cursor", { opacity: 0, duration: 0.3 })

    // --- SCHRITT 2: Stromfluss Vertikal ---
    .to("#line-vertikal", { opacity: 1, duration: 0.05 })
    .to("#line-vertikal", { 
      strokeDashoffset: 0, 
      duration: 2.5, 
      ease: "slow(0.7, 0.7, false)" 
    })

    // STATION 1: Lampe (Birne-Links)
    // Erscheint, blitzt kurz auf (Glow), Glow fadet aus
    .to("#birne-links", { opacity: 1, scale: 1.1, duration: 0.4 }, "-=1.8")
    .to("#filter3_d_28_70 feGaussianBlur", { attr: { stdDeviation: 20 }, duration: 0.2 }, "-=1.4")
    .to("#filter3_d_28_70 feGaussianBlur", { attr: { stdDeviation: 0 }, duration: 0.8 })
    .to("#birne-links", { scale: 1, duration: 0.4 }, "-=0.8")

    // STATION 2: Dom
    // Erscheint wenn der Strom unten ankommt
    .to("#dom", { opacity: 1, scale: 1.05, duration: 0.4 }, "-=0.8")
    .to("#filter2_d_28_70 feGaussianBlur", { attr: { stdDeviation: 26 }, duration: 0.2 }, "-=0.5")
    .to("#filter2_d_28_70 feGaussianBlur", { attr: { stdDeviation: 0 }, duration: 0.8 })
    .to("#dom", { scale: 1, duration: 0.4 }, "-=0.4")

    // --- SCHRITT 3: Abzweig Horizontal ---
    .to("#line-horizontal", { opacity: 1, duration: 0.05 }, "-=0.2")
    .to("#line-horizontal", { strokeDashoffset: 0, duration: 0.8 })

    // STATION 3: Leucht-O (Finale)
    .to("#leucht-o", { opacity: 1, scale: 1.1, duration: 0.4 })
    .to("#filter1_d_28_70 feGaussianBlur", { attr: { stdDeviation: 26 }, duration: 0.3 })
    // Hier bleibt ein restlicher Glow (5px) für den "An"-Zustand, wenn gewünscht. 
    // Falls er ganz weg soll, einfach auf 0 setzen:
    .to("#filter1_d_28_70 feGaussianBlur", { attr: { stdDeviation: 5 }, duration: 1 }) 
    .to("#leucht-o", { scale: 1, duration: 0.5 }, "-=1")

    // --- SCHRITT 4: Beruhigung ---
    // Der Stromdraht wird von Gelb zu deinem Orange
    .to(["#line-vertikal", "#line-horizontal"], { 
        stroke: "#D76C2F", 
        duration: 1.5 
    }, "-=0.5");
}

/* =========================================
7. MOBIL HERO (FINAL CLEAN VERSION)
- 1 Demo
- Pause nach Entrance
- smooth & ruhig
========================================= */

function initMobilEntrance() {
const heroContainer = document.querySelector(".hero-graphic");
const touchZone = document.querySelector(".hero-touch-left");

if (!heroContainer || !touchZone || window.innerWidth >= 768) return;

gsap.set(
["#dom-mobil", "#leucht-o-mobil", "#leitung-mobil", "#cursor-mobil", "#powerbutton-mobil"],
{ autoAlpha: 0, visibility: "visible" }
);

gsap.set("#dom-mobil", {
scale: 0.8,
transformOrigin: "center bottom"
});

gsap.set("#leitung-mobil", {
strokeDasharray: 2000,
strokeDashoffset: 2000
});

gsap.set("#cursor-mobil", { x: 40, y: 40 });

const tl = gsap.timeline({
delay: 0.5,
onComplete: () => {
// 🔥 PAUSE NACH ENTRANCE
gsap.delayedCall(1.0, () => {
const demo = runMiniDemo();

if (demo) {
demo.eventCallback("onComplete", () => {
initMobilInteractions(touchZone);
});
} else {
initMobilInteractions(touchZone);
}
});
}
});

tl.to("#cursor-mobil", {
autoAlpha: 1,
x: 0,
y: 0,
duration: 0.5,
ease: "power2.out"
})
.to("#powerbutton-mobil", {
autoAlpha: 1,
duration: 0.25
})
.to("#powerbutton-mobil", {
scale: 0.9,
duration: 0.2,
ease: "power2.inOut",
yoyo: true,
repeat: 1
})
.to("#leitung-mobil", {
autoAlpha: 1,
strokeDashoffset: 0,
duration: 1.3,
ease: "power1.out"
}, "-=0.1")
.to("#dom-mobil", {
autoAlpha: 1,
scale: 1,
duration: 0.9,
ease: "back.out(1.6)"
}, "-=0.8")
.to("#leucht-o-mobil", {
autoAlpha: 1,
filter: "drop-shadow(0 0 25px #fd9015)",
duration: 0.45,
ease: "power2.out"
}, "-=0.5");
}

/* ==========================================================================
   MOBILE MASTER CONTROL (Full Version)
   ========================================================================== */

/**
 * Startet die einmalige Demo-Animation
 */
function runMiniDemo() {
    const cursor = document.querySelector("#cursor-mobil");
    const button = document.querySelector("#powerbutton-mobil");
    const dom = document.querySelector("#dom-mobil");

    if (!cursor || !button || !dom) return null;

    const tl = gsap.timeline();
    tl.to(cursor, {
        scale: 1.16,
        duration: 0.32,
        ease: "power2.out"
    })
    .to(cursor, {
        x: 8,
        y: 6,
        duration: 1.2,
        ease: "power2.inOut"
    })
    .to(button, {
        scale: 0.9,
        duration: 0.16,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    }, "<")
    .to(dom, {
        scale: 1.3,
        duration: 0.75,
        ease: "back.out(1.45)",
        filter: "brightness(1.45) drop-shadow(0 0 24px #fd9015)"
    }, "<+0.08")
    .to(cursor, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "power2.inOut"
    }, "-=0.2");

    return tl;
}

/**
 * Initialisiert die gesamte Interaktions-Logik
 */
function initMobilInteractions(touchZone) {
    // 1. DOM-Elemente abgreifen
    const dom = document.querySelector("#dom-mobil");
    const btn = document.querySelector("#powerbutton-mobil");
    const cursor = document.querySelector("#cursor-mobil");
    const line = document.querySelector("#leitung-mobil");
    const glowO = document.querySelector("#leucht-o-mobil");

    if (!dom || !btn || !cursor || !touchZone || !line) return;

    // 2. Lokaler State
    let growthLevel = 0;
    let pressTimer = null;
    let startDelayTimer = null;
    let pointerIsDown = false;
    let holdStarted = false;
    const HOLD_DELAY = 180;

    // 3. Hint-Animation (Dezentes Atmen & Cursor-Wackeln)
    const hintTl = gsap.timeline({ repeat: -1 });
    hintTl
        .to(btn, {
            scale: 1.05,
            filter: "drop-shadow(0 0 8px #fd9015)",
            duration: 0.8,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut"
        })
        .to(cursor, {
            x: 3,
            y: -2,
            duration: 0.18,
            yoyo: true,
            repeat: 3
        }, 0);

    // 4. Tap Feedback (Kurzer Impuls beim Antippen)
    function playTapFeedback() {
        // Button-Animation
        gsap.timeline()
            .to(btn, { scale: 0.92, duration: 0.12, ease: "power2.out" })
            .to(btn, { scale: 1, duration: 0.18, ease: "power2.out" });

        // Leitungsimpuls (Steel Blue für High-End Optik)
        gsap.timeline()
            .to("#line-horizontal-mobil, #line-vertikal-mobil", {
                stroke: "#B0C4DE",
                duration: 0.15,
                ease: "power2.out"
            })
            .to("#leitung-mobil", {
                scale: 1.03,
                transformOrigin: "center center",
                duration: 0.2
            }, "<")
            .to("#line-horizontal-mobil, #line-vertikal-mobil", {
                stroke: "#D76C2F",
                duration: 0.4
            });

        // Leucht-O Impuls
     if (glowO) {
    gsap.timeline()
        .to(glowO, { 
            scale: 1.1, 
            opacity: 1, 
            filter: "drop-shadow(0 0 35px #fd9015) brightness(1.2)", 
            duration: 0.3, 
            ease: "power2.out" 
        })
        .to(glowO, { 
            scale: 1, 
            filter: "drop-shadow(0 0 15px #fd9015)", // Bleibt nach dem Finale leicht glühend
            duration: 0.5, 
            ease: "power2.out" 
        });
}

        // Kurzes Aufblinken des Doms
        gsap.to(dom, { opacity: 0.6, duration: 0.16, yoyo: true, repeat: 1 });
    }

    // 5. Wachstum-Logik (Stufenweises Aufblasen)
    function growDom() {
        if (growthLevel >= 4) return;
        growthLevel++;

        gsap.to(dom, {
            scale: 1 + (growthLevel * 0.28),
            duration: 0.4,
            ease: "power2.out"
        });

        // MAXIMALES LEVEL ERREICHT (Das Finale)
        if (growthLevel === 4) {
            clearInterval(pressTimer);

            const domTl = gsap.timeline();
            domTl.to(dom, {
                scale: "+=0.10",
                filter: "brightness(1.3) drop-shadow(0 0 35px #fd9015)",
                duration: 0.5,
                ease: "power2.out"
            })
            .to(dom, {
                filter: "brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))",
                scale: "-=0.03",
                duration: 1.0,
                ease: "power2.inOut"
            });

            // Finale Leitungs-Aufladung (Dezenter Schimmer)
            gsap.timeline()
                .to("#line-horizontal-mobil, #line-vertikal-mobil", {
                    stroke: "#B0C4DE",
                    duration: 0.2
                })
                .to(line, {
                    filter: "drop-shadow(0 0 8px rgba(176,196,222,0.6))",
                    duration: 0.3
                }, "<")
                .to("#line-horizontal-mobil, #line-vertikal-mobil", {
                    stroke: "#D76C2F",
                    duration: 0.6
                })
                .to(line, { filter: "none", duration: 0.6 }, "<");
        }
    }

    // 6. Reset (Wenn Finger losgelassen wird)
    function resetDom() {
        pointerIsDown = false;
        clearTimeout(startDelayTimer);
        clearInterval(pressTimer);

        if (!holdStarted) {
            hintTl.restart();
            return;
        }

        // Alles weich auf Startwerte zurückfahren
        gsap.to(dom, {
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            filter: "none",
            onComplete: () => {
                growthLevel = 0;
                holdStarted = false;
                hintTl.restart();
            }
        });

        gsap.to("#line-horizontal-mobil, #line-vertikal-mobil", {
            stroke: "#D76C2F",
            duration: 0.3
        });
        gsap.to(line, { filter: "none", duration: 0.3 });

        if (glowO) {
            gsap.to(glowO, { scale: 1, opacity: 1, duration: 0.2 });
        }
    }

    // 7. Start-Phase
    function beginGrowth() {
        if (!pointerIsDown) return;
        holdStarted = true;
        hintTl.pause();
        growDom();
        // Alle 450ms eine Stufe wachsen lassen
        pressTimer = setInterval(growDom, 450);
    }

    // 8. Event Listener (Pointer für Touch & Maus)
    touchZone.addEventListener("pointerdown", (e) => {
        pointerIsDown = true;
        holdStarted = false;
        playTapFeedback();
        // Verzögerung, bevor das "Halten" als Wachstum zählt
        startDelayTimer = setTimeout(beginGrowth, HOLD_DELAY);
    }, { passive: true });

    window.addEventListener("pointerup", resetDom);
    window.addEventListener("pointercancel", resetDom);
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
