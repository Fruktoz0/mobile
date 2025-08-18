import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, Text, Label, Avatar, Divider, List } from 'react-native-paper';
import { useState, useEffect } from "react"
import { fetchUserData } from '../../hooks/fetchUserData';
import { Share2, Settings, User, Info, LogOut, Lock, RefreshCcw } from 'lucide-react-native';
import { changeAvatar } from '../../services/profileService';




const ProfilScreen = () => {

  const navigation = useNavigation()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    fetchUserData(setUserData)
  }, []);

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.backText}>Profilom</Text>
        <TouchableOpacity>
          <Share2 size={18} style={{ marginLeft: 8, marginRight: 16 }} />
        </TouchableOpacity>
      </View>

      {userData && (

        <View style={styles.body}>
          <View style={styles.avatarContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <Avatar.Image
                size={64}
                source={
                  userData.avatarStyle && userData.avatarSeed
                    ? { uri: `https://api.dicebear.com/9.x/${userData.avatarStyle}/png?seed=${userData.avatarSeed}` }
                    : require('../../../assets/images/avatar_placeholder.jpg')
                }
              />
            </View>

            <Text style={{ fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>{userData.email} </Text>
            <Text style={{ color: 'grey' }}>@{userData.username} </Text>
          </View>
          <View style={{ marginBottom: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <Text>Avatar változtatás: 50 pont/csere</Text>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const data = await changeAvatar();
                  setUserData(prev => ({ ...prev, ...data }));
                } catch (err) {
                  alert(err.message || 'Nem sikerült az avatar cseréje.');
                }
              }}
              disabled={userData.points < 50 || userData.avatarChangesToday >= 3}
              style={{
                marginLeft: 18,
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  userData.points < 50 || userData.avatarChangesToday >= 3
                    ? '#ccc'
                    : '#007bff',
              }}
            >
              {userData.points < 50 || userData.avatarChangesToday >= 3 ? (
                <Lock size={20} color="white" />
              ) : (
                <RefreshCcw size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <Divider style={{ marginBottom: 32, marginHorizontal: 16 }} />
          <View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingHorizontal: 26, marginBottom: 3 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', paddingStart: 12 }}>{userData.reportCount} </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', paddingStart: 50 }}>0/5 </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 30 }}>{userData.points} </Text>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 46 }}>
              <Text style={{ fontSize: 12, color: 'grey' }}>Bejelentések</Text>
              <Text style={{ fontSize: 12, color: 'grey' }}>Kihívások</Text>
              <Text style={{ fontSize: 12, color: 'grey' }}>Pontok</Text>
            </View>
          </View>
          <View style={styles.dataContainer}>
            <List.Section>
              <List.Item style={styles.item} title="Beállítások" left={() => (
                <View style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  padding: 8,
                }}>
                  <Settings size={20} />
                </View>
              )} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('Settings')} />

              <List.Item style={styles.item} title="Felhasználói adatok" left={() => (
                <View style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  padding: 8,
                }}>
                  <User size={20} />
                </View>
              )} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('Userdata')} />
              <Divider style={{ marginVertical: 16 }} />
              <List.Item style={styles.item} title="Információk" left={() => (
                <View style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  padding: 8,
                }}>
                  <Info size={20} />
                </View>
              )} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={() => navigation.navigate('Information')} />
              <List.Item style={styles.item} title="Kijelentkezés" left={() => (
                <View style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  padding: 8,

                }}>
                  <LogOut size={20} />
                </View>
              )} right={props => <List.Icon {...props} icon="chevron-right" />} onPress={async () => {
                await AsyncStorage.removeItem('token');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }}
              />

            </List.Section>
          </View>

        </View>
      )}

    </ScrollView>

  );
}

export default ProfilScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAF8',
  },
  body: {
    marginStart: 8,
    marginEnd: 8
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  header: {
    marginStart: 16,
    paddingTop: 32,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16
  },
  text: {
    marginBottom: 8,
  },
  dataContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 16
  },
  item: {
    marginStart: 12,
  }
})