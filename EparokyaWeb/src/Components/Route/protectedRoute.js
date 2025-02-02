import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import Loader from '../Layout/Loader';
import { getUser } from '../../Utils/helpers';
import { toast, ToastContainer } from 'react-toastify';


const ProtectedRoute = ({ children, isAdmin = false }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const notify = (error) => toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    
    console.log(getUser())
    useEffect(() => {
        const fetchedUser = getUser();
        setUser(fetchedUser);
        setLoading(false);
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to='/login' />;
    }

    if (isAdmin && !user.isAdmin) {
        toast.error('You are not allowed to access the admin dashboard.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return <Navigate to='/' />;
    }

    return children;
};

export default ProtectedRoute;
