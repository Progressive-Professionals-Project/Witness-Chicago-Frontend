#!/bin/bash
# Simple deployment script for Witness Chicago
# Only deploys essential files, not documentation

echo "Deploying Witness Chicago..."

# Files to deploy (no .md documentation files)
FILES=(
    "index.html"
    "styles.css" 
    "app.js"
    "manifest.json"
    "robots.txt"
    "security.txt"
    "sitemap.xml"
    ".htaccess"
)

# Create deployment directory
mkdir -p dist

# Copy only essential files
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" dist/
        echo "✅ Copied $file"
    else
        echo "⚠️  Warning: $file not found"
    fi
done

# Copy assets directory if it exists
if [ -d "assets" ]; then
    cp -r assets dist/
    echo "✅ Copied assets directory"
else
    echo "⚠️  Warning: assets directory not found"
fi

echo ""
echo "🎉 Deployment ready in ./dist/"
echo "📁 Upload the contents of ./dist/ to your web server"
echo ""
echo "Files ready for deployment:"
ls -la dist/
echo ""
echo "Assets directory contents:"
ls -la dist/assets/ 2>/dev/null || echo "No assets directory found"