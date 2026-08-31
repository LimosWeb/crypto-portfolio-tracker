---
trigger: always_on
---

# Crypto Portfolio Tracker & Financial Dashboard

## Panoramica del Progetto
Piattaforma web ad alte prestazioni per il monitoraggio in tempo reale dei mercati crypto, analisi tecnica e simulazione di portafoglio.

## Stack Tecnologico
- **Framework:** React 18+ con TypeScript e Vite
- **Styling:** Tailwind CSS v4 con utility classes (`clsx`, `tailwind-merge`)
- **Server State & Caching:** TanStack Query v5
- **Client State & Persistenza:** Zustand con middleware `persist` (localStorage)
- **Grafici:** Lightweight Charts (TradingView) o Canvas/SVG nativo ad alte prestazioni
- **Icone:** Lucide React
- **Path Aliasing:** `@/*` mappato su `./src/*`

## Principi Architetturali e Vincoli Ingegneristici
1. **Separazione dei Dati:**
   - **Server State (TanStack Query):** Prezzi live, trend di mercato, serie storiche da API CoinGecko. Polling controllato a 30s per i prezzi; cache estesa (10m) per i grafici.
   - **Client State (Zustand):** Storico transazioni simulate e preferenze utente persistite in localStorage.
   - **Single Source of Truth (Stato Derivato):** NON duplicare i prezzi di mercato nello store Zustand. Valore attuale, Costo Base, PnL e Allocation si calcolano incrociando i dati al volo via `useMemo` o selettori.
2. **Performance a 60 FPS:**
   - Nessun re-render superfluo: memoizzare le righe della tabella (`React.memo`) e usare selettori atomici per Zustand.
   - I calcoli pesanti e le normalizzazioni delle serie storiche devono avvenire prima del passaggio alla UI/grafici.
3. **TypeScript:** Strict mode abilitato, nessun tipo `any`. Tipi espliciti e centralizzati in `src/types/`.

## Struttura delle Directory
```text
src/
├── api/          # Client API e chiamate esterne (CoinGecko)
├── components/   # Componenti riutilizzabili (ui/, layout/)
├── features/     # Moduli applicativi verticali (market/, chart/, portfolio/, converter/)
├── hooks/        # Hook custom condivisi e query hooks
├── store/        # Store Zustand (portfolio, ui)
├── types/        # Interfacce e tipi TypeScript
└── utils/        # Funzioni pure di calcolo e formattazione