import { StrafniveauInfo, LegalArticle, QuickCasusPreset } from '../types';

export const STRAFNIVEAUS: Record<number, StrafniveauInfo> = {
  1: {
    niveau: 1,
    titel: 'Niveau 1 (Lichte misdrijven)',
    gevangenisstraf: 'Hoogstens 6 maanden (of uitsluitend alternatieven)',
    alternatieveStraffen: [
      'Probatiestraf (min. 6 mnd tot max. 2 jaar)',
      'Werkstraf van 20 tot 120 uren',
      'Geldstraf niveau 1: € 200 tot € 20.000 (excl. opdeciemen)'
    ],
    geldboete: '€ 200 tot € 20.000',
    beschrijving: 'Vervangt de voormalige overtredingen en de lichtste wanbedrijven. Focus op herstel, alternatieve sancties of dading.',
    voorbeelden: ['Eenvoudige slagen zonder letsel of ongeschiktheid', 'Eenvoudige beschadiging van goederen (graffiti, vandalisme)', 'Niet-gekwalificeerde huisvredebreuk'],
    bevoegdeRechtbank: 'Politierechtbank / Correctionele rechtbank'
  },
  2: {
    niveau: 2,
    titel: 'Niveau 2 (Kortlopende misdrijven)',
    gevangenisstraf: 'Meer dan 6 maanden tot 3 jaar',
    alternatieveStraffen: [
      'Probatiestraf (min. 1 jaar tot max. 3 jaar)',
      'Werkstraf van 120 tot 300 uren',
      'Geldstraf niveau 2: € 1.000 tot € 100.000'
    ],
    geldboete: '€ 1.000 tot € 100.000',
    beschrijving: 'Basisniveau voor veelvoorkomende wanbedrijven. Rechter kan gevangenisstraf enkel opleggen als alternatieven ontoereikend zijn.',
    voorbeelden: ['Eenvoudige diefstal', 'Opzettelijke slagen met tijdelijke arbeidsongeschiktheid', 'Belaging (stalking)', 'Smaad en weerspannigheid zonder wapens'],
    bevoegdeRechtbank: 'Correctionele rechtbank'
  },
  3: {
    niveau: 3,
    titel: 'Niveau 3 (Middelzware misdrijven)',
    gevangenisstraf: 'Meer dan 3 jaar tot 5 jaar',
    alternatieveStraffen: [
      'Probatiestraf (min. 2 jaar tot max. 5 jaar)',
      'Werkstraf van 200 tot 400 uren (beperkt mogelijk)',
      'Geldstraf niveau 3: € 2.000 tot € 200.000'
    ],
    geldboete: '€ 2.000 tot € 200.000',
    beschrijving: 'Gekwalificeerde wanbedrijven en zwaardere vermogens- of geweldsdelicten.',
    voorbeelden: ['Diefstal met braak, inklimming of valse sleutels', 'Diefstal met geweld of bedreiging (basis)', 'Slagen met blijvende ongeschiktheid', 'Weerspannigheid in bende of met wapens'],
    bevoegdeRechtbank: 'Correctionele rechtbank'
  },
  4: {
    niveau: 4,
    titel: 'Niveau 4 (Zware misdrijven)',
    gevangenisstraf: 'Meer dan 5 jaar tot 10 jaar',
    alternatieveStraffen: [
      'Geldstraf niveau 4: € 5.000 tot € 500.000',
      'Geen autonome werkstraf mogelijk als hoofdstraf'
    ],
    geldboete: '€ 5.000 tot € 500.000',
    beschrijving: 'Zware misdrijven (vroegere correctionele misdaden). Gevangenisstraf is de primaire standaard.',
    voorbeelden: ['Diefstal met geweld gepleegd door vereniging of met wapendracht', 'Slagen die verlies van een orgaan/lidmaat tot gevolg hebben', 'Grootschalige drugshandel'],
    bevoegdeRechtbank: 'Correctionele rechtbank (driekamer) of Hof van Assisen'
  },
  5: {
    niveau: 5,
    titel: 'Niveau 5 (Zeer zware misdrijven)',
    gevangenisstraf: 'Meer dan 10 jaar tot 15 jaar',
    alternatieveStraffen: [
      'Geldstraf niveau 5: € 10.000 tot € 1.000.000'
    ],
    geldboete: '€ 10.000 tot € 1.000.000',
    beschrijving: 'Ernstige aantastingen van personen of de staat.',
    voorbeelden: ['Opzettelijke slagen en verwondingen met de dood tot gevolg zonder oogmerk te doden', 'Gegijzeldenneming', 'Gewapende overval in bende met gijzeling'],
    bevoegdeRechtbank: 'Correctionele rechtbank / Hof van Assisen'
  },
  6: {
    niveau: 6,
    titel: 'Niveau 6 (Uitzonderlijk zware misdrijven)',
    gevangenisstraf: 'Meer dan 15 jaar tot 20 jaar',
    alternatieveStraffen: [
      'Geldstraf niveau 6: € 20.000 tot € 2.000.000'
    ],
    geldboete: '€ 20.000 tot € 2.000.000',
    beschrijving: 'Zeer zware gewelds- en terreurmisdrijven.',
    voorbeelden: ['Foltering met ernstige blijvende verminking', 'Doodslag onder specifieke omstandigheden'],
    bevoegdeRechtbank: 'Hof van Assisen / Correctionele rechtbank'
  },
  7: {
    niveau: 7,
    titel: 'Niveau 7 (Misdrijven met maximale tijdelijke straf)',
    gevangenisstraf: 'Meer dan 20 jaar tot 30 jaar',
    alternatieveStraffen: [
      'Geldstraf niveau 7: € 50.000 tot € 5.000.000'
    ],
    geldboete: '€ 50.000 tot € 5.000.000',
    beschrijving: 'Zwaarste tijdelijke gevangenisstraf voor levensdelicten en zware terroristische daden.',
    voorbeelden: ['Doodslag (opzettelijke levensberoving zonder voorbedachten rade)', 'Dodelijke gijzeling'],
    bevoegdeRechtbank: 'Hof van Assisen'
  },
  8: {
    niveau: 8,
    titel: 'Niveau 8 (Levenslange opsluiting)',
    gevangenisstraf: 'Levenslange gevangenisstraf',
    alternatieveStraffen: [
      'Geldstraf niveau 8: tot € 10.000.000 (naast levenslang)'
    ],
    geldboete: 'Tot € 10.000.000',
    beschrijving: 'Het zwaarste strafniveau in het Belgisch strafrecht voor de meest gruwelijke misdrijven.',
    voorbeelden: ['Moord (doodslag met voorbedachten rade)', 'Genocide en misdaden tegen de mensigheid', 'Dodelijke terroristische aanslag met voorbedachtheid'],
    bevoegdeRechtbank: 'Hof van Assisen'
  }
};

export const QUICK_CASUS_PRESETS: QuickCasusPreset[] = [
  {
    id: 'diefstal-ruit-voertuig',
    titel: 'Ruit ingetikt / Diefstal uit auto',
    categorie: 'Eigendom',
    icon: 'Car',
    casusTekst: 'Verdachte heeft op een openbare parking de zijruit van een geparkeerd voertuig ingeslagen met een noodhamer/bougie en een handtas met portefeuille en gsm weggenomen. Slachtoffer stelde vast dat het handschoenenkastje overhoop lag.'
  },
  {
    id: 'slagen-politieagent',
    titel: 'Geweld & weerspannigheid t.a.v. inspecteur',
    categorie: 'Openbaar Gezag',
    icon: 'ShieldAlert',
    casusTekst: 'Tijdens een controle verzette de verdachte zich fysiek tegen de fouille, schold de inspecteurs uit en gaf inspecteur Janssens een gerichte vuistslag op de neus (bloedneus, 3 dagen werkonbekwaamheid volgens arts).'
  },
  {
    id: 'woninginbraak-braak-nacht',
    titel: 'Woninginbraak met braak bij nacht',
    categorie: 'Eigendom',
    icon: 'Home',
    casusTekst: 'Verdachten zijn om 02u30 via het forceren van een raam aan de achterzijde binnengedrongen in een bewoonde eengezinswoning terwijl de bewoners boven sliepen. Er werden juwelen en laptops ontvreemd.'
  },
  {
    id: 'slagen-cafe-glas',
    titel: 'Slagen met glas / Caféruzie',
    categorie: 'Fysieke Integriteit',
    icon: 'Flame',
    casusTekst: 'In een horecazaak heeft de verdachte na een verbale discussie een bierglas kapotgeslagen in het gelaat van het slachtoffer. Slachtoffer vertoont diepe snijwonden die gehecht moesten worden op spoed (10 dagen arbeidsongeschiktheid).'
  },
  {
    id: 'drugs-deal-school',
    titel: 'Drugsverkoop aan minderjarigen nabij school',
    categorie: 'Drugs & Veiligheid',
    icon: 'Pill',
    casusTekst: 'Verdachte werd betrapt op 100m van een schoolpoort terwijl hij 5 gripzakjes cannabis (elk 2 gram) en 3 xtc-pillen verkocht aan een 15-jarige scholier. Bij fouille werd 450 euro cash geld in kleine coupures aangetroffen.'
  },
  {
    id: 'belaging-stalking',
    titel: 'Belaging / Stalking met GPS-tracker',
    categorie: 'Vrijheid & Privacy',
    icon: 'Crosshair',
    casusTekst: 'Ex-partner blijft slachtoffer dagelijks stalken via tientallen ongewenste berichten, staat herhaaldelijk voor haar woning en heeft heimelijk een GPS-tracker gemonteerd onder de wagen van het slachtoffer om haar te volgen.'
  },
  {
    id: 'winkeldiefstal-geweld',
    titel: 'Diefstal met geweld tegen winkeldetective',
    categorie: 'Eigendom',
    icon: 'ShoppingBag',
    casusTekst: 'Verdachte stopt kledingstukken in een geprepareerde tas (boosterbag). Bij het verlaten van de winkel spreekt de bewakingsagent hem aan. Verdachte duwt de bewaker met kracht tegen een rek en vlucht weg met de buit.'
  },
  {
    id: 'graffiti-vandalisme',
    titel: 'Graffiti / Beschadiging openbaar domein',
    categorie: 'Vandalisme',
    icon: 'Paintbrush',
    casusTekst: 'Verdachte werd op heterdaad betrapt bij het spuiten van tags en leuzen met spuitbussen op de gevel van het gemeentehuis en een pas gerenoveerd bushokje.'
  }
];

export const OFFICIAL_LEGAL_ARTICLES: LegalArticle[] = [
  {
    id: 'art-diefstal-basis',
    artikelNummer: 'Art. 461 e.v. (Nieuw Sw. Boek 2)',
    titel: 'Eenvoudige diefstal',
    boek: 'Boek 2',
    categorie: 'Eigendom & Vermogen',
    omschrijving: 'Het bedrieglijk wegnemen van een zaak die aan een ander toebehoort, met het oogmerk om zich die zaak wederrechtelijk toe te eigenen.',
    basisNiveau: 2,
    verzwaardNiveau: 3,
    materieelElement: 'Wegneming van een andermans roerend goed zonder toestemming van de eigenaar/houder.',
    moreelElement: 'Bedrieglijk opzet / Oogmerk van wederrechtelijke toe-eigening (animus furandi).',
    verzwarendeOmstandigheden: [
      'Gepleegd met behulp van braak, inklimming of valse sleutels (stijgt naar Niveau 3)',
      'Gepleegd bij nacht (tussen zonsondergang en zonsopgang)',
      'Gepleegd door twee of meer personen (bendevorming/mededaderschap)',
      'Gepleegd in een bewoonde woning of aanhorigheid'
    ],
    vaststellingenTips: [
      'Nauwkeurige inventaris en beschrijving van de weggenomen goederen (serienummers, aankoopfacturen)',
      'Vaststelling van toegangsweg en eventuele sporen van manipulatie',
      'Camerabeelden van de omgeving veiligstellen',
      'Getuigenverklaringen en tijdstip van vaststelling noteren'
    ],
    pvFormulering: 'Verdenking van diefstal (Niveau 2, Nieuw Sw.): "Heeft te [Plaats], op [Datum/Tijdstip], bedrieglijk andermans goed weggenomen, te weten [Omschrijving buit], ten nadele van [Naam Slachtoffer]."'
  },
  {
    id: 'art-diefstal-braak',
    artikelNummer: 'Art. 467 (Nieuw Sw. Boek 2)',
    titel: 'Diefstal met braak, inklimming of valse sleutels',
    boek: 'Boek 2',
    categorie: 'Eigendom & Vermogen',
    omschrijving: 'Diefstal gepleegd met uitwendige of inwendige braak, inklimming, of door gebruik van valse sleutels of elektronische manipulatiemiddelen.',
    basisNiveau: 3,
    verzwaardNiveau: 4,
    materieelElement: 'Wegneming van andermans goed gecombineerd met materiële beschadiging of opening van afsluitingen/ramen/deuren/kluizen.',
    moreelElement: 'Bedrieglijk opzet met kennis van de braak/inklimming.',
    verzwarendeOmstandigheden: [
      'In een bewoond pand bij nacht door meerdere personen (Niveau 4)',
      'Gebruik van gestolen of nagemaakte sleutels/elektronische scanners',
      'Dragen van wapens of voorwerpen die als wapen kunnen dienen'
    ],
    vaststellingenTips: [
      'Gedetailleerde fotoreportage van braaksporen (schroevendraaierindrukken, slotcilinder, glasbreuk)',
      'Vinger- en DNA-sporenonderzoek op contactoppervlakken (deurklinken, kasten)',
      'Buurtonderzoek naar verdachte voertuigen of bewegingen',
      'Inbeslagname van achtergelaten inbrekersmateriaal'
    ],
    pvFormulering: 'Verdenking van diefstal met braak (Niveau 3, Nieuw Sw.): "Heeft te [Plaats], op [Datum], bedrieglijk weggenomen [Goederen], ten nadele van [Slachtoffer], met de verzwarende omstandigheid dat de diefstal werd gepleegd met behulp van braak/inklimming aan [Toegangsweg]."'
  },
  {
    id: 'art-diefstal-geweld',
    artikelNummer: 'Art. 468 - 471 (Nieuw Sw. Boek 2)',
    titel: 'Diefstal met geweld of bedreiging (Overval / Extorsie)',
    boek: 'Boek 2',
    categorie: 'Eigendom & Vermogen',
    omschrijving: 'Diefstal waarbij fysiek geweld of morele dwang/bedreiging wordt aangewend om de zaak te bemachtigen of de vlucht te verzekeren.',
    basisNiveau: 3,
    verzwaardNiveau: 5,
    materieelElement: 'Wegneming vergezeld van fysieke dwang, slagen, of ernstige mondelinge/fysieke bedreigingen tegen personen.',
    moreelElement: 'Bedrieglijk opzet gericht op zowel de ontvreemding als het aanwenden van dwang/geweld.',
    verzwarendeOmstandigheden: [
      'Gepleegd met wapens of schijnwapens (Niveau 4 of 5)',
      'Gepleegd in bende of met voertuigvlucht',
      'Gevolgen: ernstige lichamelijke letsels of arbeidsongeschiktheid'
    ],
    vaststellingenTips: [
      'Medisch attest slachtoffer onmiddellijk laten opstellen (Model 403bis)',
      'Slachtofferbejegening (Dienst Slachtofferzorg) inschakelen',
      'Camerabeelden van vluchtroute en daderbeschrijvingen direct verspreiden naar patrouilles',
      'Sporen op wapens, kleding en vluchtroute veiligstellen'
    ],
    pvFormulering: 'Verdenking van diefstal met geweld/bedreiging (Niveau 3/4, Nieuw Sw.): "Heeft te [Plaats], op [Datum], bedrieglijk andermans goed weggenomen met behulp van fysiek geweld bestaande uit [Aard geweld] en/of bedreigingen ten aanzien van [Slachtoffer]."'
  },
  {
    id: 'art-slagen-basis',
    artikelNummer: 'Art. 398 e.v. (Nieuw Sw. Boek 2)',
    titel: 'Opzettelijke slagen en verwondingen',
    boek: 'Boek 2',
    categorie: 'Fysieke Integriteit',
    omschrijving: 'Het opzettelijk toebrengen van slagen, verwondingen of een aantasting van de fysieke of psychische integriteit van een persoon.',
    basisNiveau: 1,
    verzwaardNiveau: 4,
    materieelElement: 'Materiële handeling (stoot, slag, messteek, beet, duw) die het lichaam van het slachtoffer raakt of verwondt.',
    moreelElement: 'Algemeen opzet (de wil om te slaan of fysiek contact te maken, ongeacht of men de specifieke graad van verwonding beoogde).',
    verzwarendeOmstandigheden: [
      'Arbeidsongeschiktheid > 4 maanden (Niveau 2 of 3)',
      'Blijvende ongeschiktheid, verlies van orgaan of ernstige verminking (Niveau 3 of 4)',
      'Voorbedachten rade (hinderlaag, vooraf beraamd)',
      'Hoedanigheid van het slachtoffer: politiedrager, magistraat, hulpverlener, kwetsbaar persoon, partner/ex-partner (Intrafamiliaal geweld)',
      'Discriminatoir motief (haatmisdrijf)'
    ],
    vaststellingenTips: [
      'Gedetailleerde foto\'s van alle zichtbare letsels (met meetlat/schaal)',
      'Vordering van een geneesheer voor medisch attest met bepaling van vermoedelijke dagen arbeidsongeschiktheid',
      'Inbeslagname van gebruikte voorwerpen (fles, knuppel, schoeisel)',
      'Verhoor van getuigen over wie de agressor/initiator was'
    ],
    pvFormulering: 'Verdenking van opzettelijke slagen en verwondingen (Niveau [1-4], Nieuw Sw.): "Heeft te [Plaats], op [Datum], vrijwillig slagen en/of verwondingen toegebracht aan [Slachtoffer], met als gevolg [Letselomschrijving en eventuele dagen ongeschiktheid]."'
  },
  {
    id: 'art-weerspannigheid',
    artikelNummer: 'Art. 269 e.v. (Nieuw Sw. Boek 2)',
    titel: 'Weerspannigheid en smaad jegens dragers van het openbaar gezag',
    boek: 'Boek 2',
    categorie: 'Openbaar Gezag & Politie',
    omschrijving: 'Elke gewelddadige aanval of elk fysiek verzet met geweld of bedreiging tegen personen die drager zijn van het openbaar gezag of de openbare macht handelend ter uitvoering van de wetten of wettige bevelen.',
    basisNiveau: 2,
    verzwaardNiveau: 4,
    materieelElement: 'Fysiek verzet, losrukken met geweld, trappen, slaan of bedreigen tijdens een wettige politie-interventie of controle.',
    moreelElement: 'Wetens en willens verzet bieden tegen een politieambtenaar wetende dat deze in functie handelt.',
    verzwarendeOmstandigheden: [
      'Gepleegd met wapens of voorwerpen als wapen aangewend (Niveau 3)',
      'Gepleegd door meerdere personen verenigd (bende) (Niveau 3)',
      'Met toebrengen van verwondingen aan de politieambtenaar (Niveau 3 of 4)'
    ],
    vaststellingenTips: [
      'Nauwkeurig omschrijven van de wettige grondslag van de tussenkomst (verkeerscontrole, heterdaad, bevel parket)',
      'Bodycam-beelden en dashcambeelden onmiddellijk veiligstellen en verbaliseren',
      'Foto\'s van eventuele beschadigde politie-uniformen, materiaal of opgelopen verwondingen',
      'Medisch attest van de betrokken politieambtenaar bijvoegen'
    ],
    pvFormulering: 'Verdenking van weerspannigheid (Niveau 2/3, Nieuw Sw.): "Heeft te [Plaats], op [Datum], met geweld/bedreiging weerspannigheid gepleegd jegens [Naam inspecteurs], politieambtenaren van PZ [Zone], handelend ter uitvoering van hun wettige bediening."'
  },
  {
    id: 'art-belaging-stalking',
    artikelNummer: 'Art. 442bis (Nieuw Sw. Boek 2)',
    titel: 'Belaging (Stalking)',
    boek: 'Boek 2',
    categorie: 'Persoonlijke Vrijheid & Privacy',
    omschrijving: 'Het herhaaldelijk lastigvallen van een persoon waarvan men wist of had moeten weten dat men diens rust ernstig zou verstoren.',
    basisNiveau: 2,
    verzwaardNiveau: 3,
    materieelElement: 'Herhaaldelijke gedragingen: bellen, berichten sturen, opwachten, volgen, trackers plaatsen, online pesten, contact zoeken ondanks verbod.',
    moreelElement: 'Kennis of behoren te weten dat het gedrag de gemoedsrust van het slachtoffer ernstig aantast.',
    verzwarendeOmstandigheden: [
      'T.a.v. partner, ex-partner of kwetsbare persoon',
      'Met gebruik van elektronische volgapparatuur of spyware',
      'Ondanks een eerder opgelegd contactverbod'
    ],
    vaststellingenTips: [
      'Screenshots van chatberichten, oproeplogboeken en e-mails exporteren',
      'Logboek van incidenten opvragen bij slachtoffer (data, tijdstippen, locaties)',
      'Onderzoek naar trackers/AirTags op voertuig of bezittingen',
      'Gevaarsinschatting intrafamiliaal geweld / stalkingevaluatie invullen'
    ],
    pvFormulering: 'Verdenking van belaging (Niveau 2, Nieuw Sw.): "Heeft te [Plaats], tussen [Begindatum] en [Einddatum], herhaaldelijk [Slachtoffer] belaagd door middel van [Aard van belaging], wetende dat dit haar/zijn rust ernstig verstoorde."'
  },
  {
    id: 'art-huisvredebreuk',
    artikelNummer: 'Art. 439 (Nieuw Sw. Boek 2)',
    titel: 'Huisvredebreuk',
    boek: 'Boek 2',
    categorie: 'Persoonlijke Vrijheid & Privacy',
    omschrijving: 'Zonder toestemming binnendringen in of weigeren te verlaten van een door een ander bewoond huis, appartement, kamer of aanhorigheid.',
    basisNiveau: 1,
    verzwaardNiveau: 2,
    materieelElement: 'Binnendringen of aanwezig blijven tegen de uitdrukkelijke of stilzwijgende wil van de bewoner.',
    moreelElement: 'Wetens en willens binnendringen zonder wettige titel of toestemming.',
    verzwarendeOmstandigheden: [
      'Gepleegd met behulp van bedreiging, geweld of braak (Niveau 2)',
      'Gepleegd bij nacht of door meerdere personen'
    ],
    vaststellingenTips: [
      'Wettige bewoning door slachtoffer vaststellen (inschrijving bevolkingsregister, huurcontract)',
      'Verzet of weigering tot verlaten documenteren',
      'Eventuele braaksporen of schade aan toegangsdeuren fotograferen'
    ],
    pvFormulering: 'Verdenking van huisvredebreuk (Niveau 1/2, Nieuw Sw.): "Heeft te [Plaats], op [Datum], zonder bevel van de overheid en buiten de gevallen waarin de wet toelaat, tegen de wil van de bewoner binnengedrongen in de bewoonde woning van [Slachtoffer]."'
  },
  {
    id: 'art-informaticabedrog',
    artikelNummer: 'Art. 504quater (Nieuw Sw. Boek 2)',
    titel: 'Informaticabedrog en cyberfraude',
    boek: 'Boek 2',
    categorie: 'Computercriminaliteit',
    omschrijving: 'Zichzelf of een ander een onrechtmatig economisch voordeel verschaffen door gegevens in een informaticasysteem in te voeren, te wijzigen, te wissen of de werking te manipuleren (phishing, spoofing, bankhelpdeskfraude).',
    basisNiveau: 2,
    verzwaardNiveau: 4,
    materieelElement: 'Manipulatie van bankapps, loginportalen, frauduleuze overschrijvingen, onderscheppen van 2FA-codes.',
    moreelElement: 'Bedrieglijk opzet om een wederrechtelijk vermogensvoordeel te verkrijgen.',
    verzwarendeOmstandigheden: [
      'In het kader van een criminele organisatie',
      'Omvangrijke buit (> € 100.000)',
      'Slachtoffers van kwetsbare leeftijd (senioren bij bankhelpdeskfraude)'
    ],
    vaststellingenTips: [
      'Bankrekeningnummers van begunstigden (geldezels / money mules) en transactie-ID\'s onmiddellijk opvragen voor anti-fraudeblokkering (Card Stop / Febelfin urgentieprocedure)',
      'IP-adressen, telefoonnummers en e-mailheaders veiligstellen',
      'Chatconversaties en phishing-links veiligstellen'
    ],
    pvFormulering: 'Verdenking van informaticabedrog (Niveau 2/3, Nieuw Sw.): "Heeft te [Plaats/Digitaal], op [Datum], met bedrieglijk opzet een onrechtmatig economisch voordeel voor zichzelf of een derde verworven door manipulatie van informaticagegevens ten nadele van [Slachtoffer]."'
  }
];
