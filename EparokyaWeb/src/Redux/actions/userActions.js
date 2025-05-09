import axios from 'axios'
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken, } from '../../Utils/helpers'
import { authenticate } from '../../Utils/helpers'
import {  useNavigate, } from 'react-router-dom'

export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/register`, userData, config)
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const login = (email, password) => async (dispatch) => {
    try {
      
        dispatch({ type: LOGIN_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
               },
            withCredentials: true,
        }

        const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/login`, { email, password }, config)

        // console.log('Login response:', data); 
        // console.log('Login response:', data); 
        // console.log('User:', data.user);

        // localStorage.setItem('token', data.token);
        // localStorage.setItem('user', JSON.stringify(data.user));

        // sessionStorage.setItem('token', data.token);
        // sessionStorage.setItem('user', JSON.stringify(data.user));

        window.location.reload();
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                user: data.user,
                token: data.token
            }
        }, 500)
    } catch (error) {
        console.log(error.response.data.message)
      
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}

export const loadUser = () => async (dispatch) => {
    
    try {
        const config = {
        
            withCredentials: true,
        }
        dispatch({ type: LOAD_USER_REQUEST })
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, config)
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })
        console.log('Load user response:', data);
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const logout = () => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false,
        }
       
        await axios.get(`${process.env.REACT_APP_API}/api/v1/logout`,config)
        
        dispatch({
            type: LOGOUT_SUCCESS,
        })
        
    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message
        })
    }
}

// export const updateProfile = (userData) => async (dispatch) => {
//     try {
//         dispatch({ type: UPDATE_PROFILE_REQUEST,
//             payload: data.user,
//          })
        
//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//             withCredentials: true,
//         }
//         const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/profile/update`, userData, config)
        
//         dispatch({
//             type: UPDATE_PROFILE_SUCCESS,
//             payload: data.success
//         })
//     } catch (error) {
//         const errorMessage =
//             error?.response?.data?.message || error.message || "Something went wrong";
//         dispatch({
//             type: UPDATE_PROFILE_FAIL,
//             payload: errorMessage
//         });
//     }
       

// }

export const updateProfile = (userData) => async (dispatch) => {
    try {
        // Correct request dispatch (no payload needed)
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true,
        };

        const { data } = await axios.put(
            `${process.env.REACT_APP_API}/api/v1/profile/update`, 
            userData, 
            config
        );
        console.log('Update profile response:', data); // Log the response for debugging    
        // Dispatch success with FULL user data
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.user
        });

        dispatch({
            type: "AUTH_UPDATE",
            payload: data.user
        }) 
        
        // Load the updated user data
        // // Optionally dispatch loadUser to ensure everything is fresh
        // dispatch(loadUser());

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        }
        const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/password/update`, passwords, config)
        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/password/forgot`, email, config)
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }

}

export const allUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST })
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/users`, {
            //AxiosRequestConfig parameter
            withCredentials: true //correct
          })
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })
    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getUserDetails = (id) => async (dispatch) => {
    
    try {
        dispatch({ type: USER_DETAILS_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }, withCredentials: true

        }
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`,config)
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }, withCredentials: true

        }
        const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, userData, config)
        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteUser = (id) => async (dispatch) => {

    try {
        dispatch({ type: DELETE_USER_REQUEST })
        const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, {withCredentials: true})
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS

	})
}