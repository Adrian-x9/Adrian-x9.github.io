/// Global configuration // Globalna konfiguracja
const config1 = {
  version: "v2.5.2", // Fixes / poprawki
  build: "2025-09-17", // Build date YYYY-MM-DD
  updated: "2025-10-21", // Last update date YYYY-MM-DD

  language: {
    current: "pl", // Default language if script failure
  },

  /// Subsystem specific settings // Ustawienia specyficzne dla podsystemu
  pageSettings: {
    pageKey: "indexMaxi",
    pageTitle: "ade ▪ maxi MENU",
    //pathCorrection: "", // Use "" for main system, or "." for subsystems in subfolders

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
    defaultViewMode: "view-8",
    hoverOverlayColor: "rgba(204, 0, 0, 0.7)",
    hoverTextColor: "#ffffff",

    defaultGeneratorMode: "visible",
    defaultGeneratorCount: 5,
    generatorOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 25, 50, 100],

    defaultVideoExpanded: false,
    predefinedFilters: [{ label: "ADE", search: "ade" }],

    colorThemes: [
      "ade-shared/css/style-shared-red.css",
      "ade-shared/css/style-shared-green.css",
      "ade-shared/css/style-shared-blue.css",
      "ade-shared/css/style-shared-brown.css",
      "ade-shared/css/style-shared-orange.css",
      "ade-shared/css/style-shared-violet.css",
      "ade-shared/css/style-shared-teal.css",
      "ade-shared/css/style-shared-gray.css",
    ],
  },

  /// Shared settings and paths // Ustawienia i ścieżki wspólne
  logoRotator: {
    enabled: true,
    interval: 4500,
    logos: [], // will be filled dynamically
  },

  paths: {
    // Subsystem specific paths
    databaseFileName: "./ade-subsystem/ade-tools/.db-secure.txt",
    dataFolderName: "./ade-subsystem/files",
    coversFolderName: "./ade-subsystem/preview",
    previewHdFolderName: "./ade-subsystem/preview-hd",

    // Shared paths — will be filled dynamically
    url404: "",
    urlAbout: "",
    urlFallback: "",
    videoBgLightUrlBase: "",
    videoBgDarkUrlBase: "",
  },

  /// Shared language configuration // Wspólna konfiguracja językowa
  langConfig: {
    pl: { name: "Polski", flag: "pl", lat: 52.23, lon: 21.01 },
    en: { name: "English", flag: "gb", lat: 51.51, lon: -0.13 },
    de: { name: "Deutsch", flag: "de", lat: 52.52, lon: 13.41 },
    es: { name: "Español", flag: "es", lat: 40.42, lon: -3.7 },
    fr: { name: "Français", flag: "fr", lat: 48.86, lon: 2.35 },
    it: { name: "Italiano", flag: "it", lat: 41.9, lon: 12.5 },
    ja: { name: "日本語", flag: "jp", lat: 35.68, lon: 139.69 },
    zh: { name: "中文", flag: "cn", lat: 39.9, lon: 116.41 },
    pt: { name: "Português", flag: "br", lat: -15.79, lon: -47.88 },
    cs: { name: "Čeština", flag: "cz", lat: 50.08, lon: 14.44 },
    sk: { name: "Slovenčina", flag: "sk", lat: 48.15, lon: 17.11 },
    uk: { name: "Українська", flag: "ua", lat: 50.45, lon: 30.52 },
    id: { name: "Indonesia", flag: "id", lat: -6.21, lon: 106.85 },
    hi: { name: "हिन्दी", flag: "in", lat: 28.61, lon: 77.21 },
    us: { name: "USA (English)", flag: "us", lat: 38.91, lon: -77.04 },
    sg: { name: "Singapore", flag: "sg", lat: 1.35, lon: 103.82 },
    tr: { name: "Türkçe", flag: "tr", lat: 39.93, lon: 32.86 },
  },
};

/// Helper function to build shared paths
// function sharedPath(relativePath) {
//   const prefix = config1?.pageSettings?.pathCorrection ?? "";
//   return prefix + relativePath;
// }

// /// Dynamic assignment of logo paths
// config1.logoRotator.logos = [
//   {
//     srcLight: sharedPath(
//       "./ade-shared/gfx/interface/logo-VisuDir-light-240px.png"
//     ),
//     srcDark: sharedPath(
//       "./ade-shared/gfx/interface/logo-VisuDir-dark-240px.png"
//     ),
//     href: sharedPath("./ade-shared/about.html"),
//     alt: "Logo VisuDir",
//   },
//   {
//     srcLight: sharedPath(
//       "./ade-shared/gfx/interface/logo-ade-v1-light-240px.png"
//     ),
//     srcDark: sharedPath(
//       "./ade-shared/gfx/interface/logo-ade-v1-dark-240px.png"
//     ),
//     href: "https://www.ade.pl",
//     alt: "Logo ADE",
//   },
// ];

// /// Dynamic assignment of shared paths
// config1.paths.url404 = sharedPath("./ade-shared/404.html");
// config1.paths.urlAbout = sharedPath("./ade-shared/about.html");
// config1.paths.urlFallback = sharedPath("./ade-shared/soon.html");
// config1.paths.videoBgLightUrlBase = sharedPath(
//   "./ade-shared/video-bg/bg-light"
// );
// config1.paths.videoBgDarkUrlBase = sharedPath("./ade-shared/video-bg/bg-dark");
