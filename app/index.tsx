import {
  Camera,
  type CameraRef,
  GeoJSONSource,
  Layer,
  Map as MapView,
  type ViewStateChangeEvent,
} from '@maplibre/maplibre-react-native'
import { useKeepAwake } from 'expo-keep-awake'
import { useRef, useState } from 'react'
import { type NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import cycleways from '../assets/cycleways.json'
import { Legend } from '../components/legend.tsx'
import { MapControls } from '../components/map-controls.tsx'
import { RiderPuck } from '../components/rider-puck.tsx'
import { TripDock } from '../components/trip-dock.tsx'
import { TripSummary } from '../components/trip-summary.tsx'
import { useFollowCamera } from '../lib/camera.ts'
import { useHeading } from '../lib/heading.ts'
import { useCurrentLocation } from '../lib/location.ts'
import {
  CASING_COLOR,
  CASING_WIDTH,
  CYCLEWAYS_SOURCE,
  IS_LANE,
  IS_SHARED,
  IS_TRACK,
  LANE_COLOR,
  LANE_DASH,
  LIMA_CENTER,
  MAP_STYLE_URL,
  SHARED_COLOR,
  SHARED_DASH,
  THIN_WIDTH,
  TRACK_COLOR,
  TRACK_WIDTH,
} from '../lib/map.ts'
import { useSmoothedSpeed } from '../lib/speed.ts'
import { BORDER, FONT, INK, INK_SECONDARY, RADIUS, SURFACE } from '../lib/theme.ts'
import { useTrip } from '../lib/trip.ts'

const INITIAL_ZOOM = 14

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
  // El teléfono va en el portacelular: si la pantalla se apaga sola, el
  // ciclista se queda sin mapa a mitad de una avenida
  useKeepAwake()

  const [isLegendOpen, setIsLegendOpen] = useState(false)

  const { permission, point, accuracyM, speedKmh } = useCurrentLocation()
  const { degrees, hasCompass, needsCalibration } = useHeading(permission === 'granted')
  const smoothedSpeed = useSmoothedSpeed(speedKmh)
  const trip = useTrip({ point, accuracyM })

  const cameraRef = useRef<CameraRef>(null)
  const { mode, toggleMode, releaseOnGesture } = useFollowCamera({
    cameraRef,
    point,
    headingDegrees: degrees,
  })

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
        onRegionWillChange={onRegionWillChange}
      >
        <Camera ref={cameraRef} initialViewState={{ center: LIMA_CENTER, zoom: INITIAL_ZOOM }} />

        <GeoJSONSource id={CYCLEWAYS_SOURCE} data={cycleways as GeoJSON.FeatureCollection}>
          <Layer
            id="chasqui-shared"
            type="line"
            source={CYCLEWAYS_SOURCE}
            filter={IS_SHARED}
            layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
            paint={{
              'line-color': SHARED_COLOR,
              'line-width': THIN_WIDTH,
              'line-dasharray': SHARED_DASH,
            }}
          />

          <Layer
            id="chasqui-lane"
            type="line"
            source={CYCLEWAYS_SOURCE}
            filter={IS_LANE}
            layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
            paint={{
              'line-color': LANE_COLOR,
              'line-width': THIN_WIDTH,
              'line-dasharray': LANE_DASH,
            }}
          />

          <Layer
            id="chasqui-track-casing"
            type="line"
            source={CYCLEWAYS_SOURCE}
            filter={IS_TRACK}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': CASING_COLOR, 'line-width': CASING_WIDTH, 'line-opacity': 0.9 }}
          />

          <Layer
            id="chasqui-track"
            type="line"
            source={CYCLEWAYS_SOURCE}
            filter={IS_TRACK}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': TRACK_COLOR, 'line-width': TRACK_WIDTH }}
          />
        </GeoJSONSource>

        {point ? <RiderPuck point={point} headingDegrees={degrees} accuracyM={accuracyM} /> : null}
      </MapView>

      <SafeAreaView className="absolute inset-x-0 top-0" pointerEvents="none">
        <View
          className="m-4 self-start"
          style={{
            backgroundColor: SURFACE,
            borderRadius: RADIUS,
            borderWidth: 1,
            borderColor: BORDER,
            paddingHorizontal: 12,
            paddingVertical: 7,
          }}
        >
          <Text
            style={{
              fontFamily: FONT.semibold,
              fontSize: 12,
              letterSpacing: 3.2,
              color: INK,
            }}
          >
            CHASQUI
          </Text>
        </View>
      </SafeAreaView>

      <SafeAreaView className="absolute inset-x-0 bottom-0" pointerEvents="box-none">
        <View className="m-4 gap-3" pointerEvents="box-none">
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

          {notice ? (
            <View
              pointerEvents="none"
              style={{
                backgroundColor: SURFACE,
                borderRadius: RADIUS,
                borderWidth: 1,
                borderColor: BORDER,
                paddingHorizontal: 14,
                paddingVertical: 11,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT.regular,
                  fontSize: 12.5,
                  lineHeight: 17,
                  color: INK_SECONDARY,
                }}
              >
                {notice}
              </Text>
            </View>
          ) : null}

          <TripDock speedKmh={smoothedSpeed} trip={trip} />
        </View>
      </SafeAreaView>

      {trip.status === 'finished' ? (
        <View style={StyleSheet.absoluteFill}>
          <TripSummary trip={trip} />
        </View>
      ) : null}
    </View>
  )
}
