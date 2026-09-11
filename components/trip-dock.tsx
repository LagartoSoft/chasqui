import Feather from '@expo/vector-icons/Feather'
import { Pressable, Text, View } from 'react-native'
import { BORDER, BRAND, FONT, INK, ON_SOLID, RADIUS_TIGHT } from '../lib/theme.ts'
import { formatDuration, formatKm, type Trip } from '../lib/trip.ts'
import { EMPTY, Field } from './field.tsx'
import { Panel } from './panel.tsx'

const AN_HOUR_MS = 3_600_000

type ActionProps = {
  icon: keyof typeof Feather.glyphMap
  label: string
  /** `brand` es empezar, `ink` es terminar, `quiet` es todo lo demás. */
  tone?: 'brand' | 'ink' | 'quiet'
  onPress: () => void
}

function Action({ icon, label, tone = 'quiet', onPress }: ActionProps) {
  const fill = tone === 'brand' ? BRAND : tone === 'ink' ? INK : 'transparent'
  const text = tone === 'quiet' ? INK : ON_SOLID

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
            height: 48,
            borderRadius: RADIUS_TIGHT,
            backgroundColor: fill,
            borderWidth: 1,
            borderColor: tone === 'quiet' ? BORDER : fill,
            opacity: pressed ? 0.72 : 1,
          }}
        >
          <Feather name={icon} size={15} color={text} />
          <Text
            style={{
              fontFamily: FONT.medium,
              fontSize: 11,
              letterSpacing: 1.3,
              color: text,
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
    <Panel style={{ overflow: 'hidden' }}>
      <View className="flex-row items-end justify-between px-4 pt-3.5 pb-4">
        <Field
          label="Velocidad"
          value={speedKmh === null ? EMPTY : String(Math.round(speedKmh))}
          unit="KM/H"
          size="hero"
        />

        {isLive ? (
          <View className="flex-row gap-4 pb-1">
            <Field
              label="Tiempo"
              value={formatDuration(trip.elapsedMs)}
              unit={trip.elapsedMs >= AN_HOUR_MS ? 'H' : 'MIN'}
              status={trip.status === 'recording' ? 'live' : 'paused'}
            />
            <Field label="Distancia" value={formatKm(trip.distanceM)} unit="KM" />
          </View>
        ) : null}
      </View>

      <View style={{ height: 1, backgroundColor: BORDER }} />

      <View className="flex-row gap-2 p-2.5">
        {trip.status === 'idle' ? (
          <Action icon="play" label="Empezar" tone="brand" onPress={trip.start} />
        ) : null}

        {trip.status === 'recording' ? (
          <>
            <Action icon="pause" label="Pausar" onPress={trip.pause} />
            <Action icon="square" label="Terminar" tone="ink" onPress={trip.finish} />
          </>
        ) : null}

        {trip.status === 'paused' ? (
          <>
            <Action icon="play" label="Seguir" tone="brand" onPress={trip.resume} />
            <Action icon="square" label="Terminar" tone="ink" onPress={trip.finish} />
          </>
        ) : null}
      </View>
    </Panel>
  )
}
