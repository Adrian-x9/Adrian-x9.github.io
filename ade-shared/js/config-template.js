// Konfiguracja startowa dla szablonu strony statycznej
var config0 = {
  pageSettings: {
    pathCorrection: ".", // Pozostaje bez zmian
  },
};

// Konfiguracja specyficzna dla danej strony (w tym przypadku 'about')
var config2 = {
  pageSettings: {
    pageKey: "about",
    defaultBgVideo: 13,
    bgVideoStartNum: 1,
    bgVideoEndNum: 16,
    defaultAnimation: 2,
    showMiniLogo: true,
    showBackButton: true,
    showVideoButton: true,
    showThemeButton: true,
  },
  paths: {
    // Ścieżki wideo i grafik są teraz względne do folderu głównego (dzięki <base>)
    videos: {
      about_dark: 'video/about_dark.mp4',       // Usunięto ./
      about_light: 'video/about_light.mp4',      // Usunięto ./
    },
    graphics: {
      logo1: {
        dark: 'gfx/interface/VisuDir_small_dark.png',   // Usunięto ./
        light: 'gfx/interface/VisuDir_small_light.png',  // Usunięto ./
        link: 'about.html', // Pozostaje względne do głównego
      },
      logo2: {
        dark: 'gfx/interface/ADE_small_dark.png',      // Usunięto ./
        light: 'gfx/interface/ADE_small_light.png',     // Usunięto ./
        link: 'https://www.ade.pl',
      },
      logo3: {
        dark: 'gfx/interface/Building_small_dark.png', // Usunięto ./
        light: 'gfx/interface/Building_small_light.png',// Usunięto ./
        link: 'soon.html', // Pozostaje względne do głównego
      },
      about_dark: 'gfx/interface/VisuDir_dark.png',    // Usunięto ./
      about_light: 'gfx/interface/VisuDir_light.png',   // Usunięto ./
      about_ade_dark: 'gfx/interface/Adrian-dark.png',  // Usunięto ./
      about_ade_light: 'gfx/interface/Adrian-light.png' // Usunięto ./
    },
    // Te ścieżki będą teraz poprawnie dziedziczone z config1 i łączone przez merger
    // Nie musimy ich tu definiować, chyba że chcemy je nadpisać dla szablonu.
    // videoBgLightUrlBase: "video/bg_light", 
    // videoBgDarkUrlBase: "video/bg_dark", 
  },
};