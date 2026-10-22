# Murgha Runner 3D

Browser 3D endless runner (Three.js r128, bundled in vendor/). Works on PC, Android, iPhone. Installable as a PWA, works offline after first load.

## Local run
- Quick: double-click index.html (game works; offline install needs http).
- Proper: `python3 -m http.server 8000` in this folder, open http://localhost:8000

## Go live (free)
- **Netlify Drop**: open app.netlify.com/drop and drag this whole folder. You get a live https link.
- **GitHub Pages**: push these files to a repo, Settings > Pages > Deploy from branch > main / root.
- **Vercel / Cloudflare Pages**: import the repo, no build command, output directory = root.

## Install on phone
Open the live link in Chrome (Android) > menu > Install app / Add to Home screen. iPhone: Safari > Share > Add to Home Screen.

## Android APK (optional)
Use pwabuilder.com with your live link to generate an Android package.

## Updating
After changing any file, bump `C='mr3d-v1'` in sw.js (e.g. v2) so users get the new version.

## Files
index.html, style.css, src/main.js (game), sw.js, manifest.json, vendor/three.min.js
