import React, { createContext, useState, useEffect, ReactNode, useContext, useMemo } from 'react';
import { login as apiLogin, register as apiRegister, check as apiCheckAuth, Credentials } from '../services/authService';
import Auth from '../components/auth/auth'; // Убедитесь, что путь верный

// 1. Определение интерфейса для контекста
interface IUserContext {
    token: string | null;
    username: string;
    isAuthenticated: boolean;
    login: (credentials: Credentials) => Promise<void>;
    register: (credentials: Credentials) => Promise<void>;
    logout: () => void;
}

// 2. Создание контекста с начальными значениями
const UserContext = createContext<IUserContext | undefined>(undefined);

// 3. Провайдер, который будет оборачивать приложение
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Разделяем состояние для большей ясности и гибкости
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [username, setUsername] = useState<string>('');
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
                        setUsername(userData.username); // Пример: получаем имя от API
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
            // После успешной регистрации сразу логиним пользователя
            await handleLogin(credentials);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error; // Пробрасываем ошибку для обработки в UI
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUsername('');
        setIsAuthenticated(false);
    };

    // Мемоизируем значение контекста, чтобы избежать лишних ререндеров
    const contextValue = useMemo(() => ({
        token,
        username,
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    }), [token, username, isAuthenticated]);

    return (
        <UserContext.Provider value={contextValue}>
            <AuthGuard isLoading={isLoading}>
                {children}
            </AuthGuard>
        </UserContext.Provider>
    );
};

// 4. Компонент для защиты роутов и отображения UI в зависимости от аутентификации
const AuthGuard: React.FC<{ children: ReactNode; isLoading: boolean }> = ({ children, isLoading }) => {
    const { isAuthenticated, login, register } = useUser();

    if (isLoading) {
        return <div>Loading...</div>; // Или компонент спиннера
    }

    // Если пользователь не аутентифицирован, показываем форму входа
    if (!isAuthenticated) {
        return <Auth onLogin={login} onRegister={register} />;
    }

    // Если аутентифицирован, показываем дочерние компоненты (основное приложение)
    return <>{children}</>;
};


// 5. Хук для удобного доступа к контексту
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};