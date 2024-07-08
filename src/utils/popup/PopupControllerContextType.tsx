import React, { createContext, useContext, useState, ReactNode, FC, ComponentType } from 'react';

interface PopupControllerContextType {
    open: <T>(Component: ComponentType<T>, props?: T) => void;
    close: () => void;
}

const PopupControllerContext = createContext<PopupControllerContextType | undefined>(undefined);

export const PopupControllerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [popup, setPopup] = useState<{ Component: ComponentType<any>, props: any } | null>(null);

    const open = <T,>(Component: ComponentType<T>, props: T = {} as T) => {
        setPopup({ Component, props });
    };

    const close = () => {
        setPopup(null);
    };

    return (
        <PopupControllerContext.Provider value={{ open, close }}>
            {children}
            {popup && <popup.Component {...popup.props} onClose={close} />}
        </PopupControllerContext.Provider>
    );
};

export const usePopupController = () => {
    const context = useContext(PopupControllerContext);
    if (!context) {
        throw new Error('usePopupController must be used within a PopupControllerProvider');
    }
    return context;
};
