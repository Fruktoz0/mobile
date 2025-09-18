import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { API_URL } from '../config/apiConfig'
import { Image, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Button, Divider, Dialog, Portal, TextInput } from 'react-native-paper'
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { MapLibreGL } from '../config/mapConfig';
import { getReportById } from '../services/reportService'
import * as Location from 'expo-location';
import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getStatusHistory } from '../services/reportService'
import { updateReportStatus } from '../services/reportService'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const ReportDetailScreen = ({ route }) => {
    const navigation = useNavigation();

    const { reportId } = route.params;
    const [report, setReport] = useState(null)
    const { width } = Dimensions.get('window');
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true)
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [userRole, setUserRole] = useState(null)
    const [statusHistory, setStatusHistory] = useState([]);
    const [newStatus, setNewStatus] = useState(null)
    const [comment, setComment] = useState(null)


    const statusMap = {
        open: { label: "Nyitott", color: "#6B7280" },
        accepted: { label: "Elfogadva", color: "#1976D2" },
        in_progress: { label: "Folyamatban", color: "#8E24AA" },
        forwarded: { label: "Továbbítva", color: "#64B5F6" },
        resolved: { label: "Megoldva", color: "#388E3C" },
        reopened: { label: "Újranyitva", color: "#F57C00" },
        rejected: { label: "Elutasítva", color: "#D32F2f" }
    };

    const loadReport = async () => {
        try {
            const data = await getReportById(reportId);
            setReport(data);
        } catch (error) {
            console.error("Hiba a bejelentés betöltése során:", error);
        } finally {
            setLoading(false)
        }
    };
    const loadReportStatus = async () => {
        try {
            const data = await getStatusHistory(reportId)
            setStatusHistory(data)
        } catch (error) {
            console.error(error)
        }
    }

    // Token dekódolása és userId beállítása
    useEffect(() => {
        const loadUserIdFromToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    console.log('Token dekódolva:', decoded);
                    setUserRole(decoded.role);
                } catch (err) {
                    console.error('Token dekódolási hiba:', err);
                }
            }
        };
        loadUserIdFromToken();
    }, []);

    useEffect(() => {
        loadReport();
        loadReportStatus()
    }, [reportId]);

    if (loading) return <ActivityIndicator size="large" color="#009688" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    if (!report) return <Text>Nem található bejelentés</Text>

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                    <Text style={styles.backText}>Bejelentés részletei</Text>
                </TouchableOpacity>
            </View>
            <View style={{ overflow: 'hidden', }}>
                <Carousel
                    width={width}
                    height={250}
                    data={report.reportImages || []}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: `${API_URL}${item.imageUrl}` }}
                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        />
                    )}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
                    {report?.reportImages?.map((_, i) => (
                        <View
                            key={i}
                            style={{
                                width: 20,
                                height: 4,
                                borderRadius: 2,
                                marginHorizontal: 3,
                                backgroundColor: i === activeIndex ? '#009688' : '#63646582',
                            }}
                        />
                    ))}
                </View>
            </View>
            <View style={{ paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <View>
                        <Avatar.Image
                            size={32}
                            source={
                                report?.user?.avatarStyle && report?.user?.avatarSeed
                                    ? { uri: `https://api.dicebear.com/9.x/${report.user.avatarStyle}/png?seed=${report.user.avatarSeed}` }
                                    : require('../../assets/images/avatar_placeholder.jpg')
                            }
                        />
                    </View>
                    <View style={{ marginLeft: 8 }}>
                        <Text >{report.user?.username || 'Név nélkül'}</Text>
                        <Text style={styles.date}>{new Date(report.createdAt).toLocaleString('hu-HU')}</Text>
                    </View>
                </View>
                <Text style={styles.title}>{report.title}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                    <Text>Beküldő</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>


                    </View>
                </View>
                <Divider />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                    <Text>Város</Text>
                    <Text>{report.city}</Text>
                </View>
                <Divider />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                    <Text>Utca</Text>
                    <Text>{report.address}</Text>
                </View>
                <Divider />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                    <Text>Kategória</Text>
                    <Text style={styles.category}>{report.category.categoryName || 'Nincs kategória'}</Text>
                </View>

                <Divider />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingBottom: 30 }}>
                    <Text>Státusz</Text>
                    <Text style={{ color: statusMap[report.status]?.color }}>{statusMap[report.status]?.label || report.status}</Text>
                </View>
                <Button
                    style={styles.confirmButton}
                    textColor="#6BAEA1"
                    theme={{ colors: { primary: '#6db2a1' } }}
                >Megerősítem</Button>
            </View>
            <View style={{ backgroundColor: '#f0f0f0', paddingVertical: 8, paddingHorizontal: -14 }}>
            </View>
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={styles.section}>Probléma leírása:</Text>
                <Text style={styles.description}>{report.description}</Text>
            </View>

            <View style={styles.mapContainer}>
                {report?.locationLat && report?.locationLng && (
                    <MapLibreGL.MapView
                        style={styles.map}
                        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_KEY}`}
                        logoEnabled={false}
                        compassEnabled={false}
                    >
                        <MapLibreGL.Camera
                            zoomLevel={16}
                            centerCoordinate={[
                                Number(report.locationLng),
                                Number(report.locationLat)
                            ]}
                        />
                        <MapLibreGL.PointAnnotation
                            id="reportLocation"
                            coordinate={[
                                Number(report.locationLng),
                                Number(report.locationLat),
                            ]}
                        />

                    </MapLibreGL.MapView>
                )}
            </View>
            <View style={{ backgroundColor: '#f0f0f0', paddingVertical: 8, paddingHorizontal: -14 }}>
            </View>
            {(userRole === 'admin' || userRole === 'institution') && (
                <Button
                    mode="contained"
                    onPress={() => setStatusMenuVisible(true)}
                    style={{ marginTop: 8, backgroundColor: '#6BAEA1' }}
                >
                    Státusz módosítása
                </Button>
            )}
            {/* Státusz váltás log csak adminnak / intézményi usernek */}
            {(userRole === "admin" || userRole === "institution") && (
                <View style={styles.logContainer}>
                    <Text style={styles.section}>Státuszváltások</Text>
                    {statusHistory.length > 0 ? (
                        statusHistory.map((history, index) => (
                            <View key={index} style={styles.timelineItem}>
                                {/* Timeline marker */}
                                <View style={styles.timelineMarker}>
                                    <View
                                        style={[
                                            styles.timelineDot,
                                            { backgroundColor: statusMap[history.status]?.color },
                                        ]}
                                    />
                                    {index !== statusHistory.length - 1 && (
                                        <View style={styles.timelineLine} />
                                    )}
                                </View>

                                {/* Tartalom */}
                                <View style={styles.timelineContent}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "600",
                                            color: statusMap[history.status]?.color,
                                        }}
                                    >
                                        {statusMap[history.status]?.label}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#444" }}>
                                        {history.changedBy?.username || "Ismeretlen"}
                                    </Text>
                                    <Text style={{ fontSize: 11, color: "#777" }}>
                                        {new Date(history.changedAt).toLocaleString("hu-HU")}
                                    </Text>
                                    {history.comment && (
                                        <Text style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                                            {history.comment}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                            Nincs státuszváltás rögzítve
                        </Text>
                    )}

                </View>
            )}

            <Portal>

                <Dialog
                    visible={statusMenuVisible}
                    onDismiss={() => setStatusMenuVisible(false)}
                    style={{
                        backgroundColor: "#FAFAF8",
                        borderRadius: 12,
                        elevation: 0,
                    }}
                >

                    <Dialog.Title>Státusz módosítása</Dialog.Title>
                    <Dialog.Content>

                        <Text style={{ marginBottom: 8, fontWeight: "600" }}>Válaszd ki az új státuszt:</Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {Object.keys(statusMap).map((key) => {
                                const selected = newStatus === key;
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() => setNewStatus(key)}
                                        style={{
                                            backgroundColor: selected ? statusMap[key].color : "#f2f2f2",
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 16,
                                            margin: 4,
                                        }}
                                    >
                                        <Text style={{ color: selected ? "#fff" : "#333", fontWeight: "500" }}>
                                            {statusMap[key].label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TextInput
                            label="Komment"
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            mode="outlined"
                            outlineColor="rgba(107, 174, 161, 0.3)"
                            style={{ marginTop: 12, backgroundColor: "#fff", borderRadius: 8 }}
                            theme={{
                                colors: {
                                    primary: "#6BAEA1",
                                    text: "#333",
                                    placeholder: "#888",
                                },
                            }}
                        />

                    </Dialog.Content>

                    <Dialog.Actions style={{ justifyContent: "space-between" }}>
                        <Button
                            onPress={() => setStatusMenuVisible(false)}
                            textColor="#555"
                            style={{
                                borderRadius: 8,
                                paddingHorizontal: 20,
                            }}
                        >
                            Mégse
                        </Button>
                        <Button
                            mode="contained"
                            onPress={async () => {
                                try {
                                    await updateReportStatus(reportId, report.status, newStatus, comment);
                                    setStatusMenuVisible(false);
                                    loadReport();
                                    loadReportStatus();
                                } catch (err) {
                                    console.error("Hiba státuszváltáskor:", err);
                                }
                            }}
                            style={{
                                backgroundColor: "#6BAEA1",
                                paddingHorizontal: 20,
                                borderRadius: 8,
                            }}
                            labelStyle={{ color: "#fff", fontWeight: "600" }}
                        >
                            Mentés
                        </Button>
                    </Dialog.Actions>

                </Dialog>

            </Portal>
        </ScrollView>
    )
}

export default ReportDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //padding: 16,
        backgroundColor: '#FAFAF8',
    },
    backButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',

        color: 'black',
        marginLeft: 8,
    },
    header: {
        paddingTop: 36,
        paddingStart: 10,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    date: {
        color: '#666',
        marginBottom: 12,
        fontSize: 10,
    },
    section: {
        marginTop: 16,
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {
        fontSize: 16,
        marginTop: 4,
        marginBottom: 40
    },
    category: {
        fontSize: 14,
        marginTop: 4,
    },
    confirmButton: {
        borderColor: "#6BAEA1",
        borderWidth: 1.5,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 16,
        marginHorizontal: 60
    },
    mapContainer: {
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 32,

    },
    map: {
        flex: 1,
    },

    logContainer: {
        marginTop: 20,
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 1,
    },
    timelineItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    timelineMarker: {
        width: 20,
        alignItems: "center",
        position: "relative",
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        zIndex: 1,
    },
    timelineLine: {
        position: "absolute",
        top: 10,
        width: 2,
        height: "100%",
        backgroundColor: "#E5E7EB",
    },
    timelineContent: {
        flex: 1,
        marginLeft: 8,
    },

})