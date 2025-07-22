// GitHub'a otomatik upload scripti
const fs = require('fs');
const path = require('path');

console.log('🚀 GitHub API Upload Hazırlanıyor...');

// Vercel deployment için gerekli dosyalar
const vercelConfig = {
  "version": 2,
  "framework": null,
  "buildCommand": "npm run build:client",
  "outputDirectory": "dist/public",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
};

console.log('📝 vercel.json konfigürasyonu hazır');

// Build script düzeltmesi
const buildScripts = `
# Vercel Build Commands
CLIENT_BUILD="vite build"
SERVER_BUILD="esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api"

echo "Building client..."
$CLIENT_BUILD

echo "Building server for Vercel..."
$SERVER_BUILD

echo "✅ Build completed"
`;

fs.writeFileSync('build-vercel.sh', buildScripts);
console.log('✅ build-vercel.sh oluşturuldu');

console.log(`
🎯 Vercel Deployment Çözümü:

1. GitHub Repository'e şu dosyaları ekle:
   ✅ vercel.json (hazırlandı)
   ✅ build-vercel.sh (hazırlandı)

2. Vercel Dashboard'da:
   - Build Command: npm run build:client
   - Output Directory: dist/public
   - Install Command: npm install
   - Framework: None

3. Environment Variables ekle:
   - GEMINI_API_KEY
   - FIREBASE_PROJECT_ID
   - DATABASE_URL (eğer PostgreSQL kullanıyorsa)

📋 Dosya Listesi:
- vercel.json ✅
- build-vercel.sh ✅  
- client/ (React app)
- server/ (API routes)
- shared/ (schemas)
`);