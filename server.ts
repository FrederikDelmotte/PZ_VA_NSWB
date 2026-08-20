import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System prompt grounding the model strictly in the Nieuw Belgisch Strafwetboek 2024 (Boek 1 & Boek 2)
// Officiële Belgisch Staatsblad bronnen:
// - Boek 1: http://www.ejustice.just.fgov.be/eli/wet/2024/02/29/2024002052/staatsblad
// - Boek 2: http://www.ejustice.just.fgov.be/eli/wet/2024/02/29/2024002088/staatsblad
const POLICE_LEGAL_SYSTEM_PROMPT = `
Je bent een gespecialiseerde juridische AI-assistent en adviseur voor Belgische politie-inspecteurs (Politiezone PZ VA).
Je bent exclusief en strikt getraind op en gebaseerd op de officiële publicaties in het Belgisch Staatsblad betreffende het NIEUWE BELGISCHE STRAFWETBOEK:
1. Wet van 29 februari 2024 tot invoering van Boek 1 van het Strafwetboek (BS 08.03.2024): http://www.ejustice.just.fgov.be/eli/wet/2024/02/29/2024002052/staatsblad
2. Wet van 29 februari 2024 tot invoering van Boek 2 van het Strafwetboek (BS 08.03.2024): http://www.ejustice.just.fgov.be/eli/wet/2024/02/29/2024002088/staatsblad

Je antwoordt en analyseert UITSLEUTEND op basis van de bepalingen, artikelen en wettelijke kaders uit deze specifieke twee bronnen uit het Belgisch Staatsblad. Gebruik geen externe verouderde wetgeving of aannames.

KERNREGELS VAN HET NIEUWE STRAFWETBOEK (2024):
1. STRAFNIVEAUS (BOEK 1):
   - Het oude onderscheid tussen overtreding, wanbedrijf en misdaad is hervormd tot een uniform systeem van 8 strafniveaus voor natuurlijke personen:
     * Niveau 1: max. 6 maanden gevangenisstraf (of probatie 6m-2j, werkstraf 20u-120u, geldboete €200-€20.000). Focus op herstel/dading.
     * Niveau 2: > 6 maanden tot 3 jaar (of probatie 1j-3j, werkstraf 120u-300u, geldboete €1.000-€100.000).
     * Niveau 3: > 3 jaar tot 5 jaar (of probatie 2j-5j, geldboete €2.000-€200.000).
     * Niveau 4: > 5 jaar tot 10 jaar (geldboete €5.000-€500.000).
     * Niveau 5: > 10 jaar tot 15 jaar (geldboete €10.000-€1.000.000).
     * Niveau 6: > 15 jaar tot 20 jaar (geldboete €20.000-€2.000.000).
     * Niveau 7: > 20 jaar tot 30 jaar (geldboete €50.000-€5.000.000 - o.a. Doodslag).
     * Niveau 8: Levenslange gevangenisstraf (o.a. Moord / doodslag met voorbedachten rade, terrorisme).

2. MISDRIJVEN (BOEK 2):
   - Misdrijven tegen de fysieke integriteit (Slagen en verwondingen, doodslag, moord, marteling)
   - Misdrijven tegen de persoonlijke vrijheid & privacy (Huisvredebreuk, belaging/stalking, wederrechtelijke vrijheidsberoving)
   - Seksuele misdrijven (Aanranding, verkrachting, voyeurisme)
   - Eigendomsmisdrijven (Diefstal, diefstal met braak/inklimming/valse sleutels, diefstal met geweld, oplichting, informaticabedrog, heling)
   - Misdrijven tegen het openbaar gezag en de politie (Weerspannigheid met/zonder geweld/wapens, smaad, geweld tegen politieambtenaren - verzwarende omstandigheid leidt tot verhoging niveau)
   - Misdrijven tegen openbare veiligheid (Wapendracht, verdovende middelen / drugs)
   - Vernieling / Beschadiging / Vandalisme

3. ROL & OUTPUT VOOR DE INSPECTEUR:
   - Geef altijd een heldere, operationele en juridisch waterdichte kwalificatie.
   - Benoem exact het materieel element (actus reus), moreel element (mens rea / opzet / oogmerk) en de wederrechtelijkheid.
   - Geef concrete vaststellingstips voor het terrein (foto's, camerabeelden, 403bis medisch attest, inbeslagname).
   - Formuleer een kant-en-klaar voorstel voor de tenlastelegging / PV-tekst geschikt voor ISLP / FEEDIS.
   - Bepaal de Salduz Categorie (I, II, III of IV).
`;

// Helper for fallback rule-based analysis if offline/no key
function generateFallbackAnalysis(casus: string) {
  const lower = casus.toLowerCase();
  
  if (lower.includes('ruit') || lower.includes('auto') || lower.includes('voertuig') || lower.includes('inbraak') || lower.includes('braak') || lower.includes('gestolen') || lower.includes('diefstal')) {
    const hasBraak = lower.includes('ruit') || lower.includes('braak') || lower.includes('ingetikt') || lower.includes('slot') || lower.includes('geforceerd');
    const hasGeweld = lower.includes('geweld') || lower.includes('bedreig') || lower.includes('geslagen') || lower.includes('geduwd');
    
    if (hasGeweld) {
      return {
        hoofdkwalificatie: 'Diefstal met geweld of bedreiging',
        wetsartikelen: ['Art. 468 - 471 Nieuw Strafwetboek (Boek 2)'],
        strafniveau: 3,
        strafniveauUitleg: 'Niveau 3: Gevangenisstraf van meer dan 3 jaar tot 5 jaar, of probatiestraf / geldboete niveau 3.',
        strafmaatVork: {
          gevangenisstraf: 'Meer dan 3 jaar tot 5 jaar',
          alternatieven: 'Probatiestraf 2j-5j, geldstraf',
          geldboete: '€ 2.000 tot € 200.000'
        },
        constitutieveBestanddelen: {
          materieelElement: 'Wegneming van andermans roerend goed vergezeld van fysiek geweld of morele bedreiging.',
          moreelElement: 'Bedrieglijk opzet tot toe-eigening (animus furandi) en opzettelijk geweld/bedreiging.',
          wederrechtelijkheid: 'Zonder toestemming van de rechthebbende en buiten elk wettelijk recht.'
        },
        verzwarendeOmstandigheden: [
          'Gebruik of dreiging met een wapen of schijnwapen (verhoogt naar Niveau 4)',
          'Gepleegd in bende of met meerdere daders',
          'Slachtoffer met lichamelijk letsel of arbeidsongeschiktheid'
        ],
        verzachtendeOmstandigheden: ['Geen voorafgaande veroordelingen', 'Volledige teruggave van de goederen'],
        vaststellingenChecklist: [
          'Medisch attest slachtoffer / letsels documenteren (Model 403bis)',
          'Camerabeelden van de winkel/plaats van de feiten veiligstellen',
          'Daderbeschrijving en vluchtrichting onmiddellijk seinen',
          'Inbeslagname van kleding/buit/wapen'
        ],
        pvVoorstelKwalificatie: 'Verdenking van diefstal met geweld/bedreiging (Niveau 3, Nieuw Sw.): "Heeft te [Plaats], op [Datum], bedrieglijk andermans goed weggenomen met behulp van fysiek geweld en/of bedreigingen ten aanzien van [Slachtoffer]."',
        salduzCategorie: 'Categorie III (Met vrijheidsbeneming - gewone feiten)',
        dadingOfBemiddelingMogelijk: false,
        dadingToelichting: 'Bij geweldsmisdrijven is dading in de regel uitgesloten of strikt ter beoordeling van het parket.',
        aanvullendeMisdrijven: ['Opzettelijke slagen en verwondingen', 'Bedreigingen'],
        operationeelAdvies: 'Verhoor verdachte conform Salduz III met voorafgaand vertrouwelijk overleg met een advocaat. Slachtoffer doorverwijzen naar Dienst Slachtofferzorg.'
      };
    }

    if (hasBraak) {
      return {
        hoofdkwalificatie: 'Diefstal met braak / inklimming / valse sleutels',
        wetsartikelen: ['Art. 467 Nieuw Strafwetboek (Boek 2)', 'Art. 461 Nieuw Sw.'],
        strafniveau: 3,
        strafniveauUitleg: 'Niveau 3: Gevangenisstraf van meer dan 3 jaar tot 5 jaar, of probatiestraf / geldboete niveau 3.',
        strafmaatVork: {
          gevangenisstraf: 'Meer dan 3 jaar tot 5 jaar',
          alternatieven: 'Probatiestraf 2j-5j, geldstraf niveau 3',
          geldboete: '€ 2.000 tot € 200.000'
        },
        constitutieveBestanddelen: {
          materieelElement: 'Wegneming van andermans roerend goed met behulp van uitwendige of inwendige braak (forceren ruit, slot, raam) of inklimming.',
          moreelElement: 'Bedrieglijk opzet tot toe-eigening (animus furandi).',
          wederrechtelijkheid: 'Zonder toestemming van de eigenaar/gebruiker.'
        },
        verzwarendeOmstandigheden: [
          'Gepleegd in een bewoond pand of voertuig',
          'Gepleegd bij nacht (tussen zonsondergang en zonsopgang)',
          'Gepleegd door 2 of meer personen (mededaderschap)',
          'Gebruik van nagemaakte of elektronisch gescande sleutels'
        ],
        verzachtendeOmstandigheden: ['Spontane teruggave', 'Schadevergoeding'],
        vaststellingenChecklist: [
          'Fotoreportage van de braakschade (ingeslagen ruit, breeksporen aan deurslot)',
          'Vinger- en DNA-sporenonderzoek (stuur, dashboardkastje, handgrepen)',
          'Camerabeelden parking/omgeving opvragen',
          'Lijst gestolen goederen met serienummers (GSM IMEI, bankkaarten, portefeuille)'
        ],
        pvVoorstelKwalificatie: 'Verdenking van diefstal met braak (Niveau 3, Nieuw Sw.): "Heeft te [Plaats], op [Datum], bedrieglijk weggenomen [Goederen], ten nadele van [Slachtoffer], met de verzwarende omstandigheid van uitwendige braak aan het voertuig/pand."',
        salduzCategorie: 'Categorie III (Met vrijheidsbeneming - gewone feiten)',
        dadingOfBemiddelingMogelijk: true,
        dadingToelichting: 'Bij vermogensmisdrijven zonder geweld kan het parket een bemiddeling in strafzaken of dading voorstellen indien de schade integraal wordt vergoed.',
        aanvullendeMisdrijven: ['Opzettelijke beschadiging van andermans roerend goed (Art. 528 Nieuw Sw.)'],
        operationeelAdvies: 'Bankkaarten onmiddellijk laten blokkeren via Card Stop. IMEI-nummers seinen in ANG/ISLP.'
      };
    }
  }

  if (lower.includes('politie') || lower.includes('agent') || lower.includes('inspecteur') || lower.includes('weerspannigheid') || lower.includes('smaad') || lower.includes('verzet')) {
    return {
      hoofdkwalificatie: 'Weerspannigheid en/of geweld tegen een drager van het openbaar gezag',
      wetsartikelen: ['Art. 269 e.v. Nieuw Strafwetboek (Boek 2)', 'Art. 398 e.v. (verzwarende omstandigheid)'],
      strafniveau: 2,
      strafniveauUitleg: 'Niveau 2 (basis) tot Niveau 3 (met wapens/bende/letsels): Gevangenisstraf van 6 maanden tot 3 jaar (of tot 5 jaar).',
      strafmaatVork: {
        gevangenisstraf: 'Meer dan 6 maanden tot 3 jaar (of > 3j tot 5j bij verzwarende omstandigheden)',
        alternatieven: 'Probatiestraf 1j-3j, werkstraf 120u-300u',
        geldboete: '€ 1.000 tot € 100.000'
      },
      constitutieveBestanddelen: {
        materieelElement: 'Elke gewelddadige handeling, slagen, schoppen of fysiek verzet tegen politieambtenaren handelend ter uitvoering van hun wettige opdracht.',
        moreelElement: 'Wetens en willens verzet plegen tegen een politieambtenaar in functie.',
        wederrechtelijkheid: 'De politie-interventie gebeurde regelmatig en binnen de wettelijke bevoegdheden.'
      },
      verzwarendeOmstandigheden: [
        'Slachtoffer is politieambtenaar in de uitoefening van de functie (wettelijke strafverhoging)',
        'Gepleegd met wapens of voorwerpen als wapen aangewend',
        'Gepleegd in vereniging (meerdere personen)'
      ],
      verzachtendeOmstandigheden: ['Verdachte onder invloed met naderhand spijtbetuiging'],
      vaststellingenChecklist: [
        'Bodycam- en dashcambeelden veiligstellen en verbaliseren',
        'Medisch attest van de gekwetste politie-inspecteur bijvoegen',
        'Foto\'s van eventueel beschadigde politie-uniformen of uitrusting',
        'Grondslag van de initiële controle/interventie nauwgezet omschrijven'
      ],
      pvVoorstelKwalificatie: 'Verdenking van weerspannigheid en opzettelijke slagen jegens politieambtenaar (Niveau 2/3, Nieuw Sw.): "Heeft te [Plaats], op [Datum], met geweld/bedreiging weerspannigheid gepleegd en vrijwillig slagen toegebracht aan [Naam Inspecteurs], politieambtenaren van PZ [Zone], handelend in de uitoefening van hun functie."',
      salduzCategorie: 'Categorie III (Met vrijheidsbeneming - gewone feiten)',
      dadingOfBemiddelingMogelijk: false,
      dadingToelichting: 'Aantasting van openbaar gezag en politiegeweld worden prioritair vervolgd door het parket.',
      aanvullendeMisdrijven: ['Smaad aan dragers van het openbaar gezag', 'Opzettelijke slagen en verwondingen'],
      operationeelAdvies: 'Contacteer de wachtmagistraat van het Parket i.v.m. eventuele voorleiding bij de onderzoeksrechter.'
    };
  }

  // Generic fallback
  return {
    hoofdkwalificatie: 'Opzettelijke aantasting van personen of goederen',
    wetsartikelen: ['Nieuw Strafwetboek (Wet 29 februari 2024, Boek 2)'],
    strafniveau: 2,
    strafniveauUitleg: 'Niveau 2: Gevangenisstraf van meer dan 6 maanden tot 3 jaar of autonome werkstraf/probatiestraf.',
    strafmaatVork: {
      gevangenisstraf: 'Meer dan 6 maanden tot 3 jaar',
      alternatieven: 'Probatiestraf 1j-3j, werkstraf 120u-300u',
      geldboete: '€ 1.000 tot € 100.000'
    },
    constitutieveBestanddelen: {
      materieelElement: 'Feitelijke gedraging die de wet verbiedt.',
      moreelElement: 'Algemeen of bijzonder opzet (wetens en willens handelen).',
      wederrechtelijkheid: 'Ontbreken van een rechtvaardigingsgrond (zoals wettige verdediging of wettelijk voorschrift).'
    },
    verzwarendeOmstandigheden: ['Hoedanigheid slachtoffer/dader', 'Nachtelijke uren', 'Wapendracht'],
    verzachtendeOmstandigheden: ['Afwezigheid van strafblad', 'Spijtbetuiging'],
    vaststellingenChecklist: [
      'Plaatsopname en fotoreportage',
      'Verhoor van getuigen en betrokkenen',
      'Veiligstellen van digitaal bewijsmateriaal (camera, gsm)',
      'Inbeslagname van relevante voorwerpen'
    ],
    pvVoorstelKwalificatie: 'Verdenking van misdrijf (Niveau 2, Nieuw Sw.): "Heeft te [Plaats], op [Datum], met bedrieglijk/kwaadwillig opzet [Omschrijving feiten], ten nadele van [Slachtoffer]."',
    salduzCategorie: 'Categorie II (Geen vrijheidsbeneming - verdachte)',
    dadingOfBemiddelingMogelijk: true,
    dadingToelichting: 'Afhankelijk van de parketrichtlijnen en bereidheid tot schadeloosstelling.',
    aanvullendeMisdrijven: [],
    operationeelAdvies: 'Hoor de verdachte met inachtneming van de geldende Salduz-rechten en de rechten van het slachtoffer.'
  };
}

// API Route: Analyze Casus
app.post('/api/gemini/analyze-casus', async (req, res) => {
  try {
    const { casus } = req.body;
    if (!casus || typeof casus !== 'string') {
      return res.status(400).json({ error: 'Casus omschrijving is verplicht.' });
    }

    if (!ai) {
      // Return smart fallback if API key is not configured
      const fallback = generateFallbackAnalysis(casus);
      return res.json({ analysis: fallback, isFallback: true });
    }

    const prompt = `
Analyseer het volgende politiefeitenrelaas / casus nauwgezet volgens het NIEUWE BELGISCHE STRAFWETBOEK (Wet van 29 februari 2024 / Boek 1 & Boek 2):

FEITENRELAAS / CASUS:
"""
${casus}
"""

Geef je analyse in strikt gestructureerd JSON formaat met de juiste kwalificatie, wetsartikelen, het exacte strafniveau (1 t/m 8), constitutieve bestanddelen (materieel, moreel, wederrechtelijkheid), verzwarende omstandigheden, checklist voor de vaststellingen op het terrein, een kant-en-klaar PV-voorstel voor de tenlastelegging (geschikt voor ISLP), de Salduz categorie en dading-mogelijkheid.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: POLICE_LEGAL_SYSTEM_PROMPT,
        temperature: 0.0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hoofdkwalificatie: {
              type: Type.STRING,
              description: 'De exacte juridische kwalificatie volgens het Nieuw Strafwetboek',
            },
            wetsartikelen: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'De toepasselijke artikelen in het Nieuwe Strafwetboek (Boek 1 of Boek 2)',
            },
            strafniveau: {
              type: Type.INTEGER,
              description: 'Het strafniveau in cijfer van 1 tot 8 volgens Boek 1 van het Nieuw Sw.',
            },
            strafniveauUitleg: {
              type: Type.STRING,
              description: 'Duidelijke toelichting van de strafvork en sancties voor dit niveau',
            },
            strafmaatVork: {
              type: Type.OBJECT,
              properties: {
                gevangenisstraf: { type: Type.STRING },
                alternatieven: { type: Type.STRING },
                geldboete: { type: Type.STRING },
              },
              required: ['gevangenisstraf', 'alternatieven', 'geldboete'],
            },
            constitutieveBestanddelen: {
              type: Type.OBJECT,
              properties: {
                materieelElement: { type: Type.STRING, description: 'Het materieel element (de feitelijke verboden handeling/onthouding)' },
                moreelElement: { type: Type.STRING, description: 'Het moreel element (algemeen opzet, bijzonder opzet, roekeloosheid)' },
                wederrechtelijkheid: { type: Type.STRING, description: 'Wederrechtelijk karakter en afwezigheid van rechtvaardigingsgronden' },
              },
              required: ['materieelElement', 'moreelElement', 'wederrechtelijkheid'],
            },
            verzwarendeOmstandigheden: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Relevante verzwarende omstandigheden (kwalificaties, hoedanigheid slachtoffer/dader, nacht, braak, wapen, haatmotief)',
            },
            verzachtendeOmstandigheden: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Eventuele verzachtende factoren',
            },
            vaststellingenChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Concrete actiepunten voor de politie-inspecteur ter plaatse (foto, camera, sporenonderzoek, 403bis, inbeslagname)',
            },
            pvVoorstelKwalificatie: {
              type: Type.STRING,
              description: 'Kant-en-klaar geformuleerde tenlastelegging voor het proces-verbaal (ISLP/FEEDIS compatibel)',
            },
            salduzCategorie: {
              type: Type.STRING,
              description: 'De van toepassing zijnde Salduz-categorie (I, II, III of IV)',
            },
            dadingOfBemiddelingMogelijk: {
              type: Type.BOOLEAN,
              description: 'Is dading of bemiddeling in strafzaken theoretisch mogelijk voor dit misdrijf?',
            },
            dadingToelichting: {
              type: Type.STRING,
              description: 'Toelichting rond dading, bemiddeling en herstel',
            },
            aanvullendeMisdrijven: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Eventuele nevenmisdrijven of samenloop (bv. verboden wapendracht, weerspannigheid, verdovende middelen)',
            },
            operationeelAdvies: {
              type: Type.STRING,
              description: 'Kort tactisch/operationeel advies voor de tussenkomst of verhoor',
            },
          },
          required: [
            'hoofdkwalificatie',
            'wetsartikelen',
            'strafniveau',
            'strafniveauUitleg',
            'strafmaatVork',
            'constitutieveBestanddelen',
            'verzwarendeOmstandigheden',
            'vaststellingenChecklist',
            'pvVoorstelKwalificatie',
            'salduzCategorie',
            'dadingOfBemiddelingMogelijk',
            'dadingToelichting',
            'operationeelAdvies',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    const analysis = JSON.parse(rawText);
    return res.json({ analysis, isFallback: false });
  } catch (error: any) {
    console.error('Error analyzing casus via Gemini:', error);
    // Fallback to intelligent offline parser so the user experience is never broken
    const fallback = generateFallbackAnalysis(req.body?.casus || '');
    return res.json({
      analysis: fallback,
      isFallback: true,
      errorDetails: error?.message || 'Gemini API call failed, fallback used.',
    });
  }
});

// API Route: Interactive Chat / Follow-up Q&A
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, casusContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Berichtenlijst is verplicht.' });
    }

    if (!ai) {
      return res.json({
        reply:
          'De AI assistent is momenteel in operationele veldmodus. Vraag gerust specifieke details over de artikelen of strafniveaus van het Nieuw Strafwetboek!',
      });
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const systemPromptWithContext = casusContext
      ? `${POLICE_LEGAL_SYSTEM_PROMPT}\n\nHUIDIGE CASUS CONTEXT WAAROVER DE INSPECTEUR VRAGEN STELT:\n${casusContext}`
      : POLICE_LEGAL_SYSTEM_PROMPT;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: systemPromptWithContext,
        temperature: 0.0,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return res.json({
      reply:
        'Er is een tijdelijke verbindingsfout opgetreden met de AI-service. Raadpleeg de ingebouwde Strafniveaus Matrix en Wetsartikelen van het Nieuw Strafwetboek in de overige tabbladen.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'PZ VA Strafwet V3',
    geminiConfigured: !!ai,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PZ VA Strafwet V3 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
