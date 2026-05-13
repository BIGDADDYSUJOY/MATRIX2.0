## 2024-05-20 - [Memoization Anti-Pattern in Lists]
**Learning:** Wrapping a component in `React.memo` is ineffective if any prop is an anonymous function created in the parent's render loop (e.g., `onClick={() => handler(id)}`).
**Action:** Refactor child components to accept raw data and stable `useCallback` handlers separately. The child should invoke the handler with its own ID inside its own scope to maintain reference stability of props passed from the parent.

## 2024-05-20 - [Decoupling Canvas Animation from Props]
**Learning:** Tying a `requestAnimationFrame` loop directly to a prop-dependent `useEffect` causes the animation to restart/jitter whenever props change.
**Action:** Use an empty dependency array for the animation `useEffect` to ensure a continuous loop, and use `useRef` to bridge the latest prop values into the drawing function.
