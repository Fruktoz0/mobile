import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { use } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';




const ProfilScreen = () => {


  const navigation = useNavigation()

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
        <Text style={styles.backText}>Profilom</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfilScreen

const styles = StyleSheet.create({
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
    paddingTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#cee4df',
  }
})