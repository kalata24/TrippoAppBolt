# Building Trippo APK via Command Line

## Prerequisites
Make sure you have:
- Node.js installed
- Java JDK 17 or higher
- Android SDK (via Android Studio or standalone)

## Build Commands

### Option 1: Using Expo CLI (Recommended)
```bash
# Install dependencies
npm install

# Build APK
npx expo run:android --variant release
```

### Option 2: Using Gradle Directly
```bash
# Clean previous build
cd android
./gradlew clean

# Build release APK
./gradlew assembleRelease

# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

### Option 3: Build debug APK (better error messages)
```bash
cd android
./gradlew assembleDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

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
