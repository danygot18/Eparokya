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
        ministryCategory: [],
    });
    const [ministryCategories, setMinistryCategories] = useState([]);
    const [selectedMinistryCategories, setSelectedMinistryCategories] = useState([]);
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
                const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`);
                console.log("Fetched Ministry Categories:", data); // Log full response to verify
                if (data.success && data.categories) {
                    setMinistryCategories(data.categories); // Set categories if successful
                } else {
                    console.error('Categories not found in response:', data);
                }
            } catch (err) {
                console.error('Failed to fetch ministry categories:', err);
                setMinistryCategories([]); // Default to empty array if error occurs
            }
        };

        fetchMinistryCategories();
    }, [error, isAuthenticated, navigate, dispatch]);


    const submitHandler = (e) => {
        e.preventDefault();
        if (loading) return;

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
        if (avatar) {
            formData.set('avatar', avatar);
        }

        // Append only the selected ministry categories
        user.ministryCategory.forEach((categoryId) => {
            formData.append('ministryCategory', categoryId);
        });

        // Log form data entries for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

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
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            if (files.length > 0) {
                const file = files[0];
                const reader = new FileReader();

                reader.onloadend = () => {
                    setAvatar(reader.result);
                    setAvatarPreview(reader.result);
                };

                reader.readAsDataURL(file);
            }
        } else if (name === 'ministryCategory') {
            setUser((prevState) => {
                const updatedCategories = checked
                    ? [...prevState.ministryCategory, value] // Add value (category._id)
                    : prevState.ministryCategory.filter(id => id !== value); // Remove value (category._id)

                return { ...prevState, ministryCategory: updatedCategories };
            });
        } else {
            setUser((prevState) => ({
                ...prevState,
                [name]: value,
            }));
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

                       


                        <div className="form-group mb-3">
                            <label className="mb-2">Ministry Category</label>
                            <div>
                                {ministryCategories && ministryCategories.length > 0 ? (
                                    ministryCategories.map((category) => (
                                        <div key={category._id} className="form-check">
                                            <input
                                                type="checkbox"
                                                id={`category_${category._id}`}
                                                className="form-check-input"
                                                name="ministryCategory"
                                                value={category._id}
                                                checked={user.ministryCategory?.includes(category._id)}
                                                onChange={onChange}
                                                style={{ width: 'auto', marginRight: '5px' }} // Adjust checkbox size
                                            />
                                            <label htmlFor={`category_${category._id}`} className="form-check-label">
                                                {category.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p>No ministry categories available</p>
                                )}
                            </div>
                        </div>



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
                            <label htmlFor="city_field">District (Format:District No.)</label>
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
