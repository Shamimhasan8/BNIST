// Modern JavaScript for BNIST Website

// Global variables
let isScrolling = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeForms();
    initializeAnimations();
    initializeScrollToTop();
    console.log('BNIST Website initialized successfully');
});

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Navigation Functions
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('.header');
    
    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Also handle touch events for mobile devices
        document.addEventListener('touchstart', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }, {passive: true});
    }
    
    // Header scroll effect with better performance
    if (header) {
        let lastScrollTop = 0;
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    if (scrollTop > 100) {
                        header.style.background = 'rgba(255, 255, 255, 0.98)';
                        header.style.backdropFilter = 'blur(15px)';
                        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                    } else {
                        header.style.background = 'rgba(255, 255, 255, 0.95)';
                        header.style.backdropFilter = 'blur(10px)';
                        header.style.boxShadow = 'none';
                    }
                    
                    lastScrollTop = scrollTop;
                    ticking = false;
                });
                
                ticking = true;
            }
        }, {passive: true});
    }
}

// Smooth Scroll Function
function scrollToSection(sectionId) {
    if (isScrolling) return;
    
    const section = document.getElementById(sectionId);
    if (!section) {
        console.warn(`Section with id "${sectionId}" not found`);
        return;
    }
    
    isScrolling = true;
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Reset scrolling flag after animation
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// Scroll Effects
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll(
        '.feature-card, .program-card, .step-card, .contact-card, .section-header'
    );
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(2rem)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(element);
    });
    
    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        if (isScrolling) return;
        
        let current = '';
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Form Handling
function initializeForms() {
    initializeApplicationForm();
    initializeContactForm();
}

function initializeApplicationForm() {
    const form = document.getElementById('applicationForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(form, 'application');
    });
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(form, 'contact');
    });
}

function handleFormSubmission(form, formType) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    const validation = validateForm(data, formType);
    if (!validation.isValid) {
        showFormMessage(form, validation.message, 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('.form-submit');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
            <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.4-6.4l-2.8 2.8M9.4 9.4L6.6 6.6m12.8 12.8l-2.8-2.8M9.4 14.6l-2.8 2.8"/>
        </svg>
        Processing...
    `;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Show success message
        const successMessage = formType === 'application' 
            ? 'Application submitted successfully! We\'ll contact you soon.'
            : 'Message sent successfully! We\'ll get back to you soon.';
        
        showFormMessage(form, successMessage, 'success');
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            hideFormMessage(form);
        }, 3000);
        
        // Log form submission (for analytics)
        console.log(`${formType} form submitted:`, data);
        
    }, 2000);
}

function validateForm(data, formType) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    // Common validations
    if (!data.email || !emailRegex.test(data.email)) {
        return { isValid: false, message: 'Please enter a valid email address.' };
    }
    
    if (formType === 'application') {
        if (!data.fullName || data.fullName.trim().length < 2) {
            return { isValid: false, message: 'Please enter your full name.' };
        }
        
        if (!data.phone || !phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
            return { isValid: false, message: 'Please enter a valid phone number.' };
        }
        
        if (!data.program) {
            return { isValid: false, message: 'Please select a program.' };
        }
    }
    
    if (formType === 'contact') {
        if (!data.contactName || data.contactName.trim().length < 2) {
            return { isValid: false, message: 'Please enter your name.' };
        }
        
        if (!data.contactSubject || data.contactSubject.trim().length < 3) {
            return { isValid: false, message: 'Please enter a subject.' };
        }
        
        if (!data.contactMessage || data.contactMessage.trim().length < 10) {
            return { isValid: false, message: 'Please enter a message (at least 10 characters).' };
        }
    }
    
    return { isValid: true, message: '' };
}

function showFormMessage(form, message, type) {
    const messageContainer = form.querySelector('.form-message');
    if (!messageContainer) return;
    
    messageContainer.textContent = message;
    messageContainer.className = `form-message ${type}`;
    messageContainer.style.display = 'flex';
    
    // Add icon based on type
    const icon = type === 'success' 
        ? '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>'
        : '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    
    messageContainer.innerHTML = `${icon} ${message}`;
}

function hideFormMessage(form) {
    const messageContainer = form.querySelector('.form-message');
    if (messageContainer) {
        messageContainer.style.display = 'none';
    }
}

// Animation Utilities
function initializeAnimations() {
    // Add CSS for spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .nav-link.active {
            color: var(--primary);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const heroImage = hero.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
        });
    }
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.program-card, .feature-card, .step-card, .contact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const debouncedScroll = debounce(function() {
    // Any scroll-based functionality can go here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
});

// Accessibility improvements
function improveAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.id = 'main';
    }
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Export functions for global use (if needed)
window.scrollToSection = scrollToSection;