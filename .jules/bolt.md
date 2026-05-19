## 2026-05-19 - WaveEngine Loop and Draw Call Optimization
**Learning:** High-frequency props (like keyboard-driven wave state) cause expensive React effect thrashing in Canvas components if included in the dependency array. Batching Canvas draw calls (like grid lines) and extracting loop invariants (replacing division with multiplication) yields measurable CPU savings in animation-heavy components.
**Action:** Always bridge high-frequency state to a `useRef` for Canvas render loops. Batch `stroke()` calls and pre-calculate constants outside `for` loops.
