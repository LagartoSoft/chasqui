import { Text, View } from 'react-native'
import { FONT, INK, LABEL } from '../lib/theme.ts'

type FieldProps = {
  label: string
  value: string
  unit?: string
  size?: 'normal' | 'hero'
}

/** Una etiqueta en versalitas encima de su cifra. La única unidad del HUD. */
export function Field({ label, value, unit, size = 'normal' }: FieldProps) {
  const hero = size === 'hero'

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
            color: INK,
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
