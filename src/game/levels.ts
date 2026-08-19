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
  // --- AKT I: THE DISAPPEARANCE ---
  {
    id: 1,
    title: "FIRST CONTACT",
    briefing: "Z systemu NEXUS zniknął Główny Architekt, Dr. Adrian Voss (pseudonim: ORACLE-01). Oficjalny raport głosi, że ukradł dane i uciekł, a jego profil został skasowany. Systemy korporacyjne często kłamią.",
    objective: "Ustal aktualny status konta oraz pełne imię i nazwisko pracownika ukrywającego się pod loginem 'oracle_01'.",
    requiredRows: [{ full_name: 'Adrian Voss', status: 'ACTIVE' }],
    maxRows: 1, rewardXP: 150, unlocksTable: 'locations',
    hints: [
      { id: 1, text: "Przeanalizuj tabelę pracowników (employees). Zastanów się, których kolumn potrzebujesz.", cost: 50 },
      { id: 2, text: "Użyj filtrowania, by wyizolować tylko jeden konkretny pseudonim pracownika.", cost: 100 }
    ]
  },
  {
    id: 2,
    title: "LAST LOGIN",
    briefing: "Voss figuruje jako aktywny pracownik, mimo że oficjalnie 'zaginął'. Gdzieś musi być jego baza operacyjna. Dokumentacja HR skrywa ID jego domyślnego obszaru roboczego.",
    objective: "Odnajdź dokładną nazwę lokacji oraz jej sektor, do której oficjalnie przypisany był zaginiony architekt.",
    requiredRows: [{ name: 'SERVER_ROOM_03', sector: 'CORE' }],
    maxRows: 1, rewardXP: 200, unlocksTable: 'access_logs', unlocksEvidence: 'EVD_ORACLE_LAB_LOC',
    hints: [
      { id: 1, text: "Sprawdź, jakie ID lokacji przypisano do pracownika z poprzedniego poziomu.", cost: 50 },
      { id: 2, text: "Przeszukaj nową tabelę lokacji pod kątem znalezionego wcześniej numeru ID.", cost: 100 }
    ]
  },
  {
    id: 3,
    title: "NO EXIT",
    briefing: "Znamy miejsce: SERVER_ROOM_03. Oficjalnie ORACLE opuścił budynek wieczorem. Problem w tym, że żadna kamera nie zarejestrowała jego wyjścia, a system zgłasza nieścisłości.",
    objective: "Udowodnij kłamstwo. Odszukaj log potwierdzający pomyślne WEJŚCIE do tej serwerowni w dniu 12 lutego po godzinie 23:00.",
    requiredRows: [{ action_type: 'ENTER', location_id: 3 }],
    maxRows: 3, rewardXP: 300, unlocksTable: 'incidents', unlocksEvidence: 'EVD_SERVER_LOG_CONTRADICTION',
    hints: [
      { id: 1, text: "Zbadaj tabelę logów dostępu. Musisz pogodzić ze sobą ID lokacji, konkretną akcję logowania oraz datę.", cost: 50 },
      { id: 2, text: "Aby wymusić spełnienie wielu warunków naraz, połącz je operatorem logicznym.", cost: 100 },
      { id: 3, text: "Czas w bazie zapisany jest tekstowo. Możesz szukać wpisów większych (późniejszych) niż '2026-02-12 23:00:00'.", cost: 150 }
    ]
  },
  {
    id: 4, title: "THE GHOST", 
    briefing: "Ktoś wszedł do serwerowni o 23:47. Nagranie z kamer bezpieczeństwa to tylko uszkodzony plik wideo, na którym widać rozmytą sylwetkę. Ktoś wywołał błąd systemu celowo.",
    objective: "Znajdź dokładny opis incydentu o statusie CRITICAL w owej serwerowni z tamtej nocy.",
    requiredRows: [{ description: 'CCTV feed corrupted. Signal lost.' }], maxRows: 1, rewardXP: 350, unlocksTable: 'messages',
    hints: [
      { id: 1, text: "Skoncentruj się na tabeli incydentów (incidents). Zidentyfikuj kolumny opisujące wagę błędu oraz cel.", cost: 100 }, 
      { id: 2, text: "Odfiltruj wyniki tak, aby pokazać tylko krytyczne awarie z konkretnego pomieszczenia.", cost: 200 }
    ]
  },
  {
    id: 5, title: "BORROWED IDENTITY", 
    briefing: "Zidentyfikowałem anomalię w systemie autoryzacji. Karta ORACLE'a nie była używana przez niego. Została na czas ucieczki przypisana operacyjnie komuś z wewnątrz.",
    objective: "Zdemaskuj 'ducha'. Znajdź pracownika działu operacji bezpieczeństwa (SECURITY), który dysponuje 5. poziomem uprawnień. Podaj jego pełne imię i nazwisko.",
    requiredRows: [{ full_name: 'Martin Vale' }], maxRows: 1, rewardXP: 400, unlocksEvidence: 'EVD_GHOST_PROFILE',
    hints: [
      { id: 1, text: "Zamiast wyciągać wszystkie dane, wypisz w zapytaniu tylko jedną konkretną kolumnę zawierającą dane osobowe.", cost: 100 }, 
      { id: 2, text: "Znajdź osobę, która spełnia oba warunki działu i wysokiego poziomu zabezpieczeń (clearance_level).", cost: 200 }
    ]
  },

  // --- AKT II: SOMEONE IS LYING ---
  {
    id: 6, title: "NIGHT SHIFT", 
    briefing: "Martin Vale. Problem w tym, że w kadrach uparcie twierdzi, że tamtej nocy nie było go w budynku. Ktoś jednak sfałszował jego grafik.",
    objective: "Znajdź treść wiadomości wysłanej przez Martina, która dowodzi, że pełnił wtedy nocną zmianę (szukaj słowa 'shift').",
    requiredRows: [{ body: 'Starting my night shift in Sector CORE.' }], maxRows: 1, rewardXP: 450,
    hints: [
      { id: 1, text: "Ustal ID nadawcy, korzystając z wiedzy z poprzedniego zadania, a następnie przeszukaj jego wiadomości.", cost: 100 }, 
      { id: 2, text: "Aby wyszukać fragment tekstu ukryty w dłuższym zdaniu, potrzebujesz mechanizmu wyszukiwania wzorców (często łączonego ze znakami %).", cost: 200 }
    ]
  },
  {
    id: 7, title: "DEAD MAN'S MESSAGE", 
    briefing: "Zaczynamy grzebać za głęboko. System milczy, ale ORACLE był genialnym architektem – wiedział, że zostaną zmanipulowane logi, i ukrył komunikat w starych plikach poczty.",
    objective: "Odszukaj wiadomość wysłaną przez samego ORACLE'a (ID 77), w której ostrzega, by nie ufać systemowi (szukaj słowa 'trust').",
    requiredRows: [{ body: 'If you are reading this, do not trust the logs.' }], maxRows: 1, rewardXP: 500, unlocksEvidence: 'EVD_ECHO_DOC',
    hints: [
      { id: 1, text: "Podobnie jak poprzednio, szukasz specyficznego fragmentu tekstu u konkretnego nadawcy.", cost: 150 }, 
      { id: 2, text: "Użyj znaku wieloznacznego przed i po szukanym słowie, aby upewnić się, że przechwycisz je w każdym kontekście.", cost: 300 }
    ]
  },
  {
    id: 8, title: "THE IMPOSSIBLE TERMINAL", 
    briefing: "Jeden z terminali NEXUS wygenerował setki zdarzeń w ciągu kilku minut, generując zasłonę dymną, gdy Martin wchodził do serwerowni. Ktoś wywołał sztuczny ruch.",
    objective: "Kto próbował złamać zaporę? Podaj ID pracownika, na którego koncie zarejestrowano największą liczbę odrzuconych logowań (access_granted = 0).",
    requiredRows: [{ employee_id: 200 }], maxRows: 1, rewardXP: 600,
    hints: [
      { id: 1, text: "Musisz zebrać odrzucone logi i pogrupować je względem identyfikatora pracownika.", cost: 150 }, 
      { id: 2, text: "Zlicz zgrupowane wiersze i ułóż wyniki w porządku malejącym, by lider znalazł się na szczycie.", cost: 300 }, 
      { id: 3, text: "Obetnij listę wyników do pierwszego rekordu.", cost: 450 }
    ]
  },
  {
    id: 9, title: "THE EMPTY ROOM", 
    briefing: "Znamy ID fałszywego terminala, ale to nam nic nie mówi, dopóki nie dowiemy się, gdzie trwał sztuczny atak. Zapisy monitoringu w tym miejscu pokazują... puste korytarze.",
    objective: "Odczytaj nazwę lokacji z innej tabeli. Do jakiego pomieszczenia sfałszowana karta z poprzedniego poziomu miała najwięcej zablokowanych wejść?",
    requiredRows: [{ name: 'ARCHIVES_DEEP' }], maxRows: 1, rewardXP: 650, unlocksEvidence: 'EVD_ARCHIVE_LOG',
    hints: [
      { id: 1, text: "Musisz połączyć dane z tabeli logów i lokalizacji w miejscu, gdzie zgadzają się ich identyfikatory miejsc.", cost: 150 }, 
      { id: 2, text: "Stosuj aliasy (skróty) do tabel, aby móc precyzyjnie zażądać wyświetlenia kolumny z odpowiedniego źródła.", cost: 300 },
      { id: 3, text: "Narzuć złączonym tabelom filtr sprawdzający ID intruza i status wejścia.", cost: 450 }
    ]
  },
  {
    id: 10, title: "THREE LIARS", 
    briefing: "Dyrektorzy NEXUS mataczą w papierach. Elias Voss – CTO i brat zaginionego – twierdzi, że w noc zniknięcia ORACLE'a nie logował się do sieci korporacyjnej.",
    objective: "To śledztwo wchodzi na wyższy szczebel. Wyciągnij login (username) Dyrektora Technicznego (CTO) firmy NEXUS.",
    requiredRows: [{ username: 'evoss_cto' }], maxRows: 1, rewardXP: 700,
    hints: [
      { id: 1, text: "Sprawdź, jakie stanowiska (pos) zajmują pracownicy i poszukaj skrótu dyrektora ds. technologii.", cost: 250 }, 
      { id: 2, text: "Użyj filtrowania, by wyciągnąć login osoby na tym szczeblu.", cost: 500 }
    ]
  },

  // --- AKT III: THE MIRROR ---
  {
    id: 11, title: "EXECUTIVE ACCESS", 
    briefing: "CTO skłamał. Analiza autoryzacji systemowych wykazała, że to on osobiście wcisnął przycisk usunięcia głównych logów z nocy zniknięcia brata.",
    objective: "Znajdź opis incydentu o statusie 'WARNING', który dokumentuje manualne wymuszenie czyszczenia bazy ('purge').",
    requiredRows: [{ description: 'Manual purge of security logs initiated by executive override.' }], maxRows: 5, rewardXP: 800,
    hints: [
      { id: 1, text: "Przeszukaj incydenty ze statusem ostrzeżenia i poszukaj określonego w briefingu słowa.", cost: 250 }, 
      { id: 2, text: "Wyciągnij samą kolumnę z opisem błędu.", cost: 500 }
    ]
  },
  {
    id: 12, title: "THE MISSING HOUR", 
    briefing: "Mamy wyrwę w czasie między 23:47 a 00:31. ORACLE nie uciekł z danymi. Był przetrzymywany wewnątrz własnej serwerowni przez wewnętrzny oddział bezpieczeństwa.",
    objective: "Zidentyfikuj oddział uderzeniowy. Użyj podzapytania, by wypisać imiona i nazwiska pracowników 'SECURITY', którzy logowali się do serwerowni nr 3.",
    requiredRows: [{ full_name: 'Martin Vale' }], maxRows: 5, rewardXP: 850,
    hints: [
      { id: 1, text: "Zapytanie bazowe to zwykłe wyciągnięcie pełnych imion pracowników ochrony.", cost: 250 }, 
      { id: 2, text: "Wykorzystaj strukturę z operatorem upewniającym się, że ich ID znajduje się (IN) w wynikach z innej tabeli.", cost: 500 },
      { id: 3, text: "Wewnętrzne podzapytanie musi zwracać ID pracowników, którzy weszli do lokacji nr 3 w logach dostępu.", cost: 750 }
    ]
  },
  {
    id: 13, title: "CHAIN OF EVIDENCE", 
    briefing: "Zaskakujący zwrot akcji. Martin Vale z ochrony nie był porywaczem. Ryzykując życie, otworzył serwerownię od wewnątrz, by umożliwić ucieczkę architektowi.",
    objective: "Potwierdź tę hipotezę. Znajdź temat (subject) zaszyfrowanej wiadomości wysłanej przez Martina do ORACLE'a.",
    requiredRows: [{ subject: 'Extraction route clear' }], maxRows: 1, rewardXP: 900, unlocksEvidence: 'EVD_CCTV_ALPHA',
    hints: [
      { id: 1, text: "Musisz połączyć dane co najmniej dwóch osób z tabeli wiadomości.", cost: 500 }, 
      { id: 2, text: "Poszukaj odpowiedniego statusu szyfrowania oraz przyporządkuj nadawcę (Martin) i odbiorcę (ORACLE) na podstawie ich ID.", cost: 1000 }
    ]
  },
  {
    id: 14, title: "PROJECT MIRROR", 
    briefing: "Dlaczego CTO chciał pozbyć się głównego architekta NEXUS? ORACLE natrafił na kod 'PROJECT MIRROR' – system nielegalnie kopiujący i profilujący dane wszystkich klientów korporacji.",
    objective: "Zdemaskuj głównych interesantów projektu. Odszukaj ID pracownika (nadawcy), który rozsyłał maile zatytułowane dokładnie jako 'PROJECT MIRROR'.",
    requiredRows: [{ sender_id: 10 }], maxRows: 1, rewardXP: 1000, unlocksEvidence: 'EVD_DEAD_MAN',
    hints: [
      { id: 1, text: "Wiadomości firmowe ukryte są w tabeli messages.", cost: 500 }, 
      { id: 2, text: "Skup się na precyzyjnym filtrowaniu kolumny odpowiedzialnej za nagłówek komunikatu.", cost: 1000 }
    ]
  },
  {
    id: 15, title: "ORACLE PROTOCOL", 
    briefing: "Znalazłeś ostatni skrypt pozostawiony w kodzie przez zaginionego architekta. Zwykłe metody szukania kłamią, musisz zajrzeć za zasłonę. 'MIRROR to tylko przykrywka'.",
    objective: "Odczytaj ostateczną, zaszyfrowaną instrukcję od ORACLE'a. Połącz tabele, by wyświetlić pełne imię nadawcy wiadomości oraz jej treść (zatytułowaną 'ORACLE PROTOCOL').",
    requiredRows: [{ full_name: 'Adrian Voss', body: 'MIRROR IS NOT THE PROJECT. IT IS THE COVER. DO NOT TRUST NEXUS. FIND NODE_07.' }], maxRows: 1, rewardXP: 2000,
    hints: [
      { id: 1, text: "To zadanie wymaga złączenia tabeli pracowników i wiadomości po identyfikatorze nadawcy, by przypisać danej wiadomości pełne imię.", cost: 500 }, 
      { id: 2, text: "Pamiętaj o dodaniu odpowiednich filtrów do tabeli wiadomości – interesuje Cię tylko konkretny, precyzyjny tytuł oraz zaszyfrowany status.", cost: 1000 },
      { id: 3, text: "Zwróć jako wynik tylko złączoną kolumnę full_name i body.", cost: 1500 }
    ]
  }
];