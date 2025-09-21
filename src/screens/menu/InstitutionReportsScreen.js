import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Image, TextInput } from 'react-native';
import { Card, IconButton, Menu } from 'react-native-paper';
import { fetchAssignedReports, updateReportStatus } from '../../services/reportService';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../../config/apiConfig';


const statusMap = {
    open: { label: "Nyitott", color: "#6B7280" },
    accepted: { label: "Elfogadva", color: "#1976D2" },
    in_progress: { label: "Folyamatban", color: "#8E24AA" },
    forwarded: { label: "Továbbítva", color: "#64B5F6" },
    resolved: { label: "Megoldva", color: "#388E3C" },
    reopened: { label: "Újranyitva", color: "#F57C00" },
    rejected: { label: "Elutasítva", color: "#D32F2f" }
};


const InstitutionReportsScreen = () => {
    const navigation = useNavigation()
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('')
    const [refreshing, setRefreshing] = useState(false); // pull to refresh állapot
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);


    const fetchReports = async () => {
        try {
            const data = await fetchAssignedReports();
            setReports(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);


    //pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchReports();
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


    if (loading) {
        return <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#6BAEA1" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                        <Text style={styles.backText}>Bejelentések</Text>
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
                            <Menu.Item
                                onPress={() => {
                                    setSelectedStatus(null);
                                    setMenuVisible(false);
                                }}
                                title="Összes"
                                titleStyle={{ fontSize: 14 }}
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
                    (!selectedStatus || report.status === setSelectedStatus) &&
                    (
                        report.title.toLowerCase().includes(searchText.toLowerCase()) ||
                        report.description.toLowerCase().includes(searchText.toLowerCase())
                    )

                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
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
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <View style={{ alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: 13, color: '#333' }}>
                                            {statusMap[item.status]?.label}
                                        </Text>
                                        <View style={{
                                            height: 2,
                                            width: '60%',
                                            backgroundColor: statusMap[item.status]?.color,
                                            marginTop: 2,
                                            borderRadius: 2,
                                        }} />
                                    </View>

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
    );
};

export default InstitutionReportsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF8',
    },
    header: {
        marginTop: 28,
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
        marginTop: -8, // opcionális, ha közelebb akarom hozni
    },
    address: {
        fontSize: 12,
        color: '#555',
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

});
