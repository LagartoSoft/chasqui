import { Text, View } from 'react-native'
import { FONT, INK, INK_MUTED, LABEL } from '../lib/theme.ts'

/** Lo que se muestra cuando todavía no hay lectura. */
export const EMPTY = '—'

type FieldProps = {
  label: string
  value: string
  unit?: string
  size?: 'normal' | 'hero'
}

/** Una etiqueta en versalitas encima de su cifra. La única unidad del HUD. */
export function Field({ label, value, unit, size = 'normal' }: FieldProps) {
  const hero = size === 'hero'
  // El guion de «sin dato» en gris: en blanco y a 46 px parece una raya suelta
  const isEmpty = value === EMPTY

  return (
    <View style={{ gap: hero ? 2 : 5 }}>
      <Text style={LABEL}>{label}</Text>
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
