import { Text, View } from 'react-native'

type SpeedometerProps = {
  /** Velocidad ya suavizada en km/h. `null` cuando todavía no hay dato. */
  speedKmh: number | null
}

/** El número grande: a cuánto vas. */
export function Speedometer({ speedKmh }: SpeedometerProps) {
  return (
    <View className="flex-row items-baseline gap-1.5 rounded-2xl bg-neutral-950/90 px-4 py-2.5">
      <Text className="text-3xl font-semibold tabular-nums text-neutral-50">
        {speedKmh === null ? '—' : Math.round(speedKmh)}
      </Text>
      <Text className="text-[11px] tracking-widest text-neutral-400">KM/H</Text>
    </View>
  )
}
