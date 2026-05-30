## 2025-05-15 - Layout Thrashing in requestAnimationFrame

**Learning:** Calling `getBoundingClientRect()` or other layout-triggering properties inside a high-frequency loop (like `requestAnimationFrame`) causes forced synchronous layout (reflow). This can severely degrade performance, negating other optimizations.

**Action:** Always cache logical dimensions in a `useRef` or local variable during `resize` events or when they are known to change. Read from the cache inside the render loop.
