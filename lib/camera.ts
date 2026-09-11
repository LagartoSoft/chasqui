import type { CameraRef, ViewStateChangeEvent } from '@maplibre/maplibre-react-native'
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { angleDeltaDegrees, type Point } from './geo.ts'

/** Zoom al que se sigue al ciclista: entra la cuadra y la esquina siguiente. */
const FOLLOW_ZOOM = 16

/** Duración de cada tramo de la animación de cámara, en milisegundos. */
const EASE_MS = 300

/** Grados de giro que mueven el mapa: la brújula entrega un valor cada 50 ms. */
const MIN_BEARING_DELTA_DEG = 3

/** Recorte superior en dp: baja al ciclista en pantalla para ver más calle por delante. */
const LOOK_AHEAD_DP = 100

/** `free` no sigue al ciclista; `follow-heading` lo centra y gira el mapa hacia donde mira. */
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
  /** Alto del dock en dp: la cámara centra al ciclista en el mapa que queda visible. */
  bottomInsetDp: number
}

/** Mantiene la cámara sobre el ciclista. Arranca siguiendo: el primer fix ya centra. */
export function useFollowCamera({
  cameraRef,
  point,
  headingDegrees,
  bottomInsetDp,
}: FollowCameraOptions): FollowCamera {
  const [mode, setMode] = useState<CameraMode>('follow-heading')
  const applied = useRef<{ point: Point; bearing: number; inset: number } | null>(null)

  const changeMode = useCallback((next: CameraMode) => {
    // Olvidarlo obliga a recolocar la cámara al volver, aunque el ciclista no se haya movido
    applied.current = null
    setMode(next)
  }, [])

  const toggleMode = useCallback(
    () => changeMode(mode === 'free' ? 'follow-heading' : 'free'),
    [changeMode, mode],
  )

  const releaseOnGesture = useCallback(
    (event: ViewStateChangeEvent) => {
      // En Android userInteraction también es true en nuestras animaciones; animated las separa
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

    if (last && last.point === point && last.inset === bottomInsetDp && !turned) return

    applied.current = { point, bearing, inset: bottomInsetDp }
    cameraRef.current?.easeTo({
      center: [point.lng, point.lat],
      zoom: FOLLOW_ZOOM,
      bearing,
      duration: EASE_MS,
      padding: { top: LOOK_AHEAD_DP, bottom: bottomInsetDp },
    })
  }, [bottomInsetDp, cameraRef, headingDegrees, mode, point])

  return { mode, toggleMode, releaseOnGesture }
}
