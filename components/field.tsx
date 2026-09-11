import { Text, View } from 'react-native'
import { BRAND, FONT, INK, INK_MUTED, LABEL } from '../lib/theme.ts'

/** Lo que se muestra cuando todavía no hay lectura. */
export const EMPTY = '—'

type FieldProps = {
  label: string
  value: string
  unit?: string
  size?: 'normal' | 'hero'
  /** Un punto junto a la etiqueta: verde mientras corre, gris en pausa. */
  status?: 'live' | 'paused'
}

/** Una etiqueta en versalitas encima de su cifra. La única unidad del HUD. */
export function Field({ label, value, unit, size = 'normal', status }: FieldProps) {
  const hero = size === 'hero'
  // El guion de «sin dato» en gris: en blanco y a 46 px parece una raya suelta
  const isEmpty = value === EMPTY

  return (
    <View style={{ gap: hero ? 2 : 5 }}>
      <View className="flex-row items-center gap-1.5">
        {status ? (
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: status === 'live' ? BRAND : INK_MUTED,
            }}
          />
        ) : null}
        <Text style={LABEL}>{label}</Text>
      </View>
      <View className="flex-row items-baseline" style={{ gap: hero ? 6 : 4 }}>
        <Text
          style={{
            fontFamily: hero ? FONT.light : FONT.regular,
            fontSize: hero ? 46 : 19,
            lineHeight: hero ? 50 : 23,
            letterSpacing: hero ? -1.8 : -0.4,
            color: isEmpty ? INK_MUTED : INK,
            fontVariant: ['tabular-nums'],
          }}
        >
          {value}
        </Text>
        {unit ? <Text style={{ ...LABEL, fontSize: hero ? 11 : 10 }}>{unit}</Text> : null}
      </View>
    </View>
  )
}
