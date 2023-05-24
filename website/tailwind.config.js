/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    fontFamily: {
      body: `'DejaVu Sans', sans-serif`,
      mono: `'Iosevka', monospace`,
    },
    colors: {
      cat: {
        rosewater: '#f5e0dc',
        flamingo: '#f2cdcd',
        pink: '#f5c2e7',
        mauve: '#cba6f7',
        red: '#f38ba8',
        maroon: '#eba0ac',
        peach: '#fab387',
        yellow: '#f9e2af',
        green: '#a6e3a1',
        teal: '#94e2d5',
        sky: '#89dceb',
        sapphire: '#74c7ec',
        blue: '#89b4fa',
        lavender: '#b4befe',
        text: '#cdd6f4',
        subtext: '#bac2de',
        overlay: '#9399b2',
        surface: '#45475a',
        base: '#1e1e2e',
        mantle: '#181825',
        crust: '#11111b',
        neutral: '#404040',
        neutral700: '#d4d4d4',
        neutral500: '#737373',
        orange500: '#ea580c',
        slate700: '#334155',
      },
    },
    styles: {
      global: {
        body: {
          bg: 'cat.base',
          color: 'cat.text',
        },
      },
    },
  },

  plugins: [],
}
