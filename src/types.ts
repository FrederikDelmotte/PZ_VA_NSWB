export type StrafniveauNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StrafniveauInfo {
  niveau: StrafniveauNumber;
  titel: string;
  gevangenisstraf: string;
  alternatieveStraffen: string[];
  geldboete: string;
  beschrijving: string;
  voorbeelden: string[];
  bevoegdeRechtbank: string;
}

export interface LegalArticle {
  id: string;
  artikelNummer: string;
  titel: string;
  boek: 'Boek 1' | 'Boek 2';
  categorie: 'Fysieke Integriteit' | 'Eigendom & Vermogen' | 'Openbaar Gezag & Politie' | 'Persoonlijke Vrijheid & Privacy' | 'Seksuele Misdrijven' | 'Openbare Veiligheid & Drugs' | 'Computercriminaliteit' | 'Algemene Bepalingen';
  omschrijving: string;
  basisNiveau: StrafniveauNumber;
  verzwaardNiveau?: StrafniveauNumber;
  materieelElement: string;
  moreelElement: string;
  verzwarendeOmstandigheden: string[];
  vaststellingenTips: string[];
  pvFormulering: string;
}

export interface CaseAnalysisResult {
  hoofdkwalificatie: string;
  wetsartikelen: string[];
  strafniveau: StrafniveauNumber;
  strafniveauUitleg: string;
  strafmaatVork: {
    gevangenisstraf: string;
    alternatieven: string;
    geldboete: string;
  };
  constitutieveBestanddelen: {
    materieelElement: string;
    moreelElement: string;
    wederrechtelijkheid: string;
  };
  verzwarendeOmstandigheden: string[];
  verzachtendeOmstandigheden?: string[];
  vaststellingenChecklist: string[];
  pvVoorstelKwalificatie: string;
  salduzCategorie: 'Categorie I (Geen vrijheidsbeneming - getuige/slachtoffer)' | 'Categorie II (Geen vrijheidsbeneming - verdachte)' | 'Categorie III (Met vrijheidsbeneming - gewone feiten)' | 'Categorie IV (Met vrijheidsbeneming - zware misdrijven)';
  dadingOfBemiddelingMogelijk: boolean;
  dadingToelichting: string;
  aanvullendeMisdrijven?: string[];
  operationeelAdvies: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  analysis?: CaseAnalysisResult;
  isAudioTranscription?: boolean;
}

export interface QuickCasusPreset {
  id: string;
  titel: string;
  categorie: string;
  icon: string;
  casusTekst: string;
}
