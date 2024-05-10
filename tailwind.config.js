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
        error: '#990100',
        desc: '#ffd864',
        yellow: '#f1c232',
        red: '#df6665',
        purple: '#b19fe6',
        blue: '#6fa8dd',
        genshin: {
          anemo: '#33ccb3',
          electro: '#d376f0',
          dendro: '#7bb42d',
          pyro: '#e2311d',
          hydro: '#1c72fd',
          cryo: '#92c8e8',
          geo: '#cfa726',
          pneuma: '#e9dba5',
          ousia: '#7f7edb',
          bol: '#ff8b8a',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
