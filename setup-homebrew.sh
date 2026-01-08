#!/bin/bash

echo "🍺 Installing Redis and DragonflyDB via Homebrew..."

# Install Redis
echo "📦 Installing Redis..."
brew install redis

# Install DragonflyDB
echo "📦 Installing DragonflyDB..."
brew tap dragonflydb/dragonfly
brew install dragonfly

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the services, run these in separate terminal tabs:"
echo ""
echo "  Tab 1 (Redis):      redis-server --port 6379"
echo "  Tab 2 (Dragonfly):  dragonfly --port 6380"
echo ""
echo "Then run the benchmark:"
echo "  npm run benchmark"

