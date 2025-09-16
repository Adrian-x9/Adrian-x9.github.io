<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kompletna Baza Skrótów</title>
    <style>
        :root {
            --primary-color: #0078d4;
            --light-gray: #f0f0f0;
            --medium-gray: #e0e0e0;
            --dark-gray: #333;
            --background-color: #f8f9fa;
            --box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        body {
            font-family: Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            line-height: 1.5;
            background-color: var(--background-color);
            color: var(--dark-gray);
            margin: 0;
            padding: 20px;
        }
        .header {
            max-width: 1200px;
            margin: 0 auto 20px auto;
        }
        h1 {
            text-align: center;
            color: var(--primary-color);
            margin-bottom: 20px;
        }
        .controls {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
        }
        .controls select {
            flex-basis: 250px;
            flex-shrink: 0;
        }
        .controls input[type="search"] {
            flex-grow: 1;
        }
        .controls select, .controls input[type="search"] {
            padding: 10px;
            font-size: 16px;
            border-radius: 6px;
            border: 1px solid var(--medium-gray);
        }
        #shortcuts-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        .shortcut-group {
            background-color: #fff;
            border: 1px solid var(--medium-gray);
            border-radius: 8px;
            box-shadow: var(--box-shadow);
            flex: 1 1 350px; /* Flex-grow, flex-shrink, flex-basis */
            max-width: 450px;
            min-width: 300px;
            align-self: flex-start;
        }
        .shortcut-group h2 {
            color: #fff;
            background-color: var(--primary-color);
            padding: 10px 15px;
            margin: 0;
            font-size: 1em;
            border-radius: 7px 7px 0 0;
        }
        .shortcut {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 15px;
            border-bottom: 1px solid var(--light-gray);
            font-size: 0.9em;
            transition: background-color 0.2s ease-in-out;
        }
        .shortcut:last-child {
            border-bottom: none;
        }
        .shortcut:hover {
            background-color: #eef6ff;
        }
        .keys {
            font-weight: 600;
            background-color: var(--light-gray);
            padding: 2px 7px;
            border-radius: 4px;
            border: 1px solid var(--medium-gray);
            white-space: nowrap;
            font-family: 'Consolas', 'Menlo', monospace;
            margin-right: 15px;
        }
        .description {
            flex-grow: 1;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Kompletna Baza Skrótów</h1>
        <div class="controls">
            <select id="app-select">
                <option value="">-- Wybierz program --</option>
                <option value="windows11">Windows 11</option>
                <option value="vscode">Visual Studio Code</option>
                <option value="pycharm">PyCharm</option>
                <option value="totalcommander">Total Commander</option>
                <option value="word">Microsoft Word</option>
                <option value="excel">Microsoft Excel</option>
                <option value="outlook">Microsoft Outlook</option>
            </select>
            <input type="search" id="search-box" placeholder="Szukaj w wybranym programie...">
        </div>
    </div>

    <div id="shortcuts-container"></div>

    <script>
        const shortcuts = {
            windows11: {
                "System i Aplikacje": [
                    { keys: "Ctrl + C/X/V", description: "Kopiuj / Wytnij / Wklej" },
                    { keys: "Ctrl + Z", description: "Cofnij" },
                    { keys: "Win + L", description: "Zablokuj komputer" },
                    { keys: "Alt + F4", description: "Zamknij aktywną aplikację" },
                    { keys: "Win + I", description: "Otwórz Ustawienia" },
                    { keys: "Ctrl + Shift + Esc", description: "Otwórz Menedżer Zadań" },
                    { keys: "Win + R", description: "Otwórz okno Uruchamianie" },
                    { keys: "Win + X", description: "Otwórz menu administratora (Quick Link)" },
                    { keys: "Win + V", description: "Otwórz historię schowka" },
                ],
                "Pulpit i Zarządzanie Oknami": [
                    { keys: "Win + D", description: "Pokaż / Ukryj pulpit" },
                    { keys: "Win + M", description: "Zminimalizuj wszystkie okna" },
                    { keys: "Win + Shift + M", description: "Przywróć zminimalizowane okna" },
                    { keys: "Win + Tab", description: "Widok zadań (wirtualne pulpity)" },
                    { keys: "Win + Ctrl + D", description: "Dodaj nowy wirtualny pulpit" },
                    { keys: "Win + Ctrl + F4", description: "Zamknij aktywny wirtualny pulpit" },
                    { keys: "Win + Ctrl + ←/→", description: "Przełącz między wirtualnymi pulpitami" },
                    { keys: "Win + ↑/↓", description: "Maksymalizuj / Minimalizuj okno" },
                    { keys: "Win + ←/→", description: "Przyciągnij okno do połowy ekranu" },
                    { keys: "Win + Alt + ↑/↓", description: "Przyciągnij okno do górnej/dolnej ćwiartki" },
                ],
                "Eksplorator Plików": [
                    { keys: "Win + E", description: "Otwórz Eksplorator Plików" },
                    { keys: "Ctrl + N", description: "Otwórz nowe okno Eksploratora" },
                    { keys: "Ctrl + W", description: "Zamknij bieżące okno" },
                    { keys: "Ctrl + F", description: "Uruchom wyszukiwanie" },
                    { keys: "Ctrl + Shift + N", description: "Utwórz nowy folder" },
                    { keys: "F2", description: "Zmień nazwę zaznaczonego elementu" },
                    { keys: "F11", description: "Tryb pełnoekranowy" },
                    { keys: "Alt + P", description: "Pokaż panel podglądu" },
                    { keys: "Alt + Enter", description: "Otwórz Właściwości dla zaznaczonego elementu" },
                ],
                "Narzędzia i Dostępność": [
                    { keys: "Win + S", description: "Otwórz Wyszukiwanie" },
                    { keys: "Win + H", description: "Uruchom pisanie głosowe" },
                    { keys: "Win + K", description: "Połącz z urządzeniami bezprzewodowymi" },
                    { keys: "Win + . (kropka)", description: "Otwórz panel Emoji i GIF" },
                    { keys: "Win + Shift + S", description: "Utwórz wycinek ekranu (zrzut ekranu)" },
                    { keys: "Win + G", description: "Otwórz Xbox Game Bar" },
                ]
            },
            vscode: {
                "Edycja Podstawowa": [
                    { keys: "Ctrl + Enter", description: "Wstaw nową linię poniżej" },
                    { keys: "Ctrl + Shift + Enter", description: "Wstaw nową linię powyżej" },
                    { keys: "Ctrl + Shift + \\", description: "Skocz do pasującego nawiasu" },
                    { keys: "Ctrl + ] / [", description: "Zwiększ / Zmniejsz wcięcie linii" },
                    { keys: "Home / End", description: "Skocz na początek / koniec linii" },
                    { keys: "Ctrl + Home / End", description: "Skocz na początek / koniec pliku" },
                    { keys: "Alt + ↑ / ↓", description: "Przesuń linię w górę / w dół" },
                ],
                "Edycja Zaawansowana (Multi-kursor)": [
                    { keys: "Ctrl + D", description: "Zaznacz następne wystąpienie" },
                    { keys: "Ctrl + K Ctrl + D", description: "Pomiń i zaznacz następne wystąpienie" },
                    { keys: "Ctrl + Alt + ↑ / ↓", description: "Wstaw kursor linię wyżej / niżej" },
                    { keys: "Shift + Alt + przeciągnięcie", description: "Zaznaczanie kolumnowe (blokowe)" },
                    { keys: "Shift + Alt + I", description: "Wstaw kursory na końcach zaznaczonych linii" },
                ],
                "Nawigacja i Wyszukiwanie": [
                    { keys: "F1", description: "Pokaż Paletę Poleceń" },
                    { keys: "Ctrl + P", description: "Idź do pliku" },
                    { keys: "Ctrl + Shift + O", description: "Idź do symbolu w pliku" },
                    { keys: "Ctrl + G", description: "Idź do linii" },
                    { keys: "F12", description: "Idź do definicji" },
                    { keys: "Alt + F12", description: "Podejrzyj definicję (Peek Definition)" },
                    { keys: "Ctrl + Shift + F", description: "Szukaj w całym projekcie" },
                    { keys: "Ctrl + H", description: "Zamień w pliku" },
                ],
                "Interfejs i Zarządzanie Oknem": [
                    { keys: "Ctrl + B", description: "Pokaż / Ukryj panel boczny" },
                    { keys: "Ctrl + `", description: "Pokaż / Ukryj zintegrowany terminal" },
                    { keys: "Ctrl + Shift + M", description: "Pokaż panel problemów (Problems)" },
                    { keys: "Ctrl + \\", description: "Podziel edytor" },
                    { keys: "Ctrl + 1 / 2 / 3", description: "Przełącz fokus między grupami edytorów" },
                    { keys: "Ctrl + K Z", description: "Włącz tryb Zen (bez rozpraszania)" },
                ]
            },
            pycharm: {
                "Edycja i Kod": [
                    { keys: "Ctrl + Spacja", description: "Podstawowe autouzupełnianie" },
                    { keys: "Ctrl + Shift + Spacja", description: "Inteligentne autouzupełnianie" },
                    { keys: "Ctrl + W / Ctrl + Shift + W", description: "Rozszerz / Zmniejsz zaznaczenie" },
                    { keys: "Ctrl + D", description: "Duplikuj linię/blok" },
                    { keys: "Ctrl + Y", description: "Usuń linię" },
                    { keys: "Alt + Enter", description: "Pokaż szybkie poprawki (Quick Fixes)" },
                    { keys: "Ctrl + Alt + L", description: "Sformatuj kod" },
                    { keys: "F2 / Shift + F2", description: "Następny / Poprzedni błąd" },
                ],
                "Nawigacja i Wyszukiwanie": [
                    { keys: "Podwójny Shift", description: "Szukaj wszędzie" },
                    { keys: "Ctrl + N", description: "Znajdź klasę" },
                    { keys: "Ctrl + Shift + N", description: "Znajdź plik" },
                    { keys: "Ctrl + Alt + Shift + N", description: "Znajdź symbol" },
                    { keys: "Ctrl + B", description: "Idź do deklaracji/użycia" },
                    { keys: "Ctrl + U", description: "Idź do klasy nadrzędnej" },
                    { keys: "Alt + 1", description: "Otwórz/zamknij okno Projektu" },
                    { keys: "Esc", description: "Przenieś fokus do edytora" },
                ],
                "Refaktoryzacja": [
                    { keys: "Shift + F6", description: "Zmień nazwę (Rename)" },
                    { keys: "Ctrl + Alt + M", description: "Wyodrębnij metodę (Extract Method)" },
                    { keys: "Ctrl + Alt + V", description: "Wyodrębnij zmienną (Extract Variable)" },
                    { keys: "Ctrl + Alt + F", description: "Wyodrębnij pole (Extract Field)" },
                    { keys: "Ctrl + Alt + P", description: "Wyodrębnij parametr (Extract Parameter)" },
                    { keys: "F6", description: "Przenieś (Move)" },
                ],
                "Debugowanie i Uruchamianie": [
                    { keys: "Shift + F10", description: "Uruchom" },
                    { keys: "Shift + F9", description: "Debuguj" },
                    { keys: "Alt + Shift + F10", description: "Wybierz i uruchom konfigurację" },
                    { keys: "F8", description: "Krok przez (Step Over)" },
                    { keys: "F7", description: "Wejdź do środka (Step Into)" },
                    { keys: "Shift + F8", description: "Wyjdź (Step Out)" },
                    { keys: "Alt + F9", description: "Uruchom do kursora" },
                    { keys: "Ctrl + F8", description: "Przełącz breakpoint" },
                ]
            },
            totalcommander: {
                "Operacje na Plikach": [
                    { keys: "F3", description: "Podgląd" },
                    { keys: "F4", description: "Edycja" },
                    { keys: "F5", description: "Kopiuj" },
                    { keys: "F6", description: "Przenieś / Zmień nazwę" },
                    { keys: "F7", description: "Nowy folder" },
                    { keys: "Shift + F4", description: "Nowy plik tekstowy" },
                    { keys: "Shift + F6", description: "Zmień nazwę w tym samym panelu" },
                    { keys: "F8 / Delete", description: "Usuń (do kosza lub trwale)" },
                    { keys: "Alt + Enter", description: "Właściwości pliku" },
                ],
                "Nawigacja i Wyświetlanie": [
                    { keys: "Ctrl + Q", description: "Szybki podgląd w drugim panelu" },
                    { keys: "Ctrl + F1", description: "Minimalny widok (tylko nazwy)" },
                    { keys: "Ctrl + F2", description: "Pełny widok (wszystkie szczegóły)" },
                    { keys: "Ctrl + B", description: "Widok 'płaski' (wszystkie pliki z podkatalogów)" },
                    { keys: "Ctrl + H", description: "Dodaj/usuń katalog z historii" },
                    { keys: "Alt + ←/→", description: "Poprzedni/następny odwiedzony folder" },
                ],
                 "Zarządzanie Kartami": [
                    { keys: "Ctrl + T", description: "Otwórz nową kartę" },
                    { keys: "Ctrl + W", description: "Zamknij aktywną kartę" },
                    { keys: "Ctrl + Shift + T", description: "Przywróć zamkniętą kartę" },
                    { keys: "Ctrl + Tab", description: "Przełącz na następną kartę" },
                    { keys: "Ctrl + Shift + Tab", description: "Przełącz na poprzednią kartę" },
                ],
                "Narzędzia Zaawansowane": [
                    { keys: "Alt + F7", description: "Wyszukiwanie plików" },
                    { keys: "Ctrl + M", description: "Narzędzie wielokrotnej zmiany nazwy" },
                    { keys: "Ctrl + L", description: "Oblicz zajmowane miejsce (dla folderów)" },
                    { keys: "Shift + F2", description: "Porównaj listy plików w obu panelach" },
                    { keys: "Ctrl + Shift + F2", description: "Porównaj pliki wg zawartości" },
                    { keys: "Ctrl + S", description: "Szybkie wyszukiwanie plików (Quick Search)" },
                ]
            },
            word: {
                "Formatowanie Znaków": [
                    { keys: "Ctrl + B/I/U", description: "Pogrubienie / Kursywa / Podkreślenie" },
                    { keys: "Ctrl + D", description: "Otwórz okno dialogowe Czcionka" },
                    { keys: "Ctrl + Shift + >/<", description: "Zwiększ / Zmniejsz rozmiar czcionki" },
                    { keys: "Ctrl + ]/[", description: "Zwiększ / Zmniejsz czcionkę o 1 pkt" },
                    { keys: "Ctrl + Shift + A", description: "Wszystkie litery jako wielkie (kapitaliki)" },
                    { keys: "Ctrl + Shift + K", description: "Małe litery jako wielkie (kapitaliki)" },
                    { keys: "Shift + F3", description: "Zmień wielkość liter (małe, Wielkie, Jak Zdanie)" },
                    { keys: "Ctrl + Spacja", description: "Usuń formatowanie znaków" },
                ],
                "Formatowanie Akapitów": [
                    { keys: "Ctrl + L/E/R/J", description: "Wyrównaj: lewo / środek / prawo / justuj" },
                    { keys: "Ctrl + M", description: "Zwiększ wcięcie akapitu" },
                    { keys: "Ctrl + Shift + M", description: "Zmniejsz wcięcie akapitu" },
                    { keys: "Ctrl + T", description: "Utwórz wysunięcie" },
                    { keys: "Ctrl + 1/2/5", description: "Interlinia: pojedyncza / podwójna / 1.5 wiersza" },
                    { keys: "Ctrl + 0 (zero)", description: "Dodaj/usuń odstęp przed akapitem" },
                    { keys: "Ctrl + Q", description: "Usuń formatowanie akapitu" },
                ],
                 "Style i Nagłówki": [
                    { keys: "Alt + Ctrl + 1/2/3", description: "Zastosuj styl Nagłówek 1/2/3" },
                    { keys: "Ctrl + Shift + S", description: "Otwórz panel Zastosuj style" },
                    { keys: "Ctrl + Shift + N", description: "Zastosuj styl Normalny" },
                ],
                "Edycja i Pola": [
                    { keys: "F9", description: "Zaktualizuj zaznaczone pola" },
                    { keys: "Ctrl + F9", description: "Wstaw puste pole" },
                    { keys: "Shift + F9", description: "Przełącz między kodem a wynikiem pola" },
                    { keys: "Alt + F9", description: "Przełącz widok wszystkich pól w dokumencie" },
                ]
            },
            excel: {
                "Nawigacja i Zaznaczanie": [
                    { keys: "Ctrl + Strzałki", description: "Przejdź do krawędzi obszaru danych" },
                    { keys: "Ctrl + Shift + Strzałki", description: "Zaznacz do krawędzi obszaru danych" },
                    { keys: "Ctrl + Spacja", description: "Zaznacz całą kolumnę" },
                    { keys: "Shift + Spacja", description: "Zaznacz cały wiersz" },
                    { keys: "F5 lub Ctrl + G", description: "Przejdź do" },
                    { keys: "Ctrl + Shift + O", description: "Zaznacz wszystkie komórki z komentarzami" },
                    { keys: "Ctrl + *", description: "Zaznacz bieżący region wokół aktywnej komórki" },
                ],
                "Wprowadzanie Danych": [
                    { keys: "F2", description: "Edytuj aktywną komórkę" },
                    { keys: "Alt + Enter", description: "Rozpocznij nowy wiersz w tej samej komórce" },
                    { keys: "Ctrl + ;", description: "Wstaw bieżącą datę" },
                    { keys: "Ctrl + Shift + :", description: "Wstaw bieżący czas" },
                    { keys: "Ctrl + D", description: "Wypełnij w dół (kopiuj z komórki powyżej)" },
                    { keys: "Ctrl + R", description: "Wypełnij w prawo (kopiuj z komórki po lewej)" },
                    { keys: "Ctrl + E", description: "Wypełnianie błyskawiczne (Flash Fill)" },
                    { keys: "Ctrl + '", description: "Kopiuj formułę z komórki powyżej" },
                ],
                "Formatowanie": [
                    { keys: "Ctrl + 1", description: "Otwórz okno Formatuj komórki" },
                    { keys: "Ctrl + Shift + ~", description: "Format ogólny" },
                    { keys: "Ctrl + Shift + $", description: "Format walutowy" },
                    { keys: "Ctrl + Shift + %", description: "Format procentowy" },
                    { keys: "Ctrl + Shift + #", description: "Format daty" },
                    { keys: "Ctrl + T", description: "Utwórz tabelę" },
                    { keys: "Ctrl + Shift + L", description: "Włącz/wyłącz autofiltr" },
                ],
                 "Formuły i Obliczenia": [
                    { keys: "Alt + =", description: "Autosumowanie" },
                    { keys: "Shift + F3", description: "Wstaw funkcję" },
                    { keys: "Ctrl + `", description: "Pokaż/ukryj formuły w arkuszu" },
                    { keys: "F4", description: "Przełącz typy odwołań (względne, bezwzględne)" },
                    { keys: "F9", description: "Oblicz wszystkie arkusze we wszystkich otwartych skoroszytach" },
                    { keys: "Shift + F9", description: "Oblicz aktywny arkusz" },
                ]
            },
            outlook: {
                "Podstawowa Obsługa": [
                    { keys: "Ctrl + N", description: "Utwórz nowy element (w danym module)" },
                    { keys: "Ctrl + Shift + M", description: "Nowa wiadomość e-mail (z dowolnego miejsca)" },
                    { keys: "Ctrl + O", description: "Otwórz zaznaczony element" },
                    { keys: "Ctrl + R", description: "Odpowiedz" },
                    { keys: "Ctrl + Shift + R", description: "Odpowiedz wszystkim" },
                    { keys: "Ctrl + F", description: "Prześlij dalej" },
                    { keys: "Ctrl + Enter", description: "Wyślij wiadomość" },
                    { keys: "F9", description: "Wyślij/Odbierz" },
                ],
                "Nawigacja": [
                    { keys: "Ctrl + 1/2/3/4/5", description: "Poczta / Kalendarz / Kontakty / Zadania / Notatki" },
                    { keys: "Ctrl + Y", description: "Przejdź do folderu" },
                    { keys: "Ctrl + E", description: "Przejdź do pola wyszukiwania" },
                    { keys: "Alt + ← / →", description: "Wstecz / Dalej w widoku" },
                    { keys: "F6 / Shift + F6", description: "Przechodź między panelami" },
                    { keys: "Ctrl + Tab", description: "Przechodź między otwartymi kartami (nagłówkami)" },
                ],
                "Kalendarz i Spotkania": [
                    { keys: "Ctrl + Shift + A", description: "Nowy termin" },
                    { keys: "Ctrl + Shift + Q", description: "Nowe wezwanie na spotkanie" },
                    { keys: "Alt + 0", description: "Pokaż 10 dni" },
                    { keys: "Alt + =", description: "Pokaż miesiąc" },
                    { keys: "Ctrl + Alt + 1/2/3/4", description: "Widok: Dzień / Tydzień roboczy / Tydzień / Miesiąc" },
                    { keys: "Ctrl + G", description: "Idź do daty" },
                ],
                "Flagi, Kategorie i Oznaczanie": [
                    { keys: "Insert", description: "Dodaj/usuń flagę monitującą" },
                    { keys: "Ctrl + Shift + G", description: "Otwórz okno flagowania niestandardowego" },
                    { keys: "Ctrl + F2", description: "Ustaw kategorię" },
                    { keys: "Ctrl + Q", description: "Oznacz jako przeczytane" },
                    { keys: "Ctrl + U", description: "Oznacz jako nieprzeczytane" },
                ]
            }
        };

        const select = document.getElementById('app-select');
        const searchBox = document.getElementById('search-box');
        const container = document.getElementById('shortcuts-container');

        function renderShortcuts() {
            const selectedApp = select.value;
            const searchTerm = searchBox.value.toLowerCase();
            container.innerHTML = '';

            if (!selectedApp || !shortcuts[selectedApp]) {
                return;
            }

            const appShortcuts = shortcuts[selectedApp];
            
            for (const groupName in appShortcuts) {
                const filteredShortcuts = appShortcuts[groupName].filter(shortcut => {
                    return shortcut.keys.toLowerCase().includes(searchTerm) ||
                           shortcut.description.toLowerCase().includes(searchTerm);
                });
                
                if (filteredShortcuts.length > 0) {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'shortcut-group';

                    const groupTitle = document.createElement('h2');
                    groupTitle.textContent = groupName;
                    groupDiv.appendChild(groupTitle);

                    filteredShortcuts.forEach(shortcut => {
                        const shortcutDiv = document.createElement('div');
                        shortcutDiv.className = 'shortcut';

                        const keysSpan = document.createElement('span');
                        keysSpan.className = 'keys';
                        keysSpan.textContent = shortcut.keys;

                        const descriptionSpan = document.createElement('span');
                        descriptionSpan.className = 'description';
                        descriptionSpan.textContent = shortcut.description;

                        shortcutDiv.appendChild(keysSpan);
                        shortcutDiv.appendChild(descriptionSpan);
                        groupDiv.appendChild(shortcutDiv);
                    });

                    container.appendChild(groupDiv);
                }
            }
        }

        select.addEventListener('change', renderShortcuts);
        searchBox.addEventListener('input', renderShortcuts);

    </script>
</body>
</html>