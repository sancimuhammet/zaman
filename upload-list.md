# GitHub Upload Dosya Listesi

## Vercel Runtime Fix İçin Yüklenecek Dosyalar:

### Ana Dosya:
**vercel-minimal.json** (121 bytes)
- GitHub'a yükledikten sonra **vercel.json** olarak yeniden adlandır

### İçerik:
```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install"
}
```

### Alternatif (Toplu):
**vercel-runtime-fix.tar.gz** - Tüm çözümler içinde

## Upload Adımları:
1. github.com/sancimuhammet/hayatdeneme
2. Eski vercel.json'u sil
3. vercel-minimal.json yükle
4. vercel.json olarak yeniden adlandır
5. Vercel'de redeploy

Bu tek dosya runtime hatasını çözecek.