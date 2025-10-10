const config = { /// Global configuration // Globalna konfiguracja
  version: "v2.2.3", /// Folders structure and names rebuild // Przebudowanie struktury folderów i 
  build: "2025-09-17", // Build date YYYY-MM-DD
  updated: "2025-10-10", // Last update date YYYY-MM-DD

  language: {
    current: "pl", /// Default language if script failure // Domyślny język na wypadek awarii skryptu
  },

  /// Subsystem specific settings // Ustawienia specyficzne dla podsystemu
  pageSettings: {
    pageKey: "indexMaxi",
    pageTitle: "ade ▪ maxi MENU",
    showMiniLogo: true,
    showVisuDirButton: false,
    showBackButton: false,
    showLanguageButton: false,
    
    screenSaverTimeout: 20,
    defaultBgVideo: 1,
    bgVideoStartNum: 1,
    bgVideoEndNum: 35,
    defaultVideoBg: true,
    defaultLabelsVisible: true,
    slideshowAnimations: true,

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

  /// Shared settings and paths // Ustawienia i ścieżki wspólne
  logoRotator: {
    enabled: true,
    interval: 4500,
    logos: [
      {
        srcLight: "./ade-shared/gfx/interface/logo-VisuDir-light-240px.png",
        srcDark: "./ade-shared/gfx/interface/logo-VisuDir-dark-240px.png",
        href: "./ade-shared/about.html",
        alt: "Logo VisuDir",
      },
      {
        srcLight: "./ade-shared/gfx/interface/logo-ade-v1-light-240px.png",
        srcDark: "./ade-shared/gfx/interface/logo-ade-v1-dark-240px.png",
        href: "https://www.ade.pl",
        alt: "Logo ADE",
      },
    ],
  },

  paths: {
    /// Subsystem specific paths // Ścieżki specyficzne dla podsystemu
    databaseFileName: "./ade-subsystem/ade-tools/.db-secure.txt",
    dataFolderName: "./ade-subsystem/files",
    coversFolderName: "./ade-subsystem/preview",
    previewHdFolderName: "./ade-subsystem/preview-hd",

    /// Shared paths // Ścieżki wspólne
    url404: "./ade-shared/404.html",
    urlAbout: "./ade-shared/about.html",
    urlFallback: "./ade-shared/soon.html",
    videoBgLightUrlBase: "./ade-shared/video-bg/bg-light",
    videoBgDarkUrlBase: "./ade-shared/video-bg/bg-dark",
  },

  /// Shared language configuration // Wspólna konfiguracja językowa
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
