import '../global.css'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { SURFACE_SOLID } from '../lib/theme.ts'

export default function RootLayout() {
  // Los cuatro pesos viven en assets/fonts: el paquete de Google metía
  // dieciocho en el APK para los cuatro que se usan
  const [ready] = useFonts({
    Geist_300Light: require('../assets/fonts/Geist_300Light.ttf'),
    Geist_400Regular: require('../assets/fonts/Geist_400Regular.ttf'),
    Geist_500Medium: require('../assets/fonts/Geist_500Medium.ttf'),
    Geist_600SemiBold: require('../assets/fonts/Geist_600SemiBold.ttf'),
  })

  // Sin la espera, el primer render usa la fuente del sistema y todo salta
  if (!ready) return <View className="flex-1" style={{ backgroundColor: SURFACE_SOLID }} />

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
