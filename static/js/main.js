// SwasthBharath - Main JavaScript Functions
// Government of India Digital Health Portal

(function() {
    'use strict';

    // Global application state
    const SwasthBharath = {
        initialized: false,
        breakpoints: {
            mobile: 576,
            tablet: 768,
            desktop: 992,
            large: 1200
        },
        animations: {
            duration: 300,
            easing: 'ease-in-out'
        }
    };

    // Utility Functions
    const Utils = {
        // Debounce function for performance
        debounce: function(func, wait, immediate) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        // Get viewport width
        getViewportWidth: function() {
            return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        },

        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Smooth scroll to element
        scrollToElement: function(element, offset = 80) {
            if (!element) return;
            
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },

        // Show/hide loading state
        setLoadingState: function(element, loading = true) {
            if (loading) {
                element.classList.add('loading');
                element.setAttribute('aria-busy', 'true');
            } else {
                element.classList.remove('loading');
                element.setAttribute('aria-busy', 'false');
            }
        },

        // Generate unique ID
        generateId: function(prefix = 'element') {
            return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
        }
    };

    // Navigation Enhancement
    const Navigation = {
        init: function() {
            this.setupSmoothScrolling();
            this.setupActiveNavHighlight();
            this.setupMobileMenuClose();
            this.setupKeyboardNavigation();
        },

        setupSmoothScrolling: function() {
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        Utils.scrollToElement(targetElement);
                        
                        // Update URL without jumping
                        if (history.pushState) {
                            history.pushState(null, null, targetId);
                        }
                        
                        // Set focus for accessibility
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                    }
                });
            });
        },

        setupActiveNavHighlight: function() {
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            const currentPath = window.location.pathname;

            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        },

        setupMobileMenuClose: function() {
            // Close mobile menu when clicking nav link
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');

            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (Utils.getViewportWidth() < SwasthBharath.breakpoints.desktop) {
                        if (navbarCollapse.classList.contains('show')) {
                            navbarToggler.click();
                        }
                    }
                });
            });
        },

        setupKeyboardNavigation: function() {
            // Enhanced keyboard navigation for dropdown menus
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            
            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        }
    };

    // Hero Carousel Enhancement
    const HeroCarousel = {
        init: function() {
            const carousel = document.getElementById('heroCarousel');
            if (!carousel) return;

            this.setupAccessibility(carousel);
            this.setupProgressIndicator(carousel);
            this.setupAutoplayControl(carousel);
        },

        setupAccessibility: function(carousel) {
            // Add ARIA labels for accessibility
            const slides = carousel.querySelectorAll('.carousel-item');
            const indicators = carousel.querySelectorAll('.carousel-indicators button');
            
            slides.forEach((slide, index) => {
                slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
            });
            
            indicators.forEach((indicator, index) => {
                indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            });
        },

        setupProgressIndicator: function(carousel) {
            // Create progress bar for carousel
            const progressBar = document.createElement('div');
            progressBar.className = 'carousel-progress';
            progressBar.innerHTML = '<div class="carousel-progress-bar"></div>';
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .carousel-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: rgba(255,255,255,0.3);
                    z-index: 10;
                }
                .carousel-progress-bar {
                    height: 100%;
                    background: #ff9933;
                    width: 0%;
                    transition: width 100ms linear;
                }
            `;
            document.head.appendChild(style);
            carousel.appendChild(progressBar);
            
            // Update progress on slide change
            const progressBarElement = progressBar.querySelector('.carousel-progress-bar');
            const slideInterval = 5000; // Match carousel interval
            let progressInterval;
            
            const startProgress = () => {
                let progress = 0;
                progressInterval = setInterval(() => {
                    progress += 100 / (slideInterval / 100);
                    if (progress >= 100) {
                        progress = 0;
                    }
                    progressBarElement.style.width = progress + '%';
                }, 100);
            };
            
            const resetProgress = () => {
                clearInterval(progressInterval);
                progressBarElement.style.width = '0%';
                startProgress();
            };
            
            carousel.addEventListener('slide.bs.carousel', resetProgress);
            startProgress();
        },

        setupAutoplayControl: function(carousel) {
            // Add play/pause button for accessibility
            const playPauseBtn = document.createElement('button');
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.className = 'btn btn-sm btn-outline-light carousel-play-pause';
            playPauseBtn.setAttribute('aria-label', 'Pause carousel');
            
            const style = document.createElement('style');
            style.textContent = `
                .carousel-play-pause {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
            carousel.appendChild(playPauseBtn);
            
            let isPlaying = true;
            playPauseBtn.addEventListener('click', function() {
                const carouselInstance = bootstrap.Carousel.getInstance(carousel);
                if (isPlaying) {
                    carouselInstance.pause();
                    this.innerHTML = '<i class="fas fa-play"></i>';
                    this.setAttribute('aria-label', 'Play carousel');
                } else {
                    carouselInstance.cycle();
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                    this.setAttribute('aria-label', 'Pause carousel');
                }
                isPlaying = !isPlaying;
            });
        }
    };

    // Card Interactions
    const CardInteractions = {
        init: function() {
            this.setupHoverEffects();
            this.setupClickEffects();
            this.setupAccessibility();
        },

        setupHoverEffects: function() {
            const cards = document.querySelectorAll('.card, .life-stage-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-3px)';
                    this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '';
                });
            });
        },

        setupClickEffects: function() {
            // Add ripple effect to clickable cards
            const clickableCards = document.querySelectorAll('.life-stage-card, .help-card');
            
            clickableCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                        background: rgba(28, 69, 135, 0.3);
                        border-radius: 50%;
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        pointer-events: none;
                    `;
                    
                    // Add ripple animation if not exists
                    if (!document.querySelector('#ripple-style')) {
                        const style = document.createElement('style');
                        style.id = 'ripple-style';
                        style.textContent = `
                            @keyframes ripple {
                                to {
                                    transform: scale(4);
                                    opacity: 0;
                                }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
        },

        setupAccessibility: function() {
            // Add keyboard navigation for card links
            const cardLinks = document.querySelectorAll('.life-stage-card, .help-card');
            
            cardLinks.forEach(card => {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        }
    };

    // Form Enhancements
    const FormEnhancements = {
        init: function() {
            this.setupValidation();
            this.setupAccessibility();
            this.setupPasswordToggle();
        },

        setupValidation: function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    if (!this.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Focus first invalid field
                        const firstInvalid = this.querySelector(':invalid');
                        if (firstInvalid) {
                            firstInvalid.focus();
                        }
                    }
                    this.classList.add('was-validated');
                });
                
                // Real-time validation
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', function() {
                        this.classList.add('was-validated');
                    });
                    
                    input.addEventListener('input', function() {
                        if (this.validity.valid) {
                            this.classList.remove('is-invalid');
                            this.classList.add('is-valid');
                        } else {
                            this.classList.remove('is-valid');
                            this.classList.add('is-invalid');
                        }
                    });
                });
            });
        },

        setupAccessibility: function() {
            // Associate labels with inputs
            const inputs = document.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                    const label = document.querySelector(`label[for="${input.id}"]`);
                    if (label) {
                        input.setAttribute('aria-labelledby', label.id || Utils.generateId('label'));
                        if (!label.id) {
                            label.id = input.getAttribute('aria-labelledby');
                        }
                    }
                }
            });
        },

        setupPasswordToggle: function() {
            const passwordInputs = document.querySelectorAll('input[type="password"]');
            
            passwordInputs.forEach(input => {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
                
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'btn btn-outline-secondary';
                toggleBtn.type = 'button';
                toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
                toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
                
                const btnWrapper = document.createElement('div');
                btnWrapper.className = 'input-group-append';
                btnWrapper.appendChild(toggleBtn);
                wrapper.appendChild(btnWrapper);
                
                toggleBtn.addEventListener('click', function() {
                    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                    input.setAttribute('type', type);
                    
                    const icon = this.querySelector('i');
                    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                    
                    this.setAttribute('aria-label', 
                        type === 'password' ? 'Show password' : 'Hide password'
                    );
                });
            });
        }
    };

    // Search Functionality
    const SearchFunctionality = {
        init: function() {
            this.setupSearchInput();
            this.setupSearchSuggestions();
        },

        setupSearchInput: function() {
            const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="search" i]');
            
            searchInputs.forEach(input => {
                // Add search icon if not present
                if (!input.parentElement.querySelector('.search-icon')) {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-search search-icon';
                    icon.style.cssText = `
                        position: absolute;
                        right: 12px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #6c757d;
                        pointer-events: none;
                        z-index: 5;
                    `;
                    
                    input.parentElement.style.position = 'relative';
                    input.style.paddingRight = '40px';
                    input.parentElement.appendChild(icon);
                }
                
                // Add loading state during search
                input.addEventListener('input', Utils.debounce(function() {
                    const icon = this.parentElement.querySelector('.search-icon');
                    if (this.value.length > 2) {
                        icon.className = 'fas fa-spinner fa-spin search-icon';
                        
                        // Simulate search delay
                        setTimeout(() => {
                            icon.className = 'fas fa-search search-icon';
                        }, 500);
                    }
                }, 300));
            });
        },

        setupSearchSuggestions: function() {
            // Add search suggestions for common health terms
            const healthTerms = [
                'artificial intelligence', 'AI', 'machine learning',
                'blockchain', 'telemedicine', 'IoT', 'internet of things',
                'prenatal care', 'maternal health', 'child development',
                'immunization', 'vaccination', 'elderly care',
                'chronic disease', 'preventive care', 'health monitoring'
            ];
            
            const searchInputs = document.querySelectorAll('#techSearch, input[placeholder*="search" i]');
            
            searchInputs.forEach(input => {
                const datalist = document.createElement('datalist');
                datalist.id = Utils.generateId('suggestions');
                
                healthTerms.forEach(term => {
                    const option = document.createElement('option');
                    option.value = term;
                    datalist.appendChild(option);
                });
                
                input.setAttribute('list', datalist.id);
                input.parentElement.appendChild(datalist);
            });
        }
    };

    // Animation and Scroll Effects
    const ScrollEffects = {
        init: function() {
            this.setupScrollToTop();
            this.setupFadeInAnimations();
            this.setupParallaxEffects();
        },

        setupScrollToTop: function() {
            // Create scroll to top button
            const scrollBtn = document.createElement('button');
            scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            scrollBtn.className = 'btn btn-primary scroll-to-top';
            scrollBtn.setAttribute('aria-label', 'Scroll to top');
            
            const style = document.createElement('style');
            style.textContent = `
                .scroll-to-top {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: none;
                    z-index: 1000;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .scroll-to-top.visible {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .scroll-to-top:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(scrollBtn);
            
            // Show/hide based on scroll position
            const toggleScrollBtn = Utils.debounce(() => {
                if (window.pageYOffset > 300) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            }, 100);
            
            window.addEventListener('scroll', toggleScrollBtn);
            
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        setupFadeInAnimations: function() {
            // Add fade-in animation to elements
            const animatedElements = document.querySelectorAll('.card, .feature-card');
            
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in', 'visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            animatedElements.forEach(el => {
                el.classList.add('fade-in');
                observer.observe(el);
            });
        },

        setupParallaxEffects: function() {
            // Simple parallax for hero backgrounds
            const parallaxElements = document.querySelectorAll('.hero-slide');
            
            const updateParallax = Utils.debounce(() => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                
                parallaxElements.forEach(el => {
                    el.style.transform = `translateY(${parallax}px)`;
                });
            }, 10);
            
            if (parallaxElements.length > 0 && Utils.getViewportWidth() > SwasthBharath.breakpoints.tablet) {
                window.addEventListener('scroll', updateParallax);
            }
        }
    };

    // Performance Monitoring
    const Performance = {
        init: function() {
            this.monitorLoadTime();
            this.optimizeImages();
            this.preloadCriticalResources();
        },

        monitorLoadTime: function() {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`SwasthBharath loaded in ${loadTime}ms`);
                
                // Log to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        name: 'load',
                        value: loadTime
                    });
                }
            });
        },

        optimizeImages: function() {
            // Lazy load images
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        },

        preloadCriticalResources: function() {
            // Preload critical CSS and fonts
            const criticalResources = [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
            ];
            
            criticalResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = resource;
                document.head.appendChild(link);
            });
        }
    };

    // Error Handling
    const ErrorHandling = {
        init: function() {
            this.setupGlobalErrorHandler();
            this.setupNetworkErrorHandling();
        },

        setupGlobalErrorHandler: function() {
            window.addEventListener('error', (e) => {
                console.error('SwasthBharath Error:', e.error);
                this.showUserFriendlyError();
            });
            
            window.addEventListener('unhandledrejection', (e) => {
                console.error('SwasthBharath Promise Rejection:', e.reason);
                this.showUserFriendlyError();
            });
        },

        setupNetworkErrorHandling: function() {
            // Monitor network status
            window.addEventListener('online', () => {
                this.hideNetworkError();
            });
            
            window.addEventListener('offline', () => {
                this.showNetworkError();
            });
        },

        showUserFriendlyError: function() {
            // Show non-intrusive error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-warning alert-dismissible fade show';
            errorDiv.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1050; max-width: 300px;';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                Something went wrong. Please refresh the page or try again later.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            document.body.appendChild(errorDiv);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        },

        showNetworkError: function() {
            const networkDiv = document.createElement('div');
            networkDiv.id = 'network-error';
            networkDiv.className = 'alert alert-danger';
            networkDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; z-index: 1060; margin: 0; border-radius: 0;';
            networkDiv.innerHTML = `
                <div class="container text-center">
                    <i class="fas fa-wifi me-2"></i>
                    No internet connection. Some features may not work properly.
                </div>
            `;
            
            document.body.appendChild(networkDiv);
        },

        hideNetworkError: function() {
            const networkDiv = document.getElementById('network-error');
            if (networkDiv) {
                networkDiv.remove();
            }
        }
    };

    // Accessibility Enhancements
    const Accessibility = {
        init: function() {
            this.setupKeyboardTraps();
            this.setupAriaLabels();
            this.setupFocusManagement();
            this.setupScreenReaderAnnouncements();
        },

        setupKeyboardTraps: function() {
            // Trap focus in modals
            const modals = document.querySelectorAll('.modal');
            
            modals.forEach(modal => {
                modal.addEventListener('shown.bs.modal', function() {
                    const focusableElements = this.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    
                    if (focusableElements.length > 0) {
                        focusableElements[0].focus();
                    }
                    
                    // Trap focus
                    this.addEventListener('keydown', function(e) {
                        if (e.key === 'Tab') {
                            const firstFocusable = focusableElements[0];
                            const lastFocusable = focusableElements[focusableElements.length - 1];
                            
                            if (e.shiftKey && document.activeElement === firstFocusable) {
                                e.preventDefault();
                                lastFocusable.focus();
                            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                                e.preventDefault();
                                firstFocusable.focus();
                            }
                        }
                    });
                });
            });
        },

        setupAriaLabels: function() {
            // Add missing ARIA labels
            const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
            
            buttons.forEach(button => {
                const text = button.textContent.trim();
                const icon = button.querySelector('i');
                
                if (!text && icon) {
                    // Generate label from icon class
                    const iconClass = icon.className;
                    if (iconClass.includes('search')) {
                        button.setAttribute('aria-label', 'Search');
                    } else if (iconClass.includes('close')) {
                        button.setAttribute('aria-label', 'Close');
                    } else if (iconClass.includes('menu')) {
                        button.setAttribute('aria-label', 'Menu');
                    }
                }
            });
        },

        setupFocusManagement: function() {
            // Visible focus indicators
            const style = document.createElement('style');
            style.textContent = `
                .js-focus-visible :focus:not(.focus-visible) {
                    outline: none;
                }
                .js-focus-visible .focus-visible {
                    outline: 2px solid #ff9933;
                    outline-offset: 2px;
                }
            `;
            document.head.appendChild(style);
            document.body.classList.add('js-focus-visible');
        },

        setupScreenReaderAnnouncements: function() {
            // Create live region for announcements
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'live-region';
            document.body.appendChild(liveRegion);
            
            // Function to announce messages
            window.announceToScreenReader = function(message) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            };
        }
    };

    // Main Initialization
    const App = {
        init: function() {
            if (SwasthBharath.initialized) return;
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        },

        initializeComponents: function() {
            try {
                // Initialize all components
                Navigation.init();
                HeroCarousel.init();
                CardInteractions.init();
                FormEnhancements.init();
                SearchFunctionality.init();
                ScrollEffects.init();
                Performance.init();
                ErrorHandling.init();
                Accessibility.init();
                
                SwasthBharath.initialized = true;
                console.log('SwasthBharath application initialized successfully');
                
                // Announce to screen readers
                if (window.announceToScreenReader) {
                    window.announceToScreenReader('SwasthBharath health portal loaded');
                }
                
            } catch (error) {
                console.error('Error initializing SwasthBharath:', error);
                ErrorHandling.showUserFriendlyError();
            }
        }
    };

    // Export to global scope
    window.SwasthBharath = SwasthBharath;
    window.SwasthBharathUtils = Utils;

    // Auto-initialize
    App.init();

})();

// Additional helper functions for external use
window.searchTechnologies = function() {
    const query = document.getElementById('techSearch')?.value;
    const resultsDiv = document.getElementById('searchResults');
    
    if (!query || !resultsDiv) return;
    
    if (query.length < 2) {
        resultsDiv.innerHTML = '<p class="text-muted">Please enter at least 2 characters to search.</p>';
        return;
    }
    
    resultsDiv.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x text-primary"></i></div>';
    
    fetch(`/api/search-technologies?q=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                resultsDiv.innerHTML = '<div class="alert alert-info">No technologies found matching your search.</div>';
                return;
            }
            
            let html = '<div class="row g-3">';
            data.forEach(tech => {
                html += `
                    <div class="col-md-6">
                        <div class="card border-primary">
                            <div class="card-body">
                                <h6 class="card-title fw-bold text-primary">${tech.title}</h6>
                                <p class="card-text small text-muted">${tech.description}</p>
                                <small class="text-muted">Life Stage: ${tech.stage}</small>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            resultsDiv.innerHTML = html;
            
            // Announce results to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader(`Found ${data.length} technologies matching your search`);
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            resultsDiv.innerHTML = '<div class="alert alert-danger">Error searching technologies. Please try again.</div>';
        });
};
