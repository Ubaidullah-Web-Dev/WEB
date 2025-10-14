// script.js
// make sure this file is saved alongside index.html

// register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

/* -------------------------
   Smooth custom cursor (eased)
   ------------------------- */
const cursorEl = document.getElementById('cursor');
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let pos = { x: mouse.x, y: mouse.y };

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function cursorLoop() {
    pos.x += (mouse.x - pos.x) * 0.18;
    pos.y += (mouse.y - pos.y) * 0.18;
    cursorEl.style.left = pos.x + 'px';
    cursorEl.style.top = pos.y + 'px';
    requestAnimationFrame(cursorLoop);
}
cursorLoop();

// cursor interaction
document.querySelectorAll('a, button, .fancy-card, .gallery-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorEl.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('active'));
});

/* -------------------------
   Progress bar
   ------------------------- */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
    const scrollTop = document.documentElement.scrollTop || window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight <= 0 ? 0 : (scrollTop / docHeight) * 100;
    progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* -------------------------
   Particles
   ------------------------- */
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 90 },
        "color": { "value": ["#00eaff", "#ff00ff", "#ffffff"] },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.55 },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 140, "color": "#00eaff", "opacity": 0.18, "width": 1 },
        "move": { "enable": true, "speed": 1.8 }
    },
    "interactivity": {
        "events": {
            "onhover": { "enable": true, "mode": "repulse" },
            "onclick": { "enable": true, "mode": "push" }
        }
    },
    "retina_detect": true
});

/* -------------------------
   Intro timeline (navbar + hero + button)
   ------------------------- */
const intro = gsap.timeline();
intro.from(".navbar", { y: -80, opacity: 0, duration: 0.9, ease: "power3.out" })
    .from(".hero h1", { scale: 0.7, opacity: 0, duration: 0.9, ease: "back.out(1.4)" }, "-=0.4")
    .from(".hero h2", { y: 20, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.35")
    .from(".hero .btn-custom", { y: 20, opacity: 0, duration: 0.9, ease: "bounce.out" }, "-=0.3");

/* -------------------------
   Typing effect (starts after intro)
   ------------------------- */
const typingEl = document.querySelector('.typing');
const typingWords = ["Creative Developer", "Web Designer", "Animation Enthusiast"];
let tWord = 0, tChar = 0;
function doType() {
    if (!typingEl) return;
    if (tChar <= typingWords[tWord].length) {
        typingEl.textContent = typingWords[tWord].slice(0, tChar++);
        setTimeout(doType, 85);
    } else {
        setTimeout(() => {
            tChar = 0;
            tWord = (tWord + 1) % typingWords.length;
            typingEl.textContent = "";
            doType();
        }, 1500);
    }
}
setTimeout(doType, 1200);

/* -------------------------
   Glitch pulsing: toggle class occasionally
   ------------------------- */
setInterval(() => {
    document.querySelectorAll('.glitch').forEach(el => {
        el.classList.add('glitch-active');
        setTimeout(() => el.classList.remove('glitch-active'), 260);
    });
}, 3800);

/* -------------------------
   Scroll-triggered section reveals (GSAP ScrollTrigger)
   ------------------------- */
gsap.utils.toArray("section:not(#hero)").forEach(sec => {
    gsap.fromTo(sec, { autoAlpha: 0, y: 60 }, {
        duration: 1,
        autoAlpha: 1,
        y: 0,
        ease: "power3.out",
        scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

/* -------------------------
   Card tilt (mouse)
   ------------------------- */
document.querySelectorAll('.tilt, .gallery-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rotateY = (px - 0.5) * 12;
        const rotateX = (0.5 - py) * 10;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* -------------------------
   SVG drawing on scroll
   ------------------------- */
gsap.utils.toArray("svg").forEach(svg => {
    const paths = svg.querySelectorAll("path, rect, circle, line, polyline, polygon");
    paths.forEach(p => {
        try {
            const len = (p.getTotalLength && p.getTotalLength()) || 1000;
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(p, {
                strokeDashoffset: 0,
                duration: 1.6,
                ease: "power1.out",
                scrollTrigger: { trigger: svg, start: "top 85%", toggleActions: "play none none reverse" }
            });
        } catch (e) {
            // ignore non-path elements
        }
    });
});

/* -------------------------
   Horizontal showcase (works after load)
   ------------------------- */
function setupHorizontalGallery() {
    const galleryTrack = document.querySelector('.gallery-track');
    if (!galleryTrack) return;

    // remove previous ScrollTrigger if exists
    ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === "#showcase" || t.trigger && t.trigger.id === "showcase") t.kill();
    });

    const totalWidth = galleryTrack.scrollWidth;
    const viewportWidth = document.documentElement.clientWidth;
    const scrollDistance = totalWidth - viewportWidth + 80; // slight padding

    // guard: if not enough content, do nothing
    if (scrollDistance <= 0) return;

    gsap.to(galleryTrack, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
            trigger: "#showcase",
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 0.7,
            pin: true,
            anticipatePin: 1
        }
    });

    // refresh
    ScrollTrigger.refresh();
}

// run after window load so images have sizes
window.addEventListener('load', () => {
    setupHorizontalGallery();
    // also refresh ScrollTrigger in a moment
    setTimeout(() => ScrollTrigger.refresh(), 200);
});

/* -------------------------
   Navbar highlight (based on scroll)
   ------------------------- */
const navLinks = document.querySelectorAll('.nav-link');
function updateActiveNav() {
    let currentId = 'hero';
    document.querySelectorAll('section[id]').forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 120) currentId = sec.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* -------------------------
   Window resize: re-init gallery
   ------------------------- */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        setupHorizontalGallery();
        ScrollTrigger.refresh();
    }, 250);
});
