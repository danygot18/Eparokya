import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from './Redux/reducers/userReducers';

const persistConfig = {
    key: 'root',
    storage,
  }


const reducer = combineReducers({

    auth: authReducer,
    user: userReducer,
    forgotPassword:forgotPasswordReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,

})

const persistedReducer = persistReducer(persistConfig, reducer)
// let initialState = {

// }


const middlware = [thunk]
export const store = createStore(persistedReducer, applyMiddleware(...middlware))

export const persistor = persistStore(store);

// export default store;