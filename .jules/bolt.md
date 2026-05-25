## 2025-05-15 - [Ref-Bridge Pattern for Animation Loops]
**Learning:** In React components with high-frequency animation loops (requestAnimationFrame), passing state directly as a dependency to useEffect causes frequent effect teardowns, canvas resets, and jank.
**Action:** Use a `useRef` to bridge state updates to the persistent animation loop. Sync the ref in a separate small `useEffect` and keep the main animation `useEffect` dependency-free ([]) to ensure a continuous, flicker-free simulation.
