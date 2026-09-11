/** Diseño tomado de lagartosoft.org: monocromo, esquinas rectas, el color solo en el mapa. */

/** Paneles sobre el mapa. Oscuros siempre: el mapa base es claro. */
export const SURFACE = 'rgba(20, 20, 20, 0.94)'
/** El mismo negro sin transparencia, para cuando no hay mapa detrás. */
export const SURFACE_SOLID = '#141414'
export const SURFACE_RAISED = 'rgba(28, 28, 28, 0.96)'

/** Un píxel de borde, nunca una sombra. */
export const BORDER = '#2B2B2B'

export const INK = '#FAFAFA'
export const INK_SECONDARY = '#A8A8A8'
export const INK_MUTED = '#6E6E6E'

/** 6 px es el radio grande de lagartosoft; 2 px el normal. */
/** El verde de la red, el único acento. Se gasta en la acción principal y en nada más. */
export const BRAND = '#2FB894'
/** Lo que se escribe encima del verde o del blanco. */
export const ON_SOLID = '#141414'

export const RADIUS = 6
export const RADIUS_TIGHT = 2

export const FONT = {
  light: 'Geist_300Light',
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
} as const

/** Mayúsculas pequeñas y espaciadas: la única jerarquía que necesita un HUD. */
export const LABEL = {
  fontFamily: FONT.medium,
  fontSize: 10,
  letterSpacing: 1.4,
  color: INK_MUTED,
} as const
