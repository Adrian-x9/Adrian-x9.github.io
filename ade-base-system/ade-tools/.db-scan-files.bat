@echo off 
cls
echo.
echo   .-----------------------------------------------------------.
echo   !                                                           !
echo   !                       dbScan v1.0.0                       !
echo   !              (C) 2025-09-18 by Adrian Ulbrych             !
echo   !                    All Rights Reserved                    !
echo   !                                                           !
echo   !   -----------------------------------------------------   !
echo   !                                                           !
echo   !    Scans a folder and saves the results:                  !
echo   !          to '.files-db-secure.txt'                        !
echo   !       or to '.files-db.unsecure.txt' (with full paths)    !
echo   !                                                           !
echo   '-----------------------------------------------------------'
echo.

:Menu
echo Choose an option:
echo 1. Secure mode (PowerShell script, no full paths)
echo 2. Unsecure mode (simple 'dir' command with full paths
echo.

set /p choice=Your choice (1/2): 

:: Go to label
if "%choice%"=="1" goto Option1
if "%choice%"=="2" goto Option2

:: Bad choice
echo.
echo Invalid option. Please choose again.
echo.
goto Menu

:Option1
REM Starting the PowerShell script without Execution Policy
echo.
powershell.exe -ExecutionPolicy Bypass -File ".\.db-scan-files.ps1"
goto End

:Option2
echo.
dir "..\files" /-C > .\.db-unsecure.txt
goto End

:End
echo ==============================================================
echo ::: Operation completed.
echo ==============================================================
echo.

REM Uncomment to Pause
REM pause