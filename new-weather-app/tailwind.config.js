const { purpleTheme } = require("./src/lib/theme");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: purpleTheme.primary,
          foreground: purpleTheme.primaryForeground,
          hover: purpleTheme.primaryHover,
          active: purpleTheme.primaryActive
        },
        border: purpleTheme.border,
        input: purpleTheme.input,
        ring: purpleTheme.ring,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))"
      },
      borderRadius: {
        sm: purpleTheme.radius.sm,
        DEFAULT: purpleTheme.radius.md,
        md: purpleTheme.radius.md,
        lg: purpleTheme.radius.lg,
        xl: purpleTheme.radius.xl,
        '2xl': '0.75rem'
      }
    }
  }
};
