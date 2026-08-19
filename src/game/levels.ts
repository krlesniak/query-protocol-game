export interface LevelHint {
  id: number;
  text: string;
  cost: number;
}

export interface LevelDefinition {
  id: number;
  title: string;
  briefing: string;
  objective: string;
  requiredRows: Record<string, unknown>[];
  maxRows?: number;
  rewardXP: number;
  unlocksTable?: string;
  unlocksEvidence?: string;
  hints: LevelHint[];
}

export const LEVELS: LevelDefinition[] = [
  // --- ETAP 1 (Podstawy) ---
  {
    id: 1,
    title: "ŚLAD",
    briefing: "Z systemu zniknęła osoba oznaczona jako ORACLE-01. Oficjalny raport mówi, że konto zostało dezaktywowane dwa dni temu. Chcę wiedzieć tylko jedno: Kto nadal posiada aktywne konto związane z projektem ORACLE?",
    objective: "Znajdź status i nazwę profilu pracownika powiązany z ORACLE.",
    requiredRows: [{ username: 'oracle_01', status: 'ACTIVE' }],
    maxRows: 1, rewardXP: 150, unlocksTable: 'locations',
    hints: [
      { id: 1, text: "Użyj SELECT * FROM employees.", cost: 100 },
      { id: 2, text: "Dodaj klauzulę WHERE username = 'oracle_01'.", cost: 200 }
    ]
  },
  {
    id: 2,
    title: "GDZIE?",
    briefing: "Znalazłeś aktywne konto. Problem w tym, że nie wiesz, gdzie ORACLE pracował. W dokumentacji HR znajduje się tylko ID przypisanego obszaru. Znajdź dokładną lokalizację (nazwę i sektor) przypisaną do projektu ORACLE.",
    objective: "Ustal przypisany obiekt, w którym pracował oracle, korzystając z tabeli locations.",
    requiredRows: [{ name: 'ORACLE_LAB', sector: 'B' }],
    maxRows: 1, rewardXP: 200, unlocksTable: 'access_logs', unlocksEvidence: 'EVD_ORACLE_LAB_LOC',
    hints: [
      { id: 1, text: "ORACLE ma przypisane assigned_location_id = 4 w swojej teczce.", cost: 100 },
      { id: 2, text: "Odszukaj lokalizację o id = 4 w tabeli 'locations'.", cost: 200 }
    ]
  },
  {
    id: 3,
    title: "03:42",
    briefing: "W nocy, kiedy ORACLE zniknął, system bezpieczeństwa zarejestrował nietypowy ruch. Administrator twierdzi, że po 03:00 nikt nie wszedł do ORACLE_LAB. Sprawdź, czy system mówi prawdę.",
    objective: "Znajdź wpis w logach dostępu dowodzący WEJŚCIA do LABORATORIUM po godzinie 03:00 w dniu 2026-02-12.",
    requiredRows: [{ action_type: 'ENTER', location_id: 4 }],
    maxRows: 3, rewardXP: 300, unlocksTable: 'incidents', unlocksEvidence: 'EVD_SERVER_LOG_CONTRADICTION',
    hints: [
      { id: 1, text: "Zacznij od analizy tabeli logów dostępu (access_logs).", cost: 100 },
      { id: 2, text: "Filtruj wpisy po location_id = 4 oraz użyj warunku created_at > '2026-02-12 03:00:00'.", cost: 200 },
      { id: 3, text: "Znajdź akcję 'ENTER', aby sprawdzić, kto mógł wejść do laboratorium.", cost: 300 }
    ]
  },

  // --- ETAP 2 (Początkujący / Średniozaawansowany) ---
  {
    id: 4, title: "ZAMIESZANIE", 
    briefing: "Coś się stało tamtej nocy w laboratorium. Zanim zagłębimy się w logi personalne, sprawdźmy powód ewakuacji. System zarejestrował tamtej nocy incydent bezpieczeństwa.",
    objective: "Znajdź dokładny opis incydentu o statusie CRITICAL w ORACLE_LAB",
    requiredRows: [{ description: 'Unauthorized data extraction detected on terminal ORC-01.' }], maxRows: 1, rewardXP: 350, unlocksTable: 'messages',
    hints: [
      { id: 1, text: "Użyj tabeli incidents i operatora AND dla wielu warunków.", cost: 100 }, 
      { id: 2, text: "Filtruj wynik po location_id = 4 AND severity = 'CRITICAL'.", cost: 200 }
    ]
  },
  {
    id: 5, title: "SPRAWCA", 
    briefing: "Incydent to 'Nieautoryzowana kradzież danych'. Logi z poziomu 3 wyraźnie pokazały, że wszedł tam pracownik o ID 13. Musimy wiedzieć, z kim mamy do czynienia.",
    objective: "Wyciągnij tylko dwie kolumny: departament i pozycję pracownika o id = 13.",
    requiredRows: [{ department: 'EXECUTIVE', pos: 'Director' }], maxRows: 1, rewardXP: 400, unlocksEvidence: 'EVD_GHOST_PROFILE',
    hints: [
      { id: 1, text: "Nie używaj SELECT *. Wymień nazwy kolumn po przecinku.", cost: 100 }, 
      { id: 2, text: "SELECT department, pos FROM employees WHERE id = 13", cost: 500 }
    ]
  },
  {
    id: 6, title: "ROZKAZ", 
    briefing: "To GHOST, Dyrektor Operacyjny. Taka osoba nie zostawia logów przypadkiem – musiał nakazać Administratorowi (ID 42) zatarcie śladów w systemie od razu po kradzieży.",
    objective: "Znajdź treść wiadomości wysłanej po godzinie 04:00 rano (2026-02-12 04:00:00) przez nadawcę 13 do odbiorcy 42.",
    requiredRows: [{ body: 'Ensure logs for Sector B are purged by morning.' }], maxRows: 1, rewardXP: 450,
    hints: [
      { id: 1, text: "Szukaj w tabeli messages, używając kilku warunków AND.", cost: 100 }, 
      { id: 2, text: "WHERE sender_id = 13 AND receiver_id = 42 AND created_at > '2026-02-12 04:00:00'", cost: 400 }
    ]
  },

  // --- ETAP 3 (Średniozaawansowany - Wzorce, Agregacja, Podstawy JOIN) ---
  {
    id: 7, title: "ECHOLOCATE", 
    briefing: "Dyrektor zatuszował sprawę projektu o nazwie kodowej 'EchoLocate: Cyfrowy Strażnik Bioakustyki'. Sprawdźmy, czy w firmowej poczcie są jakieś inne wzmianki o tym projekcie.",
    objective: "Odszukaj w systemie temat wiadomości, której treść zawiera słowo 'EchoLocate'.",
    requiredRows: [{ subject: 'Project EchoLocate' }], maxRows: 1, rewardXP: 500, unlocksEvidence: 'EVD_ECHO_DOC',
    hints: [
      { id: 1, text: "Użyj operatora LIKE do szukania wzorców tekstowych.", cost: 100 }, 
      { id: 2, text: "SELECT subject FROM messages WHERE body LIKE '%EchoLocate%'", cost: 500 }
    ]
  },
  {
    id: 8, title: "BRUTE FORCE", 
    briefing: "Zanim GHOST wszedł do labu, ktoś z zewnątrz (lub z innego działu) agresywnie próbował dostać się do innej sekcji, wielokrotnie odbijając się od zabezpieczeń drzwiowych.",
    objective: "Kto ma na koncie najwięcej odrzuconych prób dostępu? Podaj employee_id osoby z największą liczbą logów, gdzie access_granted = 0.",
    requiredRows: [{ employee_id: 200 }], maxRows: 1, rewardXP: 600,
    hints: [
      { id: 1, text: "Użyj GROUP BY employee_id w tabeli access_logs.", cost: 200 }, 
      { id: 2, text: "Posortuj wyniki używając ORDER BY COUNT(*) DESC i użyj LIMIT 1.", cost: 400 }, 
      { id: 3, text: "SELECT employee_id FROM access_logs WHERE access_granted = 0 GROUP BY employee_id ORDER BY COUNT(*) DESC LIMIT 1", cost: 1000 }
    ]
  },
  {
    id: 9, title: "CEL ATAKU", 
    briefing: "Znamy ID hakera (200), ale to nam nic nie mówi, dopóki nie dowiemy się, gdzie próbował się dostać. Musimy połączyć dane z dwóch różnych tabel.",
    objective: "Użyj operatora JOIN, aby połączyć access_logs i locations. Podaj nazwę lokacji, w której haker (ID z poziomu 8) miał zablokowane wejścia.",
    requiredRows: [{ name: 'ARCHIVES_DEEP' }], maxRows: 1, rewardXP: 650, unlocksEvidence: 'EVD_ARCHIVE_LOG',
    hints: [
      { id: 1, text: "Użyj JOIN łącząc klucz access_logs.location_id z locations.id.", cost: 400 }, 
      { id: 2, text: "SELECT l.name FROM locations l JOIN access_logs a ON l.id = a.location_id WHERE a.employee_id = 200 LIMIT 1", cost: 1000 }
    ]
  },

  // --- ETAP 4 (Zaawansowany - Subqueries: IN, EXISTS) ---
  {
    id: 10, title: "MARTWA DUSZA", 
    briefing: "Dyrektor prawdopodobnie używał w systemie fałszywych 'kont-słupów', by preparować dane. Musimy znaleźć tzw. martwą duszę – aktywne konto, które nigdy nie weszło do żadnego budynku.",
    objective: "Wyciągnij username pracownika o statusie ACTIVE, który nie ma ani jednego wpisu w tabeli access_logs. Użyj NOT EXISTS lub NOT IN.",
    requiredRows: [{ username: 'phantom_00' }], maxRows: 1, rewardXP: 700,
    hints: [
      { id: 1, text: "Możesz użyć podzapytania: WHERE id NOT IN (SELECT employee_id FROM access_logs).", cost: 200 }, 
      { id: 2, text: "Pamiętaj o dodaniu warunku status = 'ACTIVE' do głównego zapytania.", cost: 400 },
      { id: 3, text: "SELECT username FROM employees WHERE status = 'ACTIVE' AND id NOT IN (SELECT employee_id FROM access_logs)", cost: 1000 }
    ]
  },
  {
    id: 11, title: "WSPÓLNICY", 
    briefing: "ORACLE nie działał sam. Zanim uciekł, wysyłał zaszyfrowane komunikaty osobom, które pomagały mu w demaskacji projektu EchoLocate.",
    objective: "Znajdź imiona i nazwiska pracowników, którzy byli odbiorcami zaszyfrowanych maili od ORACLE'a.",
    requiredRows: [{ full_name: 'Alan Grant' }], maxRows: 5, rewardXP: 800,
    hints: [
      { id: 1, text: "Użyj operatora IN i podzapytania na tabeli messages.", cost: 200 }, 
      { id: 2, text: "Główne zapytanie szuka w employees, podzapytanie zwraca receiver_id z messages.", cost: 400 },
      { id: 3, text: "SELECT full_name FROM employees WHERE id IN (SELECT receiver_id FROM messages WHERE sender_id = 77 AND is_encrypted = 1)", cost: 1000 }
    ]
  },
  {
    id: 12, title: "UKRYTY DOSTĘP", 
    briefing: "GHOST zarzeka się na zarządzie, że żaden dyrektor nie miał fizycznego wstępu do ORACLE_LAB, by nie kompromitować projektu. Musimy udowodnić mu kłamstwo i pokazać skale naruszeń.",
    objective: "W jakich działach są kłamcy? Wypisz unikalne departamenty, z których jakikolwiek pracownik wszedł do ORACLE_LAB. Użyj operatora EXISTS.",
    requiredRows: [{ department: 'EXECUTIVE' }, { department: 'SPECIAL_PROJECTS' }, { department: 'MAINTENANCE' }], maxRows: 5, rewardXP: 850,
    hints: [
      { id: 1, text: "Zapytanie bazowe: SELECT DISTINCT department FROM employees e...", cost: 200 }, 
      { id: 2, text: "Zastosuj korelację w EXISTS: EXISTS (SELECT 1 FROM access_logs a WHERE a.employee_id = e.id AND ...)", cost: 400 },
      { id: 3, text: "SELECT DISTINCT department FROM employees e WHERE EXISTS (SELECT 1 FROM access_logs a WHERE a.employee_id = e.id AND a.location_id = 4 AND a.action_type = 'ENTER')", cost: 1000 }
    ]
  },

  // --- ETAP 5 (Mistrzowski - Multi-JOIN) ---
  {
    id: 13, title: "KRET", 
    briefing: "Poprzednie zapytanie ujawniło wydział MAINTENANCE w logach labu! Ktoś z ekipy sprzątającej na niskim szczeblu otworzył awaryjnie drzwi GHOSTOWI przed wyciekiem.",
    objective: "Znajdź username pracownika sprzątającego (dział MAINTENANCE), który miał uprawnienia poniżej 3, a mimo to ma log wejścia do labu.",
    requiredRows: [{ username: 'csmith_99' }], maxRows: 1, rewardXP: 900, unlocksEvidence: 'EVD_CCTV_ALPHA',
    hints: [
      { id: 1, text: "Połącz (JOIN) employees z access_logs.", cost: 200 }, 
      { id: 2, text: "Musisz połączyć filtry dla obu tabel: e.department = 'MAINTENANCE', e.clearance_level < 3 oraz a.location_id = 4.", cost: 800 }
    ]
  },
  {
    id: 14, title: "KRYPTOGRAFIA", 
    briefing: "Mamy kreta. ORACLE uciekł, ale zostawił dla swojego informatora (Alana Granta) klucz dostępu do zarchiwizowanych projektów. Tzw. 'Dead Man's Switch'.",
    objective: "Podaj temat ostatniej chronologicznie zaszyfrowanej wiadomości wysłanej przez ORACLE.",
    requiredRows: [{ subject: 'THE_TRUTH_IS_OUT' }], maxRows: 1, rewardXP: 1000, unlocksEvidence: 'EVD_DEAD_MAN',
    hints: [
      { id: 1, text: "Szukaj w tabeli messages dla sender_id = 77.", cost: 200 }, 
      { id: 2, text: "Użyj ORDER BY created_at DESC LIMIT 1, aby zdobyć najnowszą wiadomość.", cost: 800 }
    ]
  },
  {
    id: 15, title: "RAPORT KOŃCOWY", 
    briefing: "Mamy wszystko. Kod do archiwum udowodnił, że 'Cyfrowy Strażnik Bioakustyki' miał stać się bronią inwigilacyjną. Pozostało wygenerować czytelny dowód zdrady dla centrali NEXUS.",
    objective: "Wyciągnij username nadawcy (jako 'sender'), username odbiorcy (jako 'receiver') oraz treść wiadomości zatytułowanej 'Wipe protocols'. Użyj Self-JOIN na odpowiedniej tabeli.",
    requiredRows: [{ sender: 'ghost', receiver: 'admin_sys', body: 'Ensure logs for Sector B are purged by morning.' }], maxRows: 1, rewardXP: 2000,
    hints: [
      { id: 1, text: "To wymaga dwukrotnego użycia JOIN dla tabeli employees! Raz dla nadawcy, raz dla odbiorcy.", cost: 200 }, 
      { id: 2, text: "Użyj aliasów: FROM messages m JOIN employees s ON m.sender_id = s.id JOIN employees r ON m.receiver_id = r.id", cost: 400 },
      { id: 3, text: "SELECT s.username AS sender, r.username AS receiver, m.body FROM messages m JOIN employees s ON m.sender_id = s.id JOIN employees r ON m.receiver_id = r.id WHERE m.subject = 'Wipe protocols'", cost: 1000 }
    ]
  }
];