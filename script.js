// ===========================
// SMOOTH ANIMATIONS & INTERACTIONS
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeLinkCards();
    initializeParallax();
    initializeCursorEffect();
});

// ===========================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ===========================

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.link-card, .profile-section, .footer');
    animatedElements.forEach(el => observer.observe(el));
}

// ===========================
// ENHANCED LINK CARD INTERACTIONS
// ===========================

function initializeLinkCards() {
    const linkCards = document.querySelectorAll('.link-card');

    linkCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            createRipple(e, this);
        });

        // Add magnetic effect on hover
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            const icon = this.querySelector('.link-icon');
            const arrow = this.querySelector('.link-arrow');

            if (icon) {
                icon.style.transform = `translate(${deltaX * 5}px, ${deltaY * 5}px) rotate(5deg) scale(1.1)`;
            }
            if (arrow) {
                arrow.style.transform = `translateX(${8 + deltaX * 3}px)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.link-icon');
            const arrow = this.querySelector('.link-arrow');

            if (icon) {
                icon.style.transform = '';
            }
            if (arrow) {
                arrow.style.transform = '';
            }
        });
    });
}

// ===========================
// RIPPLE EFFECT
// ===========================

function createRipple(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        opacity: 1;
        animation: rippleEffect 0.6s ease-out;
        z-index: 0;
    `;

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to stylesheet dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// PARALLAX SCROLLING EFFECT
// ===========================

function initializeParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                applyParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function applyParallax() {
    const scrolled = window.pageYOffset;
    const profileSection = document.querySelector('.profile-section');
    const grainOverlay = document.querySelector('.grain-overlay');

    if (profileSection) {
        profileSection.style.transform = `translateY(${scrolled * 0.3}px)`;
        profileSection.style.opacity = 1 - (scrolled / 500);
    }

    if (grainOverlay) {
        grainOverlay.style.transform = `translateY(${scrolled * -0.1}px)`;
    }
}

// ===========================
// CUSTOM CURSOR EFFECT
// ===========================

function initializeCursorEffect() {
    // Only apply on desktop devices
    if (window.innerWidth < 768) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'custom-cursor-follower';
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;

        followerX += dx * 0.1;
        followerY += dy * 0.1;

        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('.link-card, .avatar-wrapper');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });

    // Add cursor styles
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor,
        .custom-cursor-follower {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.2s ease;
        }

        .custom-cursor {
            width: 8px;
            height: 8px;
            background: white;
            transform: translate(-50%, -50%);
        }

        .custom-cursor-follower {
            width: 32px;
            height: 32px;
            border: 2px solid rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease;
        }

        .custom-cursor.cursor-hover {
            transform: translate(-50%, -50%) scale(0.5);
        }

        .custom-cursor-follower.cursor-hover {
            width: 64px;
            height: 64px;
            border-color: rgba(255, 68, 68, 0.8);
        }

        body {
            cursor: none;
        }

        a, button {
            cursor: none;
        }

        @media (max-width: 768px) {
            .custom-cursor,
            .custom-cursor-follower {
                display: none;
            }

            body, a, button {
                cursor: auto;
            }
        }
    `;
    document.head.appendChild(cursorStyle);
}

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================

// Lazy load images if any are added
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================
// KEYBOARD NAVIGATION ENHANCEMENT
// ===========================

document.addEventListener('keydown', (e) => {
    // Escape key to blur focused element
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// ===========================
// CONSOLE EASTER EGG
// ===========================

console.log('%c🔥 DARK & GRITTY 🔥', 'font-size: 24px; font-weight: bold; color: #ff4444; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cLooking for something?', 'font-size: 14px; color: #a0a0a0;');
console.log('%cThis site was crafted with precision and passion.', 'font-size: 12px; color: #666;');
