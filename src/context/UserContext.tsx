import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { login as apiLogin, register as apiRegister, Credentials } from '../services/authService';
import Auth from '../components/auth/auth'; // Убедитесь, что путь верный

// 1. Единый, более полный интерфейс для всего контекста
interface IUserContext {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    login: (token: string, username: string) => void;
    logout: () => void;
}

// 2. Создаем контекст с корректным начальным значением
const UserContext = createContext<IUserContext>({
    token: null,
    username: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

// 3. Создаем провайдер
const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState({
        token: localStorage.getItem('token'),
        username: null, // Имя пользователя будет загружено
        isAuthenticated: !!localStorage.getItem('token'), // Начальное состояние зависит от наличия токена
        loading: true, // Добавим состояние загрузки для инициализации
    });

    // При старте приложения проверяем валидность токена
    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // В реальном приложении здесь был бы запрос к API для проверки токена
                    // и получения данных пользователя.
                    // Например: const user = await api.getUserProfile(token);
                    const username = 'demoUser'; // Заглушка
                    setSession({ token, username, isAuthenticated: true, loading: false });
                } catch (error) {
                    // Если токен невалидный, выходим из системы
                    logout();
                }
            } else {
                setSession(prev => ({ ...prev, loading: false }));
            }
        };

        validateToken();
    }, []);

    // Функция для внутреннего использования в провайдере
    const login = (token: string, username: string) => {
        localStorage.setItem('token', token);
        setSession({ token, username, isAuthenticated: true, loading: false });
    };

    // Функция выхода, доступная через контекст
    const logout = () => {
        localStorage.removeItem('token');
        setSession({ token: null, username: null, isAuthenticated: false, loading: false });
    };

    // Обработчик для компонента Auth, использующий authService
    const handleLogin = async (credentials: Credentials) => {
        const response = await apiLogin(credentials); // Вызов API
        // В идеале, API должен возвращать имя пользователя вместе с токеном
        login(response.token, credentials.email); // Логинимся с полученным токеном
    };

    // Обработчик регистрации
    const handleRegister = async (credentials: Credentials) => {
        await apiRegister(credentials); // Вызов API для регистрации
        // После успешной регистрации сразу логиним пользователя
        await handleLogin(credentials);
    };

    // Не показываем ничего, пока идет первоначальная проверка токена
    if (session.loading) {
        return <div>Loading...</div>; // Или компонент спиннера
    }

    return (
        <UserContext.Provider value={{ ...session, login, logout }}>
            {session.isAuthenticated
                ? children
                : <Auth onLogin={handleLogin} onRegister={handleRegister} />
            }
        </UserContext.Provider>
    );
};

// 4. Кастомный хук для удобного доступа к контексту
const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserProvider, useUser };