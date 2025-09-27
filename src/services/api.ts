import axios from 'axios';
import { API_URL } from './url';
import {useUser} from "../context/UserContext.tsx";

// 1. Создаем инстанс axios с базовым URL
const api = axios.create({
    baseURL: API_URL,
});

// 2. Добавляем интерцептор (перехватчик) запросов
api.interceptors.request.use(
    (config) => {
        const user = useUser();

        // Если токен есть, добавляем его в заголовок Authorization
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }

        return config; // Возвращаем измененную конфигурацию
    },
    (error) => {
        // В случае ошибки на этапе подготовки запроса
        return Promise.reject(error);
    }
);

export default api;