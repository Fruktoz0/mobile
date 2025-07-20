import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'


const FaqScreen = () => {

  const navigation = useNavigation()
  return (
    <ScrollView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
            <Text style={styles.backText}>GY.I.K</Text>
          </TouchableOpacity>
        </View>


      </View>
    </ScrollView>

  )
}

export default FaqScreen

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
    marginStart: 16,
    paddingTop: 32,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

})