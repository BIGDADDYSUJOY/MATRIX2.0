## 2024-05-20 - WaveEngine Optimization
**Learning:** Batching Canvas path operations (beginPath/stroke) and hoisting loop invariants (divisions to multiplications) significantly reduces GPU and CPU overhead in high-frequency animation loops. Using a `useRef` bridge for state allows continuous animation without loop restarts during parameter updates.
**Action:** Always check for redundant draw calls and expensive math in hot loops. Use the ref-bridge pattern for props-to-animation-loop synchronization to avoid visual jitters.
