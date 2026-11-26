#!/bin/bash
# Akshar PrintShop Pro One-Click Website Update & Cloud Deploy
PROJECT_DIR="/Users/akshar/Documents/antigravity/PrintShop Pro"
cd "$PROJECT_DIR" || exit 1

echo "============================================================"
echo "    🖨️ AKSHAR PRINTSHOP PRO ONE-CLICK UPDATE & CLOUD DEPLOY  "
echo "============================================================"
echo ""
echo "📁 Project Directory: $PROJECT_DIR"
echo "🐙 GitHub Repo: https://github.com/Pixartware/PrintShop-Pro.git"
echo "☁️  Vercel Web: printshop"
echo ""

# 1. Run Node sync agent to mirror images and update product DB if folder exists
CATALOG_PATH="/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Akshar PrintShop Pro"
if [ -d "$CATALOG_PATH" ]; then
  echo "📦 Step 1: Scanning Studio Products folder: $CATALOG_PATH..."
  node scripts/sync-agent.js
else
  echo "ℹ️  Studio drive folder not mounted. Skipping local folder scan."
fi

# 2. Rebuild the frontend
echo ""
echo "🔨 Step 2: Rebuilding frontend production bundle..."
npm run build

# 3. Commit and push any updated catalog images and products to GitHub
echo ""
echo "🚀 Step 3: Pushing latest code to GitHub (Pixartware/PrintShop-Pro)..."
# Ensure remote is present
git remote get-url origin >/dev/null 2>&1 || git remote add origin https://github.com/Pixartware/PrintShop-Pro.git
git add -A
if git diff-index --quiet HEAD --; then
  echo "✅ Git is already up to date. No new file changes."
else
  git commit -m "Catalog update: $(date '+%Y-%m-%d %H:%M:%S')"
  git push origin main
  echo "✅ Pushed to GitHub repository successfully!"
fi

echo ""
echo "============================================================"
echo "   🎉 UPDATE COMPLETE! AKSHAR PRINTSHOP PRO IS SYNCHRONIZED  "
echo "   🌐 https://github.com/Pixartware/PrintShop-Pro          "
echo "============================================================"
echo "Press any key to close this window..."
read -n 1 -s
