import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { login as apiLogin, register as apiRegister, check as apiCheckAuth, Credentials } from '../services/authService';
import {AuthGuard} from "../components/auth/AuthGuard.tsx";

export interface IUserContext {
    token: string | null;
    // username: string;
    isAuthenticated: boolean;
    login: (credentials: Credentials) => Promise<void>;
    register: (credentials: Credentials) => Promise<void>;
    logout: () => void;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Разделяем состояние для большей ясности и гибкости
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    // const [username, setUsername] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Состояние для первоначальной проверки

    // Эффект для проверки токена при запуске приложения
    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    // API должен возвращать данные пользователя, включая имя
                    const userData = await apiCheckAuth(token);
                    if (userData) {
                        setIsAuthenticated(true);
                        // setUsername(userData); // Пример: получаем имя от API
                    } else {
                        // Токен невалиден, выходим из системы
                        localStorage.removeItem('token');
                        setToken(null);
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error("Token validation failed:", error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setIsAuthenticated(false);
                }
            }
            setIsLoading(false); // Завершаем загрузку в любом случае
        };

        validateToken();
    }, [token]); // Зависимость от токена

    // --- Функции для взаимодействия с API ---

    const handleLogin = async (credentials: Credentials) => {
        try {
            const response = await apiLogin(credentials); // API должен возвращать токен и данные пользователя
            localStorage.setItem('token', response.token);
            setToken(response.token);
            // setUsername(response.username); // Устанавливаем имя пользователя из ответа API
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            // Можно добавить обработку ошибок для пользователя (например, через state)
            throw error; // Пробрасываем ошибку дальше, чтобы компонент мог на нее отреагировать
        }
    };

    const handleRegister = async (credentials: Credentials) => {
        try {
            await apiRegister(credentials);

            const response = await apiLogin(credentials); // API должен возвращать токен и данные пользователя
            localStorage.setItem('token', response.token);
            setToken(response.token);
            // setUsername(response.username); // Устанавливаем имя пользователя из ответа API
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error; // Пробрасываем ошибку для обработки в UI
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        // setUsername('');
        setIsAuthenticated(false);
    };

    const contextValue = useMemo(() => ({
        token,
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: () => { console.log('Logout'); handleLogout(); },
    }), [token, isAuthenticated]);

    return (
        <UserContext.Provider value={contextValue}>
            <AuthGuard isLoading={isLoading}>
                {children}
            </AuthGuard>
        </UserContext.Provider>
    );
};