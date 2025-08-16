/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          orange: '#FF4E50',
          purple: '#2C0B3F',
          blue: '#0A2463',
          deepBlue: '#061539',
          accent: '#FC9842',
          cosmic: '#9381FF',
          nebula: '#B8D8D8',
          star: '#FFFFFF',
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #FF4E50, #2C0B3F, #0A2463)',
      },
      animation: {
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'nebula-shift': 'nebula-shift 15s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'nebula-shift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(10px, 10px) scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
