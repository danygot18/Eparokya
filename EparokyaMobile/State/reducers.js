import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import preferenceSlice from "./preferenceSlice";
import postSlice from './postSlice'

const rootReducer = combineReducers({
    auth: authSlice,
    preferences: preferenceSlice,
    post: postSlice,
})

export default rootReducer;