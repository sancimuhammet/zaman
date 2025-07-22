# GitHub Upload Talimatları - Vercel Fix

## 📦 Yüklenecek Dosyalar

### ✅ Hazırlanan Dosyalar:
1. **vercel.json** - Vercel deployment konfigürasyonu
2. **api/simulations.ts** - API endpoint (Vercel functions)
3. **api/simulations/[id].ts** - Tekil simulation endpoint
4. **package-vercel.json** - Vercel için düzenlenmiş package.json
5. **hayat-simulatoru-export.tar.gz** - Tüm proje kodu

## 🚀 GitHub Upload Adımları:

### 1. Repository'e Git:
- **URL:** github.com/sancimuhammet/hayat-simulatoru-app
- **"Add file" → "Upload files"** tıkla

### 2. Dosyaları Yükle:
```
✅ vercel.json
✅ api/simulations.ts  
✅ api/simulations/[id].ts
✅ package-vercel.json (package.json olarak)
✅ hayat-simulatoru-export.tar.gz
```

### 3. Commit Message:
```
Vercel deployment fix + API endpoints

- Added vercel.json configuration
- Created Vercel API functions
- Fixed package.json for Vercel
- Complete project code included
```

## ⚙️ Vercel Ayarları:

### Build Settings:
- **Framework:** None
- **Build Command:** `vite build`  
- **Output Directory:** `dist/public`
- **Install Command:** `npm install`

### Environment Variables:
```
GEMINI_API_KEY=your_gemini_key_here
FIREBASE_PROJECT_ID=zaman-9903a  
NODE_ENV=production
```

### 4. Redeploy:
- Vercel Dashboard → Deployments
- **"Redeploy"** tıkla

## 🎯 Sonuç:
✅ React frontend çalışacak
✅ Firebase entegrasyonu çalışacak  
✅ Gemini AI yanıtlar verecek
✅ Hayat simülatörü tamamen fonksiyonel

Bu dosyaları GitHub'a yükledikten sonra Vercel otomatik deploy edecek.