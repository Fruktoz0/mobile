import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { TextInput, Button, Text } from 'react-native-paper';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/apiConfig';

const { width: screenWidth } = Dimensions.get('window');

const LoginScreen = () => {

    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Kérjük, töltse ki az összes mezőt.');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });
            if (response.status === 200) {
                const token = response.data.token;
                await AsyncStorage.setItem('token', token);
                navigation.replace('MainTabs')

            } else {
                Alert.alert('Hiba történt', 'Kérjük, ellenőrizze az adatait és próbálja újra.');
            }

        } catch (error) {
            console.error('Bejelentkezési hiba:', error);
            alert('Hibás email vagy jelszó. Kérjük, próbálja újra.');
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/images/tisztavaros_logo.png')} style={styles.logo} />
            <Text style={styles.title}>BEJELENTKEZÉS</Text>

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

            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
            >
                BEJELENTKEZÉS
            </Button>
            <View style={styles.divider} />

            <TouchableOpacity style={styles.googleButton}>
                <Image source={require('../../../assets/images/google.svg')} style={styles.googleIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Nincs fiókod? <Text style={styles.linkHighlight}>Regisztrálj</Text></Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#FAFAF8'
    },
    logo: {
        height: screenWidth * 1,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        color: 'black',
    },
    title: {
        paddingTop: 32,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'black'
    },
    divider: {
        height: 1,
        opacity: 0.4,
        backgroundColor: '#6FB1A5',
        marginVertical: 40,
        marginHorizontal: 125,
    },
    button: {
        backgroundColor: '#6db2a1',
        marginTop: 32,
        height: 50,
        justifyContent: 'center',
        borderRadius: 8,
    },
    googleButton: {
        alignItems: 'center',
        marginBottom: 16
    },
    googleIcon: {
        width: 30,
        height: 30,
    },
    link: {
        marginTop: 16,
        textAlign: 'center',
        color: '#555',
        paddingBottom: 40,
    },
    linkHighlight: {
        color: '#6db2a1',
    },
})