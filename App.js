
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/auth/LoginScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import * as Notifications from "expo-notifications";

enableScreens();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {

  function Root() {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <AppNavigator /> : <LoginScreen />;
  }

  return (
    <AuthProvider>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({

});
