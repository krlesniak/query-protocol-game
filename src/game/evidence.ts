export interface EvidenceDef {
  id: string;
  title: string;
  description: string; 
  type: 'DOCUMENT' | 'IMAGE' | 'LOG' | 'UNKNOWN';
  imagePath: string; 
  storyDescription: string; 
  sourceLevel: number; 
}

export const EVIDENCE_DB: Record<string, EvidenceDef> = {
  'EVD_ORACLE_LAB_LOC': {
    id: 'EVD_ORACLE_LAB_LOC', 
    title: 'LOKALIZACJA PROJEKTU ORACLE', 
    type: 'DOCUMENT',
    description: 'Wpis z rejestru HR potwierdzający przeniesienie obiektu "ORACLE" do sektora podziemnego -2.',
    imagePath: '/assets/evidence/evidence_001.png',
    storyDescription: 'Dokument z departamentu kadr (HR). Zmiana przydziału oznaczona klauzulą "ŚCIŚLE TAJNE". ORACLE-01 został nagle odcięty od głównego zespołu i przeniesiony do izolowanego podziemnego sektora B bez oficjalnego wytłumaczenia.',
    sourceLevel: 2
  },
  'EVD_SERVER_LOG_CONTRADICTION': {
    id: 'EVD_SERVER_LOG_CONTRADICTION', 
    title: 'LOGI SERWEROWNI: SPRZECZNOŚĆ', 
    type: 'LOG',
    description: 'Surowy wyciąg z logów systemu drzwi. Ktoś z wysokimi uprawnieniami wszedł tam pod osłoną nocy.',
    imagePath: '/assets/evidence/evidence_002.png',
    storyDescription: 'Zapisy z logów bazy danych śluz nie kłamią. Osoba z autoryzacją wysokiego szczebla zignorowała protokoły nocne i weszła do strefy laboratoryjnej. Oficjalny raport administratora sieci został sfałszowany, by ukryć ten ruch.',
    sourceLevel: 3
  },
  'EVD_INCIDENT_REPORT': {
    id: 'EVD_INCIDENT_REPORT', 
    title: 'RAPORT INCYDENTU: WYCIEK', 
    type: 'LOG',
    description: 'Baza zgłosiła krytyczną kradzież danych z głównego terminala ORC-01. Poziom bezpieczeństwa: CZERWONY.',
    imagePath: '/assets/evidence/evidence_003.png',
    storyDescription: 'Zautomatyzowany raport systemu bezpieczeństwa NEXUS. Główny terminal laboratoryjny (ORC-01) odnotował masowy transfer danych na niezidentyfikowany nośnik zewnętrzny. System wyzwolił alarm "CRITICAL", po czym został natychmiastowo wyciszony z poziomu konsoli administracyjnej.',
    sourceLevel: 4
  },
  'EVD_GHOST_PROFILE': {
    id: 'EVD_GHOST_PROFILE', 
    title: 'PROFIL: GHOST (DYREKTOR)', 
    type: 'DOCUMENT',
    description: 'Teczka osobowa. Odtajniono pozycję: Dyrektor Projektów Wykonawczych (Executive). Clearance Level 5.',
    imagePath: '/assets/evidence/evidence_004.png',
    storyDescription: 'Odtajniona teczka osobowa. "GHOST" to dyrektor operacyjny z najwyższymi uprawnieniami (Clearance Level 5). Posiada pełną władzę nad systemami monitoringu i procedurami bezpieczeństwa. Wewnątrz korporacyjnej drabinki jest praktycznie nietykalny.',
    sourceLevel: 5
  },
  'EVD_ECHO_DOC': {
    id: 'EVD_ECHO_DOC', 
    title: 'AKTA: PROJECT ECHOLOCATE', 
    type: 'DOCUMENT',
    description: 'Cyfrowy Strażnik Bioakustyki. Projekt początkowo służył do monitorowania ekosystemów, ale dyrekcja NEXUS zleciła jego modyfikację pod inwigilację.',
    imagePath: '/assets/evidence/evidence_005.png',
    storyDescription: 'Fragment odzyskanej specyfikacji technicznej "EchoLocate". Algorytmy bioakustyczne, pierwotnie zaprojektowane do szczytnego celu analizy gatunków w dżungli, zostały potajemnie przeprogramowane. Teraz miały analizować ludzkie tętno, oddech i poziom stresu przez mikrofony w smartfonach. Narzędzie masowej inwigilacji.',
    sourceLevel: 7
  },
  'EVD_ARCHIVE_LOG': {
    id: 'EVD_ARCHIVE_LOG', 
    title: 'RAPORT ZABEZPIECZEŃ ARCHIWUM', 
    type: 'LOG',
    description: 'Logi wskazują na ponad 60 prób włamania do głębokiego archiwum za pomocą wygasłego identyfikatora dostawcy.',
    imagePath: '/assets/evidence/evidence_006.png',
    storyDescription: 'Ślady agresywnego, siłowego ataku brute-force na serwery głębokiego archiwum. Ktoś z zewnątrz lub używający fałszywego konta testował luki w zabezpieczeniach NEXUS, prawdopodobnie w celu dywersji tuż przed głównym incydentem kradzieży w Sektorze B.',
    sourceLevel: 9
  },
  'EVD_CCTV_ALPHA': {
    id: 'EVD_CCTV_ALPHA', 
    title: 'ZRZUT Z KAMERY: SERVER ROOM ALPHA', 
    type: 'IMAGE',
    description: 'Niewyraźna klatka z kamery przemysłowej. Mężczyzna w garniturze dyrektora ingeruje w panel klimatyzacji na sekundy przed skokiem temperatury.',
    imagePath: '/assets/evidence/evidence_007.png',
    storyDescription: 'Wydobyta klatka z uszkodzonego nagrania monitoringu. Analiza obrazu ujawnia Dyrektora majstrującego przy głównym panelu wentylacyjnym. Skok temperatury w serwerowni był celowym sabotażem, mającym najprawdopodobniej wykurzyć ORACLE\'a z jego laboratorium pod pretekstem ewakuacji.',
    sourceLevel: 13
  },
  'EVD_DEAD_MAN': {
    id: 'EVD_DEAD_MAN', 
    title: 'ZASZYFROWANY KLUCZ (DEAD MAN)', 
    type: 'DOCUMENT',
    description: 'Ciąg znaków ECH0_V4NCE. ORACLE uciekł, by udostępnić kod źródłowy projektu opinii publicznej. Zdemaskował spisek na najwyższym szczeblu NEXUS.',
    imagePath: '/assets/evidence/evidence_008.png',
    storyDescription: 'Ostatnia przechwycona wiadomość od ORACLE\'a. Klucz deszyfrujący "ECH0_V4NCE" otwiera ukrytą partycję, na której zdeponowano cały kod źródłowy zbrojonej wersji EchoLocate. Ujawnienie tych danych opinii publicznej ostatecznie zniszczy dyrekcję NEXUS i oczyści ORACLE\'a z zarzutów.',
    sourceLevel: 14
  }
};