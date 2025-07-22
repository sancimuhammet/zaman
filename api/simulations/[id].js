// Vercel API endpoint for specific simulation
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Simulation ID gerekli' });
      }

      // Demo simulation response
      const demoSimulation = {
        id: id,
        title: 'Demo Simülasyon',
        currentSituation: 'Örnek durum',
        goals: 'Örnek hedefler',
        alternativeChoice: 'Örnek alternatif karar',
        results: {
          timeframe: '2 yıl sonra',
          scenario: 'Demo senaryo açıklaması',
          positiveOutcomes: ['Olumlu sonuç 1', 'Olumlu sonuç 2'],
          challenges: ['Zorluk 1', 'Zorluk 2'],
          recommendation: 'Demo tavsiye'
        },
        createdAt: new Date().toISOString()
      };

      return res.status(200).json(demoSimulation);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Sunucu hatası' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}