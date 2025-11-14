# Cloud Build Guide for Trippo APK

## Quick Start (Choose One Platform)

### Option 1: Replit (Recommended - Easiest)

1. Go to https://replit.com
2. Sign up/login (free account works)
3. Click "Create Repl"
4. Choose "Import from GitHub"
5. Paste this repo URL or upload the project as a ZIP
6. Once loaded, open the Shell tab
7. Run these commands:

```bash
export EXPO_TOKEN='X10UpFsUpw7pIcgOXaQ7TIDjMBnIzjxLyupvptTL'
./build-apk.sh
```

8. When prompted "Generate new Keystore?" → Type `y`
9. Wait ~15 minutes
10. Get your APK download link!

---

### Option 2: GitHub Codespaces

1. Go to https://github.com
2. Create a new repository (can be private)
3. Upload this project
4. Click "Code" → "Codespaces" → "Create codespace"
5. In the terminal:

```bash
export EXPO_TOKEN='X10UpFsUpw7pIcgOXaQ7TIDjMBnIzjxLyupvptTL'
./build-apk.sh
```

6. When prompted "Generate new Keystore?" → Type `y`
7. Wait ~15 minutes
8. Get your APK download link!

---

### Option 3: Gitpod

1. Go to https://gitpod.io
2. Sign up/login
3. Create a new workspace from your uploaded project
4. In the terminal:

```bash
export EXPO_TOKEN='X10UpFsUpw7pIcgOXaQ7TIDjMBnIzjxLyupvptTL'
./build-apk.sh
```

5. When prompted "Generate new Keystore?" → Type `y`
6. Wait ~15 minutes
7. Get your APK download link!

---

### Option 4: StackBlitz (Terminal Access Required)

1. Go to https://stackblitz.com
2. Import this project
3. Open terminal
4. Run the same commands as above

---

## What Happens During Build

1. ✅ Script installs dependencies
2. ✅ Initializes git if needed
3. ❓ **EAS asks: "Generate new Keystore?"** → You type `y`
4. ⏳ Build runs on Expo servers (~15 minutes)
5. 🎉 You get a download link for your APK

---

## Your Build Configuration

- **Project:** Trippo (trippoapp)
- **Platform:** Android
- **Build Type:** APK (direct install)
- **Profile:** Preview
- **Expo Account:** Connected via token

---

## After Build Completes

You'll see output like:

```
✔ Build finished successfully
Download: https://expo.dev/artifacts/eas/[id]/build-[hash].apk
```

Copy that link and download your APK!

---

## Troubleshooting

**"EXPO_TOKEN not found"**
- Make sure you ran: `export EXPO_TOKEN='X10UpFsUpw7pIcgOXaQ7TIDjMBnIzjxLyupvptTL'`

**"npm install failed"**
- Run: `npm install --legacy-peer-deps`

**"Build failed"**
- Check you typed `y` when asked about Keystore
- Make sure you have stable internet connection

---

## Need Help?

The build script (`build-apk.sh`) handles everything automatically. Just:
1. Set the token
2. Run the script
3. Type `y` when asked
4. Wait for your APK

That's it! 🚀
