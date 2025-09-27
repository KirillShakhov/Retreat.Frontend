import axios from 'axios';
import { API_URL } from './url';

// 1. Создаем инстанс axios с базовым URL
const api = axios.create({
    baseURL: API_URL,
});

// 2. Добавляем интерцептор (перехватчик) запросов
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

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