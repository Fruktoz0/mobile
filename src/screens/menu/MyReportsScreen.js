import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import { Card } from 'react-native-paper';
import { API_URL } from '../../config/apiConfig'
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserReports } from '../../services/reportService';

const statusLabels = {
  open: "Függőben",
  in_progress: "Folyamatban",
  rejected: "Elutasítva",
  resolved: "Megoldva"
}

const statusColors = {
  open: '#6B7280',
  accepted: '#1976D2',
  forwarded: '#64B5F6',
  in_progress: '#8E24AA',
  resolved: '#388E3C',
  rejected: '#D32F2f',
  reopened: '#F57C00',
}


const MyReportsScreen = () => {

  const navigation = useNavigation()
  const [reports, setReports] = useState([])
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false); // pull to refresh állapot

  const loadReports = async () => {
    try {
      const data = await fetchUserReports();
      setReports(data);
    } catch (error) {
      console.error("Hiba a bejelentések lekérdezésekor:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#6BAEA1" />
      </View>
    )
  }

  //Pull-to-refresh lehúzással
  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const getDistrictFromZip = (city, zipCode) => {
    if (city !== 'Budapest' || typeof zipCode !== 'string' || zipCode.length !== 4) {
      return city;
    }
    const districtNum = parseInt(zipCode.slice(1, 3), 10);

    if (isNaN(districtNum) || districtNum < 1 || districtNum > 23) {
      return city;
    }
    return `${districtNum}. kerület`;
  };


  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.backText}>Saját bejelentéseim</Text>
          <View style={{ width: 24, marginRight: 16 }} />
        </View>
        <View >
          {reports.length === 0 ? (
            <Text style={styles.noReports}>Még nincs bejelentésed.</Text>
          ) : (

            <FlatList
              style={styles.listContent}
              data={reports.filter(report =>
                report.title.toLowerCase().includes(searchText.toLowerCase()) ||
                report.description.toLowerCase().includes(searchText.toLowerCase())
              )}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {

                return (
                  <Card
                    style={styles.card}
                    onPress={() => navigation.navigate('ReportDetail', { reportId: item.id })}
                  >
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

                      <Text style={styles.address}>
                        {getDistrictFromZip(item.city, item.zipCode)}
                      </Text>

                    </View>
                    <View style={[styles.statusBar, { backgroundColor: statusColors[item.status] }]} />
                  </Card>
                )
              }}
              refreshControl={ // ← lehúzásra frissítés
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#009688']} />
              }
            />

          )
          }
        </View>




      </View>
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
    flex: 1,
    textAlign: 'center',
    color: 'black',
    marginLeft: 8,
  },
  header: {
    marginStart: 16,
    paddingTop: 36,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF8'
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
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
    fontSize: 10,
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
    justifyContent: 'flex-end',
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
  statusBar: {
    height: 2,
    width: '100%',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    opacity: 0.7
  },

})