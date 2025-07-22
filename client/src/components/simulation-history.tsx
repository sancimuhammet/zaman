import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Simulation } from "@shared/schema";

interface SimulationHistoryProps {
  onViewSimulation: (simulation: Simulation) => void;
  onNewSimulation: () => void;
}

const categoryColors = {
  "Kariyer": "bg-blue-100 text-blue-800",
  "Yaşam Tarzı": "bg-green-100 text-green-800", 
  "Eğitim": "bg-purple-100 text-purple-800",
  "İlişkiler": "bg-red-100 text-red-800",
  "Girişimcilik": "bg-yellow-100 text-yellow-800",
  "Hobi": "bg-indigo-100 text-indigo-800"
};

export default function SimulationHistory({ onViewSimulation, onNewSimulation }: SimulationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: simulations = [], isLoading } = useQuery<Simulation[]>({
    queryKey: ["/api/simulations"],
  });

  const filteredSimulations = simulations.filter((simulation: Simulation) => {
    const matchesSearch = simulation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         simulation.alternativeChoice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || simulation.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedSimulations = filteredSimulations.sort((a: Simulation, b: Simulation) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "highest-score":
        return (b.successRate || 0) - (a.successRate || 0);
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* History Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Geçmiş Simülasyonlar</h2>
          <p className="text-gray-600">Daha önce yaptığınız tüm simülasyonları görüntüleyin ve karşılaştırın</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={onNewSimulation} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="mr-2" size={16} />
            Yeni Simülasyon
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <Card className="shadow-sm mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Simülasyonlarda ara..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tüm Kategoriler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                <SelectItem value="Kariyer">Kariyer</SelectItem>
                <SelectItem value="Yaşam Tarzı">Yaşam Tarzı</SelectItem>
                <SelectItem value="Eğitim">Eğitim</SelectItem>
                <SelectItem value="İlişkiler">İlişkiler</SelectItem>
                <SelectItem value="Girişimcilik">Girişimcilik</SelectItem>
                <SelectItem value="Hobi">Hobi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Yeniden Eskiye</SelectItem>
                <SelectItem value="oldest">Eskiden Yeniye</SelectItem>
                <SelectItem value="highest-score">En Yüksek Skor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Simulations Grid */}
      {sortedSimulations.length > 0 ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedSimulations.map((simulation: Simulation) => (
            <Card 
              key={simulation.id} 
              className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => onViewSimulation(simulation)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    className={categoryColors[simulation.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}
                  >
                    {simulation.category}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="mr-1" size={12} />
                    {new Date(simulation.createdAt).toLocaleDateString('tr-TR', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{simulation.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {simulation.alternativeChoice}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-green-600" size={12} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      %{simulation.successRate || 0} başarı oranı
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || categoryFilter !== "all" ? "Sonuç Bulunamadı" : "Henüz Simülasyon Yok"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== "all" 
                ? "Arama kriterlerinize uygun simülasyon bulunamadı." 
                : "İlk simülasyonunuzu oluşturmak için başlayın."
              }
            </p>
            <Button onClick={onNewSimulation} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Plus className="mr-2" size={16} />
              {searchTerm || categoryFilter !== "all" ? "Yeni Simülasyon Oluştur" : "İlk Simülasyonunuzu Başlatın"}
            </Button>
          </CardContent>
        </Card>
      )}

      {sortedSimulations.length > 9 && (
        <div className="text-center mt-8">
          <Button variant="outline" className="px-8 py-3">
            Daha Fazla Yükle
          </Button>
        </div>
      )}
    </div>
  );
}