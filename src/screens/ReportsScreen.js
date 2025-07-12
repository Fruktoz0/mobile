import { StyleSheet, Text, View, FlatList } from 'react-native'
import { Card, Badge, IconButton, Divider, Searchbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../config/apiConfig'



const ReportsScreen = () => {
  const navigation = useNavigation()
  const [reports, setReports] = useState([])
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/reports/getAllReports`)
        const reports = response.data;
        console.log('Lekért reportok:', reports);
        setReports(reports);
      } catch (error) {
        console.error('Hiba a reportok lekérdezésében', error);
      }
    };
    fetchAllReports();
  }, [])



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchWrapper}>
          <Searchbar
            placeholder="Keresés"
            onChangeText={setSearchText}
            value={searchText}
            style={styles.searchbar}
          />
          <IconButton icon="tune" size={26} onPress={() => { }} />
        </View>
      </View>

      <FlatList
        style={styles.listContent}
        data={reports.filter(report =>
          report.title.toLowerCase().includes(searchText.toLowerCase()) ||
          report.description.toLowerCase().includes(searchText.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Image
                source={{ uri: `${API_URL}${item.reportImages[0]?.imageUrl}` }}
                style={styles.image}
              />

              <View style={styles.rightContent}>
                  <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('hu-HU')}</Text>
                <View style={styles.topRow}>
                  <Text style={styles.title}>{item.title}</Text>
                </View>

                <Text style={styles.description}>
                  {item.description.length > 100
                    ? `${item.description.slice(0, 100)}…`
                    : item.description}
                </Text>
              </View>
            </View>
            <View style={styles.bottomRow}>
              <View style={styles.voteContainer}>
                <IconButton icon="arrow-up" size={16} onPress={() => { }} />
                <IconButton icon="arrow-down" size={16} onPress={() => { }} />
              </View>
              <Text style={styles.address}>
                {item.city === 'Budapest'
                  ? `${item.address.split(',')[0]}`
                  : item.city}
              </Text>
            </View>
          </Card>



        )}
      />


    </View>
  )
}

export default ReportsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
  },
  searchWrapper: {
    marginRight: 10,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  searchbar: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,

  },
  listContent: {

  },
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    height: 130,
    padding: 8,
  },
  image: {
    width: 100,
    height: "100%",
    borderRadius: 8,
  },
  rightContent: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  date: {
    textAlign: 'right',
    fontSize: 12,
    color: '#888',
  },
  description: {
    fontSize: 13,
    color: '#333',
    marginVertical: 4,
    flexShrink: 1,
  },
bottomRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingBottom: 8,
  marginTop: -8, // opcionális, ha közelebb akarod hozni
},
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 12,
    color: '#555',
  },

})