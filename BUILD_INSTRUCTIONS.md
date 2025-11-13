# Building Trippo APK via Command Line

## Prerequisites
Make sure you have:
- Node.js installed
- Java JDK 17 or higher
- Android SDK (via Android Studio or standalone)

## Build Commands

**IMPORTANT:** When you run the Gradle build, it automatically:
1. Bundles all your JavaScript code using Metro bundler
2. Includes all assets and images
3. Embeds environment variables from app.config.js
4. Creates a standalone APK with everything needed

### Option 1: Using npm scripts (Easiest)
```bash
# Install dependencies first
npm install

# Build release APK (optimized, smaller size)
npm run build:apk

# OR build debug APK (includes logging, easier to debug)
npm run build:apk:debug
```

### Option 2: Using Gradle Directly
```bash
# First ensure dependencies are installed
npm install

# Then build release APK
cd android
./gradlew assembleRelease

# OR build debug APK
./gradlew assembleDebug
```

### Option 3: Using Expo CLI
```bash
# This handles everything automatically
npx expo run:android --variant release
```

## APK Locations
- **Release APK:** `android/app/build/outputs/apk/release/app-release.apk`
- **Debug APK:** `android/app/build/outputs/apk/debug/app-debug.apk`

## What's Included in the APK?
✅ All JavaScript code (~6 MB bundled)
✅ All assets and images
✅ Supabase configuration from app.config.js
✅ Native Android libraries
✅ React Native runtime
✅ Total APK size: ~25-35 MB (typical for React Native apps)

## What Was Fixed

### 1. Environment Variables
- Removed app.json (conflicted with app.config.js)
- Created app.config.js with hardcoded Supabase credentials as fallback
- Updated supabase.ts to use expo-constants
- Added validation to catch missing env vars early

### 2. Android Compatibility Fixes
- Fixed useFrameworkReady hook to only run on web platform
- Updated permissions for Android 13+ (S24 Ultra compatibility)
- Added proper error handling in auth context

### 3. Build Configuration
- Environment variables are now embedded via app.config.js
- Works with both debug and release builds
- No need for Android Studio - command line only

## Testing on Your S24 Ultra

After building:
```bash
# Install APK
adb install android/app/build/outputs/apk/release/app-release.apk

# View logs if it crashes
adb logcat | grep -E "trippo|Trippo|ReactNative|Expo"
```

## Troubleshooting

If the app still crashes:
1. Try the debug build first (has better error messages)
2. Check logs with adb logcat
3. Ensure Supabase URL is reachable from your device
4. Verify all permissions are granted in device settings
