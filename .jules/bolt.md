## 2025-05-15 - [WaveEngine Animation Optimization]
**Learning:** Transitioning a Canvas animation loop from a reactive `useEffect` (dependency on state) to a `useRef` pattern prevents the loop from tearing down and restarting on every state update. This is critical for high-frequency updates (e.g., keyboard controls) to avoid visual jitter and high CPU overhead caused by constant buffer re-initialization.
**Action:** Always use `useRef` to bridge high-frequency props/state to animation loops and long-running processes that should not be interrupted.

## 2025-05-15 - [Stable Callback Pattern for List Memoization]
**Learning:** Inline arrow functions in `.map()` loops break `React.memo` because they create a new function reference on every parent render. Refactoring the child component to accept an ID and a stable callback (e.g., `onSelect(id)`) allows the callback reference to remain stable across parent renders.
**Action:** Use stable `useCallback` references and pass ID-based selectors to memoized child components in lists.
