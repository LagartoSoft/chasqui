/**
 * Funciones puras de geometría, copiadas de `packages/geo` de tupu.
 *
 * Copiadas y no compartidas a propósito: son cincuenta líneas y este
 * repo no tiene workspaces. Si divergen, que diverjan.
 */

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180
const toDegrees = (radians: number): number => (radians * 180) / Math.PI

export type Point = { lat: number; lng: number }

/** Normaliza un ángulo a [0, 360). */
export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360
}

/**
 * Diferencia más corta entre dos ángulos, en el rango [-180, 180].
 *
 * Es lo que evita que la brújula gire 350° para corregir 10° al cruzar el norte.
 */
export function angleDeltaDegrees(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180
}

/**
 * Peso de la lectura nueva frente al valor acumulado en cada paso, entre 0 y 1.
 *
 * Se afina en la calle: más peso tiembla, menos peso va con retraso.
 */
export const HEADING_SMOOTHING = 0.2

/**
 * Suaviza el rumbo de la brújula con un filtro paso bajo exponencial.
 *
 * Promedia seno y coseno, no los grados: entre 359° y 1° la media
 * aritmética da 180° y la brújula pega la vuelta entera al cruzar el norte.
 */
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

/**
 * Distancia entre dos puntos sobre la superficie, en metros.
 *
 * Haversine. A escala de una ciudad el error frente a una elipsoide
 * es de centímetros, y cuesta una fracción de lo que cuesta Vincenty.
 */
export function distanceMeters(from: Point, to: Point): number {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(fromLat) * Math.cos(toLat)

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}
