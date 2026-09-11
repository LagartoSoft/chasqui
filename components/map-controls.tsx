import Feather from '@expo/vector-icons/Feather'
import { Pressable, View } from 'react-native'
import type { CameraMode } from '../lib/camera.ts'
import { BORDER, INK, INK_MUTED, RADIUS, SURFACE } from '../lib/theme.ts'

const SIZE = 46

const label: Record<CameraMode, string> = {
  free: 'Seguir tu posición y girar el mapa',
  'follow-heading': 'Dejar de seguir tu posición',
}

type ControlProps = {
  icon: keyof typeof Feather.glyphMap
  accessibilityLabel: string
  active?: boolean
  onPress: () => void
}

function Control({ icon, accessibilityLabel, active = false, onPress }: ControlProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress}>
      {({ pressed }) => (
        <View
          className="items-center justify-center"
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: RADIUS,
            backgroundColor: SURFACE,
            borderWidth: 1,
            borderColor: BORDER,
            opacity: pressed ? 0.7 : 1,
          }}
        >
          <Feather name={icon} size={19} color={active ? INK : INK_MUTED} />
        </View>
      )}
    </Pressable>
  )
}

type MapControlsProps = {
  mode: CameraMode
  onToggleMode: () => void
  isLegendOpen: boolean
  onToggleLegend: () => void
}

/** Los mandos del mapa, apilados donde llega el pulgar. */
export function MapControls({
  mode,
  onToggleMode,
  isLegendOpen,
  onToggleLegend,
}: MapControlsProps) {
  return (
    <View className="gap-2">
      <Control
        icon="info"
        accessibilityLabel={isLegendOpen ? 'Ocultar la leyenda' : 'Ver qué significa cada color'}
        active={isLegendOpen}
        onPress={onToggleLegend}
      />
      <Control
        icon={mode === 'follow-heading' ? 'navigation' : 'crosshair'}
        accessibilityLabel={label[mode]}
        active={mode === 'follow-heading'}
        onPress={onToggleMode}
      />
    </View>
  )
}
