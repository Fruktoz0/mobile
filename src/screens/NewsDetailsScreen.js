import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { API_URL } from '../config/apiConfig'
import { Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react';
import { getNewsById } from '../services/homeService';


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

    if(!news) return <Text>Betöltés...</Text>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                    <Text style={styles.backText}>Vissza</Text>
                </TouchableOpacity>
            </View>
            {news.imageUrl ? (
                <Image
                    source={{ uri: `${API_URL}/${news.imageUrl}` }}
                    style={styles.image}
                />
            ) : news.institution?.logoUrl ? (
                <Image
                    source={{ uri: `${API_URL}${news.institution.logoUrl}` }}
                    style={styles.image}
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
            <Text style={styles.title}>{news.title}</Text>
            <Text style={styles.date}>Létrehozva: {new Date(news.createdAt).toLocaleString('hu-HU')}</Text>
            <Text style={styles.section}>Leírás:</Text>
            <Text style={styles.description}>{news.content}</Text>
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        color: 'black',
        marginLeft: 8,
    },
    header: {
        paddingTop: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    date: {
        color: '#666',
        marginBottom: 12,
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
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#009688',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monogramText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },


})