import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native'
import { Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { getAllNews, getAllInstitutions } from '../services/homeService';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { registerForPushNotificationsAsync } from "../services/notificationService";
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { API_URL } from '../config/apiConfig';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeInst, setActiveInst] = useState("all");
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [loadingInst, setLoadingInst] = useState(false);
  const [user, setUser] = useState(null);

  //Felhasználó lekérése
  const loadUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  };

  // Hírek betöltése
  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const newsData = await getAllNews();
      setNews(newsData);
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingNews(false);
    }
  }
  // Intézmények betöltése
  const loadInstitutions = async () => {
    setLoadingInst(true);
    try {
      const instData = await getAllInstitutions();
      setInstitutions([{ id: 'all', name: "Összes", logoUrl: "" }, ...instData]);
    } catch (err) {
      console.log("Intézmények betöltése sikertelen:", err);
    } finally {
      setLoadingInst(false);
    }
  }

  useEffect(() => {
    loadUser();
    loadNews();
    loadInstitutions();
  }, []);

  // Felhasználó változására regisztráció a push értesítésekre
  useEffect(() => {
    if (user && user.id) {
      registerForPushNotificationsAsync();
    }
  }, [user]);

  // Értesítések kezelése
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground push!', remoteMessage);

      if (remoteMessage.notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data,
          },
          trigger: null, // azonnal megjelenik
        });
      }
    });

    return unsubscribe;
  }, []);

  // Szűrés az aktív intézmény alapján
  const filtered = useMemo(() => {
    if (activeInst === "all") return news;
    return news.filter((r) => r.institutionId === activeInst);
  }, [activeInst, news]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>Hírek és információk</Text>
        </View>

        <View style={styles.stripRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stripContent}>
            {institutions.map(inst => {
              const active = activeInst === inst.id;
              return (
                <TouchableOpacity
                  key={inst.id}
                  onPress={() => setActiveInst(inst.id)}
                  style={[styles.stripItem, active && styles.stripItemActive]}
                >
                  <Text style={[styles.stripText, active && styles.stripTextActive]}>{inst.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        refreshing={loadingNews}
        onRefresh={loadNews}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const inst = institutions.find(i => i.id === item.institutionId);

          return (
            <TouchableOpacity style={styles.card} activeOpacity={0.8}
              onPress={() => navigation.navigate('NewsDetails', { id: item.id })}>

              <View style={styles.cardHeader}>
                <View style={styles.logoWrap}>
                  <Image
                    source={
                      inst?.logoUrl
                        ? { uri: inst?.logoUrl }
                        : require("../../assets/images/image_placeholder.png")
                    }
                    style={styles.logo} />
                </View>
                <Text style={styles.cardInst}>{inst?.name ?? "Intézmény"}</Text>
              </View>
              <View style={styles.cardContent}>
                {item.imageUrl && (
                  <Image source={{ uri: `${API_URL}/${item.imageUrl}` }} style={styles.newsImage} />
                )}
                <View style={styles.textBlock}>
                  <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
                  <Text numberOfLines={2} style={styles.cardExcerpt}>{item.content}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.cardDate}>
                  {new Date(item.createdAt).toLocaleString("hu-HU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}

        ListEmptyComponent={
          !loadingNews ? (
            <Text style={{ textAlign: 'center', marginTop: 24, color: '#666' }}>
              Nincs megjeleníthető hír.
            </Text>
          ) : null
        }
      />

      {user && (user.role === "admin" || user.role === "institution") && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddNews")}
        >
          <Plus size={24} color="#6BAEA1" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7"
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "black",
    fontSize: 22,
    fontWeight: "500",
  },
  headerRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 8,
  },
  stripRow: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  stripContent: {
    paddingRight: 44,
    gap: 8
  },
  stripItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#f6f7f7",
  },
  stripItemActive: {
    backgroundColor: "#dff1ed"
  },
  stripText: {
    color: "black",
    fontWeight: "400"
  },
  stripTextActive: {
    color: "#0E7E7E"
  },
  filterBtn: {
    marginRight: 8,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 24
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  logoWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  logo: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  textBlock: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardExcerpt: {
    fontSize: 13,
    color: "#4B5563",
  },
  cardFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cardDate: {
    fontSize: 12,
    color: "#9CA3AF",
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
});
