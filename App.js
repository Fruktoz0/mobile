
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/auth/LoginScreen';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {

  function Root(){
    const {isLoggedIn} = useAuth();
    return isLoggedIn ? <AppNavigator/> : <LoginScreen/>;
  }

  return (
    <AuthProvider>
      <RootNavigator/>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({

});
