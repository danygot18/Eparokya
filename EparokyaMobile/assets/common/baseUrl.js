import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://192.168.2.189:4001/api/v1'
        : baseURL = 'http://192.168.2.1:4001/api/v1'
            // ? baseURL = 'https://eparokya-mobile-server.onrender.com/api/v1'
            // : baseURL = 'https://eparokya-mobile-server.onrender.com/api/v1'

}

export default baseURL; 