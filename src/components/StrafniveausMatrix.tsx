import React, { useState } from 'react';
import { Scale, Info, Shield, CheckCircle2, ChevronRight, Gavel, Layers, ArrowUpDown } from 'lucide-react';
import { STRAFNIVEAUS } from '../data/strafwetboekData';
import { StrafniveauInfo } from '../types';

interface StrafniveausMatrixProps {
  isDarkMode: boolean;
}

export const StrafniveausMatrix: React.FC<StrafniveausMatrixProps> = ({ isDarkMode }) => {
  const [selectedNiveau, setSelectedNiveau] = useState<number>(2);

  const getNiveauBadgeClass = (niveau: number) => {
    switch (niveau) {
      case 1:
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 2:
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 3:
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 4:
        return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 5:
      case 6:
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 7:
      case 8:
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const currentInfo: StrafniveauInfo = STRAFNIVEAUS[selectedNiveau] || STRAFNIVEAUS[1];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Overview Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                Boek 1 • Nieuw Strafwetboek
              </span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              De 8 Strafniveaus voor Natuurlijke Personen
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Het nieuwe wetboek vervangt de historische driedeling (overtreding - wanbedrijf - misdaad) door een transparante straffenladder van 8 niveaus. Hierdoor zijn strafmaten direct afleesbaar en voorspelbaar voor inspecteurs en parket.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Gavel className="w-5 h-5 text-blue-500" />
              <div>
                <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Uniforme Straftoemeting</p>
                <p className="text-slate-400 text-[11px]">Vanaf Niveau 1 tot Levenslang</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 8 Levels Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => {
          const isSelected = selectedNiveau === lvl;
          const info = STRAFNIVEAUS[lvl];
          return (
            <button
              key={lvl}
              id={`tab-strafniveau-${lvl}`}
              onClick={() => setSelectedNiveau(lvl)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? isDarkMode
                    ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-blue-50 border-blue-500 shadow-sm'
                  : isDarkMode
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-black px-2 py-0.5 rounded border ${getNiveauBadgeClass(lvl)}`}>
                  Niveau {lvl}
                </span>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                )}
              </div>
              <p className={`text-[11px] font-bold truncate mt-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {lvl === 8 ? 'Levenslang' : info.gevangenisstraf.split('(')[0]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed Level Viewer */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-700/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-3 py-1 rounded-lg text-xs font-black border uppercase tracking-wider ${getNiveauBadgeClass(currentInfo.niveau)}`}>
                Strafniveau {currentInfo.niveau}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Bevoegdheid: <strong className="text-slate-300 dark:text-slate-200">{currentInfo.bevoegdeRechtbank}</strong>
              </span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {currentInfo.titel}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {currentInfo.beschrijving}
            </p>
          </div>
        </div>

        {/* 3 Main Sanction Categories for this level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Gevangenisstraf */}
          <div className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Gevangenisstraf
              </h4>
            </div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {currentInfo.gevangenisstraf}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {selectedNiveau <= 2 ? 'Subsidiair: Rechter moet alternatieven prioritair onderzoeken' : 'Primaire hoofdstraf'}
            </p>
          </div>

          {/* Alternatieve Straffen */}
          <div className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Alternatieve & Autonome Straffen
              </h4>
            </div>
            <ul className="space-y-1">
              {currentInfo.alternatieveStraffen.map((alt, i) => (
                <li key={i} className="text-xs text-slate-300 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Geldboete */}
          <div className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Geldstraf / Boete
              </h4>
            </div>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {currentInfo.geldboete}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Basisbedrag vermeld in wetboek (onderhevig aan opdeciemen / indexering).
            </p>
          </div>
        </div>

        {/* Typical Example Offenses */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-400" />
            Veelvoorkomende Misdrijven binnen Niveau {currentInfo.niveau}:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {currentInfo.voorbeelden.map((vb, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{vb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
