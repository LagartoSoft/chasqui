import { useEffect, useRef, useState } from 'react'

/**
 * Peso de la lectura nueva frente a la acumulada, entre 0 y 1.
 *
 * El mismo problema que la brújula: la velocidad del GPS salta
 * un par de km/h de una lectura a otra y el número quedaría ilegible.
 */
const SMOOTHING = 0.3

/**
 * Por debajo de esto se muestra parado, en km/h.
 *
 * El GPS nunca da cero exacto: quieto en un semáforo sigue reportando
 * dos o tres km/h de deriva, y un velocímetro que nunca baja a cero miente.
 */
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
