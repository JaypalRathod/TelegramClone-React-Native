import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { useAuthStore } from '../authStore';
import { tokenStorage } from '../storage';
import { BASE_URL } from '../config';
import { resetAndNavigate } from '@/utils/LibraryHelpers';
import { appAxios } from './apiInterceptors';
import { useChatStore } from '../chatStore';
import { useUserStore } from '../userStore';

GoogleSignin.configure({
    webClientId: '962136270085-csq3agseq92kcbrjl558nn85r8psffkd.apps.googleusercontent.com',
    forceCodeForRefreshToken: true,
    offlineAccess: false,
    iosClientId: '962136270085-47g4912v5ino3qo2nr5jpglmln650d3l.apps.googleusercontent.com',
});

export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut();   
        const res = await GoogleSignin.signIn();

        const apiRes = await axios.post(`${BASE_URL}/oauth/login`, {
            id_token: res?.data?.idToken
        })

        const { tokens, user } = apiRes.data

        tokenStorage.set('accessToken', tokens?.access_token);
        tokenStorage.set('refreshToken', tokens?.refresh_token);

        const { setUser } = useAuthStore.getState();
        setUser(user);
        resetAndNavigate('/(home)/home')

    } catch (error: any) {
        console.log(error)
        if (error?.response?.status == 400) {
            resetAndNavigate('/(auth)/signup')
        }
    }
};

export const signUpWithGoogle = async (data: any) => {

    try {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut();
        const res = await GoogleSignin.signIn();

        const apiRes = await axios.post(`${BASE_URL}/oauth/login`, {
            id_token: res?.data?.idToken,
            ...data
        })

        const { tokens, user } = apiRes.data

        tokenStorage.set('accessToken', tokens?.access_token);
        tokenStorage.set('refreshToken', tokens?.refresh_token);

        const { setUser } = useAuthStore.getState();
        setUser(user);
        resetAndNavigate('/(home)/home')

    } catch (error: any) {
        console.log("ERROR IN SIGNUP", error)
    }
};

export const checkUsername = async (username: string) => {
    try {
        const apiRes = await axios.post(`${BASE_URL}/oauth/check-username`, {
            username
        });
        return apiRes.data?.available
    } catch (error) {
        console.log('checkUsername', error)
        return false
    }
}

export const logoutFromApp = async (device_token: string) => {
    try {
        const apiRes = await appAxios.post(`/device-token/remove`, {
            device_token
        });
        const { logout } = useAuthStore.getState();
        const { clearAllChats } = useChatStore.getState();
        const { clearUserStore } = useUserStore.getState();
        logout();
        clearUserStore();
        clearAllChats();
        tokenStorage.clearAll();
        resetAndNavigate('/(auth)/signin')
        console.log("REMOVED DEVICE TOKEN")
    } catch (error) {
        console.log('Logout', error);
    }
}

export const registerDeviceToken = async (device_token: string) => {

    const { deviceTokenAdded, setDeviceTokenStatus } = useAuthStore.getState();
    if (deviceTokenAdded) {
        return
    }
    try {
        const apiRes = await appAxios.post(`/device-token/register`, {
            device_token
        });
        setDeviceTokenStatus(true)
        console.log("ADDED DEVICE TOKEN")
    } catch (error) {
        setDeviceTokenStatus(false)
        console.log('Device Token', error);
    }
}