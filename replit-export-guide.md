# Replit'ten GitHub'a Export Rehberi

## Version Control Sorunu Çözümü:
Git panelinde sadece "Settings" görünüyorsa:

### Yöntem 1: Replit Shell ile Export
1. Replit'te "Shell" sekmesini aç
2. Bu komutu çalıştır:
   ```bash
   tar -czf export-hayat-simulatoru.tar.gz client/ server/ shared/ *.json *.ts *.js *.md --exclude=node_modules
   ```

### Yöntem 2: Files Panel Export
1. Files panelinde sağ üst köşe "⋮" (3 nokta)
2. "Download" veya "Export" seç
3. Zip dosyası indirilecek

### Yöntem 3: Manuel Klasör Kopyalama
Files panelinde şu klasörleri seç:
- client/ (sağ tık → Download)
- server/ (sağ tık → Download)  
- shared/ (sağ tık → Download)
- package.json, README.md vs.

## GitHub'da Upload:
1. Repository oluştur: hayat-simulatoru-app
2. "Add file" → "Upload files"
3. İndirdiğin dosyaları sürükle
4. Commit et

## Proje İçeriği:
- React frontend (client/)
- Node.js backend (server/)
- Firebase entegrasyonu
- Gemini AI integration
- Türkçe arayüz