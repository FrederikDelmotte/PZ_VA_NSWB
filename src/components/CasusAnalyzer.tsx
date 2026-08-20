import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  Clock,
  ArrowRight,
  BookOpen,
  CornerDownRight,
  MessageSquare,
  RefreshCw,
  Info,
  CheckSquare,
  Square,
  ShieldAlert,
  Flame,
  Car,
  Home,
  Pill,
  Crosshair,
  ShoppingBag,
  Paintbrush
} from 'lucide-react';
import { QUICK_CASUS_PRESETS } from '../data/strafwetboekData';
import { CaseAnalysisResult, ChatMessage } from '../types';
import { VoiceInput } from './VoiceInput';

interface CasusAnalyzerProps {
  isDarkMode: boolean;
}

export const CasusAnalyzer: React.FC<CasusAnalyzerProps> = ({ isDarkMode }) => {
  const [casusInput, setCasusInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CaseAnalysisResult | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState<{ id: string; casus: string; result: CaseAnalysisResult; time: string }[]>([]);

  // Function to analyze casus
  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || casusInput;
    if (!text.trim()) return;

    setIsLoading(true);
    setCheckedItems({});

    try {
      const response = await fetch('/api/gemini/analyze-casus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ casus: text }),
      });

      if (!response.ok) {
        throw new Error('Fout bij het ophalen van de analyse');
      }

      const data = await response.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
        
        // Save to recent
        const newEntry = {
          id: Date.now().toString(),
          casus: text,
          result: data.analysis,
          time: new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
        };
        setRecentAnalyses(prev => [newEntry, ...prev.slice(0, 4)]);
        
        // Initialize follow-up chat context
        setChatMessages([
          {
            id: 'init-msg',
            role: 'assistant',
            content: `Ik heb het feitenrelaas geanalyseerd volgens het Nieuw Strafwetboek 2024. De hoofdkwalificatie is **${data.analysis.hoofdkwalificatie}** (Strafniveau ${data.analysis.strafniveau}). Stel gerust vervolgvragen over verhoor, Salduz-cautie, verzwarende omstandigheden of specifieke wettige maatregelen.`,
            timestamp: new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }),
            analysis: data.analysis
          }
        ]);
      }
    } catch (err: any) {
      console.error('Analyse fout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          casusContext: analysisResult ? JSON.stringify(analysisResult) : casusInput
        })
      });

      const data = await response.json();
      if (data.reply) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getNiveauBadgeColor = (niveau: number) => {
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

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car': return <Car className="w-3.5 h-3.5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'Home': return <Home className="w-3.5 h-3.5" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5" />;
      case 'Pill': return <Pill className="w-3.5 h-3.5" />;
      case 'Crosshair': return <Crosshair className="w-3.5 h-3.5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'Paintbrush': return <Paintbrush className="w-3.5 h-3.5" />;
      default: return <Scale className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Introduction Card */}
      <div
        id="banner-operational-guidance"
        className={`p-5 rounded-2xl border transition-all ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Nieuw Belgisch Strafwetboek (2024)
              </span>
              <span className="text-xs text-slate-400 font-medium">Boek 1 & Boek 2</span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Van Casus naar Wetsartikel & Kwalificatie
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Voer een feitenrelaas in of dicteer mondeling. De AI identificeert direct het juiste artikel, het exacte strafniveau (1 t/m 8), de constitutieve bestanddelen en genereert een kant-en-klaar PV-voorstel.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold">
                8
              </div>
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>8 Strafniveaus</p>
                <p className="text-slate-400 text-[11px]">Uniforme straftoemeting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <textarea
              id="input-feitenrelaas"
              value={casusInput}
              onChange={(e) => setCasusInput(e.target.value)}
              placeholder="Typ of spreek hier het feitenrelaas in... Bijv.: 'Verdachte sloeg slachtoffer in het gezicht met een bierglas tijdens caféruzie, 6 hechtingen' of 'Ruit ingetikt van wagen op parking, handtas met portefeuille ontvreemd'..."
              rows={4}
              className={`w-full p-4 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                isDarkMode
                  ? 'bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-transparent'
                  : 'bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 focus:bg-white'
              }`}
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <VoiceInput
                onTranscript={(transcript) => {
                  setCasusInput(prev => prev ? `${prev} ${transcript}` : transcript);
                }}
                isDarkMode={isDarkMode}
                disabled={isLoading}
              />
              
              <button
                id="btn-submit-analyse"
                onClick={() => handleAnalyze()}
                disabled={isLoading || !casusInput.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Wetsartikelen analyseren...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Kwalificeer Feiten</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets for Patrol / Interventions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Snelkeuze Casussen (Veelvoorkomend op het terrein):
              </span>
              {casusInput && (
                <button
                  onClick={() => setCasusInput('')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 transition"
                >
                  Wissen
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_CASUS_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  onClick={() => {
                    setCasusInput(preset.casusTekst);
                    handleAnalyze(preset.casusTekst);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isDarkMode
                      ? 'bg-slate-800/80 hover:bg-slate-800 hover:border-blue-500/50 text-slate-300 border-slate-700/80'
                      : 'bg-white hover:bg-slate-50 hover:border-blue-400 text-slate-700 border-slate-200 shadow-2xs'
                  }`}
                >
                  <span className="text-blue-500">{getPresetIcon(preset.icon)}</span>
                  <span>{preset.titel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Result Display */}
      {isLoading && (
        <div className={`p-10 rounded-2xl border text-center space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto animate-bounce">
            <Scale className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Nieuw Strafwetboek raadplegen...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Zoeken naar wetsartikelen, bepalen van strafniveau (Boek 1) en constitutieve bestanddelen (Boek 2).
            </p>
          </div>
        </div>
      )}

      {analysisResult && !isLoading && (
        <div id="section-analysis-results" className="space-y-6 animate-in fade-in duration-300">
          {/* Main Qualification Header */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-700/50 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${getNiveauBadgeColor(analysisResult.strafniveau)}`}>
                    <Scale className="w-4 h-4" />
                    Strafniveau {analysisResult.strafniveau}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    {analysisResult.salduzCategorie}
                  </span>

                  {analysisResult.dadingOfBemiddelingMogelijk && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Dading/Bemiddeling Mogelijk
                    </span>
                  )}
                </div>

                <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {analysisResult.hoofdkwalificatie}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-blue-400">Toepasselijke artikelen:</span>
                  {analysisResult.wetsartikelen.map((art, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono border border-blue-500/20">
                      {art}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strafmaat Vork Card */}
              <div className={`p-4 rounded-xl border text-xs space-y-2 min-w-[280px] ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between font-semibold pb-1.5 border-b border-slate-700/50">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Wettelijke Strafmaat</span>
                  <span className="text-blue-400 font-mono">Niveau {analysisResult.strafniveau}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gevangenisstraf:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {analysisResult.strafmaatVork.gevangenisstraf}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Geldboete:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {analysisResult.strafmaatVork.geldboete}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Alternatieven:</span>
                    <span className="text-blue-400 font-medium text-[11px] text-right max-w-[170px]">
                      {analysisResult.strafmaatVork.alternatieven}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Constitutive Elements: 3-column breakdown */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-400" />
                Constitutieve Bestanddelen van het Misdrijf
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Materieel Element */}
                <div className={`p-4 rounded-xl border ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      1. Materieel Element (Actus Reus)
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {analysisResult.constitutieveBestanddelen.materieelElement}
                  </p>
                </div>

                {/* Moreel Element */}
                <div className={`p-4 rounded-xl border ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      2. Moreel Element (Mens Rea)
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {analysisResult.constitutieveBestanddelen.moreelElement}
                  </p>
                </div>

                {/* Wederrechtelijkheid */}
                <div className={`p-4 rounded-xl border ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      3. Wederrechtelijkheid
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {analysisResult.constitutieveBestanddelen.wederrechtelijkheid}
                  </p>
                </div>
              </div>
            </div>

            {/* Aggravating circumstances & Secondary offenses */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-amber-950/20 border-amber-900/30' : 'bg-amber-50/50 border-amber-200/60'
              }`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                    Verzwarende Omstandigheden & Strafverhoging
                  </h4>
                </div>
                <ul className="space-y-1.5">
                  {analysisResult.verzwarendeOmstandigheden.map((item, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-1.5 text-slate-300 dark:text-slate-300">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-blue-950/20 border-blue-900/30' : 'bg-blue-50/50 border-blue-200/60'
              }`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Operationeel Advies & Dading
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-300 mb-2">
                  {analysisResult.operationeelAdvies}
                </p>
                <div className="text-[11px] text-slate-400 border-t border-slate-700/40 pt-1.5">
                  <span className="font-semibold text-slate-300">Dading/Herstel: </span>
                  {analysisResult.dadingToelichting}
                </div>
              </div>
            </div>
          </div>

          {/* PV Formulation & Ready-to-copy snippet */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                  PV
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Voorstel Kwalificatie & Tenlastelegging (ISLP / FEEDIS)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formele bewoordingen voor het opstellen van het proces-verbaal.
                  </p>
                </div>
              </div>

              <button
                id="btn-copy-pv-text"
                onClick={() => handleCopy(analysisResult.pvVoorstelKwalificatie, 'pv')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition self-start sm:self-auto"
              >
                {copiedKey === 'pv' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Gekopieerd!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Kopieer PV-Tekst</span>
                  </>
                )}
              </button>
            </div>

            <div className={`p-4 rounded-xl font-mono text-xs leading-relaxed border select-all ${
              isDarkMode
                ? 'bg-slate-950 text-emerald-300 border-slate-800'
                : 'bg-slate-50 text-emerald-800 border-slate-200'
            }`}>
              {analysisResult.pvVoorstelKwalificatie}
            </div>
          </div>

          {/* On-Scene Checklist & Evidence Collection */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-500" />
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Checklist Vaststellingen & Bewijs Ter Plaatse
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {Object.values(checkedItems).filter(Boolean).length} / {analysisResult.vaststellingenChecklist.length} voltooid
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {analysisResult.vaststellingenChecklist.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? isDarkMode
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                          : 'bg-emerald-50 border-emerald-200 text-slate-800'
                        : isDarkMode
                        ? 'bg-slate-950/50 hover:bg-slate-800/50 border-slate-800 text-slate-300'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-emerald-500 focus:outline-none"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <span className={`text-xs leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Follow-up Chat with Police AI Assistant */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Vervolgvragen & Juridische Helpdesk
                </h3>
                <p className="text-xs text-slate-400">
                  Stel verdiepende vragen over deze casus (bv. minderjarigheid, Salduz verhoor, wettige zelfverdediging).
                </p>
              </div>
            </div>

            {/* Chat conversation stream */}
            <div className={`space-y-3 p-4 rounded-xl max-h-96 overflow-y-auto border mb-3 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                        : isDarkMode
                        ? 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none'
                    }`}
                  >
                    <div className="font-semibold text-[10px] text-slate-400 mb-1 flex items-center justify-between gap-4">
                      <span>{msg.role === 'user' ? 'Inspecteur' : 'AI Juridisch Adviseur'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span>AI formuleert juridisch antwoord...</span>
                </div>
              )}
            </div>

            {/* Quick suggested follow-up chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                'Wat als de verdachte minderjarig is (16-17 jaar)?',
                'Welke Salduz-cautie moet ik exact voorlezen?',
                'Is hier sprake van wettige zelfverdediging?',
                'Wat zijn de regels rond zoeking in het voertuig?'
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChatInput(query);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                    isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Chat input form */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                id="input-chat-followup"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Stel een vraag over de casus of procedure..."
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? 'bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800'
                    : 'bg-white text-slate-900 placeholder-slate-400 border border-slate-200'
                }`}
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition shadow-sm shadow-blue-600/30"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Verstuur</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
