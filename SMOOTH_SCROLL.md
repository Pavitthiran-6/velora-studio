# Smooth Scroll — Architecture & Rules

> **This document is critical context for any AI model or developer working on this project.**
> Read this before adding any new page, section, or scroll-related code.

---

## How It Works

This project uses a **custom RAF lerp-based smooth scroll** system — NOT CSS `scroll-smooth`, NOT a library.

**Files involved:**

| File | Role |
|---|---|
| `src/hooks/useSmoothScroll.ts` | Core hook — intercepts wheel/touch, lerps scrollTop every frame |
| `src/components/SmoothScrollProvider.tsx` | React Context wrapper — shares the container ref app-wide |
| `src/components/RootLayout.tsx` | Global layout — **this is the single entry point for all pages** |

---

## The Golden Rule

> **Any page/section inside `<RootLayout>` gets smooth scroll automatically. Zero extra setup.**

The smooth scroll is applied **once** at the root level via `RootLayout`. It covers:
- ✅ All current sections (Hero, About, Recent Work, Principles)
- ✅ Any new sections added inside App.tsx
- ✅ Any future pages added as children of `RootLayout`

---

## Rules for AI Models — DO NOT violate these

### ✅ DO

```tsx
// Adding a new section — just put it inside the existing container in App.tsx
<section className="...">
  <NewSection />
</section>
```

```tsx
// Adding a new page (with routing) — wrap it in RootLayout
<RootLayout>
  <NewPage />
</RootLayout>
```

```tsx
// Using scroll progress in any component
import { useSmoothScrollContext } from "@/components/SmoothScrollProvider";
import { useScroll } from "motion/react";

const { containerRef } = useSmoothScrollContext();
const { scrollYProgress } = useScroll({ container: containerRef });
```

### ❌ DO NOT

```tsx
// NEVER add scroll-smooth CSS class to any container
<div className="scroll-smooth overflow-y-auto"> ❌

// NEVER create a new overflow-y-auto container without SmoothScrollProvider
<div className="overflow-y-auto h-screen"> ❌  // smooth scroll won't apply

// NEVER wrap a page in its own SmoothScrollProvider when RootLayout is already used
<SmoothScrollProvider>  ❌ // causes double-smoothing lag
  <NewPage />
</SmoothScrollProvider>

// NEVER use useSpring on scrollYProgress for scroll-linked parallax
const smooth = useSpring(scrollYProgress, ...); ❌ // causes lag/trailing
// Use raw scrollYProgress directly instead ✅
```

---

## Ease / Feel Tuning

The ease value is set in `App.tsx` on the `<SmoothScrollProvider ease={0.09}>` line.

| Value | Feel |
|---|---|
| `0.06` | Ultra smooth / floaty |
| `0.09` | Apple.com style ← **current** |
| `0.12` | Snappy smooth |
| `0.18` | Near-instant |

---

## Current Page Structure

```
App.tsx
└── <SmoothScrollProvider containerRef={containerRef} ease={0.09}>
      └── <div ref={containerRef}>  ← THE scroll container
            ├── Hero section
            ├── About section
            ├── RecentWork section   (horizontal parallax carousel)
            ├── Principles section   (horizontal sticky scroll)
            └── [new sections go here]
```

> **Note:** `App.tsx` owns its own custom scroll container div (not a full-page window scroll)
> because the design has a red border/padding around the entire app. This is intentional.
> `RootLayout` is ready to use for any future standard pages (window scroll).

---

## Adding a Future Page (with React Router)

When adding routing later:

```tsx
// main.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/components/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout><HomePage /></RootLayout>,
  },
  {
    path: "/work",
    element: <RootLayout><WorkPage /></RootLayout>,
  },
]);
```

Each page gets smooth scroll automatically through `RootLayout`. No extra code needed.
