import Feather from '@expo/vector-icons/Feather'
import { Pressable, Text, View } from 'react-native'
import {
  BORDER,
  FONT,
  INK,
  INK_MUTED,
  INK_SECONDARY,
  LABEL,
  RADIUS,
  RADIUS_TIGHT,
  SURFACE_RAISED,
} from '../lib/theme.ts'
import { formatDuration, formatKm, type Trip } from '../lib/trip.ts'

const AN_HOUR_MS = 3_600_000

type Row = { label: string; value: string; unit: string }

/** La unidad ocupa un ancho fijo, así las tres cifras terminan en la misma columna. */
const UNIT_WIDTH = 46

function Line({ label, value, unit }: Row) {
  return (
    <View
      className="flex-row items-baseline justify-between"
      style={{ borderTopWidth: 1, borderTopColor: BORDER, paddingVertical: 14 }}
    >
      <Text style={LABEL}>{label}</Text>
      <View className="flex-row items-baseline gap-2">
        <Text
          style={{
            fontFamily: FONT.light,
            fontSize: 30,
            letterSpacing: -1,
            color: INK,
            fontVariant: ['tabular-nums'],
            textAlign: 'right',
          }}
        >
          {value}
        </Text>
        <Text style={{ ...LABEL, width: UNIT_WIDTH }}>{unit}</Text>
      </View>
    </View>
  )
}

/** Lo que ves al terminar: tres cifras y nada más. No se guarda. */
export function TripSummary({ trip }: { trip: Trip }) {
  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: '#0A0A0Ae6' }}
    >
      <View
        className="w-full"
        style={{
          maxWidth: 380,
          backgroundColor: SURFACE_RAISED,
          borderRadius: RADIUS,
          borderWidth: 1,
          borderColor: BORDER,
          padding: 22,
        }}
      >
        <Text
          style={{
            fontFamily: FONT.semibold,
            fontSize: 17,
            letterSpacing: -0.4,
            color: INK,
            marginBottom: 4,
          }}
        >
          Recorrido terminado
        </Text>
        <Text
          style={{ fontFamily: FONT.regular, fontSize: 13, color: INK_SECONDARY, marginBottom: 18 }}
        >
          Estos números no se guardan en ningún lado.
        </Text>

        <Line label="Distancia" value={formatKm(trip.distanceM)} unit="KM" />
        <Line
          label="Tiempo"
          value={formatDuration(trip.elapsedMs)}
          unit={trip.elapsedMs >= AN_HOUR_MS ? 'H' : 'MIN'}
        />
        <Line
          label="Media"
          value={trip.averageKmh === null ? '—' : trip.averageKmh.toFixed(1)}
          unit="KM/H"
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar el resumen"
          onPress={trip.clear}
          style={{ marginTop: 22 }}
        >
          {({ pressed }) => (
            <View
              className="flex-row items-center justify-center gap-2"
              style={{
                height: 46,
                borderRadius: RADIUS_TIGHT,
                backgroundColor: INK,
                opacity: pressed ? 0.75 : 1,
              }}
            >
              <Feather name="check" size={15} color="#141414" />
              <Text
                style={{
                  fontFamily: FONT.medium,
                  fontSize: 11,
                  letterSpacing: 1.3,
                  color: '#141414',
                }}
              >
                LISTO
              </Text>
            </View>
          )}
        </Pressable>

        <Text
          style={{
            fontFamily: FONT.regular,
            fontSize: 11,
            lineHeight: 15,
            color: INK_MUTED,
            marginTop: 14,
            textAlign: 'center',
          }}
        >
          Se mide solo con la app abierta. Si bloqueaste la pantalla, falta ese tramo.
        </Text>
      </View>
    </View>
  )
}
