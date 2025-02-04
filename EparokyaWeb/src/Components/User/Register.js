import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Metadata from '../Layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearErrors } from '../../Redux/actions/userActions';
import axios from 'axios'; 

const Register = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        preference: '',
        phone: '',
        barangay: '',
        zip: '',
        city: '',
        country: '',
        ministryCategory: '',
    });
    const [ministryCategories, setMinistryCategories] = useState([]); 
    const { name, email, password, age, preference, phone, barangay, zip, city, country } = user;
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');

    let navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }

        const fetchMinistryCategories = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllMinistryCategories`); 
                setMinistryCategories(data);
                console.log(data);
            } catch (err) {
                console.error('Failed to fetch ministry categories:', err);
            }
        };

        fetchMinistryCategories();
    }, [error, isAuthenticated, navigate, dispatch]);


    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('age', age);
        formData.set('preference', preference);
        formData.set('phone', phone);
        formData.set('barangay', barangay);
        formData.set('zip', zip);
        formData.set('city', city);
        formData.set('country', country);
        formData.set('avatar', avatar);
        formData.set('ministryCategory', ministryCategories); 

        dispatch(register(formData));
    };

    // const onChange = e => {
    //     if (e.target.name === 'avatar') {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             if (reader.readyState === 2) {
    //                 setAvatarPreview(reader.result);
    //                 setAvatar(reader.result);
    //             }
    //         };
    //         reader.readAsDataURL(e.target.files[0]);
    //     } else {
    //         setUser({ ...user, [e.target.name]: e.target.value });
    //     }
    // };


    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const file = e.target.files[0];
            setAvatar(file);

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    
    return (
        <Fragment>
            <Metadata title={'Register User'} />
            <div className="row wrapper justify-content-center align-items-center vh-100">
                <div className="col-10 col-lg-6 col-md-8">
                    <form className="shadow-lg p-4" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mb-4 text-center">Register</h1>

                        {/* Name */}
                        <div className="form-group mb-3">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={onChange}
                                required
                                aria-label="Pangalan"
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group mb-3">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={onChange}
                                required
                                aria-label="Email"
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group mb-3">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                value={password}
                                onChange={onChange}
                                required
                                aria-label="Password"
                            />
                        </div>

                        {/* Age */}
                        <div className="form-group mb-3">
                            <label htmlFor="age_field">Age</label>
                            <input
                                type="number"
                                id="age_field"
                                className="form-control"
                                name='age'
                                value={age}
                                onChange={onChange}
                                aria-label="Edad"
                            />
                        </div>

                        {/* Preference */}
                        <div className="form-group mb-3">
                            <label htmlFor="preference_field">Preference</label>
                            <select
                                id="preference_field"
                                className="form-control"
                                name='preference'
                                value={preference}
                                onChange={onChange}
                                aria-label="Preference"
                            >
                                <option value="">Select Preference</option>
                                <option value="He">He</option>
                                <option value="She">She</option>
                                <option value="They/Them">They/Them</option>
                            </select>
                        </div>

                        {/* Phone */}
                        <div className="form-group mb-3">
                            <label htmlFor="phone_field">Phone Number</label>
                            <input
                                type="text"
                                id="phone_field"
                                className="form-control"
                                name='phone'
                                value={phone}
                                onChange={onChange}
                                aria-label="Phone Number"
                            />
                        </div>

                         {/* Ministry Category */}
                         <div className="form-group mb-3">
                            <label htmlFor="ministryCategory_field">Ministry Category</label>
                            <select
                                id="ministryCategory_field"
                                className="form-control"
                                name="ministryCategories"
                                value={ministryCategories}
                                onChange={onChange}
                                required
                            >
                                <option value="">Select Ministry Category</option>
                                {ministryCategories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Barangay */}
                        <div className="form-group mb-3">
                            <label htmlFor="barangay_field">Baranggay</label>
                            <input
                                type="text"
                                id="barangay_field"
                                className="form-control"
                                name='barangay'
                                value={barangay}
                                onChange={onChange}
                                aria-label="Baranggay"
                            />
                        </div>

                        {/* Zip */}
                        <div className="form-group mb-3">
                            <label htmlFor="zip_field">Zip</label>
                            <input
                                type="text"
                                id="zip_field"
                                className="form-control"
                                name='zip'
                                value={zip}
                                onChange={onChange}
                                aria-label="Zip"
                            />
                        </div>

                        {/* City */}
                        <div className="form-group mb-3">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                name='city'
                                value={city}
                                onChange={onChange}
                                aria-label="City"
                            />
                        </div>

                        {/* Country */}
                        <div className="form-group mb-3">
                            <label htmlFor="country_field">Country</label>
                            <input
                                type="text"
                                id="country_field"
                                className="form-control"
                                name='country'
                                value={country}
                                onChange={onChange}
                                aria-label="Country"
                            />
                        </div>

                       {/* Avatar */}
                        <div className="form-group mb-4">
                            <label htmlFor="avatar_upload">Avatar</label>
                            <div className="d-flex align-items-center mt-2">
                                <figure className="avatar mr-3">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        style={{
                                            objectFit: 'cover',
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%', 
                                        }}
                                    />
                                </figure>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        name="avatar"
                                        className="custom-file-input"
                                        id="customFile"
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                    <label className="custom-file-label" htmlFor="customFile">
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>


                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block btn-primary py-2"
                        >
                            {loading ? 'Registering...' : 'REGISTER'}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );


    
};

export default Register;
