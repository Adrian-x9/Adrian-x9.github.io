/**
 * Merges all configuration parts into a single, global 'config' object.
 * Must be loaded AFTER all other config files, but BEFORE the main script.
 * ---
 * Łączy wszystkie części konfiguracji w jeden, globalny obiekt 'config'.
 * Musi być załadowany PO wszystkich innych plikach konfiguracyjnych,
 * ale PRZED głównym skryptem.
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