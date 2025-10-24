const config2 = {
  /// Subsystem specific settings // Ustawienia specyficzne dla podsystemu
  pageSettings: {
    pageKey: "indexMaxi",
    pageTitle: "ade ▪ maxi MENU",
    // pathCorrection: ".", // <-- NOWA LINIA: Definiuje korektę dla podsystemu
    showMiniLogo: true,
    showVisuDirButton: true,
    showLanguageButton: true,
    showBackButton: false,

    screenSaverTimeout: 20,
    defaultBgVideo: 1,
    bgVideoStartNum: 1,
    bgVideoEndNum: 76,
    defaultVideoBg: true,
    defaultLabelsVisible: true,
    slideshowAnimations: true,

    defaultSort: "nameAsc", //nameAsc | nameDesc | dateAsc | dateDesc | sizeAsc | sizeDesc | shuffle
    defaultRows: 2,
    defaultSizePercent: 66,
    baseBoxWidth: 256,
    estimatedItemHeight: 380,
    defaultViewMode: "view-7",
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

    defaultThemeFile: './ade-subsystem/css/styles-subsystem.css',
  },
  paths: {
    /// Subsystem specific paths // Ścieżki specyficzne dla podsystemu
    databaseFileName: "./ade-subsystem/ade-tools/.db-secure.txt",
    dataFolderName: "./ade-subsystem/files",
    coversFolderName: "./ade-subsystem/preview",
    previewHdFolderName: "./ade-subsystem/preview-hd",
  },
};


