import { FC, useState, FormEvent } from "react";
import styles from './Auth.module.css'; // Импортируем CSS-модуль

interface Credentials {
    email: string;
    password: string;
}

interface AuthProps {
    onLogin: (credentials: Credentials) => Promise<any>;
    onRegister: (credentials: Credentials) => Promise<any>;
}

const Auth: FC<AuthProps> = ({ onLogin, onRegister }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const action = isLoginView ? onLogin : onRegister;
        const credentials = { email, password };

        try {
            await action(credentials);

            // После регистрации автоматически переключаем на форму входа
            if (!isLoginView) {
                setIsLoginView(true);
            }

            // Очистка полей и управление состоянием после успеха
            // теперь полностью делегированы родительскому компоненту
            setEmail('');
            setPassword('');

        } catch (err: any) {
            setError(err.message || 'Что-то пошло не так');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError(null);
        setEmail('');
        setPassword('');
    };

    return (
        <div className={styles.container}>
            <h1>{isLoginView ? 'Вход' : 'Регистрация'}</h1>

            <form onSubmit={handleFormSubmit} className={styles.form}>
                <div>
                    <label htmlFor="email" className={styles.visuallyHidden}>Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div>
                    <label htmlFor="password" className={styles.visuallyHidden}>Пароль</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                    {isLoading ? 'Загрузка...' : (isLoginView ? 'Войти' : 'Зарегистрироваться')}
                </button>
            </form>

            <button type="button" onClick={toggleView} className={styles.toggleButton}>
                {isLoginView ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
        </div>
    );
};

export default Auth;