import {
  LocationManager,
  type GeolocationPosition as MapLibrePosition,
} from '@maplibre/maplibre-react-native'
import { useEffect, useRef, useState } from 'react'
import { distanceMeters, type Point } from './geo.ts'

/** Metros a recorrer para que llegue una posición nueva. */
const MIN_DISPLACEMENT_M = 5

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

      last.current = next
      setPoint(next.point)
      setAccuracyM(next.accuracyM)
      setCourseDegrees(coords.heading)

      // Android manda 0 cuando el proveedor no sabe la velocidad, así que la calculamos
      const reported = coords.speed === null ? 0 : coords.speed * MS_TO_KMH
      if (reported > 0) {
        setSpeedKmh(reported)
        return
      }

      const seconds = previous ? (next.at - previous.at) / 1000 : 0
      const meters = previous ? distanceMeters(previous.point, next.point) : 0
      setSpeedKmh(seconds > 0 ? (meters / seconds) * MS_TO_KMH : null)
    }

    async function watch() {
      const granted = await LocationManager.requestPermissions()
      if (cancelled) return

      setPermission(granted ? 'granted' : 'denied')
      if (!granted) return

      LocationManager.setMinDisplacement(MIN_DISPLACEMENT_M)
      LocationManager.addListener(onUpdate)
      LocationManager.start()

      // Con el filtro de cinco metros nada llega hasta que te movés: esto ubica ya
      const known = await LocationManager.getCurrentPosition()
      if (!cancelled && known) onUpdate(known)
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
