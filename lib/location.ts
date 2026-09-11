import {
  LocationManager,
  type GeolocationPosition as MapLibrePosition,
} from '@maplibre/maplibre-react-native'
import { useEffect, useState } from 'react'
import type { Point } from './geo.ts'

/** Metros a recorrer para que llegue una posición nueva. */
const MIN_DISPLACEMENT_M = 5

/** Segundos por hora, sobre metros por kilómetro: de m/s a km/h. */
const MS_TO_KMH = 3.6

export type LocationPermission = 'pending' | 'granted' | 'denied'

export type CurrentLocation = {
  permission: LocationPermission
  point: Point | null
  /** Incertidumbre que reporta el GPS, en metros. */
  accuracyM: number | null
  /** Velocidad instantánea en km/h. `null` si el proveedor no la sabe. */
  speedKmh: number | null
}

/** Sigue al ciclista con el motor de MapLibre, que usa el proveedor del sistema y no Google. */
export function useCurrentLocation(): CurrentLocation {
  const [permission, setPermission] = useState<LocationPermission>('pending')
  const [point, setPoint] = useState<Point | null>(null)
  const [accuracyM, setAccuracyM] = useState<number | null>(null)
  const [speedKmh, setSpeedKmh] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const onUpdate = ({ coords }: MapLibrePosition) => {
      setPoint({ lat: coords.latitude, lng: coords.longitude })
      setAccuracyM(coords.accuracy)
      // Android manda 0 cuando no sabe la velocidad: parado y «sin dato» llegan iguales
      setSpeedKmh(coords.speed === null ? null : coords.speed * MS_TO_KMH)
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

  return { permission, point, accuracyM, speedKmh }
}
