import { useCallback, useEffect, useRef, useState } from 'react'
import { distanceMeters, type Point } from './geo.ts'

/** Peor precisión que esta se descarta: el primer fix suele ser el de tu casa. */
const MAX_ACCURACY_M = 20

/** Tramo mínimo que cuenta, en metros: parado el GPS baila y regalaría distancia. */
const MIN_STEP_M = 5

/** Tramo máximo creíble, en metros: un fix malo teletransporta cientos de golpe. */
const MAX_STEP_M = 200

/** Cada cuánto se refresca el reloj en pantalla, en milisegundos. */
const TICK_MS = 1000

const MS_PER_HOUR = 3_600_000
const M_PER_KM = 1000

export type TripStatus = 'idle' | 'recording' | 'paused' | 'finished'

export type Trip = {
  status: TripStatus
  distanceM: number
  /** Tiempo con el recorrido corriendo. Lo pausado no cuenta. */
  elapsedMs: number
  /** Distancia sobre tiempo, en km/h. `null` hasta que haya algo que promediar. */
  averageKmh: number | null
  start: () => void
  pause: () => void
  resume: () => void
  finish: () => void
  clear: () => void
}

type TripInput = {
  point: Point | null
  accuracyM: number | null
}

/** Mide un recorrido solo con la app delante, y no guarda nada al terminar. */
export function useTrip({ point, accuracyM }: TripInput): Trip {
  const [status, setStatus] = useState<TripStatus>('idle')
  const [distanceM, setDistanceM] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  const lastPoint = useRef<Point | null>(null)
  const banked = useRef(0)
  const startedAt = useRef<number | null>(null)

  const readClock = useCallback(
    () => banked.current + (startedAt.current === null ? 0 : Date.now() - startedAt.current),
    [],
  )

  useEffect(() => {
    if (status !== 'recording') return

    const tick = setInterval(() => setElapsedMs(readClock()), TICK_MS)
    return () => clearInterval(tick)
  }, [readClock, status])

  useEffect(() => {
    if (status !== 'recording' || !point) return
    if (accuracyM === null || accuracyM > MAX_ACCURACY_M) return

    const previous = lastPoint.current
    lastPoint.current = point

    // La primera posición buena solo fija el origen: medir contra la anterior sumaría de más
    if (!previous) return

    const step = distanceMeters(previous, point)
    if (step < MIN_STEP_M || step > MAX_STEP_M) return

    setDistanceM((total) => total + step)
  }, [accuracyM, point, status])

  const start = useCallback(() => {
    lastPoint.current = null
    banked.current = 0
    startedAt.current = Date.now()
    setDistanceM(0)
    setElapsedMs(0)
    setStatus('recording')
  }, [])

  const pause = useCallback(() => {
    banked.current = readClock()
    startedAt.current = null
    // Olvidar el origen evita que la pausa entera cuente como un tramo
    lastPoint.current = null
    setElapsedMs(banked.current)
    setStatus('paused')
  }, [readClock])

  const resume = useCallback(() => {
    startedAt.current = Date.now()
    setStatus('recording')
  }, [])

  const finish = useCallback(() => {
    banked.current = readClock()
    startedAt.current = null
    lastPoint.current = null
    setElapsedMs(banked.current)
    setStatus('finished')
  }, [readClock])

  const clear = useCallback(() => {
    banked.current = 0
    startedAt.current = null
    lastPoint.current = null
    setDistanceM(0)
    setElapsedMs(0)
    setStatus('idle')
  }, [])

  const hours = elapsedMs / MS_PER_HOUR

  return {
    status,
    distanceM,
    elapsedMs,
    averageKmh: hours > 0 ? distanceM / M_PER_KM / hours : null,
    start,
    pause,
    resume,
    finish,
    clear,
  }
}

/** `4.21` — kilómetros con dos decimales, que es lo que se lee de un vistazo. */
export const formatKm = (meters: number): string => (meters / M_PER_KM).toFixed(2)

/** `12:04`, y `1:02:30` en cuanto pasa de la hora. */
export function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000)
  const seconds = String(total % 60).padStart(2, '0')
  const minutes = Math.floor(total / 60) % 60
  const hours = Math.floor(total / 3600)

  if (hours === 0) return `${minutes}:${seconds}`
  return `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`
}
