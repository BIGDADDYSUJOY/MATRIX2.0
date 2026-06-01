## 2025-05-15 - useRef Bridge for Animation Loops
**Learning:** In React components with Canvas `requestAnimationFrame` loops, passing state directly to the `useEffect` dependencies causes the entire loop to restart (cancel/request) on every state update. This results in visual stutter and higher CPU overhead.
**Action:** Use the "Latest Ref Pattern" (useRef bridge) to sync props/state to a ref, and let the animation loop read from the ref. Keep the `useEffect` dependencies empty (or only mount-related) to maintain a stable, long-running loop.

## 2025-05-15 - Canvas Opaque Optimization
**Learning:** For full-screen or large canvas elements with solid backgrounds, disabling the alpha channel in the 2D context (`{ alpha: false }`) and using `fillRect` instead of `clearRect` significantly reduces compositor overhead and improves frame-to-frame performance.
**Action:** Always initialize canvas contexts with `{ alpha: false }` if the background is opaque.
