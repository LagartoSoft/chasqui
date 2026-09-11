import type { CameraRef, ViewStateChangeEvent } from '@maplibre/maplibre-react-native'
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { angleDeltaDegrees, type Point } from './geo.ts'

/** Zoom al que se sigue al ciclista: entra la cuadra y la esquina siguiente. */
const FOLLOW_ZOOM = 16

/** Duración de cada tramo de la animación de cámara, en milisegundos. */
const EASE_MS = 300

/**
 * Grados que tiene que girar el rumbo para mover el mapa.
 *
 * @remarks El filtro de la brújula entrega un valor nuevo cada 50 ms. Sin
 * umbral el mapa recibiría veinte animaciones por segundo.
 */
const MIN_BEARING_DELTA_DEG = 3

/**
 * Qué hace la cámara con la posición del ciclista.
 *
 * - `free`: no lo sigue, y el mapa solo gira si lo giran con dos dedos
 * - `follow-heading`: lo centra y gira el mapa hacia donde mira
 */
export type CameraMode = 'free' | 'follow-heading'

type FollowCamera = {
  mode: CameraMode
  /** Alterna entre los dos modos. */
  toggleMode: () => void
  /** Suelta la cámara si el movimiento del mapa vino de un dedo y no de nosotros. */
  releaseOnGesture: (event: ViewStateChangeEvent) => void
}

type FollowCameraOptions = {
  cameraRef: RefObject<CameraRef | null>
  point: Point | null
  /** Rumbo ya suavizado de la brújula, en grados horarios desde el norte. */
  headingDegrees: number | null
}

/**
 * Mantiene la cámara sobre el ciclista mientras el modo lo pida.
 *
 * @remarks Arranca siguiendo, así el primer fix del GPS ya centra el mapa.
 */
export function useFollowCamera({
  cameraRef,
  point,
  headingDegrees,
}: FollowCameraOptions): FollowCamera {
  const [mode, setMode] = useState<CameraMode>('follow-heading')
  const applied = useRef<{ point: Point; bearing: number } | null>(null)

  const changeMode = useCallback((next: CameraMode) => {
    // WHY Olvidar lo aplicado obliga a recolocar la cámara al volver a seguir,
    //     aunque el ciclista no se haya movido mientras tanto
    applied.current = null
    setMode(next)
  }, [])

  const toggleMode = useCallback(
    () => changeMode(mode === 'free' ? 'follow-heading' : 'free'),
    [changeMode, mode],
  )

  const releaseOnGesture = useCallback(
    (event: ViewStateChangeEvent) => {
      // ! En Android userInteraction también es true en nuestras animaciones:
      // ! lo que las separa es animated (CameraChangeTracker.kt)
      if (!event.userInteraction || event.animated) return

      changeMode('free')
    },
    [changeMode],
  )

  useEffect(() => {
    if (mode === 'free' || !point) return

    const bearing = headingDegrees ?? 0
    const last = applied.current
    const turned =
      !last || Math.abs(angleDeltaDegrees(last.bearing, bearing)) >= MIN_BEARING_DELTA_DEG

    if (last && last.point === point && !turned) return

    applied.current = { point, bearing }
    cameraRef.current?.easeTo({
      center: [point.lng, point.lat],
      zoom: FOLLOW_ZOOM,
      bearing,
      duration: EASE_MS,
    })
  }, [cameraRef, headingDegrees, mode, point])

  return { mode, toggleMode, releaseOnGesture }
}
