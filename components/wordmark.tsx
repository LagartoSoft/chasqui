import { Text } from 'react-native'
import { FONT, INK_SECONDARY } from '../lib/theme.ts'
import { Panel } from './panel.tsx'

/** Discreto a propósito: en un HUD la marca no compite con los datos. */
export function Wordmark() {
  return (
    <Panel style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6 }}>
      <Text
        style={{ fontFamily: FONT.medium, fontSize: 10, letterSpacing: 2.6, color: INK_SECONDARY }}
      >
        CHASQUI
      </Text>
    </Panel>
  )
}
