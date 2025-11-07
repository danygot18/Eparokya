import baseURL from '../assets/common/baseUrl';
import { io } from 'socket.io-client'

const config = {
    autoConnect: false,
};

export const socket = io(
    `https://eparokya.onrender.com`,
     {
    autoConnect: false,
    reconnection: true, // enables auto reconnection
    reconnectionAttempts: 10, // maximum attempts
    reconnectionDelay: 500, // initial delay in ms between attempts
    reconnectionDelayMax: 2000, // max delay in ms between reconnection attempts
    timeout: 5000, // connection timeout before failing
});
