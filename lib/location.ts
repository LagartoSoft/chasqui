import {
  LocationManager,
  type GeolocationPosition as MapLibrePosition,
} from '@maplibre/maplibre-react-native'
import { useEffect, useState } from 'react'
import type { Point } from './geo.ts'

/** Metros a recorrer para que llegue una posición nueva. */
const MIN_DISPLACEMENT_M = 5

export type LocationPermission = 'pending' | 'granted' | 'denied'

export type CurrentLocation = {
  permission: LocationPermission
  point: Point | null
  /** Incertidumbre que reporta el GPS, en metros. */
  accuracyM: number | null
}

/**
 * Sigue la posición del ciclista con el motor de ubicación de MapLibre.
 *
 * @remarks No usa `expo-location`: ese le habla solo al proveedor fusionado de
 * Google y calla en un teléfono sin Play Services. Este usa el del sistema.
 */
export function useCurrentLocation(): CurrentLocation {
  const [permission, setPermission] = useState<LocationPermission>('pending')
  const [point, setPoint] = useState<Point | null>(null)
  const [accuracyM, setAccuracyM] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const onUpdate = ({ coords }: MapLibrePosition) => {
      setPoint({ lat: coords.latitude, lng: coords.longitude })
      setAccuracyM(coords.accuracy)
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

  return { permission, point, accuracyM }
}
