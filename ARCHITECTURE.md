# MATRIX 2.0 | SHUNYA Architecture Design

## 1. Overview
MATRIX 2.0 (Shunya) is a unified intelligence system that models reality as a dynamic network of potential, observation, and flow. This architecture translates the "Frequency–Intensity–Chaos" framework into a modular, high-performance software ecosystem.

## 2. Layered Architecture

### A. Mathematics Layer (`/services/waveSimulation.ts`)
- **Responsibility:** Core computational engine for wave dynamics.
- **Components:**
  - Wave equations (Traveling, Standing, Interference).
  - Chaos/Nonlinear transformation logic.
  - State transition matrices.
- **Performance Strategy:** Pure functions, zero dependencies, candidate for WebWorker offloading.

### B. Simulation Layer (`/components/WaveEngine.tsx`)
- **Responsibility:** Bridging math to visualization.
- **Components:**
  - `requestAnimationFrame` orchestration.
  - Coordinate mapping.
  - Particle state management.
- **Performance Strategy:** `useRef` state bridging to decouple visual frame rates from React re-render cycles.

### C. Visualization Layer (`/components/`)
- **Responsibility:** Real-time feedback and interaction.
- **Components:**
  - `NodeCard` (formerly AuditCard): Displays node status and metrics.
  - `DecodeDetail` (formerly AuditDetail): Deep dive into AI-driven reports.
  - Canvas-based Wave visualizer.
- **Performance Strategy:** `React.memo` for list items, batched Canvas draw calls.

### D. Knowledge Layer (`/services/knowledgeService.ts`)
- **Responsibility:** Persistence and retrieval of observations.
- **Components:**
  - JSON/SQLite storage.
  - Pattern recognition indexing.
- **Strategy:** Offline-first capability.

### E. AI Layer (`/services/geminiService.ts`)
- **Responsibility:** Symbolic decoding and "Maquation" generation.
- **Components:**
  - Integration with Gemini 2.0 Flash.
  - JSON schema-driven report generation.

## 3. Recommended Folder Structure
```
/
├── components/          # React Components (UI/Visualization)
│   ├── WaveEngine.tsx
│   ├── NodeCard.tsx
│   └── DecodeDetail.tsx
├── services/            # Logic & Data
│   ├── waveSimulation.ts # Pure math
│   ├── knowledgeService.ts # Storage
│   └── geminiService.ts  # AI Integration
├── types/               # Shared TS interfaces
├── hooks/               # Custom React hooks (e.g., useWaveState)
└── utils/               # Helpers
```

## 4. MVP Roadmap
1. **Phase 1 (Baseline):** Implement decoupled Wave Engine and AI decoding (Complete).
2. **Phase 2 (Modularity):** Extract `waveSimulation.ts` and initialize `Knowledge Layer`.
3. **Phase 3 (Expansion):** Multi-wave interference support and persistent "Pattern Library".
4. **Phase 4 (Mobile):** PWA optimization and offline mode.

## 5. Technical Risks & Validation
- **Risk:** CPU bottleneck during complex interference.
  - **Validation:** Performance profiling of Canvas rendering; transition to OffscreenCanvas/WebWorkers if >16ms/frame.
- **Risk:** AI latency in real-time loops.
  - **Validation:** Asynchronous "Deep Decode" processing with optimistic UI updates.
