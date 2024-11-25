import { View, Text, Image, LogBox } from 'react-native'
import React, { useEffect } from 'react'
import { splashStyles } from '@/styles/splashStyles'
import { resetAndNavigate } from '@/utils/LibraryHelpers'
import { tokenStorage } from '@/service/storage';
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';
import { refresh_tokens } from '@/service/api/apiInterceptors';

interface DecodedTOken {
    exp: number;
}

LogBox.ignoreAllLogs();

const Main = () => {

    const tokenCheck = async () => {
        const accessToken = tokenStorage.getString('accessToken') as string
        const refreshToken = tokenStorage.getString('refreshToken') as string

        if (accessToken) {
            const decodedAccessToken = jwtDecode<DecodedTOken>(accessToken)
            const decodedRefreshToken = jwtDecode<DecodedTOken>(refreshToken)

            const currentTime = Date.now() / 1000;

            if (decodedRefreshToken?.exp < currentTime) {
                resetAndNavigate('/(auth)/signin')
                Alert.alert("session Expired", "Please login again")
                return false
            }

            if (decodedAccessToken?.exp < currentTime) {
                try {
                    refresh_tokens()
                } catch (error) {
                    console.log(error)
                    Alert.alert("there was an error refreshing tokens ! ")
                    return false
                }
            }

            resetAndNavigate('/(home)/home')
            return true
        }

        resetAndNavigate('/(auth)/signin')
        return false

    }

    useEffect(() => {
        const timeoutId = setTimeout(tokenCheck, 1000);
        return () => clearTimeout(timeoutId);
    }, [])

    return (
        <View style={splashStyles.container}>
            <Image
                source={require('@/assets/images/adaptive-icon.png')}
                style={splashStyles.logo}
            />
        </View>
    )
}

export default Main