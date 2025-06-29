import {  createContext, useContext, useState } from 'react'
import { StyleSheet } from 'react-native'
import { authService } from '../services/authService'
import React from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        if (response) {
            setIsLoggedIn(true);
        }
    }

    const logout = () => {
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


const styles = StyleSheet.create({})

export const useAuth = () => useContext(AuthContext);