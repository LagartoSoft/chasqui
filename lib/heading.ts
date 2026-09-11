import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { angleDeltaDegrees, normalizeDegrees, smoothHeadingDegrees } from './geo.ts'
import { COURSE_MIN_KMH } from './location.ts'

/** Cada cuánto avanza el filtro: Android calla en cuanto el rumbo deja de cambiar. */
const TICK_MS = 50

/** Lecturas de gracia: Android arranca el nivel en «sin calibrar» y tarda en corregirlo. */
const CALIBRATION_GRACE_READINGS = 12

/** Nivel de calibración de Android, de 0 a 3, por debajo del cual el rumbo no es fiable. */
const MIN_TRUSTED_ACCURACY = 2

/** Espera antes de dar la brújula por ausente: sin magnetómetro no hay error, hay silencio. */
const SENSOR_TIMEOUT_MS = 6_000

/** Peso de cada muestra al aprender la desviación. Lento: es un sesgo, no ruido. */
const OFFSET_SMOOTHING = 0.05

type HeadingInput = {
  enabled: boolean
  /** Hacia dónde te movés según el GPS, cuando va lo bastante rápido para creerle. */
  courseDegrees: number | null
  speedKmh: number | null
}

type Heading = {
  /** Grados horarios desde el norte, ya suavizados. `null` hasta la primera lectura. */
  degrees: number | null
  hasCompass: boolean
  needsCalibration: boolean
}

/** La brújula manda, pero pedaleando aprende cuánto miente comparándose con el rumbo del GPS. */
export function useHeading({ enabled, courseDegrees, speedKmh }: HeadingInput): Heading {
  const [degrees, setDegrees] = useState<number | null>(null)
  const [hasCompass, setHasCompass] = useState(true)
  const [needsCalibration, setNeedsCalibration] = useState(false)

  const compass = useRef<number | null>(null)
  const smoothed = useRef<number | null>(null)
  const readings = useRef(0)

  const [corrected, setCorrected] = useState(false)
  const offset = useRef<number | null>(null)
  const moving = speedKmh !== null && speedKmh >= COURSE_MIN_KMH

  useEffect(() => {
    if (!moving || courseDegrees === null || compass.current === null) return

    // El manubrio apunta a donde va la bici: lo que sobra es la desviación de la brújula
    const bias = normalizeDegrees(angleDeltaDegrees(compass.current, courseDegrees))
    offset.current = smoothHeadingDegrees(offset.current, bias, OFFSET_SMOOTHING)
    setCorrected(true)
  }, [courseDegrees, moving])

  useEffect(() => {
    if (!enabled) return

    let subscription: Location.LocationSubscription | null = null
    let cancelled = false

    const timeout = setTimeout(() => setHasCompass(false), SENSOR_TIMEOUT_MS)

    const tick = setInterval(() => {
      if (compass.current === null) return

      const target = normalizeDegrees(compass.current + (offset.current ?? 0))
      smoothed.current = smoothHeadingDegrees(smoothed.current, target)
      setDegrees(Math.round(smoothed.current) % 360)
    }, TICK_MS)

    async function watch() {
      subscription = await Location.watchHeadingAsync((reading) => {
        clearTimeout(timeout)
        setHasCompass(true)
        readings.current += 1

        // trueHeading vale -1 sin fix; en Lima la declinación es de un par de grados
        compass.current = reading.trueHeading >= 0 ? reading.trueHeading : reading.magHeading

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

  // Con la desviación aprendida ya no hace falta que el usuario calibre a mano
  return { degrees, hasCompass, needsCalibration: needsCalibration && !corrected }
}
