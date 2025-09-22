import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Button, TextInput, Divider, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { pickImage } from '../../services/reportService';
import { getAllInstitutions } from '../../services/homeService';
import { addNews } from '../../services/homeService';
import { getCurrentUser } from '../../services/authService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width: screenWidth } = Dimensions.get('window');

const AddNewsScreen = ({ navigation }) => {
    const [images, setImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [institutionId, setInstitutionId] = useState('');
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const loadUser = async () => {
        const userData = await getCurrentUser();
        if (userData) {
            setUser(userData);
            if (userData.role === 'institution') {
                setInstitutionId(userData.institutionId);
            }
        }
    }

    // Intézmények betöltése
    useEffect(() => {
        loadUser();
        getAllInstitutions()
            .then(setInstitutions)
            .catch(err => console.error("Hiba az intézmények betöltésekor:", err));
    }, []);

    // Kép törlés
    const handleDeleteImage = (index) => {
        setImages((prev) => {
            const newImgs = prev.filter((_, i) => i !== index);
            if (newImgs.length === 0) setSelectedImageIndex(0);
            else if (index >= newImgs.length) setSelectedImageIndex(newImgs.length - 1);
            else setSelectedImageIndex(index);
            return newImgs;
        });
    };

    // Beküldés
    const handleSubmit = async () => {
        try {
            setLoading(true);
            await addNews({
                title,
                content,
                institutionId,
                image: images.length > 0 ? images[0].uri : null
            });
            setTitle('');
            setContent('');
            setInstitutionId('');
            setImages([]);
            navigation.goBack();
        } catch (err) {
            console.error("Hír beküldés hiba:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const formValid = title &&
        content &&
        institutionId &&
        (
            user?.role === "admin"
                ? institutionId // adminnál kell választani
                : true // institution usernél nem kell plusz ellenőrzés
        );

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            extraScrollHeight={20}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={
                            images.length > 0
                                ? { uri: images[selectedImageIndex].uri }
                                : require('../../../assets/images/image_placeholder.png')
                        }
                        style={styles.largePreview}
                        resizeMode="cover"
                    />

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailsContainer}
                    >
                        {images.map((img, idx) => (
                            <View key={idx} style={styles.thumbnailWrapper}>
                                <TouchableOpacity onPress={() => setSelectedImageIndex(idx)}>
                                    <Image
                                        source={{ uri: img.uri }}
                                        style={[
                                            styles.thumbnail,
                                            idx === selectedImageIndex && styles.selectedThumbnail,
                                        ]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteIcon}
                                    onPress={() => handleDeleteImage(idx)}
                                >
                                    <MaterialCommunityIcons name="close-circle" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <Button
                        mode="outlined"
                        icon="camera"
                        onPress={() => pickImage(images, setImages)}
                        style={styles.imageButton}
                        textColor="#6BAEA1"
                        theme={{ colors: { primary: '#6db2a1' } }}
                    >
                        Kép feltöltése (max 1)
                    </Button>
                    <Text style={styles.optionalNote}>Kép feltöltése nem kötelező</Text>
                </View>

                <Divider style={styles.divider} />

                <View style={{ margin: 16 }}>
                    <TextInput
                        label="Hír címe"
                        value={title}
                        onChangeText={setTitle}
                        mode="outlined"
                        outlineColor="rgba(107, 174, 161, 0.3)"
                        style={[styles.input, { backgroundColor: '#FFFFFF' }]}
                        theme={{ colors: { primary: '#6db2a1' } }}
                    />
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

                    {user?.role === "user" && (
                        <Text style={{ color: "red", textAlign: "center", marginVertical: 20 }}>
                            Nincs jogosultságod hírt beküldeni.
                        </Text>
                    )}

                    <TextInput
                        label="Hír tartalma"
                        value={content}
                        onChangeText={setContent}
                        mode="outlined"
                        outlineColor="rgba(107, 174, 161, 0.3)"
                        multiline
                        style={[styles.inputDescription, { backgroundColor: '#FFFFFF' }]}
                        theme={{ colors: { primary: '#6db2a1' } }}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        disabled={!formValid || loading}
                    >
                        {loading ? <ActivityIndicator animating color="#fff" /> : 'Hír beküldése'}
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>

    );
};

export default AddNewsScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAF8',
    },
    imageContainer: {
        alignItems: 'center',
    },
    imageButton: {
        borderColor: "#6BAEA1",
        borderWidth: 1.5,
        borderRadius: 8,
        marginTop: 16,
        width: '90%',
    },
    optionalNote: {
        fontSize: 12,
        textAlign: 'center',
        color: 'gray',
        marginTop: 6,
    },
    divider: {
        height: 1,
        opacity: 0.4,
        backgroundColor: '#6FB1A5',
        marginVertical: 15,
        marginHorizontal: 15,
    },
    thumbnailsContainer: {
        flexDirection: 'row',
        marginTop: 8,
        paddingHorizontal: 8,
    },
    thumbnailWrapper: {
        position: 'relative',
        marginRight: 8,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedThumbnail: {
        borderColor: '#6db2a1',
        borderWidth: 2,
    },
    deleteIcon: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'rgba(107, 174, 161, 0.3)',
        borderRadius: 4,
        marginBottom: 12,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
    },
    picker: {
        height: 50,
        width: '100%',
        paddingHorizontal: 8,
    },
    input: {
        marginBottom: 12,
    },
    inputDescription: {
        height: 160,
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: '#6db2a1',
        marginTop: 20,
        height: 50,
        justifyContent: 'center',
        borderRadius: 8,
    },
    largePreview: {
        marginTop: 32,
        height: screenWidth * 0.5,
        width: '90%',
        borderRadius: 12,
    },
});
