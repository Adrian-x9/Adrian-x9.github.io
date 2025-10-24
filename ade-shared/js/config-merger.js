// Now, this script only ASSIGNS a value to the global 'config' variable,
// it doesn't declare it. This allows it to run multiple times and overwrite the config.
// ---
// Teraz ten skrypt tylko PRZYPISUJE wartość do globalnej zmiennej 'config',
// a nie ją deklaruje. To pozwala na wielokrotne uruchamianie i nadpisywanie konfiguracji.

config = {
  ...config1,

  pageSettings: {
    ...config1.pageSettings,
    ...(typeof config2 !== 'undefined' ? config2.pageSettings : {}),
    ...(typeof config0 !== 'undefined' ? config0.pageSettings : {}),
  },
  paths: {
    ...config1.paths,
    ...(typeof config2 !== 'undefined' ? config2.paths : {}),
  },
};