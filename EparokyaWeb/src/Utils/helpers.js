import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// export const authenticate = (data, next) => {
//     if (window !== 'undefined') {
//         // console.log('authenticate', response)
//         sessionStorage.setItem('token', JSON.stringify(data.token));
//         sessionStorage.setItem('user', JSON.stringify(data.user));
//     }
//     next();
// };

export const authenticate = (data, next) => {
    if (window !== 'undefined') {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
    }
    next();
};



// export const authenticate = (data, next) => {
//     if (typeof window !== 'undefined') {
//         // Ensure data contains both user and token
//         if (data && data.token) {
//             localStorage.setItem('token', data.token); 
//             localStorage.setItem('user', JSON.stringify(data.user)); 
//             console.log('Token saved:', data.token);
//         } else {
//             console.error('No token found in response');
//         }
//     }
//     next();
// };


export const getToken = () => {
    if (window !== 'undefined') {
        if (sessionStorage.getItem('token')) {
            return JSON.parse(sessionStorage.getItem('token'));
        } else {
            return false;
        }
    }
};


// export const getToken = () => {
//     if (typeof window !== 'undefined') {
//         const rootData = localStorage.getItem('persist:root'); // Redux persist key
//         if (rootData) {
//             const parsedData = JSON.parse(rootData);
//             if (parsedData.auth) {
//                 const authData = JSON.parse(parsedData.auth);
//                 if (authData.user && authData.isAuthenticated) {
//                     return authData.user.token || null; // Adjust based on where your token is stored
//                 }
//             }
//         }
//     }
//     return null;
// };



// access user name from session storage
// export const getUser = () => {
//     if (window !== 'undefined') {
//         if (sessionStorage.getItem('user')) {
//             return JSON.parse(sessionStorage.getItem('user'));
//         } else {
//             return false;
//         }
//     }
// };


//works sa admin pero di sa submission:
export const getUser = () => {
    if (typeof window !== 'undefined') {
        // Check for the 'persist:root' key in localStorage
        const rootData = localStorage.getItem('persist:root');
        if (rootData) {
            // Parse 'persist:root' to get the user data within the 'auth' property
            const parsedData = JSON.parse(rootData);
            if (parsedData.auth) {
                const authData = JSON.parse(parsedData.auth);
                if (authData.user) {
                    return authData.user; // Return the user object if found
                }
            }
        }
        return false; // Return false if user data is not found
    }
};

// export const getUser = () => {
//     if (typeof window !== 'undefined') {
//         const sessionUser = sessionStorage.getItem('user');
//         if (sessionUser) {
//             const user = JSON.parse(sessionUser);
//             if (user && user.token) {
//                 return user; // Return user if valid token exists
//             }
//         }

//         const rootData = localStorage.getItem('persist:root');
//         if (rootData) {
//             const parsedData = JSON.parse(rootData);
//             if (parsedData.auth) {
//                 const authData = JSON.parse(parsedData.auth);
//                 if (authData.user && authData.user.token) {
//                     return authData.user; // Return user if valid token exists
//                 }
//             }
//         }

//         return false; // No user data found
//     }
// };



// remove token from session storage
export const logout = next => {
    if (window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }
    next();
};

export const errMsg = (message = '') => toast.error(message, {
    position: toast.POSITION.BOTTOM_CENTER
});
export const successMsg = (message = '') => toast.success(message, {
    position: toast.POSITION.BOTTOM_CENTER
});