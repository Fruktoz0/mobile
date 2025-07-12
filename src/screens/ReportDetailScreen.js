import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { API_URL } from '../config/apiConfig'
import { Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

const ReportDetailScreen = ({ route }) => {
    const { report } = route.params;

    console.log('Report Detail:', report);
      const navigation = useNavigation()
   
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                    <Text style={styles.backText}>Profilom</Text>
                </TouchableOpacity>
            </View>
            <Image
                source={{ uri: `${API_URL}${report.reportImages[0]?.imageUrl}` }}
                style={styles.image}
            />
            <Text style={styles.title}>{report.title}</Text>
            <Text style={styles.date}>Létrehozva: {new Date(report.createdAt).toLocaleString('hu-HU')}</Text>
            <Text style ={styles.section}>Bejelentő:</Text>
            <Text>{report.user?.username || 'Név nélkül'}</Text>
            
            <Text style={styles.section}>Leírás:</Text>
            <Text style={styles.description}>{report.description}</Text>
            <Text style={styles.section}>Helyszín:</Text>
            <Text>{report.city}, {report.zipCode}, {report.address}</Text>
            <Text style={styles.section}>Kategória:</Text>
            <Text style={styles.category}>{report.category.categoryName || 'Nincs kategória'}</Text>
            <Text style={styles.section}>Szavazatok: {report.votes || 0}</Text>
        </ScrollView>
    )
}

export default ReportDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FAFAF8',
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
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    date: {
        color: '#666',
        marginBottom: 12,
    },
    section: {
        marginTop: 16,
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {
        fontSize: 14,
        marginTop: 4,
    },
    category:{
        fontSize: 14,
        marginTop: 4,

 
    },
})