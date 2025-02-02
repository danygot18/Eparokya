import axios from "axios";
import * as userAction from '../constants'
import baseURL from "../../assets/common/baseUrl";
import SyncStorage from "sync-storage";

export const loginAction = (values) => async (dispatch) => {
    try {

        dispatch({
            type: userAction.REQUEST_ACTION,
            payload: 'Logging in'
        })

        const { data } = await axios.post(`${baseURL}/users/login`, values);
        console.log(data)
        SyncStorage.set("token", data.token);
        SyncStorage.set("user", JSON.stringify(data.user))

        dispatch({
            type: userAction.USER_LOGIN_SUCCESS,
            payload: data,
        })


    } catch (err) {

        dispatch({
            type: userAction.REQUEST_FAIL,
            payload: err?.response?.data?.message || 'Please try again later'
        })

        console.log(err)

    }
}

export const logoutAction = () => async (dispatch) => {

    try {

        dispatch({
            type: userAction.REQUEST_ACTION,
            payload: 'Logging out'
        })

        SyncStorage.remove('user')
        SyncStorage.remove('token');

        dispatch({
            type: userAction.USER_LOGOUT_SUCCESS,
            payload: 'Successfully logout'
        })

    } catch (err) {

        dispatch({
            type: userAction.REQUEST_FAIL,
            payload: err?.response?.data?.message || 'Please try again later'
        })

        console.log(err)

    }

}

export const clearErrors = () => async (dispatch) => {

    setTimeout(() => {
        dispatch({
            type: userAction.CLEAR_ERROR
        })
    }, 5000)

}

export const postCommentAction = (announcementId, commentText) => async (dispatch) => {
    try {
        // Get token from storage
        const token = SyncStorage.get('token');
        if (!token) {
            throw new Error("No token found");
        }

        dispatch({
            type: userAction.REQUEST_ACTION,
            payload: 'Posting comment...',
        });

        // Make the API call to post the comment
        const { data } = await axios.post(
            `${baseURL}/announcement/comment/${announcementId}`,
            { text: commentText },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        dispatch({
            type: userAction.POST_COMMENT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: userAction.REQUEST_FAIL,
            payload: error.response?.data?.message || 'Failed to post comment.',
        });
        console.error("Error posting comment:", error);
    }
};