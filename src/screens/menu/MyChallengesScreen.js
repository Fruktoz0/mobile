import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TextInput } from 'react-native'
import { useState } from 'react'
import { IconButton, Menu } from 'react-native-paper';
import { Star } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { API_URL } from '../../config/apiConfig'
import { getMyChallenges } from '../../services/challengeService'
import { getUserProfile } from '../../services/profileService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'


const MyChallengesScreen = () => {

  const [challenges, setChallenges] = useState([])
  const [loadingChallenges, setLoadingChallenges] = useState(false)
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('')
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const navigation = useNavigation();

  //Felhasználó lekérése
  const loadUser = async () => {
    const user = await getUserProfile()
    setUser(user);
  };

  const statusMap = {
    expired: { label: "Lejárt", color: "#6B7280", },
    unlocked: { label: "Feloldva", color: "#1976D2", },
    approved: { label: "Jóváhagyott", color: "#388E3C", },
    pending: { label: "Jóváhagyásra vár", color: "#F57C00", },
    rejected: { label: "Elutasítva", color: "#D32F2f", }
  };

  const loadChallenges = async () => {
    setLoadingChallenges(true);
    try {
      const challengesData = await getMyChallenges();
      setChallenges(challengesData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingChallenges(false);
    }
  }

  // Státusz mapping
  const statusLabels = {
    unlocked: { label: "Feloldva", color: "#4A90E2" },
    pending: { label: "Elbírálás alatt", color: "#F39C12" },
    approved: { label: "Jóváhagyva", color: "#27AE60" },
    rejected: { label: "Elutasítva", color: "#E74C3C" },
    expired: { label: "Lejárt", color: "#7F8C8D" },
  };

  useFocusEffect(
    useCallback(() => {
      loadUser();
      loadChallenges()
    }, [])
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
            <Text style={styles.backText}>Intézmény feloldott kihívásai</Text>
          </TouchableOpacity>
        </View>


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
        data={challenges.filter(item =>
          (!selectedStatus || item.status === selectedStatus) &&
          (
            item.challenge.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.challenge.description.toLowerCase().includes(searchText.toLowerCase())
          )

        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loadingChallenges}
        onRefresh={loadChallenges}
        ListEmptyComponent={
          !loadingChallenges && (
            <Text style={styles.emptyText}>Még nem oldottál fel kihívást</Text>
          )
        }
        renderItem={({ item }) => {


          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ChallengeDetail', { userChallenge: item })}
            >
              <View style={styles.imageWrapper}>
                <Image source={{ uri: `${API_URL}${item.challenge.image}` }} style={styles.image} />

                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.challenge.category}</Text>
                </View>


              </View>

              <View style={styles.cardContent}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateText}>
                    Kezdés: {new Date(item.challenge.startDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.dateText}>
                    Lejárat: {new Date(item.challenge.endDate).toLocaleDateString()}
                  </Text>
                </View>

                <Text style={styles.title}>{item.challenge.title}</Text>

                <View style={styles.descRow}>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.challenge.description}
                  </Text>
                  <View style={styles.rewardRow}>
                    <Star size={16} color="#FFD700" />
                    <Text style={item.challenge.rewardText}>+{item.challenge.rewardPoints}p</Text>
                  </View>
                </View>
                <View>
                  <Text style={[styles.statusText, { color: statusLabels[item.status]?.color }]}>
                    {statusLabels[item.status]?.label || item.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default MyChallengesScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  header: {
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // hogy legyen hely a kereső alatt
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
    color: 'black',
    flex: 1,
    textAlign: 'center',
    marginLeft: 0,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#6BAEA1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  cardContent: {
    padding: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  descRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  description: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginRight: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 46,
    height: 46,
    borderRadius: 28,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statusText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#4A90E2",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
    fontWeight: "500",
  }


});