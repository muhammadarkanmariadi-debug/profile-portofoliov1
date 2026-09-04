# Animation, GSAP 3 & Lenis Motion Rules

## 1. GSAP Lifecycle & React Integration

* **Use `@gsap/react` (`useGSAP`)**:
  * Never use standard `useEffect` or `useLayoutEffect` for GSAP animations when `@gsap/react` is available.
  * Always provide a container ref scope (`{ scope: containerRef }`) so selector strings are safely scoped to the component and do not collide globally.
  * Cleanup runs automatically when using `useGSAP`. When using `useGSAP` with reactive dependencies, use `{ dependencies: [dep], scope: containerRef, revertOnUpdate: true }`.
  * For callbacks and event listeners created outside the initial render (e.g. `pointermove`, `click`), wrap the handler with `contextSafe` returned by `useGSAP`.

## 2. Lenis Smooth Scroll Integration

* **Central Ticker Synchronization (`app/providers/SmoothScrollProvider.tsx`)**:
  * Lenis drives the native scroll and is bound directly to GSAP's ticker:
    ```ts
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    ```
  * On Next.js route transitions (`usePathname`), automatically call `ScrollTrigger.refresh()` after a short delay (100ms) to ensure viewport trigger positions recalculate accurately.
  * **Nested Scroll Isolation**: Any modal, code container, or lightbox that has internal scrolling MUST have the attribute `data-lenis-prevent` to prevent virtual scroll conflicts.

## 3. High Performance & 60/120fps Standards

* **Compositor Transforms Only**:
  * Animate only GPU-accelerated properties: `x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, `skewY`, and `autoAlpha` / `opacity`.
  * Do NOT animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
  * For high-frequency pointer updates (e.g., custom cursor tracking, magnetic buttons), use `gsap.quickTo()` instead of creating new tweens per frame.

## 4. Responsive Design & Accessibility

* **`gsap.matchMedia()`**:
  * Wrap complex responsive timelines in `gsap.matchMedia()`:
    ```ts
    const mm = gsap.matchMedia(sectionRef);
    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { isDesktop, reduceMotion } = context.conditions;
      if (reduceMotion) {
        gsap.set('.target', { opacity: 1, y: 0 });
        return;
      }
      // Animate
    });
    ```
  * Always respect `prefers-reduced-motion` for accessibility.
