import React, { useState } from 'react';
import { FileText, ShieldAlert, Copy, Check, Scale, BookOpen, AlertCircle, Info, Stethoscope, Search } from 'lucide-react';

interface PvAssistantProps {
  isDarkMode: boolean;
}

export const PvAssistant: React.FC<PvAssistantProps> = ({ isDarkMode }) => {
  const [selectedSalduzCat, setSelectedSalduzCat] = useState<'cat1' | 'cat2' | 'cat3' | 'cat4'>('cat3');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const salduzInfo = {
    cat1: {
      titel: 'Salduz Categorie I',
      doelgroep: 'Getuige / Slachtoffer / Aangever (Geen verdenking)',
      cautie:
        'U wordt gehoord als getuige/slachtoffer. U bent niet verplicht te antwoorden op vragen die u zouden kunnen zelfincrimineren. U kunt vragen dat alle vragen die u worden gesteld en de antwoorden die u geeft, worden genoteerd in de bewoordingen die u gebruikt.',
      rechten: [
        'Geen recht op bijstand van een advocaat tijdens het verhoor vereist',
        'Recht op toevoeging van stavingsstukken aan het dossier',
        'Recht op attest van klachtneerlegging / kopie van het verhoor'
      ]
    },
    cat2: {
      titel: 'Salduz Categorie II',
      doelgroep: 'Verdachte NIET van zijn vrijheid beroofd (Vrijwillig op kantoor / op straat)',
      cautie:
        'U wordt verhoord over feiten die u ten laste kunnen worden gelegd. U heeft het recht om vóór het verhoor een vertrouwelijk overleg te hebben met een advocaat naar keuze of een toegewezen advocaat. U bent niet verplicht uzelf te beschuldigen en u heeft het recht om te zwijgen. Alles wat u verklaart kan als bewijs in rechte worden gebruikt.',
      rechten: [
        'Voorafgaand vertrouwelijk overleg met een advocaat (tenzij afstand)',
        'Advocaat mag NIET aanwezig zijn tijdens het verhoor (tenzij uitdrukkelijk toegestaan door parket of bij specifieke uitzonderingen)',
        'Vrije vertrek na afloop van het verhoor'
      ]
    },
    cat3: {
      titel: 'Salduz Categorie III',
      doelgroep: 'Verdachte VAN DE VRIJHEID BEROOFD (Arrestatie / Bestuurlijke/Gerechtelijke aanhouding)',
      cautie:
        'U bent van uw vrijheid beroofd. U heeft recht op een vertrouwelijk overleg van 30 minuten met een advocaat en op de daadwerkelijke bijstand van uw advocaat tijdens het verhoor. U heeft het recht om te zwijgen en bent niet verplicht te antwoorden. U heeft het recht een vertrouwenspersoon en uw consulaat te laten inlichten en medische bijstand te vragen.',
      rechten: [
        '30 minuten vertrouwelijk overleg met advocaat vóór de start van het verhoor',
        'Verplichte aanwezigheid van de advocaat tijdens het verhoor (Salduz III bis)',
        'Medisch onderzoek door een arts op eenvoudig verzoek',
        'Kennisgeving aan een derde (vertrouwenspersoon)',
        'Maximale termijn van 48 uur vrijheidsbeneming alvorens voorleiding onderzoeksrechter'
      ]
    },
    cat4: {
      titel: 'Salduz Categorie IV',
      doelgroep: 'Verdachte van zijn vrijheid beroofd bij ZWARE MISDRIJVEN (Niveau 6-8 of overvallen/terrorisme)',
      cautie:
        'U bent van uw vrijheid beroofd voor zware misdrijven. U geniet alle rechten van Categorie III, inclusief verplichte advocaatbijstand en voorafgaand vertrouwelijk overleg. Gelet op de ernst van de feiten kan geen afstand worden gedaan van het recht op bijstand zonder toelating van de raadsman.',
      rechten: [
        'Absolute verplichte bijstand advocaat (geen afstand mogelijk zonder raadsman)',
        'Onmiddellijke kennisgeving aan de bevoegde magistraat (wachtparket)',
        'Voorbereiding van het dossier voor eventuele vordering onderzoeksrechter'
      ]
    }
  };

  const currentSalduz = salduzInfo[selectedSalduzCat];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              PV & Salduz Cautie Generator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Officiële cauties, medische attesten (Model 403bis) en juridische standaarden voor proces-verbaal.
            </p>
          </div>
        </div>
      </div>

      {/* Salduz Categorisering & Cauties */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Salduz Verhoor Categorieën
            </h3>
            <p className="text-xs text-slate-400">
              Selecteer de situatie van de te verhoren persoon voor de exacte wettelijke cautie.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {(['cat1', 'cat2', 'cat3', 'cat4'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedSalduzCat(cat)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                selectedSalduzCat === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                  : isDarkMode
                  ? 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="block text-[10px] opacity-80 uppercase tracking-wider">
                {cat === 'cat1' ? 'Getuige' : cat === 'cat2' ? 'Niet Aangehouden' : cat === 'cat3' ? 'Aangehouden' : 'Zware Feiten'}
              </span>
              <span className="text-sm block mt-0.5">{salduzInfo[cat].titel}</span>
            </button>
          ))}
        </div>

        {/* Selected Salduz Details */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Officiële Cautietekst om voor te lezen / op te nemen in PV:
              </span>
              <button
                onClick={() => handleCopy(currentSalduz.cautie, 'cautie')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                {copiedKey === 'cautie' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'cautie' ? 'Gekopieerd!' : 'Kopieer Cautie'}</span>
              </button>
            </div>
            <p className={`text-xs sm:text-sm font-mono leading-relaxed p-3 rounded-lg border ${
              isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-white text-slate-800 border-slate-200'
            }`}>
              "{currentSalduz.cautie}"
            </p>
          </div>

          {/* Rights Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Wettelijke Waarborgen & Rechten:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentSalduz.rechten.map((recht, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{recht}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Medisch Model 403bis & Vaststellingen Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-rose-500" />
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Medisch Attest Model 403bis (Slagen & Verwondingen)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            In het Nieuwe Strafwetboek bepaalt de graad van arbeidsongeschiktheid of blijvend letsel rechtstreeks de overgang tussen Strafniveau 1, 2, 3 en 4.
          </p>
          <ul className="space-y-2 text-xs">
            <li className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200'}`}>
              <strong className="text-emerald-400">Niveau 1:</strong> Geen arbeidsongeschiktheid of lichte kneuzingen.
            </li>
            <li className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200'}`}>
              <strong className="text-blue-400">Niveau 2:</strong> Tijdelijke arbeidsongeschiktheid (aangetoond door geneesheer).
            </li>
            <li className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200'}`}>
              <strong className="text-amber-400">Niveau 3:</strong> Blijvende arbeidsongeschiktheid of ernstig verlies van fysieke integriteit.
            </li>
            <li className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200'}`}>
              <strong className="text-rose-400">Niveau 4/5:</strong> Verlies van orgaan/lidmaat of dood zonder oogmerk te doden.
            </li>
          </ul>
        </div>

        <div className={`p-6 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-blue-500" />
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Zoeking in Voertuig & Inbeslagname
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Regels rond onderzoek en inbeslagname van verdovende middelen, wapens en gestolen goederen.
          </p>
          <ul className="space-y-2 text-xs">
            <li className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200'}`}>
              <strong className="text-blue-400">Art. 38 WPA:</strong> Doorzoeking van een voertuig bij ernstige aanwijzingen van misdrijf of wapendracht.
            </li>
            <li className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200'}`}>
              <strong className="text-blue-400">Heterdaad (Art. 41 Sv.):</strong> Onmiddellijke inbeslagname van alle overtuigingsstukken, wapens en breekmateriaal.
            </li>
            <li className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200'}`}>
              <strong className="text-blue-400">Art. 88quater Sv.:</strong> Veiligstellen van camerabeelden, gsm-gegevens en digitale dragers.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
