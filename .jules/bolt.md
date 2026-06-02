## 2025-05-14 - Canvas Animation State Bridge Pattern
**Learning:** In React applications with high-frequency animation loops (e.g., `requestAnimationFrame`), passing state via props often leads to unnecessary `useEffect` restarts and visual stutters. Bridging the prop state to a `useRef` allows the animation loop to access the latest values without triggering hook teardowns.
**Action:** Use a `useRef` to mirror frequently changing props in Canvas-based components. Synchronize the ref in a simple `useEffect` and keep the main animation logic in a dependency-free `useEffect` that starts once on mount.

## 2025-05-14 - Stable Callbacks for List Memoization
**Learning:** `React.memo` on list items is ineffective if the parent passes anonymous functions or unstable callback references (re-created on each render).
**Action:** Always wrap parent handlers in `useCallback` and ensure they have minimal dependencies. In list mapping, pass the stable handler and item ID separately, then invoke the handler with the ID inside the child component.
