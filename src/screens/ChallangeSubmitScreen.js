import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { X } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Button, TextInput, Divider, ActivityIndicator, Text, HelperText, Dialog, Portal } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { submitChallenge } from '../services/challengeService';
import { Dimensions } from "react-native";



const ChallengeSubmitScreen = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const { challengeId } = route.params

    const [images, setImages] = useState([])
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [visible, setVisible] = useState(false)

    const showDialog = () => setVisible(true)
    const hideDialog = () => setVisible(false)

    const screenWidth = Dimensions.get("window").width;
    const thumbSize = screenWidth * 0.2; //20% a képernyő szélességből

    //Kép kiválasztása
    const pickImage = async () => {
        if (images.length >= 3) return

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.6,
        })
        if (!result.canceled) {
            setImages([...images, result.assets[0]])
        }
    }
    //Kép törlése
    const handleDeleteImage = (idx) => {
        setImages(images.filter((_, i) => i !== idx))
        if (selectedImageIndex === idx) {
            setSelectedImageIndex(0)
        }
    }

    //Beküldés
    const handleSubmit = async () => {
        setLoading(true)
        setErrorMessage("")
        try {
            const formData = new FormData()
            formData.append('description', description)

            images.forEach((img, index) => {
                formData.append("images", {
                    uri: img.uri,
                    type: "image/jpeg",
                    name: `upload_${index}.jpg`,
                })

            })
            await submitChallenge(challengeId, formData)
            showDialog()
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView styles={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.backText}>Kihívás teljesítés beküldése</Text>
            </View>

            <View style={styles.imageContainer}>
                <Image
                    source={
                        images.length > 0
                            ? { uri: images[selectedImageIndex].uri }
                            : require("../../assets/images/image_placeholder.png")
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
                            <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteImage(idx)}>
                                <X size={16} color="black" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                {/* Feltöltés*/}
                {images.length < 3 && (
                    <Button
                        mode="outlined"
                        icon="camera"
                        onPress={pickImage}
                        style={styles.imageButton}
                        textColor="#6BAEA1"
                        theme={{ colors: { primary: "#6db2a1" } }}
                    >
                        Kép feltöltése (max 3)
                    </Button>
                )}
                <Text style={styles.optionalNote}>
                    Legalább 1 kép javasolt, max 3 feltölthető
                </Text>
            </View>

            <Divider style={styles.divider} />

            {/* Leírás */}
            <View style={{ margin: 16 }}>
                <TextInput
                    label="Leírás"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    outlineColor="rgba(107, 174, 161, 0.3)"
                    multiline
                    style={[styles.inputDescription, { backgroundColor: "#FFFFFF" }]}
                    theme={{ colors: { primary: "#6db2a1" } }}
                />
                <HelperText type="error" visible={!!errorMessage}>
                    {errorMessage}
                </HelperText>

                {/* Submit gomb */}
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator animating color="#fff" />
                    ) : (
                        "Beküldés"
                    )}
                </Button>
            </View>

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Gratulálok, sikeresen beküldted jóváhagyásra a kihívást!
                        </Text>
                        <Text style={{ marginTop: 8 }}>
                            Figyelem, a pontok csak elbírálás után kerülnek jóváhagyásra!
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => {
                                hideDialog()
                                navigation.replace("ChallengeDetail", { userChallenge: { challengeId, status: "pending" } })
                            }}
                        >
                            Bezár
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAF8',
    },
    body: {
        marginStart: 8,
        marginEnd: 8,
        marginTop: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
    },
    header: {
        marginStart: 16,
        paddingTop: 36,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: "center",
    },
    imageButton: {
        borderColor: "#6BAEA1",
        borderWidth: 1.5,
        borderRadius: 8,
        marginTop: 16,
        width: "90%",
    },
    optionalNote: {
        fontSize: 12,
        textAlign: "center",
        color: "gray",
        marginTop: 6,
    },
    divider: {
        height: 1,
        opacity: 0.4,
        backgroundColor: "#6FB1A5",
        marginVertical: 15,
        marginHorizontal: 15,
    },
    thumbnailsContainer: {
        flexDirection: "row",
        marginTop: 8,
        paddingHorizontal: 8,
    },
    thumbnailWrapper: {
        position: "relative",
        paddingBottom: 5
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderWidth: 1,
        marginRight: 17,
        borderColor: "#ccc",
    },
    selectedThumbnail: {
        borderColor: "#6db2a1",
        borderWidth: 2,
    },
    deleteIcon: {
        position: "absolute",
        top: 46,
        right: 2,
        backgroundColor: "white",
        padding: 2,
        marginRight: 5,
        borderRadius: 12,
    },
    inputDescription: {
        height: 160,
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: "#6db2a1",
        marginTop: 20,
        height: 50,
        justifyContent: "center",
        borderRadius: 8,
    },
    largePreview: {
        marginTop: 32,
        height: 200,
        width: "90%",
        aspectRatio: 1.6,
        borderRadius: 12,
        resizeMode: "contain"
    },
});

export default ChallengeSubmitScreen;
