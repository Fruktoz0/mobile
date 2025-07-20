import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, Text, Label } from 'react-native-paper';
import { useState, useEffect } from "react"
import { fetchUserData } from '../../hooks/fetchUserData';



const ProfilScreen = () => {

  const navigation = useNavigation()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    fetchUserData(setUserData)
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
            <Text style={styles.backText}>Profilom</Text>
          </TouchableOpacity>
        </View>

        {userData && (

          <View style={styles.body}>
            <Text style={styles.textCat}>Felhasználói adatok</Text>
            <Text style={styles.text}>Felhasználónév:</Text>
            <TextInput
              mode="outlined"
              value={userData.username}
              style={styles.textInput}
              theme={{ colors: { primary: '#6db2a1' } }}
              disabled="true"
            >
            </TextInput>
            <Text style={styles.text}>Email</Text>
            <TextInput
              mode="outlined"
              value={userData.email}
              style={styles.textInput}
              theme={{ colors: { primary: '#6db2a1' } }}
              disabled={true}
            />
              <Text style={styles.text}>Város</Text>
              <TextInput
                mode="outlined"
                placeholder='város'
                style={styles.textInput}
                theme={{ colors: { primary: '#6db2a1' } }}
                disabled={true}
              />
          
             <Text style={styles.text}>Lakcím</Text>
            <TextInput
              mode="outlined"
              placeholder='lakcím'
              style={styles.textInput}
              theme={{ colors: { primary: '#6db2a1' } }}
              disabled={true}
            />
            <Text style={styles.text}>Jogosultság</Text>
            <TextInput
              mode="outlined"
              value={userData.role}
              style={styles.textInput}
              theme={{ colors: { primary: '#6db2a1' } }}
              disabled={true}
            >
            </TextInput>
            <Text style={styles.text}>Státusz</Text>
            <TextInput
              mode="outlined"
              value={userData.isActive === "active" ? 'aktív' : 'Inaktív'}
              style={styles.textInput}
              theme={{ colors: { primary: '#6db2a1' } }}
              disabled={true}
            >
            </TextInput>
            <Text style={styles.text}>Pontok</Text>
            <TextInput
              mode="outlined"
              value={String(userData.points)}
              style={styles.textInput}
              theme={{ colors: { primary: '#6db2a1' } }}
              disabled={true}
            >
            </TextInput>
            {console.log(userData.points)}


          </View>
        )}
      </View>
    </ScrollView>

  );
}

export default ProfilScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAF8',
  },
  body: {
    marginStart: 16,
    marginEnd: 16
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  header: {
    marginStart: 16,
    paddingTop: 32,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginBottom: 8,
  },
  textCat: {
    fontWeight: "bold",
    marginBottom: 16,
    color: "#6BAEA1"
  },
  textInput: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 16,
    color: 'black',
    marginEnd: 60
  }

})