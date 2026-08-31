export interface EvidenceEasterEgg {
  x: number;
  y: number;
  width: number;
  height: number;
  message: string;
  actionType?: 'standard' | 'jumpscare' | 'password' | 'redacted' | 'oracle_eyes';
  actionConfig?: {
    expectedPassword?: string;
    revealedText?: string;
  };
}

export interface Evidence {
  id: string;
  title: string;
  type: string;
  sourceLevel: number;
  description: string;
  storyDescription: string;
  imagePath: string;
  easterEgg?: EvidenceEasterEgg;
}

export const EVIDENCE_DB: Record<string, Evidence> = {
  // ok
  "EVD_ORACLE_LAB_LOC": {
    id: "EVD_ORACLE_LAB_LOC",
    title: "SERVER ROOM 03 SCHEMATIC",
    type: "BLUEPRINT",
    sourceLevel: 2,
    description: "Map of the Core Sector indicating Oracle's workspace.",
    storyDescription: "Workspace assignment confirms ORACLE operated directly from SERVER_ROOM_03. This is a highly restricted zone. Why would the Chief Security Architect isolate himself down here instead of the Executive floors?",
    imagePath: "/assets/evidence/evidence_01.png",
    easterEgg: {
      actionType: 'standard',
      x: 72, y: 24, width: 7, height: 7,
      message: "[HINT: LEVEL 4] Log serwisowy: Kamera CCTV-82 uległa \"awarii\" zasilania dokładnie o 23:47. Sprawca musiał celowo uszkodzić zasilanie przed wejściem. Szukaj zdarzeń o statusie 'CRITICAL' w tabeli incidents."
    }
  },

  // ok
  "EVD_SERVER_LOG_CONTRADICTION": {
    id: "EVD_SERVER_LOG_CONTRADICTION",
    title: "ACCESS LOG CONTRADICTION",
    type: "SYSTEM LOG",
    sourceLevel: 3,
    description: "Discrepancy found in physical access vs system logs.",
    storyDescription: "The official report says ORACLE left the building. But the physical door logs prove someone entered his lab late at night and never triggered the exit sensors. The official narrative is a lie.",
    imagePath: "/assets/evidence/evidence_02.png",
    easterEgg: {
      actionType: 'standard',
      x: 56.5, y: 80.0, width: 25, height: 6.5,
      message: "[HINT: LEVEL 5] Indeks bazy nie zgadza się z faktyczną liczbą rekordów. Ktoś z zewnątrz nie dałby rady tak głęboko zmanipulować logów. Szukaj sprawcy (lub jego poświadczeń) w dziale 'SECURITY' z najwyższym dostępem (clearance_level = 5)."
    }
  },

  // ok
  "EVD_GHOST_PROFILE": {
    id: "EVD_GHOST_PROFILE",
    title: "MARTIN VALE PROFILE",
    type: "PERSONNEL FILE",
    sourceLevel: 5,
    description: "Security clearance level 5 personnel file.",
    storyDescription: "Martin Vale. High-level security operative. His credentials were used near the lab around the time of the disappearance. He has the clearance to bypass the cameras, but does he have the motive?",
    imagePath: "/assets/evidence/evidence_03.png",
    easterEgg: {
      actionType: 'standard',
      x: 8.7, y: 62.0, width: 13.5, height: 6.5,
      message: "[HINT: LEVEL 6] Analiza RFID w tle: Karta pracownika ID 13 logowała się minionej nocy do terminala komunikacyjnego na sektorze głównym. Użyj operatora LIKE ze znakiem '%', aby przeszukać tabelę messages pod kątem jego nieoficjalnych raportów ze zmiany."
    }
  },

  // ok
  "EVD_ECHO_DOC": {
    id: "EVD_ECHO_DOC",
    title: "ORACLE'S WARNING",
    type: "ENCRYPTED MESSAGE",
    sourceLevel: 7,
    description: "A hidden message fragment found in the database.",
    storyDescription: "«If you are reading this, do not trust the logs.»\n\nORACLE knew they were coming for him. He intentionally left breadcrumbs in the database structure itself. He knew someone like me would look.",
    imagePath: "/assets/evidence/evidence_04.png",
    easterEgg: {
      actionType: 'standard',
      x: 3.5, y: 83.6, width: 30, height: 3.7,
      message: "[HINT: LEVEL 21] Odzyskano usunięty wers wiadomości: 'Jeśli zarząd spróbuje wymazać prawdę, zastaw na nich pułapkę. Będziesz musiał użyć CREATE TRIGGER AFTER DELETE, żeby złapać ich na gorącym uczynku w audit_logs.'"
    }
  },

  // ok
  "EVD_ARCHIVE_LOG": {
    id: "EVD_ARCHIVE_LOG",
    title: "THE SMOKESCREEN",
    type: "TRAFFIC ANALYSIS",
    sourceLevel: 9,
    description: "Analysis of failed authentication attempts.",
    storyDescription: "Hundreds of failed login attempts from a single ghost terminal. It's a classic smokescreen. Someone generated a massive amount of noise in the access logs to hide a single, surgical entry into the server room.",
    imagePath: "/assets/evidence/evidence_05.png",
    easterEgg: {
      actionType: 'standard',
      x: 60.4, y: 30.0, width: 3.5, height: 5,
      message: "[HINT: LEVEL 10] Ostrzeżenie systemu IDS wyizolowało 892 pakiety z jednego źródła. Aby odnaleźć winnego tej anomalii, musisz zagregować dane (GROUP BY employee_id), posortować wyniki malejąco (ORDER BY ... DESC) i ograniczyć je (LIMIT 1)."
    }
  },

  // ok
  "EVD_EXECUTIVE_PURGE": {
    id: "EVD_EXECUTIVE_PURGE",
    title: "EXECUTIVE PURGE ORDER",
    type: "AUDIT TRAIL",
    sourceLevel: 12,
    description: "Record of a manual deletion of security logs.",
    storyDescription: "Elias Voss. CTO of Nexus and ORACLE's own brother. Elias used his executive override to manually purge the security logs from the night of the incident. This isn't just a cover-up; it's a family betrayal.",
    imagePath: "/assets/evidence/evidence_06.png",
    easterEgg: {
      actionType: 'jumpscare', 
      x: 47, y: 43.3, width: 7, height: 10,
      message: "[HINT: LEVEL 15] Analiza naruszenia: Elias Voss osobiście autoryzował czyszczenie serwerów. Pamiętaj, że w skomplikowanych złączeniach czasem szukasz dowodu, który ukryty jest na podstawie *istnienia* powiązania w innej tabeli. Użyj podzapytania z operatorem 'EXISTS'."
    }
  },

  // ok
  "EVD_CCTV_ALPHA": {
    id: "EVD_CCTV_ALPHA",
    title: "EXTRACTION ROUTE",
    type: "COMMUNICATION INTERCEPT",
    sourceLevel: 14,
    description: "Message intercept between Vale and ORACLE.",
    storyDescription: "«Extraction route clear.»\n\nMartin Vale wasn't hunting ORACLE. He was helping him escape. The security operative smuggled the Architect out right under the Executive board's noses.",
    imagePath: "/assets/evidence/evidence_07.png",
    easterEgg: {
      actionType: 'oracle_eyes',
      x: 59.2, y: 21.5, width: 4.5, height: 15,
      message: "[HINT: LEVEL 16] Analiza śladów termicznych: Ucieczka odbyła się korytarzem technicznym w trakcie słynnej 'brakującej godziny'. Aby odtworzyć ich trasę w SQL i wykluczyć szum, musisz połączyć funkcje grupujące 'MIN' oraz 'MAX' w klauzuli 'HAVING'."
    }
  },

  // ok
  "EVD_DEAD_MAN": {
    id: "EVD_DEAD_MAN",
    title: "PROJECT MIRROR EXPOSED",
    type: "CLASSIFIED MEMO",
    sourceLevel: 15,
    description: "Intercepted communication confirming Project Mirror.",
    storyDescription: "PROJECT MIRROR. An unsanctioned, highly illegal data-harvesting operation run by Elias Voss. ORACLE found out about it and was about to blow the whistle. That's why he had to disappear.",
    imagePath: "/assets/evidence/evidence_08.png",
    easterEgg: {
      actionType: 'password', // SPECIAL MECHANICS - requires password input to reveal hidden text
      actionConfig: { expectedPassword: 'VOSS' },
      x: 68.5, y: 22, width: 15.0, height: 10,
      message: "[HINT: LEVEL 25] Odzyskano notatki zablokowane hasłem dyrektora: Główny architekt projektu starannie ukrył swoje ślady i zablokował dostęp podrzędnym kontom. Użyj 'NOT EXISTS', aby znaleźć elitę zarządzającą, która komunikowała się o MIRROR, ale w jej profilu brakuje śladów odrzuconych logowań."
    }
  },

  // ok
  "EVD_NODE_07": {
    id: "EVD_NODE_07",
    title: "NODE 07 ARCHITECTURE",
    type: "NETWORK DIAGRAM",
    sourceLevel: 18,
    description: "Map of the hidden infrastructure node.",
    storyDescription: "A completely off-the-books server cluster buried deep within the Nexus network topology. This is where PROJECT MIRROR lives. This is the beating heart of the conspiracy.",
    imagePath: "/assets/evidence/evidence_09.png",
    easterEgg: {
      actionType: 'redacted', // SPECIAL MECHANICS - shows redacted text when discovered
      actionConfig: { revealedText: "NODE_XX: CEO_DIRECT_LINE" },
      x: 35.5, y: 65.2, width: 20.0, height: 6.7,
      message: "[HINT: LEVEL 24] Dekryptaż warstwy graficznej zakończony. Projekt Mirror nie szpiegował tylko zwykłych pracowników, był podpięty bezpośrednio pod linie zarządu. Pamiętaj, struktura tych węzłów jest rekurencyjna. Użyj 'WITH RECURSIVE' i złącz iteracje przez 'UNION ALL'."
    }
  },

  "EVD_AUDIT_TRAIL": {
    id: "EVD_AUDIT_TRAIL",
    title: "THE TRIGGER TRAP",
    type: "DATABASE TRIGGER LOG",
    sourceLevel: 21,
    description: "Results of the manual trigger injection.",
    storyDescription: "The trap worked. We caught the executives actively trying to delete references to ORACLE in real-time. We now have undeniable proof of evidence tampering at the highest level.",
    imagePath: "/assets/evidence/evidence_10.png",
    easterEgg: {
      actionType: 'standard',
      x: 73.6, y: 16.6, width: 22, height: 6.4,
      message: "[HINT: LEVEL 28] Logiki śledcze ujawniają maskowanie błędów. Administratorzy zacierają ślady wprowadzając szum statystyczny. Wylicz średnią bazową z operacji za pomocą 'AVG' i znajdź rekord o największym odchyleniu matematycznym wykorzystując bezwzględną funkcję 'ABS'."
    }
  },

  "EVD_FINAL_PROTOCOL": {
    id: "EVD_FINAL_PROTOCOL",
    title: "ORACLE'S KEY",
    type: "DECRYPTED PAYLOAD",
    sourceLevel: 30,
    description: "The final piece of the puzzle.",
    storyDescription: "I have it. The exact parameters needed to shut down Project Mirror and expose Elias Voss. ORACLE didn't just leave a trail; he left a weapon. Now I just need to pull the trigger.",
    imagePath: "/assets/evidence/evidence_11.png",
    easterEgg: {
      actionType: 'standard',
      x: 59, y: 39, width: 11, height: 18,
      message: "[SYSTEM MESSAGE] Dziękuję. Za dokończenie tego, co zacząłem. Przekaż dowody centrali. Nie pozwól im wygrać. – Adrian"
    }
  }
};