const config = {
  version: " v2.2.0", // Added screensaver and auto stopwatch modes
  build: "2025-09-17", // Build date YYYY-MM-DD
  updated: "2025-10-04", // Last update date YYYY-MM-DD

  language: {
    current: "pl", // Domyślny język na wypadek awarii skryptu
  },

  /// COPY HERE <cfg> // configuration / konfiguracja
  pageSettings: {
    pageKey: "indexMaxi",
    screenSaverTimeout: 10,

    defaultBgVideo: 1,
    bgVideoStartNum: 1,
    bgVideoEndNum: 35,
    defaultVideoBg: true,
    defaultLabelsVisible: true,
    slideshowAnimations: true,

    pageKey: "indexMaxi",
    pageTitle: "ade ▪ maxi MENU",
    showMiniLogo: true,
    showVisuDirButton: false,
    showBackButton: false,
    showLanguageButton: false,

    defaultSort: "nameAsc",
    defaultRows: 2,
    defaultSizePercent: 100,
    baseBoxWidth: 256,
    estimatedItemHeight: 380,
    defaultViewMode: "full",
    hoverOverlayColor: "rgba(204, 0, 0, 0.7)",
    hoverTextColor: "#ffffff",

    defaultGeneratorMode: "visible",
    defaultGeneratorCount: 5,
    generatorOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 25, 50, 100],

    defaultVideoExpanded: false,
    predefinedFilters: [
      {
        label: "ADE",
        search: "ade",
      },
      {
        label: "E-booki",
        search: "e-book",
      },
      {
        label: "Galerie",
        search: "galeri",
      },
      {
        label: "Hiszpania",
        search: "Hiszpania",
      },
      {
        label: "Niemcy",
        search: "Niemcy",
      },
      {
        label: "Polska",
        search: "Polska",
      },
      {
        label: "Poradniki",
        search: "Poradniki",
      },
    ],
  },

  logoRotator: {
    enabled: true,
    interval: 4500,
    logos: [
      {
        srcLight: "ade-base-system/gfx/interface/logo-VisuDir-light-240px.png",
        srcDark: "ade-base-system/gfx/interface/logo-VisuDir-dark-240px.png",
        href: "ade-base-system/about.html",
        alt: "Logo VisuDir",
      },
      {
        srcLight: "ade-base-system/gfx/interface/logo-ade-v1-light-240px.png",
        srcDark: "ade-base-system/gfx/interface/logo-ade-v1-dark-240px.png",
        href: "https://www.ade.pl",
        alt: "Logo ADE",
      },
    ],
  },

  paths: {
    url404: "ade-base-system/404.html",
    urlAbout: "ade-base-system/about.html",
    urlFallback: "ade-base-system/soon.html",
    videoBgLightUrlBase: "ade-base-system/video-bg/bg-light",
    videoBgDarkUrlBase: "ade-base-system/video-bg/bg-dark",

    databaseFileName: "ade-base-system/db.txt",
    dataFolderName: "ade-base-system/files",
    coversFolderName: "ade-base-system/preview",
    previewHdFolderName: "ade-base-system/preview-hd",
  },

  // Wklej ten obiekt wewnątrz obiektu 'config' w pliku config.js
  langConfig: {
    pl: { name: "Polski", flag: "pl", lat: 52.23, lon: 21.01 }, // Warszawa
    en: { name: "English", flag: "gb", lat: 51.51, lon: -0.13 }, // Londyn
    de: { name: "Deutsch", flag: "de", lat: 52.52, lon: 13.41 }, // Berlin
    es: { name: "Español", flag: "es", lat: 40.42, lon: -3.7 }, // Madryt
    fr: { name: "Français", flag: "fr", lat: 48.86, lon: 2.35 }, // Paryż
    it: { name: "Italiano", flag: "it", lat: 41.9, lon: 12.5 }, // Rzym
    ja: { name: "日本語", flag: "jp", lat: 35.68, lon: 139.69 }, // Tokio
    zh: { name: "中文", flag: "cn", lat: 39.9, lon: 116.41 }, // Pekin
    pt: { name: "Português", flag: "br", lat: -15.79, lon: -47.88 }, // Brasília
    cs: { name: "Čeština", flag: "cz", lat: 50.08, lon: 14.44 }, // Praga
    sk: { name: "Slovenčina", flag: "sk", lat: 48.15, lon: 17.11 }, // Bratysława
    uk: { name: "Українська", flag: "ua", lat: 50.45, lon: 30.52 }, // Kijów
    id: { name: "Indonesia", flag: "id", lat: -6.21, lon: 106.85 }, // Dżakarta
    hi: { name: "हिन्दी", flag: "in", lat: 28.61, lon: 77.21 }, // Nowe Delhi
    us: { name: "USA (English)", flag: "us", lat: 38.91, lon: -77.04 }, // Waszyngton
    sg: { name: "Singapore", flag: "sg", lat: 1.35, lon: 103.82 }, // Singapur
    tr: { name: "Türkçe", flag: "tr", lat: 39.93, lon: 32.86 }, // Ankara
  },
};
