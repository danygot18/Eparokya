// import { io } from 'socket.io-client'

// const config = {
//     autoConnect: false,
// };

// export const socket = io(`https://eparokya.onrender.com`, {
//     autoConnect: false,
//     reconnection: true, // enables auto reconnection
//     reconnectionAttempts: 10, // maximum attempts
//     reconnectionDelay: 500, // initial delay in ms between attempts
//     reconnectionDelayMax: 2000, // max delay in ms between reconnection attempts
//     timeout: 5000, // connection timeout before failing
// });

// export const connectSocket = () => {
//     if (!socket.connected) {
//         socket.connect();
//         console.log("Attempting to connect WebSocket...");
//     } else {
//         console.log("WebSocket already connected:", socket.id);
//     }
// };

//Developing
import { io } from 'socket.io-client'

const config = {
    autoConnect: false,
};

export const socket = io(`${process.env.REACT_APP_API}`, {
    autoConnect: false,
    reconnection: true, // enables auto reconnection
    reconnectionAttempts: 10, // maximum attempts
    reconnectionDelay: 500, // initial delay in ms between attempts
    reconnectionDelayMax: 2000, // max delay in ms between reconnection attempts
    timeout: 5000, // connection timeout before failing
});

export const connectSocket = () => {
    if (!socket.connected) {
      socket.connect();
    }
  };