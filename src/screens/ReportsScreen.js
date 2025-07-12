import { StyleSheet, Text, View, FlatList } from 'react-native'
import { Card, Badge, IconButton, Divider, Searchbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Image } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { API_URL } from '../config/apiConfig'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';




const ReportsScreen = () => {
  const navigation = useNavigation()
  const [reports, setReports] = useState([])
  const [searchText, setSearchText] = useState('');
  const [userId, setUserId] = useState(null);



  const fetchAllReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reports/getAllReports`)
      const reports = response.data;
      setReports(reports);
    } catch (error) {
      console.error('Hiba a reportok lekérdezésében', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllReports();
    }, [])
  )
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
    console.log('User ID:', userId);
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
      fetchAllReports(); // vagy csak azt az egy reportot
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
        renderItem={({ item }) => {
          const userVote = getUserVote(item.reportVotes, userId);
          return (
            <Card
              style={styles.card}
              onPress={() => navigation.navigate('ReportDetail', { report: item })}
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
  vote: {

  }

})