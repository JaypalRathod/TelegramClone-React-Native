import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Colors } from '@/utils/Constants'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

    const [loaded] = useFonts({
        SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    })

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return (
        <>
            <StatusBar style='light' backgroundColor={Colors.tertiary} translucent />

            <Stack
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name='index' />
                <Stack.Screen name='(auth)' />
            </Stack>
        </>
    )

}