import {
  LocationManager,
  type GeolocationPosition as MapLibrePosition,
} from '@maplibre/maplibre-react-native'
import { useEffect, useRef, useState } from 'react'
import { distanceMeters, type Point } from './geo.ts'

/** Metros a recorrer para que llegue una posición nueva. */
const MIN_DISPLACEMENT_M = 5

/** El motor pide posiciones a gps y a network a la vez; las de network no bajan de esto. */
const MAX_ACCURACY_M = 40

/** Ninguna bici va a esta velocidad: por encima, las dos lecturas son de proveedores distintos. */
const MAX_PLAUSIBLE_KMH = 120

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

type Fix = { point: Point; at: number }

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
      const next: Point = { lat: coords.latitude, lng: coords.longitude }
      const previous = last.current

      // Sin nada en pantalla vale cualquier lectura; después, solo las del gps
      if (previous && coords.accuracy > MAX_ACCURACY_M) return

      const seconds = previous ? Math.max((timestamp - previous.at) / 1000, 0.001) : 0
      const meters = previous ? distanceMeters(previous.point, next) : 0
      const impliedKmh = previous ? (meters / seconds) * MS_TO_KMH : 0

      // Un salto imposible no es movimiento: es que contestó el otro proveedor
      if (previous && impliedKmh > MAX_PLAUSIBLE_KMH) return

      last.current = { point: next, at: timestamp }
      setPoint(next)
      setAccuracyM(coords.accuracy)

      // Android manda 0 cuando el proveedor no sabe la velocidad, así que la calculamos
      const reported = coords.speed === null ? 0 : coords.speed * MS_TO_KMH
      setSpeedKmh(reported > 0 ? reported : previous ? impliedKmh : null)
      setCourseDegrees(coords.heading)
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
