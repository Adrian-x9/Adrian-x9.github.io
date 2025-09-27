const config = {
    version: 'v1.12.1', // New panel VIEW ready
    language: {
        current: 'en',
        files: {
            en: 'index-en.html',
            de: 'index-de.html',
        }
    },
    pageSettings: {
        pageKey: 'indexMaxi',
        defaultBgVideo: 1,
        bgVideoStartNum: 1,
        bgVideoEndNum: 35,
        defaultVideoBg: true,
        defaultLabelsVisible: true,
        slideshowAnimations: true,
        pageTitle: "START ▪ maxi MENU ▪",
        showMiniLogo: true,
        showVisuDirButton: true,
        showBackButton: false,
        showLanguageButton: false,
        defaultSort: 'nameAsc',
        defaultRows: 2,
        defaultSizePercent: 100,
        baseBoxWidth: 256,
        estimatedItemHeight: 380,
        defaultViewMode: 'full',
        hoverOverlayColor: 'rgba(204, 0, 0, 0.7)',
        hoverTextColor: '#ffffff',
        defaultGeneratorMode: 'visible',
        defaultGeneratorCount: 5,
        generatorOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 25, 50, 100],
        defaultVideoExpanded: false,
        predefinedFilters: [{
            label: "ADE",
            search: "ade"
        }, {
            label: "E-booki",
            search: "e-book"
        }, {
            label: "Galerie",
            search: "galeri"
        }, {
            label: "Hiszpania",
            search: "Hiszpania"
        }, {
            label: "Niemcy",
            search: "Niemcy"
        }, {
            label: "Polska",
            search: "Polska"
        }, {
            label: "Poradniki",
            search: "Poradniki"
        }, ],
    },
    logoRotator: {
        enabled: true,
        interval: 4500,
        logos: [{
            srcLight: "ade-base-system/gfx/interface/VisuDir_small_light.png",
            srcDark: "ade-base-system/gfx/interface/VisuDir_small_dark.png",
            href: "ade-base-system/about.html",
            alt: "Logo VisuDir"
        }, {
            srcLight: "ade-base-system/gfx/interface/ADE_small_light.png",
            srcDark: "ade-base-system/gfx/interface/ADE_small_dark.png",
            href: "https://www.ade.pl",
            alt: "Logo ADE"
        }]
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
        previewHdFolderName: "ade-base-system/preview-hd"
    }
};