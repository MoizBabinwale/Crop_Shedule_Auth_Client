#!/bin/bash
# Copy script for moving restored changes back to main project directory

# SOURCE (worktree)
SOURCE="d:\New Project Crop\Crop_Shedule.worktrees\copilot-worktree-2026-05-24T10-50-23"

# DESTINATION (main project)
DEST="d:\New Project Crop\Crop_Shedule"

echo "========================================="
echo "Copying Google OAuth & Calendar Changes"
echo "========================================="
echo ""

# Copy individual modified files
echo "📋 Copying modified files..."

# Config changes
copy "$SOURCE\package.json" "$DEST\package.json"
echo "✓ package.json"

copy "$SOURCE\public\index.html" "$DEST\public\index.html"
echo "✓ public\index.html"

# Context changes
copy "$SOURCE\src\context\AuthContext.js" "$DEST\src\context\AuthContext.js"
echo "✓ src\context\AuthContext.js"

# Page changes
copy "$SOURCE\src\pages\AuthPage.jsx" "$DEST\src\pages\AuthPage.jsx"
echo "✓ src\pages\AuthPage.jsx"

copy "$SOURCE\src\pages\CreateQuotation.js" "$DEST\src\pages\CreateQuotation.js"
echo "✓ src\pages\CreateQuotation.js"

# New utility file
copy "$SOURCE\src\utils\googleCalendar.js" "$DEST\src\utils\googleCalendar.js"
echo "✓ src\utils\googleCalendar.js (NEW)"

# Documentation
copy "$SOURCE\GOOGLE_OAUTH_CALENDAR_SYNC_RESTORE.md" "$DEST\GOOGLE_OAUTH_CALENDAR_SYNC_RESTORE.md"
echo "✓ GOOGLE_OAUTH_CALENDAR_SYNC_RESTORE.md (NEW)"

echo ""
echo "========================================="
echo "✅ All changes copied successfully!"
echo "========================================="
echo ""
echo "📝 Next steps:"
echo "1. cd to your main project directory"
echo "2. Run: npm install"
echo "3. Add REACT_APP_GOOGLE_CLIENT_ID to .env"
echo "4. Run: npm start"
echo ""
