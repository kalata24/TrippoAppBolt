# Build Your APK Using Cloud IDEs

## Option 1: GitHub Codespaces (RECOMMENDED - Free tier available)

1. **Push project to GitHub:**
   - Create a new GitHub repository
   - Upload all project files

2. **Open in Codespaces:**
   - Click "Code" → "Codespaces" → "Create codespace"
   - Wait for environment to load

3. **Build the APK:**
```bash
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

4. **Download APK:**
   - Find it at: `android/app/build/outputs/apk/release/app-release.apk`
   - Right-click → Download

**Pros:** Free tier includes 60 hours/month, has all tools pre-installed

---

## Option 2: Gitpod (Easy Setup)

1. **Push to GitHub/GitLab**

2. **Open in Gitpod:**
   - Go to: `https://gitpod.io/#your-repo-url`

3. **Build:**
```bash
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

**Pros:** 50 hours/month free, fast startup

---

## Option 3: Replit (Simplest UI)

1. **Import GitHub repo to Replit**

2. **Install Java 17:**
```bash
nix-env -iA nixpkgs.jdk17
```

3. **Build:**
```bash
npm install
npx expo prebuild --platform android
cd android
chmod +x gradlew
./gradlew assembleRelease
```

**Note:** Replit might be slower for Android builds

---

## Option 4: Local Android Studio (If You Have It)

1. **Download the project**

2. **Open Android Studio:**
   - First run: `npx expo prebuild --platform android` in terminal
   - Open the `android` folder in Android Studio

3. **Build:**
   - Build → Generate Signed Bundle/APK → APK
   - Or use terminal: `./gradlew assembleRelease`

---

## What Each Environment Needs

All environments need:
- Node.js (16+)
- Java JDK 17
- Android SDK (automatically downloaded by Gradle)

**GitHub Codespaces and Gitpod** have these pre-configured!

---

## Recommended: GitHub Codespaces

**Why?**
- ✅ Free tier (60 hours/month)
- ✅ All tools pre-installed
- ✅ Fast performance
- ✅ Easy file download
- ✅ No local setup needed

**Steps:**
1. Push this project to GitHub
2. Open in Codespaces
3. Run build commands
4. Download your APK

This takes ~10-15 minutes total (including build time).
