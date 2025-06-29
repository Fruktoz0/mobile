import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import AppNavigator from './AppNavigator'
import ProfileScreen from '../screens/menu/ProfilScreen'
import MyReportsScreen from '../screens/menu/MyReportsScreen'
import BadgesScreen from '../screens/menu/BadgesScreen'
import MyChallengesScreen from '../screens/menu/MyChallengesScreen'
import FaqScreen from '../screens/menu/FaqScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'



const Stack = createStackNavigator()

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
            >
                {/* Auth oldalak  */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                {/* A fő oldalak */}

                <Stack.Screen name="MainTabs" component={AppNavigator} />

                {/* A menü oldalak */}
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="MyReports" component={MyReportsScreen} />
                <Stack.Screen name="MyBadges" component={BadgesScreen} />
                <Stack.Screen name="MyChallenges" component={MyChallengesScreen} />
                <Stack.Screen name="FAQ" component={FaqScreen} />


            </Stack.Navigator>
        </NavigationContainer>

    )
}

export default RootNavigator

const styles = StyleSheet.create({})