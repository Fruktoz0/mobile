import { API_URL } from '../config/apiConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

//Push értesítések regisztrációja
export async function registerForPushNotificationsAsync() {
    try {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
        }
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!enabled) {
            console.log('Push értesítések engedélyezése megtagadva');
            return;
        }
        //Token lekérése firebaseből
        const pushToken = await messaging().getToken();
        console.log("FCM Push token:", pushToken);

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.log("Nincs bejelentkezve a felhasználó, nem lehet elküldeni a push tokent a szervernek.");
            return pushToken;
        }
        //Token elküldése a szervernek
        await axios.post(`${API_URL}/api/users/registerPushToken`, { pushToken }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log("Push token sikeresen elküldve a szervernek.");
        return pushToken;
    } catch (error) {
        console.log("Push token lekérése sikertelen:", error);
    }
}

//Android notification channel létrehozása
export async function setupNotificationChannel() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Alapértelmezett értesítések',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
}

//Értesítésre kattintás navigációs térkép
//Ezt használja a usePushNotifications hook
export const targetMap = (navigation) => ({
    report: (data) => navigation.navigate("ReportDetail", { reportId: data.reportId }),
    news: (data) => navigation.navigate("NewsDetails", { id: data.id }),
    badge: () => navigation.navigate("Profile"),
})
