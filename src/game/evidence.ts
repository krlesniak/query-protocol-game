export interface EvidenceDef {
  id: string;
  title: string;
  description: string;
  type: 'DOCUMENT' | 'IMAGE' | 'LOG' | 'UNKNOWN';
}

export const EVIDENCE_DB: Record<string, EvidenceDef> = {
  'EVD_ORACLE_LAB_LOC': {
    id: 'EVD_ORACLE_LAB_LOC', title: 'LOKALIZACJA PROJEKTU ORACLE', type: 'DOCUMENT',
    description: 'Wpis z rejestru HR potwierdzający przeniesienie obiektu "ORACLE" do sektora podziemnego -2.'
  },
  'EVD_SERVER_LOG_CONTRADICTION': {
    id: 'EVD_SERVER_LOG_CONTRADICTION', title: 'LOGI SERWEROWNI: SPRZECZNOŚĆ', type: 'LOG',
    description: 'Surowy wyciąg z logów systemu drzwi. Ktoś z wysokimi uprawnieniami wszedł tam pod osłoną nocy.'
  },
  'EVD_INCIDENT_REPORT': {
    id: 'EVD_INCIDENT_REPORT', title: 'RAPORT INCYDENTU: WYCIEK', type: 'LOG',
    description: 'Baza zgłosiła krytyczną kradzież danych z głównego terminala ORC-01. Poziom bezpieczeństwa: CZERWONY.'
  },
  'EVD_GHOST_PROFILE': {
    id: 'EVD_GHOST_PROFILE', title: 'PROFIL: GHOST (DYREKTOR)', type: 'DOCUMENT',
    description: 'Teczka osobowa. Odtajniono pozycję: Dyrektor Projektów Wykonawczych (Executive). Clearance Level 5.'
  },
  'EVD_ECHO_DOC': {
    id: 'EVD_ECHO_DOC', title: 'AKTA: PROJECT ECHOLOCATE', type: 'DOCUMENT',
    description: 'Cyfrowy Strażnik Bioakustyki. Projekt początkowo służył do monitorowania ekosystemów, ale dyrekcja NEXUS zleciła jego modyfikację pod inwigilację.'
  },
  'EVD_ARCHIVE_LOG': {
    id: 'EVD_ARCHIVE_LOG', title: 'RAPORT ZABEZPIECZEŃ ARCHIWUM', type: 'LOG',
    description: 'Logi wskazują na ponad 60 prób włamania do głębokiego archiwum za pomocą wygasłego identyfikatora dostawcy.'
  },
  'EVD_CCTV_ALPHA': {
    id: 'EVD_CCTV_ALPHA', title: 'ZRZUT Z KAMERY: SERVER ROOM ALPHA', type: 'IMAGE',
    description: 'Niewyraźna klatka z kamery przemysłowej. Mężczyzna w garniturze dyrektora ingeruje w panel klimatyzacji na sekundy przed skokiem temperatury.'
  },
  'EVD_DEAD_MAN': {
    id: 'EVD_DEAD_MAN', title: 'ZASZYFROWANY KLUCZ (DEAD MAN)', type: 'DOCUMENT',
    description: 'Ciąg znaków ECH0_V4NCE. ORACLE uciekł, by udostępnić kod źródłowy projektu opinii publicznej. Zdemaskował spisek na najwyższym szczeblu NEXUS.'
  }
};