const config = {
            version: 'v1.12.1', // New panel VIEW ready
            language: {
                current: 'en',
                files: {
                    en: 'index-en.html',
                    de: 'index-de.html',
                }
            },

            /// COPY HERE <cfg> // configuration / konfiguracja
            pageSettings: {
                pageKey: 'indexMaxi',

                defaultBgVideo: 1,
                bgVideoStartNum: 1,
                bgVideoEndNum: 35,
                defaultVideoBg: true,
                defaultLabelsVisible: true,
                slideshowAnimations: true,

                pageKey: 'indexMaxi',
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
                },],
            },

            logoRotator: {
                enabled: true,
                interval: 4500,
                logos: [{
                    srcLight: ".base-system/gfx/interface/VisuDir_small_light.png",
                    srcDark: ".base-system/gfx/interface/VisuDir_small_dark.png",
                    href: ".base-system/about.html",
                    alt: "Logo VisuDir"
                }, {
                    srcLight: ".base-system/gfx/interface/logo-ade-v1-light-480px.png",
                    srcDark: ".base-system/gfx/interface/logo-ade-v1-dark-480px.png",
                    href: "https://www.ade.pl",
                    alt: "Logo ADE"
                }]
            },

            paths: {
                url404: ".base-system/404.html",
                urlAbout: ".base-system/about.html",
                urlFallback: ".base-system/soon.html",
                videoBgLightUrlBase: ".base-system/video-bg/bg-light",
                videoBgDarkUrlBase: ".base-system/video-bg/bg-dark",

                databaseFileName: ".base-system/db.txt",
                dataFolderName: ".base-system/files",
                coversFolderName: ".base-system/preview",
                previewHdFolderName: ".base-system/preview-hd"
            }
        };