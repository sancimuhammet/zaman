import { Mail, Clock, MapPin, Heart, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Simulation, SimulationResults as ResultsType } from "@shared/schema";

interface SimulationResultsProps {
  simulation: Simulation;
  onNewSimulation: () => void;
}

export default function SimulationResults({ simulation, onNewSimulation }: SimulationResultsProps) {
  const results = simulation.results as ResultsType;

  if (!results || !results.futureLetterAlternative || !results.futureLetterCurrent || !results.comparison) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-gray-600">Simülasyon sonuçları yüklenemedi.</p>
        <Button onClick={onNewSimulation} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          <Plus className="mr-2" size={16} />
          Yeni Simülasyon
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Results Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <Mail className="text-white" size={24} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gelecekten Mektuplarınız Hazır!</h2>
        <p className="text-gray-600">İki farklı gelecekteki halinizden size mektuplar geldi.</p>
      </div>

      {/* Letters Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Alternative Future Letter */}
        <Card className="shadow-lg border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <Mail className="text-orange-600" size={16} />
              </div>
              Alternatif Gelecekten Mektup
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {results.futureLetterAlternative?.timeline || "Zaman belirtilmemiş"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {results.futureLetterAlternative?.location || "Yer belirtilmemiş"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Heart className="w-3 h-3 mr-1" />
                {results.futureLetterAlternative?.mood || "Duygu belirtilmemiş"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 rounded-lg p-6">
              <div className="prose prose-sm text-gray-800 whitespace-pre-line">
                {results.futureLetterAlternative?.letter || "Mektup içeriği yüklenemedi."}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Future Letter */}
        <Card className="shadow-lg border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Mail className="text-blue-600" size={16} />
              </div>
              Mevcut Yoldan Mektup
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {results.futureLetterCurrent?.timeline || "Zaman belirtilmemiş"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {results.futureLetterCurrent?.location || "Yer belirtilmemiş"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Heart className="w-3 h-3 mr-1" />
                {results.futureLetterCurrent?.mood || "Duygu belirtilmemiş"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="prose prose-sm text-gray-800 whitespace-pre-line">
                {results.futureLetterCurrent?.letter || "Mektup içeriği yüklenemedi."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Analysis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Gelecek Karşılaştırması
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Temel Farklar</h4>
              <p className="text-sm text-gray-600">{results.comparison?.majorDifferences || "Karşılaştırma bilgisi mevcut değil."}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Duygusal Ton</h4>
              <p className="text-sm text-gray-600">{results.comparison?.emotionalTone || "Duygusal analiz mevcut değil."}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Yaşam Olayları</h4>
              <p className="text-sm text-gray-600">{results.comparison?.lifeEvents || "Yaşam olayları analizi mevcut değil."}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card className="mb-8">
        <CardContent className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">{results.overallScore || 0}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Alternatif Seçim Memnuniyet Skoru</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Bu skor, alternatif seçiminizin size getireceği genel memnuniyet seviyesini gösterir.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button onClick={onNewSimulation} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2" size={16} />
          Yeni Simülasyon Başlat
        </Button>
      </div>
    </div>
  );
}

