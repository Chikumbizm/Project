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
        else if (index < 0) { currentSlide = heroSlides.length - 1; }
        else { currentSlide = index; }

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
        slideInterval = setInterval(nextSlide, 7000);
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

    /* ---------- Events Category Filtering ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const eventItems = document.querySelectorAll('.event-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const selectedFilter = btn.getAttribute('data-filter');

                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                btn.style.background = selectedFilter === 'all' ? 'var(--green-800)' : 'var(--green-800)';
                btn.style.color = '#fff';

                eventItems.forEach(function (item) {
                    const itemCategory = item.getAttribute('data-category');
                    if (selectedFilter === 'all' || itemCategory === selectedFilter) {
                        item.style.display = 'flex';
                        setTimeout(function () {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(function () {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    /* ---------- Add to Calendar Functionality ---------- */
    const addToCalBtns = document.querySelectorAll('.add-to-cal-btn');

    if (addToCalBtns.length > 0) {
        addToCalBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                const title = btn.getAttribute('data-title');
                const date = btn.getAttribute('data-date');
                const time = btn.getAttribute('data-time');
                const endTime = btn.getAttribute('data-end-time');
                const location = btn.getAttribute('data-location');

                showCalendarOptions(title, date, time, endTime, location);
            });
        });
    }

    function showCalendarOptions(title, date, time, endTime, location) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center;';
        
        const content = document.createElement('div');
        content.style.cssText = 'background: #fff; border-radius: 14px; padding: 32px; max-width: 400px; text-align: center; box-shadow: 0 24px 60px rgba(18,53,38,0.18);';
        
        content.innerHTML = `
            <h3 style="margin-bottom: 16px; color: var(--green-900); font-size: 1.3rem;">Add to Calendar</h3>
            <p style="color: var(--ink-500); margin-bottom: 24px;">Choose your preferred calendar service:</p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button class="btn btn-primary btn-block" id="googleCalBtn" style="justify-content: center; margin-bottom: 0;">
                    <i class="fab fa-google"></i> Google Calendar
                </button>
                <button class="btn btn-outline btn-block" id="icalBtn" style="justify-content: center; margin-bottom: 0; color: var(--green-800);">
                    <i class="far fa-calendar"></i> Apple iCal
                </button>
                <button class="btn btn-outline btn-block" onclick="this.parentElement.parentElement.parentElement.remove();" style="justify-content: center; margin-bottom: 0; color: var(--green-800);">
                    Cancel
                </button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        document.getElementById('googleCalBtn').addEventListener('click', function () {
            addToGoogleCalendar(title, date, time, endTime, location);
            modal.remove();
        });

        document.getElementById('icalBtn').addEventListener('click', function () {
            addToICalendar(title, date, time, endTime, location);
            modal.remove();
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.remove();
        });
    }

    function addToGoogleCalendar(title, date, time, endTime, location) {
        const startDateTime = date + 'T' + time + ':00';
        const endDateTime = date + 'T' + endTime + ':00';
        
        const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
            encodeURIComponent(title) +
            '&dates=' + startDateTime.replace(/[-:]/g, '').replace('T', '') + 'Z/' +
            endDateTime.replace(/[-:]/g, '').replace('T', '') + 'Z' +
            '&location=' + encodeURIComponent(location) +
            '&details=Event%20from%20Greenwood%20Academy';

        window.open(googleCalendarUrl, '_blank');
    }

    function addToICalendar(title, date, time, endTime, location) {
        const startDateTime = date + 'T' + time + ':00Z';
        const endDateTime = date + 'T' + endTime + ':00Z';

        const icalContent = 'BEGIN:VCALENDAR\n' +
            'VERSION:2.0\n' +
            'PRODID:-//Greenwood Academy//Events//EN\n' +
            'BEGIN:VEVENT\n' +
            'UID:' + Math.random().toString(36).substr(2, 9) + '@greenwoodacademy.edu\n' +
            'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z\n' +
            'DTSTART:' + startDateTime.replace(/[-:]/g, '').split('.')[0] + 'Z\n' +
            'DTEND:' + endDateTime.replace(/[-:]/g, '').split('.')[0] + 'Z\n' +
            'SUMMARY:' + title + '\n' +
            'LOCATION:' + location + '\n' +
            'DESCRIPTION:Event from Greenwood Academy\n' +
            'END:VEVENT\n' +
            'END:VCALENDAR';

        const blob = new Blob([icalContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = title.replace(/\s+/g, '_') + '.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
});
