import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { smoothHeadingDegrees } from './geo.ts'

/** Cada cuánto avanza el filtro: Android calla en cuanto el rumbo deja de cambiar. */
const TICK_MS = 50

/** Lecturas de gracia: Android arranca el nivel en «sin calibrar» y tarda en corregirlo. */
const CALIBRATION_GRACE_READINGS = 12

/** Nivel de calibración de Android, de 0 a 3, por debajo del cual el rumbo no es fiable. */
const MIN_TRUSTED_ACCURACY = 2

/** Espera antes de dar la brújula por ausente: sin magnetómetro no hay error, hay silencio. */
const SENSOR_TIMEOUT_MS = 6_000

export type Heading = {
  /** Grados horarios desde el norte, ya suavizados. `null` hasta la primera lectura. */
  degrees: number | null
  hasCompass: boolean
  needsCalibration: boolean
}

/** Sigue hacia dónde apunta el teléfono; el rumbo sale de SensorManager y no pasa por Google. */
export function useHeading(enabled: boolean): Heading {
  const [degrees, setDegrees] = useState<number | null>(null)
  const [hasCompass, setHasCompass] = useState(true)
  const [needsCalibration, setNeedsCalibration] = useState(false)

  const target = useRef<number | null>(null)
  const smoothed = useRef<number | null>(null)
  const readings = useRef(0)

  useEffect(() => {
    if (!enabled) return

    let subscription: Location.LocationSubscription | null = null
    let cancelled = false

    const timeout = setTimeout(() => setHasCompass(false), SENSOR_TIMEOUT_MS)

    const tick = setInterval(() => {
      if (target.current === null) return

      smoothed.current = smoothHeadingDegrees(smoothed.current, target.current)
      setDegrees(Math.round(smoothed.current) % 360)
    }, TICK_MS)

    async function watch() {
      subscription = await Location.watchHeadingAsync((reading) => {
        clearTimeout(timeout)
        setHasCompass(true)
        readings.current += 1

        // trueHeading vale -1 sin fix; en Lima la declinación es de un par de grados
        target.current = reading.trueHeading >= 0 ? reading.trueHeading : reading.magHeading

        setNeedsCalibration(
          readings.current >= CALIBRATION_GRACE_READINGS && reading.accuracy < MIN_TRUSTED_ACCURACY,
        )
      })

      if (cancelled) subscription.remove()
    }

    watch()

    return () => {
      cancelled = true
      clearTimeout(timeout)
      clearInterval(tick)
      subscription?.remove()
    }
  }, [enabled])

  return { degrees, hasCompass, needsCalibration }
}
