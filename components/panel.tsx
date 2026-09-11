import type { ReactNode } from 'react'
import { View, type ViewStyle } from 'react-native'
import { BORDER, RADIUS, SURFACE } from '../lib/theme.ts'

type PanelProps = {
  children: ReactNode
  style?: ViewStyle
}

/** La superficie oscura sobre la que se apoya todo lo que flota encima del mapa. */
export function Panel({ children, style }: PanelProps) {
  return (
    <View
      style={{
        backgroundColor: SURFACE,
        borderRadius: RADIUS,
        borderWidth: 1,
        borderColor: BORDER,
        ...style,
      }}
    >
      {children}
    </View>
  )
}
