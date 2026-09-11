import Feather from '@expo/vector-icons/Feather'
import { Pressable, View } from 'react-native'
import type { CameraMode } from '../lib/camera.ts'
import { BRAND, INK_MUTED } from '../lib/theme.ts'
import { Panel } from './panel.tsx'

/** El mínimo que pide Android, y acá se toca con guantes. */
const SIZE = 48

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
        <Panel
          style={{
            width: SIZE,
            height: SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          }}
        >
          <Feather name={icon} size={19} color={active ? BRAND : INK_MUTED} />
        </Panel>
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
