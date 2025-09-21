import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import { useState } from 'react'
import { Plus, Star, Lock } from 'lucide-react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { API_URL } from '../config/apiConfig'
import { getAllActiveChallenges, unlockChallenge } from '../services/challengeService'
import { getUserProfile } from '../services/profileService'
import { useCallback } from 'react'
import { getErrorMessage } from '../utils/getErrorMessage'

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([])
  const [loadingChallenges, setLoadingChallenges] = useState(false)
  const [user, setUser] = useState(null)

  const navigation = useNavigation()

  const loadUser = async () => {
    const user = await getUserProfile()
    setUser(user)
  }

  const loadChallenges = async () => {
    setLoadingChallenges(true)
    try {
      const challengesData = await getAllActiveChallenges()
      setChallenges(challengesData)
    } catch (err) {
      console.log("Kihívások betöltése sikertelen:", err)
    } finally {
      setLoadingChallenges(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadUser()
      loadChallenges()
    }, [])
  )

  const handleChallengePress = (item) => {
    if (!user) {
      Alert.alert("Bejelentkezés szükséges", "Kérlek jelentkezz be a kihívás megnyitásához.")
      return
    }

    const userStatus = item.userChallenges?.[0]?.status
    const unlockedStatuses = ["unlocked", "pending", "approved", "rejected"]
    const isUnlocked = unlockedStatuses.includes(userStatus)

    // ha még nincs unlock
    if (!isUnlocked) {
      Alert.alert(
        "Megvásárlás megerősítése",
        `Biztosan megveszed ezt a kihívást ${item.costPoints} pontért?`,
        [
          { text: "Mégse", style: "cancel" },
          {
            text: "Igen",
            onPress: async () => {
              try {
                const result = await unlockChallenge(item.id)
                Alert.alert("Siker!", result.message)
                setUser({ ...user, points: result.currentPoints })
                loadUser()
                navigation.navigate('ChallengeDetail', { 
                  userChallenge: { ...item, status: "unlocked", challengeId: item.id } 
                })
              } catch (err) {
                Alert.alert("Hiba", getErrorMessage(err))
              }
            }
          }
        ]
      )
      return
    }

    // ha már unlockolta (unlocked, pending, approved, rejected)
    navigation.navigate('ChallengeDetail', { 
      userChallenge: { ...item, status: userStatus, challengeId: item.id } 
    })
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loadingChallenges}
        onRefresh={loadChallenges}
        renderItem={({ item }) => {
          const userStatus = item.userChallenges?.[0]?.status
          const unlockedStatuses = ["unlocked", "pending", "approved", "rejected"]
          const isUnlocked = unlockedStatuses.includes(userStatus)

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleChallengePress(item)}
            >
              <View style={styles.imageWrapper}>
                <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.image} />

                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>

                {!isUnlocked && (
                  <View style={styles.lockOverlay}>
                    <Lock size={40} color="#fff" />
                    <Text style={styles.lockText}>{item.costPoints}p</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardContent}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateText}>
                    Start: {new Date(item.startDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.dateText}>
                    End: {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>

                <View style={styles.descRow}>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.rewardRow}>
                    <Star size={16} color="#FFD700" />
                    <Text style={styles.rewardText}>+{item.rewardPoints}p</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      {(user && (user.role === "admin" || user.role === "institution")) && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("NewChallenge")}
        >
          <Plus size={24} color="#6BAEA1" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default ChallengesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 10,
    marginTop: 40,
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
    marginBottom: 6,
    color: '#333',
    textTransform: 'uppercase',
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
})
