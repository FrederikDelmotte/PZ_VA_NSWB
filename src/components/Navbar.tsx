import React from 'react';
import { Shield, BookOpen, Scale, FileText, Moon, Sun, Sparkles, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'matrix' | 'articles' | 'pv_helper';
  setActiveTab: (tab: 'analyzer' | 'matrix' | 'articles' | 'pv_helper') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <header
      id="main-navbar"
      className={`border-b sticky top-0 z-50 backdrop-blur-md transition-colors ${
        isDarkMode
          ? 'bg-slate-900/95 border-slate-800 text-white'
          : 'bg-slate-900 border-slate-800 text-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  PZ VA <span className="text-blue-400">Strafwet V3</span>
                </span>
                <span className="bg-blue-900/80 text-blue-300 text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-blue-500/30 tracking-wider">
                  Nieuw Sw. 2024
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                AI Kwalificatie & PV-Assistent • Boek 1 & 2
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Hoofdnavigatie">
            <button
              id="nav-tab-analyzer"
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>Casus Scanner</span>
            </button>

            <button
              id="nav-tab-matrix"
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4 text-blue-300" />
              <span>8 Strafniveaus</span>
            </button>

            <button
              id="nav-tab-articles"
              onClick={() => setActiveTab('articles')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'articles'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-300" />
              <span className="hidden md:inline">Wetboek Boek 2</span>
              <span className="md:hidden">Artikelen</span>
            </button>

            <button
              id="nav-tab-pv"
              onClick={() => setActiveTab('pv_helper')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'pv_helper'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-300" />
              <span className="hidden md:inline">PV & Salduz Cautie</span>
              <span className="md:hidden">PV Hulp</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2">
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode((prev: boolean) => !prev)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
              title={isDarkMode ? 'Wissel naar Dagmodus' : 'Wissel naar Tactische Nachtmodus'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-300" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
