import Feather from '@expo/vector-icons/Feather'
import { Pressable, Text, View } from 'react-native'
import { FONT, INK, INK_MUTED, RADIUS, RADIUS_TIGHT, SURFACE } from '../lib/theme.ts'
import { formatDuration, formatKm, type Trip } from '../lib/trip.ts'
import { Field } from './field.tsx'

const BORDER_COLOR = '#2B2B2B'

type ActionProps = {
  icon: keyof typeof Feather.glyphMap
  label: string
  emphasis?: boolean
  onPress: () => void
}

function Action({ icon, label, emphasis = false, onPress }: ActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{ flex: 1 }}
    >
      {({ pressed }) => (
        <View
          className="flex-row items-center justify-center gap-2"
          style={{
            height: 44,
            borderRadius: RADIUS_TIGHT,
            backgroundColor: emphasis ? INK : 'transparent',
            borderWidth: 1,
            borderColor: emphasis ? INK : BORDER_COLOR,
            opacity: pressed ? 0.72 : 1,
          }}
        >
          <Feather name={icon} size={15} color={emphasis ? '#141414' : INK} />
          <Text
            style={{
              fontFamily: FONT.medium,
              fontSize: 11,
              letterSpacing: 1.3,
              color: emphasis ? '#141414' : INK,
            }}
          >
            {label.toUpperCase()}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

type TripDockProps = {
  speedKmh: number | null
  trip: Trip
}

/** Lo único que se mira pedaleando: a cuánto vas, y el recorrido si lo estás midiendo. */
export function TripDock({ speedKmh, trip }: TripDockProps) {
  const isLive = trip.status === 'recording' || trip.status === 'paused'

  return (
    <View
      style={{
        backgroundColor: SURFACE,
        borderRadius: RADIUS,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        overflow: 'hidden',
      }}
    >
      <View className="flex-row items-end justify-between px-4 pt-3.5 pb-4">
        <Field
          label="Velocidad"
          value={speedKmh === null ? '—' : String(Math.round(speedKmh))}
          unit="KM/H"
          size="hero"
        />

        {isLive ? (
          <View className="flex-row gap-6 pb-1">
            <Field label="Tiempo" value={formatDuration(trip.elapsedMs)} />
            <Field label="Distancia" value={formatKm(trip.distanceM)} unit="KM" />
            <Field
              label="Media"
              value={trip.averageKmh === null ? '—' : trip.averageKmh.toFixed(1)}
            />
          </View>
        ) : null}
      </View>

      <View style={{ height: 1, backgroundColor: BORDER_COLOR }} />

      <View className="flex-row gap-2 p-2.5">
        {trip.status === 'idle' ? (
          <Action icon="play" label="Empezar" emphasis onPress={trip.start} />
        ) : null}

        {trip.status === 'recording' ? (
          <>
            <Action icon="pause" label="Pausar" onPress={trip.pause} />
            <Action icon="square" label="Terminar" emphasis onPress={trip.finish} />
          </>
        ) : null}

        {trip.status === 'paused' ? (
          <>
            <Action icon="play" label="Seguir" onPress={trip.resume} />
            <Action icon="square" label="Terminar" emphasis onPress={trip.finish} />
          </>
        ) : null}
      </View>

      {trip.status === 'paused' ? (
        <View className="px-4 pb-3">
          <Text style={{ fontFamily: FONT.regular, fontSize: 12, color: INK_MUTED }}>
            En pausa. El reloj está detenido.
          </Text>
        </View>
      ) : null}
    </View>
  )
}
