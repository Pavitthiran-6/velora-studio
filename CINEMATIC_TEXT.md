# Cinematic Typography — Architecture & Rules

> **This document is critical context for any AI model or developer working on this project.**
> Read this before adding any heading, section title, or large display text.

---

## What Is This?

A global scroll-linked cinematic typography animation system. Every large heading on the site has letters that:

- **Enter** from different directions (top/bottom/side) as you scroll down into a section
- **Assemble** smoothly into final position when the section is in view
- **Disassemble** elegantly as you scroll past the section (letters drift away)

Each letter has a unique parallax speed, direction, and offset — creating true depth.

---

## The Component

**`src/components/CinematicText.tsx`**

```tsx
import { CinematicText } from "@/components/CinematicText";

// Basic usage — replaces any heading
<CinematicText as="h2" className="...your-existing-classes...">
  SECTION HEADING
</CinematicText>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `h1`–`h6`, `p`, `span`, `div` | `"div"` | Rendered element — use semantic HTML |
| `className` | string | `""` | All existing Tailwind classes — passed through UNCHANGED |
| `children` | string | required | Plain string only. No JSX children. |
| `split` | `"char"` \| `"word"` | `"char"` | Character split for large headings, word split for smaller |
| `intensity` | number (0–1) | `1.0` | Animation strength. 0 = disabled, 0.75 = subtle, 1.0 = full |

---

## Rules for AI Models — DO NOT violate these

### ✅ DO

```tsx
// Any new section heading → use CinematicText
<CinematicText as="h2" className="text-white text-8xl font-black uppercase">
  NEW SECTION
</CinematicText>

// Smaller section headings → use word split
<CinematicText as="h3" className="text-white text-4xl font-black" split="word">
  Subsection Title
</CinematicText>

// Subtle on smaller/denser text
<CinematicText as="h3" className="..." intensity={0.6}>
  Card Title
</CinematicText>
```

### ❌ DO NOT

```tsx
// DO NOT use motion.span char mapping manually — use CinematicText instead
<h1>{"HEADING".split("").map((c, i) => <motion.span key={i}>...</motion.span>)}</h1>  ❌

// DO NOT pass JSX as children — string only
<CinematicText>RECENT<br />WORK<span className="text-red-500">.</span></CinematicText>  ❌
// Instead: put each line in a separate CinematicText
<CinematicText as="h2" className="...">RECENT WORK.</CinematicText>  ✅

// DO NOT apply to body text / paragraph text / small labels
<CinematicText as="p" className="text-sm">Small caption text</CinematicText>  ❌
// Keep CinematicText for display headings only (h1, h2, h3)

// DO NOT use useSpring on scrollYProgress — it causes lag (already fixed globally)
const smooth = useSpring(scrollYProgress, ...);  ❌
```

---

## Animation System Internals

Each character's parallax is seeded deterministically by `(index, total)`:

| Parameter | Range | Effect |
|---|---|---|
| `yDir` | -1 or +1 | Alternating — even chars from top, odd from bottom |
| `xDir` | -1, 0, +1, 0 cycling | Subtle lateral drift |
| `speed` | 0.55–1.0 | Edge chars faster (parallax depth) |
| `yOffset` | 40–80px | Varied distance to travel |
| `rotateBase` | 0.8–3.2° | Tiny rotation before settling |

**Scroll offset triggers:**
- `"start 90%"` — animation starts when element enters 90% down the viewport
- `"end 10%"` — animation ends when element exits 10% from top

This means:
- `scrollProgress 0.0` → letters fully scattered (entering from below)
- `scrollProgress 0.3` → letters assembled (in view)
- `scrollProgress 0.7` → letters still assembled (still in view)
- `scrollProgress 1.0` → letters drift away (exiting to top)

---

## Current Usage

| Component | Heading | Intensity |
|---|---|---|
| `App.tsx` Hero | CREATIVE, WEB, STUDIO | 0.85 |
| `App.tsx` About | DELIVERING... FORWARD. (8 lines) | 0.75 |
| `RecentWork.tsx` | RECENT WORK. | 1.0 |
| `Principles.tsx` | DISCIPLINE, TRUST, PASSION, DEVOTION, PROMISE | 0.9 |

---

## Performance Notes

- All transforms are GPU-composited (`will-change: transform`)
- Only `transform`, `opacity`, `filter: blur()` are animated — zero layout reflow
- `display: inline-block` on each character preserves text flow
- `aria-label` on the parent preserves screen reader accessibility
- `useScroll` is called once per `CinematicText` instance, not per character
- Each character derives transforms from the shared `scrollYProgress` MotionValue via `useTransform`

---

## Adding a New Section

```tsx
// 1. Import
import { CinematicText } from "@/components/CinematicText";

// 2. Use for the heading (string children only)
<section>
  <CinematicText as="h2" className="text-white text-8xl font-black uppercase tracking-tighter">
    NEW SECTION
  </CinematicText>
  <p>Normal body text — no animation needed.</p>
</section>
```

That's it. Smooth scroll + cinematic parallax work automatically — no extra setup.
