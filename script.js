let currentSlides = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
};

(function() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    if (sessionStorage.getItem('pageLoaded')) {
        preloader.classList.add('hide');
        document.body.style.overflow = '';
        return;
    }
    
    document.body.style.overflow = 'hidden';
    
    function hidePreloader() {
        preloader.classList.add('hide');
        document.body.style.overflow = '';
        sessionStorage.setItem('pageLoaded', 'true');
        
        setTimeout(() => {
            if (preloader && preloader.parentNode) {
                preloader.remove();
            }
        }, 800);
    }
    
    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 300);
    } else {
        window.addEventListener('load', function() {
            setTimeout(hidePreloader, 300);
        });
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    if (typeof initPreloader === 'function') {
        initPreloader();
    }
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; 
}

window.scrollTo(0, 0);

function initTheme() {
    const themeCheckbox = document.getElementById('themeCheckbox');
    const body = document.body;
    
    if (body.classList.contains('dark-theme')) {
        themeCheckbox.checked = true;
    }
    
    themeCheckbox.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        themeCheckbox.checked = false;
    } else if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeCheckbox.checked = true;
    }
}

function initEternalFlame() {
    const flame = document.getElementById('eternalFlame');
    const mainContent = document.getElementById('mainContent');
    
    if (!flame) return;
    
    function checkScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const contentHeight = mainContent.offsetHeight;
        
        const scrollProgress = Math.min(scrollY / (contentHeight - windowHeight), 1);
        
        if (scrollY > 100) {
            flame.classList.add('visible');
            const intensity = 0.5 + (scrollProgress * 0.5);
            flame.style.opacity = intensity;
        } else {
            flame.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
}

function initQuoteToggler() {
    const quoteRotator = document.getElementById('quoteRotator');
    const quoteToggle = document.getElementById('quoteToggle');
    
    if (!quoteRotator || !quoteToggle) return;
    
    const isCollapsed = localStorage.getItem('quoteCollapsed') === 'true';
    
    if (isCollapsed) {
        quoteRotator.classList.add('collapsed');
        quoteToggle.classList.add('collapsed');
    }
    
    quoteToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        quoteRotator.classList.toggle('collapsed');
        quoteToggle.classList.toggle('collapsed');
        
        localStorage.setItem('quoteCollapsed', quoteRotator.classList.contains('collapsed'));
    });
}

function initDescriptionButtons() {
    const descriptionToggles = document.querySelectorAll('.event-description__toggle');
    
    descriptionToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const description = this.closest('.event-description');
            description.classList.toggle('expanded');
            
            const textSpan = this.querySelector('.event-description__toggle-text');
            if (description.classList.contains('expanded')) {
                textSpan.textContent = 'Свернуть';
            } else {
                textSpan.textContent = 'Развернуть';
            }
        });
    });
}

function initHeroModal() {
    const heroModal = document.getElementById('heroModal');
    const heroModalContent = document.querySelector('.hero-modal__content');
    
    if (!heroModal || !heroModalContent) return;
    
    const heroModalImage = document.getElementById('heroModalImage');
    const heroModalTitle = document.getElementById('heroModalTitle');
    const heroModalYears = document.getElementById('heroModalYears');
    const heroModalDescription = document.getElementById('heroModalDescription');
    const heroModalClose = document.querySelector('.hero-modal__close');
    
    let scrollPosition = 0;
    
    document.querySelectorAll('.hero-card').forEach(card => {
        card.addEventListener('click', function(e) {
            scrollPosition = window.scrollY;
            
            const name = this.dataset.heroName;
            const years = this.dataset.heroYears;
            const description = this.dataset.heroDescription;
            const image = this.dataset.heroImage;
            
            if (heroModalTitle) heroModalTitle.textContent = name || 'Информация отсутствует';
            if (heroModalYears) heroModalYears.textContent = years || '';
            if (heroModalDescription) heroModalDescription.textContent = description || 'Подробная информация отсутствует';
            if (heroModalImage) {
                heroModalImage.src = image || 'https://via.placeholder.com/400x500/2a2a2a/ffffff?text=Нет+фото';
                heroModalImage.alt = `Фото ${name || 'героя'}`;
            }
            
            document.body.classList.add('modal-open');
            heroModal.style.display = 'block';
            
            heroModalContent.scrollTop = 0; 
            
            setTimeout(() => {
                heroModal.classList.add('active');
            }, 10);
        });
    });
    
    function closeHeroModal() {
        heroModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        window.scrollTo(0, scrollPosition);
        
        setTimeout(() => {
            heroModal.style.display = 'none';
        }, 400);
    }
    
    if (heroModalClose) {
        heroModalClose.addEventListener('click', closeHeroModal);
    }
    
    heroModal.addEventListener('click', function(e) {
        if (e.target.classList.contains('hero-modal__overlay')) {
            closeHeroModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && heroModal.classList.contains('active')) {
            closeHeroModal();
        }
    });
}

function initInlineVideo() {
    const videoCard = document.querySelector('.video-single .video-card');
    if (!videoCard) return;

    videoCard.addEventListener('click', function() {
        if (this.classList.contains('is-playing')) return;
        
        let videoId = this.dataset.video;
        if (videoId.includes('rutube.ru')) {
            const matches = videoId.match(/\/embed\/([a-f0-9]+)/);
            if (matches && matches[1]) {
                videoId = matches[1];
            }
        }

        const preview = this.querySelector('.video-card__preview');
        preview.innerHTML = `<iframe id="rutubeIframeInline" width="100%" height="100%" src="https://rutube.ru/play/embed/${videoId}?p=1&skinColor=e6830f" frameborder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>`;
        
        this.classList.add('is-playing');
    });
}

function initMobileFullscreen() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    const prompt = document.getElementById('orientationPrompt');
    const cancelBtn = document.getElementById('cancelFullscreenBtn');
    let pendingSlider = null;
    let hideTimeout = null;

    function hidePrompt() {
        if (!prompt) return;
        if (hideTimeout) clearTimeout(hideTimeout);
        prompt.classList.add('hiding');
        hideTimeout = setTimeout(() => {
            prompt.classList.remove('active');
            prompt.classList.remove('hiding');
            hideTimeout = null;
        }, 400);
    }

    function showPrompt() {
        if (!prompt) return;
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        prompt.classList.remove('hiding');
        prompt.classList.add('active');
        setTimeout(() => {
            if (prompt.classList.contains('active')) {
                prompt.classList.add('showing');
            }
        }, 10);
        setTimeout(() => {
            if (prompt.classList.contains('active')) {
                prompt.classList.remove('showing');
            }
        }, 400);
    }

    function exitFullscreen() {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
        document.querySelectorAll('.gallery-slider').forEach(s => s.classList.remove('is-fullscreen'));
        hidePrompt();
        pendingSlider = null;
    }

    function enterRealFullscreen(el) {
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        }
        el.classList.add('is-fullscreen');
        hidePrompt();
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hidePrompt();
            pendingSlider = null;
        });
    }

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.mobile-fullscreen-btn');
        if (!btn) return;
        
        const slider = btn.closest('.gallery-slider');
        if (!slider) return;

        if (document.fullscreenElement || document.webkitFullscreenElement) {
            exitFullscreen();
            return;
        }

        const isLandscape = window.innerWidth > window.innerHeight;

        if (isLandscape) {
            enterRealFullscreen(slider);
        } else {
            pendingSlider = slider;
            showPrompt();
        }
    });

    window.addEventListener('resize', () => {
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isLandscape && pendingSlider) {
            enterRealFullscreen(pendingSlider);
            pendingSlider = null;
        }
        
        if (!isLandscape && (document.fullscreenElement || document.webkitFullscreenElement)) {
            exitFullscreen();
        }
    });

    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            document.querySelectorAll('.gallery-slider').forEach(s => s.classList.remove('is-fullscreen'));
            hidePrompt();
            pendingSlider = null;
        }
    });

    function injectButtons() {
        document.querySelectorAll('.gallery-slider').forEach(slider => {
            if (!slider.querySelector('.mobile-fullscreen-btn')) {
                const btn = document.createElement('div');
                btn.className = 'mobile-fullscreen-btn';
                btn.innerHTML = '⛶';
                slider.appendChild(btn);
            }
        });
    }
    injectButtons();
    
    const observer = new MutationObserver(() => injectButtons());
    observer.observe(document.body, { childList: true, subtree: true });
}

function initVerticalScrollbar() {
    const containers = document.querySelectorAll('.vertical-image-container');
    
    containers.forEach((container, index) => {
        const wrapper = container.querySelector('.vertical-image-wrapper');
        const image = container.querySelector('.vertical-image');
        
        if (!wrapper) return;
        
        function updateScrollIndicator() {
            const containerHeight = container.offsetHeight;
            const scrollHeight = wrapper.scrollHeight;
            const canScroll = scrollHeight > containerHeight + 5;
            
            if (canScroll) {
                container.style.setProperty('--thumb-opacity', '0.5');
            } else {
                container.style.setProperty('--thumb-opacity', '0');
            }
        }
        
        wrapper.addEventListener('scroll', function() {
            requestAnimationFrame(updateScrollIndicator);
        });
        
        if (image) {
            if (image.complete) {
                setTimeout(updateScrollIndicator, 100);
            } else {
                image.onload = function() {
                    setTimeout(updateScrollIndicator, 100);
                };
            }
        }
        
        window.addEventListener('resize', function() {
            setTimeout(updateScrollIndicator, 100);
        });
        
        setTimeout(updateScrollIndicator, 200);
        setTimeout(updateScrollIndicator, 500);
    });
}

function initScrollHint() {
    window.updateHintForSecondSlide = function() {
        const sliderTrack = document.getElementById('slideTrack1');
        if (!sliderTrack) return;
        const secondSlide = sliderTrack.children[1];
        if (!secondSlide) return;
        setupHintLogic(secondSlide);
    }
    
    window.updateHintForFourthSlide = function() {
        const sliderTrack = document.getElementById('slideTrack1');
        if (!sliderTrack) return;
        const fourthSlide = sliderTrack.children[4];
        if (!fourthSlide) return;
        setupHintLogic(fourthSlide);
    }

    window.updateHintForSMOSecondSlide = function() {
        const sliderTrack = document.getElementById('slideTrack2');
        if (!sliderTrack) return;
        const secondSlide = sliderTrack.children[1];
        if (!secondSlide) return;
        setupHintLogic(secondSlide);
    }

    window.updateHintForSMOFourthSlide = function() {
        const sliderTrack = document.getElementById('slideTrack2');
        if (!sliderTrack) return;
        const fourthSlide = sliderTrack.children[3];
        if (!fourthSlide) return;
        setupHintLogic(fourthSlide);
    }

    window.updateHintForCrimeaSpringSecondSlide = function() {
        const sliderTrack = document.getElementById('slideTrack3');
        if (!sliderTrack) return;
        const secondSlide = sliderTrack.children[1];
        if (!secondSlide) return;
        setupHintLogic(secondSlide);
    }

    function setupHintLogic(slideNode) {
        const oldHint = slideNode.querySelector('.scroll-hint');
        if (oldHint) oldHint.remove();
        
        const hint = document.createElement('div');
        hint.className = 'scroll-hint';
        hint.innerHTML = '⬇ листай ⬇';
        slideNode.appendChild(hint);
        
        const wrapper = slideNode.querySelector('.vertical-image-wrapper');
        if (!wrapper) return;
        
        let hintHidden = false;
        
        function checkScrollAndHideHint() {
            if (hintHidden) return;
            if (wrapper.scrollTop > 20) {
                hint.classList.remove('show');
                hint.classList.add('fade-out');
                hintHidden = true;
                setTimeout(() => {
                    if (hint && hint.parentNode) hint.remove();
                }, 500);
            }
        }
        
        wrapper.addEventListener('scroll', function() {
            requestAnimationFrame(checkScrollAndHideHint);
        });
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (slideNode.classList.contains('active-caption')) {
                        setTimeout(() => {
                            if (!hintHidden && hint && hint.parentNode) {
                                hint.classList.add('show');
                                hint.classList.remove('fade-out');
                            }
                        }, 100);
                    } else {
                        if (hint && hint.parentNode) {
                            hint.classList.remove('show');
                            hint.classList.add('fade-out');
                        }
                    }
                }
            });
        });
        
        observer.observe(slideNode, { attributes: true });
        
        if (slideNode.classList.contains('active-caption')) {
            setTimeout(() => {
                if (!hintHidden && hint && hint.parentNode) {
                    hint.classList.add('show');
                }
            }, 100);
        }
    }
    
    setTimeout(() => {
        if(window.updateHintForSecondSlide) window.updateHintForSecondSlide();
        if(window.updateHintForFourthSlide) window.updateHintForFourthSlide();
        if(window.updateHintForSMOSecondSlide) window.updateHintForSMOSecondSlide();
        if(window.updateHintForSMOFourthSlide) window.updateHintForSMOFourthSlide();
        if(window.updateHintForCrimeaSpringSecondSlide) window.updateHintForCrimeaSpringSecondSlide();
    }, 500);
    
    const originalSlideNext = window.slideNext;
    window.slideNext = function(sliderId) {
        if (originalSlideNext) originalSlideNext(sliderId);
        if (sliderId === 1) {
            setTimeout(() => {
                if(window.updateHintForSecondSlide) window.updateHintForSecondSlide();
                if(window.updateHintForFourthSlide) window.updateHintForFourthSlide();
            }, 300);
        }
        if (sliderId === 2) {
            setTimeout(() => {
                if(window.updateHintForSMOSecondSlide) window.updateHintForSMOSecondSlide();
                if(window.updateHintForSMOFourthSlide) window.updateHintForSMOFourthSlide();
            }, 300);
        }
        if (sliderId === 3) {
            setTimeout(() => {
                if(window.updateHintForCrimeaSpringSecondSlide) window.updateHintForCrimeaSpringSecondSlide();
            }, 300);
        }
    };
    
    const originalSlidePrev = window.slidePrev;
    window.slidePrev = function(sliderId) {
        if (originalSlidePrev) originalSlidePrev(sliderId);
        if (sliderId === 1) {
            setTimeout(() => {
                if(window.updateHintForSecondSlide) window.updateHintForSecondSlide();
                if(window.updateHintForFourthSlide) window.updateHintForFourthSlide();
            }, 300);
        }
        if (sliderId === 2) {
            setTimeout(() => {
                if(window.updateHintForSMOSecondSlide) window.updateHintForSMOSecondSlide();
                if(window.updateHintForSMOFourthSlide) window.updateHintForSMOFourthSlide();
            }, 300);
        }
        if (sliderId === 3) {
            setTimeout(() => {
                if(window.updateHintForCrimeaSpringSecondSlide) window.updateHintForCrimeaSpringSecondSlide();
            }, 300);
        }
    };
}

function initScrollText() {
    const textConfig = {
        slide4: [
            { threshold: 0, title: "Наградной лист Я.Г. Крейзера", description: "О присвоении звания «Герой Советского Союза»" },
            { threshold: 65, title: "Указ о присвоении звания", description: "Копия указа Президиума Верховного Совета СССР о присвоении звания «Герой Советского Союза» Крейзеру Я.Г." }
        ]
    };
    
    function updateTextForSlide(slideId, scrollPercent) {
        const slide = document.getElementById(slideId);
        if (!slide) return;
        
        const captionElement = slide.querySelector('.slider-caption');
        if (!captionElement) return;
        
        const titleElement = captionElement.querySelector('h3');
        const descriptionElement = captionElement.querySelector('p');
        const mainTextElement = captionElement.querySelector('.main-text');
        const scrollTextElement = captionElement.querySelector('.scroll-text');
        
        const config = textConfig[slideId];
        if (!config) return;
        
        let currentConfig = config[0];
        for (let i = config.length - 1; i >= 0; i--) {
            if (scrollPercent >= config[i].threshold) {
                currentConfig = config[i];
                break;
            }
        }
        
        if (titleElement && titleElement.textContent !== currentConfig.title) {
            titleElement.style.transition = 'opacity 0.3s ease';
            titleElement.style.opacity = '0';
            setTimeout(() => {
                titleElement.textContent = currentConfig.title;
                titleElement.style.opacity = '1';
            }, 150);
        }
        
        if (scrollTextElement) {
            if (scrollTextElement.textContent !== currentConfig.description) {
                scrollTextElement.style.transition = 'opacity 0.3s ease';
                scrollTextElement.style.opacity = '0';
                setTimeout(() => {
                    scrollTextElement.textContent = currentConfig.description;
                    scrollTextElement.style.opacity = '1';
                }, 150);
            }
        } else if (mainTextElement) {
            if (mainTextElement.textContent !== currentConfig.description) {
                mainTextElement.style.transition = 'opacity 0.3s ease';
                mainTextElement.style.opacity = '0';
                setTimeout(() => {
                    mainTextElement.textContent = currentConfig.description;
                    mainTextElement.style.opacity = '1';
                }, 150);
            }
        } else if (descriptionElement) {
            if (descriptionElement.textContent !== currentConfig.description) {
                descriptionElement.style.transition = 'opacity 0.3s ease';
                descriptionElement.style.opacity = '0';
                setTimeout(() => {
                    descriptionElement.textContent = currentConfig.description;
                    descriptionElement.style.opacity = '1';
                }, 150);
            }
        }
    }
    
    const slide4 = document.getElementById('slide4');
    if (slide4) {
        const wrapper4 = slide4.querySelector('.vertical-image-wrapper');
        const container4 = slide4.querySelector('.vertical-image-container');
        if (wrapper4 && container4) {
            let ticking = false;
            wrapper4.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        const scrollTop = wrapper4.scrollTop;
                        const scrollHeight = wrapper4.scrollHeight - container4.offsetHeight;
                        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                        updateTextForSlide('slide4', scrollPercent);
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }
    
    const sliderTrack = document.getElementById('slideTrack1');
    if (sliderTrack) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const slide4 = document.getElementById('slide4');
                    if (slide4 && slide4.classList.contains('active-caption')) {
                        const wrapper = slide4.querySelector('.vertical-image-wrapper');
                        if (wrapper) {
                            setTimeout(() => {
                                wrapper.dispatchEvent(new Event('scroll'));
                            }, 100);
                        }
                    }
                }
            });
        });
        observer.observe(sliderTrack, { attributes: true, attributeFilter: ['style'] });
    }
}

function initHamburgerMenu() {
    const hamburgerBtn   = document.getElementById('hamburgerBtn');
    const mobileNav      = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileOverlay  = document.getElementById('mobileNavOverlay');
    const mobileLinks    = document.querySelectorAll('.mobile-nav__links a');
    const mobileThemeChk = document.querySelector('.theme-checkbox--mobile');

    if (!hamburgerBtn || !mobileNav) return;

    function syncMobileTheme() {
        const mainChk = document.getElementById('themeCheckbox');
        if (mobileThemeChk && mainChk) {
            mobileThemeChk.checked = mainChk.checked;
        }
    }
    syncMobileTheme();

    if (mobileThemeChk) {
        mobileThemeChk.addEventListener('change', function () {
            const mainChk = document.getElementById('themeCheckbox');
            if (mainChk) {
                mainChk.checked = this.checked;
                mainChk.dispatchEvent(new Event('change'));
            }
        });
    }

    function openMenu() {
        hamburgerBtn.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        syncMobileTheme();
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', openMenu);
    if (mobileNavClose)  mobileNavClose.addEventListener('click', closeMenu);
    if (mobileOverlay)   mobileOverlay.addEventListener('click',  closeMenu);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
    });

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.dataset.page;

            mobileLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            closeMenu();

            setTimeout(function () {
                const desktopLink = document.querySelector('.nav__link[data-page="' + pageId + '"]');
                if (desktopLink) desktopLink.click();
            }, 150);
        });
    });

    document.querySelectorAll('.nav__link').forEach(function (link) {
        link.addEventListener('click', function () {
            const pageId = this.dataset.page;
            mobileLinks.forEach(function (ml) {
                ml.classList.toggle('active', ml.dataset.page === pageId);
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initEternalFlame();
    initQuoteToggler();
    initDescriptionButtons();
    initHeroModal();
    initVerticalScrollbar();
    initScrollHint();
    initScrollText();
    initHamburgerMenu();
    initSwipeForSliders();
    initInlineVideo();
    initMobileFullscreen();
    
    const navLinks = document.querySelectorAll('.nav__link');
    const logoHome = document.getElementById('logoHome');
    const pages = {
        home: document.getElementById('homePage'),
        gallery: document.getElementById('galleryPage'),
        videos: document.getElementById('videosPage')
    };

    function switchToPage(pageId) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav__link[data-page="${pageId}"]`);
        if (link) link.classList.add('active');
        
        Object.values(pages).forEach(p => {
            if(p) p.classList.remove('active');
        });
        if (pages[pageId]) pages[pageId].classList.add('active');
        
        history.pushState(null, '', `#${pageId}`);
        
        document.querySelectorAll('.event-description').forEach(el => {
            el.classList.remove('fade-in');
            void el.offsetWidth;
            el.classList.add('fade-in');
        });

        if (pageId !== 'videos') {
            const rutubePlayer = document.getElementById('rutubeIframeInline');
            if (rutubePlayer && rutubePlayer.contentWindow) {
                rutubePlayer.contentWindow.postMessage(JSON.stringify({
                    type: 'player:pause',
                    data: {}
                }), '*');
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            switchToPage(pageId);
        });
    });

    if (logoHome) {
        logoHome.addEventListener('click', function(e) {
            e.preventDefault();
            switchToPage('home');
        });
    }

    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (pages[hash]) switchToPage(hash);
    }

    const quotes = document.querySelectorAll('.quote-slide');
    let currentQuote = 0;

    function showNextQuote() {
        if (!quotes.length) return;
        const quoteRotator = document.getElementById('quoteRotator');
        if (quoteRotator && quoteRotator.classList.contains('collapsed')) return;
        
        quotes[currentQuote].classList.remove('active');
        currentQuote = (currentQuote + 1) % quotes.length;
        quotes[currentQuote].classList.add('active');
    }

    if (quotes.length) setInterval(showNextQuote, 10000);

    setTimeout(() => {
        const savedMainTab = localStorage.getItem('activeMainTab');
        if (savedMainTab) {
            const mainBtn = document.querySelector(`[data-main-tab="${savedMainTab}"]`);
            if (mainBtn) mainBtn.click();
        }
    }, 100);

    const mainTabBtns = document.querySelectorAll('[data-main-tab]');
    const mainPanels = {
        0: document.getElementById('mainPanel0'),
        1: document.getElementById('mainPanel1'),
        2: document.getElementById('mainPanel2')
    };

    function updateMainPanelHeight(mainPanelId) {
        const mainPanel = document.getElementById(mainPanelId);
        if (!mainPanel) return;
        const activeSubPanel = mainPanel.querySelector('.sub-panel.active');
        if (activeSubPanel) {
            const height = activeSubPanel.scrollHeight; 
            mainPanel.style.minHeight = height + 'px';
        }
    }

    mainTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabIndex = this.dataset.mainTab;
            localStorage.setItem('activeMainTab', tabIndex);
            
            mainTabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            Object.values(mainPanels).forEach(p => { if(p) p.classList.remove('active'); });
            if (mainPanels[tabIndex]) mainPanels[tabIndex].classList.add('active');
            
            const activePanel = mainPanels[tabIndex];
            if(activePanel) {
                const description = activePanel.querySelector('.event-description');
                if (description) {
                    description.classList.remove('fade-in');
                    void description.offsetWidth;
                    description.classList.add('fade-in');
                    description.classList.remove('expanded');
                    const toggle = description.querySelector('.event-description__toggle');
                    if (toggle) {
                        const textSpan = toggle.querySelector('.event-description__toggle-text');
                        if (textSpan) textSpan.textContent = 'Развернуть';
                    }
                }
            }
            
            const savedSubTab = localStorage.getItem('activeSubTab_mainPanel' + tabIndex);
            
            if (tabIndex === '1') {
                const subPanels = document.querySelectorAll('#mainPanel1 .sub-panel');
                const subBtns = document.querySelectorAll('#mainPanel1 .sub-tab-btn');
                subPanels.forEach(p => p.classList.remove('active'));
                subBtns.forEach(b => b.classList.remove('active'));
                
                let targetSubIndex = savedSubTab !== null ? savedSubTab : '0';
                const targetPanel = document.getElementById('subPanel' + targetSubIndex);
                const targetBtn = document.querySelector(`#mainPanel1 .sub-tab-btn[data-sub-tab="${targetSubIndex}"]`);
                
                if(targetPanel) targetPanel.classList.add('active');
                if(targetBtn) targetBtn.classList.add('active');
                
                setTimeout(() => updateMainPanelHeight('mainPanel1'), 100);
            } else if (tabIndex === '0') {
                const wowSubPanels = document.querySelectorAll('#mainPanel0 .sub-panel');
                const wowSubBtns = document.querySelectorAll('#mainPanel0 .sub-tab-btn');
                wowSubPanels.forEach(p => p.classList.remove('active'));
                wowSubBtns.forEach(b => b.classList.remove('active'));
                
                let targetSubIndex = savedSubTab !== null ? savedSubTab : '0';
                const targetPanel = document.getElementById('wowSubPanel' + targetSubIndex);
                const targetBtn = document.querySelector(`#mainPanel0 .sub-tab-btn[data-sub-tab="${targetSubIndex}"]`);
                
                if(targetPanel) targetPanel.classList.add('active');
                if(targetBtn) targetBtn.classList.add('active');
                
                setTimeout(() => updateMainPanelHeight('mainPanel0'), 100);
            }
        });
    });

    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const subPanels = { 0: document.getElementById('subPanel0'), 1: document.getElementById('subPanel1') };
    const wowSubPanels = { 0: document.getElementById('wowSubPanel0'), 1: document.getElementById('wowSubPanel1'), 2: document.getElementById('wowSubPanel2') };

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabIndex = this.dataset.subTab;
            const mainPanel = this.closest('.main-panel');
            if (!mainPanel) return;

            const currentHeight = mainPanel.offsetHeight;
            mainPanel.style.minHeight = currentHeight + 'px';

            const parentTabs = this.closest('.sub-tabs');
            const parentBtns = parentTabs.querySelectorAll('.sub-tab-btn');
            parentBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            localStorage.setItem('activeSubTab_' + mainPanel.id, tabIndex);
            
            if (mainPanel.id === 'mainPanel1') {
                Object.values(subPanels).forEach(p => { if (p) p.classList.remove('active'); });
                if (subPanels[tabIndex]) subPanels[tabIndex].classList.add('active');
            } else if (mainPanel.id === 'mainPanel0') {
                Object.values(wowSubPanels).forEach(p => { if (p) p.classList.remove('active'); });
                if (wowSubPanels[tabIndex]) wowSubPanels[tabIndex].classList.add('active');
            }

            requestAnimationFrame(() => updateMainPanelHeight(mainPanel.id));
        });
    });

    const exhibitCards = document.querySelectorAll('.exhibit-card');
    exhibitCards.forEach(card => {
        card.addEventListener('click', function() {
            const mainTab = this.dataset.tabMain;
            const subTab = this.dataset.tabSub || '0';
            
            localStorage.setItem('activeMainTab', mainTab);
            localStorage.setItem('activeSubTab_mainPanel' + mainTab, subTab);
            
            switchToPage('gallery');
            
            const mainBtn = document.querySelector(`[data-main-tab="${mainTab}"]`);
            if (mainBtn) setTimeout(() => mainBtn.click(), 100);
            
            if (mainTab === '1') {
                setTimeout(() => {
                    const subBtn = document.querySelector(`[data-sub-tab="${subTab}"]`);
                    if (subBtn) subBtn.click();
                }, 200);
            }
        });
    });

    window.slidePrev = function(sliderId) {
        const track = document.getElementById(`slideTrack${sliderId}`);
        if (!track) return;
        const totalItems = track.children.length;
        if (currentSlides[sliderId] === undefined) currentSlides[sliderId] = 0;
        let prevIndex = (currentSlides[sliderId] - 1 + totalItems) % totalItems;
        goToSlide(sliderId, prevIndex);
    };

    window.slideNext = function(sliderId) {
        const track = document.getElementById(`slideTrack${sliderId}`);
        if (!track) return;
        const totalItems = track.children.length;
        if (currentSlides[sliderId] === undefined) currentSlides[sliderId] = 0;
        let nextIndex = (currentSlides[sliderId] + 1) % totalItems;
        goToSlide(sliderId, nextIndex);
    };

    function updateSlider(sliderId, index) {
        const track = document.getElementById(`slideTrack${sliderId}`);
        if (!track) return;
        const items = track.children;
        track.style.transform = `translateX(-${index * 100}%)`;
        Array.from(items).forEach((item, i) => {
            if (i === index) item.classList.add('active-caption');
            else item.classList.remove('active-caption');
        });
    }
    
    [1,2,3,4,5,6,7,8].forEach(id => updateSlider(id, 0));
    
    document.querySelectorAll('.event-description').forEach(el => el.classList.add('fade-in'));
});

window.addEventListener('load', function() {
    initVerticalScrollbar();
    initScrollHint();
    initScrollText();
});

function initSliderButtonsVisibility() {
    const slidesFullyScrolled = { slide2: false, slide5: false, smoSlide2: false, smoSlide4: false };
    
    function checkScrollEnd(sliderId, slideIndex) {
        const sliderTrack = document.getElementById(`slideTrack${sliderId}`);
        if (!sliderTrack) return false;
        const slide = sliderTrack.children[slideIndex];
        if (!slide) return false;
        const wrapper = slide.querySelector('.vertical-image-wrapper');
        const container = slide.querySelector('.vertical-image-container');
        if (!wrapper || !container) return false;
        
        const scrollTop = wrapper.scrollTop;
        const scrollHeight = wrapper.scrollHeight;
        const containerHeight = container.offsetHeight;
        return (scrollTop + containerHeight) >= (scrollHeight - 5);
    }
    
    function updateButtonsVisibility(sliderId) {
        const sliderControls = document.querySelector(`#slider${sliderId} .slider-controls`);
        if (!sliderControls) return;
        const nextBtn = sliderControls.querySelector('.next-btn') || sliderControls.querySelector('.slider-btn:last-child');
        const prevBtn = sliderControls.querySelector('.prev-btn') || sliderControls.querySelector('.slider-btn:first-child');
        if (!nextBtn || !prevBtn) return;
        const activeSlideIndex = currentSlides[sliderId] || 0;
        
        if (sliderId === 1) {
            if (activeSlideIndex === 1) {
                if (checkScrollEnd(1, 1)) { slidesFullyScrolled.slide2 = true; showBtn(nextBtn); }
                else if (!slidesFullyScrolled.slide2) hideBtn(nextBtn);
                else showBtn(nextBtn);
            } 
            else if (activeSlideIndex === 4) {
                if (checkScrollEnd(1, 4)) { slidesFullyScrolled.slide5 = true; showBtn(nextBtn); }
                else if (!slidesFullyScrolled.slide5) hideBtn(nextBtn);
                else showBtn(nextBtn);
            } else showBtn(nextBtn);
            showBtn(prevBtn);
        }

        if (sliderId === 2) {
            if (activeSlideIndex === 1) {
                if (checkScrollEnd(2, 1)) { slidesFullyScrolled.smoSlide2 = true; showBtn(nextBtn); }
                else if (!slidesFullyScrolled.smoSlide2) hideBtn(nextBtn);
                else showBtn(nextBtn);
            } 
            else if (activeSlideIndex === 3) {
                if (checkScrollEnd(2, 3)) { slidesFullyScrolled.smoSlide4 = true; showBtn(nextBtn); }
                else if (!slidesFullyScrolled.smoSlide4) hideBtn(nextBtn);
                else showBtn(nextBtn);
            } else showBtn(nextBtn);
            showBtn(prevBtn);
        }
    }

    function showBtn(btn) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; btn.style.visibility = 'visible'; }
    function hideBtn(btn) { btn.style.opacity = '0'; btn.style.pointerEvents = 'none'; btn.style.visibility = 'hidden'; }
    
    function addButtonTransitionStyles() {
        if (document.getElementById('btn-transitions-style')) return;
        const style = document.createElement('style');
        style.id = 'btn-transitions-style';
        style.textContent = `.slider-controls .next-btn, .slider-controls .slider-btn:last-child { transition: opacity 0.4s ease, visibility 0.4s ease, background-color 0.3s ease, transform 0.2s ease; }`;
        document.head.appendChild(style);
    }
    addButtonTransitionStyles();
    
    function initScrollTracking() {
        const track1 = document.getElementById('slideTrack1');
        if (track1) { [1, 4].forEach(index => { const slide = track1.children[index]; if (slide) { const w = slide.querySelector('.vertical-image-wrapper'); if(w) w.addEventListener('scroll', () => updateButtonsVisibility(1)); } }); }
        const track2 = document.getElementById('slideTrack2');
        if (track2) { [1, 3].forEach(index => { const slide = track2.children[index]; if (slide) { const w = slide.querySelector('.vertical-image-wrapper'); if(w) w.addEventListener('scroll', () => updateButtonsVisibility(2)); } }); }
    }
    
    function observeSlideChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    setTimeout(() => { updateButtonsVisibility(1); updateButtonsVisibility(2); initScrollTracking(); }, 100);
                }
            });
        });
        const track1 = document.getElementById('slideTrack1'), track2 = document.getElementById('slideTrack2');
        if (track1) observer.observe(track1, { attributes: true, attributeFilter: ['style'] });
        if (track2) observer.observe(track2, { attributes: true, attributeFilter: ['style'] });
    }
    
    setTimeout(() => {
        updateButtonsVisibility(1); updateButtonsVisibility(2); initScrollTracking(); observeSlideChanges();
        setTimeout(() => { updateButtonsVisibility(1); updateButtonsVisibility(2); }, 300);
    }, 500);
    
    const originalSlideNext = window.slideNext, originalSlidePrev = window.slidePrev;
    window.slideNext = function(sliderId) {
        if (originalSlideNext) originalSlideNext(sliderId);
        if (sliderId === 1 || sliderId === 2) { setTimeout(() => { updateButtonsVisibility(sliderId); initScrollTracking(); }, 300); }
    };
    window.slidePrev = function(sliderId) {
        if (originalSlidePrev) originalSlidePrev(sliderId);
        if (sliderId === 1 || sliderId === 2) { setTimeout(() => { updateButtonsVisibility(sliderId); initScrollTracking(); }, 300); }
    };
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initSliderButtonsVisibility, 1000));
window.addEventListener('load', () => setTimeout(initSliderButtonsVisibility, 500));

function initPageScrollBehavior() {
    function hasVerticalScroll(element) {
        if (!element) return false;
        const wrapper = element.querySelector('.vertical-image-wrapper'), container = element.querySelector('.vertical-image-container');
        if (!wrapper || !container) return false;
        return wrapper.scrollHeight > container.offsetHeight + 5;
    }
    
    function updateSlideScrollStatus() {
        document.querySelectorAll('.slider-item').forEach(item => {
            if (hasVerticalScroll(item)) item.classList.add('has-vertical-scroll');
            else item.classList.remove('has-vertical-scroll');
        });
    }
    
    updateSlideScrollStatus();
    window.addEventListener('resize', updateSlideScrollStatus);
    const observer = new MutationObserver(() => setTimeout(updateSlideScrollStatus, 100));
    document.querySelectorAll('.slider-track').forEach(track => observer.observe(track, { attributes: true, attributeFilter: ['style'] }));
    
    document.querySelectorAll('.slider-item').forEach(item => {
        item.addEventListener('wheel', function(e) {
            const wrapper = this.querySelector('.vertical-image-wrapper');
            if (!wrapper || !this.classList.contains('active-caption')) return;
            const container = this.querySelector('.vertical-image-container');
            const scrollTop = wrapper.scrollTop, scrollHeight = wrapper.scrollHeight, containerHeight = container.offsetHeight;
            if (scrollTop === 0 && e.deltaY < 0) return;
            if (scrollTop + containerHeight >= scrollHeight && e.deltaY > 0) return;
            e.stopPropagation();
        }, { passive: false });
    });
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initPageScrollBehavior, 1500));
window.addEventListener('load', () => setTimeout(initPageScrollBehavior, 1000));

function initArmyScrollHint() {
    function updateHint(slideIndex) {
        const sliderTrack = document.getElementById('slideTrack4');
        if (!sliderTrack) return;
        const slide = sliderTrack.children[slideIndex];
        if (!slide) return;
        const oldHint = slide.querySelector('.scroll-hint');
        if (oldHint) oldHint.remove();
        
        const hint = document.createElement('div');
        hint.className = 'scroll-hint'; hint.innerHTML = '⬇ листай ⬇';
        slide.appendChild(hint);
        
        const wrapper = slide.querySelector('.vertical-image-wrapper');
        if (!wrapper) return;
        
        let hintHidden = false;
        function checkScroll() {
            if (hintHidden) return;
            if (wrapper.scrollTop > 20) {
                hint.classList.remove('show'); hint.classList.add('fade-out'); hintHidden = true;
                setTimeout(() => { if (hint && hint.parentNode) hint.remove(); }, 500);
            }
        }
        wrapper.addEventListener('scroll', () => requestAnimationFrame(checkScroll));
        
        new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.attributeName === 'class') {
                    if (slide.classList.contains('active-caption')) { setTimeout(() => { if (!hintHidden && hint && hint.parentNode) { hint.classList.add('show'); hint.classList.remove('fade-out'); } }, 100); }
                    else { if (hint && hint.parentNode) { hint.classList.remove('show'); hint.classList.add('fade-out'); } }
                }
            });
        }).observe(slide, { attributes: true });
        
        if (slide.classList.contains('active-caption')) setTimeout(() => { if (!hintHidden && hint && hint.parentNode) hint.classList.add('show'); }, 100);
    }
    
    setTimeout(() => { updateHint(1); updateHint(2); }, 600);
    
    const originalNext = window.slideNext, originalPrev = window.slidePrev;
    window.slideNext = function(id) { if(originalNext) originalNext(id); if (id === 4) setTimeout(() => { updateHint(1); updateHint(2); }, 300); };
    window.slidePrev = function(id) { if(originalPrev) originalPrev(id); if (id === 4) setTimeout(() => { updateHint(1); updateHint(2); }, 300); };
}

function initArmyButtonsVisibility() {
    const slidesFullyScrolled = { slide2: false, slide3: false, slide5: false };
    function checkEnd(id, idx) {
        const track = document.getElementById(`slideTrack${id}`); if(!track) return false;
        const slide = track.children[idx]; if(!slide) return false;
        const w = slide.querySelector('.vertical-image-wrapper'), c = slide.querySelector('.vertical-image-container');
        if(!w || !c) return false;
        return (w.scrollTop + c.offsetHeight) >= (w.scrollHeight - 5);
    }
    
    function updateBtns(id) {
        const ctrl = document.querySelector(`#slider${id} .slider-controls`); if(!ctrl) return;
        const nBtn = ctrl.querySelector('.slider-btn:last-child'), pBtn = ctrl.querySelector('.slider-btn:first-child');
        if(!nBtn || !pBtn) return;
        const activeIdx = currentSlides[id];
        
        if (id === 4) {
            if (activeIdx === 1) {
                if(checkEnd(id, 1)) { slidesFullyScrolled.slide2 = true; show(nBtn); } else if(!slidesFullyScrolled.slide2) hide(nBtn); else show(nBtn);
            } else if (activeIdx === 2) {
                if(checkEnd(id, 2)) { slidesFullyScrolled.slide3 = true; show(nBtn); } else if(!slidesFullyScrolled.slide3) hide(nBtn); else show(nBtn);
            } else if (activeIdx === 4) {
                if(checkEnd(id, 4)) { slidesFullyScrolled.slide5 = true; show(nBtn); } else if(!slidesFullyScrolled.slide5) hide(nBtn); else show(nBtn);
            } else { show(nBtn); }
            show(pBtn);
        }
    }
    
    function show(b) { b.style.opacity = '1'; b.style.pointerEvents = 'auto'; b.style.visibility = 'visible'; }
    function hide(b) { b.style.opacity = '0'; b.style.pointerEvents = 'none'; b.style.visibility = 'hidden'; }
    
    function initScroll() {
        const track = document.getElementById('slideTrack4'); if(!track) return;
        [1,2,4].forEach(i => { const s = track.children[i]; if(s) { const w = s.querySelector('.vertical-image-wrapper'); if(w) w.addEventListener('scroll', () => updateBtns(4)); } });
    }
    
    const track = document.getElementById('slideTrack4');
    if(track) new MutationObserver(m => { m.forEach(x => { if(x.type === 'attributes' && x.attributeName === 'style') setTimeout(() => { updateBtns(4); initScroll(); }, 100); }); }).observe(track, {attributes: true, attributeFilter: ['style']});
    
    setTimeout(() => { updateBtns(4); initScroll(); }, 600);
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(initArmyScrollHint, 1500); setTimeout(initArmyButtonsVisibility, 1600); });
window.addEventListener('load', () => { setTimeout(initArmyScrollHint, 1000); setTimeout(initArmyButtonsVisibility, 1100); });

function initArmyFifthSlideScrollText() {
    const config = {
        slide5_army: [
            { threshold: 0, title: "Документы", description: "Копия отчета о Крымской операции 51-й армии" },
            { threshold: 35, title: "Документы", description: "Копия отчета об итогах боевых действий 51-й армии с 23.04.1944 по 25.04.1944г" },
            { threshold: 75, title: "Документы", description: "Копия справки о противнике перед фронтом 51-й армии на 25.04.1944 г" }
        ]
    };
    
    function updateText(id, percent) {
        const slide = document.getElementById(id); if(!slide) return;
        const caption = slide.querySelector('.slider-caption'); if(!caption) return;
        const tElem = caption.querySelector('h3'), dElem = caption.querySelector('p, .scroll-text');
        if(!config[id]) return;
        let cur = config[id][0];
        for(let i = config[id].length - 1; i >= 0; i--) { if(percent >= config[id][i].threshold) { cur = config[id][i]; break; } }
        
        if (tElem && tElem.textContent !== cur.title) { tElem.style.transition = 'opacity 0.3s'; tElem.style.opacity = '0'; setTimeout(() => { tElem.textContent = cur.title; tElem.style.opacity = '1'; }, 150); }
        if (dElem && dElem.textContent !== cur.description) { dElem.style.transition = 'opacity 0.3s'; dElem.style.opacity = '0'; setTimeout(() => { dElem.textContent = cur.description; dElem.style.opacity = '1'; }, 150); }
    }
    
    const slide5 = document.getElementById('slide5_army');
    if(slide5) {
        const w = slide5.querySelector('.vertical-image-wrapper'), c = slide5.querySelector('.vertical-image-container');
        if(w && c) {
            let ticking = false;
            w.addEventListener('scroll', () => { if(!ticking) { window.requestAnimationFrame(() => { const p = (w.scrollHeight - c.offsetHeight) > 0 ? (w.scrollTop / (w.scrollHeight - c.offsetHeight)) * 100 : 0; updateText('slide5_army', p); ticking = false; }); ticking = true; } });
        }
    }
}
function initArmyFifthSlideHint() {
    const track = document.getElementById('slideTrack4'); if(!track) return;
    const slide = track.children[4]; if(!slide) return;
    const old = slide.querySelector('.scroll-hint'); if(old) old.remove();
    const hint = document.createElement('div'); hint.className = 'scroll-hint'; hint.innerHTML = '⬇ листай ⬇'; slide.appendChild(hint);
    const w = slide.querySelector('.vertical-image-wrapper'); if(!w) return;
    let hidden = false;
    w.addEventListener('scroll', () => { if(hidden) return; if(w.scrollTop > 20) { hint.classList.remove('show'); hint.classList.add('fade-out'); hidden = true; setTimeout(() => { if(hint && hint.parentNode) hint.remove(); }, 500); } });
    new MutationObserver(m => { m.forEach(x => { if(x.attributeName === 'class') { if(slide.classList.contains('active-caption')) setTimeout(() => { if(!hidden && hint && hint.parentNode) { hint.classList.add('show'); hint.classList.remove('fade-out'); } }, 100); else { if(hint && hint.parentNode) { hint.classList.remove('show'); hint.classList.add('fade-out'); } } } }); }).observe(slide, {attributes: true});
    if(slide.classList.contains('active-caption')) setTimeout(() => { if(!hidden && hint && hint.parentNode) hint.classList.add('show'); }, 100);
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(initArmyFifthSlideHint, 1600); setTimeout(initArmyFifthSlideScrollText, 1700); });
window.addEventListener('load', () => { setTimeout(initArmyFifthSlideHint, 1100); setTimeout(initArmyFifthSlideScrollText, 1200); });

function setupCrimeaHint(slideIndex, slideId) {
    const track = document.getElementById('slideTrack5'); if(!track) return;
    const slide = track.children[slideIndex]; if(!slide) return;
    if(!slide.id) slide.id = slideId;
    let hidden = false, curHint = null;
    let w = slide.querySelector('.vertical-image-wrapper');
    
    function createHint() { const o = slide.querySelector('.scroll-hint'); if(o) o.remove(); const h = document.createElement('div'); h.className = 'scroll-hint'; h.innerHTML = '⬇ листай ⬇'; slide.appendChild(h); setTimeout(() => h.classList.add('show'), 50); return h; }
    function reset() { hidden = false; if(curHint) curHint.remove(); curHint = createHint(); }
    function hide() { if(hidden || !curHint) return; hidden = true; curHint.classList.remove('show'); curHint.classList.add('fade-out'); setTimeout(() => { if(curHint && curHint.parentNode) { curHint.remove(); curHint = null; } }, 500); }
    
    if(!w) w = slide.querySelector('.vertical-image-wrapper'); if(!w) return;
    w.addEventListener('scroll', () => { if(w.scrollTop > 10) hide(); });
    new MutationObserver(m => { m.forEach(x => { if(x.attributeName === 'class') { if(slide.classList.contains('active-caption')) reset(); else { hidden = false; if(curHint) { curHint.remove(); curHint = null; } } } }); }).observe(slide, {attributes: true});
    if(slide.classList.contains('active-caption')) setTimeout(reset, 100);
}

function initCrimeaThirdSlideHint() { setupCrimeaHint(2, 'slide5_crimea'); }
function initCrimeaFourthSlideHint() { setupCrimeaHint(3, 'slide4_crimea'); }

function initCrimeaThirdSlideButtons() {
    let s3Full = false, s4Full = false;
    function checkEnd(idx) {
        const track = document.getElementById('slideTrack5'); if(!track) return false;
        const slide = track.children[idx]; if(!slide) return false;
        const w = slide.querySelector('.vertical-image-wrapper'), c = slide.querySelector('.vertical-image-container'); if(!w || !c) return false;
        return (w.scrollTop + c.offsetHeight) >= (w.scrollHeight - 5);
    }
    
    function updateBtns() {
        const ctrl = document.querySelector('#slider5 .slider-controls'); if(!ctrl) return;
        const nBtn = ctrl.querySelector('.next-btn'), pBtn = ctrl.querySelector('.prev-btn'); if(!nBtn || !pBtn) return;
        const activeIdx = currentSlides[5] !== undefined ? currentSlides[5] : 0;
        
        if (activeIdx === 2) { if(checkEnd(2)) { s3Full = true; show(nBtn); } else if(s3Full) show(nBtn); else hide(nBtn); }
        else if (activeIdx === 3) { if(checkEnd(3)) { s4Full = true; show(nBtn); } else if(s4Full) show(nBtn); else hide(nBtn); }
        else { show(nBtn); }
        show(pBtn);
    }
    
    function show(b) { b.style.opacity = '1'; b.style.pointerEvents = 'auto'; b.style.visibility = 'visible'; }
    function hide(b) { b.style.opacity = '0'; b.style.pointerEvents = 'none'; b.style.visibility = 'hidden'; }
    
    function initScroll() {
        const track = document.getElementById('slideTrack5'); if(!track) return;
        const s3 = track.children[2], s4 = track.children[3];
        if(s3) { const w = s3.querySelector('.vertical-image-wrapper'); if(w) { w.removeEventListener('scroll', updateBtns); w.addEventListener('scroll', updateBtns); } }
        if(s4) { const w = s4.querySelector('.vertical-image-wrapper'); if(w) { w.removeEventListener('scroll', updateBtns); w.addEventListener('scroll', updateBtns); } }
    }
    
    const track = document.getElementById('slideTrack5');
    if(track) new MutationObserver(m => { m.forEach(x => { if(x.type === 'attributes' && x.attributeName === 'style') setTimeout(() => { updateBtns(); initScroll(); }, 100); }); }).observe(track, {attributes: true, attributeFilter: ['style']});
    
    setTimeout(() => { updateBtns(); initScroll(); }, 600);
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(initCrimeaThirdSlideHint, 1500); setTimeout(initCrimeaThirdSlideButtons, 1600); setTimeout(initCrimeaFourthSlideHint, 1500); });
window.addEventListener('load', () => { setTimeout(initCrimeaThirdSlideHint, 1000); setTimeout(initCrimeaThirdSlideButtons, 1100); setTimeout(initCrimeaFourthSlideHint, 1000); });

function initSliderPagination() {
    document.querySelectorAll('.gallery-slider').forEach(slider => { 
        const match = slider.id.match(/\d+/); if(!match) return; const id = parseInt(match[0]);
        const track = slider.querySelector('.slider-track'), slides = slider.querySelectorAll('.slider-item');
        if(!track || slides.length === 0) return;
        const container = slider.querySelector('.slider-container');
        const old = slider.querySelector('.slider-pagination'); if(old) old.remove();
        
        const pag = document.createElement('div'); pag.className = 'slider-pagination';
        slides.forEach((s, idx) => {
            const isVert = s.querySelector('.vertical-image-wrapper');
            if (isVert) {
                const p = document.createElement('div'); p.className = 'slider-progress'; p.setAttribute('data-slide-index', idx);
                const b = document.createElement('div'); b.className = 'slider-progress-bar'; p.appendChild(b); pag.appendChild(p);
                const w = s.querySelector('.vertical-image-wrapper');
                if(w) w.addEventListener('scroll', () => { const max = w.scrollHeight - w.clientHeight; b.style.height = max > 0 ? (w.scrollTop / max) * 100 + '%' : '0%'; });
                
                p.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToSlide(id, idx);
                });
            } else {
                const d = document.createElement('div'); d.className = 'slider-dot'; d.setAttribute('data-slide-index', idx);
                d.addEventListener('click', () => goToSlide(id, idx));
                pag.appendChild(d);
            }
        });
        container.appendChild(pag);
        if(currentSlides[id] === undefined) currentSlides[id] = 0;
        updatePagination(id);
    });
}

window.goToSlide = function(id, targetIndex) {
    const slider = document.getElementById(`slider${id}`); 
    if(!slider) return;
    const track = slider.querySelector('.slider-track'); 
    if(!track) return;
    const slides = slider.querySelectorAll('.slider-item'); 
    const total = slides.length;
    
    let target = targetIndex;
    if(target < 0) target = total - 1;
    if(target >= total) target = 0;
    
    const currentIdx = currentSlides[id] !== undefined ? currentSlides[id] : 0;
    
    if (window.maxReachedSlide[id] === undefined) window.maxReachedSlide[id] = 0;
    let maxUnlocked = window.maxReachedSlide[id];
    
    if (currentIdx === total - 1 && target === 0) {
    }
    else if (target <= maxUnlocked) {
    }
    else if (target === maxUnlocked + 1) {
        if (!checkScrollFinished(id, maxUnlocked)) {
            const hint = track.children[maxUnlocked]?.querySelector('.scroll-hint');
            if(hint) { 
                hint.style.color = '#ffb74d'; 
                setTimeout(() => hint.style.color = 'white', 500); 
            }
            return;
        }
        window.maxReachedSlide[id] = target;
    } 
    else {
        const hint = track.children[currentIdx]?.querySelector('.scroll-hint');
        if(hint) { 
            hint.style.color = '#ffb74d'; 
            setTimeout(() => hint.style.color = 'white', 500); 
        }
        return;
    }
    
    if (target === total - 1) {
        window.maxReachedSlide[id] = total - 1;
    }
    
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${target * 100}%)`;
    currentSlides[id] = target;
    
    slides.forEach((s, i) => { 
        if(i === target) s.classList.add('active-caption'); 
        else s.classList.remove('active-caption'); 
    });
    
    updatePagination(id);
    
    setTimeout(() => {
        if(typeof window.syncSliderControls === 'function') window.syncSliderControls(id);
        if(id === 1) { 
            if(window.updateHintForSecondSlide) window.updateHintForSecondSlide(); 
            if(window.updateHintForFourthSlide) window.updateHintForFourthSlide(); 
        }
        else if(id === 2) { 
            if(window.updateHintForSMOSecondSlide) window.updateHintForSMOSecondSlide(); 
            if(window.updateHintForSMOFourthSlide) window.updateHintForSMOFourthSlide(); 
        }
        else if (id === 3) {
            if(window.updateHintForCrimeaSpringSecondSlide) window.updateHintForCrimeaSpringSecondSlide();
        }
    }, 100);
};

window.updatePagination = function(id) {
    const slider = document.getElementById(`slider${id}`); if(!slider) return;
    const cur = currentSlides[id]; if(cur === undefined) return;
    slider.querySelectorAll('.slider-dot').forEach(d => { if(parseInt(d.getAttribute('data-slide-index')) === cur) d.classList.add('active'); else d.classList.remove('active'); });
    slider.querySelectorAll('.slider-progress').forEach(p => { if(parseInt(p.getAttribute('data-slide-index')) === cur) p.classList.add('active'); else p.classList.remove('active'); });
};

document.addEventListener('DOMContentLoaded', () => setTimeout(initSliderPagination, 300));

const originalSwitchToPage = window.switchToPage;
if(originalSwitchToPage) window.switchToPage = function(pageId) { originalSwitchToPage(pageId); setTimeout(() => { for(let i=1; i<=8; i++) if(currentSlides[i] !== undefined) updatePagination(i); }, 300); };

function initModalScrollLock() {
    const m = document.getElementById('heroModal'); if(!m) return;
    let pos = 0;
    function lock() { pos = window.scrollY; document.body.style.overflow = 'hidden'; document.body.style.position = 'fixed'; document.body.style.top = `-${pos}px`; document.body.style.width = '100%'; }
    function unlock() { document.body.style.overflow = ''; document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = ''; window.scrollTo(0, pos); }
    new MutationObserver(mut => { mut.forEach(x => { if(x.attributeName === 'class') { if(m.classList.contains('active')) lock(); else unlock(); } }); }).observe(m, {attributes: true});
    const cls = document.querySelector('.hero-modal__close'), ov = document.querySelector('.hero-modal__overlay');
    if(cls) cls.addEventListener('click', () => setTimeout(unlock, 400));
    if(ov) ov.addEventListener('click', () => setTimeout(unlock, 400));
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && m.classList.contains('active')) setTimeout(unlock, 400); });
}
document.addEventListener('DOMContentLoaded', initModalScrollLock);

document.addEventListener('DOMContentLoaded', () => {
    const home = document.getElementById('homePage'), cards = document.querySelectorAll('.exhibit-card');
    function anim() { cards.forEach((c, i) => { c.classList.remove('fade-in-up'); void c.offsetWidth; c.style.animationDelay = `${i * 0.15}s`; c.classList.add('fade-in-up'); }); }
    if(home && home.classList.contains('active')) setTimeout(anim, 300);
    if(home) new MutationObserver(m => { m.forEach(x => { if(x.attributeName === 'class' && home.classList.contains('active')) anim(); }); }).observe(home, {attributes: true});
    
});

window.maxReachedSlide = window.maxReachedSlide || {};
function checkScrollFinished(id, idx) {
    const s = document.getElementById(`slider${id}`); if(!s) return true;
    const t = s.querySelector('.slider-track'); 
    const slide = t ? t.children[idx] : null; 
    if(!slide) return true;
    const w = slide.querySelector('.vertical-image-wrapper'); 
    if(!w) return true;
    const container = slide.querySelector('.vertical-image-container');
    if (!container) return true;
    if (w.scrollHeight <= container.offsetHeight + 10) return true;
    return (w.scrollTop + w.clientHeight) >= (w.scrollHeight - 25);
}
window.syncSliderControls = function(id) {
    const s = document.getElementById(`slider${id}`); 
    if(!s) return;
    
    const cur = currentSlides[id] !== undefined ? currentSlides[id] : 0;
    const totalSlides = s.querySelectorAll('.slider-item').length;
    
    if (window.maxReachedSlide[id] === undefined) window.maxReachedSlide[id] = 0;
    let maxUnlocked = window.maxReachedSlide[id];
    
    const isFullyUnlocked = maxUnlocked >= totalSlides - 1;
    
    const nBtn = s.querySelector('.next-btn') || s.querySelector('.slider-btn:last-child');
    if(nBtn) {
        let canGoNext = false;
        
        if (isFullyUnlocked) {
            canGoNext = true;
        } else {
            canGoNext = checkScrollFinished(id, cur);
        }
        
        if (canGoNext) {
            nBtn.style.setProperty('opacity', '1', 'important');
            nBtn.style.setProperty('pointer-events', 'auto', 'important');
            nBtn.style.setProperty('visibility', 'visible', 'important');
        } else {
            nBtn.style.setProperty('opacity', '0', 'important');
            nBtn.style.setProperty('pointer-events', 'none', 'important');
            nBtn.style.setProperty('visibility', 'hidden', 'important');
        }
    }
    
    const pBtn = s.querySelector('.prev-btn') || s.querySelector('.slider-btn:first-child');
    if(pBtn) {
        if (cur === 0 && !isFullyUnlocked) {
            pBtn.style.setProperty('opacity', '0', 'important');
            pBtn.style.setProperty('pointer-events', 'none', 'important');
            pBtn.style.setProperty('visibility', 'hidden', 'important');
        } else {
            pBtn.style.setProperty('opacity', '1', 'important');
            pBtn.style.setProperty('pointer-events', 'auto', 'important');
            pBtn.style.setProperty('visibility', 'visible', 'important');
        }
    }
    
    const pag = s.querySelector('.slider-pagination');
    if(pag) {
        Array.from(pag.children).forEach((item, i) => {
            let isAccessible = false;
            
            if (isFullyUnlocked || i <= maxUnlocked) {
                isAccessible = true;
            } 
            else if (i === maxUnlocked + 1) {
                if (cur === maxUnlocked) {
                    isAccessible = checkScrollFinished(id, maxUnlocked);
                } else {
                    isAccessible = false;
                }
            }
            
            if (isAccessible) {
                item.style.setProperty('opacity', '1', 'important');
                item.style.setProperty('pointer-events', 'auto', 'important');
                item.style.setProperty('cursor', 'pointer', 'important');
            } else {
                item.style.setProperty('opacity', '0.3', 'important');
                item.style.setProperty('pointer-events', 'none', 'important');
                item.style.setProperty('cursor', 'not-allowed', 'important');
            }
        });
    }
};
function initExtendedLogic() {
    document.querySelectorAll('.gallery-slider').forEach(s => {
        const id = parseInt(s.id.replace('slider', ''));
        s.querySelectorAll('.vertical-image-wrapper').forEach(w => w.addEventListener('scroll', () => window.syncSliderControls(id)));
        const p = s.querySelector('.slider-pagination'); if(p) Array.from(p.children).forEach((item, idx) => item.addEventListener('click', () => window.goToSlide(id, idx)));
        window.syncSliderControls(id);
    });
}
if(document.readyState === 'complete') initExtendedLogic(); else window.addEventListener('load', initExtendedLogic);

function initSliderScrollAnimations() {
    const sliders = document.querySelectorAll('.gallery-slider');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.offsetParent !== null) {
                const slider = entry.target;
                
                if (slider.classList.contains('scroll-anim-visible')) return;
                
                slider.classList.add('scroll-anim-visible');
                
                setTimeout(() => {
                    slider.classList.remove('controls-hidden');
                    slider.classList.add('controls-visible');
                    
                    const sliderIdMatch = slider.id.match(/\d+/);
                    if (sliderIdMatch && typeof window.syncSliderControls === 'function') {
                        window.syncSliderControls(parseInt(sliderIdMatch[0]));
                    }
                }, 600); 
                
                observer.unobserve(slider);
            }
        });
    }, observerOptions);

    sliders.forEach((slider, index) => {
        slider.classList.add('controls-hidden');
        slider.classList.add('scroll-anim-init');
        
        if (index % 2 === 0) {
            slider.classList.add('scroll-anim-left');
        } else {
            slider.classList.add('scroll-anim-right');
        }
        
        observer.observe(slider);
    });

    function checkVisibleSlidersOnTabSwitch() {
        setTimeout(() => {
            sliders.forEach(slider => {
                if (slider.offsetParent !== null && !slider.classList.contains('scroll-anim-visible')) {
                    const rect = slider.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        slider.classList.add('scroll-anim-visible');
                        setTimeout(() => {
                            slider.classList.remove('controls-hidden');
                            slider.classList.add('controls-visible');
                        }, 600);
                        observer.unobserve(slider);
                    }
                }
            });
        }, 50);
    }

    const triggerButtons = document.querySelectorAll('.nav__link, .exhibit-card, .tab-btn, .sub-tab-btn');
    triggerButtons.forEach(btn => {
        btn.addEventListener('click', checkVisibleSlidersOnTabSwitch);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initSliderScrollAnimations, 500); 
});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initSliderScrollAnimations, 500); 
});

function initCrimeaSpringSecondSlideHint() {
    const sliderTrack = document.getElementById('slideTrack3');
    if (!sliderTrack) return;
    
    const slide = sliderTrack.children[1];
    if (!slide) return;
    
    const oldHint = slide.querySelector('.scroll-hint');
    if (oldHint) oldHint.remove();
    
    const wrapper = slide.querySelector('.vertical-image-wrapper');
    if (!wrapper) return;
    
    const hint = document.createElement('div');
    hint.className = 'scroll-hint';
    hint.innerHTML = '⬇ листай ⬇';
    slide.appendChild(hint);
    
    let hintHidden = false;
    
    function checkScrollAndHideHint() {
        if (hintHidden) return;
        if (wrapper.scrollTop > 20) {
            hint.classList.remove('show');
            hint.classList.add('fade-out');
            hintHidden = true;
            setTimeout(() => {
                if (hint && hint.parentNode) hint.remove();
            }, 500);
        }
    }
    
    wrapper.addEventListener('scroll', function() {
        requestAnimationFrame(checkScrollAndHideHint);
    });
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (slide.classList.contains('active-caption')) {
                    setTimeout(() => {
                        if (!hintHidden && hint && hint.parentNode) {
                            hint.classList.add('show');
                            hint.classList.remove('fade-out');
                        }
                    }, 100);
                } else {
                    if (hint && hint.parentNode) {
                        hint.classList.remove('show');
                        hint.classList.add('fade-out');
                    }
                }
            }
        });
    });
    
    observer.observe(slide, { attributes: true });
    
    if (slide.classList.contains('active-caption')) {
        setTimeout(() => {
            if (!hintHidden && hint && hint.parentNode) {
                hint.classList.add('show');
            }
        }, 100);
    }
}

function initSwipeForSliders() {
    const sliders = document.querySelectorAll('.gallery-slider');

    sliders.forEach(slider => {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (!isMobile) return;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe(slider);
        });
        
        const handleSwipe = (slider) => {
            const sliderIdMatch = slider.id.match(/\d+/);
            if (!sliderIdMatch) return;
            const sliderId = parseInt(sliderIdMatch[0]);
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    const track = document.getElementById(`slideTrack${sliderId}`);
                    if (!track) return;
                    const totalItems = track.children.length;
                    let current = currentSlides[sliderId] !== undefined ? currentSlides[sliderId] : 0;
                    let prevIndex = (current - 1 + totalItems) % totalItems;
                    goToSlide(sliderId, prevIndex);
                } else {
                    const track = document.getElementById(`slideTrack${sliderId}`);
                    if (!track) return;
                    const totalItems = track.children.length;
                    let current = currentSlides[sliderId] !== undefined ? currentSlides[sliderId] : 0;
                    let nextIndex = (current + 1) % totalItems;
                    goToSlide(sliderId, nextIndex);
                }
            }
        };
    });
}

(function() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;
    
    const sectionState = new Map();
    
    const tooltipsConfig = {
        'slider1': { text: '⬆️ Вытянутые элементы меню - слайды с вертикальной прокруткой. Попробуйте!' },
        'slider6': { text: '⬅️ Проведите влево по экрану чтобы увидеть больше фото' },
        'slider7': { text: '⬆️Меню в верхней части указывает на каком слайде Вы находитесь' },
        'slider8': { text: "Кнопка ⛶ открывает слайд на полный экран" }
    };
    
    function getSectionKey(sliderElement) {
        const mainPanel = sliderElement.closest('.main-panel');
        if (!mainPanel) return null;
        
        const mainPanelId = mainPanel.id;
        
        if (mainPanelId === 'mainPanel0') {
            const activeSubTab = mainPanel.querySelector('.sub-tab-btn.active');
            if (activeSubTab) {
                const subTabText = activeSubTab.textContent.trim();
                if (subTabText.includes('Крейзер')) return 'mainPanel0_kreizer';
                if (subTabText.includes('51-й')) return 'mainPanel0_army';
                if (subTabText.includes('Крым')) return 'mainPanel0_crimea';
                return `mainPanel0_${subTabText}`;
            }
            return 'mainPanel0_default';
        }
        
        return mainPanelId;
    }
    
    function shouldShowButton(sliderId, slideIndex, sliderElement) {
        if (slideIndex !== 0) return false;
        
        const sectionKey = getSectionKey(sliderElement);
        if (!sectionKey) return true;
        
        return !sectionState.get(`${sectionKey}_activated`);
    }
    
    function markSectionActivated(sliderElement) {
        const sectionKey = getSectionKey(sliderElement);
        if (sectionKey) {
            sectionState.set(`${sectionKey}_activated`, true);
        }
    }
    
    function addInfoButton(sliderId, slideIndex, slideElement) {
        if (!shouldShowButton(sliderId, slideIndex, slideElement)) return;
        
        const oldBtn = slideElement.querySelector('.mobile-info-btn');
        if (oldBtn) oldBtn.remove();
        
        const config = tooltipsConfig[`slider${sliderId}`];
        if (!config) return;
        
        const btn = document.createElement('button');
        btn.className = 'mobile-info-btn';
        btn.setAttribute('aria-label', 'Информация о слайде');
        btn.innerHTML = 'i';
        
        const tooltip = document.createElement('div');
        tooltip.className = 'mobile-info-tooltip';
        tooltip.textContent = config.text;
        
        btn.appendChild(tooltip);
        slideElement.appendChild(btn);
        
        let wasClicked = false;
        let isFadingOut = false;
        let isTooltipVisible = false;
        
        const sliderContainer = slideElement.closest('.gallery-slider');
        const sliderTrack = sliderContainer?.querySelector('.slider-track');
        
        function hideTooltip() {
            if (tooltip) {
                tooltip.classList.remove('show');
                isTooltipVisible = false;
            }
        }
        
        function fadeOutButton() {
            if (isFadingOut) return;
            isFadingOut = true;
            btn.classList.add('fade-out');
            markSectionActivated(slideElement);
            hideTooltip();
            
            setTimeout(() => {
                if (btn && btn.parentNode) {
                    btn.remove();
                }
            }, 400);
        }
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            if (wasClicked || isFadingOut) return;
            wasClicked = true;
            
            if (isTooltipVisible) {
                hideTooltip();
                return;
            }
            
            document.querySelectorAll('.mobile-info-tooltip.show').forEach(t => {
                if (t !== tooltip) t.classList.remove('show');
            });
            
            tooltip.classList.add('show');
            isTooltipVisible = true;
        });
        
        function handleOutsideClick(e) {
            if (!isTooltipVisible) return;
            if (!btn.contains(e.target) && !tooltip.contains(e.target)) {
                hideTooltip();
                document.removeEventListener('click', handleOutsideClick);
                document.removeEventListener('touchstart', handleOutsideClick);
            }
        }
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isTooltipVisible) {
                setTimeout(() => {
                    document.addEventListener('click', handleOutsideClick);
                    document.addEventListener('touchstart', handleOutsideClick);
                }, 10);
            }
        });
        
        if (sliderTrack) {
            const handleUserInteraction = (e) => {
                if (wasClicked && !isFadingOut) {
                    if (isTooltipVisible) hideTooltip();
                    fadeOutButton();
                    sliderTrack.removeEventListener('touchstart', handleUserInteraction);
                    sliderTrack.removeEventListener('touchend', handleUserInteraction);
                    sliderTrack.removeEventListener('click', handleUserInteraction);
                }
            };
            
            sliderTrack.addEventListener('touchstart', handleUserInteraction);
            sliderTrack.addEventListener('touchend', handleUserInteraction);
            sliderTrack.addEventListener('click', handleUserInteraction);
        }
    }
    
    function addButtonsToAllSliders() {
        for (let sliderId = 1; sliderId <= 8; sliderId++) {
            const sliderTrack = document.getElementById(`slideTrack${sliderId}`);
            if (!sliderTrack) continue;
            
            const slides = sliderTrack.children;
            for (let i = 0; i < slides.length; i++) {
                if (i === 0) {
                    addInfoButton(sliderId, i, slides[i]);
                }
            }
        }
    }
    
    function observeSliderChanges() {
        for (let sliderId = 1; sliderId <= 8; sliderId++) {
            const sliderTrack = document.getElementById(`slideTrack${sliderId}`);
            if (!sliderTrack) continue;
            
            const observer = new MutationObserver(() => {
                setTimeout(() => {
                    const slides = sliderTrack.children;
                    for (let i = 0; i < slides.length; i++) {
                        if (i === 0 && !slides[i].querySelector('.mobile-info-btn')) {
                            addInfoButton(sliderId, i, slides[i]);
                        }
                    }
                }, 100);
            });
            
            observer.observe(sliderTrack, { attributes: true, attributeFilter: ['style'] });
        }
    }
    
    function observeTabChanges() {
    const clickTargets = document.querySelectorAll('.main-tabs .tab-btn, .sub-tab-btn, .nav__link, .logo');
    
    clickTargets.forEach(target => {
        target.addEventListener('click', () => {
            setTimeout(() => {
                if (typeof addButtonsToAllSliders === 'function') {
                    addButtonsToAllSliders();
                }
                
                if (typeof window.syncAllSlidersControls === 'function') {
                    window.syncAllSlidersControls();
                }
            }, 300);
        });
    });
}
    
    function init() {
        addButtonsToAllSliders();
        observeSliderChanges();
        observeTabChanges();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

window.syncAllSlidersControls = function() {
    for (let id = 1; id <= 8; id++) {
        if (typeof window.syncSliderControls === 'function') {
            window.syncSliderControls(id);
        }
    }
};

function init() {
    addButtonsToAllSliders();
    observeSliderChanges();
    observeTabChanges();
    
    setTimeout(() => {
        if (typeof window.syncAllSlidersControls === 'function') {
            window.syncAllSlidersControls();
        }
    }, 500);
}

(function fixHeroModalScroll() {
    const heroModal = document.getElementById('heroModal');
    const heroModalContent = document.querySelector('.hero-modal__content');
    const heroModalInner = document.querySelector('.hero-modal__inner');
    
    if (!heroModal || !heroModalContent) return;
    
    function resetModalScroll() {
        if (heroModalContent) {
            heroModalContent.scrollTop = 0;
        }
        if (heroModalInner) {
            heroModalInner.scrollTop = 0;
        }
        const scrollableElements = heroModalContent.querySelectorAll('.vertical-image-wrapper, .hero-modal__description');
        scrollableElements.forEach(el => {
            if (el.scrollTop !== undefined) {
                el.scrollTop = 0;
            }
        });
    }
    
    const originalHeroCardClick = (function() {
        const cards = document.querySelectorAll('.hero-card');
        cards.forEach(card => {
            const oldClick = card.onclick;
            card.addEventListener('click', function(e) {
                resetModalScroll();
            }, { once: false });
        });
    })();
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const cards = document.querySelectorAll('.hero-card');
                cards.forEach(card => {
                    if (!card.hasAttribute('data-scroll-fixed')) {
                        card.setAttribute('data-scroll-fixed', 'true');
                        card.addEventListener('click', function() {
                            setTimeout(() => resetModalScroll(), 50);
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    const observerModal = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (heroModal.classList.contains('active')) {
                    setTimeout(() => resetModalScroll(), 100);
                }
            }
        });
    });
    
    observerModal.observe(heroModal, { attributes: true });
    
    window.resetHeroModalScroll = resetModalScroll;
})();

document.addEventListener('DOMContentLoaded', () => {
    const heroModal = document.getElementById('heroModal');
    const closeBtn = document.querySelector('.hero-modal__close');
    if (!heroModal || !closeBtn) return;

    let isProgrammaticClose = false;

    window.addEventListener('popstate', (e) => {
        if (heroModal.classList.contains('active') || heroModal.style.display === 'block') {
            isProgrammaticClose = true;
            closeBtn.click();
            isProgrammaticClose = false;
        }
    });

    document.addEventListener('click', (e) => {
        const isCardClick = e.target.closest('.hero-card');
        const isCloseClick = e.target.closest('.hero-modal__close');
        const isOverlayClick = e.target.classList.contains('hero-modal__overlay');

        if (isCardClick) {
            history.pushState({ modalOpen: true }, '');
        } 
        else if ((isCloseClick || isOverlayClick) && !isProgrammaticClose) {
            if (history.state && history.state.modalOpen) {
                history.back();
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = document.querySelector('.mobile-nav');
    if (!mobileNav) return;

    const navObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (mobileNav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    });

    navObserver.observe(mobileNav, { attributes: true });

    mobileNav.addEventListener('touchmove', function(e) {
        if (this.scrollHeight <= this.clientHeight) {
            e.preventDefault(); 
        }
    }, { passive: false });
});