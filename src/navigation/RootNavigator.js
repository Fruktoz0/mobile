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
import ReportDetailScreen from '../screens/ReportDetailScreen';
import InstitutionReportsScreen from '../screens/menu/InstitutionReportsScreen'
import AddNewsScreen from '../screens/menu/AddNewsScreen'
import NewsDetailsScreen from '../screens/NewsDetailsScreen'
import InformationScreen from '../screens/profil/InformationScreen'
import SettingsScreen from '../screens/profil/SettingsScreen'
import UserdataScreen from '../screens/profil/UserdataScreen'
import ChallengesScreen from '../screens/ChallengesScreen'
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen'
import NewChallengeScreen from '../screens/NewChallangeScreen'



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
                <Stack.Screen name="InstitutionReports" component={InstitutionReportsScreen} />
                <Stack.Screen name="MyBadges" component={BadgesScreen} />
                <Stack.Screen name="MyChallenges" component={MyChallengesScreen} />
                <Stack.Screen name="FAQ" component={FaqScreen} />
                {/* A bejelentések részletei */}
                <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
                {/* A Hírek részletei */}
                <Stack.Screen name="AddNews" component={AddNewsScreen} />
                <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
                {/* Kihívások */}
                <Stack.Screen name="NewChallenge" component={NewChallengeScreen} />
                <Stack.Screen name="Challenges" component={ChallengesScreen} />
                <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
                {/* Profil oldalak */}  
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Information" component={InformationScreen} />
                <Stack.Screen name="Userdata" component={UserdataScreen} />

            </Stack.Navigator>
        </NavigationContainer>

    )
}

export default RootNavigator

const styles = StyleSheet.create({})