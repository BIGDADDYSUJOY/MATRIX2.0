## 2025-05-15 - [Canvas Animation Loop & React Memoization]
**Learning:** Restarting a `useEffect` on every state change for a Canvas animation loop causes jank. Prop stability for `React.memo` is easily broken by inline anonymous functions in `.map` loops.
**Action:** Use `useRef` to store external state needed by the animation loop. Pass stable `useCallback` references to child components and let the child handle passing its own ID to the handler.
