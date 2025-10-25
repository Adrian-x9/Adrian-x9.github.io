// --- KONFIGURACJA ---
const config = {
    version: 'v1.1.4',
    // Ustawienia globalne, wspólne dla wszystkich stron
    global: {
        // Domyślny motyw, gdy brak w pamięci: 'light' lub 'dark'
        defaultTheme: 'dark',
    },
    // Ustawienia specyficzne dla tej strony (about.html)
    pageSettings: {
        // Klucz strony (musi być unikalny, np. 'about', 'index')
        pageKey: 'about',
        // Domyślny numer wideo tła dla tej strony
        defaultBgVideo: 13,
        bgVideoStartNum: 1,
        bgVideoEndNum: 16,
        defaultAnimation: 2, // 0: Statycznie, 2: Video
        showMiniLogo: true,
        showBackButton: true,
        showVideoButton: true,
        showThemeButton: true,
    },
    paths: {
        videoBgLightUrlBase: "video/bg_light", // do nazwy doklejany jest numer (np. 1) i rozszerzenie .mp4
        videoBgDarkUrlBase: "video/bg_dark", // do nazwy doklejany jest numer (np. 1) i rozszerzenie .mp4
        videos: {
            about_dark: 'video/about_dark.mp4',
            about_light: 'video/about_light.mp4',
        },
        graphics: {
            logo1: {
                dark: 'gfx/interface/VisuDir_small_dark.png',
                light: 'gfx/interface/VisuDir_small_light.png',
                link: '/about.html'
            },
            logo2: {
                dark: 'gfx/interface/ADE_small_dark.png',
                light: 'gfx/interface/ADE_small_light.png',
                link: 'https://www.ade.pl'
            },
            logo3: {
                dark: 'gfx/interface/Building_small_dark.png',
                light: 'gfx/interface/Building_small_light.png',
                link: './soon.html'
            },
            about_dark: 'gfx/interface/VisuDir_dark.png',
            about_light: 'gfx/interface/VisuDir_light.png',
            about_ade_dark: 'gfx/interface/Adrian-dark.png',
            about_ade_light: 'gfx/interface/Adrian-light.png'
        }
    }
};
// --- KONIEC KONFIGURACJI ---

let animationState;
let currentTheme;
let autoShuffleInterval = null;

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(`visudir_${key}`, value);
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
}

function getFromLocalStorage(key) {
    try {
        return localStorage.getItem(`visudir_${key}`);
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return null;
    }
}

function initializeTheme() {
    const storedTheme = localStorage.getItem('visudir_theme');
    const theme = storedTheme || config.global.defaultTheme;
    const htmlEl = document.documentElement;

    if (theme === 'light') {
        htmlEl.classList.remove('dark-mode');
    } else {
        htmlEl.classList.add('dark-mode');
    }

    if (!storedTheme) {
        localStorage.setItem('visudir_theme', theme);
    }
    return theme;
}

function initializeBackgroundVideo(theme) {
    const pageKey = config.pageSettings.pageKey;
    const storageKey = `visudir_bg_video_${pageKey}`;
    const storedVideoNum = localStorage.getItem(storageKey);
    
    let videoNum = parseInt(storedVideoNum) || config.pageSettings.defaultBgVideo;

    if (videoNum < config.pageSettings.bgVideoStartNum || videoNum > config.pageSettings.bgVideoEndNum) {
        videoNum = config.pageSettings.defaultBgVideo;
    }

    const bgVideo = document.getElementById('bg-video');
    const bgVideoSource = document.getElementById('bg-video-source');
    
    if (bgVideo && bgVideoSource) {
        const videoUrlBase = theme === 'light' ? config.paths.videoBgLightUrlBase : config.paths.videoBgDarkUrlBase;
        const videoSrc = `${videoUrlBase}${videoNum}.mp4`;
        
        bgVideoSource.src = videoSrc;
        bgVideo.load();
        bgVideo.addEventListener('canplay', () => document.body.classList.add('video-ready'), { once: true });
    }

    if (!storedVideoNum || parseInt(storedVideoNum) !== videoNum) {
        localStorage.setItem(storageKey, videoNum);
    }
}

function updateBackgroundVideoVisibility() {
    const bgVideo = document.getElementById('bg-video');
    if (animationState === 2) {
        bgVideo.style.display = "block";
        initializeBackgroundVideo(currentTheme);
    } else {
        bgVideo.style.display = 'none';
        document.body.classList.remove('video-ready');
    }
}

function updateAnimationButtonUI() {
    const animationBtn = document.getElementById('animationBtn');
    const animationBtnShuffle = document.getElementById('animationBtn-shuffle');
    const animationBtnPlay = document.getElementById('animationBtn-play');
    
    animationBtn.classList.remove("inactive", "highlighted-state");
    animationBtnShuffle.style.display = 'none';
    animationBtnPlay.style.display = 'none';

    switch (animationState) {
        case 0: // Statycznie
            animationBtn.classList.add("inactive");
            break;
        case 2: // Video
            animationBtn.classList.add("highlighted-state");
            const hasMultipleVideos = (config.pageSettings.bgVideoEndNum - config.pageSettings.bgVideoStartNum) > 0;
            if (hasMultipleVideos) {
                animationBtnShuffle.style.display = 'inline-flex';
                animationBtnPlay.style.display = 'inline-flex';
            }
            break;
    }
}

function toggleAutoShuffle() {
    const playBtn = document.getElementById('animationBtn-play');
    if (animationState !== 2) return; // Działa tylko, gdy wideo jest włączone

    if (autoShuffleInterval) {
        clearInterval(autoShuffleInterval);
        autoShuffleInterval = null;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('highlighted-state'); 
    } else {
        shuffleBackgroundVideo(); // Zmień od razu po wciśnięciu
        autoShuffleInterval = setInterval(shuffleBackgroundVideo, 15000);
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('highlighted-state'); 
    }
}

function toggleAnimations() {
    // Jeśli wyłączamy wideo, a automatyczne losowanie jest aktywne, zatrzymaj je
    if (animationState === 2 && autoShuffleInterval) {
        toggleAutoShuffle();
    }

    animationState = animationState === 2 ? 0 : 2; // Przełączaj między 0 (Statycznie) a 2 (Video)
    saveToLocalStorage(`animation_${config.pageSettings.pageKey}`, animationState);
    updateAnimationButtonUI();
    updateBackgroundVideoVisibility();
}

function shuffleBackgroundVideo() {
    const { pageKey, bgVideoStartNum, bgVideoEndNum, defaultBgVideo } = config.pageSettings;
    const storageKey = `visudir_bg_video_${pageKey}`;
    const range = bgVideoEndNum - bgVideoStartNum;
    if (range < 1) return; 

    const currentVideoNum = parseInt(localStorage.getItem(storageKey)) || defaultBgVideo;
    
    let newVideoNum;
    do {
        newVideoNum = Math.floor(Math.random() * (range + 1)) + bgVideoStartNum;
    } while (newVideoNum === currentVideoNum);

    localStorage.setItem(storageKey, newVideoNum);
    initializeBackgroundVideo(currentTheme);
}

function resetVideoSettings() {
    // Przywróć domyślny stan animacji (czy wideo ma być włączone)
    animationState = config.pageSettings.defaultAnimation;
    saveToLocalStorage(`animation_${config.pageSettings.pageKey}`, animationState);
    
    // Przywróć domyślny numer wideo
    const { pageKey, defaultBgVideo } = config.pageSettings;
    const storageKey = `visudir_bg_video_${pageKey}`;
    localStorage.setItem(storageKey, defaultBgVideo);

    // Zatrzymaj automatyczne odtwarzanie, jeśli jest aktywne
    if (autoShuffleInterval) {
        toggleAutoShuffle(); 
    }

    // Zaktualizuj interfejs użytkownika
    updateAnimationButtonUI();
    updateBackgroundVideoVisibility(); // To załaduje domyślne wideo
    if (DEBUG) console.log('Ustawienia wideo zostały zresetowane do domyślnych.');
}

function updateDarkModeButtonUI() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    darkModeBtn.innerHTML = document.documentElement.classList.contains("dark-mode") ? `<i class="fas fa-moon"></i>` : `<i class="fas fa-sun"></i>`;
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.contains("dark-mode");
    localStorage.setItem('visudir_theme', isDark ? 'light' : 'dark');
    currentTheme = initializeTheme();
    updateDarkModeButtonUI();
    updateBackgroundVideoVisibility();

    // Refresh theme-dependent images
    const video = document.getElementById('theme-video');
    const videoSource = document.getElementById('theme-video-source');
    const aboutImage = document.getElementById('about-image');
    
    const isDarkModeNow = document.documentElement.classList.contains('dark-mode');
    videoSource.src = isDarkModeNow ? config.paths.videos.about_dark : config.paths.videos.about_light;
    video.load();
    
    aboutImage.src = isDarkModeNow ? config.paths.graphics.about_dark : config.paths.graphics.about_light;
}

currentTheme = initializeTheme();

document.addEventListener('DOMContentLoaded', () => {
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        bgVideo.addEventListener('error', () => {
            bgVideo.style.display = 'none';
            if (document.documentElement.classList.contains('dark-mode')) {
                document.body.style.backgroundColor = '#181818';
            }
        });
    }
    
    document.querySelectorAll('.version-display').forEach(el => el.textContent = config.version);

    const logoLink = document.getElementById('logoLink');
    const backButton = document.getElementById('backButton');
    const animationBtn = document.getElementById('animationBtn');
    const darkModeBtn = document.getElementById('darkModeBtn');
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    
    if (!config.pageSettings.showMiniLogo) logoLink.style.display = 'none';
    if (!config.pageSettings.showBackButton) backButton.style.display = 'none';
    if (!config.pageSettings.showVideoButton) animationBtn.style.display = 'none';
    if (!config.pageSettings.showThemeButton) darkModeBtn.style.display = 'none';

    const storedAnimation = getFromLocalStorage(`animation_${config.pageSettings.pageKey}`);
    animationState = storedAnimation !== null ? parseInt(storedAnimation, 10) : config.pageSettings.defaultAnimation;
    
    updateAnimationButtonUI();
    updateDarkModeButtonUI();
    updateBackgroundVideoVisibility();
    
    darkModeBtn.addEventListener('click', toggleDarkMode);
    resetSettingsBtn.addEventListener('click', resetVideoSettings);

    animationBtn.addEventListener('click', (event) => {
        const shuffleBtn = document.getElementById('animationBtn-shuffle');
        const playBtn = document.getElementById('animationBtn-play');

        if (shuffleBtn && shuffleBtn.contains(event.target)) {
            if (animationState === 2) shuffleBackgroundVideo();
        } else if (playBtn && playBtn.contains(event.target)) {
            toggleAutoShuffle();
        } else {
            toggleAnimations();
        }
    });

    const video = document.getElementById('theme-video');
    const videoSource = document.getElementById('theme-video-source');
    const headerLogo = document.getElementById('header-logo');
    const aboutImage = document.getElementById('about-image');
    const isDarkMode = document.documentElement.classList.contains('dark-mode');

    if (isDarkMode) {
        videoSource.src = config.paths.videos.about_dark;
        headerLogo.src = config.paths.graphics.logo1.dark;
        aboutImage.src = config.paths.graphics.about_dark;
    } else {
        videoSource.src = config.paths.videos.about_light;
        headerLogo.src = config.paths.graphics.logo1.light;
        aboutImage.src = config.paths.graphics.about_light;
    }
    video.load();

    const flipAnimationDuration = 400;

    const runFlip = (element, newSrcCallback) => {
        if (element.classList.contains('flipping-out')) return;

        element.classList.remove('flipping-in');
        element.classList.add('flipping-out');

        setTimeout(() => {
            newSrcCallback();
            element.classList.remove('flipping-out');
            element.classList.add('flipping-in');
        }, flipAnimationDuration);
    };

    const useThreeLogos = config.paths.graphics.logo3?.light && config.paths.graphics.logo3?.dark;
    let logoState = -1; // Zaczynamy od -1, aby pierwsza iteracja dała 0

    setInterval(() => {
        runFlip(headerLogo, () => {
            const currentModeIsDark = document.documentElement.classList.contains('dark-mode');
            const theme = currentModeIsDark ? 'dark' : 'light';
            let currentLogoConfig;

            if (useThreeLogos) {
                const sequence = [
                    config.paths.graphics.logo1,
                    config.paths.graphics.logo3,
                    config.paths.graphics.logo2,
                    config.paths.graphics.logo3
                ];
                logoState = (logoState + 1) % sequence.length;
                currentLogoConfig = sequence[logoState];
            } else {
                const sequence = [config.paths.graphics.logo1, config.paths.graphics.logo2];
                logoState = (logoState + 1) % sequence.length;
                currentLogoConfig = sequence[logoState];
            }
            
            if (currentLogoConfig) {
                headerLogo.src = currentLogoConfig[theme];
                logoLink.href = currentLogoConfig.link;
                
                if (currentLogoConfig.link.startsWith('http') || currentLogoConfig.link.startsWith('www')) {
                    logoLink.target = '_blank';
                    logoLink.rel = 'noopener noreferrer';
                } else {
                    logoLink.target = '';
                    logoLink.rel = '';
                }
            }
        });
    }, 4000);

    let isVisuDirImage = true;
    setInterval(() => {
        runFlip(aboutImage, () => {
            const currentModeIsDark = document.documentElement.classList.contains('dark-mode');
            isVisuDirImage = !isVisuDirImage;
            if (isVisuDirImage) {
                aboutImage.src = currentModeIsDark ? config.paths.graphics.about_dark : config.paths.graphics.about_light;
            } else {
                aboutImage.src = currentModeIsDark ? config.paths.graphics.about_ade_dark : config.paths.graphics.about_ade_light;
            }
        });
    }, 5000);

    const header = document.querySelector('.top-header');
    const videoContainer = document.getElementById('video-box-container');
    const contentBoxes = document.querySelectorAll('.container > .content-box, .container > .contact-image-wrapper .content-box');
    const imageContainer = document.getElementById('about-image-container');
    const footer = document.querySelector('.footer');

    header.style.animationDelay = '0.2s';
    header.classList.add('animated-header');

    videoContainer.classList.add('animated-video');

    contentBoxes.forEach((box, index) => {
        box.style.animationDelay = `${0.6 + index * 0.2}s`;
        box.classList.add('animated-left');
    });

    imageContainer.style.animationDelay = `${0.6 + contentBoxes.length * 0.2}s`;
    imageContainer.classList.add('animated-right');

    footer.style.animationDelay = `${0.6 + (contentBoxes.length + 1) * 0.2}s`;
    footer.classList.add('animated-footer');

    const imageForLightbox = document.getElementById('about-image-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxShuffle = document.getElementById('lightbox-shuffle');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (imageForLightbox && lightbox && lightboxContent && lightboxClose && lightboxCaption) {
        imageForLightbox.addEventListener('click', () => {
            document.body.classList.add('lightbox-active');
            const currentImgSrc = aboutImage.src;
            lightboxContent.src = currentImgSrc;
            lightbox.style.display = 'flex';

            if (currentImgSrc.includes('Adrian-')) {
                lightboxCaption.innerHTML = '<span class="caption-name">Adrian Ulbrych.</span> Zdjęcie archiwalne. Wyretuszowano z AI';
                
                setTimeout(() => {
                    lightboxCaption.classList.add('visible');
                    
                    setTimeout(() => {
                        lightboxCaption.classList.remove('visible');
                    }, 3000);
                }, 1500);
            }
        });

        const closeLightbox = () => {
            document.body.classList.remove('lightbox-active');
            lightbox.style.display = 'none';
            lightboxCaption.classList.remove('visible');
            lightboxContent.src = '';
            lightboxCaption.innerHTML = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        if (lightboxShuffle) {
            lightboxShuffle.addEventListener('click', (e) => {
                e.stopPropagation();
                shuffleBackgroundVideo();
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                closeLightbox();
            }
        });
    }
});