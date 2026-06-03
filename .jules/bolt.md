## 2025-05-15 - Decoupling Canvas Animation from React Lifecycle
**Learning:** In React apps using high-frequency Canvas animations (e.g., 60fps), putting the animation loop inside a `useEffect` with the state in its dependency array causes the entire loop to tear down and restart on every state update. This leads to dropped frames and unnecessary CPU overhead.
**Action:** Use a `useRef` to bridge the React state into the animation loop. Start the loop once in a `useEffect` with an empty dependency array, and read the state from the `ref` within the `requestAnimationFrame` callback.

## 2025-05-15 - Canvas Batching and Loop Invariants
**Learning:** Calling `ctx.stroke()` or `ctx.fill()` inside a loop for many small elements is extremely expensive. Also, per-pixel divisions in a render loop significantly impact performance.
**Action:** Batch drawing operations (like grid lines) into a single `stroke()` call by using `moveTo`/`lineTo` in a loop followed by one `stroke()`. Hoist loop invariants and pre-calculate inverses to replace divisions with multiplications.
