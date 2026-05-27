## 2025-05-15 - useRef Bridge Pattern for Canvas Animation
**Learning:** In React applications with Canvas animation loops, using a `useRef` to bridge frequently changing state (like simulation parameters) allows the `requestAnimationFrame` loop to access current values without requiring the `useEffect` hook to restart. This prevents canvas flicker, reduces GC pressure from frequent effect teardowns, and ensures smooth performance during real-time tuning.
**Action:** Use `useRef` to store animation state that is updated via props or events, and read from these refs inside the `requestAnimationFrame` loop instead of including the state in the effect's dependency array.

## 2025-05-15 - Canvas State Leakage
**Learning:** Global context properties like `shadowBlur` and `shadowColor` persist across frames and `beginPath` calls. Failing to reset them can lead to unexpected visual artifacts and performance hits as the GPU continues to calculate shadows for every subsequent draw operation.
**Action:** Always reset `ctx.shadowBlur = 0` and `ctx.shadowColor = 'transparent'` (or equivalent) after finishing a drawing block that requires shadows.
