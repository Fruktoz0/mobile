import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
    try {
        if (!Device.isDevice) {
            console.log('Push értesítések csak valódi eszközön működnek!');
            alert('Push értesítések csak valódi eszközön működnek!');
            return;
        }
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log("❌ Push engedély nem lett megadva.");
            alert('Push értesítések engedélyezése szükséges!');
            return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: "a6a9bdd2-1326-4ec2-8aa4-2a922b653826"
        });

        console.log("Push token:", tokenData.data);
        return tokenData.data;
    }catch (error) {
        console.log("Push token lekérése sikertelen:", error);
    }
   
}