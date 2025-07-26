import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Menu, } from 'react-native-paper';
import { fetchAssignedReports, updateReportStatus } from '../../services/reportService';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const statusLabels = {
    open: 'Függőben',
    in_progress: 'Folyamatban',
    rejected: 'Elutasítva',
    resolved: 'Megoldva',
};

// Helper – dátumformázás
const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const InstitutionReportsScreen = () => {
    const navigation = useNavigation()
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(null); // index-alapú nyitott dropdown

    const fetchReports = async () => {
        try {
            const data = await fetchAssignedReports();
            setReports(data);
        } catch (error) {
            console.error('Hiba a jelentések lekérdezésekor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reportId, currentStatus, newStatus) => {
        if (newStatus === currentStatus) return;

        try {
            await updateReportStatus(reportId, currentStatus, newStatus);
            fetchReports(); // újratöltés
        } catch (error) {
            console.error('Hiba státuszváltáskor:', error);
            Alert.alert('Hiba', 'Nem sikerült módosítani a státuszt.');
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#6BAEA1" />;
    }

    const renderReport = ({ item, index }) => (

        <Card style={styles.card} key={item.id}>
            <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
                <Text style={styles.label}>Bejelentő: {item.user?.username || 'Ismeretlen'}</Text>
                <Text style={styles.label}>Kategória: {item.category?.categoryName || '-'}</Text>
                <Text style={styles.label}>Aktuális státusz: {statusLabels[item.status]}</Text>
            </Card.Content>

            {/* Státusz dropdown */}
            <Card.Actions>
                <Menu
                    visible={menuVisible === index}
                    onDismiss={() => setMenuVisible(null)}
                    anchor={
                        <Button onPress={() => setMenuVisible(index)}>
                            Státusz módosítása
                        </Button>
                    }
                >
                    {Object.keys(statusLabels).map(statusKey => (
                        <Menu.Item
                            key={statusKey}
                            onPress={() => {
                                handleStatusChange(item.id, item.status, statusKey);
                                setMenuVisible(null);
                            }}
                            title={statusLabels[statusKey]}
                        />
                    ))}
                </Menu>
            </Card.Actions>

            {/* Státusztörténet */}
            {item.statusHistories?.length > 0 && (
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Státusztörténet:</Text>
                    {item.statusHistories
                        .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                        .map((history) => (
                            <View key={history.id} style={styles.historyItem}>
                                <Text style={styles.historyText}>
                                    [{formatDate(history.changedAt)}] {statusLabels[history.statusId] || history.statusId}
                                    {' '}– {history.setByUser?.username || 'Ismeretlen'}
                                    {history.comment ? ` – megjegyzés: "${history.comment}"` : ''}
                                </Text>
                            </View>
                        ))}
                </View>
            )}
        </Card>



    );

    return (
        


            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                renderItem={renderReport}
                style={styles.container}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                            <Text style={styles.backText}>Intézményem bejelentései</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
    );
};

export default InstitutionReportsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

        paddingTop: 32,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAF8'
    },
    list: {
        backgroundColor: '#FAFAF8',
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    label: {
        marginTop: 4,
        color: '#444',
    },
    historyContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 4,
    },
    historyTitle: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    historyItem: {
        marginTop: 4,
    },
    historyText: {
        fontSize: 13,
        color: '#555',
    },
});
