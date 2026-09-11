import {
  LocationManager,
  type GeolocationPosition as MapLibrePosition,
} from '@maplibre/maplibre-react-native'
import { useEffect, useRef, useState } from 'react'
import { distanceMeters, type Point } from './geo.ts'

/** Sin filtro de distancia: con uno, parado no llega ninguna lectura y tardás en aparecer. */
const MIN_DISPLACEMENT_M = 0

/** Movimiento por debajo del cual no vale la pena mover el punto, en metros. */
const STILL_M = 3

/** Pasado esto la lectura que tenemos ya no vale ni de referencia, en milisegundos. */
const STALE_MS = 120_000

/** Cuánto peor puede ser una lectura nueva antes de descartarla de plano, en metros. */
const MUCH_WORSE_M = 200

/** Velocidad desde la que el rumbo del movimiento es de fiar, en km/h. */
export const COURSE_MIN_KMH = 6

const MS_TO_KMH = 3.6

export type LocationPermission = 'pending' | 'granted' | 'denied'

export type CurrentLocation = {
  permission: LocationPermission
  point: Point | null
  /** Incertidumbre que reporta el GPS, en metros. */
  accuracyM: number | null
  /** Velocidad en km/h. `null` mientras no haya con qué calcularla. */
  speedKmh: number | null
  /** Hacia dónde te movés según el GPS. Solo vale por encima de COURSE_MIN_KMH. */
  courseDegrees: number | null
}

type Fix = { point: Point; at: number; accuracyM: number }

/** El criterio de Android: gana la más precisa, y solo la vejez le gana a la precisión. */
function isBetter(next: Fix, current: Fix | null): boolean {
  if (!current) return true

  const age = next.at - current.at
  if (age > STALE_MS) return true
  if (age < -STALE_MS) return false

  const worse = next.accuracyM - current.accuracyM
  if (worse < 0) return true

  return age > 0 && worse < MUCH_WORSE_M && next.accuracyM <= current.accuracyM
}

/** Sigue al ciclista con el motor de MapLibre, que usa el proveedor del sistema y no Google. */
export function useCurrentLocation(): CurrentLocation {
  const [permission, setPermission] = useState<LocationPermission>('pending')
  const [point, setPoint] = useState<Point | null>(null)
  const [accuracyM, setAccuracyM] = useState<number | null>(null)
  const [speedKmh, setSpeedKmh] = useState<number | null>(null)
  const [courseDegrees, setCourseDegrees] = useState<number | null>(null)

  const last = useRef<Fix | null>(null)
  const shown = useRef<Point | null>(null)

  useEffect(() => {
    let cancelled = false

    const onUpdate = ({ coords, timestamp }: MapLibrePosition) => {
      const next: Fix = {
        point: { lat: coords.latitude, lng: coords.longitude },
        at: timestamp,
        accuracyM: coords.accuracy,
      }
      const previous = last.current
      if (!isBetter(next, previous)) return

      // Android manda 0 cuando el proveedor no sabe la velocidad, así que la calculamos
      const reported = coords.speed === null ? 0 : coords.speed * MS_TO_KMH
      const seconds = previous ? (next.at - previous.at) / 1000 : 0
      const meters = previous ? distanceMeters(previous.point, next.point) : 0

      last.current = next
      setAccuracyM(next.accuracyM)
      setCourseDegrees(coords.heading)
      if (reported > 0) setSpeedKmh(reported)
      else if (seconds > 0) setSpeedKmh((meters / seconds) * MS_TO_KMH)

      // Parado el GPS baila un par de metros; mover la cámara por eso marea
      const drift = shown.current ? distanceMeters(shown.current, next.point) : Number.MAX_VALUE
      if (drift < STILL_M) return

      shown.current = next.point
      setPoint(next.point)
    }

    async function watch() {
      const granted = await LocationManager.requestPermissions()
      if (cancelled) return

      setPermission(granted ? 'granted' : 'denied')
      if (!granted) return

      LocationManager.setMinDisplacement(MIN_DISPLACEMENT_M)
      LocationManager.addListener(onUpdate)
      LocationManager.start()
    }

    watch()

    return () => {
      cancelled = true
      LocationManager.removeListener(onUpdate)
      LocationManager.stop()
    }
  }, [])

  return { permission, point, accuracyM, speedKmh, courseDegrees }
}
