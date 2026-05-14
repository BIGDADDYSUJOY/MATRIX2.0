## 2025-05-15 - [Canvas Animation Lifecycle Optimization]
**Learning:** Bridging React state to a Canvas `requestAnimationFrame` loop using `useRef` (and removing the state from the `useEffect` dependency array) provides a significant performance boost. It prevents the entire animation loop from tearing down and re-initializing on every prop change, which also avoids resetting internal animation variables like `time`, leading to smoother visual transitions.
**Action:** Always use `useRef` for high-frequency state updates in Canvas engines to keep the rendering loop stable.

## 2025-05-15 - [HiDPI Canvas Rendering]
**Learning:** Canvas rendering on modern displays appears blurry if `window.devicePixelRatio` isn't accounted for. Scaling the canvas `width` and `height` while using `ctx.scale()` is necessary for visual fidelity.
**Action:** Implement HiDPI scaling in all Canvas-based visualizations.
