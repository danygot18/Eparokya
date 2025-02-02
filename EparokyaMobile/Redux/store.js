import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { userReducer } from './Reducers/userReducer';

import { getUser, getToken } from '../utils/user';
import cartItems from './Reducers/cartItems';


const reducers = combineReducers({
    user: userReducer,
    cartItems: cartItems,
})
let initialState = {

    user: {
        userInfo: getUser(),
        token: getToken()
    },

}

const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunk),
)

export default store;