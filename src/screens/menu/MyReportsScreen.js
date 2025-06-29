import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'


const MyReportsScreen = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
        <Text style={styles.backText}>Bejelentéseim</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MyReportsScreen

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