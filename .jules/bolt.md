## 2025-05-15 - [React/Canvas Synchronization Bottleneck]
**Learning:** In React applications with high-frequency state updates (like an animation parameter loop), updating the `useEffect` dependency array with the state causes the animation loop to restart on every frame. This leads to jitter and high CPU overhead as `requestAnimationFrame` is cancelled and rescheduled repeatedly.
**Action:** Use a `useRef` to bridge the state into a stable `useEffect` loop that runs only once on mount. Update the ref in a separate `useEffect` and read from it inside the `requestAnimationFrame` callback.

## 2025-05-15 - [List Memoization with Anonymous Functions]
**Learning:** Using anonymous arrow functions in `.map()` for prop handlers (e.g., `onClick={() => handle(id)}`) breaks `React.memo` because a new function reference is created on every render, even if `handle` is wrapped in `useCallback`.
**Action:** Pass the stable `useCallback` handler directly and the item ID as a separate prop. Let the child component invoke the handler with its ID to maintain reference stability.
