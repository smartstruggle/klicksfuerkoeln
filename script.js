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

  /* =========================================
   INTERACTIONS (Premium, Steel Blue & Stable)
   ========================================= */

function initMobilInteractions(touchZone) {
    const dom = document.querySelector("#dom-mobil");
    const btn = document.querySelector("#powerbutton-mobil");
    const cursor = document.querySelector("#cursor-mobil");
    const line = document.querySelector("#leitung-mobil");
    const glowO = document.querySelector("#leucht-o-mobil");

    if (!dom || !btn || !cursor || !touchZone || !line) return;

    // Lokaler State
    let growthLevel = 0;
    let pressTimer = null;
    let startDelayTimer = null;
    let pointerIsDown = false;
    let holdStarted = false;
    let isAnimatingFinal = false; // Sperre, damit das Finale nicht unterbrochen wird
    const HOLD_DELAY = 180;

    // 1. Hint-Animation (Sanftes Atmen)
    const hintTl = gsap.timeline({ repeat: -1 });
    hintTl.to(btn, { scale: 1.05, filter: "drop-shadow(0 0 8px #fd9015)", duration: 0.8, yoyo: true, repeat: 1, ease: "sine.inOut" })
          .to(cursor, { x: 3, y: -2, duration: 0.18, yoyo: true, repeat: 3 }, 0);

    // 2. Tap Feedback (Kurzer Impuls)
    function playTapFeedback() {
        if (isAnimatingFinal) return;
        
        gsap.timeline()
            .to(btn, { scale: 0.92, duration: 0.12, ease: "power2.out" })
            .to(btn, { scale: 1, duration: 0.18, ease: "power2.out" });

        gsap.timeline()
            .to("#line-horizontal-mobil, #line-vertikal-mobil", { stroke: "#B0C4DE", duration: 0.15 })
            .to("#leitung-mobil", { scale: 1.03, transformOrigin: "center center", duration: 0.2 }, "<")
            .to("#line-horizontal-mobil, #line-vertikal-mobil", { stroke: "#D76C2F", duration: 0.4 });

        if (glowO) {
            gsap.timeline()
                .to(glowO, { opacity: 1, scale: 1.05, filter: "drop-shadow(0 0 15px #fd9015)", duration: 0.22 })
                .to(glowO, { scale: 1, duration: 0.32 });
        }
    }

    // 3. Wachstum-Logik
    function growDom() {
        if (growthLevel >= 4 || isAnimatingFinal) return;
        growthLevel++;

        gsap.to(dom, {
            scale: 1 + (growthLevel * 0.28),
            duration: 0.4,
            ease: "power2.out"
        });

        if (growthLevel === 4) {
            isAnimatingFinal = true; 
            clearInterval(pressTimer);

            const finalTl = gsap.timeline();

            // A) Dom Finale
            finalTl.to(dom, {
                scale: "+=0.10",
                filter: "brightness(1.3) drop-shadow(0 0 35px #fd9015)",
                duration: 0.5,
                ease: "power2.out"
            }, 0)
            .to(dom, {
                filter: "none",
                scale: "-=0.03",
                duration: 1.0,
                ease: "power2.inOut"
            }, 0.5);

            // B) Leitung Finale (Steel Blue Schimmer)
            finalTl.to("#line-horizontal-mobil, #line-vertikal-mobil", { stroke: "#B0C4DE", duration: 0.2 }, 0)
                   .to(line, { filter: "drop-shadow(0 0 8px rgba(176,196,222,0.6))", duration: 0.3 }, 0)
                   .to("#line-horizontal-mobil, #line-vertikal-mobil", { stroke: "#D76C2F", duration: 0.6 }, 0.5)
                   .to(line, { filter: "none", duration: 0.6 }, 0.5);

            // C) Leucht-O Finale (Hochwertiger Glow)
            if (glowO) {
                finalTl.to(glowO, { 
                    scale: 1.15, 
                    filter: "drop-shadow(0 0 35px #fd9015) brightness(1.2)", 
                    duration: 0.4 
                }, 0)
                .to(glowO, { 
                    scale: 1, 
                    filter: "drop-shadow(0 0 15px #fd9015)", 
                    duration: 0.8,
                    ease: "power2.inOut"
                }, 0.4);
            }
        }
    }

    // 4. Reset-Logik
    function resetDom() {
        pointerIsDown = false;
        clearTimeout(startDelayTimer);
        clearInterval(pressTimer);

        if (!holdStarted) {
            hintTl.restart();
            return;
        }

        // Wir fahren den Dom immer sanft zurück
        gsap.to(dom, {
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            filter: "none",
            onComplete: () => {
                growthLevel = 0;
                holdStarted = false;
                isAnimatingFinal = false; // Sperre erst hier aufheben
                hintTl.restart();
            }
        });

        // Leitung & O nur zurücksetzen, wenn das Finale NICHT gerade läuft
        if (!isAnimatingFinal) {
            gsap.to("#line-horizontal-mobil, #line-vertikal-mobil", { stroke: "#D76C2F", duration: 0.3 });
            gsap.to(line, { filter: "none", duration: 0.3 });
            if (glowO) gsap.to(glowO, { filter: "none", duration: 0.3 });
        }
    }

    // 5. Start-Phase
    function beginGrowth() {
        if (!pointerIsDown || isAnimatingFinal) return;
        holdStarted = true;
        hintTl.pause();
        growDom();
        pressTimer = setInterval(growDom, 450);
    }

    // Event Listener
    touchZone.addEventListener("pointerdown", (e) => {
        if (isAnimatingFinal) return;
        pointerIsDown = true;
        holdStarted = false;
        playTapFeedback();
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

