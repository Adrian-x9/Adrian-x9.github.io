const itemTags = {
  /**
   * =============================================
   * 🇪🇸 HISZPANIA - TAGI
   * =============================================
   * Strategia:
   * - Używamy małych liter.
   * - Dodajemy słowa kluczowe w j. polskim i angielskim, aby ułatwić wyszukiwanie.
   * - Unikamy ogólnego tagu "hiszpania", bo jest on domyślny dla całej galerii.
   * - Skupiamy się na lokalizacji, tematyce i charakterystycznych cechach zdjęcia.
   */

  "alcazar-4917318_1920.jpg": ["toledo", "alkazar", "alcazar", "zamek", "castle", "forteca", "fortress", "most", "bridge", "rzeka", "river", "tag", "tagus"],
  "almond-tree-7847670_1920.jpg": ["drzewo migdałowe", "almond tree", "kwiaty", "blossoms", "wiosna", "spring", "wschód słońca", "sunrise", "natura", "nature"],
  "barcelona-4899368_1920.jpg": ["barcelona", "casa milà", "la pedrera", "gaudí", "architektura", "architecture", "modernizm", "modernisme"],
  "beach-7944181_1920.jpg": ["calpe", "peñón de ifach", "skała", "rock", "costa blanca", "morze", "sea", "plaża", "beach", "krajobraz", "landscape"],
  "bell-jar-204389_1920.jpg": ["dzwonnica", "bell tower", "architektura", "architecture", "śródziemnomorski", "mediterranean", "niebo", "sky", "minimalizm"],
  "buildings-4827988_1920.jpg": ["andaluzja", "andalusia", "pueblos blancos", "białe miasteczka", "uliczka", "street", "zachód słońca", "sunset", "architektura", "architecture"],
  "buildings-5003132_1920.jpg": ["tarragona", "mural", "trompe-l'œil", "sztuka uliczna", "street art", "fasada", "facade", "iluzja", "illusion"],
  "buildings-7717853_1920.jpg": ["benidorm", "panorama", "skyline", "wieżowce", "skyscrapers", "miasto", "city", "plaża", "beach", "morze", "sea"],
  "cathedral-5043132_1920.jpg": ["malaga", "katedra", "cathedral", "la manquita", "architektura", "architecture", "renesans", "renaissance", "palmy", "palm trees"],
  "cathedral-7278228_1920.jpg": ["burgos", "katedra", "cathedral", "gotyk", "gothic", "architektura", "architecture", "unesco", "ulica", "street"],
  "city-5164368_1920.jpg": ["sewilla", "seville", "plac hiszpański", "plaza de españa", "architektura", "architecture", "odbicie", "reflection", "kanał", "canal"],
  "city-7137958_1920.jpg": ["malaga", "panorama", "la malagueta", "arena", "bullring", "morze", "sea", "miasto", "cityscape", "widok z góry", "aerial view"],
  "cordoba-4139398_1920.jpg": ["kordoba", "cordoba", "mezquita", "meczet-katedra", "architektura", "architecture", "historia", "history", "ulica", "street"],
  "cudillero-2715624_1920.jpg": ["cudillero", "asturia", "asturias", "wioska rybacka", "fishing village", "kolorowe domy", "colorful houses", "port", "harbor"],
  "dusk-3745864_1920.jpg": ["nerja", "costa del sol", "zmierzch", "dusk", "panorama", "widok z góry", "aerial view", "morze", "sea", "światła miasta", "city lights"],
  "el-born-5301517_1920.jpg": ["barcelona", "dzielnica gotycka", "gothic quarter", "barri gòtic", "uliczka", "alley", "ciemno", "dark", "tajemniczy", "mysterious"],
  "forest-6706559_1920.jpg": ["jesień", "autumn", "las", "forest", "rzeka", "river", "odbicie", "reflection", "kolory", "colors", "natura", "nature"],
  "gaztelugatxe-4377342_1920.jpg": ["gaztelugatxe", "kraj basków", "basque country", "gra o tron", "game of thrones", "smocza skała", "dragonstone", "most", "bridge", "morze", "sea"],
  "girona-4278090_1920.jpg": ["girona", "rzeka onyar", "onyar river", "kolorowe domy", "colorful houses", "odbicie", "reflection", "miasto", "cityscape", "jesień", "autumn"],
  "golf-1649232_1920.jpg": ["golf", "pole golfowe", "golf course", "costa del sol", "sport", "rekreacja", "leisure", "lato", "summer"],
  "golf-1649263_1920.jpg": ["golf", "marbella", "pole golfowe", "golf course", "góry", "mountains", "sport", "rekreacja", "leisure"],
  "gran-canaria-4360002_1920.jpg": ["gran canaria", "wyspy kanaryjskie", "canary islands", "droga", "road", "góry", "mountains", "morze", "sea", "krajobraz", "landscape"],
  "great-way-968932_1920.jpg": ["madryt", "madrid", "gran vía", "miasto", "city", "architektura", "architecture", "schweppes", "ruch uliczny", "traffic"],
  "lake-7194103_1920.jpg": ["asturia", "asturias", "park somiedo", "somiedo park", "jezioro", "lake", "góry", "mountains", "krajobraz", "landscape", "natura", "nature"],
  "lighthouse-5577451_1920.jpg": ["latarnia morska", "lighthouse", "zmierzch", "dusk", "błękitna godzina", "blue hour", "minimalizm", "minimalist", "skały", "rocks"],
  "lighthouse-8578318_1920.jpg": ["latarnia morska", "lighthouse", "noc", "night", "światło", "light", "czarno-białe", "black and white", "b&w"],
  "madrid-2179954_1920.jpg": ["madryt", "madrid", "puerta de alcalá", "brama", "gate", "zabytek", "monument", "architektura", "architecture", "neoklasycyzm"],
  "madrid-3021998_1920.jpg": ["madryt", "madrid", "gran vía", "noc", "night", "miasto", "city", "długi czas naświetlania", "long exposure", "światła", "lights"],
  "madrid-5010803_1920.jpg": ["madryt", "madrid", "panorama", "zachód słońca", "sunset", "miasto", "cityscape", "ruch uliczny", "traffic"],
  "man-7749831_1920.jpg": ["maurowie i chrześcijanie", "moros y cristianos", "festiwal", "fiesta", "tradycja", "tradition", "kostium", "costume", "portret", "portrait"],
  "montserrat-4904951_1920.jpg": ["montserrat", "katalonia", "catalonia", "klasztor", "monastery", "bazylika", "basilica", "wnętrze", "interior", "architektura", "architecture"],
  "moutains-8708801_1920.jpg": ["el torcal de antequera", "andaluzja", "andalusia", "skały", "rocks", "krajobraz", "landscape", "kras", "karst", "geologia", "geology"],
  "overlook-4841320_1920.jpg": ["barcelona", "montjuïc", "panorama", "widok z góry", "aerial view", "plaça d'espanya", "palau nacional", "miasto", "cityscape"],
  "palace-611897_1920.jpg": ["aranjuez", "pałac", "palace", "rezydencja królewska", "royal residence", "architektura", "architecture", "unesco", "historia", "history"],
  "placa-despanya-7214152_1920.jpg": ["barcelona", "plaça d'espanya", "plac hiszpański", "wieże weneckie", "venetian towers", "fontanna", "fountain", "miasto", "cityscape"],
  "salamanca-9302112_1920.jpg": ["salamanka", "salamanca", "katedra", "cathedral", "gotyk", "gothic", "architektura", "architecture", "kamień", "stone", "złote miasto"],
  "sea-6580562_1920.jpg": ["galicja", "galicia", "ocean atlantycki", "atlantic ocean", "morze", "sea", "kobieta", "woman", "relaks", "relax", "krajobraz", "landscape"],
  "sea-8254024_1920.jpg": ["majorka", "mallorca", "cala figuera", "port", "harbor", "wioska rybacka", "fishing village", "łódki", "boats", "morze", "sea"],
  "sevilla-tower-786180_1920.jpg": ["sewilla", "seville", "torre sevilla", "wieżowiec", "skyscraper", "architektura", "architecture", "nowoczesność", "modern", "niebo", "sky"],
  "spain-2499681_1920.jpg": ["sewilla", "seville", "plac hiszpański", "plaza de españa", "architektura", "architecture", "zabytek", "monument", "lato", "summer"],
  "spain-3756641_1920.jpg": ["grenada", "granada", "alhambra", "pałac", "palace", "architektura mauretańska", "moorish architecture", "historia", "history", "unesco"],
  "spain-4522800_1920.jpg": ["grenada", "granada", "alhambra", "pałac nasrydów", "nasrid palaces", "łuk", "arch", "architektura", "architecture", "sztuka islamu", "islamic art"],
  "spain-4967963_1920.jpg": ["frigiliana", "andaluzja", "andalusia", "pueblos blancos", "białe miasteczka", "uliczka", "street", "architektura", "architecture", "minimalizm"],
  "spain-557748_1920.jpg": ["sewilla", "seville", "la campana", "architektura", "architecture", "azulejos", "ceramika", "ceramics", "wieża", "tower"],
  "spain-7214284_1920.jpg": ["segowia", "segovia", "stare miasto", "old town", "dachy", "rooftops", "mur pruski", "half-timbered", "architektura", "architecture"],
  "spain-square-573805_1920.jpg": ["sewilla", "seville", "plac hiszpański", "plaza de españa", "panorama", "architektura", "architecture", "kanał", "canal", "fontanna", "fountain"],
  "statue-7943963_1920.jpg": ["madryt", "madrid", "pomnik", "statue", "koń", "horse", "plaza de oriente", "sztuka", "art", "rzeźba", "sculpture"],
  "street-427998_1920.jpg": ["barcelona", "plaça d'espanya", "plac hiszpański", "arenas de barcelona", "widok z góry", "aerial view", "miasto", "cityscape"],
  "street-4921940_1920.jpg": ["osuna", "andaluzja", "andalusia", "kościół", "church", "wieża", "tower", "architektura", "architecture", "białe miasteczka"],
  "sunset-6899490_1920.jpg": ["ibiza", "es vedrà", "zachód słońca", "sunset", "morze", "sea", "wyspa", "island", "krajobraz", "landscape", "mistyczny", "mystical"],
  "tenerife-7398660_1920.jpg": ["teneryfa", "tenerife", "los gigantes", "klify", "cliffs", "ocean atlantycki", "atlantic ocean", "krajobraz", "landscape", "dramatyczny", "dramatic"],
  "toledo-235235_1920.jpg": ["toledo", "panorama", "miasto", "cityscape", "rzeka tag", "tagus river", "historia", "history", "zabytek", "monument"],
  "travel-5188598_1920.jpg": ["barcelona", "plaça d'espanya", "plac hiszpański", "wieże weneckie", "venetian towers", "montjuïc", "miasto", "cityscape"],
  "travel-6470467_1920.jpg": ["bardenas reales", "nawara", "navarre", "pustynia", "desert", "krajobraz", "landscape", "geologia", "geology", "skały", "rocks"],
  "valencia-1049389_1920.jpg": ["walencja", "valencia", "miasto sztuki i nauki", "city of arts and sciences", "calatrava", "architektura", "architecture", "nowoczesność", "modern", "futurystyczny", "futuristic"],
  "water-4848741_1920.jpg": ["molo", "pier", "morze", "sea", "wschód słońca", "sunrise", "długi czas naświetlania", "long exposure", "minimalizm", "minimalist", "spokój", "calm"],
  "windmills-4278675_1920.jpg": ["wiatraki", "windmills", "consuegra", "la mancha", "don kichot", "don quixote", "zamek", "castle", "krajobraz", "landscape"],
  "windmills-4278679_1920.jpg": ["wiatraki", "windmills", "consuegra", "la mancha", "don kichot", "don quixote", "niebo", "sky", "krajobraz", "landscape"],
  "woman-7767045_1920.jpg": ["karnawał", "carnival", "fiesta", "kobieta", "woman", "kostium", "costume", "pióra", "feathers", "parada", "parade", "teneryfa", "tenerife", "kadyks", "cádiz"]
};