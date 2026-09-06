import { useEffect, RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * High-performance GSAP ScrollTrigger hook for fanned card stacking.
 * 
 * - Desktop (>= 1024px): Pinned container. As the user scrolls, cards glide in
 *   sequentially from the right and fan out with responsive offsets.
 * - Mobile & Tablet (< 1024px): Unpinned natural vertical stack with individual scroll entrance reveals.
 * - Performance: 100% GPU-accelerated transforms & opacity, zero layout thrashing.
 */
export function useScrollStack(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const mm = gsap.matchMedia(containerRef)

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        isLargeDesktop: '(min-width: 1280px)',
      },
      (context) => {
        const { isDesktop, isLargeDesktop } = context.conditions as {
          isDesktop: boolean
          isMobile: boolean
          isLargeDesktop: boolean
        }

        if (!containerRef.current) return

        const cards = gsap.utils.toArray<HTMLElement>('.fanned-stack-card', containerRef.current)
        if (cards.length === 0) return

        if (isDesktop) {
          // Dynamic wider fanning offsets (Card 01, 02, 03, 04 visibly cascaded & spacious)
          const offsetX = isLargeDesktop ? 76 : 56 // 0, 76, 152, 228 (xl/2xl) or 0, 56, 112, 168 (lg)
          const offsetY = isLargeDesktop ? 14 : 10 // 0, 14, 28, 42

          const getTargetX = (i: number) => i * offsetX
          const getTargetY = (i: number) => i * offsetY

          // Set Initial State: Card 0 in place; Cards 1..N offscreen to the right
          gsap.set(cards[0], {
            x: getTargetX(0),
            y: getTargetY(0),
            autoAlpha: 1,
            scale: 1,
          })

          cards.slice(1).forEach((card, idx) => {
            const actualIdx = idx + 1
            gsap.set(card, {
              x: getTargetX(actualIdx) + (isLargeDesktop ? 180 : 140),
              y: getTargetY(actualIdx) + 20,
              autoAlpha: 0,
              scale: 0.95,
            })
          })

          // Approach section phase progress bar indicator
          const progressBar = containerRef.current.querySelector<HTMLElement>('.approach-progress-bar')

          // Pin container & scrub smoothly with Lenis
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: () => `+=${cards.length * 600}`,
              scrub: 0.8,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progressBar) {
                  gsap.set(progressBar, { scaleX: self.progress })
                }
              }
            },
          })

          // Sequentially slide in Card 02, Card 03, Card 04 into their fanned slot
          cards.slice(1).forEach((card, idx) => {
            const actualIdx = idx + 1
            const startTime = idx * 1.5

            tl.to(
              card,
              {
                x: getTargetX(actualIdx),
                y: getTargetY(actualIdx),
                autoAlpha: 1,
                scale: 1,
                duration: 1.4,
                ease: 'none',
              },
              startTime
            )
          })

          // Brief pause at the end for reading before releasing pin
          tl.to({}, { duration: 0.6 })
        } else {
          // Mobile (< 1024px): Clear all inline styles & transforms from previous desktop runs
          gsap.set(cards, { clearProps: 'all' })

          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                },
              }
            )
          })
        }
      }
    )

    // ScrollTrigger refresh bridge
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 400)

    return () => {
      clearTimeout(timer)
      mm.revert()
    }
  }, [containerRef])
}
