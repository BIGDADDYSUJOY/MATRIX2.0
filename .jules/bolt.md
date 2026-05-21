## 2025-05-15 - WaveEngine Animation Loop Optimization
**Learning:** In React applications using Canvas and `requestAnimationFrame`, putting the animation state in the `useEffect` dependency array causes the entire loop to be torn down and restarted on every state update. This leads to visual jitter and high CPU overhead as the animation 'reset' logic runs frequently.
**Action:** Use the `useRef` bridge pattern. Keep the latest state in a ref and use an empty dependency array for the main animation `useEffect`. Access the state via `ref.current` inside the `draw` function.

## 2025-05-15 - Canvas Path Batching
**Learning:** Calling `ctx.beginPath()` and `ctx.stroke()` inside a loop for multiple lines is significantly more expensive than batching all `moveTo`/`lineTo` calls into a single path. Each `stroke()` call is a separate GPU command.
**Action:** Always batch related geometric shapes into a single path whenever possible.

## 2025-05-15 - Loop Optimization in Canvas
**Learning:** Performing divisions (e.g., `x / width`) inside a pixel-level loop (running hundreds of times per frame) is a measurable bottleneck.
**Action:** Pre-calculate the inverse (`1 / width`) and other loop-invariant factors outside the loop to replace divisions with multiplications.
