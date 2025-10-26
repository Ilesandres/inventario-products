/** @type {import('tailwindcss').Config} */
module.exports = {
  // Config requested by the issue: scan all project src files for Tailwind usage
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

