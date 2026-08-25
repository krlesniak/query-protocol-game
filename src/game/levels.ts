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
  requiredKeywords?: string[];
  rewardXP: number;
  unlocksTable?: string;
  unlocksEvidence?: string;
  hints: LevelHint[];
}

export const LEVELS: LevelDefinition[] = [
  // ============================================================
  // AKT I — THE DISAPPEARANCE
  // ============================================================

  // ok
  {
    id: 1,
    title: "FIRST CONTACT",
    briefing: "Główny architekt bezpieczeństwa NEXUS zniknął 48 godzin temu. Oficjalny komunikat mówi o kradzieży danych i ucieczce. Problem: jego profil nadal istnieje w wewnętrznej bazie pracowników.",
    objective: "Ustal pełne imię i nazwisko architekta o pseudonimie ORACLE oraz jego aktualny status w systemie.",
    requiredRows: [{ full_name: "Adrian Voss", status: "ACTIVE" }],
    maxRows: 1,
    rewardXP: 150,
    unlocksTable: "locations",
    hints: [
      { id: 1, text: "Potrzebujesz tabeli employees oraz kolumn full_name i status.", cost: 50 },
      { id: 2, text: "Wyfiltruj rekord, którego username odpowiada pseudonimowi ORACLE.", cost: 100 }
    ]
  },

  // ok
  {
    id: 2,
    title: "LAST KNOWN LOCATION",
    briefing: "Profil ORACLE'a nadal oznaczony jest jako ACTIVE. W jego danych znajduje się identyfikator przypisanego obszaru roboczego. Jeśli ktoś chciał go znaleźć, właśnie tam powinien zacząć.",
    objective: "Odnajdź nazwę i sektor lokacji przypisanej do Adriana Vossa.",
    requiredRows: [{ name: "SERVER_ROOM_03", sector: "CORE" }],
    maxRows: 1,
    rewardXP: 200,
    unlocksTable: "access_logs",
    unlocksEvidence: "EVD_ORACLE_LAB_LOC",
    hints: [
      { id: 1, text: "Najpierw znajdź location_id przypisane do ORACLE'a.", cost: 50 },
      { id: 2, text: "Następnie odszukaj ten identyfikator w tabeli locations.", cost: 100 }
    ]
  },

  // ok
  {
    id: 3,
    title: "NO EXIT",
    briefing: "Wiemy już, gdzie ORACLE pracował. Teraz trzeba sprawdzić, co wydarzyło się tamtej nocy. W logach znajduje się wpis dotyczący wejścia do SERVER_ROOM_03.",
    objective: "Znajdź log potwierdzający wejście do SERVER_ROOM_03 po godzinie 23:00 dnia 12 lutego 2026.",
    requiredRows: [{ action_type: "ENTER", location_id: 3 }],
    maxRows: 4,
    requiredKeywords: ["ENTER"], 
    rewardXP: 300,
    unlocksTable: "incidents",
    unlocksEvidence: "EVD_SERVER_LOG_CONTRADICTION",
    hints: [
      { id: 1, text: "Potrzebujesz tabeli access_logs.", cost: 50 },
      { id: 2, text: "Połącz warunki dotyczące lokalizacji, typu akcji i czasu.", cost: 100 },
      { id: 3, text: "Czas jest zapisany jako tekst. Spróbuj znaleźć wpis późniejszy niż '2026-02-12 23:00:00'.", cost: 150 }
    ]
  },

  // ok
  {
    id: 4,
    title: "THE GHOST",
    briefing: "O 23:47 ktoś wszedł do serwerowni. Kilka minut później monitoring przestał działać. System zarejestrował awarię jako krytyczny incydent.",
    objective: "Znajdź opis krytycznego incydentu dotyczącego monitoringu w SERVER_ROOM_03.",
    requiredRows: [{ description: "CCTV feed corrupted. Signal lost." }],
    maxRows: 1,
    requiredKeywords: ["CRITICAL"],
    rewardXP: 350,
    unlocksTable: "messages",
    hints: [
      { id: 1, text: "Sprawdź tabelę incidents.", cost: 100 },
      { id: 2, text: "Odfiltruj incydenty o statusie CRITICAL dotyczące SERVER_ROOM_03.", cost: 200 }
    ]
  },

  // ok
  {
    id: 5,
    title: "BORROWED IDENTITY",
    briefing: "Karta ORACLE'a została użyta po jego ostatnim potwierdzonym logowaniu. Nie wygląda na to, żeby używał jej sam. Ktoś wewnątrz NEXUS miał odpowiedni poziom dostępu.",
    objective: "Znajdź imię i nazwisko pracownika działu SECURITY posiadającego clearance_level równy 5.",
    requiredRows: [{ full_name: "Martin Vale" }],
    maxRows: 1,
    rewardXP: 400,
    unlocksEvidence: "EVD_GHOST_PROFILE",
    hints: [
      { id: 1, text: "Potrzebujesz tylko danych pracowników z działu SECURITY.", cost: 100 },
      { id: 2, text: "Dodaj drugi warunek dotyczący clearance_level.", cost: 200 }
    ]
  },

  // ============================================================
  // AKT II — SOMEONE IS LYING
  // ============================================================

  // ok
  {
    id: 6,
    title: "NIGHT SHIFT",
    briefing: "Martin Vale twierdzi, że tamtej nocy nie było go w budynku. Jego grafik również wygląda podejrzanie. W skrzynce wiadomości znaleziono jednak ślad jego obecności.",
    objective: "Znajdź wiadomość Martina zawierającą informację o rozpoczęciu nocnej zmiany.",
    requiredRows: [{ body: "Starting my night shift in Sector CORE." }],
    maxRows: 1,
    requiredKeywords: ["LIKE"],
    rewardXP: 450,
    hints: [
      { id: 1, text: "Znajdź wiadomości należące do Martina.", cost: 200 },
      { id: 2, text: "Szukasz konkretnego fragmentu tekstu, więc przyda Ci się operator LIKE i znak %.", cost: 300 },
      { id: 3, text: "Użyj podzapytania, aby znaleźć id Martina.", cost: 400 }
    ]
  },

  // ok
  {
    id: 7,
    title: "DEAD MAN'S MESSAGE",
    briefing: "Martin nie jest jedyną osobą, która zostawiła ślad. ORACLE przewidział, że ktoś może manipulować logami. Zostawił wiadomość, ale nie w miejscu, którego normalnie szukałby administrator.",
    objective: "Znajdź  treść wiadomości ORACLE'a zawierającą ostrzeżenie, aby nie ufać logom.",
    requiredRows: [{ body: "If you are reading this, do not trust the logs." }, 
                   { body: "MIRROR IS NOT THE PROJECT. IT IS THE COVER. DO NOT TRUST NEXUS. FIND NODE_07." }],
    maxRows: 2,
    requiredKeywords: ["LIKE", "TRUST"], 
    rewardXP: 500,
    unlocksEvidence: "EVD_ECHO_DOC",
    hints: [
      { id: 1, text: "Wiadomość znajduje się w tabeli messages.", cost: 200 },
      { id: 2, text: "Użyj podzapytania, aby znaleźć id ORACLE'a.", cost: 300 },
      { id: 3, text: "Użyj LIKE '%trust%' aby znaleźć ostrzeżenie ukryte w tekście.", cost: 400 }
    ]
  },

  // ok
  {
    id: 8,
    title: "CROSS-REFERENCE",
    briefing:
      "Brak raportów nocnej zmiany zmusza nas do wyciągania wniosków. Ktoś z ochrony musiał być na miejscu i koordynować akcję. Poszukajmy części wspólnej dwóch tabel w noc zaginięcia.",
    objective:
      "Znajdź identyfikator osoby (employee_id), która fizycznie WESZŁA do SERVER_ROOM_03 (z access_logs) w dniu 12 lutego 2026 ORAZ figurowała jako nadawca wiadomości. Użyj operatora INTERSECT.",
    requiredRows: [
      { employee_id: 13 }
    ],
    maxRows: 5,
    requiredKeywords: ["INTERSECT"], 
    rewardXP: 600,
    hints: [
      { id: 1, text: "Ogranicz access_logs do lokacji 3 oraz daty '2026-02-12%' i typu 'ENTER'.", cost: 200 },
      { id: 2, text: "Użyj operatora INTERSECT połączonego z zapytaniem o sender_id z tabeli messages.", cost: 400 },
    ]
  },

  // ok
  {
    id: 9,
    title: "THE GHOST IN THE MACHINE",
    briefing: "Spójrzmy na logi w poszukiwaniu anomalii. Prawdziwy intruz w sieci firmowej zostawia ślady, ale często brakuje mu pomyślnego uwierzytelnienia. Ustalmy, kto atakował drzwi, ale nigdy nie wszedł do środka.",
    objective: "Znajdź ID osób, które mają w systemie odrzucone logowania (access_granted), wykluczając wszystkie osoby, którym kiedykolwiek przyznano dostęp.",
    requiredRows: [{ employee_id: 200 }],
    maxRows: 5,
    requiredKeywords: ["EXCEPT"], 
    rewardXP: 650,
    unlocksEvidence: "EVD_ARCHIVE_LOG",
    hints: [
      { id: 1, text: "Porównujesz ze sobą dwa zapytania do tej samej tabeli: access_logs (Użyj EXCEPT).", cost: 200 },
      { id: 2, text: "Z lewej strony EXCEPT szukaj employee_id z dostępem równym 0.", cost: 400 },
      { id: 3, text: "Z prawej strony EXCEPT wstaw podzapytanie szukające pracowników z dostępem równym 1.", cost: 600 }
    ]
  },

  // ok
  {
    id: 10,
    title: "THE IMPOSSIBLE TERMINAL",
    briefing: "Jeden terminal wygenerował setki odrzuconych prób logowania w ciągu kilku minut. To nie wygląda jak zwykły błąd użytkownika. Ktoś próbował stworzyć zasłonę dymną.",
    objective: "Znajdź employee_id osoby posiadającej największą liczbę odrzuconych prób logowania dnia.",
    requiredRows: [{ employee_id: 200 }],
    maxRows: 1,
    requiredKeywords: ["GROUP BY", "ORDER BY", "DESC", "LIMIT"], 
    rewardXP: 700,
    hints: [
      { id: 1, text: "Najpierw odfiltruj odrzucone próby logowania.", cost: 250 },
      { id: 2, text: "Pogrupuj wyniki według employee_id i policz liczbę prób.", cost: 500 },
      { id: 3, text: "Posortuj wynik malejąco i ogranicz go do pierwszego rekordu.", cost: 750 }
    ]
  },

  // ============================================================
  // AKT III — THE MIRROR
  // ============================================================

  // ok
  {
    id: 11,
    title: "THREE LIARS",
    briefing: "Porównanie danych wejściowych, wiadomości i grafików pokazuje kilka sprzeczności. Jedna z osób znajduje się znacznie wyżej w strukturze NEXUS.",
    objective: "Znajdź pracowników, którzy mają więcej niż jeden wpis dostępu do SERVER_ROOM_03 podczas nocy zaginięcia (12 lutego).",
    requiredRows: [{ employee_id: 10 }],
    maxRows: 5,
    requiredKeywords: ["GROUP BY", "HAVING"], 
    rewardXP: 800,
    unlocksTable: "audit_logs",
    hints: [
      { id: 1, text: "Połącz access_logs z lokalizacją SERVER_ROOM_03.", cost: 250 },
      { id: 2, text: "Pogrupuj logi według employee_id.", cost: 500 },
      { id: 3, text: "Potrzebujesz warunku na grupę, który sprawdzi liczbę wpisów większą niż 1. Użyj HAVING.", cost: 750 }
    ]
  },

  // NIE OK!
  {
    id: 12,
    title: "EXECUTIVE ACCESS",
    briefing: "W danych pojawia się inny pracownik o nazwisku Voss — CTO NEXUS i brat ORACLE'a. Konto wykonawcze zostało użyte do operacji usunięcia logów bezpieczeństwa.",
    objective: "Znajdź pełne imię i nazwisko pracownika, którego konto wykonało operację purge na logach bezpieczeństwa.",
    requiredRows: [{ full_name: "Elias Voss" }],
    requiredKeywords: ["PURGE", "security_logs"],
    maxRows: 1,
    rewardXP: 850,
    unlocksEvidence: "EVD_EXECUTIVE_PURGE",
    hints: [
      { id: 1, text: "Operacja purge znajduje się w danych systemowych.", cost: 250 },
      { id: 2, text: "Połącz log operacji z tabelą employees.", cost: 500 },
      { id: 3, text: "Potrzebujesz JOIN po identyfikatorze pracownika.", cost: 750 }
    ]
  },

  // ok
  {
    id: 13,
    title: "THE MISSING HOUR",
    briefing: "Między 23:47 a 00:31 istnieje dokładnie 44-minutowa luka. ORACLE nie wyszedł z budynku. Ktoś z ochrony wszedł wtedy do SERVER_ROOM_03.",
    objective: "Znajdź wszystkich pracowników SECURITY, którzy weszli do SERVER_ROOM_03 w czasie brakującej godziny.",
    requiredRows: [{ full_name: "Martin Vale" }],
    maxRows: 5,
    rewardXP: 900,
    hints: [
      { id: 1, text: "Połącz employees z access_logs.", cost: 500 },
      { id: 2, text: "Najpierw wyfiltruj pracowników działu SECURITY.", cost: 1000 },
      { id: 3, text: "Możesz wykorzystać podzapytanie zwracające employee_id osób obecnych w SERVER_ROOM_03.", cost: 1500 }
    ]
  },

  // ok
  {
    id: 14,
    title: "CHAIN OF EVIDENCE",
    briefing: "Martin Vale przestaje wyglądać jak porywacz. Wszystko wskazuje na to, że pomagał ORACLE'owi. W wiadomościach znajduje się zaszyfrowana rozmowa między nimi.",
    objective: "Znajdź temat wiadomości wysłanej przez Martina bezpośrednio do ORACLE'a.",
    requiredRows: [{ subject: "Extraction route clear" }],
    maxRows: 1,
    rewardXP: 1000,
    unlocksEvidence: "EVD_CCTV_ALPHA",
    hints: [
      { id: 1, text: "Potrzebujesz dwóch identyfikatorów: nadawcy i odbiorcy.", cost: 500 },
      { id: 2, text: "Połącz dane pracowników z tabelą messages i ogranicz wynik do Martina oraz ORACLE'a.", cost: 1000 }
    ]
  },

  // ok
  {
    id: 15,
    title: "PROJECT MIRROR",
    briefing: "Zwykły SELECT to za mało, by udowodnić winę zarządu przed centralą. Wiemy o PROJECT MIRROR, ale musimy powiązać ten projekt z dyrektywą czyszczenia logów.",
    objective: "Użyj JOIN i podzapytania EXISTS. Znajdź pełne imię nadawcy (jako sender) oraz odbiorcy (jako receiver) wiadomości 'PROJECT MIRROR', ale TYLKO jeśli w systemie zarejestrowano incydent ze statusem 'WARNING' w SERVER_ROOM_03.",
    requiredRows: [{ sender: "Elias Voss", receiver: "Marcus Vance" }],
    maxRows: 1,
    requiredKeywords: ["EXISTS", "WARNING", 'location_id'], 
    rewardXP: 1100,
    unlocksEvidence: "EVD_DEAD_MAN",
    hints: [
      { id: 1, text: "Będziesz potrzebował tabel: messages, employees, oraz incidents.", cost: 600 },
      { id: 2, text: "Użyj aliasów (np. e1 dla nadawcy, e2 dla odbiorcy).", cost: 1200 },
      { id: 3, text: "W klauzuli WHERE użyj EXISTS (SELECT 1 FROM incidents ...).", cost: 1800 }
    ]
  },

  // ============================================================
  // AKT IV — ORACLE'S LAST QUERY
  // ============================================================
  {
    id: 16,
    title: "THE MISSING SEQUENCE",
    briefing: "W danych brakuje fragmentu historii. Część rekordów została usunięta. Musimy zrekonstruować wydarzenia między 23:47 a 00:31.",
    objective: "Znajdź pracownika, który był obecny w SERVER_ROOM_03 podczas całej brakującej sekwencji zdarzeń (jego MIN wejście było <= 23:47, a MAX >= 00:31 dnia 12/13 Lutego).",
    requiredRows: [{ full_name: "Martin Vale" }],
    maxRows: 3,
    requiredKeywords: ["MIN", "MAX", "HAVING"], 
    rewardXP: 1200,
    unlocksTable: "internal_projects",
    hints: [
      { id: 1, text: "Porównaj pierwsze i ostatnie zdarzenie każdego pracownika.", cost: 700 },
      { id: 2, text: "Przyda Ci się grupowanie danych według employee_id.", cost: 1400 },
      { id: 3, text: "Sprawdź, kto spełnia jednocześnie warunek pierwszego i ostatniego zdarzenia używając HAVING.", cost: 2100 }
    ]
  },
  {
    id: 17,
    title: "THE COVER",
    briefing: "MIRROR nie był jedynym projektem. Część z nich została oficjalnie sklasyfikowana w logach audytu, ale jeden wciąż umyka procedurom.",
    objective: "Znajdź kody projektów (project_code z internal_projects), które NIE zostały sklasyfikowane – czyli odrzuć (EXCEPT) te, których nazwy pojawiają się jako 'target' w tabeli audit_logs.",
    requiredRows: [{ project_code: "NODE_07" }],
    maxRows: 20,
    requiredKeywords: ["EXCEPT"], 
    rewardXP: 1300,
    unlocksTable: "infrastructure_nodes",
    hints: [
      { id: 1, text: "Użyjesz dwóch tabel: internal_projects oraz audit_logs.", cost: 700 },
      { id: 2, text: "Z lewej strony EXCEPT wyciągnij project_code, a z prawej target.", cost: 1400 },
      { id: 3, text: "Zapytanie zwróci projekty, które istnieją, ale brakuje ich w audycie.", cost: 2100 }
    ]
  },
  {
    id: 18,
    title: "NODE_07",
    briefing: "Nazwa NODE_07 pojawia się tylko raz. To identyfikator ukrytego węzła w hierarchii infrastruktury NEXUS.",
    objective: "Prześledź hierarchię infrastruktury od głównego węzła do NODE_07 i znajdź pełną ścieżkę połączeń w tabeli infrastructure_nodes.",
    requiredRows: [{ node_name: "NODE_07" }],
    maxRows: 20,
    requiredKeywords: ["WITH", "RECURSIVE"], 
    rewardXP: 1500,
    unlocksEvidence: "EVD_NODE_07",
    hints: [
      { id: 1, text: "Każdy węzeł posiada identyfikator swojego rodzica.", cost: 700 },
      { id: 2, text: "Musisz wielokrotnie przechodzić od dziecka do rodzica.", cost: 1400 },
      { id: 3, text: "SQLite pozwala wykonywać takie przejście za pomocą WITH RECURSIVE.", cost: 2100 }
    ]
  },
  {
    id: 19,
    title: "THE NETWORK",
    briefing: "Struktura sieci to drzewo. Jeśli ukryty serwer faktycznie istnieje, musi znajdować się na samym końcu łańcucha jako 'ślepy' punkt docelowy.",
    objective: "Znajdź ID węzłów w infrastructure_nodes, które są punktami końcowymi – to znaczy ich ID NIE występuje w kolumnie parent_id żadnego innego węzła. Użyj EXCEPT.",
    requiredRows: [{ id: 5 }],
    maxRows: 20,
    requiredKeywords: ["EXCEPT"], 
    rewardXP: 1600,
    hints: [
      { id: 1, text: "Porównujesz ze sobą dwa zapytania z tej samej tabeli infrastructure_nodes.", cost: 700 },
      { id: 2, text: "W pierwszym zapytaniu wyciągasz zwykłe id węzłów.", cost: 1400 },
      { id: 3, text: "W drugim wyciągasz kolumnę parent_id. Użyj EXCEPT pomiędzy nimi.", cost: 2100 }
    ]
  },
  {
    id: 20,
    title: "THE FALSE TRAIL",
    briefing: "Zarząd celowo stworzył konkurencyjne tropy. Połączmy logi z audytem, aby wyłuskać winnego z całej listy ochroniarzy i pracowników.",
    objective: "Znajdź ID pracownika, który: wywołał operację w audycie (jako triggered_by w audit_logs) INTERSECT fizycznie wszedł do SERVER_ROOM_03 (z access_logs) EXCEPT ma zablokowane wejścia (access_granted=0 w access_logs).",
    requiredRows: [{ triggered_by: 10 }],
    maxRows: 5,
    requiredKeywords: ["INTERSECT", "EXCEPT"], 
    rewardXP: 1700,
    hints: [
      { id: 1, text: "Musisz użyć trzech zapytań połączonych operatorami.", cost: 700 },
      { id: 2, text: "SELECT triggered_by FROM audit_logs INTERSECT SELECT employee_id FROM access_logs WHERE ...", cost: 1400 },
      { id: 3, text: "Na samym końcu dopisz EXCEPT SELECT employee_id FROM access_logs WHERE access_granted = 0", cost: 2100 }
    ]
  },
  {
    id: 21,
    title: "THE TRAP",
    briefing: "Przechodzimy do ofensywy. Zamiast tylko czytać dane, musimy aktywnie złapać tych, którzy je usuwają. Ktoś z zarządu regularnie czyści tabelę wiadomości.",
    objective: "Napisz CREATE TRIGGER o nazwie 'ghost_tracker', po (AFTER) usunięciu (DELETE) na tabeli 'messages'. Trigger ma logować do tabeli 'audit_logs': (employee_id = OLD.sender_id, triggered_by = OLD.sender_id, action = 'DELETE_MSG', target = OLD.subject).",
    requiredRows: [], 
    maxRows: 0,
    requiredKeywords: ["CREATE", "TRIGGER", "AFTER", "DELETE"], 
    rewardXP: 1800,
    unlocksEvidence: "EVD_AUDIT_TRAIL",
    hints: [
      { id: 1, text: "Składnia: CREATE TRIGGER nazwa AFTER DELETE ON tabela BEGIN ... END;", cost: 500 },
      { id: 2, text: "Wewnątrz bloku wykonaj INSERT INTO audit_logs (employee_id, triggered_by, action, target) VALUES (...);", cost: 1000 },
      { id: 3, text: "Aby odnieść się do usuniętych danych, użyj np. OLD.sender_id.", cost: 1500 }
    ]
  },
  {
    id: 22,
    title: "WHO PULLED THE TRIGGER",
    briefing: "Mamy zapisy usuniętych danych (DELETE) dotyczących ORACLE'a, ale sprawca próbuje się ukryć. CTO zlecił to brudne zadanie komuś z działu IT.",
    objective: "Użyj CTE. Wyciągnij pełne imię osoby, która usunęła target 'oracle_01', pod warunkiem, że ta sama osoba znajduje się w Top 3 pracowników z największą liczbą odrzuconych wejść (access_granted = 0) w systemie.",
    requiredRows: [{ full_name: "Marcus Vance" }],
    maxRows: 1,
    requiredKeywords: ["WITH", "ORDER BY", "DESC", "LIMIT"], 
    rewardXP: 1900,
    hints: [
      { id: 1, text: "Najpierw stwórz CTE grupujące odrzucone logi po id z ORDER BY ... DESC LIMIT 3.", cost: 700 },
      { id: 2, text: "W głównym zapytaniu połącz employees z audit_logs szukając akcji 'DELETE' na targecie 'oracle_01'.", cost: 1400 },
      { id: 3, text: "Na końcu głównego zapytania dodaj warunek upewniający się, że ID pracownika znajduje się w wynikach Twojego CTE.", cost: 2100 }
    ]
  },
  {
    id: 23,
    title: "THE HIDDEN ARCHIVE",
    briefing: "Baza ukrywa kłamstwa dyrekcji. Musimy użyć zaawansowanej eliminacji zbiorów, by znaleźć ten jeden temat wiadomości, który spina cały spisek.",
    objective: "Wydobądź tematy (subject) zaszyfrowanych wiadomości, a następnie wyeliminuj z nich (EXCEPT) te, które wysłała dyrekcja (department = 'EXECUTIVE'), ORAZ wyeliminuj te, których odbiorcą był dział IT (department = 'IT_OPS').",
    requiredRows: [{ subject: "ORACLE PROTOCOL" }],
    maxRows: 10,
    requiredKeywords: ["EXCEPT"], 
    rewardXP: 2000,
    hints: [
      { id: 1, text: "Twój cel wymaga złączenia trzech zapytań (SELECT subject ...) połączonych dwoma operatorami EXCEPT.", cost: 800 },
      { id: 2, text: "W pierwszym zapytaniu wyciągnij po prostu tematy gdzie is_encrypted = 1.", cost: 1600 },
      { id: 3, text: "Drugie i trzecie zapytanie musi posiadać JOIN z tabelą employees (odpowiednio po nadawcy i odbiorcy), aby odfiltrować działy.", cost: 2400 }
    ]
  },
  {
    id: 24,
    title: "THE BLOODLINE",
    briefing: "Hierarchia NODE_07 prowadzi jeszcze głębiej. Każdy węzeł ma rodzica, ale część węzłów ma również powiązania boczne (linked_sibling_id).",
    objective: "Znajdź wszystkie węzły znajdujące się na ścieżce prowadzącej od węzła 'ORACLE_NODE' w górę. Zwróć kolumnę node_name.",
    requiredRows: [{ node_name: "ORACLE_NODE" }],
    maxRows: 50,
    requiredKeywords: ["WITH", "RECURSIVE"], 
    rewardXP: 2200,
    hints: [
      { id: 1, text: "Potrzebujesz ponownie przejść przez hierarchię zależności infrastructure_nodes.", cost: 800 },
      { id: 2, text: "WITH RECURSIVE pozwoli Ci odwiedzać kolejne poziomy.", cost: 1600 },
      { id: 3, text: "Uwzględnij w złączeniu rekurencyjnym warunek OR na kolumnę linked_sibling_id.", cost: 2400 }
    ]
  },
  {
    id: 25,
    title: "THE REAL ARCHITECT",
    briefing: "Zarząd zaciera ślady. Musimy udowodnić bez cienia wątpliwości, kto kieruje MIRROR, wykluczając fałszywe tropy.",
    objective: "Wyciągnij pełne imię nadawcy wiadomości 'PROJECT MIRROR', KTÓRY jednocześnie: ma clearance = 5 ORAZ NIE MA ani jednego odrzuconego wejścia (access_granted = 0) w logach. Użyj NOT EXISTS.",
    requiredRows: [{ full_name: "Elias Voss" }],
    maxRows: 1,
    requiredKeywords: ["NOT", "EXISTS"], 
    rewardXP: 2500,
    hints: [
      { id: 1, text: "Zacznij od złączenia wiadomości z pracownikami.", cost: 800 },
      { id: 2, text: "Zamiast łączyć access_logs bezpośrednio, użyj podzapytania skorelowanego z klauzulą NOT EXISTS.", cost: 1600 },
      { id: 3, text: "NOT EXISTS (SELECT 1 FROM access_logs a WHERE a.employee_id = e.id AND a.access_granted = 0).", cost: 2400 }
    ]
  },

  // ============================================================
  // AKT V — THE TRUTH
  // ============================================================
  {
    id: 26,
    title: "THE SECOND ORACLE",
    briefing: "W systemie istnieją ślady drugiego użytkownika, cyfrowego 'cienia', który niemal idealnie naśladował logowania ORACLE'a. Znajdźmy go.",
    objective: "Znajdź użytkownika (username), którego profil operacyjny logowań pokrywa się w ilości akcji z oryginalnym kontem oracle_01.",
    requiredRows: [{ username: "oracle_shadow" }],
    maxRows: 10,
    requiredKeywords: ["HAVING", "COUNT"], 
    rewardXP: 2700,
    hints: [
      { id: 1, text: "Wykorzystaj CTE do zliczenia logów oryginalnego oracle_01.", cost: 800 },
      { id: 2, text: "Zbuduj zapytanie grupujące logi pozostałych pracowników.", cost: 1600 },
      { id: 3, text: "W klauzuli HAVING przyrównaj COUNT(*) do ilości wyników z Twojego podzapytania CTE.", cost: 2400 }
    ]
  },
  {
    id: 27,
    title: "THE RANKING",
    briefing: "Tylko kilka osób miało ciągły fizyczny dostęp do MIRROR_CORE. Potrzebujemy ustalić bezwzględnego lidera wejść do tego węzła.",
    objective: "Znajdź osobę zajmującą pierwsze miejsce w rankingu ilości dostępu do lokacji 'MIRROR_CORE'. Zwróć tylko jej full_name.",
    requiredRows: [{ full_name: "Elias Voss" }],
    maxRows: 1,
    requiredKeywords: ["RANK", "OVER"], 
    rewardXP: 3000,
    hints: [
      { id: 1, text: "Musisz zliczyć logi wejść dla lokacji 31.", cost: 800 },
      { id: 2, text: "Wykorzystaj funkcję okienkową RANK() OVER (ORDER BY COUNT(*) DESC).", cost: 1600 },
      { id: 3, text: "Całość opakuj w zewnętrzne zapytanie, odfiltrowując rekord gdzie ranga = 1.", cost: 2400 }
    ]
  },
  {
    id: 28,
    title: "THE ANOMALY",
    briefing: "Aktywność jednego z członków IT (w audit_logs) radykalnie różni się od średniej dla całego zespołu. Namierzmy go analitycznie.",
    objective: "Oblicz średnią ilość operacji audytu na pracownika, a następnie znajdź tego (username), którego ilość logów najbardziej odstaje od tej średniej (użyj funkcji ABS).",
    requiredRows: [{ username: "admin_sys" }],
    maxRows: 5,
    requiredKeywords: ["AVG", "ABS"], 
    rewardXP: 3200,
    hints: [
      { id: 1, text: "Utwórz CTE sumujące ilość wpisów na każdego użytkownika w audit_logs.", cost: 800 },
      { id: 2, text: "Utwórz drugie CTE wyliczające średnią wartość (AVG) z pierwszego CTE.", cost: 1600 },
      { id: 3, text: "W głównym zapytaniu posortuj wyniki używając ORDER BY ABS(ilosc - srednia) DESC LIMIT 1.", cost: 2400 }
    ]
  },
  {
    id: 29,
    title: "ORACLE'S LAST FOOTSTEP",
    briefing: "Zbliżamy się do finału. Ostatni wpis o wyjściu ORACLE'a (EXIT) z budynku to zmyłka. Gdzie naprawdę znajdował się na moment przed tym, zanim sfabrykowano ten log?",
    objective: "Wykorzystaj funkcję ROW_NUMBER() wewnątrz CTE. Znajdź dokładną nazwę lokacji (name z locations), w której ORACLE zarejestrował swoje PRZEDOSTATNIE zdarzenie chronologicznie w access_logs.",
    requiredRows: [{ name: "SERVER_ROOM_03" }],
    maxRows: 1,
    requiredKeywords: ["ROW_NUMBER", "OVER"], 
    rewardXP: 4000,
    hints: [
      { id: 1, text: "Stwórz CTE pobierające logi ORACLE'a posortowane po dacie (ORDER BY created_at DESC).", cost: 1000 },
      { id: 2, text: "Dodaj do kolumn CTE funkcję ROW_NUMBER() OVER (ORDER BY created_at DESC).", cost: 2000 },
      { id: 3, text: "W zewnętrznym zapytaniu odfiltruj wiersz, w którym wartość tej funkcji wynosi 2.", cost: 3000 }
    ]
  },
  {
    id: 30,
    title: "THE LAST QUERY",
    briefing: "Dotarłeś do końca. Wszystko, czego potrzebowałeś, znajduje się w bazie. NEXUS próbował ukryć prawdę, ORACLE próbował ją ujawnić.",
    objective: "Odtwórz ostatnie zapytanie ORACLE'a. Wynik musi składać się z trzech kolumn: 'full_name' powiązane z oracle_01, 'node_name' odpowiadające węzłowi NODE_07, oraz 'controller' zawierające pełne imię CTO NEXUS.",
    requiredRows: [{ full_name: "Adrian Voss", node_name: "NODE_07", controller: "Elias Voss" }],
    maxRows: 1,
    requiredKeywords: ["AS"], 
    rewardXP: 5000,
    unlocksEvidence: "EVD_FINAL_PROTOCOL",
    hints: [
      { id: 1, text: "Finał wymaga podzapytań skalarnych (SELECT ... AS) dla każdej kolumny wynikowej osobno.", cost: 1000 },
      { id: 2, text: "Pierwsza kolumna: (SELECT full_name FROM employees WHERE username = 'oracle_01') AS full_name", cost: 2000 },
      { id: 3, text: "Skonstruuj pozostałe dwie kolumny (dla node_name i controller) w dokładnie ten sam sposób w jednej linijce.", cost: 3000 }
    ]
  }
];