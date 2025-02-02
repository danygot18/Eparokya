// import React, { useEffect, useReducer, userEffect, useState } from "react";
// import "core-js/stable/atob";
// import { jwtDecode } from "jwt-decode"
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import SyncStorage from "sync-storage";
// import authReducer from "../Reducers/AuthReducer";

// import { setCurrentUser } from "../Actions/Auth.actions";
// import AuthGlobal from './AuthGlobal'

// const Auth = props => {
//     // console.log(props.children)
//     console.log(AsyncStorage.getItem('jwt'))
//     const [stateUser, dispatch] = useReducer(authReducer, {
//         isAuthenticated: null,
//         user: {}
//     });
//     const [showChild, setShowChild] = useState(false);

//     useEffect(() => {
//         setShowChild(true);
//         if (AsyncStorage.jwt) {
//             const decoded = AsyncStorage.jwt ? AsyncStorage.jwt : "";
//             if (setShowChild) {
//                 dispatch(setCurrentUser(jwtDecode(decoded)))
//             }
//         }
//         return () => setShowChild(false);
//     }, [])


//     if (!showChild) {
//         return null;
//     } else {
//         return (
//             <AuthGlobal.Provider
//                 value={{
//                     stateUser,
//                     dispatch
//                 }}
//             >
//                 {props.children}
//             </AuthGlobal.Provider>
//         )
//     }
// };

//current use 
// const Auth = props => {
//     // console.log(props.children)
//     console.log(SyncStorage.get('jwt'))
//     const [stateUser, dispatch] = useReducer(authReducer, {
//         isAuthenticated: null,
//         user: {}
//     });
//     const [showChild, setShowChild] = useState(false);

//     useEffect(() => {
//         setShowChild(true);
//         if (SyncStorage.jwt) {
//             const decoded = SyncStorage.jwt ? SyncStorage.jwt : "";
//             if (setShowChild) {
//                 dispatch(setCurrentUser(jwtDecode(decoded)))
//             }
//         }
//         return () => setShowChild(false);
//     }, [])


//     if (!showChild) {
//         return null;
//     } else {
//         return (
//             <AuthGlobal.Provider
//                 value={{
//                     stateUser,
//                     dispatch
//                 }}
//             >
//                 {props.children}
//             </AuthGlobal.Provider>
//         )
//     }
// };

import React, { useEffect, useReducer } from "react";
import jwtDecode from "jwt-decode"; // Correctly imported
import SyncStorage from "sync-storage"; // SyncStorage for token management
import authReducer from "../Reducers/AuthReducer";
import { setCurrentUser } from "../Actions/Auth.actions";
import AuthGlobal from "./AuthGlobal";

const Auth = (props) => {
    const [stateUser, dispatch] = useReducer(authReducer, {
        isAuthenticated: null,
        user: {},
    });

    useEffect(() => {
        const initStorage = async () => {
            await SyncStorage.init();
            const jwt = SyncStorage.get("jwt");
            if (jwt) {
                try {
                    const decoded = jwtDecode(jwt);
                    console.log("Decoded JWT:", decoded); // Debugging log
                    dispatch(setCurrentUser(decoded));
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            } else {
                console.log("No JWT found in storage.");
            }
        };
        initStorage();
    }, []);

    return (
        <AuthGlobal.Provider value={{ stateUser, dispatch }}>
            {props.children}
        </AuthGlobal.Provider>
    );
};

export default Auth;


