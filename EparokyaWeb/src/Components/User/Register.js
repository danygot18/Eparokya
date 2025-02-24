import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearErrors } from '../../Redux/actions/userActions';
import axios from 'axios';
import { 
    Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel, Avatar, CircularProgress 
} from '@mui/material';
import Metadata from '../Layout/MetaData';

const Register = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);
    const navigate = useNavigate();

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
        ministryCategory: []
    });
    const [ministryCategories, setMinistryCategories] = useState([]);
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');

    useEffect(() => {
        if (isAuthenticated) navigate('/');
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }

        const fetchMinistryCategories = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`);
                if (data.success && data.categories) {
                    setMinistryCategories(data.categories);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchMinistryCategories();
    }, [error, isAuthenticated, navigate, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (loading) return;

        const formData = new FormData();
        Object.entries(user).forEach(([key, value]) => {
            if (key === 'ministryCategory') {
                value.forEach(categoryId => formData.append('ministryCategory', categoryId));
            } else {
                formData.set(key, value);
            }
        });
        if (avatar) formData.set('avatar', avatar);

        dispatch(register(formData));
    };

    const onChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file' && files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        } else if (name === 'ministryCategory') {
            setUser(prev => ({
                ...prev,
                ministryCategory: checked 
                    ? [...prev.ministryCategory, value] 
                    : prev.ministryCategory.filter(id => id !== value)
            }));
        } else {
            setUser(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <Container maxWidth="md">
            <Metadata title={'Register User'} />
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <Typography variant="h4" gutterBottom>Register</Typography>
                <Avatar src={avatarPreview} sx={{ width: 100, height: 100, mb: 2 }} />
                <form onSubmit={submitHandler} style={{ width: '100%' }}>
                    <TextField label="Name" name="name" fullWidth margin="normal" value={user.name} onChange={onChange} required />
                    <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={user.email} onChange={onChange} required />
                    <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={user.password} onChange={onChange} required />
                    <TextField label="Age" name="age" type="number" fullWidth margin="normal" value={user.age} onChange={onChange} />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Preference</InputLabel>
                        <Select name="preference" value={user.preference} onChange={onChange}>
                            <MenuItem value="">Select Preference</MenuItem>
                            <MenuItem value="He">He</MenuItem>
                            <MenuItem value="She">She</MenuItem>
                            <MenuItem value="They/Them">They/Them</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="Phone" name="phone" fullWidth margin="normal" value={user.phone} onChange={onChange} />
                    <TextField label="Barangay" name="barangay" fullWidth margin="normal" value={user.barangay} onChange={onChange} />
                    <TextField label="Zip" name="zip" fullWidth margin="normal" value={user.zip} onChange={onChange} />
                    <TextField label="City" name="city" fullWidth margin="normal" value={user.city} onChange={onChange} />
                    <TextField label="Country" name="country" fullWidth margin="normal" value={user.country} onChange={onChange} />
                    <FormGroup>
                        <Typography variant="subtitle1">Ministry Categories</Typography>
                        {ministryCategories.map(category => (
                            <FormControlLabel 
                                key={category._id} 
                                control={<Checkbox name="ministryCategory" value={category._id} checked={user.ministryCategory.includes(category._id)} onChange={onChange} />} 
                                label={category.name} 
                            />
                        ))}
                    </FormGroup>
                    <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                        Upload Avatar
                        <input type="file" name="avatar" hidden onChange={onChange} accept="image/*" />
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
