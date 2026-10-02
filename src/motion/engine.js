/* ==========================================================================
   Motion engine
   --------------------------------------------------------------------------
   Two shared systems, no per-component scroll listeners:

   1. Reveal observer  – ONE IntersectionObserver adds `.is-in` to elements
      the first time they enter the viewport (one-shot entrances).

   2. Scroll loop      – ONE passive scroll listener + requestAnimationFrame.
      Only elements near the viewport are measured. Each frame it reads all
      rects first, then writes CSS custom properties (--in, --out, --p) in a
      single batch (no layout thrash). Values are eased (lerped) so motion
      feels like inertia rather than being glued to the wheel.

   All visual choreography lives in motion.css and reads those variables.
   ========================================================================== */

const isBrowser = typeof window !== 'undefined'
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))

const reducedQuery = isBrowser ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
export const prefersReducedMotion = () => Boolean(reducedQuery && reducedQuery.matches)

/** Add the class that activates the hidden "before" states in CSS. */
export function enableMotion() {
  if (isBrowser) document.documentElement.classList.add('motion-ready')
}

/* --------------------------------------------------------------------------
   1. One-shot reveals
   -------------------------------------------------------------------------- */

const REVEAL_STEP = 80 // ms between elements that appear in the same batch
const REVEAL_MAX_STEPS = 5 // cap so a fast scroll never creates long delays

let revealObserver = null
const revealMeta = new WeakMap()

function onReveal(entries) {
  const visible = entries.filter((e) => e.isIntersecting)

  // Cascade top-to-bottom, then left-to-right
  visible.sort((a, b) => {
    const dy = a.boundingClientRect.top - b.boundingClientRect.top
    return Math.abs(dy) > 8 ? dy : a.boundingClientRect.left - b.boundingClientRect.left
  })

  let n = 0
  visible.forEach((entry) => {
    const el = entry.target
    const meta = revealMeta.get(el)
    if (meta && meta.auto) {
      el.style.setProperty('--delay', `${Math.min(n, REVEAL_MAX_STEPS) * REVEAL_STEP}ms`)
      n += 1
    }
    el.classList.add('is-in')
    revealObserver.unobserve(el)
    revealMeta.delete(el)
  })
}

export function observeReveal(el, { auto = true } = {}) {
  if (!isBrowser) return () => {}

  // Old browsers: never leave content hidden.
  if (!('IntersectionObserver' in window)) {
    el.classList.add('is-in')
    return () => {}
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(onReveal, {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px',
    })
  }

  revealMeta.set(el, { auto })
  revealObserver.observe(el)

  return () => {
    if (revealObserver) revealObserver.unobserve(el)
    revealMeta.delete(el)
  }
}

/* --------------------------------------------------------------------------
   2. Scroll-linked values
   -------------------------------------------------------------------------- */

// Easing speed. Touch screens already have native momentum, so ease less there.
const RATE = isBrowser && window.matchMedia('(pointer: coarse)').matches ? 22 : 11

let vh = isBrowser ? window.innerHeight : 800

/**
 * How each mode turns an element's rect into progress values (all 0 → 1).
 *   in  : how far the element has risen into view
 *   out : how far it has travelled out through the top
 *   p   : overall progress through the viewport (used for parallax)
 */
const measures = {
  // Hero: 0 at the top of the page → 1 as the hero scrolls away.
  // Capped to the viewport so a tall stacked (mobile) hero doesn't fade too slowly.
  hero: (r) => ({ p: clamp(-r.top / Math.min(r.height * 0.9, vh * 0.85)) }),

  // Sections: enter only (draws the divider line)
  enter: (r) => ({ in: clamp((vh - r.top) / (vh * 0.5)) }),

  // Sections: enter + gentle exit fade
  fade: (r) => ({
    in: clamp((vh - r.top) / (vh * 0.5)),
    out: clamp(1 - r.bottom / (vh * 0.55)),
  }),

  // Large visuals: scale/fade in, parallax while visible, fade on exit
  visual: (r) => ({
    in: clamp((vh - r.top) / (vh * 0.62)),
    out: clamp(1 - r.bottom / (vh * 0.4)),
    p: clamp((vh - r.top) / (vh + r.height)),
  }),

  // Progress through a block (timeline rail)
  progress: (r) => ({ p: clamp((vh * 0.75 - r.top) / Math.max(r.height, 1)) }),

  // Word-by-word text highlight
  text: (r) => ({ p: clamp((vh * 0.88 - r.top) / (vh * 0.5)) }),
}

const byEl = new Map() // element -> item
const active = new Set() // items currently near the viewport
const subscribers = new Set() // plain scroll callbacks (navbar)
const initQueue = []

let activeObserver = null
let raf = 0
let lastT = 0
let lastY = 0
let consumers = 0
let initQueued = false

function write(item) {
  for (const key in item.cur) {
    const s = item.cur[key].toFixed(3)
    if (item.out[key] !== s) {
      item.out[key] = s
      item.el.style.setProperty(`--${key}`, s)
    }
  }
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(tick)
}

function tick(now) {
  raf = 0
  const dt = Math.min(0.064, Math.max(0.001, (now - lastT) / 1000))
  lastT = now

  const y = window.scrollY
  const dy = y - lastY
  lastY = y
  vh = window.innerHeight

  subscribers.forEach((fn) => fn(y, dy))

  // With reduced motion, CSS ignores these variables. Skip all the work.
  if (prefersReducedMotion()) return

  // READ phase: measure everything before writing anything
  const rects = []
  active.forEach((item) => rects.push(item.el.getBoundingClientRect()))

  // WRITE phase
  const k = 1 - Math.exp(-dt * RATE)
  let pending = false
  let i = 0
  active.forEach((item) => {
    const target = measures[item.mode](rects[i++])
    for (const key in target) {
      const cur = item.cur[key]
      const t = target[key]
      const next = Math.abs(t - cur) < 0.0015 ? t : cur + (t - cur) * k
      if (next !== t) pending = true
      item.cur[key] = next
    }
    write(item)
  })

  if (pending) schedule()
}

function onActiveChange(entries) {
  entries.forEach((entry) => {
    const item = byEl.get(entry.target)
    if (!item) return

    if (entry.isIntersecting) {
      active.add(item)
      item.el.setAttribute('data-active', '')
      schedule()
    } else {
      active.delete(item)
      item.el.removeAttribute('data-active')
      // Leave it in its exact final state, no easing
      if (!prefersReducedMotion()) {
        vh = window.innerHeight
        item.cur = measures[item.mode](entry.boundingClientRect)
        write(item)
      }
    }
  })
}

/** Measure all newly registered items in one batch (one layout, not many). */
function flushInit() {
  initQueued = false
  vh = window.innerHeight
  const batch = initQueue.splice(0).filter((item) => byEl.get(item.el) === item)
  const rects = batch.map((item) => item.el.getBoundingClientRect())
  batch.forEach((item, i) => {
    item.cur = measures[item.mode](rects[i])
    if (!prefersReducedMotion()) write(item)
  })
}

function retain() {
  consumers += 1
  if (consumers === 1) {
    lastY = window.scrollY
    lastT = performance.now()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }
}

function release() {
  consumers -= 1
  if (consumers === 0) {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    if (activeObserver) activeObserver.disconnect()
    activeObserver = null
  }
}

/**
 * Link an element to scroll position. Writes --in / --out / --p onto it.
 * The element itself must NOT be transformed by those variables (measure the
 * parent, transform the children), otherwise it would measure its own motion.
 */
export function registerScroll(el, mode) {
  if (!isBrowser || !measures[mode]) return () => {}

  retain()
  const item = { el, mode, cur: {}, out: {} }
  byEl.set(el, item)

  initQueue.push(item)
  if (!initQueued) {
    initQueued = true
    queueMicrotask(flushInit)
  }

  if ('IntersectionObserver' in window) {
    if (!activeObserver) {
      activeObserver = new IntersectionObserver(onActiveChange, { rootMargin: '30% 0px 30% 0px' })
    }
    activeObserver.observe(el)
  }

  return () => {
    if (activeObserver) activeObserver.unobserve(el)
    byEl.delete(el)
    active.delete(item)
    el.removeAttribute('data-active')
    release()
  }
}

/** Subscribe to scroll (rAF-throttled). Callback gets (scrollY, deltaY). */
export function subscribeScroll(fn) {
  if (!isBrowser) return () => {}
  retain()
  subscribers.add(fn)
  schedule()
  return () => {
    subscribers.delete(fn)
    release()
  }
}