import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import CustomSafeAreaView from '@/components/ui/CustomSafeAreaView'
import LottieView from 'lottie-react-native'
import { siginStyles } from '@/styles/signinStyles'
import CustomText from '@/components/ui/CustomText'
import { signInWithGoogle } from '@/service/api/authService'

const Page = () => {

    const handleSignin = async () => {
        await signInWithGoogle()
    };

    return (
        <CustomSafeAreaView style={siginStyles.container}>
            <LottieView
                loop
                autoPlay
                style={siginStyles.animation}
                source={require('@/assets/animations/telegram.json')}
            />

            <CustomText variant='h3' style={siginStyles.title}>Welcome to Telegram</CustomText>
            <CustomText style={siginStyles.message}>Messages are heavily encrypted and can self-destruct.</CustomText>

            <TouchableOpacity style={siginStyles.loginBtn} onPress={handleSignin} >
                <Image source={require('@/assets/icons/google.png')} style={siginStyles.googleIcon} />
                <CustomText style={siginStyles.loginBtnText} >
                    Sign in with Google
                </CustomText>
            </TouchableOpacity>

        </CustomSafeAreaView>
    )
}

export default Page