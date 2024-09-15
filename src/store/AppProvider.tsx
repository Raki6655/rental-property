/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-state */


import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { environmentConstantsState } from "./AppAtom";
import { AppContext } from "./AppContext";
import { silentLoginToken } from "../api/server.api";


// Will be using the context store for handling authentication
// Other Data realated stuffs will go to recoil container

interface AppProviderProps {
    children: React.ReactNode;  // ReactNode is the best type for children
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, setState] = useState({
        userInfo: {},
        validatingToken: true,
        tokenRefreshmentInterval: 0,
        hubUrl: "",
        permission: false,
    });

    const setEnvironmentConstants = useSetRecoilState(environmentConstantsState);

    // This value will be passed to the entire application
    const value = {
        ...state,
    };
    useEffect(() => {
        setTimeout(() => {
            setState((prev) => {
                return {
                    ...prev,
                    validatingToken: false
                };
            });
        }, (5000));
    });
    useEffect(() => {
        const userToken = silentLoginToken();

        if (!userToken) {
            console.log("no user token");
            // validateToken();
        }
        else {
            console.log("silent login");
            // silentLogin(userToken);
        }

        // tokenRefreshment();

        // on unmount
        return () => {
            // clearTokenRefreshment();
        };
    },
        []);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
