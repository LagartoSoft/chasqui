import { Camera, Map as MapView } from '@maplibre/maplibre-react-native'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LIMA_CENTER, MAP_STYLE_URL } from '../lib/map.ts'

const INITIAL_ZOOM = 14

export default function MapScreen() {
  return (
    <View className="flex-1">
      <MapView style={StyleSheet.absoluteFill} mapStyle={MAP_STYLE_URL} attribution logo={false}>
        <Camera initialViewState={{ center: LIMA_CENTER, zoom: INITIAL_ZOOM }} />
      </MapView>

      <SafeAreaView className="absolute inset-x-0 top-0" pointerEvents="none">
        <View className="m-3.5 self-start rounded-2xl bg-neutral-950/90 px-4 py-3">
          <Text className="text-[15px] tracking-[5px] text-neutral-100">chasqui</Text>
        </View>
      </SafeAreaView>
    </View>
  )
}
