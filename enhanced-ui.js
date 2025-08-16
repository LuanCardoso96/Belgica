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
        this.currentLang = localStorage.getItem('language') || 'fr';
            this.dict = {
                pt: {
                    brand: "JF SILVA CONSTRUÇÕES",
                    "nav.about":"Sobre","nav.services":"Serviços","nav.portfolio":"Referências","nav.partners":"Parceiros","nav.contact":"Contato","nav.careers":"Trabalhe Conosco","nav.cta":"Pedir um orçamento",
                    "hero.kicker":"Subcontratação • Cofragem • Armaduras","hero.title":"Engenharia que gera resultados e entrega qualidade","hero.lead":"Somos uma empresa J&F SILVA com <strong>200+ profissionais</strong> dedicada a estruturas de betão, cofragem e armaduras. Atendemos empreiteiros gerais com agilidade, segurança e um custo competitivo.","hero.cta":"Pedir um orçamento","hero.secondary":"Ver projetos",
                    "stats.people":"Profissionais","stats.years":"Anos de experiência","stats.jobs":"Obras entregues",
                    "about.title":"Sobre nós","about.desc":"Um parceiro de confiança para os seus projetos de construção. Contamos com equipes qualificadas, segurança em primeiro lugar e cumprimento rigoroso dos prazos.","about.card1.title":"Especialistas em estruturas","about.card1.text":"Execução de cofragem e armaduras, controle de cobrimento e garantia da qualidade do betão.","about.card2.title":"Produtividade e agilidade","about.card2.text":"Equipes dimensionadas para objetivos ambiciosos, reduzindo atrasos e custos indiretos.","about.card3.title":"Segurança no trabalho","about.card3.text":"Procedimentos e EPIs alinhados aos mais altos padrões. Briefings diários e inspeções de cofragem.",
                    "services.title":"Serviços","services.desc":"Do planeamento à execução, fornecemos equipes completas ou reforço especializado.","services.card1.title":"Cofragem & Descofragem","services.card1.text":"Montagem modular para pilares, vigas, lajes e paredes. Reutilização otimizada dos painéis e escoramento.","services.card2.title":"Armaduras & Ferragens","services.card2.text":"Corte, dobragem e posicionamento com espaçadores; controle de diâmetros, sobreposições e ancoragens.","services.card3.title":"Lançamento de Betão","services.card3.text":"Planejamento das janelas de vazamento, cura e controle de juntas de concretagem. Ensaios e rastreabilidade.","services.card4.title":"Gestão de obra","services.card4.text":"Diários de obra, medições, briefings de segurança e relatórios semanais com indicadores de avanço.","services.card5.title":"Orçamentação & Medições","services.card5.text":"Levantamento de quantidades, cronogramas e plano de recursos.","services.card6.title":"Qualidade & Certificação","services.card6.text":"Planos de segurança, checklists de cofragem e inspeções de conformidade.",
                    "portfolio.title":"Nossas Referências","portfolio.desc":"Conheça alguns dos nossos projetos mais recentes.","portfolio.item1":"","portfolio.item2":"","portfolio.item3":"","portfolio.item4":"","portfolio.item5":"","portfolio.item6":"","portfolio.item7":"Serviço Finalizado - Resultado",
                    "video.title":"Nossa equipe em ação", "video.desc":"Veja a qualidade e a agilidade das nossas operações no canteiro de obras.",
                    "contact.title":"Fale conosco","contact.desc":"Preencha o formulário e retornaremos hoje mesmo. Ou fale conosco via WhatsApp.","form.name":"Nome","form.company":"Empresa","form.email":"Email","form.phone":"Telefone","form.subject":"Assunto","form.opt.quote":"Orçamento","form.opt.partner":"Parceria","form.opt.other":"Outros","form.message":"Mensagem","form.send":"Enviar","form.privacy":"Ao enviar, você concorda com nossa política de privacidade.",
                    "footer.rights":"Todos os direitos reservados.","footer.languages":"Idiomas: PT • FR • EN • JA"
                },
                fr: {
                    brand: "JF SILVA CONSTRUÇÕES",
                    "nav.about":"À propos","nav.services":"Services","nav.portfolio":"Références","nav.partners":"Partenaires","nav.contact":"Contact","nav.careers":"Carrières","nav.cta":"Demander un devis",
                    "hero.kicker":"Sous-traitance • Coffrage • Armatures","hero.title":"Ingénierie qui génère des contrats et livre la qualité","hero.lead":"Nous sommes l'entreprise <strong>J&F SILVA</strong> avec <strong>200+ professionnels</strong> dédiée aux structures en béton, coffrage et armatures. Nous servons des entreprises générales avec agilité, sécurité et un coût compétitif.","hero.cta":"Demander un devis","hero.secondary":"Voir les projets",
                    "stats.people":"Professionnels","stats.years":"Années d'expérience","stats.jobs":"Chantiers livrés",
                    "about.title":"À propos de nous","about.desc":"Partenaire de confiance pour les travaux de génie civil. Équipes formées, sécurité d'abord et délais respectés. Conformité aux Eurocodes et meilleures pratiques.","about.card1.title":"Spécialistes en structures","about.card1.text":"Exécution de coffrage (coffrage/bekisting) et d'armatures (armatures/wapening), contrôle d'enrobage et qualité du béton.","about.card2.title":"Productivité","about.card2.text":"Équipes dimensionnées pour des objectifs ambitieux, réduisant retards et coûts indirects.","about.card3.title":"Sécurité","about.card3.text":"Procédures et EPI alignés aux normes européennes. Briefings quotidiens et inspections de coffrage.",
                    "services.title":"Services","services.desc":"De la planification à l'exécution, nous fournissons des équipes complètes ou un renfort spécialisé.","services.card1.title":"Coffrage & décoffrage","services.card1.text":"Montage modulaire pour poteaux, poutres, dalles et voiles. Réutilisation optimisée des panneaux et étaiements.","services.card2.title":"Armatures & ferraillage","services.card2.text":"Coupe, pliage et positionnement avec cales ; contrôle des diamètres, recouvrements et ancrages.","services.card3.title":"Bétonnage","services.card3.text":"Planification des fenêtres de coulage, cure et contrôle des joints de reprise. Essais et traçabilité.","services.card4.title":"Gestion de chantier","services.card4.text":"Journaux, métrés, briefings sécurité et reporting hebdomadaire avec indicateurs d'avancement.","services.card5.title":"QS & Chiffrage","services.card5.text":"Quantitatifs, plannings et plan de ressources.","services.card6.title":"Sécurité & Qualité","services.card6.text":"Plans de sécurité, check-lists de coffrage et inspections de conformité.",
                    "portfolio.title":"Références","portfolio.desc":"Exemples récents. Remplacez par vos réalisations réelles.","portfolio.item1":"Résidentiel Atlas — 12 000 m²","portfolio.item2":"Pont Est — portées de 40 m","portfolio.item3":"Parc Industriel Beta","portfolio.item4":"Hôpital Central — phase 2","portfolio.item5":"Tour Nord — 22 étages","portfolio.item6":"Centre commercial Riviera","portfolio.item7":"Service Finalisé - Résultat",
                    "video.title":"Notre équipe en action", "video.desc":"Découvrez la qualité et l'agilité de nos opérations sur le chantier.",
                    "contact.title":"Contactez-nous","contact.desc":"Remplissez le formulaire et nous revenons vers vous aujourd'hui. Ou écrivez-nous sur WhatsApp.","form.name":"Nom","form.company":"Entreprise","form.email":"E-mail","form.phone":"Téléphone","form.subject":"Sujet","form.opt.quote":"Devis","form.opt.partner":"Partenariat","form.opt.other":"Autres","form.message":"Message","form.send":"Envoyer","form.privacy":"En envoyant, vous acceptez notre politique de confidentialité.",
                    "footer.rights":"Tous droits réservés.","footer.languages":"Langues : FR • EN • JA"
                },
                en: {
                    brand: "JF SILVA CONSTRUÇÕES",
                    "nav.about":"About","nav.services":"Services","nav.portfolio":"Projects","nav.partners":"Partners","nav.contact":"Contact","nav.careers":"Careers","nav.cta":"Request a quote",
                    "hero.kicker":"Subcontracting • Formwork • Rebar","hero.title":"Engineering that wins contracts and delivers quality","hero.lead":"We are <strong>J&F SILVA</strong>, a company with <strong>200+ professionals</strong> focused on concrete structures, formwork and rebar. We serve general contractors with agility, safety and competitive cost.","hero.cta":"Request a quote","hero.secondary":"See projects",
                    "stats.people":"Professionals","stats.years":"Years of experience","stats.jobs":"Projects delivered",
                    "about.title":"About us","about.desc":"Trusted partner for civil works. Trained crews, safety first and on-time delivery. Eurocodes compliant.","about.card1.title":"Structure specialists","about.card1.text":"Formwork (coffrage/bekisting) and reinforcement (armatures/wapening) execution, cover control and concrete quality.","about.card2.title":"Productivity","about.card2.text":"Right-sized teams for ambitious goals, reducing delays and indirect costs.","about.card3.title":"Safety","about.card3.text":"Procedures and PPE per EU standards. Daily briefings and formwork inspections.",
                    "services.title":"Services","services.desc":"From planning to field execution, complete squads or staff augmentation.","services.card1.title":"Formwork & stripping","services.card1.text":"Modular setups for columns, beams, slabs and walls. Optimized reuse of panels and shoring.","services.card2.title":"Rebar & reinforcement","services.card2.text":"Cutting, bending and placement with spacers; checks for diameter, laps and anchorage.","services.card3.title":"Concrete placing","services.card3.text":"Pour windows planning, curing and cold-joint control. Testing and traceability.","services.card4.title":"Site management","services.card4.text":"Daily logs, quantity surveying and weekly reporting with progress KPIs.","services.card5.title":"QS & Estimating","services.card5.text":"Takeoffs, schedules and resource plans.","services.card6.title":"Safety & Quality","services.card6.text":"Safety plans, formwork checklists and compliance inspections.",
                    "portfolio.title":"Projects","portfolio.desc":"Recent samples. Replace with your real case studies.","portfolio.item1":"Atlas Residences — 12,000 m²","portfolio.item2":"East Bridge — 40 m spans","portfolio.item3":"Beta Industrial Park","portfolio.item4":"Central Hospital — phase 2","portfolio.item5":"North Tower — 22 floors","portfolio.item6":"Riviera Mall","portfolio.item7":"Completed Service - Result",
                    "video.title":"Our team in action", "video.desc":"See the quality and agility of our on-site operations.",
                    "contact.title":"Talk to us","contact.desc":"Fill out the form and we'll get back to you today. Or message us on WhatsApp.","form.name":"Name","form.company":"Company","form.email":"Email","form.phone":"Phone","form.subject":"Subject","form.opt.quote":"Quote","form.opt.partner":"Partnership","form.opt.other":"Other","form.message":"Message","form.send":"Send","form.privacy":"By sending, you agree to our privacy policy.",
                    "footer.rights":"All rights reserved.","footer.languages":"Languages: FR • EN • JA"
                },
                ja: {
                    brand: "JF SILVA CONSTRUÇÕES",
                    "nav.about":"会社概要","nav.services":"サービス","nav.portfolio":"実績","nav.partners":"パートナー","nav.contact":"お問い合わせ","nav.careers":"採用情報","nav.cta":"見積もり依頼",
                    "hero.kicker":"下請け • 型枠 • 鉄筋","hero.title":"契約を獲得し品質を届けるエンジニアリング","hero.lead":"私たちは <strong>J&F SILVA</strong>、<strong>200名以上</strong> のプロで構成された企業です。コンクリート構造・型枠・鉄筋に特化し、ゼネコン様へ機動力と安全性、競争力のあるコストで提供します。","hero.cta":"見積もり依頼","hero.secondary":"実績を見る",
                    "stats.people":"スタッフ","stats.years":"年の実績","stats.jobs":"完了プロジェクト",
                    "about.title":"会社概要","about.desc":"土木工事の信頼できるパートナー。訓練されたチーム、安全第一、納期厳守。ユーロコード準拠。","about.card1.title":"構造のプロフェッショナル","about.card1.text":"型枠（coffrage/bekisting）と鉄筋（armatures/wapening）の施工、かぶり管理とコンクリート品質。","about.card2.title":"生産性","about.card2.text":"高い目標に合わせた最適な人員配置で、遅延と間接費を削減。","about.card3.title":"安全","about.card3.text":"EU基準に沿った手順と保護具。毎日の朝礼と型枠点検。",
                    "services.title":"サービス","services.desc":"計画から現場施工まで、フルチームまたは人員補強に対応。","services.card1.title":"型枠・脱型","services.card1.text":"柱・梁・スラブ・壁のモジュール型枠。パネルと支保工の再利用を最適化。","services.card2.title":"鉄筋・配筋","services.card2.text":"切断・曲げ・配置（スペーサー使用）。径・定着・継手の確認。","services.card3.title":"コンクリート打設","services.card3.text":"打設計画、養生、打継管理。試験とトレーサビリティ。","services.card4.title":"現場管理","services.card4.text":"日報、出来高、週次レポート（進捗KPI）。","services.card5.title":"積算・見積","services.card5.text":"数量拾い、工程表、資源計画。","services.card6.title":"安全・品質","services.card6.text":"安全計画、型枠チェックリスト、適合検査。",
                    "portfolio.title":"実績","portfolio.desc":"最近のサンプル。公開時は実案件に差し替えてください。","portfolio.item1":"アトラスレジデンス — 12,000 m²","portfolio.item2":"イーストブリッジ — 40 m スパン","portfolio.item3":"ベータ工業団地","portfolio.item4":"中央病院 — 第2期","portfolio.item5":"ノースタワー — 22階","portfolio.item6":"リビエラ・モール","portfolio.item7":"完了サービス - 結果",
                    "video.title":"チームの活動","video.desc":"現場での作業の品質と俊敏性をご覧ください。",
                    "contact.title":"お問い合わせ","contact.desc":"フォーム送信で本日中にご連絡します。WhatsAppでも受付中。","form.name":"お名前","form.company":"会社名","form.email":"メール","form.phone":"電話","form.subject":"件名","form.opt.quote":"見積","form.opt.partner":"提携","form.opt.other":"その他","form.message":"メッセージ","form.send":"送信","form.privacy":"送信によりプライバシーポリシーに同意したものとします。",
                    "footer.rights":"無断転載禁止","footer.languages":"言語: FR • EN • JA"
                }
            };
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

            // Aplicar traduções
            const strings = this.dict[lang] || this.dict.pt;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (strings[key] !== undefined) {
                    el.innerHTML = strings[key];
                }
            });

            // Atualizar título da página
            const titles = {
                pt: 'JF SILVA CONSTRUÇÕES— Engenharia que gera resultados',
                fr: 'JF SILVA CONSTRUÇÕES— Ingénierie qui génère des résultats',
                en: 'JF SILVA CONSTRUÇÕES— Engineering that delivers results',
                ja: 'JF SILVA CONSTRUÇÕES— 結果を出すエンジニアリング'
            };
            document.title = titles[lang] || titles.fr;
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
