## 2026-05-22 - Optimized WaveEngine Rendering and Stability
**Learning:** Using a `useRef` bridge for state in `requestAnimationFrame` loops prevents `useEffect` thrashing and visual jumps when parameters change. Batching Canvas `stroke()` calls and hoisting invariant calculations out of pixel loops significantly reduces CPU/GPU overhead.
**Action:** Always prefer `useRef` to bridge React state into high-frequency animation loops. Pre-calculate all possible constants outside of loops that run 60+ times per second.
