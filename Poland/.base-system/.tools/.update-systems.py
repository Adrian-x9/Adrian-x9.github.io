#!/usr/bin/env python
# -*- coding: utf-8 -*-

# +---------+ Skrypt ".\base-system\.tools\.update-systems.py" +---------+

"""
VisuDir Cascade Update System (Graphical Application) <---+

Short description:
This application intelligently updates subsystems (e.g., Poland, GameGuides)
based on a single, main 'index.html' template. It automatically detects
subsystems, loads their unique configuration files (.config.txt),
databases (.db-secure.txt), and language files (.lang-xx.txt), and then
generates the final HTML files while maintaining the correct code structure.
The core logic, designed by the author, uses a "wrapper" method: raw data
from .txt files is wrapped in the necessary JavaScript syntax before being
injected into the template, ensuring structural integrity.

The application runs in a graphical mode (GUI) or a command-line mode (CLI),
is fault-tolerant, and does not require any external libraries to run.

Version History:
v11.0 (2025-09-23) - Final version. Code fully formatted and expanded to meet
                   - professional standards, including detailed comments and
                   - restored original author's signature block.
v10.x               - Refactoring and internationalization phase.
v9.0.0              - Implementation of the correct "wrapper" logic.
... previous development versions ...

Author: Adrian Ulbrych (Concept & Final Architecture) & Gemini (Implementation)
Location: Gliwice, Silesia, Poland
Contact: +48 601 190 330

All rights reserved.
Use and modification of the code require the author's consent.

============================
🔸 WERSJA POLSKA
============================
.update-systems.py v11.0 FINAL (2025-09-23)

+---> System kaskadowej aktualizacji VisuDir (Aplikacja Graficzna) <---+

Krótki opis:
Aplikacja w sposób inteligentny aktualizuje podsystemy (np. Poland, GameGuides)
na podstawie jednego, głównego szablonu 'index.html'. Automatycznie wykrywa
podsystemy, wczytuje dla nich unikalne pliki konfiguracyjne (.config.txt),
bazy danych (.db-secure.txt) i językowe (.lang-xx.txt), a następnie generuje
finalne pliki HTML, zachowując przy tym poprawną strukturę kodu.
Główna logika, zaprojektowana przez autora, opiera się na metodzie "wrappera":
surowe dane z plików .txt są obudowywane w niezbędną składnię JavaScript
przed wstrzyknięciem do szablonu, co zapewnia integralność struktury.

Aplikacja działa w trybie graficznym (GUI) lub w trybie linii komend (CLI),
jest odporna na błędy i nie wymaga do działania żadnych zewnętrznych bibliotek.

Historia wersji:
v11.0 (2025-09-23) - Wersja finalna. Kod w pełni sformatowany i rozbudowany do
                   - profesjonalnego standardu, włączając szczegółowe komentarze
                   - i przywrócony, oryginalny podpis autora.
v10.x              - Faza refactoringu i internalizacji.
v9.0.0             - Implementacja poprawnej logiki "wrappera".
... poprzednie wersje deweloperskie ...

Autor: Adrian Ulbrych (Koncepcja i Finalna Architektura) & Gemini (Implementacja)
Lokalizacja: Gliwice, Śląsk, Polska
Kontakt: +48 601 190 330

Wszystkie prawa zastrzeżone.
Użycie i modyfikacja kodu wymaga zgody autora.
============================

⠀⠀⠀⠀⠀⠀⠘⢄⠀⢰⠁⠀⢀⣠⠜
⠀⠀⠀⠀⠀⠀⠀⠀⡆⢸⠀⠀⡏
⠀⠀⠀⠀⠀⠀⠀⠀⢇⠀⠃⠀⢈
⠀⠀⠀⢀⣤⣶⠾⠿⠛⠛⠛⠛⠛⠿⠿⣶⣤⣀
⠀⣠⡾⠋⠁⠀⠀⠀⢀⣠⣤⠤⢤⣤⣄⠀⠈⠙⢿⣦
⣸⡏⠀⠀⠀⣀⣤⠾⠋⠁⠀⠀⠀⣸⠟⠀⠀⠀⠀⠹⣷
⣿⣇⠀⠀⠀⠙⠳⢦⣄⡀⠀⠀⠈⢳⣦⠀⠀⠀⠀⣰⣿
⢹⣿⣶⣤⣀⠀⠀⠀⠈⠙⠳⠶⠶⠿⠋⠀⢀⣤⣾⣿⣿⣶⣶⣦⡀
⠘⣿⣿⣿⣿⣿⣶⣶⣦⣤⣤⣤⣤⣶⣶⣿⣿⣿⣿⣿⠋⠉⠙⣿⣧
⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⠀⠀⢠⣿⡿
⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣶⣶⣿⡿
⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠈⠉⠉⠁
⠀⠀⠀⠀⠀⠈⠛⠻⢿⣿⣿⣿⡿⠿⠛⠁

© 2025 Adrian Ulbrych – All rights reserved
Project page: https://adrian-x9.github.io/

Do not remove these comments.
-->
"""

# --- STANDARD LIBRARY IMPORTS ---
import os
import re
import shutil
import threading
import time
import argparse
import sys

# ----------------------------------------------------------------------
# --- SECTION 1: CONFIGURATION AND GLOBAL VARIABLES
# ----------------------------------------------------------------------

# Dynamically determine key paths based on the script's location.
# This makes the script portable and requires no manual path configuration.
try:
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
except NameError:
    # Fallback for environments where __file__ is not defined
    SCRIPT_DIR = os.getcwd()
    PROJECT_ROOT = os.path.abspath(os.path.join(os.getcwd(), "..", ".."))

# Definitions of comment tags in the template and their corresponding JS wrappers.
# This is the core of the "wrapper" logic, as designed by the author.
TAGS = {
    "cfg": {
        "start_comment": "// --- configuraton / konfiguracja ---",
        "end_comment": "// --- Configuration end ---",
        "wrapper_start": "const config = {",
        "wrapper_end": "};"
    },
    "db": {
        "start_comment": "// --- File database ---",
        "end_comment": "// --- Database end ---",
        "wrapper_start": "const dataFromFile = `",
        "wrapper_end": "`;"
    },
    "lang": {
        "start_comment": "// language file / plik językowy",
        "end_comment": "// language end / koniec języka",
        "wrapper_start": "const languageStrings = {",
        "wrapper_end": "};"
    }
}


# ----------------------------------------------------------------------
# --- SECTION 2: UNIVERSAL LOGGER
# ----------------------------------------------------------------------

class Logger:
    """
    A universal logger class. It allows logging simultaneously to a file
    and passing messages to various "handlers" (e.g., to the GUI or console).
    """

    def __init__(self, log_file_path):
        """Initializes the logger and opens the log file in write mode (overwriting)."""
        self.handlers = []
        self.log_file = open(log_file_path, 'w', encoding='utf-8')

    def add_handler(self, handler_func):
        """Adds a new log handler (e.g., a function to print text in the GUI)."""
        self.handlers.append(handler_func)

    def log(self, message, level='info'):
        """
        Records a message: writes it to the file and passes it to all handlers.
        :param message: The content of the message.
        :param level: The log level (e.g., 'info', 'error') used for color-coding.
        """
        timestamp = time.strftime('%H:%M:%S')
        log_entry = f"[{timestamp}] {message}"

        self.log_file.write(log_entry + "\n")
        self.log_file.flush()

        for handler in self.handlers:
            handler(message, level)

    def close(self):
        """Closes the log file."""
        self.log_file.close()


# ----------------------------------------------------------------------
# --- SECTION 3: APPLICATION BACKEND LOGIC
# ----------------------------------------------------------------------

class CascadeUpdater:
    """
    Contains the entire business logic for the system update process.
    It is completely decoupled from the graphical interface.
    """

    def __init__(self, project_root, tags, logger, completion_callback=None):
        self.project_root = project_root
        self.tags = tags
        self.logger = logger
        self.on_completion = completion_callback or (lambda: None)
        self.is_running = True

    def stop(self):
        """Sets a flag to safely stop the main processing loop."""
        self.is_running = False

    def _read_file_robustly(self, path):
        """
        Intelligently reads a file by trying the standard UTF-8 encoding first,
        and if that fails (due to a BOM), it falls back to UTF-16.
        """
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            self.logger.log(f"File '{os.path.basename(path)}' is not UTF-8, attempting to read as UTF-16.",
                            "info_italic")
            with open(path, 'r', encoding='utf-16') as f:
                return f.read()

    def _replace_block(self, content, tag_key, new_data):
        """
        A universal function for replacing blocks, following the "wrapper" logic.
        It wraps the raw data from a file with the necessary JS code
        before replacing the entire block in the template.
        """
        if new_data is None:
            # If there's no new data, return the original content unmodified.
            return content

        tag_info = self.tags[tag_key]
        # Wrap the raw data in its required JavaScript syntax.
        wrapped_data = f"{tag_info['wrapper_start']}\n{new_data.strip()}\n{tag_info['wrapper_end']}"

        # Create a regular expression to find the block between the start and end comments.
        # Using raw string (r"...") to avoid potential SyntaxWarning.
        pattern = re.compile(
            r"({start})[\s\S]*?({end})".format(
                start=re.escape(tag_info['start_comment']),
                end=re.escape(tag_info['end_comment'])
            ),
            re.DOTALL
        )

        # Replace the old block with the new block, preserving the start/end comment tags.
        # The `\\1` refers to the first captured group (the start comment).
        return pattern.sub(f"\\1\n{wrapped_data}", content)

    def run_update(self):
        """The main method that executes the entire update process."""
        try:
            self.logger.log("Starting the cascade update process...", "header")

            # Step 1: Load the base template
            base_template_path = os.path.join(self.project_root, "index.html")
            base_content = self._read_file_robustly(base_template_path)
            self.logger.log("Base template file loaded successfully.", "success")

            # Step 2: Automatically discover all system folders
            self.logger.log(f"Scanning for system folders in: {self.project_root}", "info")
            systems = [os.path.join(self.project_root, i) for i in os.listdir(self.project_root) if
                       os.path.isdir(os.path.join(self.project_root, i, ".base-system"))]

            if not systems:
                self.logger.log("ERROR: No system folders found to process.", "error")
                return

            for system in systems:
                self.logger.log(f"Found system: '{os.path.basename(system)}'", "success")

            # Step 3: Process each system folder individually
            for system_path in systems:
                try:
                    if not self.is_running:
                        break

                    system_name = os.path.basename(system_path)
                    self.logger.log(f"--- Processing system: '{system_name}' ---", "header")

                    tools_path = os.path.join(system_path, ".base-system", ".tools")

                    # Start with a fresh copy of the base template for this system
                    system_base_content = base_content
                    cfg_content = self._read_tool_file(tools_path, ".config.txt")
                    db_content = self._read_tool_file(tools_path, ".db-secure.txt")

                    # Apply the config and db transformations to create the Polish base
                    system_base_content = self._replace_block(system_base_content, "cfg", cfg_content)
                    system_base_content = self._replace_block(system_base_content, "db", db_content)

                    # Step 4: Find and process all language files for the current system
                    lang_files = [f for f in os.listdir(tools_path) if
                                  os.path.isfile(os.path.join(tools_path, f)) and re.match(r"\.lang-(.+)\.txt", f)]

                    if not lang_files:
                        # If no language files, generate the default (Polish) index.html
                        self._generate_output_file(system_path, "pl", system_base_content, is_default=True)
                    else:
                        # If language files exist, create a version for each one
                        for lang_filename in lang_files:
                            lang_code = re.match(r"\.lang-(.+)\.txt", lang_filename).group(1)
                            lang_content_raw = self._read_tool_file(tools_path, lang_filename)

                            # Apply the language transformation
                            final_content = self._replace_block(system_base_content, "lang", lang_content_raw)
                            self._generate_output_file(system_path, lang_code, final_content)

                except Exception as e:
                    # If one system fails, log the error and continue to the next
                    self.logger.log(f"CRITICAL ERROR while processing system '{os.path.basename(system_path)}': {e}", "error")

        except Exception as e:
            # Catch-all for major errors, like being unable to read the base template
            self.logger.log(f"An unexpected major error occurred: {e}", "error")
        finally:
            if self.is_running:
                self.logger.log("--- Update process finished. ---", "final_success")
            self.on_completion()

    def _generate_output_file(self, system_path, lang_code, content, is_default=False):
        """Generates the final output file in the correct location."""
        if is_default:
            self.logger.log("No language files found, generating default index.html.", "info")

        # Determine the output path based on the language code
        if lang_code == "pl":
            output_path = os.path.join(system_path, "index.html")
        else:
            output_dir = os.path.join(system_path, lang_code)
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, "index.html")

        self._create_backup(output_path)
        self._write_file(output_path, content)

    def _read_tool_file(self, tools_path, filename):
        """Helper function to read files from the .tools directory."""
        path = os.path.join(tools_path, filename)
        if os.path.exists(path):
            return self._read_file_robustly(path)
        return None

    def _create_backup(self, file_path):
        """Creates a backup of a file if it exists."""
        if os.path.exists(file_path):
            backup_path = file_path.replace('.html', '-bck.html')
            if os.path.exists(backup_path):
                os.remove(backup_path)
            shutil.copy2(file_path, backup_path)
            self.logger.log(f"Backup created: {os.path.basename(backup_path)}", "info")

    def _write_file(self, path, content):
        """Writes content to a file using the UTF-8 standard."""
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        self.logger.log(f"File saved: {path}", "success")


# ----------------------------------------------------------------------
# --- SECTION 4: GRAPHICAL USER INTERFACE (FRONTEND)
# ----------------------------------------------------------------------

# Gracefully check if the Tkinter library is available.
GUI_AVAILABLE = False
# Define names as None before the try block to ensure they always exist and avoid linter warnings.
tk = None
scrolledtext = None
messagebox = None
try:
    import tkinter as tk
    from tkinter import ttk, scrolledtext, messagebox

    GUI_AVAILABLE = True
except ImportError:
    # This is not an error; the program is designed to fall back to CLI mode.
    pass

if GUI_AVAILABLE:
    class App(tk.Tk):
        """
        The main GUI application class, inheriting from tk.Tk.
        Responsible for the window's appearance and user interaction.
        """

        def __init__(self, logger_instance):
            super().__init__()
            self.logger = logger_instance
            self.logger.add_handler(self._log_from_thread)

            self.title("VisuDir Cascade Update System v11.0 FINAL")
            self.geometry("900x700")
            self.updater_thread = None

            self.setup_styles()
            self.setup_widgets()
            self.protocol("WM_DELETE_WINDOW", self.on_closing)

        def setup_styles(self):
            """Configures the modern, dark theme for the application."""
            self.style = ttk.Style(self)
            self.style.theme_use('clam')

            # Color and Font Scheme
            self.C_BG = "#2b2b2b"
            self.C_FG = "#dcdcdc"
            self.C_LOG_BG = "#212121"
            self.C_BTN_BG = "#4a4a4a"
            self.C_BTN_FG = "#ffffff"
            self.C_ACCENT = "#e53935"
            self.FONT_UI = ('Segoe UI', 10)
            self.FONT_BTN = ('Segoe UI', 12, 'bold')
            self.FONT_LOG = ("Consolas", 10)

            # Apply styles
            self.configure(bg=self.C_BG)
            self.style.configure('.', background=self.C_BG, foreground=self.C_FG, font=self.FONT_UI)
            self.style.configure('TFrame', background=self.C_BG)
            self.style.configure('TButton', background=self.C_BTN_BG, foreground=self.C_BTN_FG, font=self.FONT_BTN,
                                 borderwidth=0, padding=12)
            self.style.map('TButton', background=[('active', self.C_ACCENT)])

        def setup_widgets(self):
            """Creates and arranges all the UI elements in the window."""
            main_frame = ttk.Frame(self, padding="15")
            main_frame.pack(fill=tk.BOTH, expand=True)

            # Log area with a border for better visual separation
            log_container = ttk.Frame(main_frame, style='TFrame', padding=2)
            log_container.pack(fill=tk.BOTH, expand=True, pady=10)

            self.log_area = scrolledtext.ScrolledText(
                log_container, wrap=tk.WORD, bg=self.C_LOG_BG, fg=self.C_FG,
                font=self.FONT_LOG, relief=tk.FLAT, state='disabled',
                borderwidth=0, padx=10, pady=10
            )
            self.log_area.pack(fill=tk.BOTH, expand=True)

            # Color tags for log text
            self.log_area.tag_config("info", foreground="#87ceeb")
            self.log_area.tag_config("info_italic", foreground="#87ceeb",
                                     font=(self.FONT_LOG[0], self.FONT_LOG[1], "italic"))
            self.log_area.tag_config("success", foreground="#32cd32")
            self.log_area.tag_config("warning", foreground="#ffd700")
            self.log_area.tag_config("error", foreground="#ff6347",
                                     font=(self.FONT_LOG[0], self.FONT_LOG[1], "bold"))
            self.log_area.tag_config("header", foreground="#ffffff", font=(self.FONT_LOG[0], 11, "bold"))
            self.log_area.tag_config("final_success", foreground="#32cd32", font=(self.FONT_LOG[0], 11, "bold"))

            # Button container frame
            button_frame = ttk.Frame(main_frame)
            button_frame.pack(fill=tk.X)
            button_frame.columnconfigure(0, weight=2)
            button_frame.columnconfigure(1, weight=1)

            self.start_button = ttk.Button(button_frame, text="🚀 START UPDATE", command=self.start_update)
            self.start_button.grid(row=0, column=0, padx=(0, 10), sticky="ew")

            self.clear_button = ttk.Button(button_frame, text="Clear Log", command=self.clear_log)
            self.clear_button.grid(row=0, column=1, sticky="ew")

        def _log_from_thread(self, message, level):
            """Thread-safe method to pass a log message from the worker thread to the GUI thread."""
            self.after(0, self._insert_log, message, level)

        def _insert_log(self, message, level):
            """Inserts a new entry into the log area with the appropriate color."""
            self.log_area.configure(state='normal')
            self.log_area.insert(tk.END, f"[{time.strftime('%H:%M:%S')}] {message}\n", level)
            self.log_area.configure(state='disabled')
            self.log_area.yview(tk.END)

        def clear_log(self):
            """Clears the log area."""
            self.log_area.configure(state='normal')
            self.log_area.delete('1.0', tk.END)
            self.log_area.configure(state='disabled')

        def start_update(self):
            """Starts the update process in a separate thread to avoid freezing the GUI."""
            self.clear_log()
            self.start_button.config(state="disabled", text="... WORKING ...")
            updater = CascadeUpdater(PROJECT_ROOT, TAGS, self.logger, completion_callback=self.on_completion)
            self.updater_thread = threading.Thread(target=updater.run_update, daemon=True)
            self.updater_thread.start()

        def on_completion(self):
            """A callback method executed when the worker thread finishes its job."""
            self.after(0, lambda: self.start_button.config(state="normal", text="🚀 START UPDATE"))

        def on_closing(self):
            """Handles the window closing event."""
            if self.updater_thread and self.updater_thread.is_alive():
                messagebox.showinfo("Information",
                                    "The update process is running in the background and will complete.")
            self.destroy()


# ----------------------------------------------------------------------
# --- SECTION 5: MAIN PROGRAM ENTRY POINT
# ----------------------------------------------------------------------

if __name__ == "__main__":
    # Initialize the argument parser for command-line options
    parser = argparse.ArgumentParser(
        description="VisuDir Cascade Update System - An application for updating subsystems.",
        epilog="Run without arguments to open the GUI, or with --cli for console mode."
    )
    parser.add_argument('-c', '--cli', action='store_true', help='Run in command-line mode (without GUI)')
    args = parser.parse_args()

    # Initialize the universal logger, which always writes to a file
    # Renamed global variable to avoid shadowing the Logger's parameter.
    DEFAULT_LOG_PATH = os.path.join(SCRIPT_DIR, '.update-systems.log')
    logger = Logger(DEFAULT_LOG_PATH)

    # Decide which mode to run
    if args.cli or not GUI_AVAILABLE:
        # --- CLI Mode Execution ---
        if not GUI_AVAILABLE and not args.cli:
            print(">>> Tkinter library not found. Forcing Command-Line Interface (CLI) mode.")


        def console_handler(message, level):
            """A handler for printing color-coded logs to the console using ANSI escape codes."""
            colors = {
                "info": "\033[94m", "info_italic": "\033[94m", "success": "\033[92m",
                "warning": "\033[93m", "error": "\033[91m", "header": "\033[1m",
                "final_success": "\033[92m\033[1m", "reset": "\033[0m"
            }
            color = colors.get(level, colors["info"])
            print(f"{color}[{time.strftime('%H:%M:%S')}] {message}{colors['reset']}")


        logger.add_handler(console_handler)
        updater = CascadeUpdater(PROJECT_ROOT, TAGS, logger)
        updater.run_update()
    else:
        # --- GUI Mode Execution ---
        # This code path is only reachable if App is defined, satisfying the linter.
        app = App(logger)
        app.mainloop()

    logger.close()

# Koniec skryptu ".\base-system\.tools\.update-systems.py"