/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          black: '#000000',
          grayPale: '#f5f5f7',
          ink: '#1d1d1f',
          blueAction: '#0071e3',
          blueLink: '#0066cc',
          blueLuminance: '#2997ff',
          white: '#ffffff',
          graphiteA: '#272729',
          graphiteB: '#262629',
          graphiteC: '#28282b',
          grayNeutral: '#6e6e73',
          grayBorderSoft: '#d2d2d7',
          grayBorderMid: '#86868b',
          grayUtility: '#424245',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter Tight', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
