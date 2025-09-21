import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, TextInput } from 'react-native'
import { useState } from 'react'
import { Plus, Star, Lock } from 'lucide-react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { API_URL } from '../../config/apiConfig'
import { getAssignedChallenges, } from '../../services/challengeService'
import { getUserProfile } from '../../services/profileService'
import { useCallback } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker';
import { IconButton, Menu } from 'react-native-paper';

const InstitutionChallengesScreen = () => {
    const [challenges, setChallenges] = useState([])
    const [loadingChallenges, setLoadingChallenges] = useState(false)
    const [user, setUser] = useState(null)
    const [refreshing, setRefreshing] = useState(false); // pull to refresh állapot
    const [searchText, setSearchText] = useState('')
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const navigation = useNavigation()

    const loadUser = async () => {
        const user = await getUserProfile()
        setUser(user)
    }

    const statusMap = {
        inactive: { label: "Inaktív", color: "#6B7280" },
        archived: { label: "Archivált", color: "#1976D2" },
        active: { label: "Aktív", color: "#388E3C" },
    };

    const loadAssignedChallenges = async () => {
        setLoadingChallenges(true)
        try {
            const challengesData = await getAssignedChallenges()
            setChallenges(challengesData)
        } catch (err) {
            console.log("Kihívások betöltése sikertelen:", err)
        } finally {
            setLoadingChallenges(false)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        loadAssignedChallenges();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadUser()
            loadAssignedChallenges()
        }, [])
    )

    const handleChallengePress = (item) => {
        if (!user) {
            Alert.alert("Bejelentkezés szükséges", "Kérlek jelentkezz be a kihívás megnyitásához.")
            return
        }

        const userStatus = item.userChallenges?.[0]?.status

        navigation.navigate('ChallengeDetail', {
            userChallenge: { ...item, status: userStatus, challengeId: item.id }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                        <Text style={styles.backText}>Intézmény kihívásai</Text>
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
                data={challenges.filter(challenges =>
                    (!selectedStatus || challenges.status === setSelectedStatus) &&
                    (
                        challenges.title.toLowerCase().includes(searchText.toLowerCase()) ||
                        challenges.description.toLowerCase().includes(searchText.toLowerCase())
                    )

                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
                        Nincs a szűrésnek megfelelő kihívás az intézményednél
                    </Text>
                }
                keyExtractor={(item) => item.id.toString()}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderItem={({ item }) => {
                    const userStatus = item.userChallenges?.[0]?.status

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

export default InstitutionChallengesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF8',
        padding: 10,
        paddingTop: 10,
    },
    header: {
        marginTop: 8,
        marginBottom: 20,
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
