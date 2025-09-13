
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/auth/LoginScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

enableScreens();

export default function App() {

  // Értesítések kezelése

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground push:', remoteMessage);
    });
    return unsubscribe;
  }, []);

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
