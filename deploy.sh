#!/bin/bash

# WeBook Quick Start - Push to GitHub

echo "🚀 WeBook Deployment Helper"
echo "============================"
echo ""

# Check if git credentials work
echo "Testing git access..."
if git push --dry-run origin main 2>/dev/null; then
    echo "✅ Git credentials OK, pushing..."
    git push origin main
    echo "✅ Code pushed to GitHub!"
else
    echo "❌ Git credentials failed"
    echo ""
    echo "Use GitHub Web Upload instead:"
    echo "1. Go to: https://github.com/Llander15/WeBook"
    echo "2. Click 'Upload files'"
    echo "3. Drag these files:"
    echo "   - server.js"
    echo "   - Procfile"
    echo "   - .env"
    echo "   - package.json"
    echo "   - RAILWAY_DEPLOY.md"
    echo ""
    exit 1
fi

echo ""
echo "📝 Next Steps:"
echo "1. Go to https://railway.app"
echo "2. Create new project from GitHub"
echo "3. Select WeBook repo"
echo "4. Add MySQL service"
echo "5. Configure environment variables"
echo ""
echo "See RAILWAY_DEPLOY.md for detailed instructions"
