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

export type Theme = typeof purpleTheme;
