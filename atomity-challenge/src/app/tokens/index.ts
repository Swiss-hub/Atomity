export const tokens = {
  colors: {
    bgPrimary: "var(--color-bg-primary)",
    bgCard: "var(--color-bg-card)",
    bgCardHover: "var(--color-bg-card-hover)",
    bgSurface: "var(--color-bg-surface)",

    textPrimary: "var(--color-text-primary)",
    textSecondary: "var(--color-text-secondary)",
    textMuted: "var(--color-text-muted)",

    accentPrimary: "var(--color-accent-primary)",
    accentPrimaryDark: "var(--color-accent-primary-dark)",
    accentPrimaryGlow: "var(--color-accent-primary-glow)",

    accentWarning: "var(--color-accent-warning)",
    accentError: "var(--color-accent-error)",
    accentInfo: "var(--color-accent-info)",

    border: "var(--color-border)",
    borderStrong: "var(--color-border-strong)",

    barLow: "var(--color-bar-low)",
    barMid: "var(--color-bar-mid)",
    barHigh: "var(--color-bar-high)",
  },
  space: {
    1: "var(--space-1)",
    2: "var(--space-2)",
    3: "var(--space-3)",
    4: "var(--space-4)",
    5: "var(--space-5)",
    6: "var(--space-6)",
    8: "var(--space-8)",
    10: "var(--space-10)",
    12: "var(--space-12)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    full: "var(--radius-full)",
  },
  shadow: {
    card: "var(--shadow-card)",
    cardHover: "var(--shadow-card-hover)",
    barGlow: "var(--shadow-bar-glow)",
  },
  fontSize: {
    xs: "var(--font-size-xs)",
    sm: "var(--font-size-sm)",
    md: "var(--font-size-md)",
    lg: "var(--font-size-lg)",
    xl: "var(--font-size-xl)",
    "2xl": "var(--font-size-2xl)",
  },
  transition: {
    fast: "var(--transition-fast)",
    base: "var(--transition-base)",
    slow: "var(--transition-slow)",
  },
} as const;