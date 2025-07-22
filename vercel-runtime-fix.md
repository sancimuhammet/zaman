# Vercel Runtime Error Fix

## Hata:
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`
```

## Çözüm: 3 Farklı Vercel Config

### 1. vercel.json (Düzeltilmiş)
- Runtime: `@vercel/node@3.0.21`
- API functions için doğru format

### 2. vercel-simple.json (Basit)
- Builds array kullanımı
- Static build + Node functions

### 3. vercel-minimal.json (En Basit)
- Sadece build komutları
- Runtime belirtilmemiş

## GitHub Upload:
1. Repository: github.com/sancimuhammet/hayatdeneme
2. Dosyalar: vercel-runtime-fix.tar.gz
3. vercel-minimal.json → vercel.json olarak yükle

## Vercel Ayarları:
- Build Command: `cd client && npm run build`
- Output Directory: `client/dist`
- Framework: None

Bu 3 config'den biri çalışacak.