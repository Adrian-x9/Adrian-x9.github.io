/**
 * This script merges all configuration parts (config0, config1, config2)
 * into a single, global 'config' object. It must be loaded AFTER
 * all other config files, but BEFORE the main scripts-shared.js.
 * ---
 * Ten skrypt łączy wszystkie części konfiguracji (config0, config1, config2)
 * w jeden, globalny obiekt 'config'. Musi być załadowany PO wszystkich
 * innych plikach konfiguracyjnych, ale PRZED głównym scripts-shared.js.
 */
var config = {
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