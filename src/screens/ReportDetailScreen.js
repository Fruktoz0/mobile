import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { API_URL } from '../config/apiConfig'
import { Image, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Button, Divider } from 'react-native-paper'
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { MapLibreGL } from '../config/mapConfig';

import * as Location from 'expo-location';
import { useState, useEffect } from 'react'

const ReportDetailScreen = ({ route }) => {
    const { report } = route.params;

    const navigation = useNavigation()
    const { width } = Dimensions.get('window');
    const [streetName, setStreetName] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchAddress = async () => {
            if (report?.locationLat && report?.locationLng) {
                try {
                    const [address] = await Location.reverseGeocodeAsync({
                        latitude: Number(report.locationLat),
                        longitude: Number(report.locationLng),
                    });
                    setStreetName(address?.street || "Ismeretlen utca");
                } catch (error) {
                    console.error("Geocoding hiba:", error);
                }
            }
        };

        fetchAddress();
    }, [report]);

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
                    data={report.reportImages}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: `${API_URL}${item.imageUrl}` }}
                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        />
                    )}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
                    {report.reportImages.map((_, i) => (
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
                    <Text>{report.status}</Text>
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
})