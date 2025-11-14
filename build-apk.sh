#!/bin/bash

echo "🚀 Trippo APK Build Script"
echo "=========================="
echo ""

# Check if EXPO_TOKEN is set
if [ -z "$EXPO_TOKEN" ]; then
  echo "❌ EXPO_TOKEN not found!"
  echo ""
  echo "Please set your Expo token:"
  echo "export EXPO_TOKEN='X10UpFsUpw7pIcgOXaQ7TIDjMBnIzjxLyupvptTL'"
  echo ""
  exit 1
fi

echo "✅ Expo token found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
  echo "🔧 Initializing git repository..."
  git init
  git config user.email "build@trippo.app"
  git config user.name "Trippo Builder"
  git add .
  git commit -m "Initial commit"
  echo "✅ Git initialized"
  echo ""
fi

# Start the build
echo "🏗️  Starting EAS Build..."
echo ""
echo "When prompted 'Would you like to generate a new Keystore?'"
echo "Type: y"
echo ""
echo "Starting build in 3 seconds..."
sleep 3

npx eas-cli build --platform android --profile preview

echo ""
echo "✅ Build process complete!"
echo "Your APK download link will appear above."
