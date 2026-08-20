import React, { useState } from 'react';
import { Search, BookOpen, Filter, ChevronDown, ChevronUp, Copy, Check, Scale, AlertCircle } from 'lucide-react';
import { OFFICIAL_LEGAL_ARTICLES } from '../data/strafwetboekData';
import { LegalArticle } from '../types';

interface WetboekBrowserProps {
  isDarkMode: boolean;
  onSelectArticleForCasus?: (article: LegalArticle) => void;
}

export const WetboekBrowser: React.FC<WetboekBrowserProps> = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>('art-diefstal-braak');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'Alle',
    'Fysieke Integriteit',
    'Eigendom & Vermogen',
    'Openbaar Gezag & Politie',
    'Persoonlijke Vrijheid & Privacy',
    'Computercriminaliteit'
  ];

  const filteredArticles = OFFICIAL_LEGAL_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'Alle' || art.categorie === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      art.titel.toLowerCase().includes(q) ||
      art.artikelNummer.toLowerCase().includes(q) ||
      art.omschrijving.toLowerCase().includes(q) ||
      art.materieelElement.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getNiveauColor = (lvl: number) => {
    switch (lvl) {
      case 1: return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 2: return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 3: return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 4: return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
      default: return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search and Filters Header */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Nieuw Strafwetboek • Boek 2 Bibliotheek
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Raadpleeg en zoek rechtstreeks in de officiële misdrijfkwalificaties, constitutieve bestanddelen en verzwarende omstandigheden.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="input-search-articles"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek op artikelnummer, misdrijf of trefwoord (bv. braak, weerspannigheid, stalking)..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800'
                  : 'bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 focus:bg-white'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className={`p-10 rounded-2xl border text-center ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Geen artikelen gevonden</p>
            <p className="text-xs text-slate-400 mt-1">Probeer een andere zoekterm of categorie.</p>
          </div>
        ) : (
          filteredArticles.map((art) => {
            const isExpanded = expandedArticleId === art.id;
            return (
              <div
                key={art.id}
                id={`article-card-${art.id}`}
                className={`rounded-2xl border transition-all ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 w-fit">
                      {art.artikelNummer}
                    </span>
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {art.titel}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${getNiveauColor(art.basisNiveau)}`}>
                      Niveau {art.basisNiveau}
                    </span>
                    <button className="text-slate-400 hover:text-slate-200">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 dark:border-slate-800 space-y-4 text-xs">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Wettelijke Omschrijving
                      </h4>
                      <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {art.omschrijving}
                      </p>
                    </div>

                    {/* Constitutieve Bestanddelen Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className={`p-3.5 rounded-xl border ${
                        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px] block mb-1">
                          Materieel Element
                        </span>
                        <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                          {art.materieelElement}
                        </p>
                      </div>

                      <div className={`p-3.5 rounded-xl border ${
                        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] block mb-1">
                          Moreel Element
                        </span>
                        <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                          {art.moreelElement}
                        </p>
                      </div>
                    </div>

                    {/* Aggravating circumstances */}
                    {art.verzwarendeOmstandigheden.length > 0 && (
                      <div className={`p-3.5 rounded-xl border ${
                        isDarkMode ? 'bg-amber-950/20 border-amber-900/30' : 'bg-amber-50/50 border-amber-200/60'
                      }`}>
                        <span className="font-bold text-amber-500 uppercase tracking-wider text-[10px] block mb-1.5">
                          Verzwarende Omstandigheden
                        </span>
                        <ul className="space-y-1">
                          {art.verzwarendeOmstandigheden.map((item, i) => (
                            <li key={i} className="text-slate-300 dark:text-slate-300 flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* PV Tenlastelegging helper */}
                    <div className={`p-3.5 rounded-xl border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                          PV Formulering (ISLP)
                        </span>
                        <button
                          onClick={() => handleCopy(art.pvFormulering, art.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                        >
                          {copiedId === art.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === art.id ? 'Gekopieerd' : 'Kopieer'}</span>
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-slate-300 leading-relaxed">
                        {art.pvFormulering}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
