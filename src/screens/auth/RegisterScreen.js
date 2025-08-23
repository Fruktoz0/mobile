import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native'
import { TextInput, Button, Text, Dialog, Provider, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react'
import { Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width: screenWidth } = Dimensions.get('window');

const RegisterScreen = () => {

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const response = await register(username, email, password, confirmPassword);
      if (response.status === 201) {
        Alert.alert('Sikeres regisztráció!', 'Most már be tudsz jelentkezni.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }

    } catch (error) {
      console.error('Regisztrációs hiba:', error);
      if (error.response) {
        Alert.alert(error.response?.data?.message || 'Ismeretlen hiba történt.');
      }
    }
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      extraScrollHeight={20}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"

    >
      <View style={styles.container}>
        <Image source={require('../../../assets/images/tisztavaros_logo.png')} style={styles.logo} />
        <Text style={styles.title}>REGISZTRÁCIÓ</Text>

        <TextInput
          label={"Felhasználónév"}
          value={username}
          onChangeText={setUserName}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: '#6db2a1' } }}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: '#6db2a1' } }}
        />
        <TextInput
          label="Jelszó"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          theme={{ colors: { primary: '#6db2a1' } }}
        />
        <TextInput
          label="Jelszó megerősítése"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
          theme={{ colors: { primary: '#6db2a1' } }}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          REGISZTRÁCIÓ
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Van már fiókod? <Text style={styles.linkHighlight}>Bejelentkezés</Text></Text>
        </TouchableOpacity>

      </View>

    </KeyboardAwareScrollView>

  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FAFAF8'
  },
  logo: {
    height: screenWidth * 1,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  title: {
    paddingTop: 32,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black'
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,

  },
  button: {
    backgroundColor: '#6db2a1',
    marginTop: 32,
    height: 50,
    justifyContent: 'center',
    borderRadius: 8,
  },
  link: {
    marginTop: 24,
    textAlign: 'center',
    color: '#555',
    paddingBottom: 40,
  },
  linkHighlight: {
    color: '#6BAEA1'
  },

})