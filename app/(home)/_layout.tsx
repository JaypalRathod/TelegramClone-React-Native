import { WSProvider } from "@/service/sockets/WSProvider"
import { Stack } from "expo-router";
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from "react";
import { registerForPushNotificationsAsync } from "@/utils/NotificationHandler";
import { registerDeviceToken } from "@/service/api/authService";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Layout = () => {

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(async (token) => await registerDeviceToken(token ?? ""))
            .catch((error: any) => console.log("Error Device Token", error))

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, [])

    return (
        <WSProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="home" />
                <Stack.Screen name="chat" />
                <Stack.Screen name="contacts" />
                <Stack.Screen name="notification" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="serch" />
            </Stack>
        </WSProvider>
    )
}

export default Layout