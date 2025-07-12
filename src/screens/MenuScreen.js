import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { List, Avatar, Button } from 'react-native-paper'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react'
import { fetchUserData } from '../hooks/fetchUserData';


const MenuScreen = () => {

    const navigation = useNavigation()

    const [userData, setUserData] = useState(null)
    useEffect(() => {
       fetchUserData(setUserData)
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar.Image size={64} source={require('../../assets/images/avatar_placeholder.jpg')} />
                {userData && (
                    <View>
                        <Text style={styles.name}>{userData.username}</Text>
                        <Text style={styles.email}>{userData.email}</Text>
                    </View>
                )}

            </View>
            <List.Section>
                <List.Item style={styles.item} title="Profilom" left={props => <List.Icon {...props} icon="account-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('Profile')} />

                <List.Item style={styles.item} title="Bejelentéseim" left={props => <List.Icon {...props} icon="file-document-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('MyReports')} />

                <List.Item style={styles.item} title="Jelvényeim" left={props => <List.Icon {...props} icon="trophy-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('MyBadges')} />

                <List.Item style={styles.item} title="Kihívásaim" left={props => <List.Icon {...props} icon="trophy-variant-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('MyChallenges')} />

                <List.Item style={styles.item} title="GY.I.K" left={props => <List.Icon {...props} icon="help-circle-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('FAQ')} />
            </List.Section>
        </ScrollView>

    )
}

export default MenuScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF8'
    },
    header: {
        paddingTop: 32,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#eff6f4',
    },
    name: {
        paddingLeft: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    email: {
        paddingLeft: 16,
        color: 'black',
        opacity: 0.8
    },
    item: {
        marginTop: 10,

    }
})