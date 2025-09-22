import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, TextInput, Divider, ActivityIndicator } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { pickImage } from '../services/reportService';
import { getAllInstitutions } from '../services/homeService';
import { createChallenge } from '../services/challengeService';
import { Picker } from '@react-native-picker/picker';
import { Upload } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width: screenWidth } = Dimensions.get('window');

const NewChallengeScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [costPoints, setCostPoints] = useState('');
    const [rewardPoints, setRewardPoints] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [institutionId, setInstitutionId] = useState('');
    const [institutions, setInstitutions] = useState([]);
    const [user, setUser] = useState(null);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [loading, setLoading] = useState(false);

    //Felhasználó lekérése
    const loadUser = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            return (decoded);
        }
    };

    useEffect(() => {
        const load = async () => {
            const userData = await loadUser();
            if (userData) {
                setUser(userData);
                if (userData.role === 'institution') {
                    setInstitutionId(userData.institutionId);
                }
            }
            getAllInstitutions().then(setInstitutions);
        };
        load();
    }, []);

    // Kép törlés
    const handleDeleteImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setSelectedImageIndex(0);
    };

    // Beküldés
    const handleSubmit = async () => {
        try {
            setLoading(true);
            await createChallenge({
                title,
                description,
                costPoints,
                rewardPoints,
                category,
                startDate,
                endDate,
                institutionId,
                image: images.length > 0 ? images[0].uri : null
            });
            navigation.goBack();
        } catch (err) {
            console.error("Kihívás beküldés hiba:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const formValid =
        title &&
        description &&
        institutionId &&
        (user?.role === "institution" || (user?.role === "admin" && institutionId)) &&
        images.length > 0;

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            extraScrollHeight={20}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView style={styles.container}>
                {/* Drag&Drop kinézet */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        style={styles.dragDropBox}
                        onPress={() => pickImage(images, setImages)}
                    >
                        {images.length > 0 ? (
                            <Image
                                source={{ uri: images[selectedImageIndex].uri }}
                                style={styles.largePreview}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                <Upload size={32} color="#6BAEA1" />
                                <Text style={styles.dragDropText}>Válaszd ki a képet</Text>
                            </View>

                        )}
                    </TouchableOpacity>

                    {images.length > 0 && (
                        <TouchableOpacity
                            style={styles.deleteIcon}
                            onPress={() => handleDeleteImage(selectedImageIndex)}
                        >
                            <MaterialCommunityIcons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                    )}
                </View>

                <Divider style={styles.divider} />

                <TextInput
                    label="Kihívás címe"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={styles.input}
                    outlineColor="rgba(107, 174, 161, 0.3)"
                    theme={{ colors: { primary: '#6db2a1' } }}
                />

                <TextInput
                    label="Leírás"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    outlineColor="rgba(107, 174, 161, 0.3)"
                    multiline
                    style={styles.inputDescription}
                    theme={{ colors: { primary: '#6db2a1' } }}
                />

                <TextInput
                    label="Költség pontban"
                    value={costPoints}
                    onChangeText={setCostPoints}
                    keyboardType="numeric"
                    mode="outlined"
                    outlineColor="rgba(107, 174, 161, 0.3)"
                    style={styles.input}
                    theme={{ colors: { primary: '#6db2a1' } }}
                />

                <TextInput
                    label="Jutalom pontban"
                    value={rewardPoints}
                    onChangeText={setRewardPoints}
                    keyboardType="numeric"
                    mode="outlined"
                    outlineColor="rgba(107, 174, 161, 0.3)"
                    style={styles.input}
                    theme={{ colors: { primary: '#6db2a1' } }}
                />

                <TextInput
                    label="Kategória"
                    value={category}
                    onChangeText={setCategory}
                    mode="outlined"
                    outlineColor="rgba(107, 174, 161, 0.3)"
                    style={styles.input}
                    theme={{ colors: { primary: '#6db2a1' } }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* Kezdés dátuma */}
                    <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePicker}>
                        <Text>Start: {startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            onChange={(e, date) => {
                                setShowStartPicker(false);
                                if (date) setStartDate(date);
                            }}
                        />
                    )}

                    {/* Befejezés dátuma */}
                    <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePicker}>
                        <Text>End: {endDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            onChange={(e, date) => {
                                setShowEndPicker(false);
                                if (date) setEndDate(date);
                            }}
                        />
                    )}

                </View>


                {user?.role === "admin" && (
                    <View style={[styles.input, styles.pickerContainer]}>
                        <Picker
                            selectedValue={institutionId}
                            onValueChange={(val) => setInstitutionId(val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Válassz intézményt..." value="" />
                            {institutions.map((inst) => (
                                <Picker.Item key={inst.id} label={inst.name} value={inst.id} />
                            ))}
                        </Picker>
                    </View>
                )}

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    disabled={!formValid || loading}
                >
                    {loading ? <ActivityIndicator animating color="#fff" /> : 'Kihívás létrehozása'}
                </Button>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

export default NewChallengeScreen;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAF8',
        padding: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    dragDropBox: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#6BAEA1',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dragDropText: {
        color: '#6BAEA1',
        marginTop: 12,
        fontSize: 14,
    },
    largePreview: {
        width: '100%',
        height: screenWidth * 0.5,
        borderRadius: 12,
    },
    deleteIcon: {
        position: 'absolute',
        top: 10,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff',
        borderColor: 'rgba(107, 174, 161, 0.3)',
    },
    inputDescription: {
        height: 120,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    divider: {
        marginVertical: 12,
        height: 1,
        backgroundColor: '#ccc',
    },
    datePicker: {
        borderWidth: 1,
        borderColor: 'rgba(107,174,161,0.3)',
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#6BAEA1',
        marginTop: 20,
        height: 50,
        justifyContent: 'center',
        borderRadius: 8,
    },
});
