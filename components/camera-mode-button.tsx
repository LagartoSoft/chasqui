import { Pressable, View, type ViewStyle } from 'react-native'
import type { CameraMode } from '../lib/camera.ts'
import { RIDER_COLOR } from '../lib/map.ts'

const IDLE_COLOR = '#D4D4D4'

/** Triángulo a base de bordes: React Native no dibuja polígonos. */
const CONE: ViewStyle = {
  width: 0,
  height: 0,
  borderLeftWidth: 7,
  borderRightWidth: 7,
  borderBottomWidth: 13,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
}

/** Cada etiqueta dice qué hará el toque, no en qué modo estás. */
const NEXT_ACTION_LABEL: Record<CameraMode, string> = {
  free: 'Seguir tu posición y girar el mapa',
  'follow-heading': 'Dejar de seguir tu posición',
}

type CameraModeButtonProps = {
  mode: CameraMode
  onPress: () => void
}

/** Alterna entre mapa libre y mapa que te sigue girando. */
export function CameraModeButton({ mode, onPress }: CameraModeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={NEXT_ACTION_LABEL[mode]}
      onPress={onPress}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-neutral-950/90">
        {mode === 'follow-heading' ? (
          <View style={{ ...CONE, borderBottomColor: RIDER_COLOR }} />
        ) : (
          <View
            className="h-[18px] w-[18px] rounded-full border-2"
            style={{ borderColor: IDLE_COLOR }}
          />
        )}
      </View>
    </Pressable>
  )
}
