import axios from 'axios'
import { API_URL } from '../config/apiConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'


//Összes hír lekérdezése
export const getAllNews = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/news/allNews`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Hiba történt a hírek lekérdezése során:', error);
        throw error;
    }
};

//Összes intézmény lekérdezése
export const getAllInstitutions = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/institutions`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error('Hiba történt az intézmények lekérdezése során:', err);
        throw err;
    }
}

//Új hír létrehozása
export const addNews = async (newsData) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const formData = new FormData();

        formData.append("title", newsData.title);
        formData.append("content", newsData.content);
        formData.append("institutionId", newsData.institutionId);

        if (newsData.image) {
            const fileName = newsData.image.split("/").pop();
            const fileType = fileName.split(".").pop().toLowerCase();


            formData.append("image", {
                uri: newsData.image,
                name: fileName,
                type: `image/${fileType}`,
            });
        }
    
        const response = await axios.post(`${API_URL}/api/news/add`, formData, {
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
} catch (error) {
    console.error("Hiba a hír hozzáadásakor:", error);
    throw error;
}
};

// Egy hír részleteinek lekérdezése
export const getNewsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/news/${id}`, {
        });
        return response.data;
    } catch (error) {
        console.error('Hiba történt a hír lekérdezése során:', error);
        throw error;
    }
}
