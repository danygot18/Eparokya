import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DrawerNavigator from './Navigators/DrawerNavigator';
import Mains from './Navigators/Main';
import { NavigationContainer } from '@react-navigation/native';
import SyncStorage from 'sync-storage'
import { Button } from 'native-base';
import { USER_LOGIN_SUCCESS } from './Redux/constants';
import UserNavigator from './Navigators/UserNavigator';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import baseURL from './assets/common/baseUrl';

import { socket } from './socket';

export default function Main() {

    const { isLogin, userInfo, user } = useSelector(state => state.auth);

    const dispatch = useDispatch()
    useEffect(() => {

        if (isLogin) {
            console.log(isLogin)
            socket.connect();
            socket.emit("join", { userId: user._id });
        }
        console.log(baseURL)

    }, [isLogin])
    // const initializeData = () => {

    //     const user = SyncStorage.get('user') || null;
    //     const token = SyncStorage.get('token') || null;
    //     console.log(SyncStorage.get('user'))
    //     dispatch({
    //         type: USER_LOGIN_SUCCESS,
    //         payload: {
    //             user,
    //             token
    //         }
    //     })

    // }

    // useEffect(() => {
    //     initializeData()
    // }, [])

    //cHANGE CODE: 4/2/2025
    // return (

    //     //cHANGE DATE: 4/2/2025
    //     // <NavigationContainer>

    //     //     {isLogin ?
    //     //         <>
    //     //             <DrawerNavigator />
    //     //         </>
    //     //         :
    //     //         <UserNavigator />
    //     //     }
    //     // </NavigationContainer>

    // );
    //NEW
    return isLogin ? <DrawerNavigator /> : <UserNavigator />;

}