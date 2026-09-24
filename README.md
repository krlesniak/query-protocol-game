# Query Protocol — NEXUS_OS

🔗 **[Play the game live here!](https://queryprotocol.netlify.app)**

Query Protocol (NEXUS_OS) is an interactive, browser-based SQL detective game. You play as a security analyst investigating the mysterious disappearance of ORACLE, NEXUS Corporation's Chief Security Architect. 

Write real SQL queries, inspect hidden evidence, and uncover the truth behind Project MIRROR.

## Game Overview

The investigation takes place entirely inside your browser. There is no simulated SQL interface. You execute real SQL queries against a real SQLite database running locally to progress through the story.

### Key Features

* **Real SQL Engine:** Uses sql.js (WebAssembly SQLite) to execute actual SQL queries.
* **30 Investigative Levels:** Gradually increasing difficulty introducing concepts from SELECT and JOIN to UNION, triggers, and recursive queries.
* **Interactive Evidence:** Inspect blueprints, logs, and documents. Zoom, pan, and find hidden hotspots, passwords, and cinematic secrets.
* **Immersive Interface:** A dark, CRT-style corporate terminal aesthetic with scanlines, noise, and glitch effects.
* **Advanced Code Editor:** Integrated Monaco Editor with a custom syntax highlighting theme.
* **Persistent State:** Game progress is saved locally using Zustand Persist.

## Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling & Animation:** Tailwind CSS, Framer Motion
* **State Management:** Zustand (with persist middleware)
* **Core Libraries:** Monaco Editor, sql.js, react-zoom-pan-pinch, lucide-react

## Getting Started

Make sure you have Node.js and npm installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/krlesniak/query-protocol-game.git
   cd query-protocol-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Open `http://localhost:5173` in your browser.
