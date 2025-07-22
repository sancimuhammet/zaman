// Vercel API endpoint
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Simple demo response for now
    if (req.method === 'GET') {
      const demoSimulations = [
        {
          id: 'demo-1',
          title: 'Kariyer Değişikliği',
          currentSituation: 'Muhasebe elemanıyım',
          goals: 'Yazılım geliştirici olmak istiyorum',
          alternativeChoice: 'Bootcamp programına katılmak',
          results: {
            timeframe: '2 yıl sonra',
            scenario: 'Yazılım alanında junior pozisyonda işe başladınız',
            positiveOutcomes: ['Yeni beceriler', 'Daha yüksek maaş', 'Teknoloji sektöründe kariyer'],
            challenges: ['Öğrenme süreci', 'İlk dönem düşük maaş'],
            recommendation: 'Kararlı ve sabırlı olun'
          },
          createdAt: new Date().toISOString()
        }
      ];
      return res.status(200).json(demoSimulations);
    }

    if (req.method === 'POST') {
      const simulation = req.body;
      
      // Demo AI response
      const demoResult = {
        timeframe: '3 yıl sonra',
        scenario: `${simulation.alternativeChoice} kararını verdiğinizde hayatınız büyük değişim geçirdi.`,
        positiveOutcomes: [
          'Yeni fırsatlar keşfettiniz',
          'Kişisel gelişiminiz hızlandı',
          'Daha mutlu hissediyorsunuz'
        ],
        challenges: [
          'Başlangıç zorluları yaşadınız',
          'Finansal ayarlamalar gerekti'
        ],
        financialImpact: 'Orta vadede olumlu etki',
        personalGrowth: 'Önemli kişisel gelişim',
        relationships: 'İlişkileriniz güçlendi',
        recommendation: 'Bu karar size uygun görünüyor'
      };

      const savedSimulation = {
        id: 'sim-' + Date.now(),
        ...simulation,
        results: demoResult,
        createdAt: new Date().toISOString()
      };

      return res.status(200).json(savedSimulation);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu' });
  }
}

// Firebase Admin initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'zaman-9903a'
  });
}

const db = admin.firestore();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const snapshot = await db.collection('simulations').orderBy('createdAt', 'desc').get();
      const simulations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return res.json(simulations);
    }

    if (req.method === 'POST') {
      const simulation = req.body;
      
      // AI prompt generation
      const prompt = `Sen bir hayat koçu ve kişisel danışmansın. Aşağıdaki kişi için alternatif hayat senaryosu analiz et:

KİŞİ BİLGİLERİ:
- Yaş: ${simulation.age}
- Meslek: ${simulation.occupation}
- Şehir: ${simulation.location}
- Medeni durum: ${simulation.maritalStatus}
- Gelir seviyesi: ${simulation.incomeLevel}

MEVCUT DURUM: ${simulation.currentSituation}
HEDEFLERİ: ${simulation.goals}
ALTERNATİF KARAR: ${simulation.alternativeChoice}

Bu kişi için ${simulation.alternativeChoice} kararını verdiğini düşünerek, bu karar sonucu hayatının nasıl şekillenebileceğini analiz et.

Yanıtını JSON formatında ver:
{
  "timeframe": "X yıl sonra",
  "scenario": "Ana senaryo açıklaması",
  "positiveOutcomes": ["olumlu sonuç 1", "olumlu sonuç 2"],
  "challenges": ["zorluk 1", "zorluk 2"],
  "financialImpact": "Mali durum analizi",
  "personalGrowth": "Kişisel gelişim analizi",
  "relationships": "İlişkiler üzerindeki etkisi",
  "recommendation": "Genel tavsiye"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const aiResult = JSON.parse(response.text || '{}');

      // Save to Firebase
      const docRef = await db.collection('simulations').add({
        ...simulation,
        results: aiResult,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const doc = await docRef.get();
      const savedSimulation = {
        id: doc.id,
        ...doc.data()
      };

      return res.json(savedSimulation);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}