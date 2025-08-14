/**
 * JavaScript para Página de Contatos - J&F SILVA
 * Funcionalidades: FAQ, validação de formulário, efeitos interativos
 */

(function() {
    'use strict';

    // ===== CONFIGURAÇÕES =====
    const CONFIG = {
        animationDelay: 100,
        scrollThreshold: 0.1,
        formValidation: {
            requiredFields: ['nome', 'email', 'assunto', 'mensagem'],
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phoneRegex: /^[\+]?[0-9\s\-\(\)]{8,}$/
        }
    };

    // ===== UTILITÁRIOS =====
    const utils = {
        // Debounce para otimização
        debounce: function(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        // Throttle para performance
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

        // Verificar se elemento está visível
        isElementInViewport: function(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Adicionar classe com delay
        addClassWithDelay: function(element, className, delay) {
            setTimeout(() => {
                element.classList.add(className);
            }, delay);
        }
    };

    // ===== SISTEMA FAQ =====
    class FAQSystem {
        constructor() {
            this.faqItems = document.querySelectorAll('.faq-item');
            this.init();
        }

        init() {
            this.faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => this.toggleFAQ(item));
            });
        }

        toggleFAQ(item) {
            const isActive = item.classList.contains('active');
            
            // Fechar todos os outros itens
            this.faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle do item atual
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }

            // Adicionar efeito de scroll suave
            if (!isActive) {
                setTimeout(() => {
                    item.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
            }
        }
    }

    // ===== VALIDAÇÃO DE FORMULÁRIO =====
    class FormValidator {
        constructor() {
            this.form = document.querySelector('.contact-form');
            this.submitBtn = document.querySelector('.submit-btn');
            this.init();
        }

        init() {
            if (!this.form) return;

            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupFieldValidation();
            this.setupRealTimeValidation();
        }

        setupFieldValidation() {
            const fields = this.form.querySelectorAll('input, select, textarea');
            
            fields.forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            });
        }

        setupRealTimeValidation() {
            const emailField = this.form.querySelector('#email');
            const phoneField = this.form.querySelector('#telefone');

            if (emailField) {
                emailField.addEventListener('input', utils.debounce(() => {
                    this.validateEmail(emailField);
                }, 500));
            }

            if (phoneField) {
                phoneField.addEventListener('input', utils.debounce(() => {
                    this.validatePhone(phoneField);
                }, 500));
            }
        }

        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';

            // Validação de campos obrigatórios
            if (CONFIG.formValidation.requiredFields.includes(fieldName) && !value) {
                isValid = false;
                errorMessage = 'Este campo é obrigatório';
            }

            // Validação específica por tipo
            if (isValid && value) {
                switch (fieldName) {
                    case 'email':
                        isValid = this.validateEmail(field);
                        break;
                    case 'telefone':
                        isValid = this.validatePhone(field);
                        break;
                    case 'mensagem':
                        if (value.length < 10) {
                            isValid = false;
                            errorMessage = 'A mensagem deve ter pelo menos 10 caracteres';
                        }
                        break;
                }
            }

            this.showFieldValidation(field, isValid, errorMessage);
            return isValid;
        }

        validateEmail(field) {
            const email = field.value.trim();
            const isValid = CONFIG.formValidation.emailRegex.test(email);
            
            if (!isValid) {
                this.showFieldValidation(field, false, 'Email inválido');
            }
            
            return isValid;
        }

        validatePhone(field) {
            const phone = field.value.trim();
            const isValid = CONFIG.formValidation.phoneRegex.test(phone);
            
            if (!isValid && phone) {
                this.showFieldValidation(field, false, 'Telefone inválido');
            }
            
            return isValid;
        }

        showFieldValidation(field, isValid, errorMessage = '') {
            // Remover mensagens de erro anteriores
            this.clearFieldError(field);

            if (!isValid) {
                field.classList.add('error');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = errorMessage;
                errorDiv.style.cssText = `
                    color: #ef4444;
                    font-size: 0.8rem;
                    margin-top: 5px;
                    animation: slideInDown 0.3s ease;
                `;
                
                field.parentNode.appendChild(errorDiv);
            } else {
                field.classList.add('valid');
            }
        }

        clearFieldError(field) {
            field.classList.remove('error', 'valid');
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }

        validateForm() {
            const fields = this.form.querySelectorAll('input, select, textarea');
            let isValid = true;

            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        async handleSubmit(e) {
            e.preventDefault();

            if (!this.validateForm()) {
                this.showFormError('Por favor, corrija os erros no formulário');
                return;
            }

            // Simular envio
            this.setSubmitButtonState('sending');
            
            try {
                // Aqui você pode adicionar a lógica real de envio
                await this.simulateFormSubmission();
                this.showFormSuccess();
                this.form.reset();
                this.clearAllFieldStates();
            } catch (error) {
                this.showFormError('Erro ao enviar mensagem. Tente novamente.');
            } finally {
                this.setSubmitButtonState('idle');
            }
        }

        simulateFormSubmission() {
            return new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });
        }

        setSubmitButtonState(state) {
            const btn = this.submitBtn;
            const btnText = btn.querySelector('span');
            const btnIcon = btn.querySelector('svg');

            switch (state) {
                case 'sending':
                    btn.disabled = true;
                    btnText.textContent = 'Enviando...';
                    btnIcon.style.animation = 'spin 1s linear infinite';
                    break;
                case 'idle':
                    btn.disabled = false;
                    btnText.textContent = 'Enviar Mensagem';
                    btnIcon.style.animation = '';
                    break;
            }
        }

        showFormSuccess() {
            this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        }

        showFormError(message) {
            this.showNotification(message, 'error');
        }

        showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `form-notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            `;

            if (type === 'success') {
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            } else {
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            }

            document.body.appendChild(notification);

            // Auto-remover após 5 segundos
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }

        clearAllFieldStates() {
            const fields = this.form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                this.clearFieldError(field);
            });
        }
    }

    // ===== ANIMAÇÕES DE ENTRADA =====
    class EntranceAnimations {
        constructor() {
            this.animatedElements = document.querySelectorAll('.method-card, .faq-item, .form-info, .contact-form');
            this.init();
        }

        init() {
            this.observeElements();
            this.addScrollEffects();
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
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            // Trigger reflow
            element.offsetHeight;
            
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }

        addScrollEffects() {
            window.addEventListener('scroll', utils.throttle(() => {
                this.updateParallaxElements();
            }, 16));
        }

        updateParallaxElements() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.contact-hero, .method-card');

            parallaxElements.forEach((el, index) => {
                const speed = 0.1 + (index * 0.02);
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }

        fallbackAnimation() {
            this.animatedElements.forEach((el, index) => {
                utils.addClassWithDelay(el, 'animate-fallback', index * CONFIG.animationDelay);
            });
        }
    }

    // ===== INTERAÇÕES DE FORMULÁRIO =====
    class FormInteractions {
        constructor() {
            this.init();
        }

        init() {
            this.setupFloatingLabels();
            this.setupCharacterCounter();
            this.setupAutoResize();
        }

        setupFloatingLabels() {
            const fields = document.querySelectorAll('.form-group');
            
            fields.forEach(group => {
                const input = group.querySelector('input, select, textarea');
                const label = group.querySelector('label');
                
                if (!input || !label) return;

                // Adicionar classe quando há valor
                if (input.value) {
                    group.classList.add('has-value');
                }

                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });

                input.addEventListener('blur', () => {
                    group.classList.remove('focused');
                    if (input.value) {
                        group.classList.add('has-value');
                    } else {
                        group.classList.remove('has-value');
                    }
                });

                input.addEventListener('input', () => {
                    if (input.value) {
                        group.classList.add('has-value');
                    } else {
                        group.classList.remove('has-value');
                    }
                });
            });
        }

        setupCharacterCounter() {
            const textarea = document.querySelector('#mensagem');
            if (!textarea) return;

            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                text-align: right;
                font-size: 0.8rem;
                color: var(--text-secondary);
                margin-top: 5px;
            `;
            
            textarea.parentNode.appendChild(counter);

            const updateCounter = () => {
                const current = textarea.value.length;
                const max = 1000;
                counter.textContent = `${current}/${max} caracteres`;
                
                if (current > max * 0.9) {
                    counter.style.color = '#ef4444';
                } else if (current > max * 0.7) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = 'var(--text-secondary)';
                }
            };

            textarea.addEventListener('input', updateCounter);
            updateCounter();
        }

        setupAutoResize() {
            const textarea = document.querySelector('#mensagem');
            if (!textarea) return;

            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        }
    }

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    class NotificationSystem {
        constructor() {
            this.notifications = [];
            this.init();
        }

        init() {
            this.createNotificationContainer();
        }

        createNotificationContainer() {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            
            document.body.appendChild(container);
        }

        show(message, type = 'info', duration = 5000) {
            const notification = this.createNotification(message, type);
            this.notifications.push(notification);
            
            const container = document.getElementById('notification-container');
            container.appendChild(notification);

            // Animar entrada
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            // Auto-remover
            setTimeout(() => {
                this.remove(notification);
            }, duration);

            return notification;
        }

        createNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            const colors = {
                success: 'linear-gradient(135deg, #10b981, #059669)',
                error: 'linear-gradient(135deg, #ef4444, #dc2626)',
                warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
                info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
            };

            notification.style.cssText = `
                background: ${colors[type] || colors.info};
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                cursor: pointer;
                font-weight: 500;
            `;

            notification.addEventListener('click', () => this.remove(notification));

            return notification;
        }

        remove(notification) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }

    // ===== INICIALIZAÇÃO =====
    class ContactPage {
        constructor() {
            this.init();
        }

        init() {
            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.start.bind(this));
            } else {
                this.start();
            }
        }

        start() {
            console.log('🚀 Página de Contatos iniciando...');
            
            // Inicializar todos os sistemas
            new FAQSystem();
            new FormValidator();
            new EntranceAnimations();
            new FormInteractions();
            
            // Sistema de notificações global
            window.notifications = new NotificationSystem();
            
            // Adicionar classe ao body
            document.body.classList.add('contact-page-loaded');
            
            console.log('✅ Página de Contatos ativa!');
        }
    }

    // ===== INICIAR APLICAÇÃO =====
    new ContactPage();

})();

// ===== ANIMAÇÕES CSS ADICIONAIS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes slideInDown {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .form-group.focused label {
        color: var(--brand);
        transform: translateY(-2px);
    }
    
    .form-group.has-value label {
        color: var(--brand);
    }
    
    .field-error {
        animation: slideInDown 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .animate-fallback {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .contact-form input.error,
    .contact-form select.error,
    .contact-form textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }
    
    .contact-form input.valid,
    .contact-form select.valid,
    .contact-form textarea.valid {
        border-color: #10b981;
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    }
`;

document.head.appendChild(style);
