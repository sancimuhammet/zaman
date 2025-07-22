import { useState } from "react";
import { Route as Router, MapIcon, Users, Info } from "lucide-react";
import SimulationForm from "../components/simulation-form";
import SimulationResults from "../components/simulation-results";
import SimulationHistory from "../components/simulation-history";
import LoadingSimulation from "../components/loading-simulation";
import type { Simulation } from "@shared/schema";

type TabType = 'simulator' | 'history' | 'about';
type ViewType = 'form' | 'loading' | 'results';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');
  const [currentView, setCurrentView] = useState<ViewType>('form');
  const [currentSimulation, setCurrentSimulation] = useState<Simulation | null>(null);

  const handleStartSimulation = () => {
    setCurrentView('loading');
  };

  const handleSimulationComplete = (simulation: Simulation) => {
    setCurrentSimulation(simulation);
    setCurrentView('results');
  };

  const handleNewSimulation = () => {
    setActiveTab('simulator');
    setCurrentView('form');
    setCurrentSimulation(null);
  };

  const handleViewSimulation = (simulation: Simulation) => {
    setCurrentSimulation(simulation);
    setCurrentView('results');
    setActiveTab('simulator');
  };

  const tabs = [
    { id: 'simulator' as TabType, label: 'Simülatör', icon: Router },
    { id: 'history' as TabType, label: 'Geçmiş Simülasyonlar', icon: MapIcon },
    { id: 'about' as TabType, label: 'Hakkında', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Router className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Yaşam Simülatörü</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'simulator' && (
          <>
            {currentView === 'form' && (
              <SimulationForm 
                onStartSimulation={handleStartSimulation}
                onNewSimulation={handleNewSimulation}
              />
            )}
            {currentView === 'loading' && (
              <LoadingSimulation onComplete={handleSimulationComplete} />
            )}
            {currentView === 'results' && currentSimulation && (
              <SimulationResults 
                simulation={currentSimulation}
                onNewSimulation={handleNewSimulation}
              />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <SimulationHistory 
            onViewSimulation={handleViewSimulation}
            onNewSimulation={handleNewSimulation}
          />
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Yaşam Simülatörü Hakkında</h2>
              <p className="text-xl text-gray-600">
                Yapay zeka destekli hayat simülasyon platformumuz hakkında daha fazla bilgi edinin
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Nasıl Çalışır?</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Yaşam Simülatörü, gelişmiş yapay zeka algoritmaları kullanarak sizin verdiğiniz 
                  kişisel bilgiler, mevcut durumunuz ve alternatif seçimlerinizi analiz eder. 
                  Makine öğrenmesi modelleri, milyonlarca veri noktasından öğrendiği kalıpları 
                  kullanarak farklı hayat yollarının olası sonuçlarını hesaplar.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Router className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-semibold">Yaşam Simülatörü</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Yapay zeka ile hayatınızın alternatif yollarını keşfedin ve daha bilinçli kararlar alın.
            </p>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 Yaşam Simülatörü. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
