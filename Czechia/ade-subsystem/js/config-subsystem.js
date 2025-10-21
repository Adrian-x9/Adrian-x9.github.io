const config2 = {
  /// Subsystem specific settings // Ustawienia specyficzne dla podsystemu
  pageSettings: {
    pageKey: "czechia",
    pageTitle: "ČESKO ▪ photo gallery",
    pathCorrection: "..", // <-- NOWA LINIA: Definiuje korektę dla podsystemu
    showMiniLogo: true,
    showVisuDirButton: true,
    showBackButton: true,
    showLanguageButton: true,

    screenSaverTimeout: 20,
    defaultBgVideo: 31,
    bgVideoStartNum: 1,
    bgVideoEndNum: 76,
    defaultVideoBg: true,
    defaultLabelsVisible: true,
    slideshowAnimations: true,

    defaultSort: "nameAsc",
    defaultRows: 2,
    defaultSizePercent: 100,
    baseBoxWidth: 256,
    estimatedItemHeight: 380,
    defaultViewMode: "view-6",
    hoverOverlayColor: "rgba(204, 0, 0, 0.7)",
    hoverTextColor: "#ffffff",

    defaultGeneratorMode: "visible",
    defaultGeneratorCount: 5,
    generatorOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 25, 50, 100],

    defaultVideoExpanded: false,
    predefinedFilters: [{}, {}],
    
    defaultThemeFile: './ade-subsystem/css/style-subsystem.css',
  },

  paths: {
    /// Subsystem specific paths // Ścieżki specyficzne dla podsystemu
    databaseFileName: "./ade-subsystem/ade-tools/.db-secure.txt",
    dataFolderName: "./ade-subsystem/files",
    coversFolderName: "./ade-subsystem/preview",
    previewHdFolderName: "./ade-subsystem/files",
  },
};

// === POCZĄTEK ŁATKI: Korekta ścieżek dla podsystemu ===
if (config2.pageSettings.pathCorrection) {
  const prefix = config2.pageSettings.pathCorrection;

  // Funkcja pomocnicza do poprawiania ścieżek współdzielonych
  const correctSharedPath = (path) => {
    // Sprawdzamy, czy ścieżka zaczyna się od ./ade-shared
    if (typeof path === "string" && path.startsWith("./ade-shared")) {
      // Zamieniamy "./" na zdefiniowany prefiks, np. "../"
      return prefix + path.substring(1);
    }
    return path;
  };

  // Poprawiamy ścieżki w logo
  config1.logoRotator.logos.forEach((logo) => {
    logo.srcLight = correctSharedPath(logo.srcLight);
    logo.srcDark = correctSharedPath(logo.srcDark);
    logo.href = correctSharedPath(logo.href);
  });

  // Poprawiamy pozostałe ścieżki globalne
  config1.paths.url404 = correctSharedPath(config1.paths.url404);
  config1.paths.urlAbout = correctSharedPath(config1.paths.urlAbout);
  config1.paths.urlFallback = correctSharedPath(config1.paths.urlFallback);
  config1.paths.videoBgLightUrlBase = correctSharedPath(
    config1.paths.videoBgLightUrlBase
  );
  config1.paths.videoBgDarkUrlBase = correctSharedPath(
    config1.paths.videoBgDarkUrlBase
  );
}
// === KONIEC ŁATKI ===

const config = {
  ...config1,
  pageSettings: {
    ...config1.pageSettings,
    ...config2.pageSettings,
  },
  paths: {
    ...config1.paths,
    ...config2.paths,
  },
};
