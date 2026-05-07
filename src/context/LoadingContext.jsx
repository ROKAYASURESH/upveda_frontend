import React, { createContext, useContext, useState } from "react";
import LoadingOverlay from "../components/loading/LoadingOverlay";

export const LoadingContext = createContext({
    isLoading: false
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ setIsLoading }}>
            <LoadingOverlay  isLoading={isLoading}/>
            {children}
        </LoadingContext.Provider>
    );
};
