import axios from 'axios';
import { API_URL } from './url';

// 1. Создаем инстанс axios с базовым URL
const api = axios.create({
    baseURL: API_URL,
});

// 2. Добавляем интерцептор (перехватчик) запросов
api.interceptors.request.use(
    (config) => {
        // Перед каждым запросом получаем токен из localStorage
        const token = localStorage.getItem('token');

        // Если токен есть, добавляем его в заголовок Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config; // Возвращаем измененную конфигурацию
    },
    (error) => {
        // В случае ошибки на этапе подготовки запроса
        return Promise.reject(error);
    }
);

export default api;