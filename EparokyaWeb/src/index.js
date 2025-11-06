import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
// Don't forget to import the default CSS for react-toastify!
import 'react-toastify/dist/ReactToastify.css'; // Add this line


import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { socket } from './socket/index';

const CustomCloseButton = ({ closeToast }) => (
  <button className="custom-close-button" onClick={closeToast}>
    X 
  </button>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

const RootComponent = () => {
  useEffect(() => {
    // Only connect if not already connected
    if (!socket.connected) {
      socket.connect();

      socket.on('connect', () => {
        console.log("Socket connected:", socket.connected);
        console.log("Socket ID:", socket.id); 
      });

      socket.on('connect_error', (err) => {
        console.log("Connection error:", err); 
      });
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);
 
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false} 
        closeButton={CustomCloseButton}
        pauseOnHover
        draggable
        theme="colored"
      />
    </Provider>
  );
};

root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);