# Vercel Sorunu - Hızlı Git Çözümü

## 🚨 Durum: Vercel'de sayfa görünmüyor
**Sebep:** Fullstack app static site olarak deploy edildi

## ✅ Çözüm Hazırlandı:

### 📁 Hazır Dosyalar:
- **vercel.json** ✅ - Vercel konfigürasyonu 
- **github-direct-upload.md** ✅ - Adım adım rehber
- **hayat-simulatoru-export.tar.gz** ✅ - Tüm proje kodu

### 🚀 GitHub Upload:
**1. Repository:** github.com/sancimuhammet/hayat-simulatoru-app
**2. Upload Files:**
```
- vercel.json (Vercel config)
- hayat-simulatoru-export.tar.gz (proje kodu)
```

### ⚙️ Vercel Ayarları:
**Settings → General:**
- Build Command: `vite build`
- Output Directory: `dist/public`
- Framework: `None`

**Environment Variables:**
- `GEMINI_API_KEY` = (sizin key)
- `FIREBASE_PROJECT_ID` = zaman-9903a

**Sonra:** Deployments → Redeploy

### 🎯 Sonuç:
✅ React frontend çalışacak  
✅ API endpoints çalışacak
✅ Firebase connection çalışacak
✅ Hayat simülatörü tamamen çalışır hale gelecek

## Upload yapar mısınız?
Repository: github.com/sancimuhammet/hayat-simulatoru-app