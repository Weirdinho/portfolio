import { useLayoutEffect, useRef } from 'react'
import { observeReveal, registerScroll } from './engine'

/* Small helpers: turn numbers into CSS variable values, skip undefined */
const ms = (v) => (v === undefined ? undefined : `${v}ms`)
const px = (v) => (v === undefined ? undefined : `${v}px`)
const withVars = (base, vars) => {
  const out = { ...base }
  for (const key in vars) if (vars[key] !== undefined) out[key] = vars[key]
  return out
}

/* ---------- Hooks ---------- */

/** Adds `.is-in` the first time the element enters the viewport. */
export function useReveal(ref, { auto = true } = {}) {
  useLayoutEffect(() => {
    const el = ref.current
    return el ? observeReveal(el, { auto }) : undefined
  }, [ref, auto])
}

/** Writes --in / --out / --p onto the element as the user scrolls. */
export function useScrollLinked(ref, mode) {
  useLayoutEffect(() => {
    const el = ref.current
    return el ? registerScroll(el, mode) : undefined
  }, [ref, mode])
}

/* ---------- Components ---------- */

/**
 * One element that fades/slides/scales in once.
 *   delay    : ms. Omit it and elements entering together cascade automatically.
 *   x, y     : start offset in px (scaled down on small screens by CSS)
 *   scale    : start scale, e.g. 0.95
 *   duration : ms
 *   variant  : "blur" adds a soft focus-pull
 */
export function Reveal({
  as: Tag = 'div',
  variant,
  delay,
  x,
  y,
  scale,
  duration,
  className,
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  useReveal(ref, { auto: delay === undefined })

  const vars = withVars(style, {
    '--delay': ms(delay),
    '--rx': px(x),
    '--ry': px(y),
    '--rs': scale,
    '--dur': ms(duration),
  })

  return (
    <Tag ref={ref} className={className} data-reveal={variant || ''} style={vars} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * A group whose DIRECT children animate in one after another.
 *   step : ms between children   base : ms before the first child
 */
export function Stagger({
  as: Tag = 'div',
  step,
  base,
  x,
  y,
  duration,
  className,
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  useReveal(ref, { auto: false })

  const vars = withVars(style, {
    '--step': ms(step),
    '--base': ms(base),
    '--rx': px(x),
    '--ry': px(y),
    '--dur': ms(duration),
  })

  return (
    <Tag ref={ref} className={className} data-stagger="" style={vars} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * Links an element to scroll progress. See engine.js for the modes:
 * hero | enter | fade | visual | progress | text
 */
export function ScrollLinked({ as: Tag = 'div', mode = 'visual', className, children, ...rest }) {
  const ref = useRef(null)
  useScrollLinked(ref, mode)

  return (
    <Tag ref={ref} className={className} data-scroll={mode} {...rest}>
      {children}
    </Tag>
  )
}

/** Apple-style paragraph: words brighten one by one as you scroll. */
export function ScrollText({ as = 'p', className, children }) {
  const words = String(children).split(' ')

  return (
    <ScrollLinked as={as} mode="text" className={className} style={{ '--n': words.length }}>
      {words.map((word, i) => (
        <span className="scroll-word" style={{ '--w': i }} key={i}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </ScrollLinked>
  )
}