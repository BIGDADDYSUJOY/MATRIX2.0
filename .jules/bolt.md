## 2025-05-14 - Canvas Loop and React Render Optimization
**Learning:** Using a `useRef` bridge for reactive state in a Canvas `requestAnimationFrame` loop prevents expensive loop reconstructions and state resets (like `time` variables) during high-frequency updates (e.g., slider adjustments or keyboard controls). Hoisting loop invariants and batching Canvas draw calls (like grid lines) significantly reduces CPU/GPU overhead per frame.
**Action:** Always bridge high-frequency state updates to animation loops via `useRef` and look for batching opportunities in Canvas rendering logic.
