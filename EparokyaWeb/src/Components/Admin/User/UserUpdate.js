import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errMsg, successMsg } from '../../../Utils/helpers';
import { getToken } from '../../../Utils/helpers';
import axios from 'axios';

const UpdateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Boolean state for isAdmin
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);
    let navigate = useNavigate();
    const { id } = useParams();

    const config = {
        withCredentials: true,
    };

    const getUserDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config);
            setUser(data.user);
            setName(data.user.name);
            setEmail(data.user.email);
            setIsAdmin(data.user.isAdmin); // Set isAdmin state
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    // const updateUser = async (id, userData) => {
    //     try {
    //         const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, userData, config);
    //         setIsUpdated(data.success);
    //         setLoading(false);
    //     } catch (error) {
    //         setError(error.response.data.message);
    //     }
    // };
    const updateUser = async (id, userData) => {
        try {
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/admin/user/${id}`,
                userData,
                config
            );
            setIsUpdated(data.success);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };


    useEffect(() => {
        if (!user || user._id !== id) {
            getUserDetails(id);
        }
        if (error) {
            errMsg(error);
            setError('');
        }
        if (isUpdated) {
            successMsg('User updated successfully');
            navigate('/admin/users');
        }
    }, [error, isUpdated, id, user]);

    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.set('name', name);
    //     formData.set('email', email);
    //     formData.set('isAdmin', isAdmin); // Set the correct field for isAdmin
    //     updateUser(user._id, formData);
    // };
    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.set('name', name);
    //     formData.set('email', email);
    //     formData.set('isAdmin', isAdmin === true); // Ensure it's a Boolean
    //     updateUser(user._id, formData);
    // };
    const submitHandler = (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            isAdmin, // This will send the correct boolean value
        };

        updateUser(user._id, userData);
    };


    return (
        <Fragment>
            <MetaData title={`Update User`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <SideBar />
                </div>
                <div className="col-12 col-md-10">
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mt-2 mb-5">Update User</h1>
                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role_field">Role</label>
                                    <select
                                        id="role_field"
                                        className="form-control"
                                        value={isAdmin ? 'admin' : 'user'}
                                        onChange={(e) => setIsAdmin(e.target.value === 'admin')} // Correct logic
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>

                                </div>
                                <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateUser;
