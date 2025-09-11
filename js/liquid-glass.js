class LiquidGlassUI {
    constructor() {
        this.currentTab = 'executive';
        this.glassElements = [];
        this.init();
    }
    
    init() {
        this.setupTabNavigation();
        this.setupGlassEffects();
        this.setupAnimations();
        this.setupResponsiveDesign();
        this.initializeInteractivity();
    }
    
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = button.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    this.currentTab = tabId;
                    this.onTabChange(tabId);
                }
                
                // Smooth scroll to top of content
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
        
        // Handle keyboard navigation
        tabButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                let newIndex;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        newIndex = index > 0 ? index - 1 : tabButtons.length - 1;
                        tabButtons[newIndex].click();
                        tabButtons[newIndex].focus();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        newIndex = index < tabButtons.length - 1 ? index + 1 : 0;
                        tabButtons[newIndex].click();
                        tabButtons[newIndex].focus();
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        button.click();
                        break;
                }
            });
        });
    }
    
    setupGlassEffects() {
        // Enhanced glass card hover effects
        const glassCards = document.querySelectorAll('.glass-card');
        
        glassCards.forEach(card => {
            this.glassElements.push(card);
            
            card.addEventListener('mouseenter', (e) => {
                this.enhanceGlassEffect(e.target, 'enter');
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.enhanceGlassEffect(e.target, 'leave');
            });
            
            card.addEventListener('mousemove', (e) => {
                this.addParallaxEffect(e, card);
            });
        });
        
        // Dynamic glass orb movement
        this.animateGlassOrbs();
    }
    
    enhanceGlassEffect(element, action) {
        if (action === 'enter') {
            element.style.background = 'rgba(255, 255, 255, 0.15)';
            element.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            element.style.boxShadow = '0 15px 45px rgba(0, 0, 0, 0.2)';
        } else {
            element.style.background = 'rgba(255, 255, 255, 0.1)';
            element.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            element.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }
    }
    
    addParallaxEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        
        // Reset transform on mouse leave
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }, { once: true });
    }
    
    animateGlassOrbs() {
        const orbs = document.querySelectorAll('.glass-orb');
        
        orbs.forEach((orb, index) => {
            const delay = index * 5000;
            
            setInterval(() => {
                const newX = Math.random() * 100;
                const newY = Math.random() * 100;
                const scale = 0.8 + Math.random() * 0.4;
                const rotation = Math.random() * 360;
                
                orb.style.transform = `
                    translate(${newX - 50}px, ${newY - 50}px) 
                    scale(${scale}) 
                    rotate(${rotation}deg)
                `;
            }, 15000 + delay);
        });
    }
    
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);
        
        // Observe all glass cards
        const animatedElements = document.querySelectorAll('.glass-card, .stat-item, .tech-item, .metric-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
        
        // Counter animations for numbers
        this.animateCounters();
    }
    
    animateCounters() {
        const counterElements = document.querySelectorAll('.stat-value, .metric-value, .result-value, .perf-value');
        
        const animateCounter = (element) => {
            const text = element.textContent;
            const number = parseFloat(text.replace(/[^\d.-]/g, ''));
            
            if (isNaN(number)) return;
            
            const suffix = text.replace(/[\d.-]/g, '');
            const duration = 1500;
            const steps = 60;
            const stepValue = number / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += stepValue;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                element.textContent = Math.floor(current) + suffix;
            }, duration / steps);
        };
        
        // Animate counters when they come into view
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterElements.forEach(el => counterObserver.observe(el));
    }
    
    setupResponsiveDesign() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        this.handleResize();
    }
    
    handleResize() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024;
        
        // Adjust grid layouts based on screen size
        const contentGrids = document.querySelectorAll('.content-grid');
        contentGrids.forEach(grid => {
            if (isMobile) {
                grid.style.gridTemplateColumns = '1fr';
            } else if (isTablet) {
                grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            } else {
                grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
            }
        });
        
        // Adjust navigation for mobile
        const navTabs = document.querySelector('.nav-tabs');
        if (isMobile && navTabs) {
            navTabs.style.overflowX = 'auto';
            navTabs.style.scrollSnapType = 'x mandatory';
            
            const tabs = navTabs.querySelectorAll('.nav-tab');
            tabs.forEach(tab => {
                tab.style.scrollSnapAlign = 'start';
                tab.style.flexShrink = '0';
            });
        }
    }
    
    initializeInteractivity() {
        // Enhanced form interactions
        this.setupFormInteractions();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Touch gestures for mobile
        this.setupTouchGestures();
        
        // Loading states
        this.setupLoadingStates();
    }
    
    setupFormInteractions() {
        // Enhanced range sliders
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateRangeSlider(e.target);
            });
            
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', (e) => {
                e.target.parentElement.classList.remove('focused');
            });
            
            // Initialize slider appearance
            this.updateRangeSlider(input);
        });
        
        // Enhanced select interactions
        const selects = document.querySelectorAll('.glass-select');
        selects.forEach(select => {
            select.addEventListener('focus', (e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.3)';
            });
            
            select.addEventListener('blur', (e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
            });
        });
    }
    
    updateRangeSlider(input) {
        const value = ((input.value - input.min) / (input.max - input.min)) * 100;
        input.style.background = `linear-gradient(to right, #667eea 0%, #667eea ${value}%, rgba(255, 255, 255, 0.1) ${value}%, rgba(255, 255, 255, 0.1) 100%)`;
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchToTab('executive');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchToTab('tokenomics');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchToTab('market');
                        break;
                    case '4':
                        e.preventDefault();
                        this.switchToTab('financial');
                        break;
                    case '5':
                        e.preventDefault();
                        this.switchToTab('infrastructure');
                        break;
                    case '6':
                        e.preventDefault();
                        this.switchToTab('revenue');
                        break;
                    case '7':
                        e.preventDefault();
                        this.switchToTab('valuation');
                        break;
                    case '8':
                        e.preventDefault();
                        this.switchToTab('dcf');
                        break;
                    case '9':
                        e.preventDefault();
                        this.switchToTab('funding');
                        break;
                }
            }
        });
    }
    
    switchToTab(tabId) {
        const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (tabButton) {
            tabButton.click();
        }
    }
    
    setupTouchGestures() {
        if ('ontouchstart' in window) {
            let startX = 0;
            let startY = 0;
            
            document.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            document.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                // Only handle horizontal swipes
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    const tabs = document.querySelectorAll('.nav-tab');
                    const currentIndex = Array.from(tabs).findIndex(tab => tab.classList.contains('active'));
                    
                    if (diffX > 0 && currentIndex < tabs.length - 1) {
                        // Swipe left - next tab
                        tabs[currentIndex + 1].click();
                    } else if (diffX < 0 && currentIndex > 0) {
                        // Swipe right - previous tab
                        tabs[currentIndex - 1].click();
                    }
                }
            });
        }
    }
    
    setupLoadingStates() {
        // Add loading states to buttons and forms
        const buttons = document.querySelectorAll('button, .nav-tab');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.showLoadingState(button);
                setTimeout(() => this.hideLoadingState(button), 500);
            });
        });
    }
    
    showLoadingState(element) {
        element.style.position = 'relative';
        element.style.color = 'transparent';
        
        const loader = document.createElement('div');
        loader.className = 'loading';
        loader.style.position = 'absolute';
        loader.style.left = '50%';
        loader.style.top = '50%';
        loader.style.transform = 'translate(-50%, -50%)';
        
        element.appendChild(loader);
        element.disabled = true;
    }
    
    hideLoadingState(element) {
        const loader = element.querySelector('.loading');
        if (loader) {
            loader.remove();
        }
        element.style.color = '';
        element.disabled = false;
    }
    
    onTabChange(tabId) {
        // Update charts when tab changes
        if (window.charts && window.charts.updateChartsForTab) {
            window.charts.updateChartsForTab(tabId);
        }
        
        // Update financial models
        if (window.financialModels && window.financialModels.updateAllCalculations) {
            window.financialModels.updateAllCalculations();
        }
        
        // Update main application
        if (window.investorPresentation && window.investorPresentation.updateAllMetrics) {
            window.investorPresentation.updateAllMetrics();
        }
        
        // Analytics tracking
        this.trackTabView(tabId);
    }
    
    trackTabView(tabId) {
        // Analytics could be added here
        console.log(`Tab viewed: ${tabId}`);
        
        // Trigger chart creation for newly visible tab
        setTimeout(() => {
            if (window.charts) {
                window.charts.createCharts();
            }
        }, 100);
    }
    
    // Public methods
    getCurrentTab() {
        return this.currentTab;
    }
    
    refreshGlassEffects() {
        this.glassElements.forEach(element => {
            element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }
    
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        // Could implement dark mode variations
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.liquidGlassUI = new LiquidGlassUI();
    
    // Add some visual feedback for interactions
    document.addEventListener('click', (e) => {
        createClickRipple(e);
    });
});

// Create click ripple effect
function createClickRipple(e) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    
    const size = 20;
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - size / 2) + 'px';
    ripple.style.top = (e.clientY - size / 2) + 'px';
    
    document.body.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;
document.head.appendChild(rippleStyle);