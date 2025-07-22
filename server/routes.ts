import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { simulationFormSchema, type SimulationResults, type SimulationForm } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ""
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Test route
  app.get("/api/test", (req, res) => {
    res.json({ message: "API working" });
  });

  // Get all simulations
  app.get("/api/simulations", async (req, res) => {
    try {
      const simulations = await storage.getAllSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Simülasyonlar alınırken hata oluştu" });
    }
  });

  // Get single simulation
  app.get("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const simulation = await storage.getSimulation(id);
      
      if (!simulation) {
        return res.status(404).json({ message: "Simülasyon bulunamadı" });
      }
      
      res.json(simulation);
    } catch (error) {
      res.status(500).json({ message: "Simülasyon alınırken hata oluştu" });
    }
  });

  // Demo simulation with mock data (for testing when API quota exceeded)
  app.post("/api/simulations/demo", async (req, res) => {
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

      // Generate personalized mock data for demonstration
      const generatePersonalizedDemo = (formData: SimulationForm): SimulationResults => {
        const currentAge = formData.age;
        const futureAge = currentAge + 5;
        
        return {
          futureLetterAlternative: {
            letter: `Sevgili ${futureAge} yaşındaki ben,

Bu sabah ${formData.alternativeChoice.toLowerCase().includes('hemşire') ? 'hastane koridorlarında' : 
  formData.alternativeChoice.toLowerCase().includes('öğretmen') ? 'sınıfıma girerken' :
  formData.alternativeChoice.toLowerCase().includes('sanat') ? 'atölyemde' : 
  'yeni iş yerinde'} yürürken, 5 yıl önceki o kararsız günlerini hatırladım. ${formData.currentSituation} bırakıp ${formData.alternativeChoice} seçimini yapmak gerçekten cesaret gerektirmişti.

İlk yıllar zordu, tabii ki. Özellikle ${currentAge} yaşında yeni bir alana girmek hiç kolay olmadı. Ama ${formData.hobbies} merakım sayesinde bu alandaki öğrenme sürecim çok daha keyifli geçti. ${formData.personality} özelliklerim, bu yeni ortamda beklemediğim şekilde avantaj oldu.

Şu an ${formData.alternativeChoice.toLowerCase().includes('hemşire') ? 'hastalara bakarken aldığım dua ve teşekkürler' : 
  formData.alternativeChoice.toLowerCase().includes('öğretmen') ? 'öğrencilerimin gözlerindeki anlama ışığı' :
  formData.alternativeChoice.toLowerCase().includes('sanat') ? 'yarattığım eserlerin insanlara dokunması' : 
  'yaptığım işin anlamlı olduğunu hissetmek'} beni her gün motive ediyor. Ekonomik anlamda da artık rahatım - başlangıçta endişe ettiğin gibi açlıktan ölmedik!

En büyük değişiklik, kendimle barışık olmam. O günlerde "ya başaramazsam, ya pişman olursam?" diye düşünüyordun. Şimdi o endişelerin boş olduğunu görüyorum. Risk almak bazen hayatın en güzel hediyesi oluyor.

${formData.hobbies} ile ilgili merakların da bu yeni hayatında farklı şekillerde gelişti. Hiçbir şey kaybolmadı, sadece yeni bir forma büründü.

Sevgiyle,
Cesur seçim yapan sen`,
            timeline: "5 yıl sonra",
            location: formData.alternativeChoice.toLowerCase().includes('hemşire') ? 'Hastane molasında' : 
              formData.alternativeChoice.toLowerCase().includes('öğretmen') ? 'Öğretmenler odasında' :
              formData.alternativeChoice.toLowerCase().includes('sanat') ? 'Kendi atölyemde' : 'Yeni iş yerinde',
            mood: "Memnun ve huzurlu"
          },
          futureLetterCurrent: {
            letter: `Merhaba ${futureAge} yaşındaki ben,

${formData.currentSituation} yolunda devam ettik ve şu anda oldukça istikrarlı bir noktadayım. ${formData.currentGoals} hedeflerim büyük ölçüde gerçekleşti sayılır. Mali durumum iyi, kariyer basamaklarını çıktım.

Ama son zamanlarda sık sık o eski hayali hatırlıyorum: ${formData.alternativeChoice}. O zamanlar çok riskli geliyordu, şimdi ise "keşke deneseydin" diye düşünüyorum. Güvenli yolu seçtim ama içimde bir eksiklik var.

${formData.hobbies} ile ilgili meraklarım hâlâ devam ediyor ama sadece boş zaman aktivitesi olarak. Bazen bunları daha ciddi yapmak istiyorum ama artık o cesaret yok. Rutinin içinde kaybolmuş gibiyim.

Mesleki anlamda başarılıyım, çevrem beni takdir ediyor. Ama sabahları uyanırken o eski heyecanı hissetmiyorum. ${formData.personality} özelliklerim bu ortamda değerlendirilse de, sanki tam kapasitemi kullanamıyormuşum gibi hissediyorum.

Belki de hayat böyledir - güvenli ama biraz renksiz. Yine de şükretmeliyim, çoğu insan bu istikrara sahip değil.

Sevgiler,
Güvenli yoldaki sen`,
            timeline: "5 yıl sonra",
            location: "Ofisimdeki masada",
            mood: "İstikrarlı ama sorgulayıcı"
          },
          comparison: {
            majorDifferences: "Alternatif yolda daha anlamlı iş deneyimi ve kişisel tatmin, mevcut yolda mali güvenlik ve sosyal statü",
            emotionalTone: "Alternatif yolda başarının verdiği gurur ve huzur, mevcut yolda istikrarlı ama hafif pişmanlık",
            lifeEvents: "Her iki yolda da farklı insan ilişkileri, farklı zorluklar ve farklı başarı hikayeleri"
          },
          overallScore: Math.floor(Math.random() * 25) + 70,
          category: formData.alternativeChoice.toLowerCase().includes('hemşire') || formData.alternativeChoice.toLowerCase().includes('doktor') ? "Sağlık" :
            formData.alternativeChoice.toLowerCase().includes('öğretmen') || formData.alternativeChoice.toLowerCase().includes('eğitim') ? "Eğitim" :
            formData.alternativeChoice.toLowerCase().includes('sanat') || formData.alternativeChoice.toLowerCase().includes('müzik') ? "Sanat" : "Kariyer"
        };
      };

      const results = generatePersonalizedDemo(formData);

      // Determine title based on category and alternative choice
      const title = `${results.category}: ${formData.alternativeChoice.substring(0, 50)}${formData.alternativeChoice.length > 50 ? '...' : ''}`;

      // Save simulation to storage
      const simulation = await storage.createSimulation({
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
      console.error("Demo simulation error:", error);
      res.status(500).json({ 
        message: "Demo simülasyon işlenirken hata oluştu.",
        error: error instanceof Error ? error.message : "Bilinmeyen hata"
      });
    }
  });

  // Create and run simulation
  app.post("/api/simulations", async (req, res) => {
    try {
      // Validate request body
      const validationResult = simulationFormSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log("Validation error:", validationResult.error);
        return res.status(400).json({ 
          message: "Form verilerinde hata var",
          errors: validationResult.error.flatten().fieldErrors
        });
      }

      const formData = validationResult.data;

      // Create detailed and personalized prompt for Gemini AI
      const prompt = `
Sen bir yaşam analisti ve hikaye anlatıcısısın. Kullanıcının alternatif hayat seçimini yapmış gelecekteki halinden kendisine çok detaylı, kişiselleştirilmiş mektuplar yazacaksın.

KİŞİ BİLGİLERİ:
- Yaş: ${formData.age}
- Cinsiyet: ${formData.gender || 'Belirtilmedi'}
- Hobiler ve İlgi Alanları: ${formData.hobbies}
- Kişilik Özellikleri: ${formData.personality}

MEVCUT DURUM:
${formData.currentSituation}

MEVCUT HEDEFLERİ:
${formData.currentGoals}

ALTERNATİF SEÇİM:
${formData.alternativeChoice}

ÖNEMLİ TALİMATLAR:
1. Her mektup kişiye özel olmalı - genel ifadeler kullanma
2. Gerçekçi detaylar ekle (şehir isimleri, iş yerleri, günlük yaşam detayları)
3. Kişinin hobilerini ve ilgi alanlarını mutlaka entegre et
4. Hem zorlukları hem başarıları dengeli şekilde anlat
5. Duygusal derinlik katacak kişisel anılar ve deneyimler ekle
6. Samimi ve içten bir dil kullan
7. Her seçimin farklı yaşam tarzları yarattığını göster

MEKTUP YAZIM KURALLARI:
- Başlangıç: "Merhaba eski ben," veya "Sevgili [yaş] yaşındaki ben,"
- Spesifik günlük yaşam detayları (sabah rutini, iş ortamı, yaşadığı yer vs.)
- Alternatif seçimin getirdiği benzersiz deneyimler
- Zorluklar ve nasıl üstesinden geldiği
- Hobilerinin yeni hayatındaki yeri
- Kişilik özelliklerinin bu yolda nasıl işe yaradığı
- Duygusal bir sonuç ve tavsiye

Lütfen aşağıdaki JSON formatında yanıt ver:
{
  "futureLetterAlternative": {
    "letter": "Kişiye özel detaylı mektup (400-600 kelime) - alternatif seçimi yapmış gelecekteki hali",
    "timeline": "Kaç yıl sonra yazıldığı",
    "location": "Spesifik yer (şehir, iş yeri vs.)",
    "mood": "O andaki ruh hali ve duygu durumu"
  },
  "futureLetterCurrent": {
    "letter": "Kişiye özel detaylı mektup (400-600 kelime) - mevcut yolda devam etmiş hali",
    "timeline": "Kaç yıl sonra yazıldığı",
    "location": "Spesifik yer",
    "mood": "O andaki ruh hali ve duygu durumu"
  },
  "comparison": {
    "majorDifferences": "İki hayat yolu arasındaki somut, spesifik farklar",
    "emotionalTone": "Duygusal ton karşılaştırması",
    "lifeEvents": "Her iki yolda yaşanan önemli yaşam olayları"
  },
  "overallScore": 1-100 arası gerçekçi memnuniyet skoru,
  "category": "Kariyer/Eğitim/İlişkiler/Yaşam Tarzı/Sağlık/Sanat kategorilerinden uygun olan"
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
            systemInstruction: `Sen kişiselleştirilmiş hayat simülasyonları yazma konusunda uzman bir analistsin. Her yanıt, kullanıcının benzersiz durumuna özel olmalı - asla genel ifadeler kullanmamalısın.

MÜKEMMEL KIŞISELLEŞTIRME ÖRNEKLERİ:
- "Muş'un soğuk sabahlarında erkenden uyanıp, beyaz önlüğünü giydiğini hayal et"
- "25 yaşında hemşirelik seçseydin, bugün Muş Devlet Hastanesi'nde çalışıyor olabilirdin"
- "Şiir yazmayı bırakmadın. Boş zamanlarında hastane bahçesinde defterini açıp"

TEMEL KURALLAR:
1. Kişinin yaşını, şehrini, mesleğini, hobilerini mutlaka kullan
2. Günlük yaşam detayları ekle (sabah rutini, iş ortamı, eve dönüş)
3. Duygusal derinlik kat - anılar, deneyimler, hisler
4. Gerçekçi zorluklar ve başarıları dengele
5. Hobilerinin yeni hayattaki rolünü göster
6. Samimi ve içten bir dil kullan`,
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

      // Save simulation to storage
      const simulation = await storage.createSimulation({
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
      console.error("Simulation error:", error);
      
      res.status(500).json({ 
        message: "Simülasyon işlenirken hata oluştu. Lütfen daha sonra tekrar deneyin.",
        error: error instanceof Error ? error.message : "Bilinmeyen hata"
      });
    }
  });

  // Delete simulation
  app.delete("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSimulation(id);
      res.json({ message: "Simülasyon silindi" });
    } catch (error) {
      res.status(500).json({ message: "Simülasyon silinirken hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
