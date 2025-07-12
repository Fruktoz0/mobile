import { StyleSheet, Text, View, FlatList } from 'react-native'
import { Card, Badge, IconButton, Divider, Searchbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
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
              <Card.Cover source={{ uri: `${API_URL}${item.reportImages[0]?.imageUrl}`, }} style={styles.image} />

              <View style={styles.rightContent}>
                <Text style={styles.date}>{item.createdAt}</Text>
                <Text style={styles.description}>
                  {item.description.length > 100
                    ? `${item.description.slice(0, 100)}…`
                    : item.description}
                </Text>
                <Divider style={styles.dashedDivider} />
                <View style={styles.bottomRow}>
                  <View style={styles.voteContainer}>
                    <IconButton icon="arrow-up" size={16} onPress={() => { }} />
                    <IconButton icon="arrow-down" size={16} onPress={() => { }} />
                    <Text>{item.votes}</Text>
                  </View>
                  <Text
                    style={styles.address}
                  >
                    {item.city === 'Budapest' ? item.address : item.city}
                  </Text>
                </View>
              </View>
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
  header:{
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
    padding: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    height: 180,
    marginBottom: 12,
    borderRadius: 3,
  },
  cardContent: {
    padding: 5,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: '100%',
    borderRadius: 12,
  },
  rightContent: {
    flex: 1,
    padding: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',

  },
  description: {
    marginBottom: 4,
  },
  dashedDivider: {
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#aaa',
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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