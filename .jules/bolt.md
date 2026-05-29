## 2025-05-14 - useRef Bridge for Canvas Animation Loops
**Learning:** In React, passing state directly into a `useEffect` that runs a `requestAnimationFrame` loop causes the entire loop to be cancelled and restarted on every state change. This leads to visual stutter and high CPU overhead for teardown/setup.
**Action:** Use a `useRef` to mirror the state and access the ref's current value inside the loop. Keep the effect dependency array empty (or only containing the canvas ref) to maintain a single persistent animation loop.
