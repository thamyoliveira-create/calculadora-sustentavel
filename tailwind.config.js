/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Paleta principal: tons terrosos extraídos da colagem "o capitalismo
        // consome nosso planeta" (kraft, marrom, verde-musgo). Os tokens
        // forest-*/gold-* são usados em todo o app, então remapeá-los propaga
        // o tema sozinho.
        forest: {
          950: '#201A14', // marrom quase preto — fundo escuro / texto principal
          900: '#3A2E22',
          800: '#56402A',
          700: '#5B6B4F', // verde-musgo (acento "eco")
          100: '#E8ECE0',
          50: '#F5F7F0',
        },
        gold: {
          500: '#B3452F', // vermelho-ferrugem (spray/cartaz)
          400: '#C96B4A',
          300: '#D9A876', // ocre/kraft claro
          100: '#F3E7D6',
          50: '#FBF3E9',
        },
        // Identidade pessoal "tamiris" (Cyber Berry) — usada só como assinatura
        // pontual (logo/nome, selo de autoria), não como paleta do site.
        berry: {
          mint: '#03E39D',
          pink: '#FB58A7',
          blush: '#F4B6DF',
          plum: '#1A0F1C',
          paper: '#FFF5FB',
          mint700: '#00795A',
          pink700: '#C01A6E',
        },
        kraft: {
          950: '#241a11',
          900: '#3a2a1a',
          800: '#4d3821',
          700: '#6b4d2b',
          600: '#8a6537',
          500: '#a97d47',
          400: '#c49760',
          300: '#d9b17e',
          200: '#e8c99e',
          100: '#f1ddbe',
          50: '#f7ead2',
        },
      },
      backgroundImage: {
        'berry-gradient': 'linear-gradient(150deg, #03E39D 0%, #FB58A7 58%, #F4B6DF 100%)',
        'earth-gradient': 'linear-gradient(120deg, #B3452F 0%, #D9A876 100%)',
      },
    },
  },
  plugins: [],
};
