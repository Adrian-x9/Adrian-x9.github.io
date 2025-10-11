const config2 = {
  /// Subsystem specific settings // Ustawienia specyficzne dla podsystemu
  pageSettings: {
    pageKey: "gameGuides",
    pageTitle: "Game Guides ▪ e-books",
    pathCorrection: "..", // <-- NOWA LINIA: Definiuje korektę dla podsystemu
    showMiniLogo: true,
    showVisuDirButton: false,
    showBackButton: true,
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

  paths: {
    /// Subsystem specific paths // Ścieżki specyficzne dla podsystemu
    databaseFileName: "./ade-subsystem/ade-tools/.db-secure.txt",
    dataFolderName: "./ade-subsystem/preview-hd",
    coversFolderName: "./ade-subsystem/preview",
    previewHdFolderName: "./ade-subsystem/preview-hd",
  },
};

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
