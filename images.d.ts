// Metro convierte un import de imagen en el id numérico del asset
declare module '*.png' {
  const asset: number
  export default asset
}

declare module '*.ttf' {
  const asset: number
  export default asset
}
