import os
import shutil

# === KONFIGURACJA ===
BASE_INDEX = os.path.normpath("../../VisuDir/index.html")
SYSTEM_FOLDERS = ["./Poland", "./GameGuides", "./e-books"]
CONFIG_NAME = ".config.txt"
DB_NAME = ".db-secure.txt"
LANG_FILES = ["lang-pl.txt", "lang-en.txt", "lang-de.txt"]  # można rozszerzyć

# === FUNKCJE POMOCNICZE ===
def read_section(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return None

def replace_section(content, marker, new_data):
    start_tag = f"/// COPY HERE <{marker}>"
    end_tag = f"/// COPY HERE <{marker}>"
    start = content.find(start_tag)
    end = content.find(end_tag, start + len(start_tag))
    if start == -1 or end == -1 or not new_data:
        return content
    return content[:start + len(start_tag)] + "\n" + new_data + "\n" + content[end:]

# === GŁÓWNA PĘTLA ===
for folder in SYSTEM_FOLDERS:
    print(f"🔄 Aktualizacja folderu: {folder}")
    base_html = read_section(BASE_INDEX)
    if not base_html:
        print(f"❌ Nie znaleziono pliku bazowego: {BASE_INDEX}")
        continue

    # Ścieżki do plików w podfolderze
    tools_path = os.path.join(folder, ".base-system", ".tools")
    cfg_data = read_section(os.path.join(tools_path, CONFIG_NAME))
    db_data = read_section(os.path.join(tools_path, DB_NAME))

    # Podstawienie konfiguracji i bazy
    updated_html = replace_section(base_html, "cfg", cfg_data)
    updated_html = replace_section(updated_html, "db", db_data)

    # Generowanie wersji językowych
    for lang_file in LANG_FILES:
        lang_data = read_section(os.path.join(tools_path, f".{lang_file}"))
        final_html = replace_section(updated_html, "lang", lang_data)
        lang_code = lang_file.split("-")[1].split(".")[0]
        output_path = os.path.join(folder, f"index-{lang_code}.html")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(final_html)
        print(f"✅ Utworzono: {output_path}")

print("🎉 Aktualizacja zakończona.")