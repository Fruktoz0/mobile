import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '../config/apiConfig';

const ReportSuccessScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { newBadges = [] } = route.params || {};

    const [showConfetti, setShowConfetti] = useState(true);

    return (
        <View style={styles.container}>
            {newBadges.length > 0 && (
                <>
                    <Text style={styles.title}>🎉 Gratulálunk! Új jelvényt szereztél!</Text>
                    {newBadges.map((badge) => (
                        <View key={badge.id} style={styles.badgeWrap}>
                            <Image source={{ uri: `${API_URL}${badge.iconUrl}` }} style={styles.badgeImage} />
                            <Text style={styles.badgeTitle}>{badge.title}</Text>
                            <Text style={styles.badgeDesc}>{badge.description}</Text>
                            <Text style={styles.badgeDate}>
                                {new Date(badge.earnedAt).toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </>
            )}

            {showConfetti && (
                <ConfettiCannon
                    count={200}
                    origin={{ x: -10, y: 0 }}
                    fadeOut={true}
                    onAnimationEnd={() => setShowConfetti(false)}
                />
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('MyBadges')}
            >
                <Text style={styles.buttonText}>Jelvényeim megtekintése</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ReportSuccessScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    },
    badgeWrap: {
        alignItems: 'center',
        marginVertical: 12
    },
    badgeImage: {
        width: 80,
        height: 80,
        marginBottom: 8
    },
    badgeTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    badgeDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    },
    badgeDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 4
    },
    button: {
        marginTop: 24,
        backgroundColor: '#009688',
        padding: 12,
        borderRadius: 8
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
});
