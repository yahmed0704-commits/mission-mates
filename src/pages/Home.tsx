import { useState } from "react";
import { 
  Rocket, 
  Gamepad2, 
  Stars, 
  ShieldCheck, 
  Cpu, 
  Map as MapIcon, 
  DollarSign, 
  Code2 
} from "lucide-react";
import Overview from "@/components/tabs/Overview";
import Gameplay from "@/components/tabs/Gameplay";
import Features from "@/components/tabs/Features";
import Safety from "@/components/tabs/Safety";
import TechStack from "@/components/tabs/TechStack";
import Roadmap from "@/components/tabs/Roadmap";
import Business from "@/components/tabs/Business";
import DevGuide from "@/components/tabs/DevGuide";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "overview", label: "Overview", icon: Rocket, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "gameplay", label: "Gameplay", icon: Gamepad2, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  { id: "features", label: "Features", icon: Stars, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  { id: "safety", label: "Safety", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  { id: "techstack", label: "Tech Stack", icon: Cpu, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-900/30" },
  { id: "roadmap", label: "Roadmap", icon: MapIcon, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
  { id: "business", label: "Business", icon: DollarSign, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  { id: "devguide", label: "Dev Guide", icon: Code2, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/30" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <Overview />;
      case "gameplay": return <Gameplay />;
      case "features": return <Features />;
      case "safety": return <Safety />;
      case "techstack": return <TechStack />;
      case "roadmap": return <Roadmap />;
      case "business": return <Business />;
      case "devguide": return <DevGuide />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b-4 border-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl rotate-3 shadow-sm flex items-center justify-center text-white">
              <Rocket className="w-8 h-8 -rotate-3" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] leading-tight text-primary">Mission Mates</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Game Design Doc</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                    ${isActive 
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50"}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.color : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Mobile Navigation - Scrollable Row */}
        <div className="md:hidden overflow-x-auto px-4 py-3 flex gap-2 no-scrollbar bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                  ${isActive 
                    ? `bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5` 
                    : "text-slate-500 bg-slate-100 dark:bg-slate-800"}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? tab.color : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-both">
          {renderContent()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 font-bold text-sm border-t border-slate-200 dark:border-slate-800">
        <p>Mission Mates Interactive © 2026. Made with <Stars className="inline w-4 h-4 text-orange-400 mx-1" /> for kids everywhere.</p>
      </footer>
    </div>
  );
}
