import { Text } from 'react-native'
import { FONT, INK } from '../lib/theme.ts'
import { Panel } from './panel.tsx'

export function Wordmark() {
  return (
    <Panel style={{ alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7 }}>
      <Text style={{ fontFamily: FONT.semibold, fontSize: 12, letterSpacing: 3.2, color: INK }}>
        CHASQUI
      </Text>
    </Panel>
  )
}
