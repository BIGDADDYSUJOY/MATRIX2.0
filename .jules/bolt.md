## 2024-05-20 - [WaveEngine Component Optimization]
**Learning:** Bridging React props to a `useRef` for use in a `requestAnimationFrame` loop allows the animation to stay decoupled from the React render cycle, preventing expensive effect restarts and canvas flickers. However, using `React.memo` with a custom comparison that always returns `true` prevents the component from re-rendering, which in turn prevents the `useEffect` that synchronizes props to the ref from running.
**Action:** Use `React.memo` without a custom comparison function to allow synchronization effects to run while still preventing unnecessary re-renders of the component's output.

## 2024-05-20 - [Canvas Rendering Efficiency]
**Learning:** Batching grid drawing operations into a single `stroke()` call significantly reduces the overhead of the canvas drawing state machine. Additionally, pre-calculating normalization factors (like `1 / width`) outside of high-frequency loops (like per-pixel wave calculations) replaces expensive division with faster multiplication.
**Action:** Always look for opportunities to batch draw calls and move invariant arithmetic out of per-pixel or high-frequency loops.
