import {
  Camera,
  type CameraRef,
  Map as MapView,
  type ViewStateChangeEvent,
} from '@maplibre/maplibre-react-native'
import { useKeepAwake } from 'expo-keep-awake'
import { useRef, useState } from 'react'
import { type LayoutChangeEvent, type NativeSyntheticEvent, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CyclewayNetwork } from '../components/cycleway-network.tsx'
import { Legend } from '../components/legend.tsx'
import { MapControls } from '../components/map-controls.tsx'
import { Notice } from '../components/notice.tsx'
import { RiderPuck } from '../components/rider-puck.tsx'
import { TripDock } from '../components/trip-dock.tsx'
import { TripSummary } from '../components/trip-summary.tsx'
import { Wordmark } from '../components/wordmark.tsx'
import { useFollowCamera } from '../lib/camera.ts'
import { useHeading } from '../lib/heading.ts'
import { useCurrentLocation } from '../lib/location.ts'
import { LIMA_CENTER, MAP_STYLE_URL } from '../lib/map.ts'
import { useSmoothedSpeed } from '../lib/speed.ts'
import { useTrip } from '../lib/trip.ts'

const INITIAL_ZOOM = 14

/** Margen del bloque inferior, en dp. Entra en el cálculo de lo que tapa el dock. */
const EDGE = 16

type NoticeState = {
  isLocationDenied: boolean
  hasCompass: boolean
  needsCalibration: boolean
}

function noticeFor({ isLocationDenied, hasCompass, needsCalibration }: NoticeState) {
  if (isLocationDenied) return 'Sin permiso de ubicación no se puede mostrar dónde estás.'
  if (!hasCompass) return 'Este teléfono no tiene brújula: no puede mostrar hacia dónde mirás.'
  if (needsCalibration) return 'Brújula perdida. Mové el teléfono dibujando un ocho en el aire.'
  return null
}

export default function MapScreen() {
  // El teléfono va en el portacelular: si la pantalla se apaga, te quedás sin mapa
  useKeepAwake()

  const [isLegendOpen, setIsLegendOpen] = useState(false)
  const [dockHeight, setDockHeight] = useState(0)
  const insets = useSafeAreaInsets()

  const { permission, point, accuracyM, speedKmh, courseDegrees } = useCurrentLocation()
  const { degrees, hasCompass, needsCalibration } = useHeading({
    enabled: permission === 'granted',
    courseDegrees,
    speedKmh,
  })
  const smoothedSpeed = useSmoothedSpeed(speedKmh)
  const trip = useTrip({ point, accuracyM })

  const cameraRef = useRef<CameraRef>(null)
  const { mode, toggleMode, releaseOnGesture } = useFollowCamera({
    cameraRef,
    point,
    headingDegrees: degrees,
    bottomInsetDp: dockHeight + EDGE + insets.bottom,
  })

  const onDockLayout = (event: LayoutChangeEvent) => setDockHeight(event.nativeEvent.layout.height)

  const onRegionWillChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    releaseOnGesture(event.nativeEvent)
  }

  const notice = noticeFor({
    isLocationDenied: permission === 'denied',
    hasCompass,
    needsCalibration,
  })

  return (
    <View className="flex-1">
      <MapView
        style={StyleSheet.absoluteFill}
        mapStyle={MAP_STYLE_URL}
        attribution
        logo={false}
        compass={false}
        onRegionWillChange={onRegionWillChange}
      >
        <Camera ref={cameraRef} initialViewState={{ center: LIMA_CENTER, zoom: INITIAL_ZOOM }} />

        <CyclewayNetwork />

        {point ? <RiderPuck point={point} headingDegrees={degrees} accuracyM={accuracyM} /> : null}
      </MapView>

      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: insets.top + EDGE, left: EDGE, right: EDGE }}
      >
        <Wordmark />
      </View>

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          bottom: insets.bottom + EDGE,
          left: EDGE,
          right: EDGE,
          gap: 12,
        }}
      >
        <View className="flex-row items-end justify-between gap-3" pointerEvents="box-none">
          {isLegendOpen ? (
            <View className="flex-1" style={{ maxWidth: 300 }}>
              <Legend />
            </View>
          ) : (
            <View />
          )}

          <MapControls
            mode={mode}
            onToggleMode={toggleMode}
            isLegendOpen={isLegendOpen}
            onToggleLegend={() => setIsLegendOpen((open) => !open)}
          />
        </View>

        <View className="gap-3" onLayout={onDockLayout} pointerEvents="box-none">
          {notice ? <Notice>{notice}</Notice> : null}

          <TripDock speedKmh={smoothedSpeed} trip={trip} />
        </View>
      </View>

      {trip.status === 'finished' ? (
        <View style={StyleSheet.absoluteFill}>
          <TripSummary trip={trip} />
        </View>
      ) : null}
    </View>
  )
}
