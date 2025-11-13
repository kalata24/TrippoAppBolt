# Build APK on Windows - Simple Instructions

## What You Need
1. Java JDK 17 installed
2. Android SDK installed (from Android Studio)
3. Environment variables set:
   - `ANDROID_HOME` pointing to your Android SDK
   - `JAVA_HOME` pointing to your JDK

## Step 1: Open Command Prompt in Project Folder
Navigate to your project folder in cmd.exe

## Step 2: Build the APK

Run this command:
```
cd android
gradlew assembleRelease
```

Or if that doesn't work, try:
```
cd android
gradlew.bat assembleRelease
```

## Step 3: Find Your APK

After the build completes, your APK will be at:
```
android\app\build\outputs\apk\release\app-release.apk
```

## Expected Build Time
- First build: 5-15 minutes
- Gradle will download dependencies
- Metro bundler will compile JavaScript (6 MB)
- APK final size: ~25-35 MB

## If Build Fails

### Java Not Found
Install Java JDK 17 from: https://adoptium.net/

### ANDROID_HOME Error
Set environment variable:
```
set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
```

### Gradle Issues
Try clean build:
```
cd android
gradlew clean
gradlew assembleRelease
```

## Build Debug APK (Faster, Better Logs)
```
cd android
gradlew assembleDebug
```
Output: `android\app\build\outputs\apk\debug\app-debug.apk`

## Install on Phone
1. Copy APK to your S24 Ultra
2. Enable "Install from Unknown Sources" in settings
3. Open APK file and install

Or use ADB:
```
adb install android\app\build\outputs\apk\release\app-release.apk
```
