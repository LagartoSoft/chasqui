import '../global.css'
import { Geist_300Light } from '@expo-google-fonts/geist/300Light'
import { Geist_400Regular } from '@expo-google-fonts/geist/400Regular'
import { Geist_500Medium } from '@expo-google-fonts/geist/500Medium'
import { Geist_600SemiBold } from '@expo-google-fonts/geist/600SemiBold'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'

export default function RootLayout() {
  const [ready] = useFonts({
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
  })

  // ! Sin la espera, el primer render usa la fuente del sistema y todo salta
  if (!ready) return <View className="flex-1" style={{ backgroundColor: '#141414' }} />

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
