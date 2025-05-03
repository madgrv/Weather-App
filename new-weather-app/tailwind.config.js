const { purpleTheme } = require("./src/lib/theme");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: purpleTheme.primary,
          foreground: purpleTheme.primaryForeground,
          hover: purpleTheme.primaryHover,
          active: purpleTheme.primaryActive
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
      },
      borderRadius: {
        sm: purpleTheme.radius.sm,
        DEFAULT: purpleTheme.radius.md,
        md: purpleTheme.radius.md,
        lg: purpleTheme.radius.lg,
        xl: purpleTheme.radius.xl,
        '2xl': '0.75rem'
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        'white-border': '1px 0 0 rgba(240, 240, 245, 0.7), -1px 0 0 rgba(240, 240, 245, 0.7), 0 1px 0 rgba(240, 240, 245, 0.7), 0 -1px 0 rgba(240, 240, 245, 0.7)',
      },
      containerQueries: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
    }
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    },
    require('@tailwindcss/container-queries'),
  ],
}
