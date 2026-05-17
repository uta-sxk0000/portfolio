/* =========================================================
   Premium Portfolio Interactions
   Loading screen, typing effect, scroll progress, active nav,
   project filters, cursor glow, tilt cards, and particles.
   ========================================================= */

const body = document.body;
const loader = document.querySelector("#loader");
const scrollProgress = document.querySelector("#scrollProgress");
const cursorDot = document.querySelector("#cursorDot");
const cursorGlow = document.querySelector("#cursorGlow");
const navToggle = document.querySelector("#navToggle");
const navMenu = document.querySelector("#navMenu");
const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const particleCanvas = document.querySelector("#particleCanvas");
const tiltCards = document.querySelectorAll(".tilt-card");
const magneticButtons = document.querySelectorAll(".magnetic");
const skillTags = document.querySelectorAll("[data-level]");
const commandPalette = document.querySelector("#commandPalette");
const commandSearch = document.querySelector("#commandSearch");
const commandButtons = document.querySelectorAll("#commandList button");
const commandOpenButtons = document.querySelectorAll("#commandOpen, #heroCommandOpen");
const commandCloseButtons = document.querySelectorAll("[data-command-close]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

body.classList.add("reveal-enabled");
document.querySelectorAll(".hero .reveal").forEach((item) => item.classList.add("visible"));
skillTags.forEach((tag) => tag.style.setProperty("--skill-level", tag.dataset.level));

const hideLoader = () => {
    loader.classList.add("hidden");
};

window.setTimeout(hideLoader, 900);
window.addEventListener("load", () => {
    window.setTimeout(() => {
        hideLoader();
    }, 250);
});

// Mobile navigation.
navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
});

// Smooth same-page navigation.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (targetId === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", targetId);

        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
    });
});

const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;
    header.classList.toggle("scrolled", window.scrollY > 12);

    let activeId = "home";
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
};

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });

// Scroll reveal.
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => {
        if (!item.classList.contains("visible")) {
            revealObserver.observe(item);
        }
    });
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}

// Project filters.
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
            const categories = card.dataset.category || "";
            const shouldShow = filter === "all" || categories.includes(filter);
            card.classList.toggle("hidden", !shouldShow);
        });
    });
});

// Contact form demo.
contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thanks. This demo form is ready to connect to Formspree, Netlify Forms, or a backend later.";
    contactForm.reset();
});

// Placeholder link notice.
document.querySelectorAll(".placeholder-link").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        alert("This preview link is a placeholder. Replace it with a real deployed project URL in index.html.");
    });
});

// Special feature: command palette for fast recruiter navigation.
const openCommandPalette = () => {
    commandPalette.classList.add("open");
    commandPalette.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");
    commandSearch.value = "";
    commandButtons.forEach((button) => button.classList.remove("hidden"));
    window.setTimeout(() => commandSearch.focus(), 50);
};

const closeCommandPalette = () => {
    commandPalette.classList.remove("open");
    commandPalette.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
};

commandOpenButtons.forEach((button) => {
    button.addEventListener("click", openCommandPalette);
});

commandCloseButtons.forEach((button) => {
    button.addEventListener("click", closeCommandPalette);
});

commandSearch.addEventListener("input", () => {
    const query = commandSearch.value.trim().toLowerCase();

    commandButtons.forEach((button) => {
        const matches = button.textContent.toLowerCase().includes(query);
        button.classList.toggle("hidden", !matches);
    });
});

commandButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const command = button.dataset.command;
        const target = button.dataset.target;

        closeCommandPalette();

        if (command === "scroll") {
            document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
            history.pushState(null, "", target);
            return;
        }

        if (command === "link") {
            if (target === "resume.pdf") {
                window.location.href = target;
            } else {
                window.open(target, "_blank", "noopener");
            }
        }
    });
});

window.addEventListener("keydown", (event) => {
    const isCommandShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

    if (isCommandShortcut) {
        event.preventDefault();
        openCommandPalette();
    }

    if (event.key === "Escape" && commandPalette.classList.contains("open")) {
        closeCommandPalette();
    }
});

// Cursor glow.
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
        const x = `${event.clientX}px`;
        const y = `${event.clientY}px`;

        cursorDot.style.left = x;
        cursorDot.style.top = y;
        cursorGlow.style.left = x;
        cursorGlow.style.top = y;
    }, { passive: true });
}

// 3D tilt effect for premium cards.
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    tiltCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -7;
            const rotateY = ((x / rect.width) - 0.5) * 7;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });

    magneticButtons.forEach((button) => {
        button.addEventListener("pointermove", (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
        });

        button.addEventListener("pointerleave", () => {
            button.style.transform = "";
        });
    });
}

// Animated particle background.
if (particleCanvas && !prefersReducedMotion) {
    const context = particleCanvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = 0;

    const createParticles = () => {
        const count = Math.min(90, Math.max(38, Math.floor(window.innerWidth / 22)));

        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.32,
            vy: (Math.random() - 0.5) * 0.32,
            size: Math.random() * 1.8 + 0.7
        }));
    };

    const resizeCanvas = () => {
        const pixelRatio = window.devicePixelRatio || 1;

        width = window.innerWidth;
        height = window.innerHeight;
        particleCanvas.width = Math.floor(width * pixelRatio);
        particleCanvas.height = Math.floor(height * pixelRatio);
        particleCanvas.style.width = `${width}px`;
        particleCanvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        createParticles();
    };

    const drawParticles = () => {
        context.clearRect(0, 0, width, height);

        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -1;
            }

            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -1;
            }

            context.beginPath();
            context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            context.fillStyle = "rgba(34, 211, 238, 0.55)";
            context.fill();

            for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
                const next = particles[nextIndex];
                const dx = particle.x - next.x;
                const dy = particle.y - next.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    context.beginPath();
                    context.moveTo(particle.x, particle.y);
                    context.lineTo(next.x, next.y);
                    context.strokeStyle = `rgba(59, 130, 246, ${0.16 - distance / 950})`;
                    context.lineWidth = 1;
                    context.stroke();
                }
            }
        });

        animationId = window.requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    drawParticles();

    window.addEventListener("resize", () => {
        window.cancelAnimationFrame(animationId);
        resizeCanvas();
        drawParticles();
    });
}
