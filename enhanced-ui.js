/**
 * Enhanced UI JavaScript - J&F SILVA
 * Funcionalidades: Navegação por seções, efeitos 3D, transições suaves
 */

(function() {
    'use strict';

    // ===== CONFIGURAÇÕES =====
    const CONFIG = {
        scrollThreshold: 0.1,
        parallaxIntensity: 0.05,
        animationDelay: 100,
        sectionOffset: 100
    };

    // ===== UTILITÁRIOS =====
    const utils = {
        throttle: function(func, delay) {
            let lastExecTime = 0;
            return function(...args) {
                const currentTime = Date.now();
                if (currentTime - lastExecTime > delay) {
                    func.apply(this, args);
                    lastExecTime = currentTime;
                }
            };
        },

        debounce: function(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        isElementInViewport: function(el, threshold = 0.1) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const thresholdHeight = windowHeight * threshold;
            
            return (
                rect.top <= windowHeight - thresholdHeight &&
                rect.bottom >= thresholdHeight
            );
        }
    };

    // ===== NAVEGAÇÃO POR SEÇÕES =====
    class SectionNavigation {
        constructor() {
            this.sections = ['sobre', 'servicos', 'portfolio', 'parceiros', 'trabalhe-conosco', 'contato'];
            this.currentSection = 0;
            this.isScrolling = false;
            this.init();
        }

        init() {
            this.createSectionIndicator();
            this.bindEvents();
            this.updateActiveSection();
        }

        createSectionIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'section-indicator';
            indicator.innerHTML = this.sections.map(section => 
                `<div class="section-dot" data-section="${section}" data-target="#${section}"></div>`
            ).join('');
            
            document.body.appendChild(indicator);
            this.indicator = indicator;
        }

        bindEvents() {
            // Clique nos indicadores
            this.indicator.addEventListener('click', (e) => {
                if (e.target.classList.contains('section-dot')) {
                    const target = e.target.getAttribute('data-target');
                    this.scrollToSection(target);
                }
            });

            // Scroll da página
            window.addEventListener('scroll', utils.throttle(() => {
                if (!this.isScrolling) {
                    this.updateActiveSection();
                }
            }, 100));

            // Navegação por teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateByKeyboard(e.key);
                }
            });
        }

        scrollToSection(targetId) {
            const target = document.querySelector(targetId);
            if (!target) return;

            this.isScrolling = true;
            const targetTop = target.offsetTop - CONFIG.sectionOffset;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });

            // Atualizar indicador ativo
            setTimeout(() => {
                this.isScrolling = false;
                this.updateActiveSection();
            }, 1000);
        }

        navigateByKeyboard(key) {
            const currentIndex = this.currentSection;
            let newIndex;

            if (key === 'ArrowUp') {
                newIndex = Math.max(0, currentIndex - 1);
            } else {
                newIndex = Math.min(this.sections.length - 1, currentIndex + 1);
            }

            if (newIndex !== currentIndex) {
                const targetId = `#${this.sections[newIndex]}`;
                this.scrollToSection(targetId);
            }
        }

        updateActiveSection() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;

            this.sections.forEach((section, index) => {
                const element = document.querySelector(`#${section}`);
                if (!element) return;

                const elementTop = element.offsetTop - CONFIG.sectionOffset;
                const elementBottom = elementTop + element.offsetHeight;

                if (scrollTop >= elementTop && scrollTop < elementBottom) {
                    this.currentSection = index;
                    this.updateIndicator(index);
                }
            });
        }

        updateIndicator(activeIndex) {
            const dots = this.indicator.querySelectorAll('.section-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }
    }

    // ===== EFEITOS 3D AVANÇADOS =====
    class Advanced3DEffects {
        constructor() {
            this.cards = document.querySelectorAll('.card, .partner-card, .tile');
            this.buttons = document.querySelectorAll('.cta-link, .btn-3d');
            this.init();
        }

        init() {
            this.setupCardEffects();
            this.setupButtonEffects();
            this.setupParallaxEffects();
        }

        setupCardEffects() {
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleCardMouseMove(e, card));
                card.addEventListener('mouseleave', (e) => this.handleCardMouseLeave(e, card));
            });
        }

        handleCardMouseMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `
                translateY(var(--translate-y)) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                perspective(var(--perspective))
            `;

            // Efeito de brilho
            this.updateCardShine(card, x, y, rect);
        }

        handleCardMouseLeave(e, card) {
            card.style.transform = '';
            this.removeCardShine(card);
        }

        updateCardShine(card, x, y, rect) {
            let shine = card.querySelector('.card-shine');
            if (!shine) {
                shine = this.createCardShine(card);
            }

            const shineX = (x / rect.width) * 100;
            const shineY = (y / rect.height) * 100;
            
            shine.style.background = `
                radial-gradient(circle at ${shineX}% ${shineY}%, 
                rgba(255,255,255,0.15) 0%, 
                rgba(255,255,255,0.05) 30%, 
                transparent 70%)
            `;
        }

        createCardShine(card) {
            const shine = document.createElement('div');
            shine.className = 'card-shine';
            shine.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                border-radius: inherit;
                z-index: 1;
                transition: opacity 0.3s ease;
            `;
            card.appendChild(shine);
            return shine;
        }

        removeCardShine(card) {
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.remove();
            }
        }

        setupButtonEffects() {
            this.buttons.forEach(button => {
                button.addEventListener('mousemove', (e) => this.handleButtonMouseMove(e, button));
                button.addEventListener('mouseleave', (e) => this.handleButtonMouseLeave(e, button));
            });
        }

        handleButtonMouseMove(e, button) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            button.style.transform = `
                translateY(var(--translate-y)) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale(1.05)
            `;
        }

        handleButtonMouseLeave(e, button) {
            button.style.transform = '';
        }

        setupParallaxEffects() {
            const parallaxElements = document.querySelectorAll('.parallax-bg, .hero-bg');
            
            window.addEventListener('scroll', utils.throttle(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach((element, index) => {
                    const speed = CONFIG.parallaxIntensity + (index * 0.02);
                    const yPos = scrolled * speed;
                    element.style.transform = `translateY(${yPos}px)`;
                });
            }, 16));
        }
    }

    // ===== ANIMAÇÕES DE ENTRADA =====
    class EntranceAnimations {
        constructor() {
            this.animatedElements = document.querySelectorAll('.card, .partner-card, .tile, .stat');
            this.init();
        }

        init() {
            this.observeElements();
            this.addStaggeredAnimations();
        }

        observeElements() {
            if (!('IntersectionObserver' in window)) {
                this.fallbackAnimation();
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateElement(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: CONFIG.scrollThreshold,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            this.animatedElements.forEach(el => observer.observe(el));
        }

        animateElement(element) {
            element.classList.add('section-enter');
            
            // Trigger reflow
            element.offsetHeight;
            
            element.classList.add('is-visible');
        }

        addStaggeredAnimations() {
            this.animatedElements.forEach((el, index) => {
                el.style.animationDelay = `${index * CONFIG.animationDelay}ms`;
            });
        }

        fallbackAnimation() {
            this.animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-fallback');
                }, index * CONFIG.animationDelay);
            });
        }
    }

    // ===== SISTEMA DE SCROLL SUAVE =====
    class SmoothScrollSystem {
        constructor() {
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (!link) return;

                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                this.scrollToElement(target);
            });
        }

        scrollToElement(element) {
            const targetTop = element.offsetTop - CONFIG.sectionOffset;
            
            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        }
    }

    // ===== SISTEMA DE TEMA =====
    class ThemeSystem {
        constructor() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.themeIcon = document.getElementById('theme-icon');
            this.currentTheme = localStorage.getItem('theme') || 'dark';
            this.init();
        }

        init() {
            this.applyTheme(this.currentTheme);
            this.bindEvents();
        }

        bindEvents() {
            if (this.themeToggle) {
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
            }
        }

        toggleTheme() {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
        }

        applyTheme(theme) {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            this.updateThemeIcon(theme);
        }

        updateThemeIcon(theme) {
            if (!this.themeIcon) return;

            if (theme === 'light') {
                this.themeIcon.innerHTML = `
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                `;
            } else {
                this.themeIcon.innerHTML = `
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                `;
            }
        }
    }

    // ===== SISTEMA DE IDIOMAS =====
    class LanguageSystem {
        constructor() {
            this.langSelector = document.getElementById('langSel');
            this.currentLang = localStorage.getItem('language') || 'pt';
            this.init();
        }

        init() {
            this.setLanguage(this.currentLang);
            this.bindEvents();
        }

        bindEvents() {
            if (this.langSelector) {
                this.langSelector.addEventListener('change', (e) => {
                    this.setLanguage(e.target.value);
                });
            }
        }

        setLanguage(lang) {
            this.currentLang = lang;
            document.documentElement.lang = lang;
            localStorage.setItem('language', lang);
            
            if (this.langSelector) {
                this.langSelector.value = lang;
            }
        }
    }

    // ===== INICIALIZAÇÃO =====
    class EnhancedUI {
        constructor() {
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.start.bind(this));
            } else {
                this.start();
            }
        }

        start() {
            console.log('🚀 Enhanced UI iniciando...');
            
            // Inicializar todos os sistemas
            new SectionNavigation();
            new Advanced3DEffects();
            new EntranceAnimations();
            new SmoothScrollSystem();
            new ThemeSystem();
            new LanguageSystem();
            
            // Adicionar classe ao body
            document.body.classList.add('enhanced-ui-loaded');
            
            console.log('✅ Enhanced UI ativo!');
        }
    }

    // ===== INICIAR APLICAÇÃO =====
    new EnhancedUI();

})();
