#!/bin/bash
# Hızlı export scripti

echo "📦 Hayat Simülatörü Export Script"
echo "================================="

# Ana dosyaları kontrol et
echo "📋 Ana dosyalar kontrol ediliyor..."
for file in package.json README.md tsconfig.json; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file bulunamadı"
    fi
done

# Klasörleri kontrol et
echo "📁 Klasörler kontrol ediliyor..."
for dir in client server shared; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/ ($(find $dir -type f | wc -l) dosya)"
    else
        echo "❌ $dir/ bulunamadı"
    fi
done

# Export dosyası oluştur
echo "📦 Export dosyası oluşturuluyor..."
tar -czf hayat-simulatoru-export.tar.gz \
    client/ server/ shared/ \
    package.json package-lock.json README.md \
    tsconfig.json tailwind.config.ts \
    components.json drizzle.config.ts \
    postcss.config.js .gitignore replit.md \
    --exclude=node_modules 2>/dev/null

if [ -f "hayat-simulatoru-export.tar.gz" ]; then
    echo "✅ Export tamamlandı: hayat-simulatoru-export.tar.gz"
    ls -lh hayat-simulatoru-export.tar.gz
else
    echo "❌ Export başarısız"
fi

echo ""
echo "🚀 GitHub Upload Adımları:"
echo "1. github.com/new - Repository oluştur"  
echo "2. Name: hayat-simulatoru-app"
echo "3. Upload files - Export dosyasını yükle"
echo "4. Commit new files"