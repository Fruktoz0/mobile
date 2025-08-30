import axios from 'axios'
import { API_URL } from '../config/apiConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getErrorMessage } from '../utils/getErrorMessage'

export const allBadges = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/badges/all`)
        return res.data
    } catch (err) {
        throw new Error(getErrorMessage(err))
    }
}

export const userBadges = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/api/badges/${id}`, {
        })
        return res.data
    } catch (err) {
        throw new Error(getErrorMessage(err))
    }
}

export const userReportCount = async () => {
    try {
        const token = await AsyncStorage.getItem('token')
        const res = await axios.get(`${API_URL}/api/reports/userReportCount`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res.data.reportCount
    } catch (err) {
        throw new Error(getErrorMessage(err))
    }
}