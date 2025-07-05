import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BottomNavigation } from 'react-native-paper'
import HomeScreen from '../screens/HomeScreen'
import MenuScreen from '../screens/MenuScreen'
import ChallengesScreen from '../screens/ChallengesScreen'
import Reportcreen from '../screens/ReportScreen'
import Reportscreen from '../screens/ReportsScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AppNavigator = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'home', title: 'Kezdőlap', icon: 'home' },
        { key: 'reports', title: 'Bejelentések', icon: 'file-document' },
        { key: 'report', icon: 'file-document-edit-outline', title: 'Bejelentés' },
        { key: 'challenges', title: 'Kihívások', icon: 'trophy-variant' },
        { key: 'menu', title: 'Menü', icon: 'menu' },
    ])

    const renderScene = BottomNavigation.SceneMap({
        home: HomeScreen,
        reports: Reportscreen,
        report: Reportcreen,
        challenges: ChallengesScreen,
        menu: MenuScreen,
    })

    const renderIcon = ({ route, color, }) => {
        return (
            <MaterialCommunityIcons
                name={route.icon}
                color={color}
                size={26}
            />
        )
    }

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={styles.bar}
            activeColor="#6BAEA1"
            tabBarActiveBackgroundColor="#eff6f4"
            inactiveColor="#deedea"
            renderIcon={renderIcon}
        
            >
        </BottomNavigation>
    )
}

export default AppNavigator

const styles = StyleSheet.create({
    bar:{
        backgroundColor: '#fff',
        height: 90
    }

})