import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain, CheckCircle, Circle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Simulation } from "@shared/schema";

interface LoadingSimulationProps {
  onComplete: (simulation: Simulation) => void;
}

export default function LoadingSimulation({ onComplete }: LoadingSimulationProps) {
  const queryClient = useQueryClient();
  const steps = [
    { id: 1, label: "Kişisel bilgiler işlendi", completed: true },
    { id: 2, label: "Mevcut durum analiz edildi", completed: true },
    { id: 3, label: "Alternatif senaryolar hesaplanıyor...", completed: false, active: true },
    { id: 4, label: "Sonuçlar formatlanıyor", completed: false },
  ];

  // Check for completed simulations every second
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Invalidate and refetch simulations
        await queryClient.invalidateQueries({ queryKey: ["/api/simulations"] });
        const data = queryClient.getQueryData(["/api/simulations"]) as Simulation[];
        
        if (data && data.length > 0) {
          // Get the most recent simulation
          const mostRecent = data.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          
          // If it has results, complete the loading
          if (mostRecent && mostRecent.results) {
            clearInterval(interval);
            onComplete(mostRecent);
          }
        }
      } catch (error) {
        console.error("Error checking simulation status:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete, queryClient]);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <Card className="shadow-lg">
        <CardContent className="p-12">
          {/* Loading Animation */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Yapay Zeka Analiz Yapıyor</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Verdiğiniz bilgiler analiz ediliyor ve alternatif hayat senaryonuz oluşturuluyor. 
            Bu işlem yaklaşık 30-60 saniye sürmektedir.
          </p>

          {/* Progress Steps */}
          <div className="space-y-4 text-left max-w-md mx-auto mb-8">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-3">
                {step.completed ? (
                  <CheckCircle className="text-green-600" size={16} />
                ) : step.active ? (
                  <Loader2 className="text-primary animate-spin" size={16} />
                ) : (
                  <Circle className="text-gray-400" size={16} />
                )}
                <span 
                  className={`text-sm ${
                    step.completed ? 'text-green-600' : 
                    step.active ? 'text-primary' : 
                    'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="px-6 py-2"
          >
            İptal Et
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}