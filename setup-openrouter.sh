#!/bin/bash
# Quick setup script for OpenRouter + DeepSeek integration
# Run this to verify everything is working

echo "🔍 Checking OpenRouter + DeepSeek Integration..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi
echo "✅ Node.js found: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✅ npm found: $(npm -v)"

# Check .env file
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    echo "   Creating from .env.example..."
    cp .env.example .env
fi
echo "✅ .env file exists"

# Check for API key
if grep -q "OPENROUTER_API_KEY=$" .env; then
    echo "⚠️  OPENROUTER_API_KEY is empty"
    echo "   Get your key at: https://openrouter.ai/keys"
    echo "   Then update .env with your key"
else
    echo "✅ API key configured in .env"
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ node_modules found"
fi

# Check core files
echo ""
echo "📂 Integration files:"
[ -f "lib/openrouter-client.js" ] && echo "  ✅ lib/openrouter-client.js"
[ -f "examples/example-chat.js" ] && echo "  ✅ examples/example-chat.js"
[ -f "examples/example-design-brief.js" ] && echo "  ✅ examples/example-design-brief.js"
[ -f "package.json" ] && echo "  ✅ package.json"

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Get API key: https://openrouter.ai/keys"
echo "  2. Add to .env: OPENROUTER_API_KEY=your_key_here"
echo "  3. Test: npm run example:chat"
echo ""
echo "📖 Documentation:"
echo "  - README_OPENROUTER.md (start here)"
echo "  - OPENROUTER_SETUP.md (detailed guide)"
echo "  - OPENROUTER_INTEGRATION_QUICK_START.md (quick reference)"
