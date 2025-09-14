import { useEffect } from "react";
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { useNavigation } from "@react-navigation/native";
import { setupNotificationChannel } from "../services/notificationService";
import { targetMap } from "../services/notificationService";

export default function usePushNotifications() {
    const navigation = useNavigation();

    // Értesítések kezelése

    useEffect(() => {
        setupNotificationChannel();

        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: remoteMessage.notification?.title,
                    body: remoteMessage.notification?.body,
                    data: remoteMessage.data,
                },
                trigger: null,
                android: { channelId: 'default' }
            });
        });
        // Értesítésre kattintás kezelése
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;

            // Navigálás a megfelelő képernyőre az értesítés adatai alapján
            const handler = targetMap(navigation)[data.target];
            if (handler) {
                handler(data);
            } else {
                console.log("Ismeretlen értesítés típus:", data.target);
                return;
            }
        });

        return () => {
            unsubscribeOnMessage();
            subscription.remove();
        };
    }, [navigation]);
}
