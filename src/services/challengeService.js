import axios from 'axios';
import { API_URL } from "../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage'


//Kihívás létrehozása
export const createChallenge = async (challengeData) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const formData = new FormData();

        formData.append("title", challengeData.title);
        formData.append("description", challengeData.description);
        formData.append("costPoints", challengeData.costPoints);
        formData.append("rewardPoints", challengeData.rewardPoints);
        formData.append("category", challengeData.category);
        formData.append("startDate", challengeData.startDate.toISOString().split("T")[0]);
        formData.append("endDate", challengeData.endDate.toISOString().split("T")[0]);
        formData.append("institutionId", challengeData.institutionId);

        // ha van kép
        if (challengeData.image) {
            const fileName = challengeData.image.split("/").pop();
            const fileType = fileName.split(".").pop().toLowerCase();
            formData.append("image", {
                uri: challengeData.image,
                name: fileName,
                type: `image/${fileType}`,

            });
        }

        const response = await axios.post(`${API_URL}/api/challenges/create`, formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Hiba a kihívás létrehozásakor:", error.response?.data || error.message);
        throw error;
    }
};

//Összes aktív kihívás listázása
export const getAllActiveChallenges = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/challenges/active`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Hiba a kihívások listázásakor:', error);
        throw error;
    }
}

//Kihívás feloldása
export const unlockChallenge = async (challengeId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(`${API_URL}/api/challenges/${challengeId}/unlock`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Hiba a kihívás feloldásakor:", error.response?.data || error.message);
        throw error;
    }
};