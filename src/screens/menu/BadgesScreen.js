import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const BadgesScreen = () => {

  const navigation = useNavigation()

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
        <Text style={styles.backText}>Jelvényeim</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BadgesScreen

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
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  }

})