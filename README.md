# Atomity Frontend Challenge - Cloud Cost Explorer

A scroll-triggered, animated cloud cost drill-down dashboard built for the Atomity frontend engineering challenge.

**Live Demo:** [(https://atomity-xi.vercel.app/)]

---

## Feature Choice

I chose **Option A (0:30–0:40)** - the cloud cost breakdown dashboard.

The video showed a bar chart with a data table and a drill-down interaction across three levels: Cluster → Namespace → Pod. Rather than reproducing it pixel-for-pixel, I used it as a conceptual starting point and pushed the UI/UX further with richer animations, a token-driven dark mode, skeleton loading states, and a more polished visual hierarchy.

---

## Approach to Animation

All animations are scroll-triggered using a custom `useInView` hook built on the native **Intersection Observer API**. Framer Motion handles the actual animation execution.

Key animation decisions:

- **Bars** grow upward from the baseline using `scaleY` with `transformOrigin: "bottom"` and a spring-like cubic bezier `[0.34, 1.56, 0.64, 1]` for a subtle natural overshoot
- **Stagger** - each bar and table row animates in with an `index * 0.08s` delay so elements cascade in rather than all appearing at once
- **Number count-up** - table cells count from 0 to their final value using `requestAnimationFrame` and an `easeOutQuart` curve. Fast at the start, gently landing on the final number
- **Drill-down transitions** - `AnimatePresence mode="wait"` ensures old content fades out fully before new content animates in, preventing visual overlap
- **Breadcrumb** - each new step slides in from the left using `AnimatePresence mode="popLayout"` which keeps surrounding elements stable during the transition
- All animations respect `prefers-reduced-motion` - both via a global CSS media query and inside the `useCountUp` hook which skips to the final value immediately if reduced motion is set

---

## Token & Style Architecture

Design tokens are defined once in two places that work together:

- **`src/tokens/global.css`** - CSS custom properties on `:root` and `[data-theme="dark"]`
- **`src/tokens/index.ts`** - TypeScript object referencing those CSS variables as strings

Components never use raw hex values. Every color, spacing, radius, shadow, and transition references a token. This means:

- Dark mode works by swapping the `data-theme` attribute on `<html>` - no component logic needed
- Updating a color means changing it in one place and it propagates everywhere
- `color-mix()` is used for derived values (e.g. highlighted row tint, navbar backdrop) so we never hardcode semi-transparent variants

Modern CSS features used:

- `clamp()` for fluid typography and spacing
- `color-mix()` for dynamic color variations
- Container queries (`@container`) for component-level table responsiveness
- Logical properties (`paddingInline`, `paddingBlock`, `marginInline`)
- CSS nesting in global styles
- `::selection` styling with `color-mix()`

---

## Data Fetching & Caching

Data is fetched from the **DummyJSON** public API (`/users`) and transformed into a realistic cloud cost structure with deterministic seeding - the same API values always produce the same cost numbers, so there's no random flickering between renders.

**TanStack Query** (React Query v5) handles all async state:

- `staleTime: 5 minutes` - no refetch while data is fresh
- `gcTime: 10 minutes` - cached data stays in memory after the component unmounts
- `queryKey: ["cloud-data", timeRange]` - each time range (7d / 30d / 90d) is cached independently. Switching from 30d → 7d → 30d serves the second 30d hit instantly from cache with no network request
- `retry: 2` — failed requests retry twice before showing the error state
- `refetchOnWindowFocus: false` - no surprise refetches when the user switches tabs

Loading state shows an animated skeleton (pulsing placeholder bars and rows). Error state shows a clear message with `role="alert"` so screen readers announce it.

---

## Libraries Used

| Library        | Version | Why                                                            |
| -------------- | ------- | -------------------------------------------------------------- |
| ![Next.js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)       | 15      | App Router, file-based routing, built-in optimizations         |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)          | 19      | UI framework                                                   |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)     | 5       | Type safety across all components and hooks                    |
| ![Framer Motion](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue)  | 11      | Animation library - clean API, great `AnimatePresence` support |
| TanStack Query | 5       | Best-in-class async state management and caching               |
| clsx           | 2       | Conditional class merging utility                              |

No pre-built UI component libraries were used. Every component — cards, badges, bars, breadcrumbs, table rows - was built from scratch.

---

## Project Structure

src/
tokens/
global.css # CSS custom properties (light + dark)
index.ts # TypeScript token references
components/
CostDashboard/
CostDashboard.tsx # Main assembly + drill-down state
BarChart.tsx # Animated bar chart with AnimatePresence
Bar.tsx # Individual bar with scroll trigger + hover
Breadcrumb.tsx # Drill-down navigation trail
CostTable.tsx # Data table with fixed column layout
CostTableRow.tsx # Animated row with count-up cells
FilterBadge.tsx # Time filter + aggregation pills
hooks/
useCloudData.ts # TanStack Query data fetching + transform
useCountUp.ts # RAF-based number animation hook
useInView.ts # Intersection Observer scroll trigger
types/
index.ts # Shared TypeScript interfaces
app/
page.tsx # Page layout, hero, navbar, dark mode
layout.tsx # QueryClientProvider, font, metadata
globals.css # Reset, body styles, reduced motion

---

## Tradeoffs & Decisions

**DummyJSON as data source** - The API doesn't return cloud cost data, so I transform user records into cost figures using deterministic seeding. This satisfies the brief's requirement for real API integration and async state handling while producing data that feels realistic. The tradeoff is that the numbers aren't semantically meaningful - but neither would any mock API's data be.

**Pixel heights for bars instead of percentages** - CSS percentage heights on flex children are unreliable without an explicit parent height. Converting to `heightPercent * 2` pixel values gives precise, predictable bar scaling. The tradeoff is that the chart has a fixed max height of 220px - acceptable for this use case.

**Drill-down state in `CostDashboard`** - All drill state lives in the parent component rather than a context or store. This keeps the data flow simple and explicit for a single-section feature. If this grew into a full application, moving state to Zustand or React context would make sense.

**No unit tests** - Given the 6–8 hour time constraint, I prioritised animation quality, accessibility, and code architecture over test coverage. With more time I'd add Vitest unit tests for the hooks and React Testing Library tests for the drill-down interaction.

---

## What I will love to Improve With More Time

- **Real WebSocket data** - live-updating cost numbers with smooth transitions as values change
- **Sorting** - click a column header to sort the table by that metric
- **Export** - download the current view as a CSV
- **Animations between drill levels** - a more cinematic zoom/morph transition rather than a fade when drilling down
- **Unit + integration tests** - full coverage of hooks and drill-down state machine
- **URL state** - encode the current drill level and selected node in the URL so the view is shareable and survives a page refresh
