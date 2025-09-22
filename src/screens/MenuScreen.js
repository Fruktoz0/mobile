import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { List, Avatar, Button, Divider } from 'react-native-paper'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { fetchUserData } from '../hooks/fetchUserData';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const MenuScreen = () => {

    const navigation = useNavigation()
    const [userData, setUserData] = useState(null)

    useFocusEffect(
        useCallback(() => {
            fetchUserData(setUserData);
        }, [])
    );

    return (
        <ScrollView style={styles.container}>
            <View>
                <View style={styles.header}>
                    <Avatar.Image
                        size={64}
                        source={
                            userData?.avatarStyle && userData?.avatarSeed
                                ? { uri: `https://api.dicebear.com/9.x/${userData.avatarStyle}/png?seed=${userData.avatarSeed}` }
                                : require('../../assets/images/avatar_placeholder.jpg')
                        }
                    />
                    {userData && (
                        <View>
                            <Text style={styles.name}>{userData.username}</Text>
                            <Text style={styles.email}>{userData.email}</Text>
                        </View>
                    )}
                </View>
                {userData?.role === "institution" && userData?.institutionId &&
                    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
                        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#666" }}>
                            Felhasználói nézet
                        </Text>
                        <View style={{ height: 1, backgroundColor: "#ddd", marginTop: 4 }} />
                    </View>
                }
                <List.Section>
                    <List.Item style={styles.item} title="Profilom" left={props => <List.Icon {...props} icon="account-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('Profile')} />

                    <List.Item style={styles.item} title="Bejelentéseim" left={props => <List.Icon {...props} icon="file-document-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('MyReports')} />

                    <List.Item style={styles.item} title="Jelvényeim" left={props => <List.Icon {...props} icon="trophy-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('MyBadges')} />

                    <List.Item style={styles.item} title="Kihívásaim" left={props => <List.Icon {...props} icon="trophy-variant-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('MyChallenges')} />



                    <List.Item style={styles.item} title="GY.I.K" left={props => <List.Icon {...props} icon="help-circle-outline" />} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('FAQ')} />
                </List.Section>
                {userData?.role === "institution" && userData?.institutionId &&
                    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
                        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#666" }}>
                            Intézményi nézet {userData?.institution?.name}
                        </Text>
                        <View style={{ height: 1, backgroundColor: "#ddd", marginTop: 4 }} />
                    </View>
                }
            </View>


            {userData?.role === "institution" && userData?.institutionId && (
                <>
                    <List.Item
                        style={styles.item}
                        title={'Kihívások'}
                        left={props => <List.Icon {...props} icon="trophy-variant-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('InstitutionChallenges')}
                    />
                    <List.Item
                        style={{ paddingTop: -14 }}
                        title={'Elkezdett kihívások'}
                        left={props => <List.Icon {...props} icon="circle-small" />} // kisebb jelölő
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('InstitutionSubmissions')}
                    />
                </>
            )}

            {userData?.role === "institution" && userData?.institutionId && (
                <List.Item
                    style={styles.item}
                    title={'Bejelentések'}
                    left={props => <List.Icon {...props} icon="file-document-outline" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => navigation.navigate('InstitutionReports')}
                />
            )}
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
        paddingTop: 40,
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

    },
    logoutButton: {
        borderColor: "#6BAEA1",
        borderWidth: 1.5,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 16,
        marginHorizontal: 10
    }

})