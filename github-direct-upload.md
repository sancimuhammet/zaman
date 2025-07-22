# GitHub Direct Upload - Vercel Fix

## 🚨 Vercel Görünmeme Sorunu Çözümü

### Sorun:
Fullstack app, Vercel'de static site olarak deploy edilmiş
Backend API'ler çalışmıyor, sayfa boş görünüyor

### ✅ Çözüm Dosyaları Hazır:
1. **vercel.json** - Vercel konfigürasyonu ✅
2. **build-vercel.sh** - Build scripti ✅

### 📋 GitHub'a Upload Adımları:

**1. Repository'e Git:**
- github.com/sancimuhammet/hayat-simulatoru-app

**2. Şu Dosyaları Ekle:**
```
vercel.json
build-vercel.sh  
hayat-simulatoru-export.tar.gz (tüm proje)
```

**3. Vercel Re-Deploy:**
- Vercel Dashboard'da project'i aç
- Settings → General
- Build Command: `vite build`
- Output Directory: `dist/public`
- Install Command: `npm install`
- Framework Preset: `None`

**4. Environment Variables:**
```
GEMINI_API_KEY=your_key_here
FIREBASE_PROJECT_ID=zaman-9903a
NODE_ENV=production
```

**5. Re-deploy:**
- Deployments sekmesinde "Redeploy" tık

### 🎯 Sonuç:
✅ Frontend çalışacak
✅ API endpoints erişilebilir olacak  
✅ Firebase entegrasyonu çalışacak
✅ Türkçe arayüz görünecek

Bu dosyalar GitHub'a yüklendikten sonra Vercel otomatik re-deploy edecek.