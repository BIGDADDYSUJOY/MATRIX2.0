## 2025-05-14 - Canvas Animation Ref-Bridge Pattern
**Learning:** Using a `useRef` bridge for props in a Canvas `requestAnimationFrame` loop prevents expensive `useEffect` teardown/setup cycles when state updates. In React, dependency arrays that include rapidly changing state (like animation parameters) cause the loop to "jump" or flicker because the animation frame is canceled and restarted on every render.
**Action:** Always use a `useRef` to bridge state to Canvas render loops. Update the Ref on every render and let the animation `useEffect` run once on mount with an empty dependency array.

## 2025-05-14 - Canvas Invariant Hoisting
**Learning:** In high-frequency Canvas loops (60FPS), per-pixel operations like division (e.g., `x / width`) add significant CPU overhead across thousands of iterations.
**Action:** Hoist loop invariants (constants like `1 / width`, `Math.PI * freq`) out of the inner drawing loop to replace divisions with multiplications and minimize redundant calculations.
