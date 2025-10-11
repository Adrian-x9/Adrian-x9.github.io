# dbScan v1.0.0 (C) 2025-09-18 by Adrian Ulbrych | All Rights Reserved
# Folder scanner, results to file > .db.txt without sensitive data like full paths

$lines = @(cmd /c 'dir "..\files" /-C')
$lines | Select-Object -Skip 7 | Select-Object -SkipLast 2 > ./.db-secure.txt
