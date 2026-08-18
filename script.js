/* ============================================
   GREENWOOD ACADEMY - INTERACTIVE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ---------- Mobile Navigation Toggle ---------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ---------- Sticky Navbar on Scroll ---------- */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (backToTop) {
            if (scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        updateActiveNavLink();
        animateStatsOnScroll();
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    /* ---------- Back to Top Button ---------- */
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ---------- Active Nav Link on Scroll ---------- */
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

            if (activeLink) {
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(function (l) { l.classList.remove('active'); });
                    activeLink.classList.add('active');
                }
            }
        });
    }

    /* ---------- Hero Carousel ---------- */
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.dot');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (index >= heroSlides.length) { currentSlide = 0; }
        if (index < 0) { currentSlide = heroSlides.length - 1; }

        heroSlides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === currentSlide);
        });

        sliderDots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    if (heroSlides.length > 0) {
        if (prevSlideBtn) prevSlideBtn.addEventListener('click', function () { prevSlide(); stopSlideShow(); startSlideShow(); });
        if (nextSlideBtn) nextSlideBtn.addEventListener('click', function () { nextSlide(); stopSlideShow(); startSlideShow(); });

        sliderDots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                stopSlideShow();
                startSlideShow();
            });
        });

        startSlideShow();

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopSlideShow);
            heroSection.addEventListener('mouseleave', startSlideShow);
        }
    }

    /* ---------- Programs Tab Switcher ---------- */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetTab = btn.getAttribute('data-tab');

                tabButtons.forEach(function (b) { b.classList.remove('active'); });
                tabContents.forEach(function (c) { c.classList.remove('active'); });

                btn.classList.add('active');
                const activeContent = document.getElementById(targetTab);
                if (activeContent) activeContent.classList.add('active');
            });
        });
    }

    /* ---------- Animated Number Counters ---------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStatsOnScroll() {
        if (statsAnimated || statNumbers.length === 0) return;

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.85) {
            statsAnimated = true;
            statNumbers.forEach(function (stat) {
                const target = parseInt(stat.getAttribute('data-target'), 10);
                const duration = 2000;
                const start = 0;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(start + (target - start) * easeOut);

                    if (target >= 90 && target <= 100) {
                        stat.textContent = current + (progress === 1 ? '%' : '');
                    } else {
                        stat.textContent = current.toLocaleString();
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
            });
        }
    }

    /* ---------- Testimonials Slider ---------- */
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testi-dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        if (index >= testimonialCards.length) { currentTestimonial = 0; }
        if (index < 0) { currentTestimonial = testimonialCards.length - 1; }

        testimonialCards.forEach(function (card, i) {
            card.classList.toggle('active', i === currentTestimonial);
        });

        testimonialDots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentTestimonial);
        });
    }

    function nextTestimonial() {
        showTestimonial(currentTestimonial + 1);
    }

    if (testimonialCards.length > 0) {
        testimonialDots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showTestimonial(index);
                clearInterval(testimonialInterval);
                testimonialInterval = setInterval(nextTestimonial, 7000);
            });
        });

        testimonialInterval = setInterval(nextTestimonial, 7000);
    }

    /* ---------- Form Submissions ---------- */
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    window.closeModal = function () {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('click', function (e) {
            if (e.target === successModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && successModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    const admissionsForm = document.getElementById('admissionsForm');
    if (admissionsForm) {
        admissionsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showSuccessModal();
            admissionsForm.reset();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showSuccessModal();
            contactForm.reset();
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showSuccessModal();
            newsletterForm.reset();
        });
    }

    /* ---------- Smooth Scroll for Anchor Links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight + 1;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ---------- Form Input Placeholder Animations ---------- */
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(function (input) {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });

    /* ---------- Intersection Observer for Reveal Animations ---------- */
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll(
            '.program-card, .news-card, .faculty-card, .event-item, .contact-item, .step, .about-feature'
        );

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    /* ---------- Touch Swipe Support for Hero Carousel ---------- */
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider && heroSlides.length > 0) {
        let touchStartX = 0;
        let touchEndX = 0;

        heroSlider.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSlider.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                stopSlideShow();
                startSlideShow();
            }
        }
    }

    /* ---------- Parallax Effect on Hero (Desktop Only) ---------- */
    const heroBgElements = document.querySelectorAll('.hero-bg');
    if (heroBgElements.length > 0 && window.innerWidth > 1024) {
        window.addEventListener('scroll', function () {
            const scrollPos = window.scrollY;
            if (scrollPos < 800) {
                heroBgElements.forEach(function (bg) {
                    bg.style.transform = 'translateY(' + (scrollPos * 0.3) + 'px)';
                });
            }
        });
    }
});
