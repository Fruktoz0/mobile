import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { API_URL } from '../config/apiConfig'
import { Image, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { List, Avatar, Button } from 'react-native-paper'
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

const ReportDetailScreen = ({ route }) => {
    const { report } = route.params;

    const navigation = useNavigation()
    const { width } = Dimensions.get('window');
    const progress = useSharedValue(0);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                    <Text style={styles.backText}>Bejelentés részletei</Text>
                </TouchableOpacity>
            </View>
            <View style={{ overflow: 'hidden', borderRadius: 10 }}>
                <Carousel
                    width={width}
                    height={250}
                    data={report.reportImages}
                    onProgressChange={progress}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: `${API_URL}${item.imageUrl}` }}
                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        />
                    )}
                />

                <Pagination.Basic
                    progress={progress}
                    data={report.reportImages}
                    dotStyle={{
                        marginTop: 8,
                        width: 20,             
                        height: 4,              
                        borderRadius: 2,        
                        marginHorizontal: 3,
                        backgroundColor: '#009688', // aktív szín
                    }}
                    inactiveDotStyle={{
                        backgroundColor: '#ffffffaa',   // szürkésebb inaktív
                    }}
                />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Avatar.Image
                        size={32}
                        source={
                            report?.user?.avatarStyle && report?.user?.avatarSeed
                                ? { uri: `https://api.dicebear.com/9.x/${report.user.avatarStyle}/png?seed=${report.user.avatarSeed}` }
                                : require('../../assets/images/avatar_placeholder.jpg')
                        }
                    />
                <Text style={{ marginLeft: 5 }}>{report.user?.username || 'Név nélkül'}</Text>
            </View>
            <View>
                <Text style={styles.date}>{new Date(report.createdAt).toLocaleString('hu-HU')}</Text>
            </View>
            <Text style={styles.title}>{report.title}</Text>

            <Text style={styles.section}>Leírás:</Text>
            <Text style={styles.description}>{report.description}</Text>
            <Text style={styles.section}>Helyszín:</Text>
            <Text>{report.city}, {report.zipCode}, {report.address}</Text>
            <Text style={styles.section}>Kategória:</Text>
            <Text style={styles.category}>{report.category.categoryName || 'Nincs kategória'}</Text>

        </ScrollView>
    )
}

export default ReportDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
        paddingTop: 20,
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    date: {
        color: '#666',
        marginBottom: 12,
        fontSize: 12,
    },
    section: {
        marginTop: 16,
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {
        fontSize: 14,
        marginTop: 4,
    },
    category: {
        fontSize: 14,
        marginTop: 4,


    },
})