# 🗺️ ROADMAP: Query_Protocol: Zaginiony ORACLE

Projekt przeglądarkowej gry logiczno-fabularnej opartej na języku SQL.

## 🛠️ ETAP 1: Konfiguracja Środowiska i Szkielet Aplikacji
- [ ] 1.1 Inicjalizacja projektu (Vite + React + TypeScript).
- [ ] 1.2 Instalacja i konfiguracja Tailwind CSS.
- [ ] 1.3 Instalacja biblioteki komponentów (shadcn/ui, Lucide Icons).
- [ ] 1.4 Utworzenie podstawowej struktury katalogów (`components`, `store`, `db`, `game`).
- [ ] 1.5 Przygotowanie głównego layoutu (Siatka CSS: Lewy Panel, Środek, Prawy Panel, Dół).

## 🗄️ ETAP 2: Silnik Bazy Danych (SQL.js)
- [ ] 2.1 Instalacja `sql.js` (SQLite w WebAssembly).
- [ ] 2.2 Utworzenie serwisu `DatabaseService` do ładowania pliku bazy i wykonywania zapytań.
- [ ] 2.3 Obsługa asynchronicznego ładowania bazy przy starcie aplikacji.
- [ ] 2.4 Zabezpieczenie silnika (ochrona przed zawieszeniem przeglądarki nieskończoną pętlą/ciężkim zapytaniem).
- [ ] 2.5 Wyświetlanie surowych wyników zapytań w konsoli (Proof of Concept).

## 💻 ETAP 3: Interfejs Użytkownika (UI) i Edytor
- [ ] 3.1 Integracja `@monaco-editor/react` (Edytor SQL).
- [ ] 3.2 Konfiguracja edytora (Motyw Dark/Cyberpunk, podświetlanie składni SQL, wyłączenie niepotrzebnych funkcji).
- [ ] 3.3 Obsługa skrótu `Ctrl+Enter` / `Cmd+Enter` do uruchamiania zapytań.
- [ ] 3.4 Utworzenie dynamicznej tabeli wyników (wyświetlanie rezultatów SQL w środkowym panelu).
- [ ] 3.5 Zbudowanie terminala na dole ekranu (wyświetlanie błędów składni, czasu wykonania, logów).

## 🧠 ETAP 4: Stan Gry i Logika Rozgrywki (Zustand)
- [ ] 4.1 Inicjalizacja store'a (gameStore.ts) za pomocą Zustand.
- [ ] 4.2 Definicja interfejsu (stan: aktualny poziom, punkty, odblokowane tabele, zdobyte dowody rzeczowe).
- [ ] 4.3 Stworzenie weryfikatora wyników (LevelValidator) – sprawdzanie, czy wynik zapytania gracza spełnia warunki ukończenia poziomu.
- [ ] 4.4 Mechanizm przejścia do kolejnego poziomu (zmiana stanu, aktualizacja UI).
- [ ] 4.5 System Zapisów: persystencja stanu w localStorage (możliwość wznowienia gry po zamknięciu karty).
- [ ] 4.6 Mechanika Kolekcjonerska: funkcje do odblokowywania i przechowywania unikalnych identyfikatorów zdobytych zdjęć/dokumentów.

## 🕵️‍♂️ ETAP 5: Architektura Bazy i Pierwsze Poziomy
- [ ] 5.1 Stworzenie pliku `init.sql` (struktura tabel, mockowane dane z zachowaniem sensu fabularnego).
- [ ] 5.2 Mechanika "Odkrywania Bazy" – pokazuj w UI tylko te tabele, które gracz odblokował.
- [ ] 5.3 Zaprojektowanie struktury poziomu (JSON/Obiekt: tytuł, opis, cel, warunek zwycięstwa, nowa tabela do odblokowania).
- [ ] 5.4 Wyzwalacze Dowodów (Triggers) – powiązanie konkretnych, przełomowych zapytań SQL z momentem odblokowania fizycznego dowodu w systemie.
- [ ] 5.5 Wdrożenie 3 pierwszych poziomów (Tutorial, SELECT, WHERE).
- [ ] 5.6 Testowanie warunków zwycięstwa (czy da się je oszukać?).

## 💡 ETAP 6: Systemy Pomocnicze
- [ ] 6.1 Panel Fabularny (Prawy panel): renderowanie aktualnego zadania ("Mission Briefing").
- [ ] 6.2 Przeglądarka Dowodów (Lightbox/Modal) – system pozwalający graczowi powiększyć miniaturę i zbadania pełnowymiarowego zdjęcia lub dokumentu wraz z opisem z akt sprawy.
- [ ] 6.3 System Hintów (3 poziomy podpowiedzi, dedukcja punktów za użycie).
- [ ] 6.4 Historia zapytań (możliwość przewijania poprzednio wpisanych komend strzałkami góra/dół).
- [ ] 6.5 System Punktacji (naliczanie punktów za ukończenie poziomu, mniejszą ilość zapytań, brak hintów).

## 🎨 ETAP 7: Polerowanie i "Juice" (Framer Motion)
- [ ] 7.1 Animacje odblokowywania nowych tabel/lokacji.
- [ ] 7.2 Efekty wizualne przy sukcesie ("ACCESS GRANTED") i błędzie ("SYNTAX ERROR").
- [ ] 7.3 Stylowanie tabeli wyników (odpowiedni padding, kolory, responsywność).
- [ ] 7.4 Menu Główne (Start Nowej Gry, Kontynuuj, Ostrzeżenie o restarcie progresu).

## 🚀 ETAP 8: Pełna Zawartość (Wielki Finał)
- [ ] 8.1 Wdrożenie poziomów 4-15 (rosnący poziom trudności).
- [ ] 8.2 Przygotowanie zasobów graficznych (zdjęcia z monitoringu, skany dokumentów, legitymacje) do zasilenia systemu dowodów.
- [ ] 8.3 Rozbudowa `init.sql` o dodatkowe tysiące rekordów (aby wymusić korzystanie z filtrów).
- [ ] 8.4 Dodanie Easter Eggów (ukryte wpisy uruchamiające specjalne notatki po znalezieniu).
- [ ] 8.5 Balans trudności i testy użyteczności.
- [ ] 8.6 Build produkcyjny i deploy (np. Vercel).

## 📝 BACKLOG / DO WDROŻENIA W KOLEJNYCH ETAPACH
- [ ] **Optymalizacja Schematu Bazy:** Zmniejszyć liczbę niepotrzebnych kolumn w tabelach, aby nie przytłaczały przy dużej liczbie rekordów (np. tysiącach logów).
- [ ] **Spójne Klucze Obce (Foreign Keys):** Upewnić się, że tabele mają wspólne, czytelne kolumny (np. `location_id`, `user_id`) idealnie przygotowane pod przyszłe operacje `JOIN`.
- [ ] **Restrykcyjna Walidacja (Strict Mode):** System ma akceptować tylko ściśle określone kolumny w wyniku – koniec z zaliczaniem poziomu za pomocą wyciągania całego stogu siana przez `SELECT *`.
- [ ] **Skalowanie Trudności:** Wyraźnie podnieść poprzeczkę w kolejnych etapach, aby zagadki wymagały łączenia faktów i prawdziwego główkowania.
- [ ] **Side-Questy i Easter Eggi:** Mechanika pozwalająca znaleźć ukryty dowód, akta lub wskazówkę za pomocą zapytania, które nie jest bezpośrednim rozwiązaniem poziomu (nagradzanie gracza za ciekawość i eksplorację).