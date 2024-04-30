module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#323a45',
          light: '#4f5261',
          lighter: '#696c7d',
          dark: '#22252e',
          darker: '#202126',
          bg: '#1e1e1e',
          border: '#373a40',
        },
        white: '#efefef',
        gray: '#cccccc',
        error: "#990100",
        genshin: {
          anemo: '#a5ffd7',
          electro: '#b13fe6',
          dendro: '#92d050',
          pyro: '#df6665',
          hydro: '#6fa8dd',
          cryo: '#99e5ff',
          geo: '#f1c232',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
