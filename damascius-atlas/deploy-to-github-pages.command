#!/bin/zsh
set -euo pipefail
# Run this inside the local Git repository that publishes your GitHub Pages site.
# Change TARGET to the desired public subdirectory.
TARGET="damascius-atlas"
SOURCE="$HOME/Downloads/damascius-atlas-public-v1.1.0"
[[ -d "$SOURCE" ]] || { echo "Missing folder: $SOURCE"; exit 1; }
rm -rf "$TARGET"
cp -R "$SOURCE" "$TARGET"
rm -f "$TARGET/Damascius-History.pdf"
git add "$TARGET"
git status --short
echo "Review the staged files. Then commit and push manually."
