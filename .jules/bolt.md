## 2025-05-14 - [WaveEngine Optimization]
**Learning:** Bridging props to a `useRef` within a `requestAnimationFrame` loop prevents `useEffect` cleanup/restart cycles. This is critical for smooth Canvas animations where state updates (like phase) happen at 60fps.
**Action:** Always use Ref-bridging for high-frequency state updates in Canvas renderers.

## 2025-05-14 - [HiDPI Canvas Scaling]
**Learning:** `canvas.width` and `canvas.height` must be multiplied by `window.devicePixelRatio`, and `ctx.scale(dpr, dpr)` must be applied for crisp rendering.
**Action:** Use `ctx.setTransform(1, 0, 0, 1, 0, 0)` before `ctx.scale()` in resize handlers to avoid cumulative scaling.

## 2025-05-14 - [Memoization in Lists]
**Learning:** Inline arrow functions in `.map()` loops break `React.memo` because a new function reference is created every render.
**Action:** Pass the stable `useCallback` handler and the item `id` as separate props, then invoke the handler with the `id` inside the child component.
