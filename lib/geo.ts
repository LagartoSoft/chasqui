/** Geometría pura, copiada de tupu a propósito: son cincuenta líneas y no hay workspaces. */

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180
const toDegrees = (radians: number): number => (radians * 180) / Math.PI

export type Point = { lat: number; lng: number }

/** Normaliza un ángulo a [0, 360). */
export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360
}

/** Diferencia más corta entre dos ángulos: evita girar 350° para corregir 10°. */
export function angleDeltaDegrees(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180
}

/** Peso de la lectura nueva, entre 0 y 1: más tiembla, menos va con retraso. */
export const HEADING_SMOOTHING = 0.2

/** Suaviza el rumbo promediando seno y coseno: entre 359° y 1° la media da 180°. */
export function smoothHeadingDegrees(
  previous: number | null,
  next: number,
  weight: number = HEADING_SMOOTHING,
): number {
  if (previous === null) return normalizeDegrees(next)

  const kept = 1 - weight
  const previousRadians = toRadians(previous)
  const nextRadians = toRadians(next)
  const sin = Math.sin(previousRadians) * kept + Math.sin(nextRadians) * weight
  const cos = Math.cos(previousRadians) * kept + Math.cos(nextRadians) * weight

  return normalizeDegrees(toDegrees(Math.atan2(sin, cos)))
}

/** Radio medio de la Tierra, en metros. */
const EARTH_RADIUS_M = 6_371_008.8

/** Distancia en metros por haversine: a escala de ciudad se equivoca en centímetros. */
export function distanceMeters(from: Point, to: Point): number {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(fromLat) * Math.cos(toLat)

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}
