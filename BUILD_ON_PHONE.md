# Build Trippo APK on Your Android Phone with Termux

Complete step-by-step guide to build the app directly on your S24 Ultra.

## Requirements
- Android phone (S24 Ultra ✓)
- At least 4GB free storage
- Good internet connection
- Charger (keep phone plugged in!)

## Part 1: Install Termux

### Step 1.1: Install F-Droid
The Play Store version of Termux is outdated and broken. You MUST use F-Droid.

1. Open browser on your phone
2. Go to: **https://f-droid.org/**
3. Tap "Download F-Droid"
4. Install the APK (you may need to allow "Install from unknown sources")

### Step 1.2: Install Termux from F-Droid
1. Open F-Droid app
2. Search for "Termux"
3. Install **Termux** (NOT Termux:API or others, just the main app)
4. Wait for installation to complete

## Part 2: Set Up Build Environment

Open Termux and run these commands one by one:

### Step 2.1: Update packages
```bash
pkg update && pkg upgrade -y
```
Press Enter/Y when asked. This takes 2-5 minutes.

### Step 2.2: Install required tools
```bash
pkg install -y git nodejs-lts openjdk-17 wget
```
This takes 5-10 minutes.

### Step 2.3: Verify installation
```bash
node --version
java -version
```
You should see version numbers for both.

## Part 3: Get Your Project Files

You have two options:

### Option A: From GitHub (if you pushed your code)
```bash
cd ~
git clone https://github.com/[your-username]/[your-repo].git trippo
cd trippo
```

### Option B: Download Project ZIP
1. From your work PC, zip the entire project folder
2. Upload to Google Drive/Dropbox/email yourself
3. Download on your phone
4. In Termux:
```bash
cd ~
# Install unzip if needed
pkg install unzip

# Move the downloaded zip to Termux (adjust path as needed)
cp /storage/emulated/0/Download/trippo.zip ~
unzip trippo.zip
cd trippo
```

### Option C: Transfer via USB
1. Connect phone to PC via USB
2. Copy project folder to phone storage
3. In Termux, access it:
```bash
# Grant storage permission first
termux-setup-storage
# Then access your files
cd /storage/emulated/0/[folder-name]
```

## Part 4: Build the APK

### Step 4.1: Install dependencies
```bash
npm install
```
This takes 10-15 minutes. Lots of warnings are normal, just wait.

### Step 4.2: Build the APK
```bash
cd android
./gradlew assembleRelease
```

**IMPORTANT:** This takes 30-60 minutes on a phone. Keep it:
- ✅ Plugged into charger
- ✅ Connected to WiFi
- ✅ Don't close Termux
- ✅ Screen can turn off (it's ok)

You'll see a LOT of text. Just let it run. Look for "BUILD SUCCESSFUL" at the end.

## Part 5: Get Your APK

### Step 5.1: Find the APK
```bash
ls -lh app/build/outputs/apk/release/
```

You should see `app-release.apk`

### Step 5.2: Copy to Downloads folder
```bash
cp app/build/outputs/apk/release/app-release.apk /storage/emulated/0/Download/Trippo.apk
```

### Step 5.3: Install it
1. Open "Files" app on your phone
2. Go to "Downloads"
3. Tap "Trippo.apk"
4. Install it

## Troubleshooting

### "Permission denied" when running gradlew
```bash
chmod +x ./gradlew
```

### "JAVA_HOME not found"
```bash
export JAVA_HOME=/data/data/com.termux/files/usr/opt/openjdk
./gradlew assembleRelease
```

### Out of memory / Build fails
```bash
# Edit gradle.properties to use less memory
echo "org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m" >> gradle.properties
./gradlew assembleRelease --no-daemon
```

### Can't access storage
```bash
termux-setup-storage
# Then grant permission when phone asks
```

### Build gets stuck
- Wait at least 5 minutes
- Check if phone is too hot (let it cool down)
- Try adding `--info` flag to see progress:
```bash
./gradlew assembleRelease --info
```

## Build Debug APK (Faster, for testing)

If you just want to test quickly:
```bash
cd android
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk /storage/emulated/0/Download/Trippo-debug.apk
```

This is faster (15-20 min) but creates a larger APK.

## Time Estimates
- Setup Termux: 10-15 min
- Get project files: 5-30 min (depends on method)
- npm install: 10-15 min
- Build APK: 30-60 min
- **Total: 1-2 hours**

## What to Do While Building
- Keep phone plugged in
- Don't close Termux (minimize is ok)
- You can use other apps
- Check back every 10-15 min

## After Successful Build

You'll have a release APK that:
- ✅ Works on any Android device
- ✅ Can be shared with others
- ✅ Can be uploaded to Google Play
- ✅ Is properly signed and optimized

## Next Steps

1. **Test the APK thoroughly** on your phone
2. **Share it** with others for testing via Google Drive, email, etc.
3. **Upload to Google Play** when ready (see DEPLOY_TO_PLAYSTORE.md)

## Tips
- Do this when you have 2-3 hours free
- Keep charger nearby
- Use WiFi (uses a lot of data)
- First build is slowest, rebuilds are faster
- Save the APK file - you can share it with anyone
