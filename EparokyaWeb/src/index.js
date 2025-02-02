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
    socket.connect(); // Connect socket when the app starts
    console.log("Socket connected:", socket.connected);

    return () => {
      socket.disconnect(); // Cleanup on unmount
      console.log("Socket disconnected");
    };
  }, []);

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
