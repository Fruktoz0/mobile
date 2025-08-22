import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react-native'
import { getAllActiveChallenges } from '../services/challengeService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native'



const ChallengesScreen = () => {

  const [challenges, setChallenges] = useState([])
  const [loadingChallenges, setLoadingChallenges] = useState(false)
  const [user, setUser] = useState(null);

  const navigation = useNavigation();

  //Felhasználó lekérése
  const loadUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  };

  const loadChallenges = async () => {
    setLoadingChallenges(true);
    try {
      const challengesData = await getAllActiveChallenges();
      setChallenges(challengesData);
    } catch (err) {
      console.log("Kihívások betöltése sikertelen:", err);
    } finally {
      setLoadingChallenges(false);
    }
  }

  useEffect(() => {
    loadUser();
    loadChallenges()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loadingChallenges}
        onRefresh={loadChallenges}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ChallengeDetail', { challenge: item })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>
                {item.description.length > 120
                  ? `${item.description.slice(0, 120)}…`
                  : item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}

      />

      {/* Admin/Institution kihívás hozzáadása gomb */}
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
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  category: {
    fontSize: 12,
    color: '#6BAEA1',
    marginBottom: 6,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
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
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});