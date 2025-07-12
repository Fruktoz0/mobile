import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config/apiConfig";

//Felgasználói adatok lekérése a szerverről
      export const fetchUserData = async (setUserData) => {
            try {
                const token = await AsyncStorage.getItem('token');
                 console.log("Token a lekéréshez:", token);
                if (token) {
                    const response = await axios.get(`${API_URL}/api/auth/user`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserData(response.data);
                }
            } catch (error) {
                console.error('Hiba a felhasználói adatok lekérdezésekor:', error);
            }
        };

     