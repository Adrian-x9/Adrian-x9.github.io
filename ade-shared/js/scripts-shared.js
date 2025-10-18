// --- System Initialization ---
(function () {
  // --- LOGIKA JĘZYKA ---
  try {
    const availableLangs = Object.keys(languageStrings); // Dynamicznie pobierz WSZYSTKIE języki
    const storageKey = "visudir_lang"; // Globalny klucz dla języka
    let finalLang = "pl"; // Domyślny język "awaryjny"

    const storedLang = localStorage.getItem(storageKey);

    if (storedLang && availableLangs.includes(storedLang)) {
      finalLang = storedLang;
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang !== "pl") {
        finalLang = "en";
      } else {
        finalLang = "pl";
      }
      localStorage.setItem(storageKey, finalLang);
    }
    config.language.current = finalLang;
  } catch (e) {
    console.error("Błąd podczas automatycznego ustawiania języka.", e);
  }

  // Self-healing and timeout mechanism
  try {
    const isRetry = sessionStorage.getItem("visudir_load_retry");
    const loadTimeout = setTimeout(() => {
      if (isRetry) {
        document.getElementById("preloader").innerHTML =
          "Aplikacja nie może się załadować.<br>Proszę spróbować wyczyścić dane przeglądarki lub skontaktować się z administratorem.";
      } else {
        sessionStorage.setItem("visudir_load_retry", "true");
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("visudir_")) {
            localStorage.removeItem(key);
          }
        });
        location.reload();
      }
    }, 30000);

    window.addEventListener("load", () => {
      clearTimeout(loadTimeout);
      sessionStorage.removeItem("visudir_load_retry");
    });
  } catch (e) {
    console.error("Critical error in startup safety mechanism.", e);
  }

  // Initial theme setup (SAFE VERSION)
  try {
    const theme = localStorage.getItem("visudir_theme");
    const defaultTheme = "light";
    if (theme === "dark" || (!theme && defaultTheme === "dark")) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    }
  } catch (e) {
    /* Ignore */
  }
})();
// --- End System Initialization ---

(function () {
  const langConfig = {
    defaultLanguage: "pl",
    englishUrl: "index-en.html",
  };
  try {
    let currentLang = localStorage.getItem("visudir_lang");
    if (!currentLang) {
      currentLang = langConfig.defaultLanguage;
      localStorage.setItem("visudir_lang", currentLang);
    }
    if (
      currentLang === "en" &&
      !window.location.pathname.endsWith(langConfig.englishUrl)
    ) {
      // window.location.replace(langConfig.englishUrl);
    }
  } catch (e) {
    /* Ignore storage errors */
  }
})();

(function () {
  try {
    const theme = localStorage.getItem("visudir_theme");
    const defaultTheme = "light";
    if (theme === "dark" || (!theme && defaultTheme === "dark")) {
      document.documentElement.classList.add("dark-mode");
    }
  } catch (e) {
    /* Ignore */
  }
})();

function initializeMobileHover() {
  // Nasłuchuj dotknięć na całej liście okładek
  guideList.addEventListener("touchend", function (e) {
    LanguagetappedItem = e.target.closest(".guide");

    // Jeśli dotknięto czegoś poza kafelkiem, zresetuj stan
    if (!tappedItem) {
      if (tappedGuide) {
        tappedGuide.classList.remove("mobile-hover");
        tappedGuide = null;
      }
      return;
    }

    // Zatrzymaj domyślną akcję (np. nawigację), aby obsłużyć ją ręcznie
    e.preventDefault();

    if (tappedGuide === tappedItem) {
      // DRUGIE dotknięcie tego samego kafelka: wykonaj akcję kliknięcia
      const link = tappedItem.querySelector("a");
      if (link) {
        link.click();
      }
      tappedGuide.classList.remove("mobile-hover");
      tappedGuide = null;
    } else {
      // PIERWSZE dotknięcie lub dotknięcie innego kafelka
      // Zdejmij hover ze starego kafelka, jeśli istniał
      if (tappedGuide) {
        tappedGuide.classList.remove("mobile-hover");
      }
      // Ustaw hover na nowym kafelku
      tappedItem.classList.add("mobile-hover");
      tappedGuide = tappedItem;
    }
  });

  // Dodajmy też reset po kliknięciu gdziekolwiek indziej na stronie
  document.addEventListener("touchstart", function (e) {
    if (!e.target.closest(".guide") && tappedGuide) {
      tappedGuide.classList.remove("mobile-hover");
      tappedGuide = null;
    }
  });
}

// --- configuraton / konfiguracja ---

/// COPY HERE <cfg> // configuration end / koniec konfiguracji

// FIX: Zmienna globalna do sprawdzania trybu offline
const isOffline = window.location.protocol === "file:";

let videoBgState;
let isAudioMuted = true; // Zapamiętuje globalny stan wyciszenia (domyślnie wyciszone) --- patch #1 ---
let areLabelsVisible;
let slideshowAnimationsEnabled;
let guides = [],
  filteredGuides = [],
  generatedGuides = null,
  slideshowSourceGuides = [],
  playGuidesQueue = [];

const GLOBAL_SESSION_START_KEY = "visudir_global_session_start";
const GLOBAL_SESSION_UPDATE_KEY = "visudir_global_session_update";
const SESSION_GRACE_PERIOD_MS = 65000; // 65 sekund (nieco więcej niż interwał)

let globalSessionStartTime; // Zastępuje 'sessionStartTime'
let isIdleTimerFrozen = false;
let lastActivityTime;
let screenSaverState = "inactive"; // Możliwe stany: 'inactive', 'stage1', 'stage2'
let currentSort, selectedRowCount;

let currentViewMode;
let generatorMode;

let currentPage = 1;
let totalPages = 1;
let pagesCache = [];
let preloadQueue = new Set();
let isInitialLoad = true;
let lazyLoadObserver;

let playAnimationTimeout = null,
  slideshowIsPlaying = false,
  slideshowIsRandom = false;

let playCurrentIndex = 0;
let orientationFilterState = null;

let lastPlayedGuide = null;
let currentLogoIndex = 0;
let logoInterval,
  autoShuffleInterval = null,
  carouselInterval = null;
let isMinimized = false,
  isLightboxMinimized = false;
let guideDimensionsCache = {};
let pausedTime = 0;
let tappedGuide = null;
let currentTheme = "light";
let isCarouselShuffleActive = false;

const lang = languageStrings[config.language.current] || languageStrings.pl;

const fileInput = document.getElementById("fileInput"),
  fileInputLabel = document.getElementById("fileInputLabel"),
  searchInput = document.getElementById("search"),
  formatFilter = document.getElementById("formatFilter"),
  guideList = document.getElementById("guideList"),
  pagination = document.getElementById("pagination"),
  sortSelector = document.getElementById("sortSelector"),
  generator = document.getElementById("generator"),
  backdrop = document.getElementById("backdrop"),
  playGuideContainer = document.getElementById("play-guide-container"),
  playCaption = document.getElementById("play-caption"),
  playCloseBtn = document.getElementById("playCloseBtn"),
  fullscreenBtn = document.getElementById("fullscreenBtn"),
  fullscreenBtnLightbox = document.getElementById("fullscreenBtnLightbox"),
  lightboxControls = document.getElementById("lightbox-controls"),
  slideshowPlayBtn = document.getElementById("slideshow-play"),
  logoLink = document.getElementById("logoLink"),
  bgVideo = document.getElementById("bg-video"),
  bgVideoSource = document.getElementById("bg-video-source"),
  lightboxLabelsBtn = document.getElementById("lightbox-labelsBtn"),
  lightboxFxBtn = document.getElementById("lightbox-fxBtn"),
  mainResetBtn = document.getElementById("mainResetBtn");

function initializeTheme() {
  const storedTheme = localStorage.getItem("visudir_theme");
  const theme = storedTheme || "light";
  const isDark = theme === "dark";

  // Poprawka: Aplikuj klasę do <html> ORAZ <body>
  document.documentElement.classList.toggle("dark-mode", isDark);
  document.body.classList.toggle("dark-mode", isDark);

  if (!storedTheme) {
    localStorage.setItem("visudir_theme", theme);
  }
  return theme;
}

// --- START: Logika liczników czasu i bezczynności ---

function formatTime(ms) {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (num) => num.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function updateGuideCount(count, total) {
  try {
    const displayEl = document.getElementById("guideCountDisplay");
    if (displayEl) {
      const counterTemplate =
        lang.guideCounter || "<b>{count}</b> / {total} pozycji";
      displayEl.innerHTML = counterTemplate
        .replace("{count}", count)
        .replace("{total}", total);
    }
  } catch (e) {
    console.error("Błąd krytyczny w updateGuideCount:", e);
  }
}

let idleResetTimeout = null;
function resetIdleTimer() {
  clearTimeout(idleResetTimeout);

  // KLUCZOWA ZMIANA: Rozróżnienie stanu przejściowego (stage1) od pełnego wygaszacza (stage2)
  if (screenSaverState === "stage1") {
    // SCENARIUSZ 1: Użytkownik przerwał zanim włączył się pokaz slajdów.
    // Musimy przywrócić cały interfejs i zresetować stan.
    restoreUiFromScreenSaver();
  } else if (screenSaverState === "stage2") {
    // SCENARIUSZ 2: Użytkownik poruszył myszą w trakcie aktywnego pokazu slajdów.
    // Przywracamy tylko kontrolki pokazu slajdów, ale NIE resetujemy stanu.
    const hiddenSlideshowControls = document.querySelectorAll(
      "#lightbox-controls.screensaver-fade-out, #play-caption.screensaver-fade-out, #playCloseBtn.screensaver-fade-out, #fullscreenBtnLightbox.screensaver-fade-out, #lightbox-minimizeBtn.screensaver-fade-out"
    );
    hiddenSlideshowControls.forEach((el) =>
      el.classList.remove("screensaver-fade-out")
    );

    const statusWidget = document.getElementById("slideshow-status-widget");
    if (statusWidget) {
      statusWidget.classList.add("visible");
    }
  }

  // Poniższa logika "zamrażania" licznika i resetu czasu pozostaje bez zmian.
  const previousActivityTime = lastActivityTime;
  lastActivityTime = new Date();

  if (previousActivityTime && new Date() - previousActivityTime > 1000) {
    isIdleTimerFrozen = true;

    const finalIdleDuration = new Date() - previousActivityTime;
    const formattedFinalIdle = formatTime(finalIdleDuration);

    const idleElements = document.querySelectorAll(
      "#timeDisplay .idle-time, #widget-idle span"
    );
    idleElements.forEach((el) => {
      if (el) {
        el.textContent = formattedFinalIdle;
        const parent = el.closest(".widget-item") || el.parentElement;
        parent.classList.add("timer-frozen");
      }
    });
  }

  idleResetTimeout = setTimeout(() => {
    isIdleTimerFrozen = false;
    const idleElements = document.querySelectorAll(".timer-frozen");
    idleElements.forEach((el) => el.classList.remove("timer-frozen"));
    updateTimers();
  }, 2000);
}

function updateTimers() {
  // Jeśli licznik jest "zamrożony", nie aktualizujemy go co sekundę
  if (isIdleTimerFrozen) {
    saveToLocalStorage(GLOBAL_SESSION_UPDATE_KEY, new Date().getTime()); // Heartbeat musi działać nadal
    return;
  }

  checkScreenSaverState();

  const now = new Date();
  const sessionDuration = now - globalSessionStartTime;
  const idleDuration = now - lastActivityTime;

  const formattedIdle = formatTime(idleDuration);
  const formattedSession = formatTime(sessionDuration);

  // Aktualizacja timerów w stopce (istniejąca logika)
  const idleTimeEl = document.querySelector("#timeDisplay .idle-time");
  const sessionTimeEl = document.querySelector("#timeDisplay .session-time");

  if (idleTimeEl && sessionTimeEl) {
    idleTimeEl.textContent = formattedIdle;
    sessionTimeEl.textContent = formattedSession;
  }

  const statusWidget = document.getElementById("slideshow-status-widget");
  if (statusWidget && statusWidget.classList.contains("visible")) {
    document.querySelector("#widget-clock span").textContent =
      now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    const widgetIdle = document.querySelector("#widget-idle");
    widgetIdle.querySelector("span").textContent = formattedIdle;

    if (idleDuration > 1000) {
      widgetIdle.classList.add("idle-pulse");
    } else {
      widgetIdle.classList.remove("idle-pulse");
    }

    document.querySelector("#widget-session span").textContent =
      formattedSession;
  }

  saveToLocalStorage(GLOBAL_SESSION_UPDATE_KEY, now.getTime());
}

// --- END: Logika liczników czasu i bezczynności ---
function getMoonPhase(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let r = year % 100;
  r %= 19;
  if (r > 9) {
    r -= 19;
  }
  r = ((r * 11) % 30) + month + day;
  if (month < 3) {
    r += 2;
  }
  r -= year < 2000 ? 4 : 8.3;
  r = Math.floor(r + 0.5) % 30;
  const phaseIndex = Math.floor((r < 0 ? r + 30 : r) / 3.7);
  return phaseIndex;
}

function updateRealTimeClock() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const clockEl = document.getElementById("currentTimeDisplay");
  if (clockEl) {
    clockEl.innerHTML = `<b>${hours}:${minutes}</b> ${year}-${month}-${day}`;
  }
}

function initializeBackgroundVideo(theme) {
  const pageKey = config.pageSettings.pageKey;
  const storageKey = `visudir_bg_video_${pageKey}`;
  const storedVideoNum = localStorage.getItem(storageKey);
  let videoNum = parseInt(storedVideoNum) || config.pageSettings.defaultBgVideo;
  if (
    videoNum < config.pageSettings.bgVideoStartNum ||
    videoNum > config.pageSettings.bgVideoEndNum
  ) {
    videoNum = config.pageSettings.defaultBgVideo;
  }
  if (bgVideo && bgVideoSource) {
    const videoUrlBase =
      theme === "light"
        ? config.paths.videoBgLightUrlBase
        : config.paths.videoBgDarkUrlBase;
    const videoSrc = `${videoUrlBase}${videoNum}.mp4`;
    bgVideoSource.src = videoSrc;
    bgVideo.load();
    bgVideo.muted = isAudioMuted;
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Błąd odtwarzania wideo:", error);
        }
      });
    }

    bgVideo.addEventListener(
      "canplay",
      () => {
        document.body.classList.add("video-ready");
      },
      {
        once: true,
      }
    );
  }
  if (!storedVideoNum || parseInt(storedVideoNum) !== videoNum) {
    localStorage.setItem(storageKey, videoNum);
  }
}

function updateBackgroundVideoVisibility(forceShow = false) {
  if (!bgVideo) return;
  const isVideoVisible = videoBgState !== "off";
  if (isVideoVisible) {
    if (bgVideo.style.display !== "block" || forceShow) {
      bgVideo.style.display = "block";
      initializeBackgroundVideo(currentTheme);
    }
  } else {
    bgVideo.style.display = "none";
    document.body.classList.remove("video-ready");
  }
}

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

function loadUiSettings() {
  currentSort = getFromLocalStorage("sort") || config.pageSettings.defaultSort;

  selectedRowCount =
    parseInt(getFromLocalStorage("rows")) || config.pageSettings.defaultRows;
  const savedSizePercent = getFromLocalStorage("size_percent");
  const sizePercent =
    savedSizePercent !== null
      ? parseInt(savedSizePercent)
      : config.pageSettings.defaultSizePercent;

  document.getElementById("rowsSlider").value = selectedRowCount;
  document.getElementById("rowsValue").textContent = selectedRowCount;
  document.getElementById("sizeSlider").value = sizePercent;
  document.getElementById("sizeValue").textContent = `${sizePercent}%`;

  const savedVideoState = getFromLocalStorage("video_bg_state");
  videoBgState =
    savedVideoState || (config.pageSettings.defaultVideoBg ? "playing" : "off");

  const savedLabels = getFromLocalStorage("labels_visible");
  areLabelsVisible =
    savedLabels !== null
      ? JSON.parse(savedLabels)
      : config.pageSettings.defaultLabelsVisible;

  const savedSlideshowPlaying = getFromLocalStorage("slideshow_playing");
  slideshowIsPlaying =
    savedSlideshowPlaying !== null ? JSON.parse(savedSlideshowPlaying) : true;

  const savedSlideshowFx = getFromLocalStorage("slideshow_fx");
  slideshowAnimationsEnabled =
    savedSlideshowFx !== null
      ? JSON.parse(savedSlideshowFx)
      : config.pageSettings.slideshowAnimations;

  pausedTime = parseFloat(getFromLocalStorage("video_paused_time")) || 0;

  const videoShuffle =
    JSON.parse(getFromLocalStorage("video_shuffle_enabled")) || false;
  if (videoShuffle && videoBgState === "playing") {
    bgVideo.addEventListener(
      "canplay",
      () => {
        toggleAutoShuffle(true);
      },
      {
        once: true,
      }
    );
  }

  generatorMode =
    getFromLocalStorage("generator_mode") ||
    config.pageSettings.defaultGeneratorMode;
}

function getFileExtension(filename) {
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
}

function normalizeUrl(url) {
  const trimmedUrl = url.trim();
  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://") ||
    trimmedUrl.startsWith("./") ||
    trimmedUrl.startsWith("../") ||
    trimmedUrl.startsWith("/")
  ) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
}

function decodeUrlFromFilename(filename) {
  let urlPart = filename.split("$$")[0];
  urlPart = urlPart.replace(/\.link$/i, "");

  // NOWA LOGIKA: Zamienia tylko pierwszy znak '_' na '.'
  if (urlPart.startsWith("_")) {
    urlPart = "." + urlPart.substring(1);
  }

  // POPRAWKA: Zamienia '!!' na '/', co jest bezpieczne dla Gita.
  urlPart = urlPart.split("!!").join("/");
  urlPart = urlPart.replace(/&&/g, "?");
  return normalizeUrl(urlPart);
}

function parseGuideTitle(filename) {
  const baseName = filename
    .replace(/\.(pdf|epub|mobi|link|jpg|png|mp4|avi)$/i, "")
    .trim();
  const parts = baseName.split("$$");
  if (getFileExtension(filename) === "link" && parts.length > 1) {
    return {
      title: decodeURIComponent(parts[1] || ""),
      offlineDesc: decodeURIComponent(parts[2] || null),
    };
  }
  const title = decodeURIComponent(
    parts[0].replace(/_/g, " ").replace(/-/g, " ")
  )
    .replace(/\s*-\s*Poradnik(?:_do_gry)?\s*(?:GRY-OnLine|Gry-OnLine)?\s*/i, "")
    .trim();
  return {
    title: title,
    offlineDesc: null,
  };
}

function createDateFromStrings(dateStr, timeStr) {
  const [day, month, year] = dateStr.split(".").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function applySort(sortType, array) {
  currentSort = sortType;
  switch (sortType) {
    case "shuffle":
      shuffleArray(array);
      break;
    case "nameAsc":
      array.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "nameDesc":
      array.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "dateAsc":
      array.sort((a, b) => a.timestamp - b.timestamp);
      break;
    case "dateDesc":
      array.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case "sizeAsc":
      array.sort((a, b) => parseFloat(a.sizeMB) - parseFloat(b.sizeMB));
      break;
    case "sizeDesc":
      array.sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB));
      break;
  }
}

function getGuideOrientation(guide) {
  return new Promise((resolve) => {
    const f = guide.file
      .replace(/\.(pdf|epub|mobi|link|jpg|png|mp4|avi)$/i, "")
      .split("$$")[0];
    const coverUrl = `${config.paths.coversFolderName}/${encodeURIComponent(
      f
    )}.jpg`;
    if (guideDimensionsCache[coverUrl]) {
      guide.orientation = guideDimensionsCache[coverUrl];
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => {
      guide.orientation =
        img.naturalHeight > img.naturalWidth ? "vertical" : "horizontal";
      guideDimensionsCache[coverUrl] = guide.orientation;
      resolve();
    };
    img.onerror = () => {
      guide.orientation = "unknown";
      guideDimensionsCache[coverUrl] = "unknown";
      resolve();
    };
    img.src = coverUrl;
  });
}

async function processData(text) {
  const lines = text.split(/\r?\n/);
  guides = [];
  updateGuideCount(guides.length, guides.length);
  for (const line of lines) {
    const match = line.match(
      /^(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})\s+((?:<DIR>)|\d+)\s+(.+)$/i
    );
    if (match) {
      const date = match[1];
      const time = match[2];
      const sizeOrDir = match[3];
      const filename = match[4];
      const format = getFileExtension(filename);
      let sizeBytes = 0;
      if (sizeOrDir !== "<DIR>") {
        sizeBytes = parseInt(sizeOrDir);
      }
      if (sizeBytes === 0 && format !== "link") continue;
      const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
      const { title, offlineDesc } = parseGuideTitle(filename);
      let linkData = {
        description: offlineDesc,
      };
      if (format === "link" && !isOffline) {
        try {
          const response = await fetch(
            `${config.paths.dataFolderName}/${filename}`
          );
          if (response.ok) {
            linkData.description = await response.text();
          } else if (!offlineDesc) {
            linkData.description = "Błąd wczytywania opisu.";
          }
        } catch (e) {
          if (!offlineDesc) linkData.description = "Błąd wczytywania opisu.";
        }
      }
      guides.push({
        title,
        format,
        file: filename,
        sizeMB,
        date,
        time,
        timestamp: createDateFromStrings(date, time).getTime(),
        linkData,
        orientation: "pending",
        tags:
          typeof itemTags !== "undefined" && itemTags[filename]
            ? itemTags[filename]
            : [],
      });
    }
  }

  // Proces unifikacji danych: nadpisywanie tytułów i opisów z plików tłumaczeń
  try {
    const currentLang = config.language.current;
    let dictionary = null;

    // Krok 1: Spróbuj znaleźć dedykowany słownik (np. z db-lang-de.js)
    // POPRAWKA: Używamy `window[]` do dynamicznego dostępu do globalnych zmiennych
    const specificLangDictionary = window[`itemTranslations_${currentLang}`];

    if (typeof specificLangDictionary !== "undefined") {
      dictionary = specificLangDictionary;
    }
    // Krok 2: Jeśli nie ma, poszukaj w głównym pliku (db-langs.js)
    else if (
      typeof itemTranslations !== "undefined" &&
      typeof itemTranslations[currentLang] !== "undefined"
    ) {
      dictionary = itemTranslations[currentLang];
    }
    // Krok 3: Jeśli nadal nic, użyj angielskiego z głównego pliku jako fallback
    else if (typeof itemTranslations !== "undefined") {
      dictionary = itemTranslations["en"];
    }

    if (dictionary) {
      guides = guides.map((guide) => {
        const translation = dictionary[guide.file];
        if (translation) {
          // Znaleziono tłumaczenie, nadpisujemy dane
          guide.title = translation.title || guide.title;
          if (translation.description) {
            guide.linkData.description = translation.description;
          }
        }
        return guide;
      });
    }
  } catch (e) {
    console.error("Błąd podczas unifikacji tłumaczeń:", e);
  }

  const orientationPromises = guides
    .filter((guide) =>
      ["jpg", "png", "link", "mp4", "avi"].includes(guide.format)
    )
    .map((guide) => getGuideOrientation(guide));
  await Promise.all(orientationPromises);

  try {
    const guideCountDisplay = document.getElementById("guideCountDisplay");
    if (guideCountDisplay) {
      const currentCount = (filteredGuides && filteredGuides.length) || 0;
      updateGuideCount(currentCount, guides.length);
    }
  } catch (e) {
    console.error("Błąd aktualizacji licznika po przetworzeniu danych:", e);
  }
}

function updateFormatFilter() {
  const formats = [
    ...new Set(guides.map((g) => g.format.toUpperCase())),
  ].sort();
  formatFilter.innerHTML = `<option value="">${lang.filterAll}</option>`;
  formats.forEach((t) => {
    const o = document.createElement("option");
    o.value = t.toLowerCase();
    o.textContent = t;
    formatFilter.appendChild(o);
  });
  if (config.pageSettings.predefinedFilters.some((p) => p.label && p.search)) {
    const s = document.createElement("option");
    s.disabled = true;
    s.textContent = "──────────";
    formatFilter.appendChild(s);
  }
  config.pageSettings.predefinedFilters.forEach((p) => {
    if (p.label && p.search) {
      const o = document.createElement("option");
      o.value = `search:${p.search}`;
      o.textContent = p.label;
      formatFilter.appendChild(o);
    }
  });
}

function loadAndParseFile(file) {
  const r = new FileReader();
  r.onload = (e) => init(e.target.result);
  r.readAsText(file, "utf-8");
  fileInput.value = null;
}

function applyFilters() {
  generatedGuides = null;
  let search = searchInput.value.toLowerCase();
  const formatValue = formatFilter.value;
  let format = formatValue;
  if (formatValue.startsWith("search:")) {
    search = formatValue.substring(7).toLowerCase();
    format = "";
  }
  filteredGuides = guides.filter((g) => {
    const inTitle = g.title.toLowerCase().includes(search);
    const inDescription =
      g.linkData.description &&
      g.linkData.description.toLowerCase().includes(search);
    const inTags =
      g.tags && g.tags.some((tag) => tag.toLowerCase().includes(search));
    const searchMatch = inTitle || inDescription || inTags;
    const formatMatch = !format || g.format === format;
    const orientationMatch =
      !orientationFilterState || g.orientation === orientationFilterState;
    return searchMatch && formatMatch && orientationMatch;
  });
  slideshowSourceGuides = filteredGuides;
  stopCarousel();
}

async function init(data) {
  if (fileInputLabel) fileInputLabel.style.display = "none";
  await processData(data);
  updateFormatFilter();

  const generatorSelect = document.getElementById("generator");
  config.pageSettings.generatorOptions.forEach((num) => {
    const option = document.createElement("option");
    option.value = num;
    option.textContent = lang.generatorItem.replace("{count}", num);
    generatorSelect.appendChild(option);
  });
  generatorSelect.value = config.pageSettings.defaultGeneratorCount;

  const sortSelect = document.getElementById("sortSelector");
  const defaultSortOption = sortSelect.querySelector(
    `[value="${config.pageSettings.defaultSort}"]`
  );
  if (defaultSortOption) defaultSortOption.style.fontWeight = "bold";

  applySort(currentSort, guides);
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");
  if (searchQuery) {
    searchInput.value = decodeURIComponent(searchQuery);
  }
  const defaultFormat = config.pageSettings.defaultFormat || "";
  formatFilter.value = (
    getFromLocalStorage("format") || defaultFormat
  ).toLowerCase();
  applyFilters();
  renderGuides();
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("fade-out");
  }
}

function startLogoRotator() {
  const logoImg1 = document.getElementById("logo-img-1");
  const logoImg2 = document.getElementById("logo-img-2");
  const headerLogoLink = document.getElementById("logoLink");
  const fullscreenBtn = document.getElementById("fullscreenBtn"); // <-- WŁAŚCIWY PRZYCISK

  if (!logoImg1 || !logoImg2 || !headerLogoLink || !fullscreenBtn) return;

  let activeImg = logoImg1;
  let nextImg = logoImg2;
  let isGlobeIconVisible = false;

  // ... (reszta kodu do obsługi logo pozostaje bez zmian)
  const updateLogo = () => {
    const isDark = document.documentElement.classList.contains("dark-mode");
    const newLogoData = config.logoRotator.logos[currentLogoIndex];
    nextImg.src = isDark ? newLogoData.srcDark : newLogoData.srcLight;
    nextImg.alt = newLogoData.alt;
    headerLogoLink.href = newLogoData.href;
    activeImg.classList.remove("active");
    nextImg.classList.add("active");
    [activeImg, nextImg] = [nextImg, activeImg];
  };
  currentLogoIndex = 0;
  const initialLogo = config.logoRotator.logos[currentLogoIndex];
  const isDarkInitial =
    document.documentElement.classList.contains("dark-mode");
  activeImg.src = isDarkInitial ? initialLogo.srcDark : initialLogo.srcLight;
  activeImg.alt = initialLogo.alt;
  headerLogoLink.href = initialLogo.href;
  activeImg.classList.add("active");

  if (
    !config.logoRotator ||
    !config.logoRotator.enabled ||
    config.logoRotator.logos.length < 2
  ) {
    return;
  }

  clearInterval(logoInterval);
  logoInterval = setInterval(() => {
    currentLogoIndex = (currentLogoIndex + 1) % config.logoRotator.logos.length;
    updateLogo();
  }, config.logoRotator.interval);
}

function applyLanguage() {
  updateGuideCount(0, 0);
  document.querySelectorAll("[data-lang]").forEach((el) => {
    const key = el.dataset.lang;
    if (lang[key]) el.textContent = lang[key];
  });
  document.querySelectorAll("[data-lang-placeholder]").forEach((el) => {
    const key = el.dataset.langPlaceholder;
    if (lang[key]) el.placeholder = lang[key];
  });
  document.querySelectorAll("[data-lang-title]").forEach((el) => {
    const key = el.dataset.langTitle;
    if (lang[key]) el.title = lang[key];
  });
  document.title = config.pageSettings.pageTitle || lang.pageTitle;
  const footerDateEl = document.querySelector('[data-lang="footerDate"]');
  if (footerDateEl && config.updated) {
    footerDateEl.textContent = `© ${config.updated}`;
  }

  try {
    const langText = config.language.current.toUpperCase();
    const langEl = document.getElementById("langDisplay");
    if (langEl) langEl.textContent = langText;
  } catch (e) {
    console.error("Błąd podczas ustawiania paska statusu:", e);
  }
}

function initializeCurtainControls() {
  const curtainToggleButton = document.getElementById("curtain-toggle-btn");
  const topRow = document.querySelector(".deck-top-row");

  if (curtainToggleButton && topRow) {
    curtainToggleButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    curtainToggleButton.addEventListener("click", () => {
      topRow.classList.toggle("filters-expanded");
    });
  }
}

function buildDynamicPaths() {
  const prefix = config.pageSettings.pathCorrection || ".";
  const buildPath = (path) => `${prefix}/${path}`;

  // 1. Dynamiczne budowanie ścieżek do logo
  config.logoRotator.logos = [
    {
      srcLight: buildPath(
        "ade-shared/gfx/interface/logo-VisuDir-light-240px.png"
      ),
      srcDark: buildPath(
        "ade-shared/gfx/interface/logo-VisuDir-dark-240px.png"
      ),
      href: buildPath("ade-shared/about.html"),
      alt: "Logo VisuDir",
    },
    {
      srcLight: buildPath(
        "ade-shared/gfx/interface/logo-ade-v1-light-240px.png"
      ),
      srcDark: buildPath("ade-shared/gfx/interface/logo-ade-v1-dark-240px.png"),
      href: "https://www.ade.pl",
      alt: "Logo ADE",
    },
  ];

  // 2. Dynamiczne budowanie pozostałych ścieżek współdzielonych
  config.paths.url404 = buildPath("ade-shared/404.html");
  config.paths.urlAbout = buildPath("ade-shared/about.html");
  config.paths.urlFallback = buildPath("ade-shared/soon.html");
  config.paths.videoBgLightUrlBase = buildPath("ade-shared/video-bg/bg-light");
  config.paths.videoBgDarkUrlBase = buildPath("ade-shared/video-bg/bg-dark");
}

window.onload = function () {
  buildDynamicPaths();

  applyLanguage();
  if (fileInputLabel) fileInputLabel.style.display = "none";
  document
    .querySelectorAll(".version-display")
    .forEach((el) => (el.textContent = config.version));
  document.getElementById("aboutLinkFooter").href = config.paths.urlAbout;
  currentTheme = initializeTheme();
  if (config.pageSettings.showMiniLogo && logoLink) {
    startLogoRotator();
  } else if (logoLink) {
    logoLink.style.display = "none";
  }
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.style.display = config.pageSettings.showBackButton
      ? "flex"
      : "none";
  }

  loadUiSettings();

  updateBackgroundVideoVisibility(true);
  if (videoBgState === "paused") {
    bgVideo.addEventListener(
      "canplay",
      () => {
        bgVideo.currentTime = pausedTime;
        bgVideo.pause();
      },
      {
        once: true,
      }
    );
  }
  document
    .getElementById("minimizeBtn")
    .addEventListener("click", toggleMinimizeView);
  document
    .getElementById("lightbox-minimizeBtn")
    .addEventListener("click", toggleLightboxMinimize);

  // --- START: New Database Selection Logic ---
  const languageDatabases = {
    en: typeof data_en !== "undefined" ? data_en : null,
    de: typeof data_de !== "undefined" ? data_de : null,
    es: typeof data_es !== "undefined" ? data_es : null,
    fr: typeof data_fr !== "undefined" ? data_fr : null,
    it: typeof data_it !== "undefined" ? data_it : null,
    ja: typeof data_ja !== "undefined" ? data_ja : null,
    zh: typeof data_zh !== "undefined" ? data_zh : null,
    pt: typeof data_pt !== "undefined" ? data_pt : null,
    cs: typeof data_cs !== "undefined" ? data_cs : null,
    sk: typeof data_sk !== "undefined" ? data_sk : null,
    uk: typeof data_uk !== "undefined" ? data_uk : null,
    id: typeof data_id !== "undefined" ? data_id : null,
    hi: typeof data_hi !== "undefined" ? data_hi : null,
  };

  const currentLang = config.language.current;
  let selectedData = typeof dataFromFile !== "undefined" ? dataFromFile : null; // Default to Polish

  if (currentLang !== "pl" && languageDatabases[currentLang]) {
    selectedData = languageDatabases[currentLang];
  }
  // --- END: New Database Selection Logic ---

  if (selectedData && selectedData.trim().length > 0) {
    init(selectedData);
  } else {
    fetch(config.paths.databaseFileName)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.statusText)))
      .then((t) => init(t))
      .catch((e) => {
        console.error(
          `Automatyczne ładowanie pliku '${config.paths.databaseFileName}' nie powiodło się. Błąd:`,
          e
        );
        if (fileInputLabel) fileInputLabel.style.display = "flex";
        const preloader = document.getElementById("preloader");
        if (preloader) {
          preloader.classList.add("fade-out");
        }
      });
  }

  initializeGlobalSession(); // Najpierw inicjalizujemy lub dołączamy do sesji
  lastActivityTime = new Date(); // Czas bezczynności pozostaje lokalny dla instancji

  setInterval(updateTimers, 1000); // Następnie uruchamiamy timer, który będzie podtrzymywał sesję

  ["mousedown", "mousemove", "keydown", "touchstart"].forEach((event) =>
    window.addEventListener(event, resetIdleTimer)
  );

  const controlPanel = document.querySelector(".control-panel");
  if (controlPanel) {
    controlPanel.classList.add("animated-control-panel");
  }

  updateLocationBasedStatus();
};

function toggleMinimizeView() {
  const minimizeBtn = document.getElementById("minimizeBtn");
  isMinimized = !isMinimized;

  minimizeBtn.classList.toggle("minimized", isMinimized);
  minimizeBtn.title = isMinimized ? lang.maximizeBtn : lang.minimizeBtn;
  const icon = minimizeBtn.querySelector("i");
  if (icon) {
    icon.className = isMinimized ? "fas fa-chevron-down" : "fas fa-chevron-up";
  }

  const topHeader = document.querySelector(".top-header");
  const footer = document.querySelector(".footer");
  topHeader.classList.toggle("minimized-header", isMinimized);
  footer.classList.toggle("minimized-footer", isMinimized);
}

function toggleLightboxMinimize() {
  const minimizeBtn = document.getElementById("lightbox-minimizeBtn");
  const minimizeIcon = minimizeBtn.querySelector("i");
  isLightboxMinimized = !isLightboxMinimized;
  lightboxControls.classList.toggle("minimized-controls", isLightboxMinimized);
  minimizeBtn.title = isLightboxMinimized ? lang.maximizeBtn : lang.minimizeBtn;
  minimizeIcon.className = isLightboxMinimized
    ? "fas fa-chevron-up"
    : "fas fa-chevron-down";
}

function resetView() {
  stopPlayAnimation();
  stopCarousel();
  searchInput.value = "";
  formatFilter.value = "";
  sortSelector.value = "";
  applySort(config.pageSettings.defaultSort, guides);
  saveToLocalStorage("sort", config.pageSettings.defaultSort);

  if (guideList)
    guideList.scrollTo({
      left: 0,
      behavior: "smooth",
    });

  orientationFilterState = null;

  selectedRowCount = config.pageSettings.defaultRows;
  const sizePercent = config.pageSettings.defaultSizePercent;
  document.getElementById("rowsSlider").value = selectedRowCount;
  document.getElementById("rowsValue").textContent = selectedRowCount;
  document.getElementById("sizeSlider").value = sizePercent;
  document.getElementById("sizeValue").textContent = `${sizePercent}%`;

  saveToLocalStorage("rows", selectedRowCount);
  saveToLocalStorage("size_percent", sizePercent);

  currentViewMode = config.pageSettings.defaultViewMode;
  saveToLocalStorage("view_mode", currentViewMode);

  generator.value = config.pageSettings.defaultGeneratorCount;
  generatorMode = config.pageSettings.defaultGeneratorMode;
  saveToLocalStorage("generator_mode", generatorMode);
  updateGeneratorModeBtn();

  applyFilters();
  renderGuides();
}

function checkFileAndOpen(targetUrl, fallbackUrl, isLink = false) {
  if (targetUrl.startsWith("http")) {
    window.open(targetUrl, "_blank");
    return;
  }

  if (isOffline) {
    window.open(targetUrl, "_blank");
    return;
  }

  const [filePath] = targetUrl.split("?");

  fetch(filePath, {
    method: "HEAD",
    cache: "no-store",
  })
    .then((response) => {
      if (response.ok) {
        window.open(targetUrl, "_blank");
      } else {
        window.location.href = fallbackUrl;
      }
    })
    .catch(() => {
      window.location.href = fallbackUrl;
    });
}

const goToPage = (pageNum) => {
  pageNum = Math.max(1, Math.min(totalPages, pageNum));
  const targetScrollLeft = guideList.clientWidth * (pageNum - 1);

  updateWrapperHeightForPage(pageNum);

  guideList.scrollTo({
    left: targetScrollLeft,
    behavior: "smooth",
  });
};

// ================================================================
//          POCZĄTEK BLOKU DO PODMIANY (3 FUNKCJE)
// ================================================================

function renderGuides(sourceArray = null) {
  stopCarousel();
  const source =
    sourceArray ||
    (generatorMode === "visible" && generatedGuides) ||
    filteredGuides;

  guideList.classList.remove("random-draw");
  if (sourceArray) {
    guideList.classList.add("random-draw");
  }

  guideList.classList.toggle(
    "view-image-only",
    currentViewMode === "image-only"
  );
  guideList.classList.toggle("view-grid", currentViewMode === "grid");
  guideList.classList.toggle("view-masonry", currentViewMode === "masonry");
  guideList.classList.toggle("view-text-only", currentViewMode === "text-only");
  guideList.classList.toggle("view-full-text", currentViewMode === "full-text"); // DODAJ TĘ LINIĘ
  guideList.classList.toggle(
    "view-text-masonry",
    currentViewMode === "text-masonry"
  );

  guideList.innerHTML = "";
  if (lazyLoadObserver) lazyLoadObserver.disconnect();

  const sizePercent = document.getElementById("sizeSlider").value;
  const newWidth = Math.floor(
    config.pageSettings.baseBoxWidth * (sizePercent / 100)
  );
  const minSlider = 50,
    maxSlider = 150;
  const minFont = 0.8,
    maxFont = 1.3;

  const percent = (sizePercent - minSlider) / (maxSlider - minSlider);

  const dynamicFontSize = minFont + percent * (maxFont - minFont);
  guideList.style.setProperty(
    "--dynamic-font-size",
    `${dynamicFontSize.toFixed(2)}rem`
  );
  guideList.style.setProperty("--grid-rows", selectedRowCount);
  guideList.style.setProperty("--box-width", `${newWidth}px`);

  if (sourceArray) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "guide-page";
    pageDiv.dataset.pageNumber = 1;

    source.forEach((guide, index) => {
      const div = document.createElement("div");
      div.className = "guide animate-in";
      div.style.animationDelay = `${index * 0.04}s`;
      div.innerHTML = createGuideHtml(guide);
      pageDiv.appendChild(div);
    });
    guideList.appendChild(pageDiv);

    pagination.classList.remove("visible");
    updateGuideCount(source.length, guides.length);

    if (currentViewMode === "masonry" || currentViewMode === "text-masonry") {
      setTimeout(() => applyMasonryLayout(pageNum), 100);
    }
    return;
  }

  const itemWidth = newWidth;
  const columns =
    Math.floor(guideList.clientWidth / (itemWidth + 20) + 0.0001) || 1;
  const itemsPerPage = columns * selectedRowCount;

  pagesCache = [];
  if (itemsPerPage > 0) {
    for (let i = 0; i < source.length; i += itemsPerPage) {
      pagesCache.push(source.slice(i, i + itemsPerPage));
    }
  } else if (source.length > 0) {
    pagesCache.push(source);
  }
  totalPages = pagesCache.length || 1;

  pagesCache.forEach((pageItems, pageIndex) => {
    const pageDiv = document.createElement("div");
    pageDiv.className = "guide-page";
    pageDiv.dataset.pageNumber = pageIndex + 1;

    if (pageIndex === 0) {
      pageItems.forEach((guide, index) => {
        const div = document.createElement("div");
        div.className = "guide";
        if (isInitialLoad) {
          div.classList.add("animate-in");
          div.style.animationDelay = `${index * 0.04}s`;
        }
        div.innerHTML = createGuideHtml(guide);
        pageDiv.appendChild(div);
      });
    }
    guideList.appendChild(pageDiv);
  });

  setupLazyLoading(pagesCache);
  renderPagination();
  updateGuideCount(source.length, guides.length);

  if (isInitialLoad) {
    isInitialLoad = false;
    preloadNextPageImages();
  }

  if (currentViewMode === "masonry" || currentViewMode === "text-masonry") {
    setTimeout(() => applyMasonryLayout(pageNum), 100);
  }

  updateWrapperHeightForPage(1);
}

// ================================================================
//          KONIEC BLOKU DO PODMIANY
// ================================================================

function setupLazyLoading(pages) {
  if (lazyLoadObserver) lazyLoadObserver.disconnect();

  lazyLoadObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageDiv = entry.target;
          const pageNum = parseInt(pageDiv.dataset.pageNumber, 10);

          if (pageDiv.childElementCount === 0 && pageNum > 1) {
            const pageItems = pages[pageNum - 1];
            // ... wewnątrz funkcji setupLazyLoading, wewnątrz IntersectionObserver ...
            if (pageItems) {
              requestAnimationFrame(() => {
                pageItems.forEach((guide, index) => {
                  const div = document.createElement("div");
                  div.className = "guide";
                  div.innerHTML = createGuideHtml(guide);
                  pageDiv.appendChild(div);
                });
                const isMasonry =
                  currentViewMode === "masonry" ||
                  currentViewMode === "text-masonry" ||
                  currentViewMode === "image-masonry";

                if (isMasonry) {
                  // --- POCZĄTEK ŁATY ---
                  const images = Array.from(pageDiv.querySelectorAll("img"));
                  const imagePromises = images.map(
                    (img) =>
                      new Promise((resolve) => {
                        if (img.complete) {
                          resolve();
                        } else {
                          img.onload = img.onerror = resolve;
                        }
                      })
                  );
                  Promise.all(imagePromises).then(() => {
                    applyMasonryLayout(pageNum);
                  });
                  // --- KONIEC ŁATY ---
                }
              });
            }
            // ...
          }
          observer.unobserve(pageDiv);
        }
      });
    },
    {
      root: guideList,
      rootMargin: "0px 300px 0px 300px",
    }
  );

  document.querySelectorAll(".guide-page").forEach((page) => {
    lazyLoadObserver.observe(page);
  });
}

// Plik: scripts.js

function renderPagination() {
  pagination.innerHTML = `
    <div class="pagination-controls">
        <button id="firstPageBtn" title="${lang.paginationFirst}"><i class="fas fa-fast-backward"></i></button>
        <button id="prevPageBtn" title="${lang.paginationPrev}"><i class="fas fa-chevron-left"></i></button>
        <div class="pagination-center">
            <div class="page-info">
                <button id="paginationShuffleBtn" class="pagination-action-btn" title="Włącz losowe przewijanie"><i class="fas fa-random"></i></button>
                <div class="page-input-group">
                  <input type="number" id="pageInput" min="1" value="1" class="page-input">
                  <span id="pageInfoText" class="page-info-text">/ 1</span>
                </div>
                <button id="paginationCarouselBtn" class="pagination-action-btn" title="${lang.paginationCarouselStart}"><i class="fas fa-play"></i></button>
            </div>
            <input type="range" id="pageSlider" min="1" max="1" value="1" class="page-slider">
        </div>
        <button id="nextPageBtn" title="${lang.paginationNext}"><i class="fas fa-chevron-right"></i></button>
        <button id="lastPageBtn" title="${lang.paginationLast}"><i class="fas fa-fast-forward"></i></button>
    </div>
  `;

  // ... (reszta funkcji pozostaje bez zmian, ale dla pewności skopiuj całą poniższą część) ...

  const controls = pagination.querySelector(".pagination-controls");

  if (totalPages <= 1) {
    pagination.classList.remove("visible");
    return;
  }

  pagination.classList.add("visible", "animated-pagination");

  const firstPageBtn = document.getElementById("firstPageBtn");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const lastPageBtn = document.getElementById("lastPageBtn");
  const pageInput = document.getElementById("pageInput");
  const pageSlider = document.getElementById("pageSlider");
  const pageInfoText = document.getElementById("pageInfoText");

  // Zaktualizowany event listener dla nowego przycisku
  document.getElementById("paginationShuffleBtn").onclick =
    toggleCarouselShuffle;
  document.getElementById("paginationCarouselBtn").onclick = toggleCarousel;

  const updateControls = (pageNum) => {
    pageInfoText.textContent = `/ ${totalPages}`;
    pageInput.value = pageNum;
    pageInput.max = totalPages;
    pageSlider.value = pageNum;
    pageSlider.max = totalPages;
    firstPageBtn.disabled = prevPageBtn.disabled = pageNum <= 1;
    lastPageBtn.disabled = nextPageBtn.disabled = pageNum >= totalPages;
    preloadNextPageImages();
  };

  firstPageBtn.onclick = () => {
    stopCarousel();
    goToPage(1);
  };
  prevPageBtn.onclick = () => {
    stopCarousel();
    goToPage(currentPage - 1);
  };
  nextPageBtn.onclick = () => {
    stopCarousel();
    goToPage(currentPage + 1);
  };
  lastPageBtn.onclick = () => {
    stopCarousel();
    goToPage(totalPages);
  };
  pageSlider.addEventListener("input", () => {
    stopCarousel();
    pageInput.value = pageSlider.value;
  });
  pageSlider.addEventListener("change", () =>
    goToPage(parseInt(pageSlider.value, 10))
  );
  pageInput.addEventListener("change", () => {
    stopCarousel();
    goToPage(parseInt(pageInput.value, 10));
  });
  pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      stopCarousel();
      e.preventDefault();
      goToPage(parseInt(pageInput.value, 10));
      pageInput.blur();
    }
  });

  const paginationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNum = parseInt(entry.target.dataset.pageNumber, 10);
          currentPage = pageNum;
          updateControls(pageNum);
          updateWrapperHeightForPage(pageNum);
        }
      });
    },
    { root: guideList, threshold: 0.75 }
  );

  document
    .querySelectorAll(".guide-page")
    .forEach((page) => paginationObserver.observe(page));
  currentPage = 1;
  updateControls(1);
}

function preloadNextPageImages() {
  const nextPage = currentPage + 1;
  if (nextPage > totalPages || !pagesCache[nextPage - 1]) return;

  const nextGuides = pagesCache[nextPage - 1];

  nextGuides.forEach((guide) => {
    const baseFilename = guide.file
      .split("$$")[0]
      .replace(/\.(pdf|epub|mobi|link|jpg|png|mp4|avi)$/i, "");
    const thumbnailUrl = `${config.paths.coversFolderName}/${encodeURIComponent(
      baseFilename
    )}.jpg`;

    if (!preloadQueue.has(thumbnailUrl)) {
      new Image().src = thumbnailUrl;
      preloadQueue.add(thumbnailUrl);
    }
  });
}

function generateGuides() {
  stopPlayAnimation();
  stopCarousel();
  const count = parseInt(generator.value);
  if (!count) return;

  const source =
    generatorMode === "visible" ? generatedGuides || filteredGuides : guides;

  if (source.length === 0) {
    alert(lang.alertNoItems);
    generator.value = config.pageSettings.defaultGeneratorCount;
    return;
  }

  let result;
  if (count >= source.length) {
    result = [...source].sort(() => 0.5 - Math.random());
  } else {
    result = [...source].sort(() => 0.5 - Math.random()).slice(0, count);
  }

  generatedGuides = result;
  slideshowSourceGuides = result;

  renderGuides(result);
}

function initializeNewButtons() {
  document.getElementById("systemInfoLink").href = config.paths.urlAbout; // <-- DODAJ TĘ LINIĘ
  document.getElementById("systemInfoLink").href = config.paths.urlAbout; // DODAJ TĘ LINIĘ
  mainResetBtn.addEventListener("click", resetView);

  document.getElementById("statusInfoBtn").href = config.paths.urlAbout;

  // USUNIĘTO DWIE LINIJKI POWODUJĄCE BŁĄD, KTÓRE ODNOSIŁY SIĘ DO STAREJ LOGIKI JĘZYKÓW

  document
    .getElementById("statusMuteBtn")
    .addEventListener("click", toggleAudioMute);
  document
    .getElementById("statusFullscreenBtn")
    .addEventListener("click", toggleFullScreen);

  // Listenery dla przycisków wideo w panelu statusu
  document
    .getElementById("videoBtn-play")
    .addEventListener("click", handleVideoStateChange);
  document
    .getElementById("videoBtn-shuffle")
    .addEventListener("click", toggleAutoShuffle);
  document
    .getElementById("videoBtn-prev")
    .addEventListener("click", () => changeBackgroundVideo(-1));
  document
    .getElementById("videoBtn-next")
    .addEventListener("click", () => changeBackgroundVideo(1));
  document
    .getElementById("videoBtn-reset")
    .addEventListener("click", resetVideoSettings);

  updateVideoBtnUI();
}

function initializeDisplayPanel() {
  const viewThemeBtn = document.getElementById("viewThemeBtn");
  const viewContentBtn = document.getElementById("viewContentBtn");
  const viewOrientationBtn = document.getElementById("viewOrientationBtn");
  const sizeSlider = document.getElementById("sizeSlider");
  const sizeValue = document.getElementById("sizeValue");
  const rowsSlider = document.getElementById("rowsSlider");
  const rowsValue = document.getElementById("rowsValue");
  const viewPlayBtn = document.getElementById("viewPlayBtn");

  const viewModes = [
    "text-only", // 1
    "full-text", // 2
    "text-masonry", // 3
    "image-only", // 4: Grafika proporcjonalna
    "grid", // 5: Grafika w kwadracie
    "image-masonry", // 6: Masonry graficzne
    "view-seven", // 7: "Glass"
    "full", // 8: Pełny
    "masonry", // 9: Masonry mieszane
  ];

  viewContentBtn.innerHTML = `
    <i class="fas fa-layer-group view-icon"></i>
    <span class="view-number"></span>
  `;
  const viewNumberSpan = viewContentBtn.querySelector(".view-number");

  const updateView = () => {
    const viewNumber = viewModes.indexOf(currentViewMode) + 1;
    viewNumberSpan.textContent = viewNumber;
    saveToLocalStorage("view_mode", currentViewMode);
    renderGuides();
  };

  currentViewMode =
    getFromLocalStorage("view_mode") || config.pageSettings.defaultViewMode;
  viewContentBtn.title = "Zmień tryb widoku";
  updateView(); // Inicjalizacja numeru i widoku

  // ZMIANA: Obsługa lewego kliknięcia (następny tryb)
  viewContentBtn.addEventListener("click", () => {
    const currentIndex = viewModes.indexOf(currentViewMode);
    currentViewMode = viewModes[(currentIndex + 1) % viewModes.length];
    updateView();
  });

  // NOWOŚĆ: Obsługa prawego kliknięcia (poprzedni tryb)
  viewContentBtn.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // Zapobiega wyświetleniu menu kontekstowego
    const currentIndex = viewModes.indexOf(currentViewMode);
    const newIndex = (currentIndex - 1 + viewModes.length) % viewModes.length; // Poprawna obsługa pętli wstecz
    currentViewMode = viewModes[newIndex];
    updateView();
  });

  // ZMIANA: Logika ikony motywu
  const updateThemeIcon = () => {
    // Ikona jest zawsze księżycem, zmieniamy tylko jej wygląd przez CSS
    viewThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  };
  updateThemeIcon();

  viewThemeBtn.addEventListener("click", () => {
    toggleDarkMode();
    updateThemeIcon(); // Wywołujemy, choć na razie nie jest to konieczne, ale to dobra praktyka
  });

  viewOrientationBtn.addEventListener("click", () => {
    if (orientationFilterState === null) {
      orientationFilterState = "vertical";
      viewOrientationBtn.innerHTML = '<i class="fas fa-arrows-alt-v"></i>';
      viewOrientationBtn.title = lang.orientationFilterVert;
    } else if (orientationFilterState === "vertical") {
      orientationFilterState = "horizontal";
      viewOrientationBtn.innerHTML = '<i class="fas fa-arrows-alt-h"></i>';
      viewOrientationBtn.title = lang.orientationFilterHoriz;
    } else {
      orientationFilterState = null;
      viewOrientationBtn.innerHTML = '<i class="fas fa-images"></i>';
      viewOrientationBtn.title = lang.orientationFilterAll;
    }
    viewOrientationBtn.classList.toggle(
      "active",
      orientationFilterState !== null
    );
    applyFilters();
    renderGuides();
  });

  const debouncedMasonryReflow = debounce(
    () => applyMasonryLayout(currentPage),
    75
  );

  sizeSlider.addEventListener("input", () => {
    const sliderValue = parseInt(sizeSlider.value, 10);

    sizeValue.textContent = `${sliderValue}%`;
    const newWidth = Math.floor(
      config.pageSettings.baseBoxWidth * (sliderValue / 100)
    );
    guideList.style.setProperty("--box-width", `${newWidth}px`);

    const minSlider = 50,
      maxSlider = 150;
    const minFont = 0.8,
      maxFont = 1.3;
    const percent = (sliderValue - minSlider) / (maxSlider - minSlider);
    const dynamicFontSize = minFont + percent * (maxFont - minFont);
    guideList.style.setProperty(
      "--dynamic-font-size",
      `${dynamicFontSize.toFixed(2)}rem`
    );

    if (
      currentViewMode === "masonry" ||
      currentViewMode === "text-masonry" ||
      currentViewMode === "image-masonry"
    ) {
      debouncedMasonryReflow();
    }
  });

  sizeSlider.addEventListener("change", () => {
    saveToLocalStorage("size_percent", sizeSlider.value);
    renderGuides();
  });

  rowsSlider.addEventListener("input", () => {
    rowsValue.textContent = rowsSlider.value;
  });

  rowsSlider.addEventListener("change", () => {
    selectedRowCount = parseInt(rowsSlider.value);
    saveToLocalStorage("rows", selectedRowCount);
    renderGuides();
  });

  viewPlayBtn.addEventListener("click", () => startPlayAnimation());
}

function createGuideHtml(guide) {
  const f = guide.file
      .replace(/\.(pdf|epub|mobi|link|jpg|png|mp4|avi)$/i, "")
      .split("$$")[0],
    u = `${config.paths.dataFolderName}/${encodeURIComponent(guide.file)}`,
    c = `${config.paths.coversFolderName}/${encodeURIComponent(f)}.jpg`;
  let titleHtml = "",
    infoHtml = "",
    actionLinkHtml = "",
    coverLinkHtml = "";
  let titleText = guide.title;
  if (guide.format === "link" && /^\d{2}\s*/.test(titleText))
    titleText = titleText.replace(/^\d{2}\s*/, "");

  const mediaTypes = ["jpg", "png", "mp4", "avi"];

  if (guide.format === "link") {
    const targetUrl = decodeUrlFromFilename(guide.file);
    let clickAction;
    if (guide.file.startsWith("_")) {
      clickAction = `window.location.href = '${targetUrl.replace(
        /'/g,
        "\\'"
      )}'; return false;`;
    } else {
      clickAction = `checkFileAndOpen('${targetUrl.replace(/'/g, "\\'")}','${
        config.paths.urlFallback
      }', true); return false;`;
    }
    titleHtml = `<div class="guide-title">${titleText}</div>`;
    infoHtml = `<div class="guide-info">${
      guide.linkData.description || ""
    }</div>`;
    actionLinkHtml = `<a href="${targetUrl}" onclick="${clickAction}"><i class="fas fa-external-link-alt"></i> ${lang.guideBtnOpen}</a>`;
    coverLinkHtml = `<a href="${targetUrl}" onclick="${clickAction}" class="cover-link"></a>`;
  } else if (mediaTypes.includes(guide.format)) {
    const clickAction = `startSlideshowFrom('${guide.file.replace(
      /'/g,
      "\\'"
    )}'); return false;`;
    titleHtml = `<div class="guide-title">${titleText}</div>`;
    infoHtml = `<div class="guide-info"><span class="guide-info-details"><i class="fas fa-calendar-alt"></i> ${
      guide.date
    } ${guide.time}<br><i class="fas fa-file-alt"></i> ${
      lang.guideInfoFormat
    }: ${guide.format.toUpperCase()}<br><i class="fas fa-database"></i> ${
      lang.guideInfoSize
    }: ${guide.sizeMB} MB</span><span class="guide-info-description">${
      guide.linkData.description || ""
    }</span></div>`;
    actionLinkHtml = `<a href="#" onclick="${clickAction}"><i class="fas fa-eye"></i> ${lang.guideBtnView}</a>`;
    coverLinkHtml = `<a href="#" onclick="${clickAction}" class="cover-link"></a>`;
  } else {
    const clickAction = `checkFileAndOpen('${u.replace(/'/g, "\\'")}', '${
      config.paths.urlFallback
    }'); return false;`;
    titleHtml = `<div class="guide-title">${titleText}</div>`;
    infoHtml = `<div class="guide-info"><span class="guide-info-details"><i class="fas fa-calendar-alt"></i> ${
      guide.date
    } ${guide.time}<br><i class="fas fa-file-alt"></i> ${
      lang.guideInfoFormat
    }: ${guide.format.toUpperCase()}<br><i class="fas fa-database"></i> ${
      lang.guideInfoSize
    }: ${guide.sizeMB} MB</span><span class="guide-info-description">${
      guide.linkData.description || ""
    }</span></div>`;
    actionLinkHtml = `<a href="${u}" onclick="${
      guide.format === "pdf" ? clickAction : ""
    }" ${guide.format !== "pdf" ? "download" : ""}><i class="fas fa-${
      guide.format === "pdf" ? "file-pdf" : "download"
    }"></i> ${
      guide.format === "pdf" ? lang.guideBtnOpen : lang.guideBtnDownload
    }</a>`;
    coverLinkHtml = `<a href="${u}" onclick="${clickAction}" class="cover-link"></a>`;
  }

  const noCoverImg = document.documentElement.classList.contains("dark-mode")
    ? "ade-base-system/gfx/no_cover_dark.png"
    : "ade-base-system/gfx/no_cover_light.png";

  if (
    currentViewMode === "text-only" ||
    currentViewMode === "full-text" ||
    currentViewMode === "text-masonry"
  ) {
    return `${titleHtml}<div class="guide-content-bottom"><div class="guide-info-container">${infoHtml}</div>${actionLinkHtml}</div>`;
  } else if (currentViewMode === "image-only") {
    const onclickAction =
      (coverLinkHtml.match(/onclick="([^"]*)"/) || [])[1] || "";
    const hrefAction = (coverLinkHtml.match(/href="([^"]*)"/) || [])[1] || "#";
    const imageHtml = `<img src="${c}" alt="${titleText}" class="guide-cover-elegant" onerror="this.onerror=null;this.src='${noCoverImg}';this.classList.add('placeholder-cover');">`;

    return `
        <div class="guide-cover-wrapper">
            <a href="${hrefAction}" onclick="${onclickAction}" class="cover-link">${imageHtml}</a>
        </div>
        <div class="guide-text-content">
            <div class="guide-title"><a href="${hrefAction}" onclick="${onclickAction}">${titleText}</a></div>
            <div class="guide-action-link">${actionLinkHtml}</div>
        </div>
    `;
  } else if (currentViewMode === "image-masonry") {
    // Pozostawiamy logikę dla masonry bez zmian
    const elegantCoverImgHtml = `<img src="${c}" alt="${titleText}" class="guide-cover-elegant" onerror="this.onerror=null;this.src='${noCoverImg}';this.classList.add('placeholder-cover');">`;
    return coverLinkHtml.replace("</a>", `${elegantCoverImgHtml}</a>`);
  }
  // ZNAJDŹ I ZASTĄP TEN BLOK W FUNKCJI createGuideHtml
  else if (currentViewMode === "image-masonry") {
    const elegantCoverImgHtml = `<img src="${c}" alt="${titleText}" class="guide-cover-elegant" onerror="this.onerror=null;this.src='${noCoverImg}';this.classList.add('placeholder-cover');">`;
    const onclickAction =
      (coverLinkHtml.match(/onclick="([^"]*)"/) || [])[1] || "";
    const hrefAction = (coverLinkHtml.match(/href="([^"]*)"/) || [])[1] || "#";
    // DODAJEMY NOWY div.glass-panel-six Z TYTUŁEM WEWNĄTRZ
    return `
        <a href="${hrefAction}" onclick="${onclickAction}" class="cover-link-six">
            ${elegantCoverImgHtml}
        </a>
        <div class="glass-panel-six">
            <span class="title-six">${titleText}</span>
        </div>
    `;
  } else if (currentViewMode === "grid") {
    const onclickAction =
      (coverLinkHtml.match(/onclick="([^"]*)"/) || [])[1] || "";
    const hrefAction = (coverLinkHtml.match(/href="([^"]*)"/) || [])[1] || "#";

    // Nowa struktura HTML dla widoku siatki
    return `
      <div class="grid-title-bar">${titleText}</div>
      <a href="${hrefAction}" onclick="${onclickAction}" class="grid-image-link">
        <img src="${c}" alt="${titleText}" class="guide-cover-grid" onerror="this.onerror=null;this.src='${noCoverImg}';this.classList.add('placeholder-cover');">
      </a>
      <div class="grid-action-bar">
        <a href="${hrefAction}" onclick="${onclickAction}" class="grid-action-button">
          <i class="fas fa-external-link-alt"></i>
          <span>${lang.guideBtnOpen}</span>
        </a>
      </div>
    `;
  } else if (currentViewMode === "view-seven") {
    const gridCoverImgHtml = `<img src="${c}" alt="${titleText}" class="guide-cover-grid" onerror="this.onerror=null;this.src='${noCoverImg}';this.classList.add('placeholder-cover');">`;
    const onclickAction =
      (coverLinkHtml.match(/onclick="([^"]*)"/) || [])[1] || "";
    const hrefAction = (coverLinkHtml.match(/href="([^"]*)"/) || [])[1] || "#";
    return `
        <a href="${hrefAction}" onclick="${onclickAction}" class="guide-cover-wrapper-seven">
            ${gridCoverImgHtml}
        </a>
        <div class="guide-text-content-seven">
            <div class="guide-title">${titleText}</div>
            <div class="guide-action-link">${actionLinkHtml}</div>
        </div>
    `;
  } else {
    // Domyślnie 'full' (Widok #8) i 'masonry' (Widok #9)
    const defaultCoverImgHtml = `<img src="${c}" alt="${titleText}" class="guide-cover" onerror="this.onerror=null;this.src='${noCoverImg}';this.classList.add('placeholder-cover');this.style.opacity=1;this.style.transform='scale(1)';">`;
    return `${titleHtml}<div class="guide-content-bottom"><div class="guide-info-container">${infoHtml}</div><a href="#" class="cover-link" onclick="${
      (coverLinkHtml.match(/onclick="([^"]*)"/) || [])[1] || ""
    }">${defaultCoverImgHtml}</a>${actionLinkHtml}</div>`;
  }
}

function renderGuides(sourceArray = null) {
  stopCarousel();
  const source =
    sourceArray ||
    (generatorMode === "visible" && generatedGuides) ||
    filteredGuides;

  guideList.classList.remove("random-draw");
  if (sourceArray) {
    guideList.classList.add("random-draw");
  }

  // === POCZĄTEK ZMIANY: Kompletna obsługa klas CSS ===
  guideList.classList.toggle("view-text-only", currentViewMode === "text-only");
  guideList.classList.toggle("view-full-text", currentViewMode === "full-text");
  guideList.classList.toggle(
    "view-text-masonry",
    currentViewMode === "text-masonry"
  );
  guideList.classList.toggle("view-grid", currentViewMode === "grid");
  guideList.classList.toggle(
    "view-image-only",
    currentViewMode === "image-only"
  );
  guideList.classList.toggle(
    "view-image-masonry",
    currentViewMode === "image-masonry"
  );
  guideList.classList.toggle("view-seven", currentViewMode === "view-seven");
  guideList.classList.toggle("view-full", currentViewMode === "full");
  guideList.classList.toggle("view-masonry", currentViewMode === "masonry");
  // === KONIEC ZMIANY ===

  guideList.innerHTML = "";
  if (lazyLoadObserver) lazyLoadObserver.disconnect();

  const sizePercent = document.getElementById("sizeSlider").value;
  const newWidth = Math.floor(
    config.pageSettings.baseBoxWidth * (sizePercent / 100)
  );

  const minSlider = 50,
    maxSlider = 150;
  const minFont = 0.8,
    maxFont = 1.3;
  const percent = (sizePercent - minSlider) / (maxSlider - minSlider);
  const dynamicFontSize = minFont + percent * (maxFont - minFont);
  guideList.style.setProperty(
    "--dynamic-font-size",
    `${dynamicFontSize.toFixed(2)}rem`
  );
  guideList.style.setProperty("--grid-rows", selectedRowCount);
  guideList.style.setProperty("--box-width", `${newWidth}px`);

  if (sourceArray) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "guide-page";
    pageDiv.dataset.pageNumber = 1;

    source.forEach((guide, index) => {
      const div = document.createElement("div");
      div.className = "guide animate-in";
      div.style.animationDelay = `${index * 0.04}s`;
      div.innerHTML = createGuideHtml(guide);
      pageDiv.appendChild(div);
    });
    guideList.appendChild(pageDiv);

    pagination.classList.remove("visible");
    updateGuideCount(source.length, guides.length);

    if (
      currentViewMode === "masonry" ||
      currentViewMode === "text-masonry" ||
      currentViewMode === "image-masonry"
    ) {
      setTimeout(() => applyMasonryLayout(1), 100);
    }
    return;
  }

  const itemWidth = newWidth;
  const columns =
    Math.floor(guideList.clientWidth / (itemWidth + 20) + 0.0001) || 1;
  const itemsPerPage = columns * selectedRowCount;

  pagesCache = [];
  if (itemsPerPage > 0) {
    for (let i = 0; i < source.length; i += itemsPerPage) {
      pagesCache.push(source.slice(i, i + itemsPerPage));
    }
  } else if (source.length > 0) {
    pagesCache.push(source);
  }
  totalPages = pagesCache.length || 1;

  pagesCache.forEach((pageItems, pageIndex) => {
    const pageDiv = document.createElement("div");
    pageDiv.className = "guide-page";
    pageDiv.dataset.pageNumber = pageIndex + 1;

    if (pageIndex === 0) {
      pageItems.forEach((guide, index) => {
        const div = document.createElement("div");
        div.className = "guide";
        if (isInitialLoad) {
          div.classList.add("animate-in");
          div.style.animationDelay = `${index * 0.04}s`;
        }
        div.innerHTML = createGuideHtml(guide);
        pageDiv.appendChild(div);
      });
    }
    guideList.appendChild(pageDiv);
  });

  setupLazyLoading(pagesCache);
  renderPagination();
  updateGuideCount(source.length, guides.length);

  if (isInitialLoad) {
    isInitialLoad = false;
    preloadNextPageImages();
  }

  const isMasonry =
    currentViewMode === "masonry" ||
    currentViewMode === "text-masonry" ||
    currentViewMode === "image-masonry";

  if (isMasonry) {
    setTimeout(() => applyMasonryLayout(1), 100);
  }

  if (!isMasonry) {
    updateWrapperHeightForPage(1);
  }
  document.getElementById("pageTitle").textContent =
    config.pageSettings.pageTitle || lang.pageTitle;
}

function toggleAudioMute() {
  if (!bgVideo) return;

  isAudioMuted = !isAudioMuted;
  bgVideo.muted = isAudioMuted;

  if (!isAudioMuted) {
    bgVideo.play().catch((error) => {
      console.error("Błąd przy próbie odtworzenia wideo z dźwiękiem:", error);
    });
  }

  const muteButton = document.getElementById("statusMuteBtn");
  if (muteButton) {
    const muteIcon = muteButton.querySelector("i");
    if (muteIcon) {
      muteIcon.className = isAudioMuted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";
    }
    muteButton.classList.toggle("active-red", !isAudioMuted);
  }
}

function handleVideoStateChange() {
  switch (videoBgState) {
    case "off":
      videoBgState = "playing";
      updateBackgroundVideoVisibility(true);
      if (bgVideo.paused) bgVideo.play();
      break;
    case "playing":
      videoBgState = "paused";
      bgVideo.pause();
      pausedTime = bgVideo.currentTime;
      saveToLocalStorage("video_paused_time", pausedTime);
      break;
    case "paused":
      videoBgState = "off";
      bgVideo.pause();
      updateBackgroundVideoVisibility();
      break;
  }
  saveToLocalStorage("video_bg_state", videoBgState);
  updateVideoBtnUI();
}

function updateVideoBtnUI() {
  const playBtn = document.getElementById("videoBtn-play");
  const lightboxPlayBtn = document.getElementById("lightbox-video-toggle");

  // Logika dla przycisku Play/Pause/Stop
  const isVideoActive = videoBgState === "playing" || videoBgState === "paused";
  if (playBtn) {
    playBtn.classList.toggle("active-red", isVideoActive);
    switch (videoBgState) {
      case "playing":
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.title = lang.videoBtnPause;
        break;
      case "paused":
        playBtn.innerHTML = '<i class="fas fa-stop"></i>';
        playBtn.title = lang.videoBtnOff;
        break;
      case "off":
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.title = lang.videoBtnPlay;
        break;
    }
  }
  if (lightboxPlayBtn) {
    lightboxPlayBtn.classList.toggle("active-play", isVideoActive); // Lightbox używa innej klasy, zostawiamy dla spójności
  }

  // Logika dla przycisku Shuffle
  const shuffleBtn = document.getElementById("videoBtn-shuffle");
  const isShuffleActive = autoShuffleInterval !== null;
  if (shuffleBtn) {
    shuffleBtn.classList.toggle("active-red", isShuffleActive);
  }
  const lightboxShuffleBtn = document.getElementById(
    "lightbox-video-autoshuffle"
  );
  if (lightboxShuffleBtn) {
    lightboxShuffleBtn.classList.toggle("active-play", isShuffleActive);
  }
}

function shuffleBackgroundVideo() {
  const { pageKey, bgVideoStartNum, bgVideoEndNum, defaultBgVideo } =
    config.pageSettings;
  const storageKey = `visudir_bg_video_${pageKey}`;
  const range = bgVideoEndNum - bgVideoStartNum;
  if (range < 1) return;
  const currentVideoNum =
    parseInt(localStorage.getItem(storageKey)) || defaultBgVideo;
  let newVideoNum;
  do {
    newVideoNum = Math.floor(Math.random() * (range + 1)) + bgVideoStartNum;
  } while (newVideoNum === currentVideoNum);
  localStorage.setItem(storageKey, newVideoNum);
  initializeBackgroundVideo(currentTheme);
}

function changeBackgroundVideo(direction) {
  if (videoBgState === "off") return;

  if (autoShuffleInterval) {
    shuffleBackgroundVideo();
    return;
  }

  const { pageKey, bgVideoStartNum, bgVideoEndNum } = config.pageSettings;
  if (bgVideoEndNum - bgVideoStartNum < 1) return;

  const storageKey = `visudir_bg_video_${pageKey}`;
  let currentVideoNum =
    parseInt(localStorage.getItem(storageKey)) || bgVideoStartNum;
  currentVideoNum += direction;

  if (currentVideoNum > bgVideoEndNum) currentVideoNum = bgVideoStartNum;
  if (currentVideoNum < bgVideoStartNum) currentVideoNum = bgVideoEndNum;

  localStorage.setItem(storageKey, currentVideoNum);

  const wasPaused = videoBgState === "paused";
  initializeBackgroundVideo(currentTheme);

  if (wasPaused) {
    bgVideo.addEventListener(
      "canplay",
      function onCanPlay() {
        bgVideo.currentTime = pausedTime;
        bgVideo.pause();
      },
      {
        once: true,
      }
    );
  }
  updateVideoBtnUI();
}

function toggleAutoShuffle(forceStart = false) {
  if (!forceStart && videoBgState !== "playing") return;
  if (autoShuffleInterval) {
    clearInterval(autoShuffleInterval);
    autoShuffleInterval = null;
    saveToLocalStorage("video_shuffle_enabled", false);
  } else {
    if (bgVideo.paused && videoBgState === "playing") {
      bgVideo.play();
    }
    shuffleBackgroundVideo();
    autoShuffleInterval = setInterval(shuffleBackgroundVideo, 20000);
    saveToLocalStorage("video_shuffle_enabled", true);
  }
  updateVideoBtnUI();
}

function resetVideoSettings() {
  const { pageKey, defaultBgVideo } = config.pageSettings;
  localStorage.setItem(`visudir_bg_video_${pageKey}`, defaultBgVideo);

  if (autoShuffleInterval) {
    clearInterval(autoShuffleInterval);
    autoShuffleInterval = null;
    saveToLocalStorage("video_shuffle_enabled", false);
  }

  if (videoBgState === "paused") {
    videoBgState = "playing";
    saveToLocalStorage("video_bg_state", videoBgState);
  }

  if (videoBgState !== "off") {
    updateBackgroundVideoVisibility(true);
  }

  updateVideoBtnUI();
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle("dark-mode");
  document.body.classList.toggle("dark-mode", isDark); // Dodajemy/usuwamy klasę także na body

  localStorage.setItem("visudir_theme", isDark ? "dark" : "light");
  currentTheme = isDark ? "dark" : "light";

  // Poniższa logika pozostaje bez zmian
  if (config.pageSettings.showMiniLogo && config.logoRotator.enabled) {
    const activeLogoImg = document.querySelector(".header-logo.active");
    if (activeLogoImg) {
      const currentLogoData = config.logoRotator.logos[currentLogoIndex];
      if (currentLogoData) {
        activeLogoImg.src =
          currentTheme === "dark"
            ? currentLogoData.srcDark
            : currentLogoData.srcLight;
      }
    }
  }
  document.querySelectorAll(".placeholder-cover").forEach((img) => {
    img.src =
      currentTheme === "dark"
        ? "ade-base-system/gfx/no_cover_dark.png"
        : "ade-base-system/gfx/no_cover_light.png";
  });
  if (videoBgState !== "off") {
    const wasPaused = videoBgState === "paused";
    if (wasPaused) {
      pausedTime = bgVideo.currentTime;
    }
    initializeBackgroundVideo(currentTheme);
    if (wasPaused) {
      bgVideo.addEventListener(
        "canplay",
        () => {
          bgVideo.currentTime = pausedTime;
          bgVideo.pause();
        },
        { once: true }
      );
    }
  }
}

function startSlideshowFrom(guideFilename) {
  const source =
    (generatorMode === "visible" && generatedGuides) || filteredGuides;
  const startIndex = source.findIndex((g) => g.file === guideFilename);

  if (startIndex === -1) {
    console.error("Nie znaleziono elementu w przefiltrowanej liście.");
    return;
  }
  startPlayAnimation(startIndex, true);
}

playCloseBtn.addEventListener("click", stopPlayAnimation);

function toggleSlideshowPlayPause() {
  slideshowIsPlaying = !slideshowIsPlaying;
  saveToLocalStorage("slideshow_playing", slideshowIsPlaying);
  if (slideshowIsPlaying) {
    if (playGuidesQueue.length < 2) return;
    slideshowPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    slideshowPlayBtn.classList.add("active-play");
    scheduleNext();
  } else {
    clearTimeout(playAnimationTimeout);
    slideshowPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    slideshowPlayBtn.classList.remove("active-play");
  }
}

function toggleSlideshowShuffle() {
  slideshowIsRandom = !slideshowIsRandom;
  document
    .getElementById("slideshow-shuffle")
    .classList.toggle("active-play", slideshowIsRandom);
}

function startPlayAnimation(startIndex = 0, forcePause = false) {
  const source =
    slideshowSourceGuides.length > 0 ? slideshowSourceGuides : guides;
  if (source.length === 0) return;

  playGuidesQueue = [...source];
  playCurrentIndex = startIndex;

  document.body.classList.add("play-mode-active");
  document.body.classList.toggle(
    "slideshow-no-animation",
    !slideshowAnimationsEnabled
  );

  setTimeout(() => {
    backdrop.classList.add("visible");
  }, 10);

  // updateBackgroundVideoVisibility();

  const lastPlayState = JSON.parse(getFromLocalStorage("slideshow_playing"));
  slideshowIsPlaying = forcePause
    ? false
    : lastPlayState !== null
    ? lastPlayState
    : true;

  if (slideshowIsPlaying) {
    slideshowPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    slideshowPlayBtn.classList.add("active-play");
  } else {
    slideshowPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    slideshowPlayBtn.classList.remove("active-play");
  }

  lightboxLabelsBtn.classList.toggle("active-play", areLabelsVisible);
  lightboxFxBtn.classList.toggle("active", slideshowAnimationsEnabled);

  displayRandomGuide(playGuidesQueue[playCurrentIndex]);
}

function stopPlayAnimation() {
  if (playAnimationTimeout) clearTimeout(playAnimationTimeout);
  playAnimationTimeout = null;

  const wasFromScreensaver = screenSaverState !== "inactive";
  const container = playGuideContainer;
  const media = container.querySelector("img, video");

  if (media && slideshowAnimationsEnabled) {
    media.style.animation = "zoomOutImage 0.4s ease-in forwards";
  }

  setTimeout(
    () => {
      document.body.classList.remove("play-mode-active");
      backdrop.classList.remove("visible");
      container.innerHTML = "";

      // Ukrywamy widget, który mógł być widoczny
      const statusWidget = document.getElementById("slideshow-status-widget");
      if (statusWidget) {
        statusWidget.classList.remove("visible");
      }

      if (wasFromScreensaver) {
        restoreUiFromScreenSaver();
      }
    },
    slideshowAnimationsEnabled ? 400 : 0
  );

  document.getElementById("slideshow-play").innerHTML =
    '<i class="fas fa-play"></i>';
  document.getElementById("slideshow-play").classList.remove("active-play");
  updateBackgroundVideoVisibility();
}

function scheduleNext(isNav = false) {
  if (playAnimationTimeout) clearTimeout(playAnimationTimeout);
  if (!isNav && !slideshowIsPlaying) return;
  let guide;
  if (playGuidesQueue.length < 2) {
    guide = playGuidesQueue[0];
  } else {
    if (slideshowIsRandom) {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * playGuidesQueue.length);
      } while (playGuidesQueue.length > 1 && newIndex === playCurrentIndex);
      playCurrentIndex = newIndex;
    } else if (!isNav) {
      playCurrentIndex = (playCurrentIndex + 1) % playGuidesQueue.length;
    }
    guide = playGuidesQueue[playCurrentIndex];
  }
  if (!guide) return;
  lastPlayedGuide = guide;
  displayRandomGuide(guide);
}

function preloadNextGuide(count = 3) {
  if (!slideshowIsPlaying || playGuidesQueue.length < 2) return;
  for (let i = 1; i <= count; i++) {
    let nextIndex;
    if (slideshowIsRandom) {
      nextIndex = Math.floor(Math.random() * playGuidesQueue.length);
    } else {
      nextIndex = (playCurrentIndex + i) % playGuidesQueue.length;
    }
    if (nextIndex === playCurrentIndex) continue;
    const nextGuide = playGuidesQueue[nextIndex];
    if (!nextGuide || ["mp4", "avi"].includes(nextGuide.format)) continue;
    const baseFilename = nextGuide.file
      .split("$$")[0]
      .replace(/\.(pdf|epub|mobi|link|jpg|png|mp4|avi)$/i, "");
    const hdPath = config.paths.previewHdFolderName
      ? `${config.paths.previewHdFolderName}/${encodeURIComponent(
          baseFilename
        )}.jpg`
      : null;
    if (hdPath) {
      new Image().src = hdPath;
    }
  }
}

function displayRandomGuide(guide) {
  playCaption.classList.remove("visible");
  const container = playGuideContainer;
  const existingContent = container.firstChild;
  const showNewGuide = () => {
    container.innerHTML = "";
    playCaption.classList.remove("visible");
    const fallbackCover = document.documentElement.classList.contains(
      "dark-mode"
    )
      ? "ade-base-system/gfx/no_cover_dark.png"
      : "ade-base-system/gfx/no_cover_light.png";
    const baseFilename = guide.file
      .split("$$")[0]
      .replace(/\.(pdf|epub|mobi|link|jpg|png|mp4|avi)$/i, "");
    const hdPath = config.paths.previewHdFolderName
      ? `${config.paths.previewHdFolderName}/${encodeURIComponent(
          baseFilename
        )}.jpg`
      : null;
    const sdPath = `${config.paths.coversFolderName}/${encodeURIComponent(
      baseFilename
    )}.jpg`;
    const directMediaPath = `${
      config.paths.dataFolderName
    }/${encodeURIComponent(guide.file)}`;
    const isVideo = ["mp4", "avi"].includes(guide.format);
    const displayElement = document.createElement(isVideo ? "video" : "img");
    if (isVideo) {
      displayElement.src = directMediaPath;
      displayElement.controls = true;
      displayElement.autoplay = true;
      displayElement.onerror = () => {
        displayElement.poster = sdPath;
        displayElement.onerror = () => {
          displayElement.poster = fallbackCover;
          displayElement.onerror = null;
        };
      };
    } else {
      displayElement.src = hdPath || sdPath;
      displayElement.onerror = () => {
        displayElement.src = sdPath;
        displayElement.onerror = () => {
          displayElement.src = fallbackCover;
          displayElement.onerror = null;
        };
      };
    }
    const link = document.createElement("a");
    if (guide.format === "link") {
      const targetUrl = decodeUrlFromFilename(guide.file);
      link.href = targetUrl;
      if (!targetUrl.startsWith(".") && !targetUrl.startsWith("/")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } else {
      const fileUrl = `${config.paths.dataFolderName}/${encodeURIComponent(
        guide.file
      )}`;
      link.href = fileUrl;
      if (guide.format === "pdf" || isVideo) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.download = guide.file;
      }
    }
    link.appendChild(displayElement);
    container.appendChild(link);
    const currentIndexInQueue = playGuidesQueue.indexOf(guide);
    const counterText =
      playGuidesQueue.length > 1
        ? `<b>${currentIndexInQueue + 1}</b><span class="caption-total"> / ${
            playGuidesQueue.length
          }</span>`
        : "";
    const descriptionText = guide.linkData.description || "";
    let titleText = guide.title.replace(/^\d{2}\s*/, "");
    playCaption.innerHTML = `<div class="caption-title-highlight">${counterText} ${titleText}</div><div class="caption-description">${descriptionText}</div>`;

    if (areLabelsVisible) {
      const delay = slideshowAnimationsEnabled ? 1000 : 0;
      setTimeout(() => playCaption.classList.add("visible"), delay);
    }
    if (slideshowIsPlaying && !isVideo) {
      preloadNextGuide();
      const slideDuration = 4000;
      const transitionTime = slideshowAnimationsEnabled ? 500 : 0;
      playAnimationTimeout = setTimeout(() => {
        if (areLabelsVisible) {
          playCaption.classList.remove("visible");
          setTimeout(scheduleNext, transitionTime);
        } else {
          scheduleNext();
        }
      }, slideDuration - transitionTime);
    }
  };
  if (existingContent && slideshowAnimationsEnabled) {
    if (playAnimationTimeout) clearTimeout(playAnimationTimeout);
    const mediaElement = existingContent.querySelector
      ? existingContent.querySelector("img, video")
      : existingContent;
    if (mediaElement) {
      mediaElement.style.animation = "zoomOutImage 0.4s ease-in forwards";
    }
    setTimeout(showNewGuide, 400);
  } else {
    showNewGuide();
  }
}

function toggleFullScreen() {
  const btn = document.getElementById("fullscreenBtn");

  // --- NOWA LOGIKA ---
  // Sprawdzamy, czy przycisk ma klasę animacji (czyli czy jest na nim globus)
  if (btn && btn.classList.contains("globe-animation-active")) {
    // Jeśli tak, znajdujemy właściwy przycisk języka i symulujemy jego kliknięcie
    const realLangBtn = document.getElementById("statusLangBtn");
    if (realLangBtn) {
      realLangBtn.querySelector("a").click();
    }
    return; // Zatrzymujemy dalsze wykonywanie funkcji, aby nie włączyć pełnego ekranu
  }
  // --- KONIEC NOWEJ LOGIKI ---

  // Poniższy kod wykona się tylko, jeśli na przycisku NIE MA globusa
  if (btn) btn.classList.remove("globe-animation-active");

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      alert(
        `Błąd przy próbie włączenia trybu pełnoekranowego: ${err.message} (${err.name})`
      );
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  setTimeout(updateFullscreenIcon, 50);
}

function updateFullscreenIcon() {
  const icon = fullscreenBtn.querySelector("i");
  const iconLightbox = fullscreenBtnLightbox.querySelector("i");
  const statusBtn = document.getElementById("statusFullscreenBtn");
  const iconStatus = statusBtn?.querySelector("i");

  const isFullscreen = !!document.fullscreenElement;

  if (statusBtn) {
    statusBtn.classList.toggle("active-red", isFullscreen);
  }

  if (isFullscreen) {
    if (icon) icon.className = "fas fa-compress";
    if (iconLightbox) iconLightbox.className = "fas fa-compress";
    if (iconStatus) iconStatus.className = "fas fa-compress";
    fullscreenBtn.title = lang.fullscreenExitBtn;
    fullscreenBtnLightbox.title = lang.fullscreenExitBtn;
  } else {
    if (icon) icon.className = "fas fa-expand";
    if (iconLightbox) iconLightbox.className = "fas fa-expand";
    if (iconStatus) iconStatus.className = "fas fa-expand";
    fullscreenBtn.title = lang.fullscreenBtn;
    fullscreenBtnLightbox.title = lang.fullscreenBtn;
  }
}

function setupLightboxListeners() {
  fullscreenBtn.addEventListener("click", toggleFullScreen);
  fullscreenBtnLightbox.addEventListener("click", toggleFullScreen);
  document.addEventListener("fullscreenchange", updateFullscreenIcon);

  lightboxFxBtn.addEventListener("click", () => {
    slideshowAnimationsEnabled = !slideshowAnimationsEnabled;
    saveToLocalStorage("slideshow_fx", slideshowAnimationsEnabled);
    lightboxFxBtn.classList.toggle("active", slideshowAnimationsEnabled);
    document.body.classList.toggle(
      "slideshow-no-animation",
      !slideshowAnimationsEnabled
    );
  });

  document
    .getElementById("lightbox-darkModeBtn")
    .addEventListener("click", () => {
      toggleDarkMode();
      document
        .getElementById("viewThemeBtn")
        .classList.toggle(
          "active",
          document.documentElement.classList.contains("dark-mode")
        );
    });

  lightboxLabelsBtn.addEventListener("click", () => {
    areLabelsVisible = !areLabelsVisible;
    saveToLocalStorage("labels_visible", areLabelsVisible);
    lightboxLabelsBtn.classList.toggle("active-play", areLabelsVisible);
    playCaption.classList.toggle("visible", areLabelsVisible);
  });

  document
    .getElementById("lightbox-videoBtn")
    .addEventListener("click", (e) => {
      const target = e.target.closest(
        ".multi-button-main, .multi-button-child"
      );
      if (!target) return;
      switch (target.id) {
        case "lightbox-videoBtn-main":
          target.parentElement.classList.toggle("expanded");
          break;
        case "lightbox-video-toggle":
          handleVideoStateChange();
          break;
        case "lightbox-video-autoshuffle":
          toggleAutoShuffle();
          break;
        case "lightbox-video-prev":
          changeBackgroundVideo(-1);
          break;
        case "lightbox-video-next":
          changeBackgroundVideo(1);
          break;
        case "lightbox-video-reset":
          resetVideoSettings();
          break;
      }
    });

  // Zastąpiono istniejące, osobne listenery dla panelu slideshow tą logiką
  const slideshowControls = document.getElementById("slideshow-controls");
  if (slideshowControls) {
    slideshowControls.addEventListener("click", (e) => {
      const target = e.target.closest(".multi-button-child");
      if (!target) return;

      switch (target.id) {
        case "slideshow-play":
          toggleSlideshowPlayPause();
          break;
        case "slideshow-shuffle":
          toggleSlideshowShuffle();
          break;
        case "slideshow-stop":
          stopPlayAnimation();
          break;
        case "slideshow-next":
          if (!slideshowIsRandom)
            playCurrentIndex = (playCurrentIndex + 1) % playGuidesQueue.length;
          scheduleNext(true);
          break;
        case "slideshow-prev":
          if (!slideshowIsRandom)
            playCurrentIndex =
              (playCurrentIndex - 1 + playGuidesQueue.length) %
              playGuidesQueue.length;
          scheduleNext(true);
          break;
        case "slideshow-first":
          playCurrentIndex = 0;
          scheduleNext(true);
          break;
        case "slideshow-last":
          playCurrentIndex = playGuidesQueue.length - 1;
          scheduleNext(true);
          break;
      }
    });
  }
}
setupLightboxListeners();

backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop && !backdrop.classList.contains("preview-active"))
    stopPlayAnimation();
});

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

let lastWindowWidth = window.innerWidth;
const debouncedRender = debounce(() => {
  if (window.innerWidth !== lastWindowWidth) {
    lastWindowWidth = window.innerWidth;
    renderGuides();
  }
}, 250);
window.addEventListener("resize", debouncedRender);

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    applyFilters();
    renderGuides();
  }
});

function stopCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
    const carouselBtn = document.getElementById("paginationCarouselBtn");
    if (carouselBtn) {
      carouselBtn.innerHTML = '<i class="fas fa-play"></i>';
      carouselBtn.title = lang.paginationCarouselStart;
    }
  }
}

function toggleCarouselShuffle() {
  isCarouselShuffleActive = !isCarouselShuffleActive;
  const shuffleBtn = document.getElementById("paginationShuffleBtn");
  if (shuffleBtn) {
    shuffleBtn.classList.toggle("active-red", isCarouselShuffleActive);
    shuffleBtn.title = isCarouselShuffleActive
      ? "Wyłącz losowe przewijanie"
      : "Włącz losowe przewijanie";
  }
}

function toggleCarousel() {
  const carouselBtn = document.getElementById("paginationCarouselBtn");
  if (carouselInterval) {
    stopCarousel();
  } else {
    if (totalPages <= 1) return;
    carouselBtn.innerHTML = '<i class="fas fa-pause"></i>';
    carouselBtn.title = lang.paginationCarouselStop;
    carouselInterval = setInterval(() => {
      let nextPage;
      // NOWA LOGIKA: Sprawdzenie, czy tryb losowy jest aktywny
      if (isCarouselShuffleActive) {
        do {
          nextPage = Math.floor(Math.random() * totalPages) + 1;
        } while (totalPages > 1 && nextPage === currentPage);
      } else {
        nextPage = (currentPage % totalPages) + 1;
      }
      goToPage(nextPage);
    }, 5000);
  }
}

searchInput.addEventListener("input", () => {
  applyFilters();
  renderGuides();
});

formatFilter.addEventListener("change", (e) => {
  const value = e.target.value;
  orientationFilterState = null;
  if (value.startsWith("search:")) {
    searchInput.value = value.substring(7);
  } else {
    saveToLocalStorage("format", value);
  }
  applyFilters();
  renderGuides();
});

function updateGeneratorModeBtn() {
  const btn = document.getElementById("generatorModeBtn");
  btn.classList.toggle("active", generatorMode === "visible");
  btn.title =
    generatorMode === "all" ? lang.generatorModeAll : lang.generatorModeVisible;
}

sortSelector.addEventListener("change", (e) => {
  const sortValue = e.target.value;
  if (sortValue) {
    if (sortValue === "shuffle") {
      let source =
        (generatorMode === "visible" && generatedGuides) || filteredGuides;
      shuffleArray(source);
      generatedGuides = source;
      renderGuides(source);
    } else {
      applySort(sortValue, guides);
      saveToLocalStorage("sort", sortValue);
      applyFilters();
      renderGuides();
    }
  }
});

generator.addEventListener("change", (e) => {
  generateGuides();
});

document.getElementById("generatorModeBtn").addEventListener("click", () => {
  generatorMode = generatorMode === "all" ? "visible" : "all";
  saveToLocalStorage("generator_mode", generatorMode);
  updateGeneratorModeBtn();
});
updateGeneratorModeBtn();

fileInput.addEventListener("change", function () {
  if (this.files[0]) {
    loadAndParseFile(this.files[0]);
    stopPlayAnimation();
  }
});

function initialize3dHoverEffect() {
  const guideList = document.getElementById("guideList");
  if (!guideList) return;

  let currentGuide = null;
  let animationFrameId = null;

  const onMouseMove = (e) => {
    if (!currentGuide) return;

    const rect = currentGuide.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(() => {
      if (!currentGuide) return;
      currentGuide.style.setProperty("--rotate-x", `${rotateX}deg`);
      currentGuide.style.setProperty("--rotate-y", `${rotateY}deg`);
      currentGuide.style.setProperty("--glow-x", `${glowX}%`);
      currentGuide.style.setProperty("--glow-y", `${glowY}%`);
    });
  };

  guideList.addEventListener(
    "mouseenter",
    (e) => {
      const guide = e.target.closest(".guide-list.view-image-only .guide");
      if (guide) {
        guide.style.transition = "none";
        currentGuide = guide;
      }
    },
    true
  );

  guideList.addEventListener(
    "mouseleave",
    (e) => {
      const guideTarget = e.target.closest(
        ".guide-list.view-image-only .guide"
      );
      if (currentGuide && (!guideTarget || guideTarget === currentGuide)) {
        cancelAnimationFrame(animationFrameId);
        currentGuide.style.transition = "transform 0.4s ease-out";
        requestAnimationFrame(() => {
          if (currentGuide) {
            currentGuide.style.setProperty("--rotate-x", "0deg");
            currentGuide.style.setProperty("--rotate-y", "0deg");
          }
        });
        currentGuide = null;
      }
    },
    true
  );

  guideList.addEventListener("mousemove", onMouseMove, true);
}

function applyMasonryLayout(pageNum = 1) {
  const guidePage = guideList.querySelector(
    `.guide-page[data-page-number="${pageNum}"]`
  );
  if (!guidePage) return;

  const items = Array.from(guidePage.children);
  if (items.length === 0) {
    if (currentPage === pageNum) updateWrapperHeightForPage(pageNum);
    return;
  }

  const performLayout = () => {
    const gap = 20;
    const itemWidth = items[0].offsetWidth;
    if (itemWidth === 0) return;

    const viewportWidth = guideList.clientWidth;
    const numColumns = Math.max(
      1,
      Math.floor((viewportWidth + gap) / (itemWidth + gap))
    );
    const gridWidth = numColumns * itemWidth + (numColumns - 1) * gap;
    const remainingSpace = viewportWidth - gridWidth;
    const sidePadding = remainingSpace > 0 ? remainingSpace / 2 : 0;

    // Ustawiamy sztywną szerokość kontenera siatki i centrujemy go marginesem
    // guidePage.style.width = `${gridWidth}px`;
    // guidePage.style.margin = "0 auto";

    // Resetujemy padding, aby uniknąć konfliktów
    guidePage.style.paddingLeft = "0px";
    guidePage.style.paddingRight = "0px";

    guidePage.style.position = "relative";
    const columnHeights = Array(numColumns).fill(0);

    items.forEach((item) => {
      const minHeight = Math.min(...columnHeights);
      const columnIndex = columnHeights.indexOf(minHeight);

      item.style.position = "absolute";
      item.style.top = `${minHeight}px`;
      // OSTATECZNA POPRAWKA: Prawidłowa kalkulacja pozycji 'left' bez podwójnego przesunięcia
      item.style.left = `${sidePadding + columnIndex * (itemWidth + gap)}px`;

      columnHeights[columnIndex] += item.offsetHeight + gap;
    });

    const maxHeight = Math.max(...columnHeights);
    guidePage.style.height = `${maxHeight}px`;
    updateWrapperHeightForPage(pageNum);
  };

  const images = Array.from(
    guidePage.querySelectorAll(
      ".guide-cover, .guide-cover-elegant, .guide-cover-grid"
    )
  );
  if (images.length === 0) {
    performLayout();
    return;
  }
  let imagesLoaded = 0;
  images.forEach((img) => {
    if (img.complete) {
      imagesLoaded++;
    } else {
      img.onload = img.onerror = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) performLayout();
      };
    }
  });
  if (imagesLoaded === images.length) performLayout();
}

function updateWrapperHeightForPage(pageNum) {
  const wrapper = document.querySelector(".guide-list-wrapper");
  const pageElement = guideList.querySelector(
    `.guide-page[data-page-number="${pageNum}"]`
  );
  if (!wrapper || !pageElement) return;

  console.log(
    `%c--- START: Diagnostyka updateWrapperHeight dla strony #${pageNum} ---`,
    "color: #e53935; font-weight: bold;"
  );

  requestAnimationFrame(() => {
    const items = pageElement.querySelectorAll(".guide");
    console.log(`1. Znaleziono ${items.length} kafelków (.guide) na stronie.`);

    if (items.length === 0) {
      wrapper.style.height = "0px";
      console.log("Wynik: Brak kafelków, ustawiam wysokość na 0px i kończę.");
      return;
    }
    const listTop = guideList.getBoundingClientRect().top;
    let maxBottom = 0;
    console.log(
      `2. Pozycja 'top' głównego kontenera (.guide-list): ${listTop.toFixed(
        2
      )}px`
    );

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      // Logujemy tylko kilka pierwszych, żeby nie zaspamować konsoli
      if (index < 5) {
        console.log(
          `- Kafelka #${index + 1}: top=${itemRect.top.toFixed(
            2
          )}, bottom=${itemRect.bottom.toFixed(2)}`
        );
      }
      if (itemRect.bottom > maxBottom) {
        maxBottom = itemRect.bottom;
      }
    });

    console.log(
      `3. Najniższy punkt (maxBottom) znaleziony na stronie: ${maxBottom.toFixed(
        2
      )}px`
    );

    const preciseHeight = maxBottom - listTop;
    console.log(
      `4. Obliczona wysokość (preciseHeight = maxBottom - listTop): ${preciseHeight.toFixed(
        2
      )}px`
    );

    if (preciseHeight > 0) {
      wrapper.style.height = `${preciseHeight}px`;
      console.log(
        `%cWynik: Ustawiam wysokość wrappera na: ${preciseHeight.toFixed(2)}px`,
        "color: green; font-weight: bold;"
      );
    } else {
      console.log(
        `%cWynik: Obliczona wysokość jest <= 0. Nie zmieniam wysokości wrappera.`,
        "color: orange;"
      );
    }
    console.log(
      `%c--- KONIEC: Diagnostyka updateWrapperHeight ---`,
      "color: #e53935; font-weight: bold;"
    );
  });
}

updateRealTimeClock();
setInterval(updateRealTimeClock, 30000);

// #patch #3
// =================================================================
//          LOGIKA KARUZELI JĘZYKOWEJ
// =================================================================
// ZASTĄP STARĄ WERSJĘ TĄ NOWĄ
// Plik: scripts.js

function initializeLangCarousel() {
  const modal = document.getElementById("lang-modal");
  const overlay = document.getElementById("lang-overlay");
  const closeBtn = document.getElementById("lang-modal-close-btn");
  const world = modal.querySelector(".world");
  const globeBtn = document.getElementById("statusLangBtn");

  const langDetails = config.langConfig;
  const availableLangCodes = Object.keys(langDetails);

  // --- MODYFIKACJA START ---
  // Dodajemy sortowanie według długości geograficznej (longitude) od zachodu na wschód.
  const languages = availableLangCodes
    .map((code) => {
      if (langDetails[code]) {
        return {
          code: code,
          name: langDetails[code].name,
          flag: langDetails[code].flag,
          lon: langDetails[code].lon, // Pobieramy 'lon' do obiektu
        };
      }
      return null;
    })
    .filter((lang) => lang)
    .sort((a, b) => a.lon - b.lon); // Sortujemy listę rosnąco według wartości 'lon'
  // --- MODYFIKACJA KONIEC ---

  let resizeTimer;
  let hasDragged = false;

  const rebuildCarousel = () => {
    world.innerHTML = "";
    const scale = window.innerWidth <= 600 ? 0.7 : 1.0;
    const base = {
      sceneSize: 320,
      perspective: 1000,
      itemWidth: 100,
      itemHeight: 50,
      fontSize: 14,
      flagSize: 22,
      gap: 10,
      radius: 290,
    };

    const root = document.documentElement;
    Object.keys(base).forEach((key) => {
      root.style.setProperty(
        `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        `${base[key] * scale}px`
      );
    });

    const totalItems = languages.length;
    const radius = base.radius * scale;

    languages.forEach((lang, index) => {
      const item = document.createElement("div");
      item.className = "item";

      const flagImg = document.createElement("img");
      flagImg.className = "flag-icon";
      flagImg.src = `https://hatscripts.github.io/circle-flags/flags/${lang.flag}.svg`;
      flagImg.alt = "";
      flagImg.draggable = false;

      const codeSpan = document.createElement("span");
      codeSpan.innerText = lang.code.toUpperCase();

      item.appendChild(flagImg);
      item.appendChild(codeSpan);

      const angle = (360 / totalItems) * index;
      item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

      item.addEventListener("click", () => {
        if (!hasDragged) {
          localStorage.setItem("visudir_lang", lang.code);
          location.reload();
        }
      });

      world.appendChild(item);
    });
  };

  let currentRotationY = 0,
    isDragging = false,
    startX = 0,
    lastX = 0,
    velocity = 0,
    animationFrame = null;
  const friction = 0.95,
    rotationSensitivity = 0.4;
  const updateRotation = () => {
    world.style.transform = `rotateY(${currentRotationY}deg)`;
  };
  const inertiaAnimate = () => {
    currentRotationY += velocity;
    velocity *= friction;
    updateRotation();
    if (Math.abs(velocity) > 0.1)
      animationFrame = requestAnimationFrame(inertiaAnimate);
    else velocity = 0;
  };
  const onDragStart = (e) => {
    e.preventDefault();
    isDragging = true;
    hasDragged = false;
    world.classList.add("is-dragging");
    if (animationFrame) cancelAnimationFrame(animationFrame);
    velocity = 0;
    startX = e.clientX || e.touches[0].clientX;
    lastX = startX;
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchmove", onDragMove);
    window.addEventListener("touchend", onDragEnd);
  };
  const onDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches[0].clientX;
    if (Math.abs(currentX - startX) > 5) {
      hasDragged = true;
    }
    const deltaX = currentX - lastX;
    velocity = deltaX * rotationSensitivity;
    currentRotationY += velocity;
    lastX = currentX;
    updateRotation();
  };
  const onDragEnd = () => {
    isDragging = false;
    world.classList.remove("is-dragging");
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
    window.removeEventListener("touchmove", onDragMove);
    window.removeEventListener("touchend", onDragEnd);
    if (Math.abs(velocity) > 0.1) inertiaAnimate();
  };

  world.addEventListener("mousedown", onDragStart);
  world.addEventListener("touchstart", onDragStart, { passive: true });

  const showModal = () => {
    rebuildCarousel();
    modal.style.display = "flex";
  };
  const hideModal = () => {
    modal.style.display = "none";
  };

  globeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showModal();
  });
  closeBtn.addEventListener("click", hideModal);
  overlay.addEventListener("click", hideModal);

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (modal.style.display === "flex") {
        rebuildCarousel();
      }
    }, 150);
  });

  const headerGlobeBtn = document.getElementById("headerLangBtn");
  if (headerGlobeBtn) {
    headerGlobeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal();
    });
  }
}

function calculateSunTimes(date, lat, lon) {
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

  // 1. Obliczenie dnia roku
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date -
    start +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);

  // 2. Obliczenie czasu słonecznego
  const B = (360 / 365.24) * (day - 81) * toRad;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const lstm = 15 * Math.floor(date.getTimezoneOffset() / -60);
  const tc = 4 * (lon - lstm) + eot;

  // 3. Obliczenie kąta godzinowego
  const latRad = lat * toRad;
  const declination =
    -23.44 * Math.cos((360 / 365.24) * (day + 10) * toRad) * toRad;
  const hourAngle = Math.acos(
    (Math.sin(-0.83 * toRad) - Math.sin(latRad) * Math.sin(declination)) /
      (Math.cos(latRad) * Math.cos(declination))
  );

  if (isNaN(hourAngle)) {
    return { sunrise: "n/a", sunset: "n/a", duration: "n/a" };
  }

  const h = (hourAngle * toDeg) / 15;

  // 4. Obliczenie wschodu i zachodu
  const sunriseMinutes = 720 - h * 60 - tc;
  const sunsetMinutes = 720 + h * 60 - tc;

  const formatTimeFromMinutes = (mins) => {
    if (mins < 0) mins += 1440;
    if (mins >= 1440) mins -= 1440;
    const hours = Math.floor(mins / 60)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor(mins % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const durationMinutes = Math.abs(sunsetMinutes - sunriseMinutes);
  const durationHours = Math.floor(durationMinutes / 60)
    .toString()
    .padStart(2, "0");
  const durationMins = Math.floor(durationMinutes % 60)
    .toString()
    .padStart(2, "0");

  return {
    sunrise: formatTimeFromMinutes(sunriseMinutes),
    sunset: formatTimeFromMinutes(sunsetMinutes),
    duration: `${durationHours}:${durationMins}`,
  };
}

// FUNKCJA `updateLocationBasedStatus` POZOSTAJE BEZ ZMIAN (DLA KONTEKSTU)

function updateLocationBasedStatus() {
  const langCode = config.language.current;
  const location = config.langConfig[langCode];

  // Aktualizacja Wschodu/Zachodu Słońca
  const sunTimesEl = document.getElementById("sunTimesDisplay");
  if (sunTimesEl && location && location.lat && location.lon) {
    const sunTimes = calculateSunTimes(new Date(), location.lat, location.lon);
    if (sunTimes.sunrise !== "n/a") {
      sunTimesEl.innerHTML = `🌞 <b>${sunTimes.sunrise} – ${sunTimes.sunset}</b> (${sunTimes.duration})`;
    } else {
      sunTimesEl.innerHTML = `🌞 N/A`;
    }
  }

  // Aktualizacja Fazy Księżyca
  const moonPhaseEl = document.getElementById("moonPhaseDisplay");
  if (moonPhaseEl) {
    const moonPhases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
    const moonPhaseNames = lang.moonPhaseNames || Array(8).fill(""); // Zabezpieczenie
    const phaseIndex = getMoonPhase(new Date());
    moonPhaseEl.innerHTML = `${moonPhases[phaseIndex]} ${moonPhaseNames[phaseIndex]}`;
  }
}

function updateStatusLangDisplay() {
  const langBtn = document.getElementById("statusLangBtn");
  if (!langBtn) return;

  const currentLangCode = config.language.current;
  const langData = config.langConfig[currentLangCode];

  if (langData) {
    const flagImg = langBtn.querySelector(".lang-flag-status");
    const codeSpan = langBtn.querySelector(".lang-code-status");

    flagImg.src = `https://hatscripts.github.io/circle-flags/flags/${langData.flag}.svg`;
    codeSpan.textContent = currentLangCode.toUpperCase();
  }
}

/**
 * Inicjalizuje lub dołącza do istniejącej globalnej sesji.
 * Sprawdza, czy istnieje aktywna sesja w localStorage. Jeśli tak, dołącza do niej.
 * Jeśli nie, tworzy nową globalną sesję.
 */
function initializeGlobalSession() {
  const now = new Date().getTime();
  const lastUpdate = parseInt(
    getFromLocalStorage(GLOBAL_SESSION_UPDATE_KEY) || "0",
    10
  );
  const sessionStart = parseInt(
    getFromLocalStorage(GLOBAL_SESSION_START_KEY) || "0",
    10
  );

  // Sprawdzamy, czy ostatnia aktualizacja była w "okresie karencji"
  if (now - lastUpdate < SESSION_GRACE_PERIOD_MS && sessionStart > 0) {
    // Kontynuujemy istniejącą sesję
    globalSessionStartTime = new Date(sessionStart);
    console.log(
      `✅ Dołączono do istniejącej sesji, która rozpoczęła się o: ${globalSessionStartTime.toLocaleTimeString()}`
    );
  } else {
    // Rozpoczynamy nową sesję
    globalSessionStartTime = new Date();
    saveToLocalStorage(
      GLOBAL_SESSION_START_KEY,
      globalSessionStartTime.getTime()
    );
    console.log(
      `🚀 Rozpoczęto nową globalną sesję o: ${globalSessionStartTime.toLocaleTimeString()}`
    );
  }

  // Niezależnie od wszystkiego, od razu ustawiamy "bicie serca", aby inne karty wiedziały, że jesteśmy aktywni
  saveToLocalStorage(GLOBAL_SESSION_UPDATE_KEY, now);
}

// Nasłuchiwanie na zmiany w localStorage w celu synchronizacji między kartami
window.addEventListener("storage", (event) => {
  // Jeśli inna karta zresetowała sesję, dostosowujemy się do niej
  if (event.key === GLOBAL_SESSION_START_KEY) {
    const newStartTime = parseInt(event.newValue, 10);
    if (
      newStartTime &&
      (!globalSessionStartTime ||
        globalSessionStartTime.getTime() !== newStartTime)
    ) {
      console.log(
        "🔄 Sesja została zresetowana w innej karcie. Synchronizuję czas."
      );
      globalSessionStartTime = new Date(newStartTime);
    }
  }
});

/**
 * Główna funkcja sprawdzająca stan bezczynności, wywoływana co sekundę.
 */
function checkScreenSaverState() {
  // NOWY, ROZSZERZONY BLOK SPRAWDZAJĄCY AKTYWNOŚĆ UŻYTKOWNIKA
  // Sprawdzamy, czy pokaz slajdów jest aktywny i odtwarzany (a nie zapauzowany)
  const isSlideshowPlaying =
    document.body.classList.contains("play-mode-active") && slideshowIsPlaying;

  // Sprawdzamy, czy karuzela paginacji jest włączona
  const isCarouselActive = carouselInterval !== null;

  if (isSlideshowPlaying || isCarouselActive) {
    return;
  }

  const idleTimeSeconds = (new Date() - lastActivityTime) / 1000;
  const timeoutStage1 = config.pageSettings.screenSaverTimeout / 2;
  const timeoutStage2 = config.pageSettings.screenSaverTimeout;

  if (idleTimeSeconds >= timeoutStage2 && screenSaverState !== "stage2") {
    enterScreenSaverStage2();
  } else if (
    idleTimeSeconds >= timeoutStage1 &&
    screenSaverState === "inactive"
  ) {
    enterScreenSaverStage1();
  }
}

/**
 * Uruchamia pierwszą fazę wygaszacza - ukrywa statyczne elementy UI.
 */
function enterScreenSaverStage1() {
  console.log("Screensaver: Faza 1 - ukrywanie UI.");
  screenSaverState = "stage1";

  const isSlideshowActive =
    document.body.classList.contains("play-mode-active");
  let elementsToHide;

  if (isSlideshowActive) {
    const controlsToHideSelector = [
      "#play-caption",
      "#playCloseBtn", // <-- DODANY BRAKUJĄCY PRZYCISK
      "#fullscreenBtnLightbox", // <-- DODANY BRAKUJĄCY PRZYCISK
      "#lightbox-minimizeBtn",
    ];

    if (!isLightboxMinimized) {
      controlsToHideSelector.push("#lightbox-controls");
    }
    elementsToHide = document.querySelectorAll(
      controlsToHideSelector.join(", ")
    );
  } else {
    elementsToHide = document.querySelectorAll(
      ".control-panel, .glass-status, .footer, #fullscreenBtn, #logoLink"
    );
  }

  elementsToHide.forEach((el) => el.classList.add("screensaver-fade-out"));

  const statusWidget = document.getElementById("slideshow-status-widget");
  if (isSlideshowActive && statusWidget) {
    statusWidget.classList.add("visible");
  }
}

/**
 * Uruchamia drugą fazę wygaszacza - aktywuje pokaz slajdów.
 */
function enterScreenSaverStage2() {
  console.log("Screensaver: Faza 2 - uruchamianie pokazu slajdów.");
  screenSaverState = "stage2";

  // Jeśli już jesteśmy w trybie pokazu, nie robimy nic.
  if (!document.body.classList.contains("play-mode-active")) {
    startPlayAnimation();
  }
}

/**
 * Przywraca widoczność interfejsu po wykryciu aktywności użytkownika.
 */
function restoreUiFromScreenSaver() {
  console.log("Screensaver: Wykryto aktywność, przywracanie UI.");
  screenSaverState = "inactive";

  const hiddenElements = document.querySelectorAll(".screensaver-fade-out");
  hiddenElements.forEach((el) => el.classList.remove("screensaver-fade-out"));
  const statusWidget = document.getElementById("slideshow-status-widget");
  if (statusWidget) {
    statusWidget.classList.remove("visible");
  }
}

// Wywołaj inicjalizację karuzeli po załadowaniu strony
initializeLangCarousel();

// NOWY BLOK: Wywołaj resztę inicjalizacji UI, aby ożywić panel
initializeNewButtons();
initializeDisplayPanel();
initializeMobileHover();
initialize3dHoverEffect();
initializeCurtainControls();
updateStatusLangDisplay();
