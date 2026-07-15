document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
    }

    // 2. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 3. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all others
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                    const btn = faq.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // 4. Carousel Logic
    const track = document.getElementById("carouselTrack");
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const indicatorsNav = document.querySelector('.carousel-indicators');
        
        if (!slides.length) return;

        let currentIndex = 0;
        let isPaused = false;
        
        // Setup indicators
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('indicator');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            indicatorsNav.appendChild(dot);
        });
        const indicators = Array.from(indicatorsNav.children);

        function moveToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            currentIndex = index;
            const amountToMove = -100 * currentIndex;
            track.style.transform = `translateX(${amountToMove}%)`;
            
            // Update active dot
            indicators.forEach(dot => dot.classList.remove('active'));
            indicators[currentIndex].classList.add('active');
        }

        if (nextButton) nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
        if (prevButton) prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

        // Auto play
        let autoPlayInterval = setInterval(() => {
            if (!isPaused) moveToSlide(currentIndex + 1);
        }, 4000);

        // Accessibility & UX Pause on hover/focus
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => isPaused = true);
            carouselContainer.addEventListener('mouseleave', () => isPaused = false);
            carouselContainer.addEventListener('focusin', () => isPaused = true);
            carouselContainer.addEventListener('focusout', () => isPaused = false);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!carouselContainer.contains(document.activeElement)) return;
            if (e.key === 'ArrowLeft') moveToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') moveToSlide(currentIndex + 1);
        });
    }

    // 5. Download Progress Logic (for download.html)
    const downloadBtn = document.getElementById('initiateDownloadBtn');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    
    if (downloadBtn && progressBarContainer && progressBar) {
        downloadBtn.addEventListener('click', (e) => {
            const url = downloadBtn.getAttribute('href');
            if (url && url !== '#') {
                // We let the default action happen (download file)
                // but we also show a fake progress bar for UX
                progressBarContainer.style.display = 'block';
                let progress = 0;
                
                downloadBtn.style.pointerEvents = 'none';
                downloadBtn.innerHTML = 'Downloading...';
                
                const interval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        downloadBtn.innerHTML = 'Downloaded ✓';
                        setTimeout(() => {
                            progressBarContainer.style.display = 'none';
                            downloadBtn.innerHTML = 'Install APK';
                            downloadBtn.style.pointerEvents = 'auto';
                        }, 3000);
                    }
                    progressBar.style.width = `${progress}%`;
                }, 200);
            }
        });
    }
});
