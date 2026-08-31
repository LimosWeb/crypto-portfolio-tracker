# CryptoPulse

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

**CryptoPulse** is a high-performance web platform for real-time cryptocurrency market monitoring, technical analysis, and portfolio simulation. Designed as a modular Single Page Application (SPA), it provides a fluid, premium, and seamless user experience (60 FPS), interfacing with CoinGecko's public APIs.

## Feature Overview

*   **Live Market & Sparklines:** Top 100 cryptocurrencies leaderboard with silent automatic polling every 30s. Includes a local debounced search engine, multi-directional sorting on every metric, and zero-dependency vector mini-charts (Sparklines) for 7-day trends.
*   **Interactive Multi-Timeframe Charts:** Visualization of historical trends (24h, 7d, 30d, 1y) through a custom SVG Canvas. CoinGecko data is normalized on the fly. The chart features dynamic gradients that change color based on the trend (bullish/bearish) and high-precision mouse-reactive tooltips.
*   **Portfolio Tracker & Simulator:** Simulated transaction tracking system. Allows the addition or removal of purchase transactions. Calculates total base cost, current market value, net PnL (Profit and Loss), and percentage yield in real-time.
*   **Asset Allocation Visualization:** Integrated ultra-light SVG donut chart to visualize the percentage breakdown of capital across various purchased cryptocurrencies, weighted by market value.
*   **Instant Bidirectional Converter:** Module for fast crypto/fiat (USD, EUR, GBP) conversion with quick amount presets, live exchange rate synchronization, and instant reverse formula generation.

## Tech Stack & Architectural Decisions

*   **React 18+ + TypeScript:** The core framework. The TypeScript configuration enforces strict checks without using escape hatches like `any`, ensuring end-to-end robustness.
*   **Tailwind CSS (v4):** Utility-first styling system enabling a deep, unified palette design system (native dark mode) and aesthetically modern components (glassmorphism, fluid animations).
*   **Zustand:** Chosen for client-side state management (`useUiStore`, `usePortfolioStore`). It replaces Redux by providing a minimal and reactive footprint. In the portfolio, it leverages the `persist` middleware to automatically save transactions in `localStorage`.
*   **TanStack Query (React Query v5):** The beating heart of the server state. It handles data-fetching, intelligent RAM caching, request deduplication, and elegantly orchestrates background polling every 30s without blocking the UI.
*   **Lucide React & Custom SVG:** Essential iconography and graphical rendering without heavy Chart.js/Recharts libraries, minimizing the bundle size and maximizing computational performance.

## Code Architecture & Adopted Patterns

The project follows a minimal and scalable Feature-Sliced structure:
*   `src/components/ui/` - Reusable and "dumb" UI primitives (Button, Input, Skeleton, Modal).
*   `src/features/` - Isolated vertical application modules (market, chart, portfolio, converter, dashboard).
*   `src/hooks/` - Reusable logic and TanStack Query hooks.
*   `src/store/` - Zustand stores (state management).
*   `src/types/` - Global TypeScript interfaces.
*   `src/utils/` - Purely functional helpers and formatters.

### Performance Optimizations Implemented
- **Rendering Isolation:** Highly poll-sensitive components (e.g., `MarketTableRow`, `Sparkline`) are protected with `React.memo` to prevent cascading re-renders.
- **Debouncing:** Live text search implements a custom `useDebounce` hook to avoid blocking user input.
- **Computational Memoization:** Intensive calculations like filtering/sorting and SVG path geometric parsing (`describeArc`, chart coordinates) are wrapped in `useMemo`.
- **Memory Leak Prevention:** Strict cleanup in the component lifecycle (e.g., disconnecting the `ResizeObserver` for charts or removing `Escape` keydown listeners in modals).

### Error Boundary & Fallbacks
The code implements preemptive safety fallbacks. A key example is the safe handling (`value != null`) of missing or `undefined` CoinGecko metrics, ensuring the UI and mathematical tools do not crash during anomalous network scenarios or with highly illiquid assets.

## Local Setup & Available Scripts

### Prerequisites
- Node.js (version >= 18 recommended)
- npm (or yarn/pnpm)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/LimosWeb/crypto-portfolio-tracker.git
cd crypto-portfolio-tracker
npm install
```

### Development Start (Dev Server)

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Production Build

To compile the application for production (simultaneously running strict TypeScript type checking):

```bash
npx tsc --noEmit
npm run build
```

To locally test the newly generated final build:

```bash
npm run preview
```
