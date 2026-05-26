## 2025-05-15 - useRef Bridge for Animation Loops
**Learning:** Using `useRef` to store external state within a `requestAnimationFrame` loop in React prevents the loop from being torn down and recreated whenever dependencies change. This eliminates frame drops and overhead caused by `useEffect` setup/teardown in high-frequency update scenarios.
**Action:** Always bridge high-frequency state (like animation parameters) into render loops via `useRef` rather than putting them in the `useEffect` dependency array.
