// 

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { socket } from './socket/index';

const root = ReactDOM.createRoot(document.getElementById('root'));

const RootComponent = () => {
  useEffect(() => {
    // Only connect if not already connected
    if (!socket.connected) {
      socket.connect();

      socket.on('connect', () => {
        console.log("Socket connected:", socket.connected); // ✅ True
        console.log("Socket ID:", socket.id); // ✅ Now has a value
      });

      socket.on('connect_error', (err) => {
        console.log("Connection error:", err); // ✅ Helps debug failures
      });
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);
  // useEffect(() => {
  //   // Only connect if not already connected
  //   if (!socket.connected) {
  //     socket.connect();

  //     socket.on('connect', () => {
  //       console.log("Socket connected:", socket.connected);
  //       console.log("Socket ID:", socket.id);
  //     });

  //     socket.on('connect_error', (err) => {
  //       console.log("Connection error:", err);
  //     });
  //   }

  //   return () => {
  //     if (socket.connected) {
  //       socket.disconnect();
  //       console.log("Socket disconnected");
  //     }
  //   };
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
      <ToastContainer />
    </Provider>
  );
};

root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
