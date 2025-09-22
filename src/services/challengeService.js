import axios from 'axios';
import { API_URL } from "../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getErrorMessage } from '../utils/getErrorMessage';


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
        console.error(getErrorMessage(error));
        throw new Error(getErrorMessage(error))
    }
};

//Felhasználó saját kihívásainak lekérése
export const getMyChallenges = async () => {
    try {
        const token = await AsyncStorage.getItem("token")
        const response = await axios.get(`${API_URL}/api/challenges/myChallenges`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (err) {
        console.error(getErrorMessage(err))
        throw new Error(getErrorMessage(err))
    }
}

//Felhasználó teljesített kihívásának beküldése
export const submitChallenge = async (challengeId, formData) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const response = await axios.post(`${API_URL}/api/challenges/${challengeId}/submit`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data
    } catch (err) {
        console.error(getErrorMessage(err))
        throw new Error(getErrorMessage(err))
    }
}

//Kihívás lekérdezése id alapján
export const getChallengeById = async (challengeId) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const response = await axios.get(`${API_URL}/api/challenges/${challengeId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (err) {
        console.error(getErrorMessage(err))
        throw new Error(getErrorMessage(err))
    }
}

//Adott intézményhez tartozó kihívások lekérdezése
export const getAssignedChallenges = async () => {
    try {
        const token = await AsyncStorage.getItem("token")
        const response = await axios.get(`${API_URL}/api/challenges/assigned-challenges`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (err) {
        console.error(getErrorMessage(err))
        throw new Error(getErrorMessage(err))
    }
}

//Intézményhez tarotzó összes beküldött kihívás listázása(bármilyen státuszban)
export const getInstitutionSubmissions = async () => {
    try {
        const token = await AsyncStorage.getItem("token")
        const response = await axios.get(`${API_URL}/api/challenges/institution-submissions`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (err) {
        console.error(getErrorMessage(err))
        throw new Error(getErrorMessage(err))
    }
}

//Felhasználó beküldött kihívásának elfogadása, elutasítása
export const challengeJudgment = async (userChallengeId, decision) => {
    try {
        const token = await AsyncStorage.getItem("token")
        const response = await axios.put(`${API_URL}/api/challenges/${userChallengeId}/approve`, { decision }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (err) {
        console.error(getErrorMessage(err))
        throw new Error(getErrorMessage(err))
    }
}