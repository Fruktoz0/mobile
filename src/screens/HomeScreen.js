import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native'
import { Filter, Share2, Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { getAllNews, getAllInstitutions } from '../services/homeService';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';


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
      console.log("Hírek betöltése sikertelen:", err);
    } finally {
      setLoadingNews(false);
    }
  }
  // Intézmények betöltése
  const loadInstitutions = async () => {
    setLoadingInst(true);
    try {
      const instData = await getAllInstitutions();
      setInstitutions([{ id: 'all', name: "Összes", logo: "" }, ...instData]);
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


  const filtered = useMemo(() => {
    if (activeInst === "all") return news;
    return news.filter((r) => r.institutionId === activeInst);
  }, [activeInst, news]);


  return (

    <View style={styles.container}>
      {/* fejléc */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>Hírek és információk</Text>
        </View>

        {/* intézmény csík + szűrő */}
        <View style={styles.stripRow}>
          <View>
            <TouchableOpacity onPress={() => console.log('Open filter')} style={styles.filterBtn}>
              <Filter size={20} />
            </TouchableOpacity>
          </View>
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


      {/* lista */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        refreshing={loadingNews}
        onRefresh={loadNews}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const inst = institutions.find(i => i.id === item.institutionId);

          return (
            <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('NewsDetails', { id: item.id })}>
              <View style={styles.logoWrap}>
                {inst?.logo ? (
                  <Image source={{ uri: inst.logo }} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoPlaceholderText}>TV</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.cardInst}>{inst?.name ?? "Intézmény"}</Text>
                <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.cardExcerpt}>{item.excerpt}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => console.log("Share", item.id)} style={styles.iconBtn}>
                  <Share2 size={18} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {user &&(user.role === "admin" || user.role === "institution") && (
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
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 3,
    padding: 15,
    alignItems: "center",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,

  },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: "hidden"
  },

  logo: {
    width: "100%",
    height: "100%"
  },

  logoPlaceholder: {
    flex: 1,
    backgroundColor: "#E6F2F0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholderText: { color: "#0E7E7E", fontWeight: "700" },

  cardBody: {
    flex: 1
  },

  cardInst: {
    color: "#4B5563",
    fontSize: 12,
    marginBottom: 2
  },

  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },

  cardExcerpt: { fontSize: 13, color: "#4B5563", marginTop: 4 },

  cardFooter: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardDate: {
    color: "#6B7280",
    fontSize: 12
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0E7E7E"
  },

  cardActions: {
    height: 120,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
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

})