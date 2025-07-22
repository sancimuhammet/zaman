import type { Express } from "express";
import { createServer, type Server } from "http";
import { firebaseStorage } from "./firebase";
import { simulationFormSchema, type SimulationResults } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ""
});

export async function registerFirebaseRoutes(app: Express): Promise<Server> {
  
  // Test route
  app.get("/api/test", (req, res) => {
    res.json({ message: "Firebase API working" });
  });

  // Get all simulations
  app.get("/api/simulations", async (req, res) => {
    try {
      const simulations = await firebaseStorage.getAllSimulations();
      res.json(simulations);
    } catch (error) {
      console.error("Firebase get simulations error:", error);
      res.status(500).json({ message: "Simülasyonlar alınırken hata oluştu" });
    }
  });

  // Get single simulation
  app.get("/api/simulations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const simulation = await firebaseStorage.getSimulation(id);
      
      if (!simulation) {
        return res.status(404).json({ message: "Simülasyon bulunamadı" });
      }
      
      res.json(simulation);
    } catch (error) {
      console.error("Firebase get simulation error:", error);
      res.status(500).json({ message: "Simülasyon alınırken hata oluştu" });
    }
  });

  // Create and run simulation with Firebase
  app.post("/api/simulations", async (req, res) => {
    try {
      // Validate request body
      const validationResult = simulationFormSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Form verilerinde hata var",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const formData = validationResult.data;

      // Create natural and conversational prompt for Gemini AI
      const prompt = `
Sen kişinin gelecekteki hali olarak ona mektup yazıyorsun. Kullanıcının verilerini dikkatla oku ve gerçekçi, samimi mektuplar yaz.

KULLANICI VERİLERİ:
- Yaş: ${formData.age}
- Cinsiyet: ${formData.gender || 'Belirtilmedi'}
- Hobiler: ${formData.hobbies}
- Kişilik: ${formData.personality}
- Mevcut Durum: ${formData.currentSituation}
- Hedefleri: ${formData.currentGoals}
- Alternatif Seçim: ${formData.alternativeChoice}

MEKTUP YAZIM KURALLARI:
1. Başlangıç: "Sevgili [isim]," veya doğal bir hitap
2. İlk paragraf: "Bazen düşünüyorsun... [alternatif seçim] seçseydim nasıl olurdu diye."
3. Kısa, net cümleler kullan
4. Gerçek detaylar ver (şehir, iş yeri, günlük yaşam)
5. Hobilerini mutlaka dahil et
6. Hem güzel hem zor yanları söyle
7. Dobra, samimi bir dil kullan
8. Uzun betimlemeler yapma
9. Duygusal ama abartısız ol

ZAMAN BELİRLEME:
- Yaşına ve seçimine göre mantıklı süre belirle
- Otomatik "10 yıl" yazma!

ÖRnek TON:
"Şu an 25 yaşındasın ve Muş'tasın. Belki farklı bir senaryo olsaydı, hastanede çalışıyor olurdun. İnsanlara yardım etmek... Yorucu olurdu, evet. Uykusuz nöbetler, yıpratıcı anlar… Ama birinin sana 'iyi ki varsın' demesi her şeyi unuttururdu."

JSON formatında yanıt ver:
{
  "futureLetterAlternative": {
    "letter": "Alternatif seçimi yapmış halinden samimi mektup (250-350 kelime)",
    "timeline": "Mantıklı zaman dilimi",
    "location": "Spesifik yer",
    "mood": "Doğal ruh hali"
  },
  "futureLetterCurrent": {
    "letter": "Mevcut yolda devam etmiş halinden mektup (250-350 kelime)",
    "timeline": "Mantıklı zaman dilimi",
    "location": "Spesifik yer",
    "mood": "Doğal ruh hali"
  },
  "comparison": {
    "majorDifferences": "Kısa, net farklar",
    "emotionalTone": "Duygusal ton karşılaştırması",
    "lifeEvents": "Önemli yaşam olayları"
  },
  "overallScore": "1-100 arası skor",
  "category": "Uygun kategori"
}
      `;

      // Call Gemini AI API
      let results: SimulationResults;
      
      try {
        const geminiResponse = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            systemInstruction: `Sen kullanıcının gelecekteki hali olarak ona samimi, doğal mektuplar yazıyorsun. Tıpkı bir arkadaş gibi konuş - dobra, dürüst, sıcak ama abartısız.

YAZIM TARZI:
- Kısa, anlaşılır cümleler
- Uzun betimlemelerden kaçın
- Duygusal ama abartısız
- Gerçekçi detaylar
- Samimi ton

ÖRnek BAŞLANGIÇ:
"Sevgili [isim], Bazen düşünüyorsun... [seçim] seçseydim nasıl olurdu diye."

ZAMAN HESABI:
- Yaşa ve seçime göre mantıklı süre
- Otomatik "10 yıl" yazma!
- 18-25 yaş: 3-6 yıl
- 25-35 yaş: 4-8 yıl
- 35+ yaş: 5-10 yıl

YASAKLAR:
❌ Uzun hikaye anlatımı
❌ Aşırı betimlemeler
❌ Sabit "10 yıl sonra"
❌ Klişe ifadeler
❌ Kullanıcı verilerini görmezden gelme`,
            responseSchema: {
              type: "object",
              properties: {
                futureLetterAlternative: {
                  type: "object",
                  properties: {
                    letter: { type: "string" },
                    timeline: { type: "string" },
                    location: { type: "string" },
                    mood: { type: "string" }
                  },
                  required: ["letter", "timeline", "location", "mood"]
                },
                futureLetterCurrent: {
                  type: "object",
                  properties: {
                    letter: { type: "string" },
                    timeline: { type: "string" },
                    location: { type: "string" },
                    mood: { type: "string" }
                  },
                  required: ["letter", "timeline", "location", "mood"]
                },
                comparison: {
                  type: "object",
                  properties: {
                    majorDifferences: { type: "string" },
                    emotionalTone: { type: "string" },
                    lifeEvents: { type: "string" }
                  },
                  required: ["majorDifferences", "emotionalTone", "lifeEvents"]
                },
                overallScore: { type: "number" },
                category: { type: "string" }
              },
              required: ["futureLetterAlternative", "futureLetterCurrent", "comparison", "overallScore", "category"]
            }
          }
        });
        
        const geminiText = geminiResponse.text;
        if (!geminiText) {
          throw new Error("Gemini AI'dan yanıt alınamadı");
        }

        results = JSON.parse(geminiText);
      } catch (error: any) {
        console.error("Gemini API error:", error);
        throw new Error(`Gemini AI işlenirken hata oluştu: ${error.message}`);
      }

      // Determine title based on category and alternative choice
      const title = `${results.category}: ${formData.alternativeChoice.substring(0, 50)}${formData.alternativeChoice.length > 50 ? '...' : ''}`;

      // Save simulation to Firebase
      const simulation = await firebaseStorage.createSimulation({
        title,
        currentSituation: formData.currentSituation,
        currentGoals: formData.currentGoals,
        alternativeChoice: formData.alternativeChoice,
        age: formData.age,
        gender: formData.gender,
        hobbies: formData.hobbies,
        personality: formData.personality,
        results,
        category: results.category,
        successRate: results.overallScore,
      });

      res.json(simulation);
    } catch (error: any) {
      console.error("Firebase simulation error:", error);
      res.status(500).json({ 
        message: "Simülasyon işlenirken hata oluştu. Lütfen daha sonra tekrar deneyin.",
        error: error instanceof Error ? error.message : "Bilinmeyen hata"
      });
    }
  });

  // Delete simulation
  app.delete("/api/simulations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await firebaseStorage.deleteSimulation(id);
      res.json({ message: "Simülasyon silindi" });
    } catch (error) {
      console.error("Firebase delete simulation error:", error);
      res.status(500).json({ message: "Simülasyon silinirken hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}