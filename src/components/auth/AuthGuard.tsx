import React, {ReactNode} from "react";
import Auth from "./auth.tsx";
import {useUser} from "../../hooks/useUser.ts";

export const AuthGuard: React.FC<{ children: ReactNode; isLoading: boolean }> = ({ children, isLoading }) => {
    const { isAuthenticated, login, register } = useUser();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Auth onLogin={login} onRegister={register} />;
    }

    return <>{children}</>;
};