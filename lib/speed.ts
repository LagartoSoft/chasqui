import { useEffect, useRef, useState } from 'react'

/** Peso de la lectura nueva, entre 0 y 1: sin filtro el número salta un par de km/h. */
const SMOOTHING = 0.3

/** Km/h por debajo de los cuales se muestra parado: el GPS nunca da cero exacto. */
const STOPPED_KMH = 2

/** Suaviza la velocidad del GPS para que el número no tiemble. */
export function useSmoothedSpeed(speedKmh: number | null): number | null {
  const [smoothed, setSmoothed] = useState<number | null>(null)
  const previous = useRef<number | null>(null)

  useEffect(() => {
    if (speedKmh === null) {
      previous.current = null
      setSmoothed(null)
      return
    }

    const next =
      previous.current === null
        ? speedKmh
        : previous.current * (1 - SMOOTHING) + speedKmh * SMOOTHING

    previous.current = next
    setSmoothed(next < STOPPED_KMH ? 0 : next)
  }, [speedKmh])

  return smoothed
}
