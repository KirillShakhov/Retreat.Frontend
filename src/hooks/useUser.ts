import { useContext } from 'react';
import { UserContext, IUserContext } from '../contexts/UserContext';

/**
 * Хук для доступа к данным пользователя и методам аутентификации.
 * Должен использоваться внутри UserProvider.
 */
export const useUser = (): IUserContext => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};