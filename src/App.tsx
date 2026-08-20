import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CasusAnalyzer } from './components/CasusAnalyzer';
import { StrafniveausMatrix } from './components/StrafniveausMatrix';
import { WetboekBrowser } from './components/WetboekBrowser';
import { PvAssistant } from './components/PvAssistant';
import { Shield, ExternalLink, Info, Award, FileCode } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'matrix' | 'articles' | 'pv_helper'>('analyzer');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Sync dark class on root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Police Banner & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'analyzer' && <CasusAnalyzer isDarkMode={isDarkMode} />}
        {activeTab === 'matrix' && <StrafniveausMatrix isDarkMode={isDarkMode} />}
        {activeTab === 'articles' && <WetboekBrowser isDarkMode={isDarkMode} />}
        {activeTab === 'pv_helper' && <PvAssistant isDarkMode={isDarkMode} />}
      </main>

      {/* Bottom Footer with Official References */}
      <footer className={`mt-12 border-t py-6 text-xs transition-colors ${
        isDarkMode ? 'bg-slate-950 border-slate-800/80 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-300 dark:text-slate-200">
              PZ VA Strafwet V3
            </span>
            <span>• Operationeel AI-assistent voor politie-inspecteurs</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/20">
              Wet van 29 februari 2024 (Nieuw Strafwetboek)
            </span>
            <a
              href="https://notebook.google.com/notebook/8c0ccd86-7be8-4c86-9c3d-2f77a76ce00e"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 flex items-center gap-1 transition"
            >
              <span>Officiële Notebook Bron</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
