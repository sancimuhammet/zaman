import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Navigation, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressSteps from "@/components/ui/progress-steps";
import { simulationFormSchema, type SimulationForm, type Simulation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SimulationFormProps {
  onStartSimulation: () => void;
  onNewSimulation: () => void;
}

const progressSteps = [
  { id: 1, label: "Mevcut Durum" },
  { id: 2, label: "Alternatif" },
  { id: 3, label: "Kişisel Bilgiler" },
  { id: 4, label: "Simülasyon" }
];

export default function SimulationForm({ onStartSimulation, onNewSimulation }: SimulationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SimulationForm>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      currentSituation: "",
      currentGoals: "",
      alternativeChoice: "",
      age: 25,
      gender: "",
      hobbies: "",
      personality: "",
    },
  });

  const { data: recentSimulations = [] } = useQuery<Simulation[]>({
    queryKey: ["/api/simulations"],
  });

  const simulationMutation = useMutation({
    mutationFn: async (data: SimulationForm) => {
      // İlk olarak asıl API'yi dene, başarısız olursa demo'yu dene
      let res = await apiRequest("POST", "/api/simulations", data);
      
      if (!res.ok) {
        // Ana API başarısız oldu, demo API'yi dene
        console.log("Ana API başarısız, demo API deneniyor...");
        res = await apiRequest("POST", "/api/simulations/demo", data);
        
        if (!res.ok) {
          throw new Error("Simülasyon başlatılamadı");
        }
      }
      
      return res.json();
    },
    onSuccess: () => {
      // Invalidate simulations cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["/api/simulations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata", 
        description: error.message || "Simülasyon başlatılırken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: SimulationForm) => {
    onStartSimulation();
    simulationMutation.mutate(data);
  };

  const updateProgress = () => {
    const { currentSituation, currentGoals, alternativeChoice, age, hobbies, personality } = form.getValues();
    
    if (currentSituation && currentGoals) {
      setCurrentStep(2);
      if (alternativeChoice) {
        setCurrentStep(3);
        if (age && hobbies && personality) {
          setCurrentStep(4);
        }
      }
    } else {
      setCurrentStep(1);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Alternatif Hayat Yollarını Keşfet</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Yapay zeka ile farklı kararların hayatınızı nasıl şekillendirebileceğini öğrenin. 
          Mevcut durumunuzu girin ve alternatif senaryoları keşfedin.
        </p>
      </div>

      {/* Progress Indicator */}
      <ProgressSteps currentStep={currentStep} steps={progressSteps} />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Simulation Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Simülasyon Formu</CardTitle>
            <CardDescription>Mevcut durumunuzu ve alternatif seçiminizi detaylandırın</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Current Situation */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="text-primary mr-2" size={20} />
                    Mevcut Durumunuz
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="currentSituation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yaşam Durumu</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Örn: 28 yaşındayım, mühendis olarak çalışıyorum, İstanbul'da yaşıyorum..." 
                            className="resize-none"
                            rows={4}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateProgress();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mevcut Hedefleriniz</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Kısa ve uzun vadeli hedeflerinizi paylaşın..." 
                            className="resize-none"
                            rows={3}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateProgress();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Alternative Choice */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <Navigation className="text-secondary mr-2" size={20} />
                    Alternatif Seçiminiz
                  </h4>
                  
                  <FormField
                    control={form.control}
                    name="alternativeChoice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farklı Karar/Seçim</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Örn: Mühendislik yerine sanat eğitimi alsaydım, başka bir şehre taşınsaydım..." 
                            className="resize-none"
                            rows={4}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateProgress();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="text-warning mr-2" size={20} />
                    Kişisel Bilgiler
                  </h4>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yaş</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="25" 
                              min={16} 
                              max={80}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                                updateProgress();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cinsiyet</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kadın">Kadın</SelectItem>
                              <SelectItem value="erkek">Erkek</SelectItem>
                              <SelectItem value="belirtmek_istemiyorum">Belirtmek İstemiyorum</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="hobbies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hobiler ve İlgi Alanları</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Müzik, spor, okuma, resim..." 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateProgress();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kişilik Özellikleri</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Sosyal, içedönük, yaratıcı, analitik..." 
                            className="resize-none"
                            rows={3}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateProgress();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 text-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={simulationMutation.isPending}
                  >
                    <Sparkles className="mr-2" size={20} />
                    {simulationMutation.isPending ? "Simülasyon Oluşturuluyor..." : "Simülasyonu Başlat"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* Info Cards */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Nasıl Çalışır?</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Gelişmiş yapay zeka algoritmaları, verdiğiniz bilgileri analiz ederek 
                    alternatif hayat senaryolarını simüle eder ve olası sonuçları hesaplar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-secondary" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Gizlilik ve Güvenlik</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Verileriniz güvenli bir şekilde işlenir ve saklanır. 
                    Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Simulations Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="text-gray-600 mr-2" size={20} />
                Son Simülasyonlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentSimulations && recentSimulations.length > 0 ? (
                <div className="space-y-3">
                  {recentSimulations.slice(0, 3).map((simulation) => (
                    <div key={simulation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{simulation.title}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(simulation.createdAt).toLocaleDateString('tr-TR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <Navigation className="text-gray-400" size={12} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Henüz simülasyon bulunmuyor
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}