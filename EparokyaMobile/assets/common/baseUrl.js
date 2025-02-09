import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'https://eparokya.onrender.com/api/v1'
        : baseURL = 'https://eparokya.onrender.com/api/v1'
            // ? baseURL = 'https://eparokya-mobile-server.onrender.com/api/v1'
            // : baseURL = 'https://eparokya-mobile-server.onrender.com/api/v1'

}

export default baseURL; 