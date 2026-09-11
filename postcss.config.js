// Tailwind 4 no es un plugin de PostCSS por sí mismo: el compilador vive acá.
// Sin este archivo, `@import "tailwindcss"` entra como CSS literal.
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
