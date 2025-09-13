import { API_URL } from '../config/apiConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

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

