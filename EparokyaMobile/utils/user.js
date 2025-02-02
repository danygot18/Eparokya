
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authenticate = async (data) => {
    console.log(data)
    await AsyncStorage.setItem("jwt", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user))

}

export const getUser = () => {
    
    const user = AsyncStorage.getItem('user');
    return user ? user : null
    
}

export const getToken = () => {
    const token = AsyncStorage.getItem('token');
    return token ? token : null
}

import "core-js/stable/atob";
import SyncStorage from "sync-storage";
export const authenticates = (data) => {

    SyncStorage.set("token", data.token);
    SyncStorage.set("user", JSON.stringify(data.user))

}

export const getUsers = () => {
    const user = SyncStorage.get('user');
    console.log(user)
    return user ? user : null;
}

export const getTokens = () => {
    const token = SyncStorage.get('token');
    return token ? token : null
}

export const logout = () => {
    SyncStorage.remove('user')
    SyncStorage.remove('token');
}

