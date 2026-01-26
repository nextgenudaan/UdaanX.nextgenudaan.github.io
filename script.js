// UdaanX Technology Portal - Enhanced Interactive Behaviors

// ================================================================
// THEME SYSTEM - Day/Night Toggle
// ================================================================

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');

        // Save preference
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);

        // Optional: Add haptic feedback effect
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 100);
    });
}

// Auto theme based on time (optional enhancement)
function autoThemeByTime() {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    // Only auto-set if user hasn't manually chosen
    if (!localStorage.getItem('theme')) {
        if (isDaytime && !document.body.classList.contains('light-theme')) {
            document.body.classList.add('light-theme');
        } else if (!isDaytime && document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
        }
    }
}

// Run once on load
autoThemeByTime();

// Check every hour
setInterval(autoThemeByTime, 3600000);

// ================================================================
// GALLERY SYSTEM - Image/Video Upload & Management
// ================================================================

const galleryGrid = document.getElementById('gallery-grid');
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
let galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];

// Click to upload
if (uploadZone) {
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
}

// Drag and drop functionality
if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary)';
        uploadZone.style.background = 'rgba(0, 212, 255, 0.1)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = 'var(--border-color)';
        uploadZone.style.background = 'var(--bg-glass)';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--border-color)';
        uploadZone.style.background = 'var(--bg-glass)';

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
}

// File input change
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
        fileInput.value = ''; // Reset input
    });
}

// Handle uploaded files
function handleFiles(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const itemData = {
                    id: Date.now() + Math.random(),
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    src: e.target.result,
                    name: file.name
                };

                galleryItems.push(itemData);
                localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
                addGalleryItem(itemData);
            };

            reader.readAsDataURL(file);
        }
    });
}

// Add gallery item to DOM
function addGalleryItem(item) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-id', item.id);

    if (item.type === 'image') {
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.name}" loading="lazy">
            <button class="delete-btn" onclick="deleteGalleryItem(${item.id})">✕</button>
        `;
    } else {
        galleryItem.innerHTML = `
            <video src="${item.src}" muted loop playsinline></video>
            <button class="delete-btn" onclick="deleteGalleryItem(${item.id})">✕</button>
        `;

        // Play video on hover
        const video = galleryItem.querySelector('video');
        galleryItem.addEventListener('mouseenter', () => video.play());
        galleryItem.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }

    // Insert before upload zone
    const placeholder = galleryGrid.querySelector('.gallery-placeholder');
    galleryGrid.insertBefore(galleryItem, placeholder);

    // Animate in
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'scale(0.8)';
    setTimeout(() => {
        galleryItem.style.transition = 'all 0.3s ease';
        galleryItem.style.opacity = '1';
        galleryItem.style.transform = 'scale(1)';
    }, 10);
}

// Delete gallery item
function deleteGalleryItem(id) {
    galleryItems = galleryItems.filter(item => item.id !== id);
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));

    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => item.remove(), 300);
    }
}

// Make delete function global
window.deleteGalleryItem = deleteGalleryItem;

// Load existing gallery items
function loadGalleryItems() {
    galleryItems.forEach(item => addGalleryItem(item));
}

// Load gallery on page load
if (galleryGrid) {
    loadGalleryItems();
}

// ================================================================
// SMOOTH SCROLLING & NAVIGATION
// ================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
});

// ================================================================
// MOBILE MENU
// ================================================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// ================================================================
// NAVBAR SCROLL EFFECT
// ================================================================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = document.body.classList.contains('light-theme')
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(10, 14, 26, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = document.body.classList.contains('light-theme')
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(10, 14, 26, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ================================================================
// INTERSECTION OBSERVER - Scroll Animations
// ================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateOnScroll = document.querySelectorAll('.product-card, .why-card, .tech-category, .timeline-item, .stat-card, .gallery-item');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ================================================================
// PARALLAX EFFECT - Hero Orbs
// ================================================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.glow-orb');

    orbs.forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ================================================================
// PRODUCT CARD SPOTLIGHT EFFECT
// ================================================================

const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ================================================================
// ANIMATED COUNTERS - Stats
// ================================================================

const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const isPercentage = element.textContent.includes('%');
    const hasPlus = element.textContent.includes('+');

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        let displayValue = Math.floor(current);
        if (isPercentage) displayValue += '%';
        if (hasPlus) displayValue += '+';
        if (element.textContent.includes('/')) displayValue = `${displayValue}/7`;

        element.textContent = displayValue;
    }, 16);
};

// Trigger counter animation when stats come into view
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            entry.target.textContent = '0';
            animateCounter(entry.target, number);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statObserver.observe(stat));

// ================================================================
// PAGE LOAD ANIMATION
// ================================================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ================================================================
// CONSOLE BRANDING
// ================================================================

console.log('%c🚀 UdaanX Technology Portal', 'font-size: 20px; font-weight: bold; color: #00d4ff;');
console.log('%cBuilt with modern web standards', 'font-size: 12px; color: #94a3b8;');
console.log('%cVisit: udaanx.nextgenudaan.in', 'font-size: 12px; color: #00ff88;');

// ================================================================
// LIGHTBOX SYSTEM - Larger View for Gallery
// ================================================================

const lightbox = document.getElementById('lightbox');
const lightboxMediaContainer = document.getElementById('lightbox-media-container');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// Open Lightbox
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const media = item.querySelector('img, video');
        const captionElement = item.querySelector('.gallery-caption');
        const caption = captionElement ? captionElement.textContent : '';

        lightboxMediaContainer.innerHTML = '';

        if (media.tagName === 'IMG') {
            const newImg = document.createElement('img');
            newImg.src = media.src;
            newImg.alt = media.alt;
            lightboxMediaContainer.appendChild(newImg);
        } else if (media.tagName === 'VIDEO') {
            const newVideo = document.createElement('video');
            newVideo.src = media.src;
            newVideo.controls = true;
            newVideo.autoplay = true;
            newVideo.muted = true; // Always muted as requested
            newVideo.playsInline = true;
            lightboxMediaContainer.appendChild(newVideo);
        }

        if (lightboxCaption) lightboxCaption.textContent = caption;
        if (lightbox) lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    });
});

// Close Lightbox
const closeLightbox = () => {
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Stop any video playing in lightbox
    const video = lightboxMediaContainer.querySelector('video');
    if (video) {
        video.pause();
        video.src = ''; // Clear source to stop fully
        video.load();
    }
};

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

// Close on background click
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });
}

// Close on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

console.log('🖼️ Lightbox system initialized');
