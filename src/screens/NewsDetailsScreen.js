import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { API_URL } from '../config/apiConfig'
import { Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react';
import { getNewsById, } from '../services/homeService';
import { Divider } from 'react-native-paper';


const NewsDetailsScreen = ({ route }) => {
    const { id } = route.params;
    const [news, setNews] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsData = await getNewsById(id);

                setNews(newsData);
            } catch (error) {
                console.error('Hiba történt a hír lekérdezése során:', error);
            }
        };

        fetchNews();
    }, [id]);

    if (!news) return <Text>Betöltés...</Text>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                    <Text style={styles.backText}>Vissza</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.imageWrapper}>

                {news.imageUrl ? (
                    <Image
                        source={{ uri: `${API_URL}/${news.imageUrl}` }}
                        style={styles.image}
                        resizeMode='cover'
                    />
                ) : news.institution?.logoUrl ? (
                    <Image
                        source={{ uri: news.institution.logoUrl }}
                        style={[styles.image]}
                        resizeMode='contain'
                    />
                ) : (
                    <View style={styles.monogramContainer}>
                        <Text style={styles.monogramText}>
                            {news.institution?.name
                                ?.split(" ")
                                .slice(0, 2)
                                .join(" ")
                                || "?"}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.contentBox}>
                <View style={styles.institutionRow}>
                    {news.institution?.logoUrl && (
                        <Image source={{ uri: news.institution.logoUrl }} style={styles.institutionLogo} />
                    )}
                    <Text style={styles.institutionName}>{news.institution?.name}</Text>
                </View>
                <Divider style={{ backgroundColor: "rgba(0,0,0,0.1)", marginBottom: 30 }} />

                <Text style={styles.title}>{news.title}</Text>
                <Text style={styles.section}>Leírás:</Text>
                <Text style={styles.description}>{news.content}</Text>
                <Text style={styles.date}>
                    {new Date(news.createdAt).toLocaleString("hu-HU")}
                </Text>
            </View>
        </ScrollView>
    )
}

export default NewsDetailsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FAFAF8',
    },
    header: {
        marginTop: 10,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        marginLeft: 4,
        paddingEnd: 16,
        color: 'black',
        flex: 1,
        textAlign: 'center',
        marginLeft: 0,
        marginBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 16,
    },
    date: {
        fontSize: 12,
        alignSelf: "flex-end",
        color: '#666',
        marginTop: 12,
    },
    section: {
        marginTop: 16,
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        fontSize: 14,
        marginTop: 4,
    },
    monogramContainer: {
        width: "100%",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#009688",
    },
    monogramText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    imageWrapper: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        // Shadow iOS
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        // Shadow Android
        elevation: 3,
        borderWidth: 1,
        borderColor: "#eee",
    },
    image: {
        width: "100%",
        height: 200,
    },
    contentBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        height: "88%",
        padding: 16,
        marginTop: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: "#333",
        marginTop: 8,
    },
    institutionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    institutionLogo: {
        width: 24,
        height: 24,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    institutionName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
    },




})