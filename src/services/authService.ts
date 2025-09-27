import axios from 'axios';
import { API_URL } from "./url.ts";

/**
 * @interface Credentials
 * @description Определяет структуру данных для входа и регистрации пользователя.
 */
export interface Credentials {
    email: string;
    password: string;
}

/**
 * @interface LoginResponse
 * @description Определяет структуру успешного ответа от сервера при входе.
 */
export interface LoginResponse {
    message: string;
    token: string;
}

/**
 * Отправляет запрос на регистрацию нового пользователя.
 * @param {Credentials} credentials - Объект с email и паролем пользователя.
 * @returns {Promise<void>} - Промис завершается при успешной регистрации.
 */
export const register = async (credentials: Credentials): Promise<void> => {
    // Используем POST-запрос, как указано в Go API (r.Method != http.MethodPost)
    // axios автоматически преобразует объект credentials в JSON
    return axios.post(`${API_URL}/api/register`, credentials);
};

/**
 * Отправляет запрос на вход пользователя.
 * @param {Credentials} credentials - Объект с email и паролем пользователя.
 * @returns {Promise<LoginResponse>} - Промис, который разрешается объектом, содержащим токен.
 */
export const login = async (credentials: Credentials): Promise<LoginResponse> => {
    // Используем POST-запрос и ожидаем ответ с токеном
    const response = await axios.post<LoginResponse>(`${API_URL}/api/login`, credentials);

    // axios помещает ответ от сервера в поле `data`
    return response.data;
};

export const check = async (token: string): Promise<boolean> => {
    const response = await axios.get(`${API_URL}/api/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.status === 200;
};