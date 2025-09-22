import { StyleSheet, Text, View, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native'
import { Card, IconButton, Searchbar, Menu } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Image } from 'react-native'
import { useEffect, useState } from 'react'
import { API_URL } from '../config/apiConfig'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { fetchAllReports } from '../services/reportService'
import { MaterialCommunityIcons } from '@expo/vector-icons'


const ReportsScreen = () => {
  const navigation = useNavigation()
  const [reports, setReports] = useState([])
  const [searchText, setSearchText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // pull to refresh állapot

  const loadReports = async () => {
    try {
      const data = await fetchAllReports();
      setReports(data);
    } catch (error) {
      console.error("Hiba a bejelentések betöltésekor:", error);
    }
  }

  const statusMap = {
    open: { label: "Nyitott", color: "#6B7280" },
    accepted: { label: "Befogadva", color: "#1976D2" },
    in_progress: { label: "Folyamatban", color: "#8E24AA" },
    forwarded: { label: "Továbbítva", color: "#64B5F6" },
    resolved: { label: "Megoldva", color: "#388E3C" },
    reopened: { label: "Újranyitva", color: "#F57C00" },
    rejected: { label: "Elutasítva", color: "#D32F2f" }
  };

  //Ha képernyőre fokusz kerül frissít
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  )
  //Pull-to-refresh lehúzással
  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };


  // Token dekódolása és userId beállítása
  useEffect(() => {
    const loadUserIdFromToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log('Token dekódolva:', decoded);
          setUserId(decoded.id);
        } catch (err) {
          console.error('Token dekódolási hiba:', err);
        }
      }
    };
    loadUserIdFromToken();
  }, []);



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


  const handleVote = async (reportId, voteType,) => {
    try {

      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/api/votes/vote`, { reportId, voteType }, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });
      // Frissíti a lista adatait
      await loadReports(); // vagy csak azt az egy reportot
    } catch (err) {
      console.error('Szavazási hiba:', err.response?.data || err.message);
    }
  };

  const getVoteCount = (reportVotes) => {
    const upvotes = reportVotes.filter(v => v.voteType === 'upvote').length;
    const downvotes = reportVotes.filter(v => v.voteType === 'downvote').length;
    return upvotes - downvotes;
  };

  const getUserVote = (reportVotes) => {
    return reportVotes.find(vote => vote.userId === userId)?.voteType;

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Kereső */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 8,
          height: 40,
          paddingHorizontal: 10,
        }}>
          <MaterialCommunityIcons name="magnify" size={20} color="#666" />
          <TextInput
            style={{
              flex: 1,
              fontSize: 14,
              marginLeft: 8,
              textAlignVertical: "center",
            }}
            placeholder="Keresés..."
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="tune"
                  size={22}
                  onPress={() => setMenuVisible(true)}
                />
              }
              contentStyle={{ backgroundColor: '#FFFFFf', elevation: 2, borderRadius: 8, shadowColor: "transparent", }}
            >

              {/* Összes opció */}
              <Menu.Item
                key="all"
                onPress={() => {
                  setSelectedStatus(null);
                  setMenuVisible(false);
                }}
                title="Összes"
                titleStyle={{
                  fontSize: 14,
                  color: "#000",
                }}
                leadingIcon={selectedStatus === null
                  ? (props) => (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color="black"
                    />
                  )
                  : undefined
                }
              />

              {Object.keys(statusMap).map(status => (
                <Menu.Item
                  key={status}
                  onPress={() => {
                    setSelectedStatus(status);
                    setMenuVisible(false);
                  }}
                  title={statusMap[status].label}
                  titleStyle={{
                    fontSize: 14,
                    color: statusMap[status].color,
                  }}
                  leadingIcon={selectedStatus === status
                    ? (props) => (
                      <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color="black"
                      />
                    )
                    : undefined
                  }
                />
              ))}
            </Menu>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={styles.listContent}
        data={reports.filter(report =>
          (!selectedStatus || report.status === selectedStatus) && (
            report.title.toLowerCase().includes(searchText.toLowerCase()) ||
            report.description.toLowerCase().includes(searchText.toLowerCase())
          )

        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const userVote = getUserVote(item.reportVotes, userId);
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
                <View style={styles.voteContainer}>
                  <IconButton
                    icon="arrow-up"
                    size={16}
                    iconColor={userVote === 'upvote' ? 'green' : 'black'}
                    onPress={() => handleVote(item.id, 'upvote')} />
                  <Text style={styles.vote}>{getVoteCount(item.reportVotes)}</Text>
                  <IconButton
                    icon="arrow-down"
                    size={16}
                    iconColor={userVote === 'downvote' ? 'red' : 'black'}
                    onPress={() => handleVote(item.id, 'downvote')} />
                </View>
                <Text style={styles.address}>
                  {getDistrictFromZip(item.city, item.zipCode)}
                </Text>

              </View>
            </Card>
          )
        }}
        refreshControl={ // ← lehúzásra frissítés
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#009688']} />
        }
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
    marginTop: 40,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
    color: 'black',
    flex: 1,
    textAlign: 'center',
    marginLeft: 0,
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