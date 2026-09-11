import { Text } from 'react-native'
import { FONT, INK_SECONDARY } from '../lib/theme.ts'
import { Panel } from './panel.tsx'

/** Lo que la app no puede hacer ahora mismo, dicho sin alarmar. */
export function Notice({ children }: { children: string }) {
  return (
    <Panel style={{ paddingHorizontal: 14, paddingVertical: 11 }}>
      <Text
        style={{ fontFamily: FONT.regular, fontSize: 12.5, lineHeight: 17, color: INK_SECONDARY }}
      >
        {children}
      </Text>
    </Panel>
  )
}
