export const purpleTheme = {
  primary: "hsl(250, 50%, 50%)",
  primaryForeground: "hsl(45, 29%, 97%)",
  primaryHover: "hsl(250, 50%, 45%)",
  primaryActive: "hsl(250, 50%, 40%)",
  border: "hsl(250, 50%, 50%)",
  input: "hsl(0, 0%, 100%)",
  ring: "hsl(250, 50%, 50%)",
  radius: {
    sm: '0.1875rem',
    md: '0.3125rem',
    lg: '0.4375rem',
    xl: '0.5625rem'
  }
} as const;

export const lightColors = {
  background: "hsl(210, 20%, 98%)",
  foreground: "hsl(224, 71%, 4%)",
  card: "hsl(0, 0%, 100%)",
  cardForeground: "hsl(224, 71%, 4%)",
  popover: "hsl(0, 0%, 100%)",
  popoverForeground: "hsl(224, 71%, 4%)",
  muted: "hsl(220, 14%, 96%)",
  mutedForeground: "hsl(220, 8%, 46%)",
  accent: "hsl(220, 14%, 96%)",
  accentForeground: "hsl(224, 71%, 4%)",
  destructive: "hsl(0, 84%, 60%)",
  destructiveForeground: "hsl(210, 20%, 98%)",
  border: "hsl(220, 13%, 91%)",
  input: "hsl(220, 13%, 91%)",
  ring: purpleTheme.primary,
} as const;

export const darkColors = {
  background: "hsl(224, 71%, 4%)",
  foreground: "hsl(210, 20%, 98%)",
  card: "hsl(224, 71%, 4%)",
  cardForeground: "hsl(210, 20%, 98%)",
  popover: "hsl(224, 71%, 4%)",
  popoverForeground: "hsl(210, 20%, 98%)",
  muted: "hsl(215, 27%, 16%)",
  mutedForeground: "hsl(217, 10%, 64%)",
  accent: "hsl(215, 27%, 16%)",
  accentForeground: "hsl(210, 20%, 98%)",
  destructive: "hsl(0, 62%, 30%)",
  destructiveForeground: "hsl(210, 20%, 98%)",
  border: "hsl(215, 27%, 16%)",
  input: "hsl(215, 27%, 16%)",
  ring: purpleTheme.primary,
} as const;

export type Theme = typeof purpleTheme;
export type ColorTheme = typeof lightColors;
