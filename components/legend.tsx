import { Text, View } from 'react-native'
import { LANE_COLOR, LANE_DASH, SHARED_COLOR, SHARED_DASH, TRACK_COLOR } from '../lib/map.ts'
import { BORDER, FONT, INK_SECONDARY, RADIUS, SURFACE } from '../lib/theme.ts'

type Entry = {
  id: string
  color: string
  /** Pares de trazo y hueco, como los dibuja MapLibre. Vacío es línea continua. */
  dash: readonly [number, number] | null
  label: string
}

const ENTRIES: Entry[] = [
  { id: 'track', color: TRACK_COLOR, dash: null, label: 'Vía propia, separada del tráfico' },
  { id: 'lane', color: LANE_COLOR, dash: LANE_DASH, label: 'Carril pintado sobre la calzada' },
  { id: 'shared', color: SHARED_COLOR, dash: SHARED_DASH, label: 'Compartida con autos' },
]

/** Repite el patrón de guiones hasta llenar la muestra. */
function segmentsFor({ id, dash }: Entry) {
  if (!dash) return [{ key: `${id}-solid`, flex: 1, ink: true }]

  const [stroke, gap] = dash
  return Array.from({ length: 6 }, (_, i) => ({
    key: `${id}-${i}`,
    flex: i % 2 === 0 ? stroke : gap,
    ink: i % 2 === 0,
  }))
}

/** Lo único con color en toda la interfaz: la red, que es el dato. */
export function Legend() {
  return (
    <View
      style={{
        backgroundColor: SURFACE,
        borderRadius: RADIUS,
        borderWidth: 1,
        borderColor: BORDER,
        paddingHorizontal: 14,
        paddingVertical: 13,
        gap: 11,
      }}
    >
      {ENTRIES.map((entry) => (
        <View key={entry.id} className="flex-row items-center gap-3">
          <View className="flex-row" style={{ width: 24 }}>
            {segmentsFor(entry).map(({ key, flex, ink }) => (
              <View
                key={key}
                style={{ height: 2, flex, backgroundColor: ink ? entry.color : 'transparent' }}
              />
            ))}
          </View>
          <Text
            className="flex-1"
            style={{ fontFamily: FONT.regular, fontSize: 12.5, color: INK_SECONDARY }}
          >
            {entry.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
