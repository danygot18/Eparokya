import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errMsg, successMsg } from '../../../Utils/helpers';
import axios from 'axios';
import { Button } from '@mui/material'

const UpdateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPriest, setIsPriest] = useState(false); // NEW: isPriest state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);
    const navigate = useNavigate();
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
            setIsAdmin(data.user.isAdmin);
            setIsPriest(data.user.isPriest); // NEW: Set isPriest
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch user");
        }
    };

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
            setError(error.response?.data?.message || "Update failed");
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

    const submitHandler = (e) => {
        e.preventDefault();
        const userData = {
            name,
            email,
            isAdmin,
            isPriest, // NEW: include isPriest in update
        };
        updateUser(user._id, userData);
    };

    return (
        <div>
            <MetaData title={`Update User`} />
            <div className="d-flex">
                <div className="col-12 col-md-2">
                    <SideBar />
                </div>
                <div className="col-12 col-md-10">
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mt-2 mb-4">Update User</h1>

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
                                    <label htmlFor="role_field">Admin Role</label>
                                    <select
                                        id="role_field"
                                        className="form-control"
                                        value={isAdmin ? 'admin' : 'user'}
                                        onChange={(e) => setIsAdmin(e.target.value === 'admin')}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="priest_field">Priest Status</label>
                                    <select
                                        id="priest_field"
                                        className="form-control"
                                        value={isPriest ? 'priest' : 'not_priest'}
                                        onChange={(e) => setIsPriest(e.target.value === 'priest')}
                                    >
                                        <option value="not_priest">Not a Priest</option>
                                        <option value="priest">Priest</option>
                                    </select>
                                </div>

                                <Button type="submit" variant='contained'>
                                    Update
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;
